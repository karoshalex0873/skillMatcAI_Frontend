import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconsModule } from '../../helpers/icons.module';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, IconsModule, RouterModule],  // Import only RouterModule here
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {

  constructor(private route: ActivatedRoute) {
  }

  starts = [
    {
      title: "Jobs Matched",
      StartsNum: 3,
      icon: "ionBriefcase",
      description: "Hey you have 3 matched jobs please check them out and land to your dream job 🙏",
      btn_text: "view",
      route: 'start'
    },
    {
      title: "Applications",
      StartsNum: 1,
      icon: "ionDocuments",
      description: "Check out your recent applications or make more to increase chances of getting hired",
      btn_text: "apply",
      route: 'aut'
    },
    {
      title: "Skill Profile",
      StartsNum: "86% Complete",
      icon: "ionPerson",
      description: "Update your skills profile to boost your matches",
      btn_text: "update"
    },
    {
      title: "Notifications",
      StartsNum: 5,
      icon: "ionNotifications",
      description: "Read ",
      btn_text: "read"
    },
    {
      title: "Career path",
      StartsNum: '50% Completion',
      icon: "ionJournal",
      description: "Continue with your career journey",
      btn_text: "customize"
    }
  ]
}
