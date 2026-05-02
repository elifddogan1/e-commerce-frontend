import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface ChatMessageRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  toolsUsed: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/chat`;

  /**
   * Chatbot'a mesaj gönderir ve yanıt alır.
   * JWT interceptor otomatik olarak token ekler.
   */
  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { message } as ChatMessageRequest);
  }

  /**
   * Konuşma geçmişini temizler.
   */
  clearHistory(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/history`);
  }
}
