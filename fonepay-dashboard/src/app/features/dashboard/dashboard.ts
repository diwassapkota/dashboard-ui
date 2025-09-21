import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  metrics: any = {};

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
      },
      error: (err) => {
        console.error('Failed to get dashboard metrics', err);
      }
    });
  }
}
