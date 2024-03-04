import { NotFoundException, Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Friends } from './model/friend.model';
import { UserService } from 'src/user/user.service';
import { ChatRoom } from 'src/chat/model/chat.room.model';
import { ChatRoomUser } from 'src/chat/model/chat.room.users';
import { GetFriendsRoomsDto } from './dto/room.dto';
import { FriendRequestDto, MyFriendsRequestDto } from './dto/add.friend.dto';
import { Op } from 'sequelize';

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
    const exist = await this.friendsRepository.findOne({where: {userId: friendRequester, friendId: user.id}});
    if(exist) throw new ConflictException({message: "User already invited to friends"})
    await this.friendsRepository.create({
      userId: friendRequester,
      friendId: user.id,
      status: 0
    });
    return 'Success'
  }
  async acceptFriendRequest(usertag: string, acceptorId: number) {
    const friend = await this.userService.getByUsertag(usertag);
    const friendRecord = await this.friendsRepository.findOne({ where: { friendId: acceptorId, userId: friend.id } })
    if(!friendRecord) throw new ConflictException({message: "Invalid request"})
    friendRecord.status = 1;
    await friendRecord.save();
    const room = await this.generateUUID();
    const chatRoom = await this.chatRoomRepository.create({id: room});
    await this.chatRoomUserRepository.bulkCreate([
      { userId: friendRecord.userId, chatRoomId: chatRoom.id },
      { userId: acceptorId, chatRoomId: chatRoom.id }
    ])
    return 'Success'
  }
  async rejectFriendRequest(usertag: string, rejectorid: number) {
    const friend = await this.userService.getByUsertag(usertag);
    const friendRecord = await this.friendsRepository.findOne({ where: {userId: friend.id, friendId: rejectorid } });
    if(!friendRecord) throw new ConflictException({message: "Invalid request"})
    friendRecord.status = 2;
    await friendRecord.save();
    return 'Success'
  }
  async getFriendsRequests(userId: number) {
    const friendsRequests = await this.friendsRepository.findAll({ where: { friendId: userId, status: 0 } })
    const friendsIds = friendsRequests.map((item) => { return item.userId })
    const friendUsers = await this.userService.getUsersRange(friendsIds);
    const friendDto = friendUsers.map((item) => { return { usertag: item.usertag, name: item.username } });
    return friendDto;
  }
  async getFriends(userId: number) {
    const friends = await this.friendsRepository.findAll({ 
      where: {
        [Op.or]: [{userId: userId}, {friendId: userId}], 
        status: 1
      }
    });
    let userIds = friends.map((item) => { if(item.friendId === userId) { return item.userId } else return item.friendId });
    const friendsUsers = await this.userService.getUsersRange(userIds);
    const chatUserRooms = await this.chatRoomUserRepository.findAll({ where: { userId: userId } });
    const chatRoomsIds = chatUserRooms.map((item) => { return item.chatRoomId})
    const chatRooms = await this.chatRoomRepository.findAll({ where: { id: chatRoomsIds }, include: { model: ChatRoomUser } });
    chatRooms.map((chatRoom) => {
      chatRoom.users.map((chatRoomUser) => {     
      })
    })
  }
  private generateUUID(): string {
    return uuidv4();
  }
}