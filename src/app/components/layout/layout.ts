import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Siderbar } from "./siderbar/siderbar";
import { Header } from "./header/header";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Siderbar, Header,CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

isCollapsed = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
