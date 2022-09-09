import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, skip, Subject } from 'rxjs';
import { photos as photosMock } from '../photos.mock';
import { PhotosService } from '../photos.service';

import { PhotoDetailComponent } from './photo-detail.component';

describe('PhotoDetailComponent', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let service: PhotosService;
  let route: ActivatedRoute;
  let params$: Subject<Params>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatIconModule],
      providers: [
        {
          provide: PhotosService,
          useFactory: () => ({
            getPhoto: (id: number) => of(isNaN(id) ? null : photosMock()[0]),
          }),
        },
        {
          provide: ActivatedRoute,
          useFactory: () => ({
            params: params$,
          }),
        },
      ],
      declarations: [PhotoDetailComponent],
    }).compileComponents();

    params$ = new BehaviorSubject({ id: 1 } as Params);
    route = TestBed.inject(ActivatedRoute);
    service = TestBed.inject(PhotosService);
    fixture = TestBed.createComponent(PhotoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('photo$', () => {
    it('returns a photo object when the route has an id', fakeAsync(() => {
      component.photo$.subscribe((photo) => {
        expect(photo).toEqual(photosMock()[0]);
      });
      flush();
    }));

    it('returns null when the route doesnt have an id', fakeAsync(() => {
      component.photo$.pipe(skip(1)).subscribe((photo) => {
        expect(photo).toBeNull();
      });
      params$.next({});
      flush();
    }));

    it('sets the url from the Photo', () => {
      const image = fixture.nativeElement.querySelector('img');
      expect(image.src).toBe(photosMock()[0].url);
    });

    it('sets the title from the photo', () => {
      const title = fixture.nativeElement.querySelector('h1');
      expect(title.innerText).toEqual(photosMock()[0].title);
    });
  });
});
