import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { About, AboutSchema } from './schemas';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: About.name,
        schema: AboutSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [AboutService],
  controllers: [AboutController],
})
export class AboutModule {
}
