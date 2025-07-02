export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Friend {
  id: number;
  username: string;
  email: string;
  status: 'ONLINE' | 'OFFLINE';
}

export interface RequestData {
  id: number;
  username: string;
}

export interface MessageData {
  senderName: string;
  recipientName: string;
  content: string;
  timestamp: string;
}
