import { Component, EventEmitter, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, MatMenuModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() selectedPage: EventEmitter<string> = new EventEmitter();
  currentPage = 'home';

  pageSwitch(page: string) {
    this.currentPage = page;
  }
}
