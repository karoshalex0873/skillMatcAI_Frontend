import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import{ transition, trigger,style, animate} from  '@angular/animations';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './landing.component.html',
  animations: [
    //animate the slider
  trigger('slideInOut',[
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('1000ms linear', style({ transform: 'translateX(100%)' }))
    ])
    ,transition(':leave', [
      animate('1000ms linear', style({ transform: 'translateX(-100%)' }))
    ]),
  ] )
  ]
})
export class LandingComponent {
//image url
imagePath = 'https://img.freepik.com/free-psd/business-people-discussing-documents-ideas-meeting-with-smartphone-isolated-background-businesswoman-having-idea-business-technology-concept-3d-render-cartoon-character_1150-61993.jpg?t=st=1743804054~exp=1743807654~hmac=3904dcab82f6c74df2e21baeb393b390e22f7a666e54b3a88b3f3f5c668486cf&w=1380';
// slides for animation
slides = [
  {
    icon: '🎯',
    text: 'Get Matched with Opportunities Based on Your Unique Skills — Let AI do the searching while you focus on growing.'
  },
  {
    icon: '📈',
    text: 'Track Your Growth & Get Tailored Skill Suggestions to Increase Your Chances of Getting Hired.'
  },
  {
    icon: '🛠️',
    text: 'Create a Smart Skill Profile with AI Assistance — Showcase your abilities beyond your resume.'
  },
  {
    icon: '🤝',
    text: 'Connect with Employers Looking for Your Exact Skillset in Real-Time.'
  },
  {
    icon: '🧠',
    text: 'SkillMatch AI Learns From Your Interactions to Suggest Better Jobs or Candidates Over Time.'
  },
  {
    icon: '📋',
    text: 'Employers: Create Job Posts That Auto-Match the Right Talent Instantly.'
  },
  {
    icon: '🔍',
    text: 'Employers: Search and Filter Candidates Based on Verified Skills and Project History.'
  },
  {
    icon: '💼',
    text: 'Employers: Build a Talent Pipeline and Manage Applicants Seamlessly Through the Dashboard.'
  }
];

// current slide index
currentSlideIndex = 0;

ngOnInit() {
  setInterval(() => {
    this.nextSlide();
  },5000);
}
// next slide function
nextSlide() {
  this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
}
}
