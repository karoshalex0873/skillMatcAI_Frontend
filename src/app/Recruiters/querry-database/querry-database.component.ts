import { query } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { environment } from '../../helpers/environment';
import { JobService } from '../../service/job.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface ApiResponse {
  type: string;
  content: string;
  data?: any[];
  dataQuery?: any;
  suggestions?: string[];
  context?: any;
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
  imports: [CommonModule, FormsModule, IconsModule],
  templateUrl: './querry-database.component.html',
  styleUrl: './querry-database.component.css'
})
export class QuerryDatabaseComponent {

  userQuery = '';
  conversationHistory: ConversationEntry[] = [];
  loading = false;

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor(
    private queryAIService: JobService,
    private sanitizer: DomSanitizer
  ) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  async submitQuery() {
    if (!this.userQuery.trim() || this.loading) return;

    // Clear previous errors
    this.conversationHistory = this.conversationHistory.filter(e => e.type !== 'error');

    // Add user message
    this.conversationHistory.push({
      type: 'user',
      content: this.userQuery,
      timestamp: new Date()
    });

    // Add processing indicator
    const processingEntry: ConversationEntry = {
      type: 'processing',
      content: 'Processing...',
      timestamp: new Date()
    };
    this.conversationHistory.push(processingEntry);

    const queryText = this.userQuery;
    this.userQuery = '';
    this.loading = true;

    try {
      const response = await this.queryAIService.sendQuery(queryText).toPromise() as ApiResponse;

      // Remove processing indicator
      this.conversationHistory = this.conversationHistory.filter(e => e !== processingEntry);

      if (response?.type === 'error') {
        this.conversationHistory.push({
          type: 'error',
          content: response.content || 'Request failed',
          timestamp: new Date()
        });
      } else {
        this.conversationHistory.push({
          type: 'ai',
          content: response?.content || 'No response received',
          data: response?.data,       // ✅ Correct property
          suggestions: response?.suggestions,
          timestamp: new Date()
        });
      }

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
  handleSuggestion(suggestion: string) {
    this.userQuery = suggestion;
    this.submitQuery();
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
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\d+\.)\s/g, '<span class="list-number">$1</span> ')
      .replace(/📋/g, '<span class="response-icon">📋</span>')
      .replace(/📅/g, '<span class="date-icon">📅</span>');

    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }

}
