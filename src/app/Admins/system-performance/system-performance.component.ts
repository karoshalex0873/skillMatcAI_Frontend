import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subscription, interval } from 'rxjs';
import { PerformanceService } from '../../service/performance.service';

@Component({
  selector: 'app-system-performance',
  imports: [CommonModule, IconsModule],
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

  // Chart instances
  private cpuChart?: Chart;
  private memoryChart?: Chart;
  private diskChart?: Chart;
  private networkChart?: Chart;
  private resourceChart?: Chart;
  private storageChart?: Chart;

  // Data stores
  metrics = {
    cpu: '0',
    memory: '0',
    disk: '0',
    network: '0',
    disks: [] as any[],
    timestamp: new Date()
  };

  historicalData = {
    cpu: [] as number[],
    memory: [] as number[],
    disk: [] as number[],
    network: [] as number[],
    timestamps: [] as string[]
  };

  performanceBudgets: any;
  optimizationTips: string[] = [];
  serviceStatus: any[] = [];
  activityLog: { type: string; message: string; timestamp: Date }[] = [];
  lastUpdated = new Date();
  private updateSubscription?: Subscription;
  private readonly MAX_DATA_POINTS = 5;

  constructor(private performanceService: PerformanceService) { 
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
  }
  

  ngOnInit() {
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
    [this.cpuChart, this.memoryChart, this.diskChart, this.networkChart, this.resourceChart, this.storageChart]
      .forEach(chart => chart?.destroy());
  }

  private initializeCharts() {
    this.cpuChart = this.createSparkline(this.cpuChartRef.nativeElement, '#6366f1');
    this.memoryChart = this.createSparkline(this.memoryChartRef.nativeElement, '#10b981');
    this.diskChart = this.createSparkline(this.diskChartRef.nativeElement, '#f59e0b');
    this.networkChart = this.createSparkline(this.networkChartRef.nativeElement, '#ef4444');
    this.resourceChart = this.createResourceChart();
    this.storageChart = this.createStorageChart();
  }

  private startAutoRefresh() {
    // Initial load
    this.refreshMetrics();

    // Periodic updates
    this.updateSubscription = interval(5000).subscribe({
      next: () => this.refreshMetrics()
    });
  }

  refreshMetrics() {
    this.performanceService.getPerformance().subscribe({
      next: (res: any) => {
        this.metrics = res.data.metrics;
  
        this.metrics.disks = res.data.metrics.disk;
  
        this.performanceBudgets = res.data.performanceBudgets;
        this.optimizationTips = res.data.optimizationTips;
        this.serviceStatus = res.data.services;
  
        this.updateHistoricalData();
        this.updateAlerts(res.data.alerts);
        this.updateAllCharts();
        this.lastUpdated = new Date();
      },
      error: (err) => console.error('Error fetching metrics:', err)
    });
  }
  

  private updateHistoricalData() {
    const addDataPoint = (arr: number[], value: string, max: number) => {
      arr.push(parseFloat(value));
      if (arr.length > max) arr.shift();
    };

    addDataPoint(this.historicalData.cpu, this.metrics.cpu, this.MAX_DATA_POINTS);
    addDataPoint(this.historicalData.memory, this.metrics.memory, this.MAX_DATA_POINTS);
    addDataPoint(this.historicalData.disk, this.metrics.disk, this.MAX_DATA_POINTS);
    addDataPoint(this.historicalData.network, this.metrics.network, this.MAX_DATA_POINTS);

    // Update timestamps
    this.historicalData.timestamps.push(new Date().toLocaleTimeString());
    if (this.historicalData.timestamps.length > this.MAX_DATA_POINTS) {
      this.historicalData.timestamps.shift();
    }
  }

  private updateAlerts(alerts: string[]) {
    alerts.forEach(alert => {
      this.activityLog.unshift({
        type: 'warning',
        message: alert,
        timestamp: new Date()
      });
    });

    // Keep only last 10 alerts
    if (this.activityLog.length > 10) this.activityLog.pop();
  }

  private createSparkline(canvas: HTMLCanvasElement, color: string): Chart {
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          data: [],
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

  private createResourceChart(): Chart {
    return new Chart(this.resourceChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'CPU Usage',
            data: [],
            borderColor: '#6366f1',
            tension: 0.1
          },
          {
            label: 'Memory Usage',
            data: [],
            borderColor: '#10b981',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#fff',
              font: { family: 'Inter' }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#fff', font: { family: 'Inter' } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#fff', font: { family: 'Inter' } }
          }
        }
      }
    } as ChartConfiguration);
  }

  private createStorageChart(): Chart {
    return new Chart(this.storageChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Usage %',
          data: [],
          backgroundColor: '#6366f1'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}%`
            }
          }
        },
        scales: {
          x: {
            max: 100,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#fff', font: { family: 'Inter' } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#fff', font: { family: 'Inter' } }
          }
        }
      }
    } as ChartConfiguration);
  }

  private updateAllCharts() {
    this.updateSparklineChart(this.cpuChart, this.historicalData.cpu);
    this.updateSparklineChart(this.memoryChart, this.historicalData.memory);
    this.updateSparklineChart(this.diskChart, this.historicalData.disk);
    this.updateSparklineChart(this.networkChart, this.historicalData.network);

    if (this.resourceChart) {
      this.resourceChart.data.labels = this.historicalData.timestamps;
      this.resourceChart.data.datasets[0].data = this.historicalData.cpu;
      this.resourceChart.data.datasets[1].data = this.historicalData.memory;
      this.resourceChart.update();
    }

    if (this.storageChart && this.metrics.disks) {
      this.storageChart.data.labels = this.metrics.disks.map(d => d.mount);
      this.storageChart.data.datasets[0].data =
        this.metrics.disks.map(d => parseFloat(d.usage));
      this.storageChart.update();
    }
  }

  private updateSparklineChart(chart: Chart | undefined, data: number[]) {
    if (chart) {
      chart.data.labels = this.historicalData.timestamps;
      chart.data.datasets[0].data = data;
      chart.update();
    }
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'error': return 'ionAlertCircle';
      case 'warning': return 'ionWarning';
      default: return 'ionInformationCircle';
    }
  }

  formatPercentage(value: string): string {
    return `${parseFloat(value).toFixed(1)}%`;
  }
}
