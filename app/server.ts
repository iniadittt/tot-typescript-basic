import http, { IncomingMessage, ServerResponse } from "http";
import { BaseHandler } from "./../modules/base.module";
import { sendResponse } from "./../modules/response.module";

export default class Server {
  private handlers: BaseHandler[] = [];
  private sendResponse: typeof sendResponse;

  constructor(handlers: BaseHandler[]) {
    this.handlers = handlers;
    this.sendResponse = sendResponse;
  }

  start(port: number): void {
    const server = http.createServer(
      async (request: IncomingMessage, response: ServerResponse) => {
        const handler = this.handlers.find(
          (hndlr) => hndlr.handleRequest instanceof Function
        );

        if (handler) {
          try {
            await handler.handleRequest(request, response);
          } catch (error) {
            return this.sendResponse(response, 500, {
              message: "Internal Server Error",
            });
          }
        } else {
          return this.sendResponse(response, 404, {
            message: "Handler not found",
          });
        }
      }
    );

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
