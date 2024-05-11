import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, lastValueFrom, tap } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../../classes/user';
import { SnackbarService } from './snackbar.service';

const LOGGEDIN = 'splitifyLoggedIn'
const USERID = 'userId'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  totalAngularPackages: any;
  constructor(private router: Router, private http: HttpClient, private userService: UserService, private snackBarService: SnackbarService) { }

  async login(username: string, password: string) {
    try {
      const user: User | null = await lastValueFrom(this.userService.getUser(username));

      if (!user) {
        console.error('User not found.');
        this.snackBarService.open('Wrong username/password.', 'error');
        return Promise.reject('User not found.');
      }

      if (password !== user.password) {
        console.error('Authentication error: Password entered does not match the one in the database.');
        console.log('password: ' + password + ' vs DB pass: '+ user.password);
        this.snackBarService.open('Wrong username/password.', 'error');
        return Promise.reject('Authentication error: Password entered does not match the one in the database.');
      } 
      this.snackBarService.open('Login success!', 'success');
      localStorage.setItem(LOGGEDIN, 'true');
      localStorage.setItem(USERID, String(user.id_user));
      this.router.navigate(['/home']);
      return Promise.resolve();
    } catch (error) {
      console.error('Error occurred during login:', error);
      this.snackBarService.open('Error occurred during login. Try again later', 'error');
      return Promise.reject('Error occurred during login:' + error);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuth() {
    const loggedIn = localStorage.getItem(LOGGEDIN);
    console.log('loggedIn?', loggedIn);
    if (!loggedIn) return false;
    return loggedIn == 'true' ? true : false;
  }

  loggedUserId(): number  {
    return +(localStorage.getItem(USERID) as String);
  }

  async register(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    cellphone: string
  ) {
    try {
      let user = new User();

      user.username = username;
      user.password = password;
      user.mail = email;
      user.celular = cellphone;
      user.username = username;
      await lastValueFrom(this.userService.postUser(user));
      this.snackBarService.open('Register success!', 'success');
      return Promise.resolve()
    } catch (error) {
      this.snackBarService.open('Error occurred during register. Try again later', 'error');

      Promise.reject("Error occurred during register: " + error)
    }
  }
}
