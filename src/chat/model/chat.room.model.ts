import { DataType, Model, Table, Column, HasMany, BelongsToMany } from "sequelize-typescript";
import { User } from "src/user/models/user.model";
import { ChatRoomUser } from "./chat.room.users";

interface ChatRoomCreationModel {

}

@Table({tableName: 'chat-rooms'})
export class ChatRoom extends Model<ChatRoom, ChatRoomCreationModel> {
    @Column({type: DataType.STRING, unique: true, primaryKey: true})
    id: string;

    @HasMany(() => ChatRoomUser)
    users: ChatRoomUser[]
}