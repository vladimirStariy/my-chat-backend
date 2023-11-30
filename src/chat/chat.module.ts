import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './model/message.model';
import { ChatRoom } from './model/chat.room.model';
import { User } from 'src/user/models/user.model';
import { ChatRoomUser } from './model/chat.room.users';

@Module({
    imports: [
      forwardRef(() => UserModule),
      forwardRef(() => AuthModule),
      SequelizeModule.forFeature([Message, ChatRoom, User, ChatRoomUser]),
    ],
    controllers: [],
    providers: [ChatGateway, ChatService],
})

export class ChatModule {}