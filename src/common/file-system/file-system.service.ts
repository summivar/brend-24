import { BadRequestException, Injectable } from '@nestjs/common';
import { EXCEPTION_MESSAGE, PATH } from '../../constants';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class FileSystemService {
  saveFile(file: Express.Multer.File, fixedName?: string): string {
    try {
      if (!fs.existsSync(PATH.UPLOADS_PATH)) {
        fs.mkdirSync(PATH.UPLOADS_PATH, { recursive: true });
      }

      if (file) {
        let fileName: string;
        if (fixedName) {
          const ext = path.extname(file.originalname).toLowerCase();
          fileName = `${fixedName}${ext}`;
        } else {
          fileName = `${uuid()}.${file.originalname}`;
        }
        const filePath = path.join(PATH.UPLOADS_PATH, fileName);

        fs.writeFileSync(filePath, file.buffer);

        return fileName;
      }
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
          throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.SOMETHING_GO_WRONG);
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
