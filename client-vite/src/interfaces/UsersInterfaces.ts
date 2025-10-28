export interface UserI {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatar: string;
  followedParticipants: Array<string>;
  lastOnline: Date;
  createdAt: Date;
  updatedAt: Date;
}
