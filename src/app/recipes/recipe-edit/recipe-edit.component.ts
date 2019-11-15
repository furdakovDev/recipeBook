import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Ingredient } from '../../shared/ingredient.model';
import { noNegativeValidator } from '../../shared/validators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: string;
  editMode = false;
  recipeForm: FormGroup;
  editedRecipe: Recipe;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.initForm();
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  initForm() {
    if (this.editMode) {
      this.editedRecipe = this.recipeService.getRecipe(this.id);
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(this.getValue(this.editedRecipe, 'name'), Validators.required),
      'imagePath': new FormControl(this.getValue(this.editedRecipe, 'imagePath'), Validators.required),
      'description': new FormControl(this.getValue(this.editedRecipe, 'description'), Validators.required),
      'ingredients': new FormArray(this.getIngredients(this.editedRecipe ? this.editedRecipe.ingredients : [])),
    });
  }

  getValue (obj: object, field: string, def: string = null) {
    return obj ? obj[field] : def;
  }

  getIngredients(ingredients: Ingredient[] = []) {
    return ingredients.map(ing => {
      return this.createIngredient(ing);
    });
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  addIngredientControl() {
    (<FormArray>this.recipeForm.get('ingredients'))
      .push(this.createIngredient());
  }

  deleteControl(i: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(i);
  }

  createIngredient(ingredient?: Ingredient) {
    return new FormGroup({
      'name': new FormControl(
        this.getValue(ingredient, 'name'),
        Validators.required,
        ),
      'amount': new FormControl(
        this.getValue(ingredient, 'amount'),
        [Validators.required, noNegativeValidator],
        ),
    });
  }

  onSubmit() {
    const { name, description, imagePath, ingredients } = this.recipeForm.value;
    const newRecipe = new Recipe(
      name,
      description,
      imagePath,
      ingredients.map(ing => ({ ...ing, id: `${new Date}`})),
      `${+new Date()}`,
    );
    if (this.editMode) {
      this.recipeService.updateRecipe({
        ...newRecipe,
        id: this.editedRecipe.id,
      });
      this.editedRecipe = null;
      this.editMode = false;
    } else {
      this.recipeService.addRecipe(newRecipe);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route});
  }
}
