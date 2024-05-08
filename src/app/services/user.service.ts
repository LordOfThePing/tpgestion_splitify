import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../classes/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private http: HttpClient) { }

getUsers(): Observable<Array<User>> {
  return this.http.get<Array<User>>(`${environment.apiUrl}/users`);
}

getUser(username: string): Observable<[User]> {
  return this.http.get<[User]>(`${environment.apiUrl}/user/` + username);
}

postUser(user: User): Observable<User> {
  console.log("prepost");
  return this.http.post<User>(`${environment.apiUrl}/users`, user);
}

getHelloMessage(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/hello`);
}

}
