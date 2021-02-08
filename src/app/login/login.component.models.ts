export class LogInRequestModel {
  userAccount: string;
  userPassword: string;

  constructor() {}
}

export class LogInRepsonseModel {
  isSuccessLogIn: boolean;
  message: string;
  access_token: string;

  constructor() {}
}
