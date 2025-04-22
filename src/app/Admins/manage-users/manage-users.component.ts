import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IconsModule } from '../../helpers/icons.module';
import { AnalyticsService } from '../../service/analytics.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { MatDialog, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule, IconsModule, FormsModule,ReactiveFormsModule],
  providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {


  @ViewChild('userGrowthChart', { static: false })
  userGrowthChartRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('rolesChart', { static: false })
  rolesChartRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('userModal') userModal!: TemplateRef<any>;
  userForm!: FormGroup;


  stats = {
    totalUsers: 0,
    activeUsers: 0,
    newSignups: 0,
    adminUsers: 0
  };

  users: any[] = [];
  loading = true;
  error = '';
  pagination: any = {};
  errorMsg = '';
  successMsg = '';
  selectedUserId: string | null = null;
  isEditMode = false;


  // Filters
  searchQuery = '';
  selectedRole = '';
  currentPage = 1;
  itemsPerPage = 5

  // Chart instances
  private userGrowthChart?: Chart;
  private rolesChart?: Chart


  constructor(
    private analyticsService: AnalyticsService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    Chart.register(...registerables)

    this.userForm=this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      active: [false]
    })
  }

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    const params = {
      page: this.currentPage.toString(),
      limit: this.itemsPerPage.toString(),
      search: this.searchQuery,
      role: this.selectedRole
    };

    this.analyticsService.getUsersManagementData(params).subscribe({
      next: (res: any) => {
        this.stats = res.stats;
        this.users = res.users;
        this.pagination = res.pagination;

        this.cd.detectChanges();
        setTimeout(() => {
          this.createCharts(res.charts);
        });

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.loading = false;
      }
    });
  }

  createCharts(charts: any) {
    // Destroy existing charts
    this.userGrowthChart?.destroy();
    this.rolesChart?.destroy();

    // Create User Growth Chart
    if (this.userGrowthChartRef?.nativeElement) {
      this.userGrowthChart = new Chart(this.userGrowthChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: charts.userGrowth.map((g: any) => g.month),
          datasets: [{
            label: 'Total Users',
            data: charts.userGrowth.map((g: any) => g.count),
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
            x: {
              grid: { color: 'rgba(255,255,255,0.1)' },
              ticks: { color: '#fff' }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.1)' },
              ticks: { color: '#fff' }
            }
          }
        } 
      });
    }

    // Create Roles Distribution Chart
    if (this.rolesChartRef?.nativeElement) {
      this.rolesChart = new Chart(this.rolesChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: charts.rolesDistribution.map((r: any) => r.role),
          datasets: [{
            data: charts.rolesDistribution.map((r: any) => r.count),
            backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
            borderColor: '#0f172a'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#fff',
                font: {
                  size: 14
                }
              }
            }
          }
        }
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadData();
  }

  ngOnDestroy() {
    // Clean up charts
    this.userGrowthChart?.destroy();
    this.rolesChart?.destroy();
  }

  addUser() {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.userForm.reset();
    this.errorMsg = '';
    this.successMsg = '';
    this.openModal();
  }
  

  editUser(user: any) {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.userForm.patchValue(user);
    this.errorMsg = '';
    this.successMsg = '';
    this.openModal();
  }
  

  openModal() {
    this.dialog.open(this.userModal);
  }
  

  closeModal() {
    this.dialog.closeAll();
  }
  
  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
  
      if (this.isEditMode && this.selectedUserId) {
        this.userService.updateUser(this.selectedUserId, userData).subscribe({
          next: () => {
            this.closeModal();
            this.loadData();
            this.successMsg = 'User updated successfully!';
            setTimeout(() => this.successMsg = '', 3000);
          },
          error: (err) => {
            this.errorMsg = err.error?.message || 'Failed to update user';
            console.error('Update error:', err);
          }
        });
      } else {
        this.userService.createUser(userData).subscribe({
          next: () => {
            this.closeModal();
            this.loadData();
            this.successMsg = 'User created successfully!';
            setTimeout(() => this.successMsg = '', 3000);
          },
          error: (err) => {
            this.errorMsg = err.error?.message || 'Failed to create user';
            console.error('Create error:', err);
          }
        });
      }
    }
  }
  
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => { 
          this.successMsg = 'User deleted successfully!';
          this.errorMsg = '';
          setTimeout(() => this.successMsg = '', 3000);
          this.loadData();
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Failed to delete user';
          this.successMsg = '';
          console.error('Delete error:', err);
        }
      });
    }
  }
  
  

}
