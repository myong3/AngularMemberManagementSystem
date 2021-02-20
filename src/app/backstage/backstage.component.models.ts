export class UserResponseViewModel {
  userList: Array<UserResponseModel>;
  refreshToken: string;

  constructor() {}
}

export class UserResponseModel {
  userId: number;
  userAccount: string;
  userPassword: string;
  userPasswordSalt: string;
  userPolicy: string;
  createTime: Date;
  updateTime: Date;

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
  constructor() {}
}
