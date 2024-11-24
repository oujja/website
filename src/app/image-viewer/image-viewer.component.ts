import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { SwiperDirective } from '../swiper-directive';
import { SwiperOptions } from 'swiper/types';

register();
@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule, SwiperDirective],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImageViewerComponent implements AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper!: ElementRef;
  @Input() images: string[] = [];
  @Input() isOpen: boolean = false;
  @Output() closeImageViewer = new EventEmitter<void>();

  index = 0;
  swiperConfig: SwiperOptions = {
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  };

  ngAfterViewInit() {
    if (this.swiper && this.swiper.nativeElement) {
      this.swiper.nativeElement.swiper.slideTo(this.index);
    }
  }

  slideChange(swiper: any) {
    console.log(swiper, 'swiper');

    this.index = swiper.detail[0].activeIndex;
  }
}
