export class User{
  username: string;
  email: string;
  JWT: string;

  constructor(username: string, email: string, JWT: string) {
    this.username = username;
    this.email = email;
    this.JWT = JWT;
  }
}
