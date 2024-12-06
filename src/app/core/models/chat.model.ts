export interface ChatGptModel {
  id?: number;
  consulta: string;
  respuesta: string;
  hora: string;
  estado: string;
}

export interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatGptRequest {
  content: string;
  role: 'user' | 'assistant';
}

export interface ApiConfig {
  apiUrl: string;
  apiKey?: string;
}