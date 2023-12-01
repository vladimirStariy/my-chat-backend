import { DataType, Model, Table, Column, HasMany, BelongsToMany } from "sequelize-typescript";
import { ChatRoom } from "src/chat/model/chat.room.model";
import { ChatRoomUser } from "src/chat/model/chat.room.users";
import { Message } from "src/chat/model/message.model";

interface IUserCreationModel {
    username: string;
    email: string;
    password: string;
    usertag: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, IUserCreationModel> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;
    
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    username: string;

    @Column({type: DataType.STRING, unique: true, allowNull: true})
    usertag: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;
    
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isBanned: boolean;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isAdmin: boolean;

    @HasMany(() => Message)
    messages: Message[]

    @BelongsToMany(() => ChatRoom, () => ChatRoomUser)
    chats: ChatRoom[]
}