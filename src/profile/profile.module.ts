import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Friends } from './model/friend.model';
import { ChatRoom } from 'src/chat/model/chat.room.model';
import { ChatRoomUser } from 'src/chat/model/chat.room.users';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    SequelizeModule.forFeature([Friends, ChatRoom, ChatRoomUser]),
  ],
  exports: [
    ProfileService
  ]
})

export class ProfileModule {}