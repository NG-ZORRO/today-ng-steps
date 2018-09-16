import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ListService } from '../list/list.service';
import { floorToMinute, ONE_HOUR, getCurrentTime } from '../../../utils/time';
import { Todo } from '../../../domain/entities';
import { TODOS } from '../local-storage/local-storage.namespace';
import { RankBy } from '../../../domain/type';

@Injectable()
export class TodoService {
  todo$ = new Subject<Todo[]>();
  rank$ = new Subject<RankBy>();
  completedHide$ = new Subject<boolean>();

  private todos: Todo[] = [];
  private rank: RankBy = 'title';
  private completedHide = false;

  constructor(
    private listService: ListService,
    private store: LocalStorageService
  ) {
    this.todos = this.store.getList(TODOS);
  }

  private broadCast(): void {
    this.todo$.next(this.todos);
    this.rank$.next(this.rank);
    this.completedHide$.next(this.completedHide);
  }

  private persist(): void {
    this.store.set(TODOS, this.todos);
  }

  getAll(): void {
    this.todos = this.store.getList(TODOS);
    this.broadCast();
  }

  getRaw(): Todo[] {
    return this.todos;
  }

  getByUUID(uuid: string): Todo | null {
    return this.todos.filter((todo: Todo) => todo._id === uuid)[ 0 ] || null;
  }

  setTodoToday(uuid: string): void {
    const todo = this.getByUUID(uuid);
    if (todo && !todo.completedFlag) {
      todo.planAt = floorToMinute(new Date()) + ONE_HOUR;
      this.update(todo);
    }
  }

  toggleTodoComplete(uuid: string): void {
    const todo = this.getByUUID(uuid);
    if (todo) {
      todo.completedFlag = !todo.completedFlag;
      todo.completedAt = todo.completedFlag ? getCurrentTime() : undefined;
      this.persist();
      this.completedHide$.next(this.completedHide);
    }
  }

  moveToList(uuid: string, listUUID: string): void {
    const todo = this.getByUUID(uuid);
    if (todo) {
      todo.listUUID = listUUID;
      this.update(todo);
    }
  }

  add(title: string): void {
    const listUUID = this.listService.getCurrentListUuid();
    const newTodo = new Todo(title, listUUID);

    if (listUUID === 'today') {
      newTodo.planAt = floorToMinute(new Date()) + ONE_HOUR;
      newTodo.listUUID = 'todo';
    }

    this.todos.push(newTodo);
    this.persist();
    this.broadCast();
  }

  update(todo: Todo): void {
    const index = this.todos.findIndex(t => t._id === todo._id);
    if (index !== -1) {
      todo.completedAt = todo.completedFlag ? getCurrentTime() : undefined;
      this.todos.splice(index, 1, todo);
      this.persist();
      this.broadCast();
    }
  }

  delete(uuid: string): void {
    const index = this.todos.findIndex(t => t._id === uuid);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.persist();
      this.broadCast();
    }
  }

  deleteInList(uuid: string): void {
    const toDelete = this.todos.filter(t => t.listUUID === uuid);
    toDelete.forEach(t => this.delete(t._id));
  }

  toggleRank(r: RankBy): void {
    this.rank = r;
    this.rank$.next(r);
  }

  toggleCompletedHide(hide: boolean): void {
    this.completedHide = hide;
    this.completedHide$.next(hide);
  }
}
