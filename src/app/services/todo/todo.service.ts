import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ListService } from '../list/list.service';
import { floorToMinute, ONE_HOUR, getCurrentTime } from '../../../utils/time';
import { Todo } from '../../../domain/entities';
import { TODOS } from '../local-storage/local-storage.namespace';

@Injectable()
export class TodoService {
  todo$ = new Subject<Todo[]>();

  private todos: Todo[] = [];

  constructor(
    private listService: ListService,
    private store: LocalStorageService
  ) {
    this.todos = this.store.getList(TODOS);
  }

  private broadCast(): void {
    this.todo$.next(this.todos);
  }

  private persist(): void {
    this.store.set(TODOS, this.todos);
  }

  getAll(): void {
    this.todos = this.store.getList(TODOS);
    this.broadCast();
  }

  getRaw(): Todo[] {
    // if (!this.todos.length) { this.todos = this.store.getList(TODOS); }
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
      this.persist()
      this.broadCast();
    }
  }

  deleteInList(uuid: string): void {
    const toDelete = this.todos.filter(t => t.listUUID === uuid);
    toDelete.forEach(t => this.delete(t._id));
  }
}
