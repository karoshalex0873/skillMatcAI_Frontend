import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IconsModule } from '../../helpers/icons.module';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AiAccuracyService } from '../../service/ai-accuracy.service';

interface AccuracyMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[];
  version: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-ai-acurracy',
  imports: [CommonModule, IconsModule],
  templateUrl: './ai-acurracy.component.html',
  styleUrl: './ai-acurracy.component.css'
})
export class AiAcurracyComponent {
  @ViewChild('performanceChart') performanceChartRef!: ElementRef<HTMLCanvasElement>;
  
  metrics: AccuracyMetrics = {
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    confusionMatrix: [0, 0, 0, 0],
    version: '0.0.0',
    lastUpdated: new Date().toISOString()
  };

  accuracyImprovement = 0.042; // 4.2% improvement
  historicalData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [0.82, 0.85, 0.88, 0.90, 0.91, 0.924]
  };

  constructor(private accuracyService: AiAccuracyService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.accuracyService.getMetrics().subscribe({
      next: (data) => {
        this.metrics = data.metrics;
        this.createPerformanceChart();
      },
      error: (err) => console.error('Failed to load metrics:', err)
    });
  }

  get confusionMatrixDisplay(): number[] {
    // Format: [True Positives, False Positives, False Negatives, True Negatives]
    return this.metrics.confusionMatrix;
  }

  private createPerformanceChart(): void {
    if (!this.performanceChartRef?.nativeElement) return;

    new Chart(this.performanceChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.historicalData.labels,
        datasets: [
          {
            label: 'Accuracy',
            data: this.historicalData.values.map(v => v * 100),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Precision',
            data: this.historicalData.values.map(v => (v * 100) - 2),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            borderDash: [5, 5]
          },
          {
            label: 'Recall',
            data: this.historicalData.values.map(v => (v * 100) - 1),
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.4,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e2e8f0',
              font: {
                family: 'Inter'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => 
                `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#e2e8f0' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { 
              color: '#e2e8f0',
              callback: (value) => `${value}%`
            },
            min: 75,
            max: 100
          }
        }
      }
    } as ChartConfiguration);
  }
}
