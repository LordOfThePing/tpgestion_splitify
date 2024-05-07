import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const LOGGEDIN = 'splitifyLoggedIn'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login(username: string, password: string){
    new Promise<void>((resolve, reject) => {
      try {
        // todo db auth
        localStorage.setItem(LOGGEDIN, 'true');
        this.router.navigate(['/home']);
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuth(){
    const loggedIn = localStorage.getItem(LOGGEDIN);
    console.log('loggedIn?', loggedIn);
    if (!loggedIn) return false;
    return loggedIn == 'true'? true: false;
  }

  register(
    username: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    email: string, 
    cellphone: string 
  ) {

  }
}
