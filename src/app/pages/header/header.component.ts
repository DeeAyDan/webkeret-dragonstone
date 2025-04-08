import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, MatMenuModule, MatIcon],
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
