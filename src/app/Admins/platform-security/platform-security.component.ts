import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { IconsModule } from '../../helpers/icons.module';
import { SecurityService } from '../../service/security.service';

@Component({
  selector: 'app-platform-security',
  imports: [CommonModule, IconsModule],
  templateUrl: './platform-security.component.html',
  styleUrl: './platform-security.component.css'
})
export class PlatformSecurityComponent {
  @ViewChild('threatChart') threatChartRef!: ElementRef<HTMLCanvasElement>;

  securityLevel = 'Loading...';

  metrics = {
    activeThreats: 0,
    securityScore: 0,
    updatesAvailable: 0,
    dataEncryption: 0
  };
  securityEvents: any[] = [];
  threatChartData: any;

  constructor(
    private securityService:SecurityService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadSecurityData();
  }

  loadSecurityData(){
    this.securityService.getSecurityData().subscribe({
      next:(data)=>{
        this.securityLevel = data.securityLevel;
        this.metrics = data.metrics;
        this.securityEvents = data.recentEvents;
        this.threatChartData = data.threatChartData;
        this.createThreatChart();
      },
      error: (err) => console.error('Error loading security data:', err)
    })
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'login_attempt': return 'ionWarning';
      case 'patch': return 'ionCheckmarkCircle';
      case 'threat': return 'ionAlertCircle';
      default: return 'ionInformationCircle';
    }
  }

  createThreatChart() {
    if (!this.threatChartData) return;

    new Chart(this.threatChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.threatChartData.labels,
        datasets: [{
          label: 'Threats Detected',
          data: this.threatChartData.data,
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
    });
  }

  
}
