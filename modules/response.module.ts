import { ServerResponse } from "http";

export function sendResponse(
  response: ServerResponse,
  statusCode: number,
  data: any
): void {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}
