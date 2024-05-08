import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';

const LOGGEDIN = 'splitifyLoggedIn'

class User {

  id_user: number = 0;
  username: string = ""; 
  password: string = ""; 
  token: string = "";
  email: string = "";
  celular: string = "";

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  totalAngularPackages: any;

  constructor(private router: Router, private http: HttpClient) { }
  
  private apiUrl = 'localhost/8000';

  login(username: string, password: string){
    new Promise<void>((resolve, reject) => {
      try {
        let username_obt;
        let password_obt;
        const response = this.http.get<Array<User>>(this.apiUrl + '/users?username=' + username).subscribe(data => {
          password_obt = data[0].password;
          username_obt = data[0].username; 
        });
        if (username != username_obt){

        }
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
    new Promise<void>((resolve, reject) => {
      try {
        // todo db register
        console.log("todo db register")
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}
