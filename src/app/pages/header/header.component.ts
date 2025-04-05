import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output() selectedPage: EventEmitter<string> = new EventEmitter();
  isSidebarOpen = false;
  currentPage = 'home';
  constructor() {}

  ngOnInit(): void {
    // Initialization logic can go here
  }

  ngAfterViewInit(): void {
  }

  pageSwitch(page: string) {
    this.currentPage = page;
    this.selectedPage.emit(page);
  }
}
