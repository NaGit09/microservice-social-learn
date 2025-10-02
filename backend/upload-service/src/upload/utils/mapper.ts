import { UploadDto } from '../dto/response/upload.response';
import { Upload } from '../entities/upload.entity';

export const mapperUploadToDto = (
  uploadid: string,
  upload: Upload,
): UploadDto => {
  return {
    fileId: uploadid,
    url: upload.url,
    type: upload.type,
    fileName: upload.originalName,
  };
};
//
export const mapperDtoToEntity = (
  file: Express.Multer.File,
  userId: string,
  urlData: string,
  storeName: string,
): Upload => {
  return {
    originalName: file.originalname,
    storedName: storeName,
    userId,
    size: file.size,
    type: file.mimetype,
    url: urlData,
  };
};
