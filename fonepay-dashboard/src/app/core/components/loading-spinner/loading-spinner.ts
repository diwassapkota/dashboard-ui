import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.scss']
})
export class LoadingSpinner {
  constructor(public loadingService: LoadingService) { }
}
