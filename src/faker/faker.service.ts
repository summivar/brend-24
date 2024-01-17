import { BadRequestException, Injectable } from '@nestjs/common';
import { EventService } from '../event/event.service';
import { EXCEPTION_MESSAGE } from '../constants';
import { fakerRU as faker } from '@faker-js/faker';
import { FileSystemService } from '../common/file-system/file-system.service';
import axios from 'axios';
import { NewsService } from '../news/news.service';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class FakerService {
  constructor(
    private fileSystem: FileSystemService,
    private eventService: EventService,
    private newsService: NewsService,
    private participantService: ParticipantService,
  ) {
  }

  async createFakeEvents(fakeCount: number = 10) {
    if (!Number.isInteger(fakeCount) && fakeCount >= 1) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }
    const result = [];
    for (let i = 0; i < fakeCount; i++) {
      const name: string = faker.lorem.sentence();
      const startTime: Date = faker.date.between({from: '2016-01-01T00:00:00.000Z', to: '2025-01-01T00:00:00.000Z'});
      const endTime: Date = faker.date.future({years: 1, refDate: startTime});
      const description: string = faker.lorem.sentences({min: 2, max: 5});
      const event = await this.eventService.create({
        name: name,
        startTime: startTime,
        endTime: endTime,
        description: description
      });
      result.push(event);
    }

    return result;
  }

  async createFakeNews(fakeCount: number = 10) {
    if (!Number.isInteger(fakeCount) && fakeCount >= 1) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }

    const result = [];
    for (let i = 0; i < fakeCount; i++) {
      const name: string = faker.lorem.sentence();
      const slug: string = faker.lorem.words(2);
      const photoCaption: string = faker.lorem.sentence();
      const newsText: string = faker.lorem.text();
      const photoPath: string = await this.generateImage();

      const news = await this.newsService.fakeCreate({
        name: name,
        slug: slug,
        photoCaption: photoCaption,
        newsText: newsText,
        image: undefined
      }, photoPath);
      result.push(news);
    }

    return result;
  }

  private async generateImage(): Promise<string> {
    const response = await axios.get(faker.image.urlLoremFlickr(), {responseType: 'arraybuffer'});
    const buffer = Buffer.from(response.data, 'binary');
    return this.fileSystem.saveFile(undefined, buffer);
  }
}
