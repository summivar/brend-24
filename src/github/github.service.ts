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
    exec('git pull', (error, stdout, stderr) => {
      if (error) {
        console.error(`Can not pull: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Can not pull: ${stderr}`);
        return;
      }
      console.log(`Pulled: \n${stdout}`);
    });
  }
}
