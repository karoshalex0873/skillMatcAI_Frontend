import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NavbarComponent,RouterLink,RouterModule], // ✅ REMOVE ActivatedRoute here
  templateUrl: './landing.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('1000ms linear', style({ transform: 'translateX(100%)' })),
      ]),
      transition(':leave', [
        animate('1000ms linear', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class LandingComponent {


  imagePath =
    'https://img.freepik.com/free-psd/business-people-discussing-documents-ideas-meeting-with-smartphone-isolated-background-businesswoman-having-idea-business-technology-concept-3d-render-cartoon-character_1150-61993.jpg?t=st=1743804054~exp=1743807654~hmac=3904dcab82f6c74df2e21baeb393b390e22f7a666e54b3a88b3f3f5c668486cf&w=1380';

  slides = [
    { icon: '🎯', text: 'Get Matched with Opportunities...' },
    { icon: '📈', text: 'Track Your Growth & Get Tailored...' },
    { icon: '🛠️', text: 'Create a Smart Skill Profile...' },
    { icon: '🤝', text: 'Connect with Employers...' },
    { icon: '🧠', text: 'SkillMatch AI Learns From You...' },
    { icon: '📋', text: 'Employers: Create Job Posts...' },
    { icon: '🔍', text: 'Employers: Search and Filter...' },
    { icon: '💼', text: 'Employers: Build a Talent Pipeline...' },
  ];

  currentSlideIndex = 0;

  ngOnInit() {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }
}
