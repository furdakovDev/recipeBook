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
  editMode = false;
  editedIngredient: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.ingredientForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, this.noNegativeValidator]),
    });
    this.ingredientSubscription = this.slService.startedEdit
      .subscribe((id: string) => {
        this.editMode = true;
        this.editedIngredient = this.slService.getIngredient(id);
        this.resetForm({
          'name': this.editedIngredient.name,
          'amount': this.editedIngredient.amount,
        });
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
      this.editedIngredient = null;
      this.editMode = false;
    } else {
      const newIngredient = new Ingredient(`${+new Date()}-ingredient`, name, amount);
      this.slService.addIngredient(newIngredient);
    }
    this.resetForm(null);
  }

  resetForm(value: { name: string, amount: number }) {
    this.ingredientForm.reset(value || undefined);
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
