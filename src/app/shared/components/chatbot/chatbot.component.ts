import { Component, inject, ViewChild, ElementRef, AfterViewChecked, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatResponse } from '../../services/chat.service';
import { AuthService } from '../../../core/auth/auth.service';

interface ChatBubble {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolsUsed?: string[];
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  private chatService = inject(ChatService);
  public authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  isOpen = false;
  isLoading = false;
  userMessage = '';
  messages: ChatBubble[] = [];
  private shouldScroll = false;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.messages.length === 0) {
      // Hoş geldin mesajı
      const role = this.authService.getRole();
      let greeting = 'Merhaba! 👋 Size nasıl yardımcı olabilirim?';

      if (role) {
        const roleUpper = typeof role === 'string' ? role.toUpperCase() : '';
        if (roleUpper.includes('SELLER')) {
          greeting = 'Merhaba! 👋 Mağazanız hakkında size nasıl yardımcı olabilirim? Sipariş durumlarını kontrol edebilir, stok güncellemesi yapabilir veya ürün yorumlarını inceleyebilirim.';
        } else if (roleUpper.includes('ADMIN')) {
          greeting = 'Merhaba Admin! 👋 Platform yönetimi konusunda size nasıl yardımcı olabilirim?';
        } else {
          greeting = 'Merhaba! 👋 Ürün aramanızda, sipariş takibinde veya sepet işlemlerinizde yardımcı olabilirim. Ne aramıştınız?';
        }
      }

      this.messages.push({
        role: 'assistant',
        content: greeting,
        timestamp: new Date()
      });
    }

    // Focus input after opening
    if (this.isOpen) {
      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 300);
    }
  }

  sendMessage(): void {
    const msg = this.userMessage.trim();
    if (!msg || this.isLoading) return;

    // Kullanıcı mesajını ekle
    this.messages.push({
      role: 'user',
      content: msg,
      timestamp: new Date()
    });

    this.userMessage = '';
    this.isLoading = true;
    this.shouldScroll = true;

    this.chatService.sendMessage(msg).subscribe({
      next: (response: ChatResponse) => {
        this.messages.push({
          role: 'assistant',
          content: response.reply,
          toolsUsed: response.toolsUsed,
          timestamp: new Date()
        });
        this.isLoading = false;
        this.shouldScroll = true;
      },
      error: (err) => {
        console.error('Chat hatası:', err);
        let errorMsg = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        if (err.status === 401) {
          errorMsg = 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.';
        } else if (err.status === 0) {
          errorMsg = 'Sunucuya bağlanılamadı. Backend çalışıyor mu?';
        }
        this.messages.push({
          role: 'system',
          content: errorMsg,
          timestamp: new Date()
        });
        this.isLoading = false;
        this.shouldScroll = true;
      }
    });
  }

  clearChat(): void {
    this.chatService.clearHistory().subscribe({
      next: () => {
        this.messages = [];
        this.messages.push({
          role: 'assistant',
          content: 'Konuşma sıfırlandı. Size nasıl yardımcı olabilirim? 😊',
          timestamp: new Date()
        });
      },
      error: () => {
        // Sunucu hatası olsa bile yerel geçmişi temizle
        this.messages = [];
        this.messages.push({
          role: 'assistant',
          content: 'Konuşma sıfırlandı.',
          timestamp: new Date()
        });
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {}
  }

  getToolLabel(tool: string): string {
    const labels: Record<string, string> = {
      'search_products': '🔍 Ürün Arama',
      'get_product_details': '📦 Ürün Detay',
      'get_categories': '🏷️ Kategoriler',
      'get_my_orders': '📋 Siparişler',
      'get_order_status': '📊 Sipariş Durumu',
      'get_my_cart': '🛒 Sepet',
      'add_to_cart': '➕ Sepete Ekleme',
      'get_my_favorites': '❤️ Favoriler',
      'get_store_orders': '📦 Mağaza Siparişleri',
      'update_order_status': '✏️ Durum Güncelleme',
      'get_my_store_products': '🏪 Mağaza Ürünleri',
      'update_variant_stock': '📊 Stok Güncelleme',
      'get_product_reviews': '⭐ Yorumlar'
    };
    return labels[tool] || tool;
  }
}
