import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoginEvent {

  private loginSource = new Subject<string>();

  logginAnnouced$ = this.loginSource.asObservable();

  announceLogin(user: string) {
    this.loginSource.next(user);
  }
}
