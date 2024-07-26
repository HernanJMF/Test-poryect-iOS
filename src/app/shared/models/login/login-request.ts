export class LoginRequest{
  email_address: string = "";
  password: string = "";

  constructor(email_address : string, password: string){
    this.email_address = email_address;
    this.password = password;
  }
}
