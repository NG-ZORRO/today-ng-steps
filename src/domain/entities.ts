import { generateUUID } from '../utils/uuid';

export class Todo {
  _id: string;
  title: string;
  createdAt: number;
  listUUID: string;
  desc: string;
  completedFlag: boolean;
  completedAt: number;
  dueAt: number;
  planAt: number;
  notifyMe = false;

  constructor(title: string, listUUID?: string) {
    this._id = generateUUID();
    this.title = title;
    this.listUUID = listUUID;
    this.completedFlag = false;
  }
}

export class List {
  _id: string;
  title: string;
  createdAt: number;

  constructor(title: string) {
    this._id = generateUUID();
    this.title = title;
  }
}
