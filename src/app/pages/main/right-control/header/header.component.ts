import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RankBy } from '../../../../../domain/type';
import { ListService } from '../../../../services/list/list.service';
import { TodoService } from '../../../../services/todo/todo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.less' ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  listTitle = '';
  completedHide = false;

  constructor(
    private listService: ListService,
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.listService.current$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(list => {
        this.listTitle = list ? list.title : '';
      });
    this.todoService.completedHide$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(hide => this.completedHide = hide);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  switchRankType(e: RankBy): void {
    this.todoService.toggleRank(e);
  }

  toggleCompletedHide(): void {
    this.todoService.toggleCompletedHide(!this.completedHide);
  }
}
