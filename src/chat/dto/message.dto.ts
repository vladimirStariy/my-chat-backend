export interface IMessageDto {
  id: number;
  text: string;
  userId: number;
  chatRoomId: string;
}
export interface IMessages {
  id: number;
  text: string;
  userId: number;
  usertag: string;
  messageDate: Date;
}