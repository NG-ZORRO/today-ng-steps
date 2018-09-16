import { LocalStorageService } from './../local-storage/local-storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AvatarService {
  constructor(
    private store: LocalStorageService,
  ) { }

   getAvatarUrl(): string {
    return this.store.get('avatarUrl') ? this.store.get(`avatarUrl`) : './assets/img/default-avatar.png';
  }

}






