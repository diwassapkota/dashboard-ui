import { Component, OnInit } from '@angular/core';
import { QueryService } from './query.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.html',
  styleUrls: ['./query.scss']
})
export class Query implements OnInit {
  query: string = '';
  results: any = null;
  error: string | null = null;
  history: any[] = [];

  constructor(private queryService: QueryService) { }

  ngOnInit(): void {
    this.loadHistory();
  }

  executeQuery(): void {
    this.queryService.executeQuery(this.query).subscribe({
      next: (data) => {
        this.results = data.results;
        this.error = data.error;
        this.loadHistory();
      },
      error: (err) => {
        this.error = 'Failed to execute query';
        console.error(err);
      }
    });
  }

  loadHistory(): void {
    this.queryService.getQueryHistory().subscribe({
      next: (data) => {
        this.history = data;
      },
      error: (err) => {
        console.error('Failed to load query history', err);
      }
    });
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }
}
