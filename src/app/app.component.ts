import { Component } from '@angular/core';
import { PhotosService } from './photos/photos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Photos Demo';

  hasPreviousPage$ = this.photosService.hasPreviousPage();

  hasNextPage$ = this.photosService.hasNextPage();

  constructor(private photosService: PhotosService) {}

  onTitleClick() {
    this.photosService.refreshPhotos();
  }

  onPrevious() {
    this.photosService.previousPage();
  }

  onNext() {
    this.photosService.nextPage();
  }
}
