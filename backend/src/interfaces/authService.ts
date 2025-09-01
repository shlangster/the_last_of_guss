import { Role } from "../types";

export interface IAuthService {
  
  createUser(username: string, password: string): Promise<{id: string, username: string, role: Role}>;
  getUser(username: string): Promise<{id: string, username: string, passwordHash: string, role: Role}>;
  checkPasswordHash(password: string, hash: string) : Promise<boolean>;
}
