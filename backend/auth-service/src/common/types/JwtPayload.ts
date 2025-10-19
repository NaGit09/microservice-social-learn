import { Account } from "../entities/account";

export class JwtPayload {
  sub: string;
  username: string;
  role: string;
  permissions: string[];
  iss: string;
  constructor(account: Account) {
    this.sub = account._id.toString();
    this.iss='nhutanh09';
    this.role = account.role;
    this.permissions = account.permissions;
    this.username = account.username;
  }
}
