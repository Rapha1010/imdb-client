import { UserRoleDto } from "../dtos/UserRoleDto";
import { UserRoleEnum } from "../enums/UserRoleEnum";
import { Deserializable } from "./Deserializable";

export class UserModel implements Deserializable {

  userId:string = '';
  username:string = '';
  email:string = '';
  address:string = '';
  password:string = '';
  roles:Array<UserRoleDto> = [];
  phoneNumber:number = 0;
  lastUpdateDate:string = '';
  creationDate:string = '';
  admin: boolean = false;

  deserialize(input: UserModel) {
    Object.assign(this, input);
    return this;
  }
}