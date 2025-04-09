import { Component } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    
    // Simulate API delay
    setTimeout(() => {
      this.learningPath = this.generateDummyPath();
      this.isLoading = false;
    }, 1500);
  }

  private generateDummyPath() {
    const weeks = Math.floor(this.selectedTime / 5);
    const goal = this.careerGoals.find(g => g.id === this.selectedGoal)?.title;

    return {
      milestones: Array.from({ length: weeks }, (_, i) => ({
        week: i + 1,
        title: `Week ${i + 1}: ${goal} Fundamentals`,
        description: `Focus on core ${goal} concepts and practical applications`,
        resources: [
          {
            title: `Introduction to ${goal}`,
            type: 'Video Course',
            link: '#'
          },
          {
            title: `${goal} Best Practices`,
            type: 'Article',
            link: '#'
          },
          {
            title: 'Interactive Coding Exercise',
            type: 'Practice Lab',
            link: '#'
          }
        ]
      }))
    };
  }
}