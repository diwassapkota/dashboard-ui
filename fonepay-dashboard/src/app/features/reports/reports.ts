import { Component, OnInit } from '@angular/core';
import { ReportsService } from './reports.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class Reports implements OnInit {
  reports: any[] = [];
  reportForm!: FormGroup;

  constructor(private reportsService: ReportsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadReports();
    this.reportForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  loadReports(): void {
    this.reportsService.getAllReports().subscribe({
      next: (data) => {
        this.reports = data;
      },
      error: (err) => {
        console.error('Failed to get reports', err);
      }
    });
  }

  createReport(): void {
    if (this.reportForm.valid) {
      this.reportsService.createReport(this.reportForm.value).subscribe({
        next: () => {
          this.loadReports();
          this.reportForm.reset();
        },
        error: (err) => {
          console.error('Failed to create report', err);
        }
      });
    }
  }

  deleteReport(id: number): void {
    this.reportsService.deleteReport(id).subscribe({
      next: () => {
        this.loadReports();
      },
      error: (err) => {
        console.error('Failed to delete report', err);
      }
    });
  }
}
