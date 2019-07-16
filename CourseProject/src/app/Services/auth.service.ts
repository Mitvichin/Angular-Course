import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private regUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]";
  private logInUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]";
  private myApiKey: string = "AIzaSyCCxImnw0fPDRULDquiVrxO9u6ur6FRSRs";
  userSub = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(user: UserDTO) {
    this.regUrl = this.regUrl.replace("[API_KEY]", this.myApiKey);
    return this.http.post<AuthResposeData>(this.regUrl, user)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
  }

  logIn(user: UserDTO) {
    this.logInUrl = this.logInUrl.replace("[API_KEY]", this.myApiKey);
    return this.http.post<AuthResposeData>(this.logInUrl, user)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
  }

  logout() {
    this.userSub.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if(this.tokenExpirationTimer){
     clearTimeout(this.tokenExpirationTimer);
     this.tokenExpirationTimer = null;
    }
  }

  autoLogout(expirationDuration:number){
    this.tokenExpirationTimer = setTimeout(() =>{
      this.logout();
    },expirationDuration);
  }

  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)// *1000 to convert to milisecs
    const user = new User(email, userId, token, expirationDate);
    this.userSub.next(user);
    this.autoLogout(expiresIn * 1000);//convert to milisecs
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    
    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token, 
      new Date(userData._tokenExpirationDate)
      );

      if(loadedUser.token){
        this.userSub.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'An unknown error occured'

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMsg);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'This email exist already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'Invalid credentials';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'Invalid credentials';
        break;
    }
    return throwError(errorMsg);
  }
}


export interface AuthResposeData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean,
}
class UserDTO {
  email: string
  password: string
  returnSecureToken: true
}