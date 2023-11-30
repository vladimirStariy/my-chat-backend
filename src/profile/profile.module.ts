import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    SequelizeModule.forFeature([]),
  ],
  exports: [
    ProfileService
  ]
})

export class ProfileModule {}