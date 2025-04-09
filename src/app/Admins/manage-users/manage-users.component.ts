import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { IconsModule } from '../../helpers/icons.module';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule,IconsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
  @ViewChild('userGrowthChart') userGrowthChart!: ElementRef<HTMLCanvasElement>

  @ViewChild('rolesChart') rolesChartRef!: ElementRef<HTMLCanvasElement>;


  users = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'JobSeeker', active: true },
    { name: 'Mike Johnson', email: 'mike@example.com', role: 'Employer', active: false },
    // Add more sample users...
  ];
  constructor() {
    Chart.register(...registerables)
  }
  ngAfterViewInit() {
    this.createUserGrowthChart();
    this.createRolesChart();
  }
  createUserGrowthChart() {
    new Chart(this.userGrowthChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Total Users',
          data: [1500, 1650, 1800, 1950, 2100, 2435],
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

  createRolesChart(){
    new Chart(this.rolesChartRef.nativeElement,{
      type:'doughnut',
      data:{
        labels:["Admins","JobSeeker","Employer"],
        datasets:[{
          data:[23,2300,112],
          backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
          borderColor: '#0f172a'
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
          legend:{position:'right',labels:{color:'#fff'}}
        }
      }
    } as ChartConfiguration)
  }

}
