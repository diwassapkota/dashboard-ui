import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPassword implements OnInit {
  forgotPasswordForm!: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.forgotPasswordForm.valid) {
      this.message = 'If an account with this email exists, a password reset link has been sent.';
    }
  }
}
