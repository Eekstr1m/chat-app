export interface MessageI {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  contentType: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnreadCountI {
  [key: string]: number;
}
