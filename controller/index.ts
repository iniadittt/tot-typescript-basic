import { IncomingMessage, ServerResponse } from "http";
import { BaseHandler } from "../modules/base.module";
import { sendResponse } from "../modules/response.module";
import UserController from "./user.controller";

export default class Controller implements BaseHandler {
  private sendResponse: typeof sendResponse;
  private userController: UserController;

  constructor() {
    this.sendResponse = sendResponse;
    this.userController = new UserController();
  }

  async handleRequest(
    request: IncomingMessage,
    response: ServerResponse
  ): Promise<void> {
    const { method, url }: { method: string; url: string } = request as {
      method: string;
      url: string;
    };

    if (!method || !url)
      return this.sendResponse(response, 400, {
        error: true,
        code: 400,
        message: "Bad request",
      });

    if (url === "/users" && method === "GET") {
      this.userController.handleGetUsers(response);
    } else if (url.startsWith("/users/") && method === "GET") {
      this.userController.handleGetUserById(request, response);
    } else if (url === "/users" && method === "POST") {
      this.userController.handleCreateUser(request, response);
    } else if (url.startsWith("/users/") && method === "PATCH") {
      this.userController.handleUpdateUser(request, response);
    } else if (url.startsWith("/users/") && method === "DELETE") {
      this.userController.handleDeleteUser(request, response);
    } else {
      this.sendResponse(response, 404, { message: "Route not found" });
    }
  }
}
