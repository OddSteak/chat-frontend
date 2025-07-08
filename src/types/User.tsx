export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Friend {
  id: number;
  name: string;
  email: string;
  status: 'ONLINE' | 'OFFLINE';
}

export interface Room {
  id: number;
  name: string;
  description: string;
  type: "PUBLIC" | "PRIVATE";
  role: string;
}

export interface RequestData {
  id: number;
  username: string;
}

export interface MessageData {
  id: number;
  senderName: string;
  senderId: number;
  recipientName: string;
  recipientId: number;
  content: string;
  timestamp: Date;
}

export interface RecievedMessageData {
  id: number;
  senderName: string;
  senderId: number;
  recipientName: string;
  recipientId: number;
  content: string;
  timestamp: string;
}

export type MessageMap = Record<number, MessageData[]>;
export type RecievedMessageDataMap = Record<number, RecievedMessageData[]>;

