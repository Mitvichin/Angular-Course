import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipesDetailComponent } from './recipes/recipes-detail/recipes-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeResolverService } from './recipes/recipe-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService } from './Services/auth-guards/auth-guard.service';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'recipes', component: RecipesComponent, canActivate:[AuthGuardService], children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipesDetailComponent, resolve: [RecipeResolverService]},
      { path: ':id/edit', component: RecipeEditComponent,resolve: [RecipeResolverService] },
    ]
  },
  { path: 'shopping-list', component: ShoppingListComponent },
  {path: 'auth', component: AuthComponent},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
