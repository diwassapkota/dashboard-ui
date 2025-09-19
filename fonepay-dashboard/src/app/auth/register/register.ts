import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['ROLE_USER']
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.router.navigate(['/app/dashboard']);
        },
        error: (err) => {
          this.error = 'Failed to register';
          console.error(err);
        }
      });
    }
  }
}
