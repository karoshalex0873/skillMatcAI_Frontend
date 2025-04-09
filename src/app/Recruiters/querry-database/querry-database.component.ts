import { query } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../helpers/icons.module';

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

interface Message {
  role: 'user' | 'ai';
  content: string;
  results?: ResultItem[];
}

@Component({
  selector: 'app-querry-database',
  imports: [CommonModule,FormsModule,HttpClientModule,IconsModule],
  templateUrl: './querry-database.component.html',
  styleUrl: './querry-database.component.css'
})
export class QuerryDatabaseComponent {

  userQuery = '';
  chatHistory: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}
  @ViewChild('chatContainer') private chatContainer!:ElementRef

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
    this.chatHistory.push({
      role: 'user',
      content: this.userQuery,
      timestamp: new Date()
    });

    const queryText = this.userQuery;
    this.userQuery = '';
    this.loading = true;

    try {
      const response = await this.http.post<any>('YOUR_API_ENDPOINT', {
        query: queryText
      }).toPromise();

      // Add AI response
      this.chatHistory.push({
        role: 'ai',
        content: `Here's what I found for "${queryText}":`,
        results: response.data || [],
        timestamp: new Date()
      });

    } catch (error) {
      this.chatHistory.push({
        role: 'ai',
        content: 'Sorry, I encountered an error processing your request.',
        isError: true,
        timestamp: new Date()
      });
    } finally {
      this.loading = false;
    }
  }
}
