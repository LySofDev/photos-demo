import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Photo } from '../photos';

@Component({
  selector: 'app-photo-preview',
  templateUrl: './photo-preview.component.html',
  styleUrls: ['./photo-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoPreviewComponent {
  @Input() photo?: Photo;
  @Input() isSelected = false;
}
