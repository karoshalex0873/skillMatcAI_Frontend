import { Component } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../helpers/environment';

interface CareerGoal {
  id: string;
  title: string;
}

@Component({
  selector: 'app-career-path',
  imports: [IconsModule, CommonModule, FormsModule],
  templateUrl: './career-path.component.html',
  styleUrls: ['./career-path.component.css']
})
export class CareerPathComponent {
  // User Inputs
  selectedSkills: string[] = [];
  selectedGoal = 'frontend';
  selectedTime = 10;
  skillQuery = '';
  skillSuggestions: string[] = [];

  // Dummy data
  allSkills = [
    'HTML', 'CSS', 'JavaScript', 'Angular', 'React', 'Node.js',
    'Python', 'Java', 'SQL', 'Docker', 'AWS', 'TypeScript'
  ];

  // State
  isLoading = false;
  learningPath: any;
  errorMessage = '';
  forcePersist = false;

  careerGoals: CareerGoal[] = [
    { id: 'frontend', title: 'Frontend Developer' },
    { id: 'fullstack', title: 'Full Stack Developer' },
    { id: 'mobile', title: 'Mobile Developer' },
    { id: 'devops', title: 'DevOps Engineer' }
  ];

  timeOptions = [
    { label: '5-10 hours', value: 10 },
    { label: '10-15 hours', value: 15 },
    { label: '15-20 hours', value: 20 },
    { label: '20+ hours', value: 25 }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadSavedPath();
  }

  private loadSavedPath() {
    this.isLoading = true;
    this.http.get<any>(`${environment.apiUrl}/jobs/path`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          if (data.milestones) {
            this.learningPath = this.transformApiData(data);
            this.forcePersist = true;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status !== 404) {
            this.errorMessage = 'Failed to load saved learning path';
          }
        }
      });
  }

  get canGenerate(): boolean {
    return this.selectedSkills.length > 0 && !!this.selectedGoal;
  }

  searchSkills(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.skillSuggestions = this.allSkills.filter(skill =>
      skill.toLowerCase().includes(query)
    ).slice(0, 5);
  }

  addSkill(skill: string) {
    if (!this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
    }
    this.skillQuery = '';
    this.skillSuggestions = [];
  }

  removeSkill(skill: string) {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  }

  generateLearningPath() {
    this.isLoading = true;
    this.errorMessage = '';
    this.forcePersist = true;

    this.http.post<any>(`${environment.apiUrl}/jobs/path`, {
      skills: this.selectedSkills,
      goal: this.selectedGoal,
      time: this.selectedTime
    }, { withCredentials: true }).subscribe({
      next: (data) => {
        this.learningPath = this.transformApiData(data);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to generate learning path';
        this.isLoading = false;
        this.forcePersist = true;
      }
    });
  }

  resetLearningPath() {
    this.isLoading = true;
    this.http.delete(`${environment.apiUrl}/jobs/path`, { withCredentials: true })
      .subscribe({
        next: () => {
          this.learningPath = undefined;
          this.forcePersist = false;
          this.selectedSkills = [];
          this.selectedGoal = 'frontend';
          this.selectedTime = 10;
          this.errorMessage = '';
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete learning path';
          this.isLoading = false;
        }
      });
  }

  private transformApiData(apiData: any) {
      return {
        milestones: apiData.milestones.map((milestone: any) => ({
          ...milestone,
          resources: [
            ...this.mapResources(milestone.resources.articles, 'Article'),
            ...this.mapResources(milestone.resources.videos, 'Video'),
            ...this.mapResources(milestone.resources.projects, 'Project')
          ]
        }))
      };
  }

  private mapResources(urls: string[], type: string) {
    return urls.map(url => ({
      title: this.extractTitleFromUrl(url),
      type: type,
      link: url
    }));
  }

  private extractTitleFromUrl(url: string): string {
    try {
      const parsed = new URL(url);
      const pathParts = parsed.pathname.split('/');
      const lastPart = pathParts.pop() || pathParts[pathParts.length - 1];
      return lastPart
        .replace(/[-_]/g, ' ')
        .replace(/%20/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch {
      return url;
    }
  }

}