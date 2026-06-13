import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

  const connectUser = (email) => {
    setUserEmail(email);
  };

  const disconnectUser = () => {
    setUserEmail(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    if (userEmail) {
      const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
        transports: ['websocket'],
        reconnection: true,
      });

      newSocket.on('connect', () => {
        console.log('Global socket connected:', newSocket.id);
        const userId = localStorage.getItem('userId');
        newSocket.emit('user_online', { email: userEmail, userId });
      });

      newSocket.on('status_change', (data) => {
        setOnlineUsers(prev => ({
          ...prev,
          [data.email]: data.status
        }));
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userEmail]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, connectUser, disconnectUser }}>
      {children}
    </SocketContext.Provider>
  );
};
