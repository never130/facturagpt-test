import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';
import { getMetrics } from '../utils/metrics';
import { getChartData } from '../utils/chartData';

function Dashboard({ currentView, theme }) {
  const [metrics, setMetrics] = useState({});
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const metricsData = await getMetrics(currentView);
        const chartDataResult = await getChartData(currentView);
        setMetrics(metricsData);
        setChartData(chartDataResult);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentView]);

  const renderOverview = () => (
    <div className="dashboard-grid">
      <div className="metrics-row">
        <MetricCard 
          title="Ventas Totales"
          value={metrics.totalSales || '$45,231'}
          change="+20.1%"
          changeType="positive"
          icon="💰"
          theme={theme}
        />
        <MetricCard 
          title="Usuarios Activos"
          value={metrics.activeUsers || '2,847'}
          change="+15.3%"
          changeType="positive"
          icon="👥"
          theme={theme}
        />
        <MetricCard 
          title="Conversiones"
          value={metrics.conversions || '12.5%'}
          change="+8.2%"
          changeType="positive"
          icon="📈"
          theme={theme}
        />
        <MetricCard 
          title="Tiempo Promedio"
          value={metrics.avgTime || '3m 42s'}
          change="-2.1%"
          changeType="negative"
          icon="⏱️"
          theme={theme}
        />
      </div>
      
      <div className="charts-row">
        <ChartCard 
          title="Ventas Mensuales"
          type="line"
          data={chartData.sales || []}
          theme={theme}
        />
        <ChartCard 
          title="Distribución de Usuarios"
          type="pie"
          data={chartData.users || []}
          theme={theme}
        />
      </div>
      
      <div className="charts-row">
        <ChartCard 
          title="Actividad por Hora"
          type="bar"
          data={chartData.activity || []}
          theme={theme}
        />
        <ChartCard 
          title="Rendimiento del Sistema"
          type="area"
          data={chartData.performance || []}
          theme={theme}
        />
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="dashboard-grid">
      <div className="metrics-row">
        <MetricCard 
          title="Ventas del Día"
          value={metrics.dailySales || '$8,234'}
          change="+12.5%"
          changeType="positive"
          icon="💵"
          theme={theme}
        />
        <MetricCard 
          title="Órdenes Pendientes"
          value={metrics.pendingOrders || '23'}
          change="+5.2%"
          changeType="positive"
          icon="📦"
          theme={theme}
        />
        <MetricCard 
          title="Ticket Promedio"
          value={metrics.avgTicket || '$156'}
          change="+3.1%"
          changeType="positive"
          icon="🎫"
          theme={theme}
        />
        <MetricCard 
          title="Devoluciones"
          value={metrics.returns || '2.3%'}
          change="-0.8%"
          changeType="positive"
          icon="🔄"
          theme={theme}
        />
      </div>
      
      <div className="charts-row">
        <ChartCard 
          title="Ventas por Categoría"
          type="doughnut"
          data={chartData.categories || []}
          theme={theme}
        />
        <ChartCard 
          title="Tendencia de Ventas"
          type="line"
          data={chartData.trend || []}
          theme={theme}
        />
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="dashboard-grid">
      <div className="metrics-row">
        <MetricCard 
          title="Nuevos Usuarios"
          value={metrics.newUsers || '1,234'}
          change="+18.7%"
          changeType="positive"
          icon="🆕"
          theme={theme}
        />
        <MetricCard 
          title="Usuarios Retenidos"
          value={metrics.retainedUsers || '89.2%'}
          change="+2.1%"
          changeType="positive"
          icon="🔄"
          theme={theme}
        />
        <MetricCard 
          title="Sesiones Activas"
          value={metrics.activeSessions || '5,678'}
          change="+9.3%"
          changeType="positive"
          icon="🖥️"
          theme={theme}
        />
        <MetricCard 
          title="Tiempo de Sesión"
          value={metrics.sessionTime || '12m 34s'}
          change="+4.2%"
          changeType="positive"
          icon="⏰"
          theme={theme}
        />
      </div>
      
      <div className="charts-row">
        <ChartCard 
          title="Demografía de Usuarios"
          type="pie"
          data={chartData.demographics || []}
          theme={theme}
        />
        <ChartCard 
          title="Actividad de Usuarios"
          type="heatmap"
          data={chartData.userActivity || []}
          theme={theme}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos del dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>{currentView === 'overview' ? 'Vista General' : 
             currentView === 'sales' ? 'Ventas' : 
             currentView === 'users' ? 'Usuarios' : 'Analytics'}</h2>
        <div className="dashboard-actions">
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            🔄 Actualizar
          </button>
          <button className="export-btn">
            📊 Exportar
          </button>
        </div>
      </div>
      
      {currentView === 'overview' && renderOverview()}
      {currentView === 'sales' && renderSales()}
      {currentView === 'users' && renderUsers()}
    </div>
  );
}

export default Dashboard; 