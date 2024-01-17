import { Module } from '@nestjs/common';
import { join } from 'path';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonModule } from './common/common.module';
import { PrivacyModule } from './privacy/privacy.module';
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
import { GithubModule } from './github/github.module';
import { PartnerModule } from './partner/partner.module';
import { DistrictModule } from './district/district.module';
import { CoversModule } from './covers/covers.module';

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
    PhotoModule,
    VideoModule,
    NewsModule,
    EventModule,
    AuthModule,
    UsersModule,
    GithubModule,
    PartnerModule,
    DistrictModule,
    ParticipantModule,
    CoversModule,
  ],
})
export class AppModule {
}
