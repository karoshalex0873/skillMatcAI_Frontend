import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JobSeekComponent } from './JobSeeker/job-seek/job-seek.component';
import { StatCardComponent } from './JobSeeker/stat-card/stat-card.component';
import { JobCardComponent } from './JobSeeker/job-card/job-card.component';
import { ApplicationItemComponent } from './JobSeeker/application-item/application-item.component';
import { SkillProfileComponent } from './JobSeeker/skill-profile/skill-profile.component';
import { PortfolioUploadComponent } from './JobSeeker/portfolio-upload/portfolio-upload.component';
import { CareerPathComponent } from './JobSeeker/career-path/career-path.component';
import { DashRecruterComponent } from './Recruiters/dash-recruter/dash-recruter.component';
import { JobPostingComponent } from './Recruiters/job-posting/job-posting.component';
import { CadidateMatchComponent } from './Recruiters/cadidate-match/cadidate-match.component';
import { QuerryDatabaseComponent } from './Recruiters/querry-database/querry-database.component';
import { ScheduleConductInterviewsComponent } from './Recruiters/schedule-conduct-interviews/schedule-conduct-interviews.component';
import { HireAnalyticsComponent } from './Recruiters/hire-analytics/hire-analytics.component';
import { AdminDashbordComponent } from './Admins/admin-dashbord/admin-dashbord.component';
import { ManageUsersComponent } from './Admins/manage-users/manage-users.component';
import { SystemPerformanceComponent } from './Admins/system-performance/system-performance.component';
import { AiAcurracyComponent } from './Admins/ai-acurracy/ai-acurracy.component';
import { PlatformSecurityComponent } from './Admins/platform-security/platform-security.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'jobs', component: JobSeekComponent, children: [
      { path: 'starts', component: StatCardComponent },
      { path: 'aut', component: JobCardComponent },
      { path: 'applications', component: ApplicationItemComponent },
      { path: 'profile', component: SkillProfileComponent },
      { path: 'Notifications', component: PortfolioUploadComponent },
      { path: 'careerPath', component: CareerPathComponent },
    ]
  },
  {
    path: 'hire', component: DashRecruterComponent, children: [
      { path: 'postJob', component: JobPostingComponent },
      { path: 'hireApplicants', component: CadidateMatchComponent },
      { path: 'querry', component: QuerryDatabaseComponent },
      { path: 'interviews', component: ScheduleConductInterviewsComponent },
      { path: 'analytics', component: HireAnalyticsComponent }
    ]
  },
  {
    path:'admin',component:AdminDashbordComponent,children:[
      {path:'users',component:ManageUsersComponent},
      {path:'system',component:SystemPerformanceComponent},
      {path:'aiAccuracy',component:AiAcurracyComponent},
      {path:'security',component:PlatformSecurityComponent}
    ]
  }
];
