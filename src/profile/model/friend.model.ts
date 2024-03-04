import { DataType, Model, Table, Column, HasMany, ForeignKey } from "sequelize-typescript";
import { User } from "src/user/models/user.model";

interface FriendsCreationModel {
  userId: number;
  friendId: number;
  status: number;
}
@Table({tableName: 'friends'})
export class Friends extends Model<Friends, FriendsCreationModel> {
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  friendId: number;
  @Column({type: DataType.INTEGER, allowNull: false})
  status: number;
}