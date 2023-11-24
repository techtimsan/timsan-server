import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const multerConfig: multer.DiskStorageOptions = {
  filename: (req, file, callback) => {
    const ext = file.mimetype.split('/')[1];
    callback(null, `timsanimg-${Date.now()}.${ext}`);
  },
};

const isImage = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new Error('Only Image'));
  }
};

const upload = multer({
  storage: multer.diskStorage(multerConfig),
  limits: { fileSize: 1000000 },
  fileFilter: isImage,
});

const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  const uploadMiddleware = upload.single('image');
  uploadMiddleware(req, res, (err: any) => {
    if (err) {
      res.status(400).send({ error: 'File upload failed', message: err.message });
    } else {
      next();
    }
  });
};



export { uploadImage };
