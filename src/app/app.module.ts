import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhotosCollectionComponent } from './photos/photos-collection/photos-collection.component';
import { PhotoPreviewComponent } from './photos/photo-preview/photo-preview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhotoDetailComponent } from './photos/photo-detail/photo-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    PhotosCollectionComponent,
    PhotoPreviewComponent,
    PhotoDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
