'use client'

import { useWebSocket } from '@/contexts/WebSocketContext';
import { Friend, MessageMap, RecievedMessageData, Room } from '@/types/User';
import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';

interface FriendChatComponentProps {
  recipient: Friend | Room;
  messages: MessageMap | null;
}

export default function FriendChatComponent({ recipient, messages }: FriendChatComponentProps) {
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
  }, [messages, recipient]);

  // Function to send a message
  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const messageUrl = 'role' in recipient ? '/app/send-room-messages' : '/app/send-private-messages';
    if (stompClient && stompClient.connected && newMessage.trim() !== '') {
      let messagePayload: SendMessageRequest = {
        id: recipient.id,
        content: newMessage,
        type: "TEXT",
      };

      stompClient.publish({
        destination: messageUrl,
        body: JSON.stringify(messagePayload),
      });

      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full max-w-full min-w-0">
      {/* Message List */}
      <div ref={messageListRef} className="message-list flex-1 overflow-y-auto p-3 min-h-0 max-w-full min-w-0">
        {messages && recipient && messages[recipient.id] &&
          <MessageList messages={messages[recipient.id]} />
        }
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className={`flex flex-row ${recipient ? '' : 'opacity-50 cursor-not-allowed'} mr-10 ml-10 mb-2 mt-2 focus-within:ring-2 focus-within:ring-highlight-high bg-overlay rounded-lg`}>
        <input
          type="text"
          className="flex-3/4 p-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-lg h-full"
          disabled={!recipient}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={recipient ? "Type a message..." : "Select a recipient to start chatting"}
        />
        <button type="submit"
          className="flex-1/4 h-full rounded-lg text-sm bg-highlight-low text-text hover:bg-highlight-high disabled:opcity-50 disabled:cursor-not-allowed disabled:hover:bg-highlight-low transition-colors"
          disabled={!recipient || !newMessage.trim()}
        >Send</button>
      </form>
    </div>
  );
};
