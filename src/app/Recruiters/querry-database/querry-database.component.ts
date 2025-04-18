import { query } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';
import { environment } from '../../helpers/environment';
import { JobService } from '../../service/job.service';

interface ResultItem {
  id: string;
  name?: string;
  email?: string;
  skills?: string[];
  title?: string;
  company?: string;
  location?: string;
  experience?: string;
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
  imports: [CommonModule,FormsModule,IconsModule],
  templateUrl: './querry-database.component.html',
  styleUrl: './querry-database.component.css'
})
export class QuerryDatabaseComponent {

  userQuery = '';
  conversationHistory: ConversationEntry[] = [];
  loading = false;

  @ViewChild('chatContainer') private chatContainer!:ElementRef

  constructor(private queryAIService:JobService ){}


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }



  async submitQuery() {
    if (!this.userQuery.trim() || this.loading) return;
  
    // Add user message
    this.conversationHistory.push({
      type: 'user',
      content: this.userQuery,
      timestamp: new Date()
    });

    this.conversationHistory.push({
      type: 'processing',
      content: 'Processing your query...',
      timestamp: new Date()
    });
  
    const queryText = this.userQuery;
    this.userQuery = '';
    this.loading = true;
  
    try {
      const response = await this.queryAIService.sendQuery(queryText).toPromise();

      this.conversationHistory = this.conversationHistory.filter(e => e.type !== 'processing');

      // Add AI response
      this.conversationHistory.push({
        type: 'ai',
        content: response?.data?.content ?? 'No response content available',
        data: response?.data ?? null,
        suggestions: response?.data?.suggestions ?? [],
        timestamp: new Date()
      });
  
    } catch (error) {
      this.conversationHistory .push({
        type: 'error',
        content: 'Sorry, I encountered an error processing your request.',
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
  
}
