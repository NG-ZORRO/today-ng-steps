import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListComponent } from './list/list.component';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { USERNAME } from '../../../services/local-storage/local-storage.namespace';

@Component({
  selector: 'app-left-control',
  templateUrl: './left-control.component.html',
  styleUrls: [ './left-control.component.less' ]
})
export class LeftControlComponent implements OnInit {
  @Input() isCollapsed: boolean;
  @ViewChild(ListComponent) listComponent: ListComponent;

  username: string;

  constructor(
    private store: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.username = this.store.get(USERNAME);
  }

  openAddListModal(): void {
    this.listComponent.openAddListModal();
  }

  goSetting() {
    this.router.navigateByUrl('/setting');
  }

  goSummary() {
    this.router.navigateByUrl('/summary');
  }
}
