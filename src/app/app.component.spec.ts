import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { PhotosService } from './photos/photos.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let service: PhotosService;
  let hasNextPage$: Subject<boolean>;
  let hasPreviousPage$: Subject<boolean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: PhotosService,
          useFactory: () => ({
            refreshPhotos: () => {},
            hasNextPage: () => hasNextPage$,
            hasPreviousPage: () => hasPreviousPage$,
            previousPage: () => {},
            nextPage: () => {},
          }),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AppComponent],
    }).compileComponents();
    hasNextPage$ = new BehaviorSubject(true);
    hasPreviousPage$ = new BehaviorSubject(false);
    service = TestBed.inject(PhotosService);
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Photos Demo'`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Photos Demo');
  });

  it('shows the title', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(title.innerText.includes('Photos Demo')).toBeTrue();
  });

  it('refreshes Photos when the title is clicked', () => {
    spyOn(service, 'refreshPhotos');
    const title: HTMLElement = fixture.nativeElement.querySelector('h1');
    title.dispatchEvent(new Event('click'));
    expect(service.refreshPhotos).toHaveBeenCalled();
  });

  describe('hasNextPage$', () => {
    it('disables the next page button when false', () => {
      hasNextPage$.next(false);
      fixture.detectChanges();
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelectorAll('button')[1];
      expect(button.disabled).toBeTrue();
    });

    it('enables the next page button when true', () => {
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelectorAll('button')[1];
      expect(button.disabled).toBeFalse();
    });
  });

  describe('hasPreviousPage$', () => {
    it('disables the previous page button when false', () => {
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelectorAll('button')[0];
      expect(button.disabled).toBeTrue();
    });

    it('enables the previous page button when true', () => {
      hasPreviousPage$.next(true);
      fixture.detectChanges();
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelectorAll('button')[0];
      expect(button.disabled).toBeFalse();
    });
  });

  describe('onPrevious', () => {
    it('calls the PhotosService', () => {
      spyOn(service, 'previousPage');
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelectorAll('button')[0];
      button.dispatchEvent(new Event('click'));
      expect(service.previousPage).toHaveBeenCalled();
    });
  });

  describe('onNext', () => {
    it('calls the PhotosService', () => {
      spyOn(service, 'nextPage');
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelectorAll('button')[1];
      button.dispatchEvent(new Event('click'));
      expect(service.nextPage).toHaveBeenCalled();
    });
  });
});
