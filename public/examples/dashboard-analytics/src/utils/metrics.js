
export const getMetrics = async (view) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const metrics = {
    overview: {
      totalSales: `$${(Math.random() * 100000).toFixed(0)}`,
      activeUsers: Math.floor(Math.random() * 10000).toLocaleString(),
      conversions: `${(Math.random() * 20 + 5).toFixed(1)}%`,
      avgTime: `${Math.floor(Math.random() * 10)}m ${Math.floor(Math.random() * 60)}s`
    },
    sales: {
      dailySales: `$${(Math.random() * 20000).toFixed(0)}`,
      pendingOrders: Math.floor(Math.random() * 100),
      avgTicket: `$${(Math.random() * 300 + 50).toFixed(0)}`,
      returns: `${(Math.random() * 5).toFixed(1)}%`
    },
    users: {
      newUsers: Math.floor(Math.random() * 5000).toLocaleString(),
      retainedUsers: `${(Math.random() * 20 + 80).toFixed(1)}%`,
      activeSessions: Math.floor(Math.random() * 20000).toLocaleString(),
      sessionTime: `${Math.floor(Math.random() * 30)}m ${Math.floor(Math.random() * 60)}s`
    }
  };
  
  return metrics[view] || metrics.overview;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-ES').format(number);
};

export const calculateGrowth = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const getMetricColor = (value, type = 'positive') => {
  if (type === 'positive') {
    return value > 0 ? '#10b981' : '#ef4444';
  }
  return value > 0 ? '#ef4444' : '#10b981';
}; 