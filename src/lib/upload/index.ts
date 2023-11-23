import { v2 as cloudinary } from "cloudinary"
import { FileUploadFormat } from "../../types/app";


cloudinary.config({ 
    cloud_name: "drcsdfkjr", 
    api_key: "365776684397868", 
    api_secret: 'mR9etvE4CBw16p-Yw0nBDd1VLqY',
    secure: true
  });

  async function uploadToCloudinary(file: FileUploadFormat, folderName: string): Promise<string> {
    try {
      const uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });
      return uploadedImage.secure_url;
    } catch (error) {
      throw new Error('Error uploading file to Cloudinary');
    }
  }
  
  export {uploadToCloudinary, cloudinary as cloudUpload};