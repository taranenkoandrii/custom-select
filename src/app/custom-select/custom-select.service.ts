import { Injectable } from '@angular/core';
import { CustomSelectComponent } from './custom-select.component';

@Injectable()
export class CustomSelectService {
  private select!: CustomSelectComponent;

  public register(select: CustomSelectComponent): void {
    this.select = select;
  }

  public getSelect(): CustomSelectComponent {
    return this.select;
  }
}
