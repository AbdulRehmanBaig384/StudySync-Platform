import { useState, useEffect, useRef, useCallback } from 'react';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = (socket, sessionId, userId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({}); // userId -> MediaStream
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const peerConnections = useRef({}); // userId -> RTCPeerConnection
  const localVideoRef = useRef(null);
  const screenStream = useRef(null);

  const createPeerConnection = useCallback((remoteUserId) => {
    if (peerConnections.current[remoteUserId]) return peerConnections.current[remoteUserId];

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('session_signal', {
          sessionId,
          type: 'candidate',
          candidate: event.candidate,
          fromUserId: userId,
          toUserId: remoteUserId
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [remoteUserId]: event.streams[0]
      }));
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
        removePeer(remoteUserId);
      }
    };

    peerConnections.current[remoteUserId] = pc;
    return pc;
  }, [socket, sessionId, userId]);

  const removePeer = (remoteUserId) => {
    if (peerConnections.current[remoteUserId]) {
      peerConnections.current[remoteUserId].close();
      delete peerConnections.current[remoteUserId];
    }
    setRemoteStreams(prev => {
      const next = { ...prev };
      delete next[remoteUserId];
      return next;
    });
  };

  const initLocalStream = async () => {
    if (localStream) return localStream;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      console.error('Error getting local stream:', err);
      return null;
    }
  };

  const startCallWithUser = async (remoteUserId) => {
    const stream = await initLocalStream();
    if (!stream) return;

    const pc = createPeerConnection(remoteUserId);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit('session_signal', {
      sessionId,
      type: 'offer',
      offer,
      fromUserId: userId,
      toUserId: remoteUserId
    });
  };

  const handleSignal = async (data) => {
    const { type, offer, answer, candidate, fromUserId, toUserId } = data;
    
    // Only handle if it's meant for us
    if (toUserId !== userId) return;

    const pc = createPeerConnection(fromUserId);

    if (type === 'offer') {
      const stream = await initLocalStream();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answerDesc = await pc.createAnswer();
      await pc.setLocalDescription(answerDesc);
      
      socket.emit('session_signal', {
        sessionId,
        type: 'answer',
        answer: answerDesc,
        fromUserId: userId,
        toUserId: fromUserId
      });
    } else if (type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } else if (type === 'candidate') {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
      socket.emit('session_toggle_media', { sessionId, userId, type: 'audio', enabled: audioTrack.enabled });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
      socket.emit('session_toggle_media', { sessionId, userId, type: 'video', enabled: videoTrack.enabled });
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStream.current = stream;
      setIsScreenSharing(true);

      const videoTrack = stream.getVideoTracks()[0];
      
      // Replace track for all active peers
      Object.values(peerConnections.current).forEach(pc => {
        const sender = pc.getSenders().find((s) => s.track.kind === 'video');
        if (sender) sender.replaceTrack(videoTrack);
      });

      videoTrack.onended = () => stopScreenShare();
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  const stopScreenShare = () => {
    if (screenStream.current) {
      screenStream.current.getTracks().forEach((track) => track.stop());
      screenStream.current = null;
      setIsScreenSharing(false);

      const videoTrack = localStream.getVideoTracks()[0];
      Object.values(peerConnections.current).forEach(pc => {
        const sender = pc.getSenders().find((s) => s.track.kind === 'video');
        if (sender) sender.replaceTrack(videoTrack);
      });
    }
  };

  const endCall = () => {
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (screenStream.current) screenStream.current.getTracks().forEach((track) => track.stop());
    
    Object.keys(peerConnections.current).forEach(id => removePeer(id));
    
    setLocalStream(null);
    setRemoteStreams({});
    setIsScreenSharing(false);
    
    socket.emit('leave_study_session', { sessionId, userId });
  };

  useEffect(() => {
    if (!socket || !sessionId) return;

    socket.on('session_signal', handleSignal);
    
    socket.on('participant_joined', (data) => {
      console.log('Participant joined room:', data.userId);
      // Existing users initiate call to the new user
      startCallWithUser(data.userId);
    });

    socket.on('participant_left', (data) => {
      console.log('Participant left room:', data.userId);
      removePeer(data.userId);
    });

    return () => {
      socket.off('session_signal');
      socket.off('participant_joined');
      socket.off('participant_left');
    };
  }, [socket, sessionId, handleSignal]);

  return {
    localStream,
    remoteStreams,
    localVideoRef,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    initLocalStream,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    endCall,
  };
};
