export class UserRepsonseModel {
  userId: number;
  userAccount: string;
  userPassword: string;
  userPasswordSalt: string;
  userPolicy: string;
  createTime: Date;
  updateTime: Date;
  refreshToken: string;

  constructor() {}
}

export class DeleteModel {
  userId: number;

  constructor(data) {
    this.userId = data;
  }
}

export class UpdateModel {
  userId: number;
  userAccount: string;
  userPassword: string;
  userPasswordSalt: string;
  userPolicy: string;
  createTime: Date;
  updateTime: Date;
  constructor(data) {
    this.userId = data.userId;
    this.userAccount = data.userAccount;
    this.userPassword = data.userPassword;
    this.userPasswordSalt = data.userPasswordSalt;
    this.userPolicy = data.userPolicy;
    this.createTime = data.createTime;
    this.updateTime = data.updateTime;

  }
}
