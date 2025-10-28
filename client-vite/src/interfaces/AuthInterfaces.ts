// Form interfaces
export interface FormInputsI {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// Login and Signup interfaces
export interface LoginDataI {
  userName: string;
  password: string;
}
export interface SignupDataI {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

// Auth interfaces
export interface AuthUserI {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatar: string;
  followedParticipants: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}
