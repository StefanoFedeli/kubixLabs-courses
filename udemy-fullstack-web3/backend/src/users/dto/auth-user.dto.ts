export class RegisterUserDto {
  firstName: string;
  lastName: string;
  role: string;
  authType: string;
  authBasic?: {
    username: string;
    password: string;
  };
  authMetaMask?: {
    accountId: string;
  };
}

export class LoginUserDto {
  authType: string;
  authBasic?: {
    username: string;
    password: string;
  };
  authMetaMask?: {
    accountId: string;
  };
}
