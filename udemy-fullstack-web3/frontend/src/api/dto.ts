
interface LoginData {
  authType: 'basic' | 'metamask';
  authBasic?: {
    username: string;
    password: string;
  }
  authMetaMask?: {
    accountId: string;
  }
}
