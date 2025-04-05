import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output() selectedPage: EventEmitter<string> = new EventEmitter();
  isSidebarOpen = false;
  navButtons: NodeListOf<Element> | null = null;

  constructor() {}

  ngOnInit(): void {
    // Initialization logic can go here
  }

  ngAfterViewInit(): void {
    this.navButtons = document.querySelectorAll('.nav-button');
  }

  pageSwitch(page: string) {

    if (this.navButtons) {
      this.navButtons.forEach((button) => {
        button.classList.remove('active');
        console.log('Button removed:', button);
      });
    }

    const selectedButton = document.getElementById(page);
    selectedButton?.classList.add('active');
    this.selectedPage.emit(page);
  }
}
