import { query } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { environment } from '../../helpers/environment';
import { JobService } from '../../service/job.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of, catchError, firstValueFrom } from 'rxjs';

interface ApiResponse {
  success: boolean;
  message: string;
  type: 'chat' | 'jobs' | 'applications' | 'interviews' | 'error';
  data?: any[];
}

interface ConversationEntry {
  type: 'user' | 'ai' | 'processing' | 'error';
  content: string;
  data?: any;
  suggestions?: string[];
  context?: any;
  timestamp: Date;
}

@Component({
  selector: 'app-querry-database',
  standalone: true,
  imports: [CommonModule, FormsModule, IconsModule],
  templateUrl: './querry-database.component.html',
  styleUrl: './querry-database.component.css'
})
export class QuerryDatabaseComponent {
  userQuery = '';
  conversationHistory: ConversationEntry[] = [];
  loading = false;

  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLElement>;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  private sendQuery(query: string): Observable<ApiResponse> {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return of({
        success: false,
        type: 'error',
        message: 'Authentication token not found'
      } as ApiResponse);
    }

    return this.http.post<ApiResponse>(
      `${environment.apiUrl}/jobs/ask`,
      { question: query },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return of({
          success: false,
          type: 'error',
          message: error.status === 0 
            ? 'Network error. Please check your connection.'
            : 'Failed to fetch data. Please try again.'
        } as ApiResponse);
      })
    );
  }

  async submitQuery(): Promise<void> {
    const trimmedQuery = this.userQuery.trim();
    if (!trimmedQuery || this.loading) return;

    // Clear previous errors
    this.conversationHistory = this.conversationHistory.filter(e => e.type !== 'error');

    // Add user message
    this.conversationHistory.push({
      type: 'user',
      content: trimmedQuery,
      timestamp: new Date()
    });

    // Add processing indicator
    const processingEntry: ConversationEntry = {
      type: 'processing',
      content: 'Processing your request...',
      timestamp: new Date()
    };
    this.conversationHistory.push(processingEntry);

    this.userQuery = '';
    this.loading = true;

    try {
      const response = await firstValueFrom(this.sendQuery(trimmedQuery));

      // Remove processing indicator
      this.conversationHistory = this.conversationHistory.filter(e => e !== processingEntry);

      this.conversationHistory.push({
        type: !response?.success ? 'error' : 'ai',
        content: response?.message || 'Request failed',
        data: response?.data,
        timestamp: new Date()
      });
    } catch (error) {
      this.conversationHistory = this.conversationHistory.filter(e => e !== processingEntry);
      this.conversationHistory.push({
        type: 'error',
        content: 'Service unavailable. Please try again later.',
        timestamp: new Date()
      });
    } finally {
      this.loading = false;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatResponse(text: string): SafeHtml {
    const formattedText = text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }
}