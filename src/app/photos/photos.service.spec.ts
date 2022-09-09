import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { PhotosService } from './photos.service';
import { environment } from 'src/environments/environment';
import { photos as photosMock } from './photos.mock';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, skip, take, takeLast, toArray } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PhotosCollectionComponent } from './photos-collection/photos-collection.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';

describe('PhotosService', () => {
  let service: PhotosService;
  let controller: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: PhotosCollectionComponent },
          { path: ':id', component: PhotoDetailComponent },
        ]),
      ],
      providers: [
        PhotosService,
        {
          provide: MatSnackBar,
          useFactory: () => ({
            open: () => ({
              onAction: () => EMPTY,
            }),
          }),
        },
      ],
    });

    router = TestBed.inject(Router);
    controller = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PhotosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPhotos', () => {
    describe('when the API returns Photos data', () => {
      it('returns an observable array of Photos', fakeAsync(() => {
        service.getPhotos().subscribe((photos) => {
          expect(photos).toEqual(photosMock().slice(0, environment.pageLimit));
        });
        controller.expectOne(environment.photosUrl).flush(photosMock());
        flush();
      }));
    });

    describe('when the API returns an error response', () => {
      it('returns an observable of an empty array', fakeAsync(() => {
        service.getPhotos().subscribe((photos) => {
          expect(photos).toEqual([]);
        });
        controller
          .expectOne(environment.photosUrl)
          .error(new ProgressEvent('Network Error'));
        flush();
      }));
    });
  });

  describe('getPhoto', () => {
    describe('with a valid Photo id', () => {
      it('returns an observable Photo', fakeAsync(() => {
        service.getPhoto(3).subscribe((photo) => {
          expect(photo).toEqual(photosMock()[2]);
        });
        controller.expectOne(environment.photosUrl).flush(photosMock());
        flush();
      }));
    });

    describe('with an invalid Photo id', () => {
      it('returns an observable containing null', fakeAsync(() => {
        service.getPhoto(NaN).subscribe((photo) => {
          expect(photo).toBeNull();
        });
        controller.expectOne(environment.photosUrl).flush(photosMock());
        flush();
      }));
    });
  });

  describe('Photos API calls', () => {
    it('caches the first API response', fakeAsync(() => {
      service.getPhotos().subscribe((photos) => {
        expect(photos).toBeDefined();
      });
      controller.expectOne(environment.photosUrl).flush(photosMock());
      flush();
      service.getPhoto(3).subscribe((photo) => {
        expect(photo).toBeDefined();
      });
      controller.expectNone(environment.photosUrl);
      flush();
    }));
  });

  describe('refreshPhotos', () => {
    it('clears the Photos cache and fetches the Photos', fakeAsync(() => {
      service.getPhotos().subscribe((photos) => {
        expect(photos).toBeDefined();
      });
      controller.expectOne(environment.photosUrl).flush(photosMock());
      flush();
      service.refreshPhotos();
      controller.expectOne(environment.photosUrl).flush(photosMock());
      flush();
    }));
  });

  describe('isPhotosLoading', () => {
    it('returns true when fetching Photos', fakeAsync(() => {
      service.isPhotosLoading().subscribe((isPhotosLoading) => {
        expect(isPhotosLoading).toBeTrue();
      });
      flush();
    }));

    it('returns false when the Photos are cached', fakeAsync(() => {
      service
        .isPhotosLoading()
        .pipe(skip(1))
        .subscribe((isPhotosLoading) => {
          expect(isPhotosLoading).toBeFalse();
        });
      service.getPhotos().subscribe();
      controller.expectOne(environment.photosUrl).flush(photosMock());
      flush();
    }));
  });

  describe('getSelectedPhotoId', () => {
    it('returns NaN when the route doesnt have an id', fakeAsync(() => {
      service.getSelectedPhotoId().subscribe((id) => {
        expect(id).toBeNaN();
      });
      router.navigate(['']);
      flush();
    }));

    it('returns an id when the route has an id', fakeAsync(() => {
      service.getSelectedPhotoId().subscribe((id) => {
        expect(id).toBe(1);
      });
      router.navigate(['1']);
      flush();
    }));
  });

  describe('hasPreviousPage', () => {
    it('returns false when the current page is the first page', fakeAsync(() => {
      service.hasPreviousPage().subscribe((hasPreviousPage) => {
        expect(hasPreviousPage).toBeFalse();
      });
      service.getPhotos().subscribe();
      controller.expectOne(environment.photosUrl).flush(photosMock());
      flush();
    }));

    it('returns true when the current page is not the first page', fakeAsync(() => {
      service
        .hasPreviousPage()
        .pipe(skip(1))
        .subscribe((hasPreviousPage) => {
          expect(hasPreviousPage).toBeTrue();
        });
      service.getPhotos().subscribe();
      controller.expectOne(environment.photosUrl).flush(photosMock());
      service.nextPage();
      flush();
    }));
  });

  describe('hasNextPage', () => {
    it('returns false when the current page is the last page', fakeAsync(() => {
      service.hasNextPage().subscribe((hasNextPage) => {
        expect(hasNextPage).toBeTrue();
      });
      service.getPhotos().subscribe();
      controller.expectOne(environment.photosUrl).flush(photosMock());
      flush();
    }));

    it('returns true when the current page is not the last page', fakeAsync(() => {
      service.hasNextPage().subscribe((hasNextPage) => {
        if (hasNextPage) {
          service.nextPage();
        } else {
          expect(hasNextPage).toBe(false);
        }
      });
      service.getPhotos().subscribe();
      controller.expectOne(environment.photosUrl).flush(photosMock());
      flush();
    }));
  });

  describe('previousPage & nextPage', () => {
    it('increases or decreases the current page by 1', fakeAsync(() => {
      service
        .hasPreviousPage()
        .pipe(take(3), toArray())
        .subscribe((hasPreviousPage) => {
          expect(hasPreviousPage).toEqual([false, true, false]);
        });
      service.nextPage();
      service.previousPage();
      flush();
    }));
  });
});
