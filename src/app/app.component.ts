import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './@core/authentication/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'BurgerQueen';

  redirections: { [key: string]: string } = {
    mesera: 'orders/inicio',
    cocinera: '',
    admin: '',
  };

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.systemUser$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/sign-in']);
        return;
      } else {
        const route = this.redirections[user.role];
        this.router.navigate([route]);
      }
    });
  }
}
