import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../core/services/chat.service';
import { ChatGptModel } from '../core/models/chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  newMessage = '';
  isLoading = false;
  isShowingDeleted = false;
  messages$ = this.chatService.messages$;
  historial$ = this.chatService.getHistorial(); // Obtenemos el historial
  deletedHistorial$ = this.chatService.getDeletedConversations();
  editMode = false;
  editConsultaId: number | null = null;
  editContent = '';
  selectedMenuId: number | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.clearConversation();
    // Verificamos si se obtienen datos del historial
    this.historial$.subscribe(
      data => {
        console.log('Historial cargado:', data);
      },
      error => {
        console.error('Error al cargar el historial:', error);
      }
    );
  }

  async sendMessage() {
    if (this.newMessage.trim() && !this.isLoading) {
      this.isLoading = true;
      await this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
      this.isLoading = false;
    }
  }

  clearConversation() {
    this.chatService.clearConversation();
  }

  loadConversation(id: number | undefined) {
    if (id !== undefined) {
      this.chatService.loadConversation(id);
    }
  }

  toggleDeletedView() {
    this.isShowingDeleted = !this.isShowingDeleted;
    this.selectedMenuId = null;
  }

  startEditing(consulta: ChatGptModel) {
    this.editMode = true;
    this.editConsultaId = consulta.id ?? null;
    this.editContent = consulta.consulta;
    this.selectedMenuId = null;
  }

  saveEdit() {
    if (this.editConsultaId !== null && this.editContent.trim()) {
      this.chatService.editConversation(this.editConsultaId, this.editContent);
      this.editMode = false;
      this.editConsultaId = null;
      this.editContent = '';
      this.selectedMenuId = null;
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.editConsultaId = null;
    this.editContent = '';
    this.selectedMenuId = null;
  }

  deleteConversation(id: number | undefined) {
    if (id !== undefined) {
      this.chatService.deleteConversation(id);
      this.selectedMenuId = null;
    }
  }

  restoreConversation(id: number | undefined) {
    if (id !== undefined) {
      this.chatService.restoreConversation(id);
      this.selectedMenuId = null;
    }
  }

  toggleMenu(id: number | null): void {
    if (id !== null) {
      this.selectedMenuId = this.selectedMenuId === id ? null : id;
    }
  }

  showRestoreOnly() {
    return this.isShowingDeleted;
  }
}
