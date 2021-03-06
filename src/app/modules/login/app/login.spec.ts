import {LoginApp} from './login';

describe('LoginApp', () => {
  let loginApp;
  let userRepository;
  let sync;
  let sha1;
  let loginEvent;

  beforeEach(() => {
    userRepository = new UserRepository();
    sync = new Sync();
    sha1 = new Sha1();
    loginEvent = new LoginEvent();

    loginApp = new LoginApp(userRepository, sync, sha1, loginEvent);
  });

  it('should reset data on logout', () => {
    loginApp.logout();

    expect(userRepository.deleteUserCalled).toEqual(true);
    expect(sync.deleteAllLocalDataCalled).toEqual(true);
    expect(loginEvent.announceLoginCalled).toEqual(true);
  });
});

class UserRepository {
  public deleteUserCalled: boolean = false;

  deleteUser(user: any): void { this.deleteUserCalled = true; }
}

class Sync {
  public deleteAllLocalDataCalled: boolean = false;

  deleteAllLocalData(user: any): void { this.deleteAllLocalDataCalled = true; }
}

class Sha1 {
}

class LoginEvent {
  public announceLoginCalled: boolean = false;

  announceLogin(user: any): void { this.announceLoginCalled = true; }
}
