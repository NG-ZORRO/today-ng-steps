import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzDropdownService, NzDropdownContextComponent } from 'ng-zorro-antd';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Todo, List } from '../../../../../domain/entities';
import { TodoService } from '../../../../services/todo/todo.service';
import { ListService } from '../../../../services/list/list.service';
import { floorToDate, getTodayTime } from '../../../../../utils/time';
import { RankBy } from '../../../../../domain/type';


const rankerGenerator = (type: RankBy = 'title'): any => {
  if (type === 'completeFlag') {
    return (t1: Todo, t2: Todo) => t1.completedFlag && !t2.completedFlag;
  }
  return (t1: Todo, t2: Todo) => t1[ type ] > t2[ type ];
};


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: [ './todo.component.less' ]
})
export class TodoComponent implements OnInit, OnDestroy {
  private dropdown: NzDropdownContextComponent;
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

    combineLatest(
      this.listService.currentUuid$,
      this.todoService.todo$,
      this.todoService.rank$,
      this.todoService.completedHide$
      )
      .pipe(takeUntil(this.destory$))
      .subscribe(sources => {
        this.processTodos(sources[ 0 ], sources[ 1 ], sources[ 2 ], sources[3]);
      });

    this.todoService.getAll();
    this.listService.getAll();
  }

  ngOnDestroy() {
    this.destory$.next();
    this.destory$.complete();
  }

  private processTodos(listUUID: string, todos: Todo[], rank: RankBy, completedHide: boolean): void {
    const filteredTodos = todos
      .filter(todo => {
        return ((listUUID === 'today' && todo.planAt && floorToDate(todo.planAt) <= getTodayTime())
          || (listUUID === 'todo' && (!todo.listUUID || todo.listUUID === 'todo'))
          || (listUUID === todo.listUUID));
      })
      .map(todo => Object.assign({}, todo) as Todo)
      .sort(rankerGenerator(rank))
      .filter(todo => completedHide ? !todo.completedFlag : todo);

    this.todos = [].concat(filteredTodos);
  }

  add(title: string): void {
    this.todoService.add(title);
  }

  click(uuid: string): void {
    this.router.navigateByUrl(`/main/${uuid}`);
  }

  contextMenu(
    $event: MouseEvent,
    template: TemplateRef<void>,
    uuid: string
  ): void {
    this.dropdown = this.dropdownService.create($event, template);
    this.currentContextTodo = this.todos.find(t => t._id === uuid);
  }

  listsExcept(listUUID: string): List[] {
    return this.lists.filter(l => l._id !== listUUID);
  }

  toggle(uuid: string): void {
    this.todoService.toggleTodoComplete(uuid);
  }

  delete(): void {
    this.todoService.delete(this.currentContextTodo._id);
  }

  setToday(): void {
    this.todoService.setTodoToday(this.currentContextTodo._id);
  }

  moveToList(listUuid: string): void {
    this.todoService.moveToList(this.currentContextTodo._id, listUuid);
  }

  close(): void {
    this.dropdown.close();
  }
}
