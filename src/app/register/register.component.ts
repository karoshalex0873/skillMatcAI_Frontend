import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { IconsModule } from '../helpers/icons.module';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, IconsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // Existing registration properties
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  isRegistering = false;
  roles = [
    { value: 1, label: 'Job Seeker' },
    { value: 2, label: 'Employer' },
    { value: 3, label: 'Admin' }
  ];

  // OTP modal properties
  showOtpModal = false;
  registeredEmail = '';
  userId = '';
  isVerifying = false;
  isResending = false;
  countdown = 0;
  otpErrorMessage = '';

  // Forms
  registerForm: FormGroup;
  otpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      role: new FormControl<number | null>(null, [Validators.required]),
      termsAndConditions: new FormControl(false, [Validators.requiredTrue])
    }, { validators: this.passwordMatchValidator });

    this.otpForm = this.fb.group({
      digit0: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]]
    });
  }

  // Registration methods
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onPasswordChange(event: Event) {
    const password = (event.target as HTMLInputElement).value;
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    field === 'password'
      ? this.showPassword = !this.showPassword
      : this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isRegistering = true;
      this.errorMessage = '';

      const formData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: Number(this.registerForm.value.role)
      };

      this.authService.register(formData).subscribe({
        next: (response: any) => {
          this.isRegistering = false;
          this.showOtpModal = true;
          this.registeredEmail = response.user.email;
          this.userId = response.user.id;
          this.startCountdown(30);
          setTimeout(() => this.otpInputs.first.nativeElement.focus(), 100);
        },
        error: (error) => {
          this.isRegistering = false;
          this.errorMessage = error.status === 400
            ? 'Email already exists'
            : 'Registration failed. Please try again.';
        }
      });
    }
  }

  // OTP methods
  // Enhanced OTP Handling
  ngAfterViewInit() {
    if (this.otpInputs) {
      this.otpInputs.first.nativeElement.focus();
    }
  }

  handleOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      input.value = value.slice(0, -1);
      return;
    }

    // Auto-focus next input
    if (value.length === 1 && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }

    // Handle paste
    if (value.length > 1) {
      this.handlePaste(event);
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text/plain').slice(0, 6);
    if (!pasteData || !/^\d+$/.test(pasteData)) return;

    const digits = pasteData.split('');
    digits.forEach((digit, index) => {
      if (index < 6) {
        this.otpForm.get(`digit${index}`)?.setValue(digit);
      }
    });

    // Focus last input with value
    const lastIndex = Math.min(digits.length - 1, 5);
    this.otpInputs.toArray()[lastIndex].nativeElement.focus();
  }

  handleKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpForm.get(`digit${index}`)?.value && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  get fullOtp(): string {
    return Object.values(this.otpForm.value).join('');
  }



  verifyOtp() {
    if (this.otpForm.valid) {
      this.isVerifying = true;
      this.otpErrorMessage = '';

      this.authService.verifyOtp(this.userId, this.fullOtp).subscribe({
        next: () => {
          this.isVerifying = false;
          this.showOtpModal = false;
          this.router.navigate(['/login'], {
            queryParams: { verified: true, email: this.registeredEmail }
          });
        },
        error: (error) => {
          this.isVerifying = false;
          this.otpErrorMessage = error.error?.message || 'Verification failed. Please try again.';
        }
      });
    }
  }

  resendOtp() {
    if (this.countdown > 0) return;

    this.isResending = true;
    this.authService.resendOtp(this.userId).subscribe({
      next: () => {
        this.isResending = false;
        this.startCountdown(30);
      },
      error: (error) => {
        this.isResending = false;
        this.otpErrorMessage = error.error?.message || 'Failed to resend OTP. Please try again.';
      }
    });
  }

  startCountdown(seconds: number) {
    this.countdown = seconds;
    const sub = timer(1000, 1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) sub.unsubscribe();
    });
  }
}


