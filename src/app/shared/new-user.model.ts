export class NewUser {
  
  name: string;
  username: string;
  password: string;
  nationality: string;
  nationality2: string;

  constructor() {
    (this.name = ''),
      (this.username = ''),
      (this.password = ''),
      (this.nationality = ''),
      (this.nationality2 = '');
  }
}
