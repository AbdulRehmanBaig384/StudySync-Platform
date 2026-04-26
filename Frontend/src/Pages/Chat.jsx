import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useSocket } from '../context/SocketContext';
import {   FiSend, 
  FiSmile, 
  FiPaperclip, 
  FiMoreVertical, 
  FiSearch, 
  FiCheckCircle, 
  FiMessageSquare,
  FiVideo,
  FiMonitor,
  FiCheck,
} from 'react-icons/fi';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]); // This will now store accepted invitations
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (userId) fetchChats();
  }, [userId]);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.on('receive_message', (message) => {
      if (selectedChat && message.invitationId === selectedChat._id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        markAsSeen(selectedChat._id);
      } else {
        fetchChats();
      }
    });

    socket.on('invitation_accepted', (invitation) => {
      if (invitation.sender._id === userId || invitation.receiver._id === userId) {
        setChats(prev => {
          const exists = prev.find(c => c._id === invitation._id);
          if (exists) return prev;
          return [invitation, ...prev];
        });
      }
    });

    socket.on('user_typing', (data) => {
      if (selectedChat && data.invitationId === selectedChat._id && data.userId !== userId) {
        setPartnerTyping(true);
      }
    });

    socket.on('user_stop_typing', (data) => {
      if (selectedChat && data.invitationId === selectedChat._id && data.userId !== userId) {
        setPartnerTyping(false);
      }
    });

    socket.on('messages_marked_seen', (data) => {
      if (selectedChat && data.invitationId === selectedChat._id) {
        setMessages(prev => prev.map(msg => ({ ...msg, seen: true })));
      }
    });

    socket.on('status_change', (data) => {
      setChats(prev => prev.map(chat => {
        const partner = getPartner(chat);
        if (partner && partner.email === data.email) {
          if (chat.sender.email === data.email) chat.sender.onlineStatus = data.status;
          if (chat.receiver.email === data.email) chat.receiver.onlineStatus = data.status;
        }
        return { ...chat };
      }));
    });

    return () => {
      socket.off('receive_message');
      socket.off('invitation_accepted');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('messages_marked_seen');
      socket.off('status_change');
    };
  }, [selectedChat, socket, userId]);

  useEffect(() => {
    if (selectedChat && socket) {
      fetchMessages(selectedChat._id);
      socket.emit('join_chat', selectedChat._id);
      markAsSeen(selectedChat._id);
    }
  }, [selectedChat, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/chat/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setChats(data);
        
        // If we came from PartnerConnections, select that chat/invitation
        if (location.state?.selectedPartner && !selectedChat) {
          const partnerChat = data.find(chat => 
            chat.sender._id === location.state.selectedPartner._id || 
            chat.receiver._id === location.state.selectedPartner._id
          );
          if (partnerChat) setSelectedChat(partnerChat);
        }
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (invitationId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/chat/messages/${invitationId}`);
      const data = await res.json();
      if (res.ok) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markAsSeen = async (invitationId) => {
    try {
      await fetch(`http://localhost:3000/api/chat/seen/${invitationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      socket.emit('message_seen', { invitationId, userId });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const messageData = {
      invitationId: selectedChat._id,
      senderId: userId,
      text: newMessage,
    };

    try {
      const res = await fetch(`http://localhost:3000/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      const savedMessage = await res.json();
      
      if (res.ok) {
        socket.emit('send_message', savedMessage);
        setMessages(prev => [...prev, savedMessage]);
        setNewMessage('');
        scrollToBottom();
        
        // Update last message in sidebar locally
        setChats(prev => prev.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, lastMessage: savedMessage, updatedAt: new Date().toISOString() } 
            : chat
        ).sort((a, b) => {
           const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.updatedAt);
           const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.updatedAt);
           return timeB - timeA;
        }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { invitationId: selectedChat._id, userId });
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop_typing', { invitationId: selectedChat._id, userId });
        setTyping(false);
      }
    }, timerLength);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getPartner = (chat) => {
    if (!chat) return null;
    const sId = chat.sender._id.toString();
    return sId === userId.toString() ? chat.receiver : chat.sender;
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-180px)] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10 bg-white/[0.02]">
            <h2 className="text-xl font-black text-white mb-4">Messages</h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-50">
                <FiMessageSquare className="text-4xl mb-2 text-indigo-400" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No messages yet</p>
              </div>
            ) : (
              chats.map(chat => {
                const partner = getPartner(chat);
                const isSelected = selectedChat?._id === chat._id;
                return (
                  <div 
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${isSelected ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/[0.05] border border-transparent'}`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/10">
                        {partner?.profilePicture ? (
                          <img src={partner.profilePicture} alt="" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          partner?.Firstname?.[0]
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#161b2c] ${partner?.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h3 className="text-sm font-black text-white truncate">{partner?.Firstname} {partner?.lastname}</h3>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                          {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate font-medium ${chat.unreadCount > 0 ? 'text-white font-black' : 'text-slate-500'}`}>
                          {chat.lastMessage?.text || 'Start a conversation'}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-indigo-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/[0.01]">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/10">
                      {getPartner(selectedChat)?.Firstname?.[0]}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#161b2c] ${getPartner(selectedChat)?.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{getPartner(selectedChat)?.Firstname} {getPartner(selectedChat)?.lastname}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {getPartner(selectedChat)?.onlineStatus === 'online' ? 'Active Now' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <button 
                    onClick={() => navigate('/study-session', { state: { invitationId: selectedChat._id } })}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <FiVideo className="text-sm" /> Start Session
                  </button>
                  <div className="h-4 w-px bg-white/10" />
                  <FiSearch className="cursor-pointer hover:text-white transition-colors" />
                  <FiMoreVertical className="cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] group`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-lg transition-all ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'}`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[9px] text-slate-600 font-bold uppercase">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            msg.seen ? <FiCheckCircle className="text-[10px] text-indigo-400" /> : <FiCheck className="text-[10px] text-slate-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {partnerTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl rounded-tl-none flex items-center gap-1">
                      <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"></span>
                      <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white/[0.02] border-t border-white/10">
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                  <div className="flex items-center gap-2 px-2">
                    <FiPaperclip className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors" />
                    <FiSmile className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type your message..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-600"
                  />
                  <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                    disabled={!newMessage.trim()}
                  >
                    <FiSend />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-400 text-3xl mb-6 border border-indigo-500/10">
                <FiMessageSquare />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Your Conversations</h2>
              <p className="text-slate-500 max-w-sm font-medium">Select a partner from the sidebar to start collaborating and sharing knowledge in real-time.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Chat;
