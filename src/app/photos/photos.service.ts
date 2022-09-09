import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Photo } from './photos';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private isLoading$ = new BehaviorSubject(true);

  private photos$: Observable<{ [id: number]: Photo }> = this.isLoading$.pipe(
    filter((isLoading) => isLoading),
    switchMap(() => this.http.get<Photo[]>(environment.photosUrl)),
    map((photos) => this.mapPhotosById(photos)),
    catchError((error) => this.handlePhotosError(error)),
    tap(() => this.isLoading$.next(false)),
    shareReplay(1)
  );

  private selectedPhotoId$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) =>
      parseInt(
        ((event as NavigationEnd).urlAfterRedirects.match(/\d+/) || [''])[0]
      )
    )
  );

  private page$ = new BehaviorSubject(0);

  constructor(
    private http: HttpClient,
    private notifications: MatSnackBar,
    private router: Router
  ) {}

  getPhotos() {
    return this.photos$.pipe(
      switchMap((photosMap) =>
        this.page$.pipe(
          map((page) =>
            Object.values(photosMap).slice(
              page * environment.pageLimit,
              (page + 1) * environment.pageLimit
            )
          )
        )
      )
    );
  }

  getPhoto(id: number) {
    return this.photos$.pipe(map((photosMap) => photosMap[id] || null));
  }

  refreshPhotos() {
    this.isLoading$.next(true);
  }

  isPhotosLoading() {
    return this.isLoading$.asObservable();
  }

  getSelectedPhotoId() {
    return this.selectedPhotoId$;
  }

  hasPreviousPage() {
    return this.page$.pipe(map((page) => page > 0));
  }

  hasNextPage() {
    return this.photos$.pipe(
      switchMap((photosMap) =>
        this.page$.pipe(
          map(
            (page) =>
              Object.values(photosMap).length / environment.pageLimit > page
          )
        )
      )
    );
  }

  previousPage() {
    this.page$.next(this.page$.getValue() - 1);
  }

  nextPage() {
    this.page$.next(this.page$.getValue() + 1);
  }

  private mapPhotosById(photos: Photo[]): Record<number, Photo> {
    return photos.reduce(
      (photosMap, photo) => ({
        ...photosMap,
        [photo.id]: photo,
      }),
      {}
    );
  }

  private handlePhotosError(_error: unknown) {
    this.notifications.open(
      'Something went wrong. Please refresh.',
      undefined,
      {
        panelClass: 'error',
        duration: 3000,
      }
    );
    return of([]);
  }
}
