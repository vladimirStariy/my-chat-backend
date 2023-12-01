import { NotFoundException, Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Friends } from './model/friend.model';
import { UserService } from 'src/user/user.service';
import { ChatRoom } from 'src/chat/model/chat.room.model';
import { ChatRoomUser } from 'src/chat/model/chat.room.users';

@Injectable()
export class ProfileService {

    constructor(
        @InjectModel(Friends) private friendsRepository: typeof Friends,
        @InjectModel(ChatRoom) private chatRoomRepository: typeof ChatRoom,
        @InjectModel(ChatRoomUser) private chatRoomUserRepository: typeof ChatRoomUser,
        private userService: UserService
    ) {}

    async addFriend(friendRequester: number, friendUsertag: string) {
        const user = await this.userService.getByUsertag(friendUsertag);
        if(!user) throw new NotFoundException("User with that usertag doesnt exist");
        console.log('here dead')
        const exist = await this.friendsRepository.findOne({where: {userId: friendRequester, friendId: user.id}});
        if(exist) throw new ConflictException({message: "User already invited to friends"})
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
        const room = this.generateUUID();
        const chatRoom = await this.chatRoomRepository.create(room);
        await this.chatRoomUserRepository.bulkCreate([
            { userId: friendRecord.userId, chatRoomId: chatRoom.id },
            { userId: acceptorId, chatRoomId: chatRoom.id }
        ])
        return 'Success'
    }

    async rejectFriendRequest(requestId: number, rejectorid: number) {
        const friendRecord = await this.friendsRepository.findOne({where: {id: requestId, friendId: rejectorid}});
        friendRecord.status = 2;
        await friendRecord.save();
        return 'Success'
    }

    private generateUUID(): string {
        return uuidv4();
    }
}