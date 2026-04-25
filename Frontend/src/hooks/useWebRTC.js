import { useState, useEffect, useRef, useCallback } from 'react';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = (socket, invitationId, userId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const createPeerConnection = useCallback(() => {
    if (peerConnection.current) return peerConnection.current;

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', {
          invitationId,
          type: 'candidate',
          candidate: event.candidate,
          userId,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.current = pc;
    return pc;
  }, [socket, invitationId, userId]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('signal', {
        invitationId,
        type: 'offer',
        offer,
        userId,
      });
    } catch (err) {
      console.error('Error starting call:', err);
    }
  };

  const joinCall = async () => {
    const pc = createPeerConnection();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    } catch (err) {
      console.error('Error joining call:', err);
    }
  };

  const handleSignal = async (data) => {
    const pc = createPeerConnection();

    if (data.type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('signal', {
        invitationId,
        type: 'answer',
        answer,
        userId,
      });
    } else if (data.type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.type === 'candidate') {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
      socket.emit('toggle-media', { invitationId, userId, type: 'audio', enabled: audioTrack.enabled });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
      socket.emit('toggle-media', { invitationId, userId, type: 'video', enabled: videoTrack.enabled });
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(stream);
      setIsScreenSharing(true);

      const videoTrack = stream.getVideoTracks()[0];
      const sender = peerConnection.current.getSenders().find((s) => s.track.kind === 'video');
      sender.replaceTrack(videoTrack);

      videoTrack.onended = () => stopScreenShare();
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);

      const videoTrack = localStream.getVideoTracks()[0];
      const sender = peerConnection.current.getSenders().find((s) => s.track.kind === 'video');
      sender.replaceTrack(videoTrack);
    }
  };

  const endCall = () => {
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (screenStream) screenStream.getTracks().forEach((track) => track.stop());
    if (peerConnection.current) peerConnection.current.close();
    setLocalStream(null);
    setRemoteStream(null);
    setScreenStream(null);
    setIsScreenSharing(false);
    socket.emit('end-session', { invitationId, userId });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('signal', handleSignal);
    socket.on('user-joined', (data) => {
      console.log('Remote user joined:', data.userId);
    });

    return () => {
      socket.off('signal');
      socket.off('user-joined');
    };
  }, [socket, handleSignal]);

  return {
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    startCall,
    joinCall,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    endCall,
  };
};
