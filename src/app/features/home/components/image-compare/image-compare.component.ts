import { Component } from '@angular/core';
import { ImageCompareModule} from 'primeng/imagecompare';

@Component({
  selector: 'app-image-compare',
  imports: [ImageCompareModule],
  standalone: true,
  templateUrl: './image-compare.component.html',
  styleUrl: './image-compare.component.css'
})
export class ImageCompareComponent {

}
