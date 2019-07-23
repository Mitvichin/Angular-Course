import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../Services/shopping.service';
import { Observable } from 'rxjs';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  //subscription: Subscription;
  ingredients: Observable<Ingredient[]>;

  constructor(private shoppingService: ShoppingService, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    //this.ingredients = this.shoppingService.getIngredients();
    // this.subscription = this.shoppingService.ingredientsChanged.subscribe((ings: Ingredient[]) => {
    //   this.ingredients = ings;
    // });

    this.ingredients = this.store.select('shoppingList').pipe(map(state => {
      console.log(state)
      return state.ingredients;
    }));

  }

  onEditItem(index: number) {
    //this.shoppingService.startedEditing.next(index);
    this.store.dispatch( new ShoppingListActions.StartEditing(index));
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }
}
