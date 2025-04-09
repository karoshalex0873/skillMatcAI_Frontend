import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-system-performance',
  imports: [CommonModule,IconsModule],
  templateUrl: './system-performance.component.html',
  styleUrl: './system-performance.component.css'
})
export class SystemPerformanceComponent {
  @ViewChild('cpuChart') cpuChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('memoryChart') memoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('diskChart') diskChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('networkChart') networkChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('resourceChart') resourceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('storageChart') storageChartRef!: ElementRef<HTMLCanvasElement>;


  metrics = {
    cpu: 45,
    memory: 68,
    disk: 22,
    network: 12.4
  };

  services = [
    { name: 'Web Server', status: 'online' },
    { name: 'Database', status: 'degraded' },
    { name: 'Cache', status: 'online' },
    { name: 'Auth Service', status: 'offline' }
  ];

  activityLog = [
    { type: 'info', message: 'System check completed', timestamp: new Date() },
    { type: 'warning', message: 'High memory usage detected', timestamp: new Date() },
    { type: 'error', message: 'Database connection lost', timestamp: new Date() }
  ];

  lastUpdated = new Date();
  private updateInterval: any;


  constructor(){
    Chart.register(...registerables)
  }
  ngAfterViewInit() {
    this.createSparklineCharts();
    this.createResourceChart();
    this.createStorageChart();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  startAutoRefresh() {
    this.updateInterval = setInterval(() => {
      this.refreshMetrics();
    }, 5000);
  }

  refreshMetrics(){
    // Simulate metric updates
    this.metrics={
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
      network: Math.random() * 20
    }
    this.lastUpdated = new Date();
    this.updateCharts();
  }

  getEventIcon(type: string): string {
    switch(type) {
      case 'error': return 'ionAlertCircle';
      case 'warning': return 'ionWarning';
      default: return 'ionInformationCircle';
    }
  }

  createSparklineCharts() {
    this.createSparkline(this.cpuChartRef.nativeElement, '#6366f1');
    this.createSparkline(this.memoryChartRef.nativeElement, '#10b981');
    this.createSparkline(this.diskChartRef.nativeElement, '#f59e0b');
    this.createSparkline(this.networkChartRef.nativeElement, '#ef4444');
  }

  createSparkline(canvas: HTMLCanvasElement, color: string) {
    new Chart(canvas, {
      type:'line',
      data: {
        labels: Array(20).fill(''),
        datasets: [{
          data: Array(20).fill(0).map(() => Math.random() * 100),
          borderColor: color,
          tension: 0.4,
          fill: false,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    } as ChartConfiguration);
  }

  createResourceChart() {
    new Chart(this.resourceChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: Array(24).fill('').map((_, i) => `${i}:00`),
        datasets: [
          {
            label: 'CPU Usage',
            data: Array(24).fill(0).map(() => Math.random() * 100),
            borderColor: '#6366f1',
            tension: 0.4
          },
          {
            label: 'Memory Usage',
            data: Array(24).fill(0).map(() => Math.random() * 100),
            borderColor: '#10b981',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#fff' } } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
          y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } }
        }
      }
    } as ChartConfiguration);
  }


  createStorageChart() {
    new Chart(this.storageChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['System', 'Apps', 'Data', 'Backups'],
        datasets: [{
          label: 'Storage (GB)',
          data: [120, 240, 180, 80],
          backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444']
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

  updateCharts() {
    // Implement chart data updates here
  }

}
