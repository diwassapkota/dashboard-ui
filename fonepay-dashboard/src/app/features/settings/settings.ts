import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings implements OnInit {
  settingsForm!: FormGroup;

  constructor(private settingsService: SettingsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      theme: [''],
      preferences: ['']
    });
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingsService.getUserSettings().subscribe({
      next: (data) => {
        this.settingsForm.patchValue(data);
      },
      error: (err) => {
        console.error('Failed to load settings', err);
      }
    });
  }

  updateSettings(): void {
    if (this.settingsForm.valid) {
      this.settingsService.updateUserSettings(this.settingsForm.value).subscribe({
        next: () => {
          // Optionally, show a success message
        },
        error: (err) => {
          console.error('Failed to update settings', err);
        }
      });
    }
  }
}
