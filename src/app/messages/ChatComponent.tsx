'use client'

import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

const FriendChatComponent = ({ recipientUsername }) => {
  const stompClient = useWebSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Effect for subscribing to messages
  useEffect(() => {
    if (stompClient && stompClient.connected) {
      // Subscribe to private messages for this user
      const privateSub = stompClient.subscribe('/user/queue/private-messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        // Add the new message to your state
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });

      // Subscribe to errors
      const errorSub = stompClient.subscribe('/user/queue/errors', (error) => {
        console.error('Received an error from the server:', error.body);
        // You can show a toast notification here
      });

      // Cleanup function to unsubscribe when the component unmounts or client changes
      return () => {
        privateSub.unsubscribe();
        errorSub.unsubscribe();
      };
    }
  }, [stompClient]); // Rerun this effect if the stompClient instance changes

  // Function to send a message
  const sendMessage = () => {
    if (stompClient && stompClient.connected && newMessage.trim() !== '') {
      const messagePayload = {
        recipientName: recipientUsername,
        content: newMessage,
        // senderName is handled by the backend via Principal
      };

      stompClient.publish({
        destination: '/app/send-private-messages',
        body: JSON.stringify(messagePayload),
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <div className="message-list">
        {messages.map((msg) => (
          <div key={msg.messageId}>{msg.sender.username}: {msg.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
