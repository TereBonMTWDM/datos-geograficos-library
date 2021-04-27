import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styles: []
})
export class TreeViewComponent implements OnInit {
  //variables
  @Input() menuList: any;
  constructor() { }

  ngOnInit() {
  }

}
