import { Component, OnInit, HostBinding } from '@angular/core';
import { mainPageSwitchTransition } from './main.animation';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: [ './main.component.css' ],
  animations: [ mainPageSwitchTransition ]
})
export class MainComponent implements OnInit {
  @HostBinding('@mainPageSwitchTransition') state = 'activated';

  isCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
