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
import { ProfileDto, SearchProfileDto } from './dto/profile.dto';
import { FriendDto } from './dto/friend.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Friends) private friendsRepository: typeof Friends,
    @InjectModel(ChatRoom) private chatRoomRepository: typeof ChatRoom,
    @InjectModel(ChatRoomUser) private chatRoomUserRepository: typeof ChatRoomUser,
    private userService: UserService
  ) {}
  async getProfile(
    userId: number
  ): Promise<ProfileDto> {
    try {
      const user = await this.userService.getById(userId);
      return {
        usertag: user.usertag,
        username: user.username
      } as ProfileDto
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async getFriends(
    userId: number
  ): Promise<FriendDto[]> {
    try {
      const rawFriends = await this.friendsRepository.findAll({
        where: { 
          [Op.or]: [{userId: userId}, {friendId: userId}],
          status: 1 
        }
      });
      const friends: FriendDto[] = [];
      await Promise.all(
        rawFriends.map(async (item) => {
          let friend: any;
          if(userId === item.userId) friend = await this.userService.getById(item.friendId);
          if(userId === item.friendId) friend = await this.userService.getById(item.userId);
          const roomsId = await this.chatRoomUserRepository.findAll({
            where: {
              userId: [userId, friend.id]
            },
          })
          let roomId: string = "";
          roomsId.map((item) => {
            if(roomId === item.chatRoomId) {
              return roomId;
            }
            if(item.userId === friend.id) {
              roomId = item.chatRoomId
            }
          })
          console.log(roomId)
          friends.push({
            friendId: friend.id,
            username: friend.username,
            usertag: friend.usertag,
            roomId: roomId
          })
        })
      )
      return friends;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async addFriend(
    friendRequester: number, 
    friendUsertag: string
  ): Promise<string> {
    try {
      console.log(friendUsertag);
      const user = await this.userService.getByUsertag(friendUsertag);
      if(!user) throw new Error("User with that usertag doesnt exist");
      const exist = await this.friendsRepository.findOne({where: {userId: friendRequester, friendId: user.id}});
      if(exist) throw new Error("User already invited to friends");
      await this.friendsRepository.create({
        userId: friendRequester,
        friendId: user.id,
        status: 0
      });
      return "User succesfully invited"
    } catch(e) {
      throw new Error(e.message);
    }
  }
  
  async searchProfileByUsertag(
    usertag: string
  ): Promise<SearchProfileDto> {
    try {
      const user = await this.userService.getByUsertag(usertag);
      if(!user) throw new Error("User with that usertag doesnt exist");
      const userProfile: SearchProfileDto = {
        username: user.username,
        usertag: user.usertag
      }
      return userProfile;
    } catch(e) {
      throw new Error(e.message);
    }
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
  private generateUUID(): string {
    return uuidv4();
  }
}