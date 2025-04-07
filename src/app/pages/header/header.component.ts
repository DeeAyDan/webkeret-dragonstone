import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output() selectedPage: EventEmitter<string> = new EventEmitter();
  currentPage = 'home';

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
  }

  constructor() {}

  pageSwitch(page: string) {
    this.currentPage = page;
  }
}
