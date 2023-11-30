import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user/models/user.model";
import { AuthModule } from "./auth/auth.module";
import { GoogleDriveModule } from "./google-drive/google.module";
import { ProfileModule } from "./profile/profile.module";
import { ChatModule } from "./chat/chat.module";
import { Message } from "./chat/model/message.model";
import { ChatRoom } from "./chat/model/chat.room.model";
import { ChatRoomUser } from "./chat/model/chat.room.users";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            models: [
                User,
                ChatRoom,
                ChatRoomUser,
                Message
            ],
            autoLoadModels: true
        }),
        GoogleDriveModule.register({
            clientId: '593131673474-b5lnt6kfvhvb3758n88ncfkm1pb79gv7.apps.googleusercontent.com',
            clientSecret: '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',
            redirectUrl: 'https://developers.google.com/oauthplayground',
            refreshToken: '1//0408XWH79EkOcCgYIARAAGAQSNwF-L9IrjrrWQj8yCM1bkCBAkG6bgUZ_ttP7QYgpiwevRWim1alRGjfFkP7odO13T0XYznPf84Q',
        }),
        UserModule,
        AuthModule,
        ProfileModule,
        ChatModule
    ],
    controllers: [],
    providers: [ChatModule]
})

export class AppModule {}