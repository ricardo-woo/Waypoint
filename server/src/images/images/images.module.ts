import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { ImagesService } from './images.service';

@Module({
  imports: [HttpModule, ConfigModule],

  providers: [ImagesService],

  exports: [ImagesService],
})
export class ImagesModule {}
