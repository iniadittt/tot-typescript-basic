import path from "path";
import fs from "fs";
import { IUser } from "../interface/user.interface";
import { BaseUserManager } from "../modules/base.module";
import { IResponseUser } from "../interface/response.interface";

const filepath: string = path.join(__dirname, "../data/users.json");

export default class UserService extends BaseUserManager {
  constructor() {
    super();
  }

  private getUserFromJson(): IUser[] {
    return JSON.parse(fs.readFileSync(filepath, "utf8"));
  }

  private addUserToJson(data: IUser[]): void {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  protected getUsers(): IResponseUser {
    const users: IUser[] = this.getUserFromJson();
    if (users.length === 0)
      return {
        error: false,
        code: 404,
        message: "No users found",
        data: users,
      };
    return {
      error: false,
      code: 200,
      message: "Get users successfully",
      data: users,
    };
  }

  protected getUserById(userId: string): IResponseUser {
    const users: IUser[] = this.getUserFromJson();
    const user: IUser | undefined = users.find(
      (user: IUser) => user.id === userId
    );
    if (!user)
      return {
        error: true,
        code: 400,
        message: "User not found",
      };
    return {
      error: true,
      code: 200,
      message: "Get user successfully",
      data: user,
    };
  }

  protected createUser(newUser: IUser): IResponseUser {
    if (!newUser.name || !newUser.email)
      return {
        error: true,
        code: 400,
        message: "Emai and name are required",
      };
    const users: IUser[] = this.getUserFromJson();
    const availableUser: IUser[] = users.filter(
      (user: IUser) => user.email === newUser.email
    );
    if (availableUser.length > 0)
      return {
        error: true,
        code: 400,
        message: "Email already exists",
      };
    users.push(newUser);
    this.addUserToJson(users);
    return {
      error: false,
      code: 201,
      message: "Add user successfully",
      data: newUser,
    };
  }

  protected updateUser(
    userId: string,
    updatedUser: Partial<IUser>
  ): IResponseUser {
    const users: IUser[] = this.getUserFromJson();
    const availableUser: IUser | undefined = users.find(
      (user: IUser) => user.id === userId
    );
    if (!availableUser)
      return {
        error: true,
        code: 400,
        message: "User not found",
      };
    const usersUpdate: IUser[] = users.map((user: IUser) =>
      user.id === userId
        ? {
            ...user,
            ...updatedUser,
          }
        : user
    );
    this.addUserToJson(usersUpdate);
    const updatedUserData: IUser | undefined = usersUpdate.find(
      (user: IUser) => user.id === userId
    );
    if (!updatedUserData)
      return {
        error: true,
        code: 400,
        message: "Update user failed",
      };
    return {
      error: false,
      code: 200,
      message: "Update user successfully",
      data: updatedUserData,
    };
  }

  protected deleteUser(userId: string): IResponseUser {
    const users: IUser[] = this.getUserFromJson();
    const availableUser: IUser | undefined = users.find(
      (user: IUser) => user.id === userId
    );
    if (!availableUser)
      return {
        error: true,
        code: 400,
        message: "User not found",
      };
    const usersAfterDelete: IUser[] = users.filter(
      (user: IUser) => user.id !== userId
    );
    this.addUserToJson(usersAfterDelete);
    return {
      error: false,
      code: 200,
      message: "Delete user successfully",
    };
  }
}
