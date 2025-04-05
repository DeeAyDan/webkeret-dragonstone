import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output() selectedPage: EventEmitter<String> = new EventEmitter();
  isSidebarOpen = false;

  constructor() {}

  ngOnInit(): void {
    // Initialization logic can go here
  }

  ngAfterViewInit(): void {
    // Logic that needs to run after the view has been initialized
  }

  pageSwitch(page: String) {
    console.log('Page switched to:', page);
    this.selectedPage.emit(page);
  }
}
