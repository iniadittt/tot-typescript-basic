import Server from './server'
import Controller from "../controller";
import { BaseHandler } from '../modules/base.module';

const controller: Controller = new Controller();

const handlers: BaseHandler[] = [controller];

const server: Server = new Server(handlers);
server.start(3000);