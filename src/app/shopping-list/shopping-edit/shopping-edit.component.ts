import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { noNegativeValidator } from '../../shared/validators';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  ingredientForm: FormGroup;
  ingSubscription: Subscription;
  editedIngredient: Ingredient;
  private editMode = false;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.addSubscription();
    this.ingredientForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [Validators.required, noNegativeValidator]),
    });
  }

  addSubscription() {
    this.ingSubscription = this.slService.startedEdit
      .subscribe((id: string) => {
        this.editMode = true;
        const ing = this.slService.getIngredient(id);
        this.editedIngredient = ing;
        this.ingredientForm.reset({
          'name': ing.name,
          'amount': ing.amount,
        });
        this.ingredientForm.markAsDirty();
      });
  }

  onSubmit() {
    if (!this.ingredientForm.valid) { return; }
    const { name, amount } = this.ingredientForm.value;
    console.log(this);
    if (this.editMode) {
      this.editedIngredient = {
        ...this.editedIngredient,
        name,
        amount,
      };
      this.slService.updateIngredient(this.editedIngredient);
    } else {
      const newIngredient = new Ingredient(`${+new Date()}-ingredient`, name, amount);
      this.slService.addIngredient(newIngredient);
    }
    this.editedIngredient = null;
    this.editMode = false;
    this.resetForm();
  }

  resetForm() {
    this.ingredientForm.reset();
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedIngredient.id);
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.ingSubscription.unsubscribe();
  }
}
