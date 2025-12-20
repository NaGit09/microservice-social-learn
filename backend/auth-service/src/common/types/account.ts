import { Account } from '../entities/account';

export class AccountInfo {
  id: string;
  username: string;
  fullname: string;

  constructor(account: Account) {
    this.id = account._id.toString();
    this.username = account.username;
    this.fullname = account.fullname;
  }

}

export class AccountLogin {
  info: AccountInfo;
  accessToken: string;
  refreshToken: string;

  constructor(account: Account, access: string, refresh: string) {

    this.info = new AccountInfo(account);
    this.accessToken = access;
    this.refreshToken = refresh;

  }
}


