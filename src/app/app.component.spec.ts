import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './@core/authentication/services/auth.service';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthService;
  let authServiceLoginResponseSubject: Subject<any>;

  beforeEach(() => {
    authServiceLoginResponseSubject = new Subject();
    authService = {
      systemUser$: new Subject(),
      loginResponse$: authServiceLoginResponseSubject,
    } as any;

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: AuthService, useValue: authService }],
      imports: [RouterTestingModule],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should navigate when the user has an accessToken', () => {
    const userWithAccessToken = {
      isLoading: false,
      error: null,
      data: {
        accessToken: 'qwerty123',
        user: {
          email: 'userEmail@hotmail.com',
          role: 'mesera',
          id: 1,
        },
      },
    };

    authServiceLoginResponseSubject.next(userWithAccessToken);

    const routerSpy = spyOn(component.router, 'navigate');

    fixture.detectChanges();
    authService.loginResponse$.subscribe(() => {
      expect(routerSpy).toHaveBeenCalledWith(['/orders/create']);
    });
  });

  it('should navigate to sign-in when user does not have an accessToken', () => {
    authServiceLoginResponseSubject.next({ data: {} });
    const routerSpy = spyOn(component.router, 'navigate');

    fixture.detectChanges();

    authService.loginResponse$.subscribe(() => {
      expect(routerSpy).toHaveBeenCalledWith(['/sign-in']);
    });
  });

  afterEach(() => {
    authService.loginResponse$.unsubscribe();
  });
});
