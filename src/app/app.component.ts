import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  // standalone: true,
  // imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'custom-select';

  public testModel!: any;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ){
    this.matIconRegistry.addSvgIcon(
      `arrow-up`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/icons/arrow-up.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      `arrow-down`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/icons/arrow-down.svg`)
    );
    this.matIconRegistry.addSvgIcon(
      `check`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/icons/check.svg`)
    );
  }

}
