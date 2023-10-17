// import { Language, User } from "../custom";
export type User = {
  name: string,
  _id: string,
  org?: string,
};

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}