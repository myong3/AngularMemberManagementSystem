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
