import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss'],
})
export class PhotoDetailComponent {
  photo$ = this.route.params.pipe(
    switchMap((params) => this.photosService.getPhoto(params['id']))
  );

  constructor(
    private photosService: PhotosService,
    private route: ActivatedRoute
  ) {}
}
