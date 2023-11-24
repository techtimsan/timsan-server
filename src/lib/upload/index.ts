import { v2 as cloudUpload } from "cloudinary"
import { FileUploadFormat } from "../../types/app";
import {
  CLOUDINARY_CLOUD_NAME,
CLOUDINARY_API_KEY,
CLOUNDINAR_SECRET_KEY,
} from "../constants"


cloudUpload.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUNDINAR_SECRET_KEY
  });

  async function uploadToCloudinary(file: FileUploadFormat, folderName: string, userId: string): Promise<string> {
    try {
      const uploadedImage = await cloudUpload.uploader.upload(file.path, {
        public_id: `${folderName}-${userId}`, folder: folderName
      });
      return uploadedImage.secure_url;
    } catch (error) {
      throw new Error('Error uploading file to Cloudinary');
    }
  }
  
  export {cloudUpload, uploadToCloudinary };