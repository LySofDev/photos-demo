import { Component } from '@angular/core';
import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-photos-collection',
  templateUrl: './photos-collection.component.html',
  styleUrls: ['./photos-collection.component.scss'],
})
export class PhotosCollectionComponent {
  isLoading$ = this.photosService.isPhotosLoading();

  photos$ = this.photosService.getPhotos();

  selectedPhotoId$ = this.photosService.getSelectedPhotoId();

  constructor(private photosService: PhotosService) {}
}
