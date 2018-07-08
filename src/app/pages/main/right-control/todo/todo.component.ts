import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NzDropdownService } from 'ng-zorro-antd';
import { combineLatest, Subject } from 'rxjs';
import { Todo, List } from '../../../../../domain/entities';
import { TodoService } from '../../../../services/todo/todo.service';
import { ListService } from '../../../../services/list/list.service';
import { floorToDate, getTodayTime } from '../../../../../utils/time';
import { takeUntil } from '../../../../../../node_modules/rxjs/operators';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: [ './todo.component.less' ]
})
export class TodoComponent implements OnInit, OnDestroy {
  private destory$ = new Subject();

  todos: Todo[] = [];
  lists: List[] = [];
  currentContextTodo: Todo;

  constructor(
    private listService: ListService,
    private todoService: TodoService,
    private dropdownService: NzDropdownService,
    private router: Router
  ) { }

  ngOnInit() {
    this.listService.lists$
      .pipe(takeUntil(this.destory$))
      .subscribe(lists => {
        this.lists = lists;
      });

    combineLatest(this.listService.currentUuid$, this.todoService.todo$)
      .pipe(takeUntil(this.destory$))
      .subscribe(sources => {
        this.processTodos(sources[ 0 ], sources[ 1 ]);
      });

    this.todoService.getAll();
    this.listService.getAll();
  }

  ngOnDestroy() {
    this.destory$.next();
  }

  private processTodos(listUUID: string, todos: Todo[]): void {
    const filteredTodos = todos
      .filter(todo => {
        return ((listUUID === 'today' && todo.planAt && floorToDate(todo.planAt) <= getTodayTime())
          || (listUUID === 'todo' && (!todo.listUUID || todo.listUUID === 'todo'))
          || (listUUID === todo.listUUID));
      })
      .map(todo => Object.assign({}, todo) as Todo);

    this.todos = [].concat(filteredTodos);
  }

  add(title: string): void {
    this.todoService.add(title);
  }
}
