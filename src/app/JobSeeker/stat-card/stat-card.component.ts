import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule, IconsModule,RouterModule,RouterLink],
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  starts = [
    {
      title:"Jobs Matched",
      StartsNum: 3,
      icon: "ionBriefcase",
      description: "Hey you have 3 matched jobs please chek them out and land to your dream job 🙏",
      btn_text:"view",
      route:'start'
    },
    {
      title:"Applications",
      StartsNum: 1,
      icon: "ionDocuments",
      description: "Check out your recent applications or make more to increase chances of getting hired",
      btn_text:"apply",
      route:'aut'
    },
    {
      title:"Skill Profile",
      StartsNum: "86% Complete",
      icon: "ionPerson",
      description: "Update your skills  profile  to boost your matches",
      btn_text:"update"
    },
    {
      title:"Notifications",
      StartsNum: 5,
      icon: "ionNotifications",
      description: "Read ",
      btn_text:"read"
    },
    {
      title:"Career path",
      StartsNum: '50% Completion',
      icon: "ionJournal",
      description: "Continue with your carrer journey",
      btn_text:"customize"
    }
  ]
}
