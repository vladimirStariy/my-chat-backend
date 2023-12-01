import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Friends } from './model/friend.model';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    SequelizeModule.forFeature([Friends]),
  ],
  exports: [
    ProfileService
  ]
})

export class ProfileModule {}