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
  sender: string;
  recipient: string;
  content: string;
  type: string;
}
