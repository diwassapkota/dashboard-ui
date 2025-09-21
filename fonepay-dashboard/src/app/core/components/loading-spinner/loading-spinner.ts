import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingSpinner {
  constructor(public loadingService: LoadingService) { }
}
