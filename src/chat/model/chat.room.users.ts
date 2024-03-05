import { DataType, Model, Table, Column, HasMany, ForeignKey } from "sequelize-typescript";
import { User } from "src/user/models/user.model";
import { ChatRoom } from "./chat.room.model";

interface ChatRoomUsersCreationModel {
  userId: number;
  chatRoomId: string;
}
@Table({tableName: 'chat-room-users'})
export class ChatRoomUser extends Model<ChatRoomUser, ChatRoomUsersCreationModel> {
  @Column({type: DataType.INTEGER, autoIncrement: true, unique: true, primaryKey: true})
  id: number;
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;
  @ForeignKey(() => ChatRoom)
  @Column({type: DataType.STRING, allowNull: false})
  chatRoomId: string;
}