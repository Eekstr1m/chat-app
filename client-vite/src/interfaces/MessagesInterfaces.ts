export interface MessageI {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  contentType: string;
  isRead: boolean;
  repliedTo?: {
    _id: string;
    message: string;
    contentType: string;
    senderId: string;
    createdAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnreadCountI {
  [key: string]: number;
}

export interface PaginatedMessagesResponse {
  messages: MessageI[];
  total: number;
  hasMore: boolean;
  skip: number;
  limit: number;
}
