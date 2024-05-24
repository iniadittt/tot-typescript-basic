import { v4 as uuidv4 } from "uuid";
import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "../modules/response.module";
import { IUser } from "../interface/user.interface";
import { IResponseUser } from "../interface/response.interface";
import UserService from "../service/user.service";

export default class UserController extends UserService {
  protected sendResponse: typeof sendResponse;

  constructor() {
    super();
    this.sendResponse = sendResponse;
  }

  public handleGetUsers(response: ServerResponse): void {
    const result: IResponseUser = this.getUsers();
    return this.sendResponse(response, result.code, result);
  }

  public handleGetUserById(
    request: IncomingMessage,
    response: ServerResponse
  ) {
    const userId: string = this.getUserIdFromUrl(request.url);
    if (!userId)
      return this.sendResponse(response, 400, {
        error: true,
        code: 400,
        message: "Id user required",
      });
    const result: IResponseUser = this.getUserById(userId);
    return this.sendResponse(response, result.code, result);
  }

  public handleCreateUser(
    request: IncomingMessage,
    response: ServerResponse
  ): void {
    let body: Uint8Array[] = [];
    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        const data: string = Buffer.concat(body).toString();
        const dataRequest: IUser = JSON.parse(data);
        const newUser: IUser = {
          id: uuidv4(),
          name: dataRequest.name,
          email: dataRequest.email,
        };
        const result: IResponseUser = this.createUser(newUser);
        return this.sendResponse(response, result.code, result);
      });
  }

  public handleUpdateUser(
    request: IncomingMessage,
    response: ServerResponse
  ): void {
    const userId = this.getUserIdFromUrl(request.url);
    if (!userId)
      return this.sendResponse(response, 400, {
        error: true,
        code: 400,
        message: "Id user required",
      });
    let body: Uint8Array[] = [];
    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        const data: string = Buffer.concat(body).toString();
        const updatedUser: Partial<IUser> = JSON.parse(data);
        const result: IResponseUser = this.updateUser(userId, updatedUser);
        return this.sendResponse(response, result.code, result);
      });
  }

  public handleDeleteUser(
    request: IncomingMessage,
    response: ServerResponse
  ): void {
    const userId: string = this.getUserIdFromUrl(request.url);
    if (!userId)
      return this.sendResponse(response, 400, {
        error: true,
        code: 400,
        message: "Id user required",
      });
    const result: IResponseUser = this.deleteUser(userId);
    return this.sendResponse(response, result.code, result);
  }

  public getUserIdFromUrl(url: string | undefined): any {
    if (!url) return null;
    const userIdMatch: RegExpMatchArray | null = url.match(
      /^\/users\/([0-9a-fA-F-]+)$/
    );
    return userIdMatch ? userIdMatch[1] : null;
  }
}
