import {
  Component,
  OnInit,
  ElementRef,
  ViewChild, OnDestroy
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  ingredientForm: FormGroup;
  ingredientSubscription: Subscription;
  editedIngredient: Ingredient;
  editMode = false;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.ingredientSubscription = this.slService.startedEdit
      .subscribe((id: string) => {
        this.editMode = true;
        const ing = this.slService.getIngredient(id);
        this.editedIngredient = ing;
        this.resetForm({
          'name': ing.name,
          'amount': ing.amount,
        });
    });
    this.ingredientForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, this.noNegativeValidator]),
    });
  }

  onSubmit() {
    if (!this.ingredientForm.valid) { return; }
    const { name, amount } = this.ingredientForm.value;
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
    this.resetForm(null);
  }

  resetForm(value: { name: string, amount: number }) {
    this.editedIngredient = null;
    this.editMode = false;
    this.ingredientForm.reset(value || undefined);
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedIngredient.id);
    this.resetForm(null);
  }

  noNegativeValidator(control: FormControl): {[s: string]: boolean} {
    if (typeof control.value === 'number' && control.value < 1) {
      return {
        isNegative: true
      };
    }
    return null;
  }

  ngOnDestroy(): void {
    this.ingredientSubscription.unsubscribe();
  }

}
