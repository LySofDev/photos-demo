import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoDetailComponent } from './photos/photo-detail/photo-detail.component';
import { PhotosCollectionComponent } from './photos/photos-collection/photos-collection.component';

const routes: Routes = [
  {
    path: '',
    component: PhotosCollectionComponent,
    children: [{ path: ':id', component: PhotoDetailComponent }],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
