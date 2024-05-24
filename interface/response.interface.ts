import { IUser } from "./user.interface";

export interface IResponseUser {
  error: boolean;
  code: number;
  message: string;
  data?: IUser | IUser[] | null;
}
