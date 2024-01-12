import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';

@Injectable()
export class GithubService {
  projectDir: string;

  constructor() {
    this.projectDir = path.join(__dirname, '..', '..');
  }

  getPull() {
    exec('dir', (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка выполнения команды: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Ошибка выполнения команды: ${stderr}`);
        return;
      }
      console.log(`Результат выполнения команды:\n${stdout}`);
    });
  }
}
