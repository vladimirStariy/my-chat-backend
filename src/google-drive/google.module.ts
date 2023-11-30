import { DynamicModule, Module } from '@nestjs/common';
import { GOOGLE_DRIVE_CONFIG } from './google.constants';
import { GoogleDriveService } from './google.service';
import { GoogleDriveConfigType } from './types/types';

@Module({})
export class GoogleDriveModule {
  static register(googleDriveConfig: GoogleDriveConfigType): DynamicModule {
    return {
      module: GoogleDriveModule,
      global: true,
      providers: [
        {
          provide: GOOGLE_DRIVE_CONFIG,
          useValue: googleDriveConfig,
        },
        GoogleDriveService,
      ],
      exports: [
        GoogleDriveService, 
        {
          provide: GOOGLE_DRIVE_CONFIG,
          useValue: googleDriveConfig,
        }],
    };
  }
}
