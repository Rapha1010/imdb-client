import { UserModel } from "../models/UserModel";

export class UserDto {
  content: Array<UserModel> = [];
  size:number = 0;
}