import { Injectable } from '@angular/core';
import { Summary, Todo } from '../../../domain/entities';
import { getTodayTime, floorToDate, ONE_DAY } from '../../../utils/time';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { TodoService } from '../../services/todo/todo.service';
import { LAST_SUMMARY_DATE, START_USING_DATE, SUMMARIES } from '../../services/local-storage/local-storage.namespace';

@Injectable()
export class SummaryService {
  summaries: Summary[] = [];

  constructor(
    private store: LocalStorageService,
    private todoService: TodoService
  ) { }

  doSummary(): void {
    const todayDate = getTodayTime();
    let lastDate = this.store.get(LAST_SUMMARY_DATE) || floorToDate(this.store.get(START_USING_DATE));

    if (lastDate === todayDate) {
      return;
    }

    const todos = this.todoService.getRaw();
    const todosToAna: Todo[] = [];
    const summaries: Summary[] = [];
    const dates: number[] = [];

    todos.forEach((todo) => {
      if (todo.planAt) {
        const date = floorToDate(todo.planAt);
        if (date < todayDate) { todosToAna.push(todo); }
      }
    });

    while (lastDate < todayDate) {
      dates.push(lastDate);
      lastDate += ONE_DAY;
    }

    dates.forEach(date => {
      const completedItems: string[] = [];
      const uncompletedItems: string[] = [];

      todosToAna.forEach(todo => {
        const planAt = floorToDate(todo.planAt);
        if (planAt <= date) {
          if (todo.completedFlag && floorToDate(todo.completedAt) === date) {
            completedItems.push(todo.title);
          } else if (
            todo.completedFlag &&
            floorToDate(todo.completedAt) < date
          ) { /* do nothing */ } else {
            uncompletedItems.push(todo.title);
          }
        }
      });

      summaries.push(new Summary(date, completedItems, uncompletedItems));
    });

    this.store.set(LAST_SUMMARY_DATE, lastDate);
    this.addSummaries(summaries);
  }

  public summaryForDate(date: number): Summary {
    if (!this.summaries.length) { this.summaries = this.loadSummaries(); }
    return this.summaries.find(s => s.date === date);
  }

  private loadSummaries(): Summary[] {
    return this.store.getList<Summary>(SUMMARIES);
  }

  private addSummaries(summaries: Summary[]): void {
    const oldSummaries = this.loadSummaries();
    const newSummaries = oldSummaries.concat(summaries);
    this.store.set(SUMMARIES, newSummaries);
  }
}
