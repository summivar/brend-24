import { Injectable } from '@nestjs/common';
import { PATH } from '../../constants';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class FileSystemService {
  saveFile(file: Express.Multer.File): string {
    try {
      if (!fs.existsSync(PATH.UPLOADS_PATH)) {
        fs.mkdirSync(PATH.UPLOADS_PATH, { recursive: true });
      }

      const fileName = `${uuid()}.${file.originalname}`;
      const filePath = path.join(PATH.UPLOADS_PATH, fileName);

      fs.writeFileSync(filePath, file.buffer);

      return fileName;
    } catch (e) {
      console.log(e);
      throw `Error while saving image: ${e}`;
    }
  }

  deleteFile(filePath: string): boolean {
    try {
      const realFilePath = path.join(PATH.UPLOADS_PATH, filePath);
      fs.unlink(realFilePath, (err) => {
        if (err) {
          throw err;
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}