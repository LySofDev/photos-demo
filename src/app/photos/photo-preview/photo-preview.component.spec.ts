import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { photos } from '../photos.mock';

import { PhotoPreviewComponent } from './photo-preview.component';

describe('PhotoPreviewComponent', () => {
  let component: PhotoPreviewComponent;
  let fixture: ComponentFixture<PhotoPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoPreviewComponent],
      imports: [RouterTestingModule.withRoutes([]), MatCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoPreviewComponent);
    component = fixture.componentInstance;
    component.photo = photos()[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the thumbnail image url from the Photo object', () => {
    const image = fixture.nativeElement.querySelector('img');
    expect(image.src).toEqual(photos()[0].thumbnailUrl);
  });

  it('sets the navigation link for the Photo object', () => {
    const link = fixture.nativeElement.querySelector('a');
    expect(link.href.endsWith('/1')).toBeTrue();
  });

  it('sets the selected CSS class when the isSelected is true', () => {
    let container = fixture.nativeElement.querySelector('.selected');
    expect(container).toBeNull();
    component.isSelected = true;
    container = fixture.nativeElement.querySelector('.selected');
    fixture.detectChanges();
    expect(container).toBeDefined();
  });
});
