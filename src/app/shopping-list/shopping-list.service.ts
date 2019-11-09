import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEdit = new Subject<string>();

  private ingredients: Ingredient[] = [
    new Ingredient('5', 'Apples', 5),
    new Ingredient('6', 'Tomatoes', 10),
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredient(id: string) {
    return this.ingredients.find((ingredient: Ingredient) => ingredient.id === id);
  }

  updateIngredient(ing: Ingredient) {
    const { id } = ing;
    this.ingredients = this.ingredients.map(ingredient => {
      if (ingredient.id === id) {
        return {
          ...ingredient,
          ...ing,
        };
      }
      return ingredient;
    });
    this.ingredientsChanged.next([...this.ingredients]);
  }

  deleteIngredient(id: string) {
    const newIngredients = this.ingredients.reduce((result, current) => {
      if (current.id === id) {
        return result;
      }
      return [...result, current];
    }, []);
    this.ingredients = newIngredients;
    this.ingredientsChanged.next(newIngredients);
  }
}
