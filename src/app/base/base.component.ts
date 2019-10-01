import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  BoxTitle = 'Welcome to Our most Famous Food Community!';
  constructor() { }

  ngOnInit() {
  }

}
