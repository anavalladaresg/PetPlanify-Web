import { Component } from '@angular/core';
import { ImageCompareModule } from 'primeng/imagecompare';

@Component({
  selector: 'app-home-image-compare',
  standalone: true,
  imports: [ImageCompareModule],
  templateUrl: './home-image-compare.component.html',
  styleUrls: ['./home-image-compare.component.css']
})
export class HomeImageCompareComponent {}
