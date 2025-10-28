import multer from "multer";

const storage = multer.memoryStorage();
export const avatarUpload = multer({ storage });
