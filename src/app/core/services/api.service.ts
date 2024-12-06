import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ChatGptModel } from "../models/chat.model";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl: string = environment.apigpt_fe;
  // private apiUrl = "https://bookish-space-parakeet-9rx95r7xx772pg5g-8085.app.github.dev/api";
  constructor(private http: HttpClient) {}

  // Enviar consulta a ChatGPT
  sendConsulta(consulta: string): Observable<string> {
    const payload = [
      {
        content: consulta,
        role: "user",
      },
    ];
    return this.http.post(
      `${this.apiUrl}/ask`,
      JSON.stringify(payload),
      { responseType: 'text' } // Especificamos que esperamos texto plano
    );
  }

 // Obtener todas las consultas
  getAllConsultas(): Observable<ChatGptModel[]> {
    return this.http.get<ChatGptModel[]>(this.apiUrl);
  }

  // Obtener consultas activas
  getActiveConsultas(): Observable<ChatGptModel[]> {
    return this.http.get<ChatGptModel[]>(`${this.apiUrl}/active`);
  }

  // Obtener consultas inactivas
  getInactiveConsultas(): Observable<ChatGptModel[]> {
    return this.http.get<ChatGptModel[]>(`${this.apiUrl}/inactive`);
  }

  // Obtener consulta por ID
  getConsultaById(id: number): Observable<ChatGptModel> {
    return this.http.get<ChatGptModel>(`${this.apiUrl}/${id}`);
  }

  // Actualizar consulta
  updateConsulta(id: number, newConsulta: string): Observable<ChatGptModel> {
    return this.http.put<ChatGptModel>(
      `${this.apiUrl}/update/${id}`,
      newConsulta
    );
  }

  // Desactivar consulta
  deactivateConsulta(id: number): Observable<ChatGptModel> {
    return this.http.patch<ChatGptModel>(`${this.apiUrl}/deactivate/${id}`, {});
  }

  // Activar consulta
  activateConsulta(id: number): Observable<ChatGptModel> {
    return this.http.patch<ChatGptModel>(`${this.apiUrl}/activate/${id}`, {});
  }

  // Eliminar consulta
  deleteConsulta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

}
