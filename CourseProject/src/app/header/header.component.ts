import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../Services/data-storage.service';
import { AuthService } from '../Services/auth.service';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',

})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean = false;
    userSub: Subscription;

    constructor(
        private dataStorageService: DataStorageService,
        private authService: AuthService,
        private store: Store<fromApp.AppState>) {

    }

    ngOnInit(): void {
        // this.userSub = this.authService.userSub.subscribe(user => {
        //     this.isAuthenticated = user ? true : false;
        // });

        this.userSub = this.store.select('auth').subscribe(state => {
            this.isAuthenticated = !!state.user;
        })
    }

    onSaveData() {
        //this.dataStorageService.storeRecipes();
        this.store.dispatch(new RecipesActions.SaveRecipes());
    }

    onFetchData() {
        //this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipesActions.FetchRecipes());
    }

    onLogout() {
        //this.authService.logout();
        this.store.dispatch(new AuthActions.Logout());
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}