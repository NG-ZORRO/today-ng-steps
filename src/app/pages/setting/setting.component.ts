import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { AVATAR_CODE, USERNAME } from '../../services/local-storage/local-storage.namespace';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { pageSwitchTransition } from './setting.animation';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.less'],
  animations: [pageSwitchTransition]
})
export class SettingComponent implements OnInit {

  avatar = this.store.get(AVATAR_CODE) || './assets/img/default-avatar.png';

  username = this.store.get(USERNAME);
  loading;

  @HostBinding('@pageSwitchTransition') state = 'activated';
  @ViewChild('usernameInput') private usernameInput: ElementRef;

  constructor(
    private store: LocalStorageService,
    private message: NzMessageService,
    private router: Router,
    private msg: NzMessageService,
    private modalServ: NzModalService,
  ) { }

  ngOnInit() {
    this.usernameInput.nativeElement.value = this.username;
  }

  beforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg'
    if (!isJPG) {
      this.msg.error('只能使用图片作为头像')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      this.msg.error('图片不能超过 2 MB')
    }
    return isJPG && isLt2M
  }

  /**
      * @function when use localStorage , never post to server-side
      *
      * if you want upload file to server-side , add `nzAction="https://jsonplaceholder.typicode.com/posts/"` to <nz-upload> tag
      *
      */
  handleChange(info: { file: UploadFile }, useLocalStorage?: boolean) {

    /** 由于自带 nz-action，会主动 post 数据，这里将 info.file.type === 'error' 的情况过滤，不会重复调用函数 */
    if (useLocalStorage && info.file.percent === 100 && info.file.type !== 'error') {
      this.modalServ.confirm({
        nzTitle: '提示',
        nzContent: '<b>确定更新头像吗</b>',
        nzOnOk: () => {
          this.avatar = info.file.thumbUrl
          this.store.set(AVATAR_CODE, this.avatar)
          this.message.success('替换头像成功')
        }
      })
      return;
    }

    if (info.file.status === 'uploading') {
      this.loading = true
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false
        this.avatar = img
      })
    }
  }
  validateUsername(username: string): void {
    if (!username) {
      this.message.error('用户名不能为空');
      this.usernameInput.nativeElement.value = this.username;
    } else if (username !== this.username) {
      this.username = username;
      this.store.set(USERNAME, username);
      this.message.success('用户名已修改');
    }
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleAvatarImageChange(info: { file: UploadFile }): void {
    // This method would be triggered three times, I guess it's a bug of ng-zorro-antd.
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.avatar = img;
      this.store.set(AVATAR_CODE, img);
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/main');
  }
}
