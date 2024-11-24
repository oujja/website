import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { SwiperDirective } from '../swiper-directive';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

register();
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    SwiperDirective,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    InputTextareaModule,
    HttpClientModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    ImageViewerComponent,
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper!: ElementRef;
  @ViewChild('aboutMeSection') aboutMeSection!: ElementRef;
  @ViewChild('contactMeSection') contactMeSection!: ElementRef;
  @ViewChild('projectSection') projectSection!: ElementRef;
  @ViewChild('serviceSection') serviceSection!: ElementRef;

  isImagesOpen: boolean = false;
  contactForm: FormGroup;
  name: string = '';
  mailSendSuccessfully: boolean = false;
  selectedApp: string = 'app1';

  isMenuOpen = false;

  images: string[] = [];

  app1: string[] = [
    '../../assets/swipeImages/app1/image.png',
    '../../assets/swipeImages/app1/image0.png',
    '../../assets/swipeImages/app1/image1.png',
  ];

  app2: string[] = [
    '../../assets/swipeImages/app2/image.png',
    '../../assets/swipeImages/app2/image0.png',
  ];

  app3: string[] = ['../../assets/swipeImages/image0.jpg'];

  index = 0;
  swiperConfig: SwiperOptions = {
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true }, // Fügen Sie Pagination hinzu, falls benötigt
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  };

  constructor(
    private el1: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      // reference: ['', Validators.required],
      message: ['', Validators.required],
    });

    this.images = this.app1;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'is-visible');
        }
      });
    });

    const elements =
      this.el1.nativeElement.querySelectorAll('.fade-in-section');
    elements.forEach((element: HTMLElement) => observer.observe(element));

    if (this.swiper && this.swiper.nativeElement) {
      this.swiper.nativeElement.swiper.activeIndex = this.index;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  scrollToProjectsSection() {
    if (this.projectSection) {
      this.projectSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToAboutMeSection() {
    if (this.aboutMeSection) {
      this.aboutMeSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToContactMeSection() {
    if (this.contactMeSection) {
      this.contactMeSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  scrollToServiceSection() {
    if (this.serviceSection) {
      this.serviceSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  sideSelected(event: string) {
    console.log(event);
    switch (event) {
      case 'projects':
        this.scrollToProjectsSection();
        break;
      case 'services':
        this.scrollToServiceSection();
        break;
      case 'about':
        console.log('about');
        this.scrollToAboutMeSection();
        break;
      case 'contact':
        console.log('contact');
        this.scrollToContactMeSection();
        break;
    }
  }

  onSubmitContactForm() {
    if (this.contactForm.valid) {
      const formData = new FormData();
      formData.append('name', this.contactForm.get('name')?.value);
      formData.append('email', this.contactForm.get('email')?.value);
      formData.append('phone', this.contactForm.get('phone')?.value);
      formData.append('reference', this.contactForm.get('reference')?.value);
      formData.append('message', this.contactForm.get('message')?.value);
      formData.append('access_key', environment.FORMS_API_KEY);

      this.http.post('https://api.web3forms.com/submit', formData).subscribe(
        (response) => {
          this.mailSendSuccessfully = true;
          this.contactForm.reset();
        },
        (error) => {
          console.error('Fehler beim Absenden des Formulars', error);
        }
      );
    }
  }

  showAppImages(selectedApp: string) {
    switch (selectedApp) {
      case 'app1':
        this.images = this.app1;
        this.selectedApp = selectedApp;
        break;
      case 'app2':
        this.images = this.app2;
        this.selectedApp = selectedApp;
        break;
      case 'app3':
        this.images = this.app3;
        this.selectedApp = selectedApp;
        break;
    }
    this.swiper.nativeElement.swiper.slideTo(0);
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }

  openImages() {
    this.isImagesOpen = true;
  }

  isImageViewerClosed() {
    this.isImagesOpen = false;
  }
  currentYearLong(): number {
    return new Date().getFullYear();
  }

  openImpressum() {
    this.router.navigate(['impressum']);
  }
  openDatenschutz() {
    this.router.navigate(['datenschutz']);
  }
}
