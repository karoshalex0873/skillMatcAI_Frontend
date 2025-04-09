import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-ai-acurracy',
  imports: [CommonModule, IconsModule],
  templateUrl: './ai-acurracy.component.html',
  styleUrl: './ai-acurracy.component.css'
})
export class AiAcurracyComponent {
  @ViewChild('accuracyChart') accuracyChartRef!: ElementRef<HTMLCanvasElement>;

  confusionMatrix = [
    95, 2, 1, 3,
    1, 89, 4, 2,
    2, 3, 92, 1,
    1, 2, 1, 94
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.createAccuracyChart();
  }

  createAccuracyChart() {
    new Chart(this.accuracyChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Accuracy',
          data: [82, 85, 88, 90, 91, 92.4],
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
          y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#fff' },
            min: 80,
            max: 100
          }
        }
      }
    } as ChartConfiguration);
  }
}
