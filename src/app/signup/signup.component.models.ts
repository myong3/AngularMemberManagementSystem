export interface formDataModel {
  account: string;
  password: string;
  checkpassword: string;
}

export class checkAccountModel {
  userAccount: string;

  constructor(account) {
    this.userAccount = account;
  }
}

export class signUpModel {
  userAccount: string;
  userPassword: string;

  constructor() {}
}
