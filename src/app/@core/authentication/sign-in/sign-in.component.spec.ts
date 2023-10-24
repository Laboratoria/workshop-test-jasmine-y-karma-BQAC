import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SignInComponent } from './sign-in.component';
import { AuthService } from 'src/app/@core/authentication/services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authService: AuthService;

  beforeEach(() => {
    // creamos un objeto simulado (spy) de la clase HttpClient. Estos sirve para :
    // - Aislamiento de la prueba : No estás probando la funcionalidad real de HttpClient, que ya ha sido probada por Angular
    // - Control total: puedes definir el comportamiento específico que deseas que tenga en el contexto de tu prueba.
    // - Evita llamadas reales a servicios externos:  Llamar directamente a un servicio HTTP real en una prueba puede ser costoso en términos de tiempo y recursos, y también podría afectar el estado del servidor.
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });
    fixture = TestBed.createComponent(SignInComponent); // Crea una instancia del componente que vas a probar
    component = fixture.componentInstance; // se utiliza para interactuar con el componente en las pruebas, acceder a sus propiedades y métodos, y realizar comprobaciones en él.
    authService = TestBed.inject(AuthService);
    fixture.detectChanges(); // Detectar y aplicar cambios en el componente
  });

  it('initialize the form', () => {
    expect(component.formLogin).toBeTruthy();
    expect(component.formLogin.get('email')).toBeTruthy();
    expect(component.formLogin.get('password')).toBeTruthy();
  });

  it('should call login when the form is valid', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'myRealPassword',
    };
    component.formLogin.setValue(credentials);

    spyOn(authService, 'login');

    component.signIn();
    expect(authService.login).toHaveBeenCalledWith(credentials);
  });

  it('should not call login when the form is invalid', () => {
    const credentials = {
      email: 'test@example.com',
      password: '',
    };
    component.formLogin.setValue(credentials);

    spyOn(authService, 'login');

    component.signIn();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should set errorMessage to "Credenciales Inválidas" for "Incorrect password" error', () => {
    const errorResponse: HttpErrorResponse = new HttpErrorResponse({
      error: 'Incorrect password',
    });

    authService.loginResponse$.next({
      isLoading: false,
      error: errorResponse,
      data: null,
    });

    component.authService.loginResponse$.subscribe(() => {
      expect(component.errorMessage).toEqual('Credenciales Inválidas');
    });
  });
});
