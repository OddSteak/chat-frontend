'use client'

import { useWebSocket } from '@/contexts/WebSocketContext';
import { MessageData, User } from '@/types/User';
import React, { useEffect, useRef, useState } from 'react';

type MessageMap = Record<string, MessageData[]>;

interface FriendChatComponentProps {
  recipientUsername: string | null;
  messages: MessageMap | null;
  addMessageToUser: (message: MessageData) => void;
}

export default function FriendChatComponent({ recipientUsername, messages, addMessageToUser }: FriendChatComponentProps) {
  const stompClient = useWebSocket();
  const [newMessage, setNewMessage] = useState('');
  const messageListRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when messages change or recipient changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, recipientUsername]);

  // Effect for subscribing to messages
  useEffect(() => {
    if (stompClient && stompClient.connected) {
      // Subscribe to private messages for this user
      const privateSub = stompClient.subscribe('/user/queue/private-messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        addMessageToUser(receivedMessage);
      });

      // Subscribe to errors
      const errorSub = stompClient.subscribe('/user/queue/errors', (error) => {
        console.error('Received an error from the server:', error.body);
      });

      // Cleanup function to unsubscribe when the component unmounts or client changes
      return () => {
        privateSub.unsubscribe();
        errorSub.unsubscribe();
      };
    }
  }, [stompClient]);

  // Function to send a message
  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(messages);

    if (!recipientUsername) {
      console.error("Recipient username is not set.");
      return;
    }

    if (stompClient && stompClient.connected && newMessage.trim() !== '') {
      console.log("sending to", recipientUsername + ": " + newMessage);

      const messagePayload = {
        recipientName: recipientUsername,
        content: newMessage,
      };

      stompClient.publish({
        destination: '/app/send-private-messages',
        body: JSON.stringify(messagePayload),
      });

      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div ref={messageListRef} className="message-list flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {messages && recipientUsername && messages[recipientUsername] && messages[recipientUsername].map((msg) => (
          <div key={msg.timestamp}>{msg.senderName}: {msg.content}</div>
        ))}
      </div>
      <form onSubmit={sendMessage} className={`flex flex-row ${recipientUsername ? '' : 'opacity-50 cursor-not-allowed'} mr-10 ml-10 mb-2 mt-2 focus-within:ring-2 focus-within:ring-highlight-high bg-overlay rounded-lg`}>
        <input
          type="text"
          className="flex-3/4 p-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-lg h-full"
          disabled={!recipientUsername}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={recipientUsername ? "Type a message..." : "Select a friend to start chatting"}
        />
        <button type="submit"
          className="flex-1/4 h-full rounded-lg text-sm bg-highlight-low text-text hover:bg-highlight-high disabled:opcity-50 disabled:cursor-not-allowed disabled:hover:bg-highlight-low transition-colors"
          disabled={!recipientUsername || !newMessage.trim()}
        >Send</button>
      </form>
    </div>
  );
};
