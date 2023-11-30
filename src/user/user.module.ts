import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from './models/user.model';
import { AuthModule } from 'src/auth/auth.module';
import { ChatRoom } from 'src/chat/model/chat.room.model';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, ChatRoom]),
    forwardRef(() => ChatModule),
    forwardRef(() => AuthModule)
  ],
  exports: [
    UserService
  ]
})

export class UserModule {}