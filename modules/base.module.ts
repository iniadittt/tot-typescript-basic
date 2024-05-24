import { IncomingMessage, ServerResponse } from "http";
import { IUser } from "../interface/user.interface";
import { IResponseUser } from "../interface/response.interface";
export abstract class BaseUserManager {
  protected abstract getUsers(): IResponseUser;
  protected abstract getUserById(userId:string): IResponseUser;
  protected abstract createUser(newUser: IUser): IResponseUser;
  protected abstract updateUser(
    userId: string,
    updatedUser: Partial<IUser>
  ): IResponseUser;
  protected abstract deleteUser(userId: string): IResponseUser;
}

export interface BaseHandler {
  handleRequest(
    request: IncomingMessage,
    response: ServerResponse
  ): Promise<void>;
}
