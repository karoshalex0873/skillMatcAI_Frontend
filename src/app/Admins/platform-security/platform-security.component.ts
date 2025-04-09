import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {Chart, ChartConfiguration, registerables } from 'chart.js';
import { IconsModule } from '../../helpers/icons.module';

@Component({
  selector: 'app-platform-security',
  imports: [CommonModule,IconsModule],
  templateUrl: './platform-security.component.html',
  styleUrl: './platform-security.component.css'
})
export class PlatformSecurityComponent {
  @ViewChild('threatChart') threatChartRef!: ElementRef<HTMLCanvasElement>;

  securityEvents = [
    { 
      type: 'intrusion',
      description: 'Suspicious login attempt detected',
      severity: 'high',
      timestamp: new Date()
    },
    {
      type: 'update',
      description: 'Security patch applied',
      severity: 'low',
      timestamp: new Date()
    },
    {
      type: 'breach',
      description: 'Potential data breach prevented',
      severity: 'medium',
      timestamp: new Date()
    }
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.createThreatChart();
  }

  getEventIcon(type: string): string {
    switch(type) {
      case 'intrusion': return 'ionWarning';
      case 'update': return 'ionCheckmarkCircle';
      case 'breach': return 'ionAlertCircle';
      default: return 'ionInformationCircle';
    }
  }

  createThreatChart() {
    new Chart(this.threatChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Threats Detected',
          data: [45, 32, 28, 19, 12, 8],
          borderColor: '#ef4444',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
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
}
