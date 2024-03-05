import { DataType, Model, Table, Column, HasMany, ForeignKey } from "sequelize-typescript";
import { User } from "src/user/models/user.model";
import { ChatRoom } from "./chat.room.model";

interface MessageCreationModel {
  userId: number;
  chatRoomId: string;
  text: string;
}

@Table({tableName: 'messages'})
export class Message extends Model<Message, MessageCreationModel> {
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;
  @Column({type: DataType.STRING, allowNull: false})
  text: string;
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;
  @ForeignKey(() => ChatRoom)
  @Column({type: DataType.STRING, allowNull: false})
  chatRoomId: string;
}