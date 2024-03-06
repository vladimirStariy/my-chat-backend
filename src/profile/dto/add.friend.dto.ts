export class AddFriendDto {
  usertag: string;
}
export interface AcceptFriendDto {
  usertag: string;
}
export interface FriendRequestDto {
  usertag: string;
  name: string;
}
export interface MyFriendsRequestDto {
  usertag: string;
  name: string;
  room: string;
}