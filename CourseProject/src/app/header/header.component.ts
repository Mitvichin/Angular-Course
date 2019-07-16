import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../Services/data-storage.service';
import { AuthService } from '../Services/auth.service';
import { Subscription } from 'rxjs';
import { timingSafeEqual } from 'crypto';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',

})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean = false;
    userSub: Subscription;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService) {

    }

    ngOnInit(): void {
        this.userSub = this.authService.userSub.subscribe(user => {
            this.isAuthenticated = user ? true : false;
        });
    }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout(){
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}