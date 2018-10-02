import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  HostBinding,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

import { TodoService } from '../../../services/todo/todo.service';
import { Todo } from '../../../../domain/entities';
import { lessThanADay, floorToDate, getCurrentTime, getTodayTime, floorToMinute } from '../../../../utils/time';
import { detailTransition } from './detail.animation';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: [ './detail.component.less' ],
  animations: [ detailTransition ]
})
export class DetailComponent implements OnInit {
  @HostBinding('@detailTransition') state = 'activated';
  @Output() changedTodo = new EventEmitter();
  @ViewChild('tagNameInput') tagNameInput: ElementRef;

  private trueSource: Todo;
  currentTodo: Todo;
  dueDate: Date;
  planDate: Date;
  tags: string[];
  addTagInputVisible = false;
  newTagName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(first()).subscribe((paramsMap: ParamMap) => {
      const id = paramsMap.get('id');
      const todo = this.todoService.getByUUID(id);
      this.trueSource = todo;
      this.currentTodo = { ...todo, tags: [...(todo.tags || [])] };
      if (todo.dueAt) {
        this.dueDate = new Date(todo.dueAt);
      }
      if (todo.planAt) {
        this.planDate = new Date(todo.planAt);
      }
    });
  }

  goBack(): void {
    this.router.navigateByUrl('main');
  }

  handlePlanDateChange(date: Date): void {
    const t = date ? date.getTime() : undefined;
    if (!t) {
      this.currentTodo.notifyMe = false;
    }
    this.currentTodo.planAt = t;
    this.checkDate();
  }

  handleDueDateChange(date: Date): void {
    const dueAt = date ? date.getTime() : undefined;
    this.currentTodo.dueAt = dueAt;
    if (dueAt && lessThanADay(dueAt)) {
      this.message.warning('项目将会在 24 小时内到期', {
        nzDuration: 6000
      });
    }
    this.checkDate();
  }

  private checkDate(): void {
    const { dueAt, planAt } = this.currentTodo;
    if (dueAt && planAt && floorToDate(planAt) > dueAt) {
      this.message.warning('你确定要在到期之后才开始做这个项目吗？', {
        nzDuration: 6000
      });
    }
  }

  dueDisabledDate = (d: Date): boolean => floorToDate(d) < getTodayTime();
  planDisabledDate = (d: Date): boolean => floorToMinute(d) < getCurrentTime();

  clickSwitch(): void {
    if (this.currentTodo.completedFlag) { return; }
    if (!this.currentTodo.planAt) {
      this.message.warning('尚未设置计划日期');
      return;
    }
    this.currentTodo.notifyMe = !this.currentTodo.notifyMe;
  }

  confirm(): void {
    this.todoService.update(this.currentTodo);
    this.goBack();
  }

  delete(): void {
    this.todoService.delete(this.currentTodo._id);
    this.goBack();
  }

  showAddTagInput(): void {
    this.addTagInputVisible = true;
    setTimeout(() => {
      this.tagNameInput.nativeElement.focus();
    }, 10);
  }

  handleAddTagConfirm(): void {
    if (this.newTagName && this.currentTodo.tags.indexOf(this.newTagName) ===  -1) {
      this.currentTodo.tags.push(this.newTagName);
    }
    this.newTagName = '';
    this.addTagInputVisible = false;
  }

  handleTagClose(index: number): void {
    this.currentTodo.tags.splice(index, 1);
  }
}
