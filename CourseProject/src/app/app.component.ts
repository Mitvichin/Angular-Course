import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common'
import { AuthService } from './Services/auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private store: Store<fromApp.AppState>, @Inject(PLATFORM_ID) private platformId) { }
  ngOnInit(): void {
    //this.authService.autoLogin();
    if(isPlatformBrowser(this.platformId)){
      this.store.dispatch(new AuthActions.AppRefreshStart());
    }
  }
}
