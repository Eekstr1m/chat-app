import { UserResponseI, UserSchemaModelI } from "../interfaces/UserInterfaces";

const generateUserResponse = (user: UserSchemaModelI): UserResponseI => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export default generateUserResponse;
