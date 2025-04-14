import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '../helpers/icons.module';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, IconsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';


  roles = [
    { value: 1, label: 'Job Seeker' },
    { value: 2, label: 'Employer' },
    { value: 3, label: 'Admin' }
  ];

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    role: new FormControl<number | null>(null, [Validators.required]), // Specify number type
    termsAndConditions: new FormControl(false, [Validators.requiredTrue])
  }, { validators: this.passwordMatchValidator })

 


  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onPasswordChange(event: Event) {
    const password = (event.target as HTMLInputElement).value;
  }



  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: Number(this.registerForm.value.role)
      };

      this.authService.register(formData).subscribe({
        next: (response: any) => {
          this.router.navigate(['login']);
        },
        error: (error) => {
          // console.error('Registartion error:', error)
          if (error.status === 400) {
            this.errorMessage = 'Email already exists'
          }
          else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      })
    }
  }
}


