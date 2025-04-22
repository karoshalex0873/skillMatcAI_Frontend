// login.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IconsModule } from '../helpers/icons.module';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, IconsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string = '';
  isLoading: boolean = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,]),
    rememberMe: new FormControl(false)
  });



  onPasswordChange(event: Event) {
    const password = (event.target as HTMLInputElement).value;
  }
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe
      };
      this.authService.login(formData).subscribe({
        next: (response: any) => {

          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('refreshToken', response.refreshToken);


          this.authService.setUser(response.user);
          const role = response.user.Role;
          if (role === 1) this.router.navigate(['/jobs/aut']);
          if (role === 2) this.router.navigate(['/hire/postJob']);
          if (role === 3) this.router.navigate(['/admin/users']);
          this.isLoading = false;
        },
        error: (error) => {
          if (error.status === 401) {
            this.errorMessage = 'Incorrect email or password';
          } else {
            this.errorMessage = error.error.message;
            this.isLoading = false;
          }
        }
      })
    }
  }

}