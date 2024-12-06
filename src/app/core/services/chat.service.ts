import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Message, ChatGptModel } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages = new BehaviorSubject<Message[]>([]);
  messages$ = this.messages.asObservable();

  private historial = new BehaviorSubject<ChatGptModel[]>([]);
  historial$ = this.historial.asObservable();

  constructor(private apiService: ApiService) {
    this.cargarHistorial();
  }

  // Cargar historial de consultas
  private cargarHistorial() {
    this.apiService.getActiveConsultas().subscribe(
      (data) => {
        this.historial.next(data);
        const messages: Message[] = [];
        data.forEach((consulta) => {
          messages.push({
            content: consulta.consulta,
            isUser: true,
            timestamp: new Date(consulta.hora),
          });
          messages.push({
            content: consulta.respuesta,
            isUser: false,
            timestamp: new Date(consulta.hora),
          });
        });
        this.messages.next(messages);
      },
      (error) => console.error("Error al cargar historial:", error)
    );
  }

  // Enviar mensaje
  sendMessage(content: string) {
    const currentMessages = this.messages.getValue();

    const userMessage: Message = {
      content,
      isUser: true,
      timestamp: new Date(),
    };

    this.messages.next([...currentMessages, userMessage]);

    this.apiService.sendConsulta(content).subscribe(
      (response: string) => {
        const botMessage: Message = {
          content: response,
          isUser: false,
          timestamp: new Date(),
        };

        this.messages.next([...this.messages.getValue(), botMessage]);
        this.cargarHistorial();
      },
      (error) => {
        console.error("Error al obtener respuesta:", error);
        const errorMessage: Message = {
          content: "Lo siento, ha ocurrido un error al procesar tu consulta.",
          isUser: false,
          timestamp: new Date(),
        };
        this.messages.next([...this.messages.getValue(), errorMessage]);
      }
    );
  }

  // Limpiar conversación
  clearConversation() {
    this.messages.next([]);
  }

  // Obtener consultas inactivas
  getInactiveConsultas(): Observable<ChatGptModel[]> {
    return this.apiService.getInactiveConsultas();
  }

  // Obtener historial
  getHistorial(): Observable<ChatGptModel[]> {
    return this.historial$;
  }

  // Cargar conversación por ID
  loadConversation(id: number) {
    this.apiService.getConsultaById(id).subscribe(
      (consulta) => {
        const messages: Message[] = [
          {
            content: consulta.consulta,
            isUser: true,
            timestamp: new Date(consulta.hora),
          },
          {
            content: consulta.respuesta,
            isUser: false,
            timestamp: new Date(consulta.hora),
          },
        ];
        this.messages.next(messages);
      },
      (error) => console.error("Error al cargar conversación:", error)
    );
  }

  // Desactivar consulta
  deactivateConsulta(id: number) {
    return this.apiService.deactivateConsulta(id);
  }

  // Activar consulta
  activateConsulta(id: number) {
    return this.apiService.activateConsulta(id);
  }

  // Eliminar consulta
  deleteConsulta(id: number) {
    return this.apiService.deleteConsulta(id).subscribe(
      () => {
        this.cargarHistorial();
      },
      (error) => console.error("Error al eliminar consulta:", error)
    );
  }

  // Actualizar consulta
  updateConsulta(id: number, newConsulta: string) {
    return this.apiService.updateConsulta(id, newConsulta).subscribe(
      () => {
        this.cargarHistorial();
      },
      (error) => console.error("Error al actualizar consulta:", error)
    );
  }

  // Obtener conversaciones eliminadas
  getDeletedConversations(): Observable<ChatGptModel[]> {
    return this.getInactiveConsultas();
  }

  // Restaurar conversación eliminada
  restoreConversation(id: number) {
    return this.apiService.activateConsulta(id).subscribe(
      () => {
        console.log(`Consulta con ID ${id} restaurada correctamente`);
        this.cargarHistorial();
      },
      (error) => console.error(`Error al restaurar consulta con ID ${id}:`, error)
    );
  }

  // Editar conversación
  editConversation(id: number, newConsulta: string) {
    this.apiService.updateConsulta(id, newConsulta).subscribe(
      () => {
        this.cargarHistorial();
      },
      (error) => console.error("Error al actualizar consulta:", error)
    );
  }

  // Eliminar (marcar como inactiva) una consulta
  deleteConversation(id: number) {
    this.deactivateConsulta(id).subscribe(
      () => {
        console.log(`Consulta con ID ${id} eliminada correctamente`);
        this.cargarHistorial();
      },
      (error) => console.error(`Error al eliminar consulta con ID ${id}:`, error)
    );
  }
}
