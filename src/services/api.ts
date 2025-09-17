// Configuración de API adaptable para diferentes entornos

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  isDemoMode: import.meta.env.VITE_DEMO_MODE === 'true' || import.meta.env.VITE_API_URL === 'mock',
  isGitHubPages: import.meta.env.VITE_ENVIRONMENT === 'github-pages'
};

// Datos mock para modo demo
const MOCK_DATA = {
  workshops: [
    {
      id: 1,
      nombre: 'Introducción a React',
      descripcion: 'Aprende los fundamentos de React',
      fecha: '2025-03-15',
      hora_inicio: '09:00',
      hora_fin: '12:00',
      cupo_maximo: 30,
      inscritos: 15,
      tipo_evento: 'workshop'
    },
    {
      id: 2,
      nombre: 'Node.js Avanzado',
      descripcion: 'Desarrollo backend con Node.js',
      fecha: '2025-03-16',
      hora_inicio: '14:00',
      hora_fin: '17:00',
      cupo_maximo: 25,
      inscritos: 8,
      tipo_evento: 'workshop'
    }
  ],
  actividades: [
    {
      id: 1,
      nombre: 'Conferencia Magistral',
      descripcion: 'Conferencia sobre el futuro de la ingeniería',
      fecha: '2025-03-17',
      hora_inicio: '10:00',
      hora_fin: '11:30',
      ponente: 'Dr. Juan Pérez',
      tipo_evento: 'conferencia'
    }
  ]
};

// Cliente HTTP adaptable
class ApiClient {
  private baseURL: string;
  private isDemoMode: boolean;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.isDemoMode = API_CONFIG.isDemoMode;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    // Modo demo: retornar datos mock
    if (this.isDemoMode) {
      return this.handleMockRequest(endpoint);
    }

    // Modo normal: hacer request HTTP
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      
      // Fallback a modo demo si falla la API
      if (API_CONFIG.isGitHubPages) {
        console.warn('API failed, falling back to demo mode');
        return this.handleMockRequest(endpoint);
      }
      
      throw error;
    }
  }

  private async handleMockRequest(endpoint: string) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('🎭 Demo Mode: Simulating API call to', endpoint);

    if (endpoint.includes('/workshops')) {
      return { ok: true, data: MOCK_DATA.workshops };
    }
    
    if (endpoint.includes('/actividades')) {
      return { ok: true, data: MOCK_DATA.actividades };
    }

    if (endpoint.includes('/participantes') && endpoint.includes('POST')) {
      return { ok: true, message: 'Registro simulado exitosamente (modo demo)' };
    }

    if (endpoint.includes('/asistencias') && endpoint.includes('POST')) {
      return { ok: true, message: 'Asistencia registrada (modo demo)' };
    }

    // Respuesta genérica para endpoints no definidos
    return { 
      ok: true, 
      message: 'Acción simulada exitosamente (modo demo)',
      demo: true 
    };
  }

  // Métodos HTTP específicos
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Instancia única del cliente
export const apiClient = new ApiClient();

// Helper para verificar si estamos en modo demo
export const isDemoMode = () => API_CONFIG.isDemoMode;

// Helper para verificar si estamos en GitHub Pages
export const isGitHubPages = () => API_CONFIG.isGitHubPages;

// Configuración exportada
export default API_CONFIG;