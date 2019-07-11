import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from 'src/app/Services/recipe.service';

@Component({
  selector: 'app-recipes-item',
  templateUrl: './recipes-item.component.html',
  styleUrls: ['./recipes-item.component.scss']
})
export class RecipesItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() index:number;
  ngOnInit() {
  }
}
