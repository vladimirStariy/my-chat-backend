import { Inject, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { GOOGLE_DRIVE_CONFIG } from './google.constants';
import { GoogleDriveConfigType } from './types/types';
import { Stream } from 'stream';

@Injectable()
export class GoogleDriveService {
  constructor(@Inject(GOOGLE_DRIVE_CONFIG) private readonly googleDriveConfig: GoogleDriveConfigType) {}

  async uploadFile(file: Express.Multer.File, folderId?: string) {
    try {
      const fileMetadata = {
        name: file.filename,
        parents: [folderId],
      };
      const media = {
        mimeType: file.mimetype,
        body: this.bufferToStream(file),
      };
      const driveService = this.getDriveService();
      const response = await driveService.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id',
      });
      const { id: fileId } = response.data;
      return await this.getFileURL(fileId);
    } catch (err) { throw err }
  }

  async deleteFile(fileId: string) {
    try {
      const drive = this.getDriveService();
      await drive.files.delete({
        fileId,
      });
    } catch (err) { throw err }
  }

  async getFileURL(fileId: string) {
    const drive = this.getDriveService();
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    const result = await drive.files.get({
      fileId,
      fields: 'webContentLink'
    });
    const rawFileUrl = result.data.webContentLink;
    const substr = '&export=download';
    const fileUrl = rawFileUrl.replace(new RegExp(substr, 'g'), '');
    return fileUrl;
  }

  private getAuth() {
    try {
      const { clientId, clientSecret, redirectUrl, refreshToken } =
        this.googleDriveConfig;
      const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
      auth.setCredentials({ refresh_token: refreshToken });
      return auth;
    } catch (err) { throw err }
  }

  private getDriveService = () => {
    const auth = this.getAuth();
    const DRIVE_VERSION = 'v3';
    return google.drive({ version: DRIVE_VERSION, auth });
  };

  private bufferToStream(file: Express.Multer.File) {
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(file.buffer);
    return bufferStream;
  }
}