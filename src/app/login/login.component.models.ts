export interface formDataModel {
  account: string;
  password: string;
}

export class GetPasswordModel {
  userAccount: string;

  constructor(account) {
    this.userAccount = account;
  }
}

export class GetPasswordReturnModel {
  userPassword: string;
  userPasswordSalt: string;

  constructor() {
  }
}
