import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../../classes/user';

const LOGGEDIN = 'splitifyLoggedIn'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  totalAngularPackages: any;

  constructor(private router: Router, private http: HttpClient, private userService: UserService) { }

  async login(username: string, password: string) {
    try {
      /* const user: [User] = await this.userService.getUser(username).toPromise() as [User];

      if (!user || !user[0]) {
        console.error('User not found.');
        return Promise.reject('User not found.');
      }

      if (password !== user[0].password) {
        console.error('Authentication error: Password entered does not match the one in the database.');
        return Promise.reject('Authentication error: Password entered does not match the one in the database.');
      } */

      localStorage.setItem(LOGGEDIN, 'true');
      this.router.navigate(['/home']);
      return Promise.resolve();
    } catch (error) {
      console.error('Error occurred during login:', error);
      return Promise.reject('Error occurred during login.');
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
      await this.userService.postUser(user).toPromise();
      return Promise.resolve()
    } catch (error) {
      Promise.reject(error)
    }
  }
}
