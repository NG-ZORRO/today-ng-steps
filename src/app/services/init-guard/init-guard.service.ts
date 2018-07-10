import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { INIT_FLAG } from '../local-storage/local-storage.namespace';


@Injectable()
export class InitGuardService implements CanActivate {
  constructor(
    private store: LocalStorageService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const init = !!this.store.get(INIT_FLAG);

    if (state.url.includes('setup') && init) {
      this.router.navigateByUrl('/main');
      return false;
    }
    if (!state.url.includes('setup') && !init) {
      this.router.navigateByUrl('/setup');
      return false;
    }

    return true;
  }
}
