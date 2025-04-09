import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-hire-analytics',
  imports: [CommonModule, IconsModule],
  templateUrl: './hire-analytics.component.html',
  styleUrl: './hire-analytics.component.css'
})
export class HireAnalyticsComponent implements AfterViewInit {
  @ViewChild('hiringTrendsChart', { static: false }) 
  hiringTrendsChartRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('sourcesChart', { static: false }) 
  sourcesChartRef!: ElementRef<HTMLCanvasElement>;

  recentApplications = [
    { name: 'John Doe', position: 'Senior Developer', status: 'In Process' },
    { name: 'Jane Smith', position: 'UX Designer', status: 'Hired' },
    { name: 'Mike Johnson', position: 'Product Manager', status: 'Rejected' }
  ];

  upcomingInterviews = [
    { candidate: 'Sarah Wilson', position: 'Frontend Engineer', date: '2024-03-20', time: '2:30 PM' },
    { candidate: 'Alex Brown', position: 'DevOps Engineer', date: '2024-03-21', time: '10:00 AM' }
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.createHiringTrendsChart();
    this.createSourcesChart();
  }

  createHiringTrendsChart() {
    new Chart(this.hiringTrendsChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Hires',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: '#6366f1',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(99, 102, 241, 0.1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
          y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
        }
      }
    } as ChartConfiguration);
  }

  createSourcesChart() {
    new Chart(this.sourcesChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Job Boards', 'Referrals', 'Social Media', 'Career Site'],
        datasets: [{
          data: [35, 25, 20, 20],
          backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
          borderColor: '#0f172a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: '#fff' } } }
      }
    } as ChartConfiguration);
  }
}