import { NotFoundException, HttpStatus, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Friends } from './model/friend.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {

    constructor(
        @InjectModel(Friends) private friendsRepository: typeof Friends,
        private userService: UserService
    ) {}

    async addFriend(friendRequester: number, friendUsertag: string) {
        const user = await this.userService.getByUsertag(friendUsertag);
        if(!user) throw new NotFoundException("User with that usertag doesnt exist");
        await this.friendsRepository.create({
            userId: friendRequester,
            friendId: user.id,
            status: 0
        });
        return 'Success'
    }

    async acceptFriendRequest(requestId: number, acceptorId: number) {
        const friendRecord = await this.friendsRepository.findOne({where: {id: requestId, friendId: acceptorId}});
        friendRecord.status = 1;
        await friendRecord.save();
    }

    async rejectFriendRequest(requestId: number, rejectorid: number) {
        const friendRecord = await this.friendsRepository.findOne({where: {id: requestId, friendId: rejectorid}});
        friendRecord.status = 2;
        await friendRecord.save();
    }

    private generateUUID(): string {
        return uuidv4();
    }
}