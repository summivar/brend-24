import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { PrivacyModule } from './privacy/privacy.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AgreementModule } from './agreement/agreement.module';
import { ContactsModule } from './contacts/contacts.module';
import { AboutModule } from './about/about.module';
import { ParticipantModule } from './participant/participant.module';
import { PhotoModule } from './photo/photo.module';
import { VideoModule } from './video/video.module';
import { NewsModule } from './news/news.module';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.URL'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      exclude: ['/api/(.*)'],
      serveRoot: '/uploads',
    }),
    CommonModule,
    PrivacyModule,
    AgreementModule,
    ContactsModule,
    AboutModule,
    ParticipantModule,
    PhotoModule,
    VideoModule,
    NewsModule,
    EventModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {
}
