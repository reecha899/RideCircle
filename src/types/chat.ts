export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatConversation {
  userId: string;
  userName: string;
  messages: Message[];
  lastActivity: Date;
}
