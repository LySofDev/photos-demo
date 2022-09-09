import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { PhotoPreviewComponent } from '../photo-preview/photo-preview.component';
import { photos as mockPhotos } from '../photos.mock';
import { PhotosService } from '../photos.service';

import { PhotosCollectionComponent } from './photos-collection.component';

describe('PhotosCollectionComponent', () => {
  let component: PhotosCollectionComponent;
  let fixture: ComponentFixture<PhotosCollectionComponent>;
  let service: PhotosService;
  let isPhotosLoading$: Subject<boolean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatCardModule, MatProgressSpinnerModule],
      declarations: [PhotosCollectionComponent, PhotoPreviewComponent],
      providers: [
        {
          provide: PhotosService,
          useFactory: () => ({
            getPhotos: () => of(mockPhotos()),
            isPhotosLoading: () => isPhotosLoading$,
            getSelectedPhotoId: () => of(1),
          }),
        },
      ],
    }).compileComponents();

    isPhotosLoading$ = new BehaviorSubject(true);
    service = TestBed.inject(PhotosService);
    fixture = TestBed.createComponent(PhotosCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isLoading$', () => {
    it('subscribes to the PhotoService', fakeAsync(() => {
      component.isLoading$.subscribe((isLoading) => {
        expect(isLoading).toBeTrue();
      });
      flush();
    }));

    it('shows the loading spinner when true', () => {
      const spinner = fixture.nativeElement.querySelector('mat-spinner');
      expect(spinner).toBeDefined();
    });

    it('hides the list of Photos when true', () => {
      const photos = fixture.nativeElement.querySelector('.photos');
      expect(photos.classList.contains('hidden')).toBeTrue();
    });

    it('hides the loading spinner when false', () => {
      isPhotosLoading$.next(false);
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('mat-spinner');
      expect(spinner).toBeNull();
    });

    it('shows the list of Photos when false', () => {
      isPhotosLoading$.next(false);
      fixture.detectChanges();
      const photos = fixture.nativeElement.querySelector('.photos');
      expect(photos.classList.contains('hidden')).toBeFalse();
    });
  });

  describe('photos$', () => {
    it('subscribes to the PhotosService', fakeAsync(() => {
      component.photos$.subscribe((photos) => {
        expect(photos).toEqual(mockPhotos());
      });
      flush();
    }));

    it('renders a PhotoPreviewComponent for each Photo', () => {
      const photos: HTMLElement[] =
        fixture.nativeElement.querySelectorAll('app-photo-preview');
      expect(photos.length).toEqual(mockPhotos().length);
      photos.forEach((photo, i) => {
        expect(photo.innerText.includes(mockPhotos()[i].title));
      });
    });
  });

  describe('selectedPhotoId$', () => {
    it('subscribes to the PhotoService', fakeAsync(() => {
      component.selectedPhotoId$.subscribe((id) => {
        expect(id).toEqual(1);
      });
      flush();
    }));

    it('sets the selected PhotoPreview component', () => {
      const photos: HTMLElement[] =
        fixture.nativeElement.querySelectorAll('app-photo-preview');
      let card = photos[0].querySelector('mat-card');
      expect(card?.classList.contains('selected')).toBeTrue();
      card = photos[1].querySelector('mat-card');
      expect(card?.classList.contains('selected')).toBeFalse();
    });
  });
});
