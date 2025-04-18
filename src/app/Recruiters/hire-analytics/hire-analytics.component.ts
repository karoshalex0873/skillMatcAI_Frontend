import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AnalyticsService } from '../../service/analytics.service';

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

  metrics = {
    totalHires: 0,
    openPositions: 0,
    avgTimeToHire: 0,
    totalApplications: 0
  };



  recentApplications: any[] = [];
  upcomingInterviews: any[] = [];
  loading = true;
  error = '';


  constructor(
    private analyticsService: AnalyticsService,
    private cd: ChangeDetectorRef
  ) {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.loadData();
  }
  loadData() {
    this.analyticsService.getRecruiterAnalytics().subscribe({
      next: (data: any) => {
        this.metrics = data.metrics;
        this.recentApplications = data.recentApplications;
        this.upcomingInterviews = data.upcomingInterviews;
        setTimeout(() => {
          this.cd.detectChanges()
          this.createCharts(data.hiringTrends);
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load analytics data';
        this.loading = false;
      }
    });
  }


  private hiringTrendsChart?: Chart;
  private sourcesChart?: Chart;

  createCharts(hiringTrends: any[]) {


    // Destroy existing charts
    this.hiringTrendsChart?.destroy();
    this.sourcesChart?.destroy();


    if (!this.hiringTrendsChartRef?.nativeElement ||
      !this.sourcesChartRef?.nativeElement) {
      return;
    }






    new Chart(this.hiringTrendsChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: hiringTrends.map(t => t.month),
        datasets: [{
          label: 'Hires',
          data: hiringTrends.map(t => t.count),
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
    })

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
    });
  }
}









