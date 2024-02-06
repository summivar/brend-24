import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';
import { ValidationPipe } from './pipes';
import { TransformInterceptor } from './interceptors';
import * as cookieParser from 'cookie-parser';
import * as basicAuth from 'express-basic-auth';

async function start() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('api');

  const PORT = configService.get<number>('port', 7777);
  const swaggerTheme = configService.get<string>('swaggerTheme', 'dark');

  const config = new DocumentBuilder()
    .setTitle('API brend-42')
    .setDescription('Документация RESTful API')
    .setVersion('0.0.1')
    .addTag('Viachaslau Lukashonak')
    .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme('v3');
  const options = {
    explorer: true,
    customCss: theme.getBuffer(swaggerTheme as SwaggerThemeName),
  };

  const authMiddleware = basicAuth({
    users: {'root': 'Fl090FZ0mIVIK7Rc'},
    challenge: true,
  });

  app.use('/api/docs', authMiddleware, (req, res, next) => {
    next();
  });

  SwaggerModule.setup('api/docs', app, document, options);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));
  app.enableCors({
    credentials: true,
    origin: true,
  });

  await app.listen(PORT).then(() => {
    console.log(`App started with ${PORT} port`);
  });
}

start();
