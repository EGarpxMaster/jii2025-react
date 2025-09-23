import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import './dashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
const API_URL = `${API_BASE}/api/actividades/dashboard-stats`;

// Colores para las gráficas
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface DashboardStats {
  estadisticas_generales: {
    total_actividades: number;
    workshops: number;
    conferencias: number;
    foros: number;
    cupo_total: number;
    inscritos_workshops: number;
    asistencias_totales: number;
  };
  ocupacion_por_actividad: Array<{
    id: number;
    nombre: string;
    tipo: string;
    cupo_maximo: number;
    ocupacion_actual: number;
    porcentaje_ocupacion: number;
  }>;
  estadisticas_por_tipo: Array<{
    tipo: string;
    total_actividades: number;
    cupo_total: number;
    ocupacion_total: number;
    promedio_ocupacion: number;
  }>;
  actividades_mayor_ocupacion: Array<{
    nombre: string;
    tipo: string;
    ocupacion_actual: number;
    porcentaje_ocupacion: number;
  }>;
  actividades_menor_ocupacion: Array<{
    nombre: string;
    tipo: string;
    ocupacion_actual: number;
    porcentaje_ocupacion: number;
  }>;
  ultima_actualizacion: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchDashboardStats = async () => {
    try {
      setError(null);
      const response = await fetch(API_URL, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data.data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar datos iniciales
    fetchDashboardStats();

    // Configurar actualización automática cada 30 minutos (1800000 ms)
    const interval = setInterval(fetchDashboardStats, 30 * 60 * 1000);

    // Limpiar interval al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando estadísticas del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>Error al cargar el dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardStats} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  // Preparar datos para gráficas
  const dataPorTipo = stats.estadisticas_por_tipo.map(tipo => ({
    ...tipo,
    promedio_ocupacion: Math.round(tipo.promedio_ocupacion || 0)
  }));

  const dataOcupacion = stats.ocupacion_por_actividad
    .slice(0, 10) // Mostrar solo las primeras 10 actividades
    .map(actividad => ({
      nombre: actividad.nombre.length > 20 
        ? actividad.nombre.substring(0, 20) + '...' 
        : actividad.nombre,
      ocupacion: actividad.porcentaje_ocupacion,
      tipo: actividad.tipo
    }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard de Actividades</h1>
        <div className="update-info">
          <p>Última actualización: {formatDate(lastUpdate)}</p>
          <button onClick={fetchDashboardStats} className="refresh-button">
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <section className="stats-overview">
        <div className="stat-card">
          <h3>Total Actividades</h3>
          <span className="stat-number">{stats.estadisticas_generales.total_actividades}</span>
        </div>
        <div className="stat-card">
          <h3>Workshops</h3>
          <span className="stat-number">{stats.estadisticas_generales.workshops}</span>
        </div>
        <div className="stat-card">
          <h3>Conferencias</h3>
          <span className="stat-number">{stats.estadisticas_generales.conferencias}</span>
        </div>
        <div className="stat-card">
          <h3>Foros</h3>
          <span className="stat-number">{stats.estadisticas_generales.foros}</span>
        </div>
        <div className="stat-card">
          <h3>Cupo Total</h3>
          <span className="stat-number">{stats.estadisticas_generales.cupo_total}</span>
        </div>
        <div className="stat-card">
          <h3>Inscritos Workshops</h3>
          <span className="stat-number">{stats.estadisticas_generales.inscritos_workshops}</span>
        </div>
        <div className="stat-card">
          <h3>Asistencias Totales</h3>
          <span className="stat-number">{stats.estadisticas_generales.asistencias_totales}</span>
        </div>
      </section>

      {/* Gráficas */}
      <div className="charts-grid">
        
        {/* Gráfica de barras: Ocupación por tipo de actividad */}
        <div className="chart-container">
          <h3>Promedio de Ocupación por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPorTipo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Ocupación']} />
              <Legend />
              <Bar dataKey="promedio_ocupacion" fill="#8884d8" name="Ocupación %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de pie: Distribución de actividades por tipo */}
        <div className="chart-container">
          <h3>Distribución de Actividades</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPorTipo}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({tipo, total_actividades}) => `${tipo}: ${total_actividades}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total_actividades"
              >
                {dataPorTipo.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de barras horizontales: Ocupación por actividad */}
        <div className="chart-container wide">
          <h3>Ocupación por Actividad (Top 10)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={dataOcupacion}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="nombre" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value}%`, 'Ocupación']} />
              <Legend />
              <Bar dataKey="ocupacion" fill="#82ca9d" name="Ocupación %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Tablas de actividades destacadas */}
      <div className="tables-grid">
        
        {/* Mayor ocupación */}
        <div className="table-container">
          <h3>🔥 Actividades con Mayor Ocupación</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Tipo</th>
                <th>Ocupación</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {stats.actividades_mayor_ocupacion.map((actividad, index) => (
                <tr key={index}>
                  <td title={actividad.nombre}>
                    {actividad.nombre.length > 30 
                      ? actividad.nombre.substring(0, 30) + '...'
                      : actividad.nombre}
                  </td>
                  <td>{actividad.tipo}</td>
                  <td>{actividad.ocupacion_actual}</td>
                  <td className="percentage-cell">
                    <span className={`percentage-badge ${
                      actividad.porcentaje_ocupacion >= 90 ? 'high' :
                      actividad.porcentaje_ocupacion >= 70 ? 'medium' : 'low'
                    }`}>
                      {actividad.porcentaje_ocupacion}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Menor ocupación */}
        <div className="table-container">
          <h3>📈 Actividades con Menor Ocupación</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Tipo</th>
                <th>Ocupación</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {stats.actividades_menor_ocupacion.map((actividad, index) => (
                <tr key={index}>
                  <td title={actividad.nombre}>
                    {actividad.nombre.length > 30 
                      ? actividad.nombre.substring(0, 30) + '...'
                      : actividad.nombre}
                  </td>
                  <td>{actividad.tipo}</td>
                  <td>{actividad.ocupacion_actual}</td>
                  <td className="percentage-cell">
                    <span className={`percentage-badge ${
                      actividad.porcentaje_ocupacion >= 90 ? 'high' :
                      actividad.porcentaje_ocupacion >= 70 ? 'medium' : 'low'
                    }`}>
                      {actividad.porcentaje_ocupacion}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}