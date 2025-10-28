import {
  _Error,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { r2Client } from "../db/r2Client.js";

const bucketName = "profile-pictures";

export async function uploadProfilePicture(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  userIdKeyPrefix: string
) {
  // Get all objects that starts with userIdKeyPrefix
  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: userIdKeyPrefix,
  });
  const listResponse = await r2Client.send(listCommand);

  // If found — delete them
  if (listResponse.Contents && listResponse.Contents.length > 0) {
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: listResponse.Contents.map((obj) => ({ Key: obj.Key })),
      },
    });
    await r2Client.send(deleteCommand);
  }

  // Upload new avatar
  const putAvatarCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  });
  await r2Client.send(putAvatarCommand);

  // Returning public url
  const devUrl = process.env.R2_DEV_ENDPOINT + "/" + fileName;

  // Return the public URL (if bucket is public)
  // return `${process.env.R2_ENDPOINT}/${bucketName}/${fileName}`;
  return devUrl;
}
