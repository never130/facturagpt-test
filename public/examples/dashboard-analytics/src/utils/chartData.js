
export const getChartData = async (view) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const generateRandomData = (count, min, max) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };
  
  const chartData = {
    overview: {
      sales: generateRandomData(12, 1000, 10000),
      users: [
        { label: 'Nuevos', value: 45, color: '#3b82f6' },
        { label: 'Activos', value: 35, color: '#10b981' },
        { label: 'Inactivos', value: 20, color: '#f59e0b' }
      ],
      activity: generateRandomData(24, 10, 100),
      performance: generateRandomData(30, 70, 95)
    },
    sales: {
      categories: [
        { label: 'Electrónicos', value: 35, color: '#3b82f6' },
        { label: 'Ropa', value: 25, color: '#10b981' },
        { label: 'Hogar', value: 20, color: '#f59e0b' },
        { label: 'Deportes', value: 15, color: '#ef4444' },
        { label: 'Otros', value: 5, color: '#8b5cf6' }
      ],
      trend: generateRandomData(30, 5000, 25000)
    },
    users: {
      demographics: [
        { label: '18-25', value: 30, color: '#3b82f6' },
        { label: '26-35', value: 35, color: '#10b981' },
        { label: '36-45', value: 20, color: '#f59e0b' },
        { label: '46+', value: 15, color: '#ef4444' }
      ],
      userActivity: generateRandomData(24, 5, 50)
    }
  };
  
  return chartData[view] || chartData.overview;
};

export const generateTimeSeriesData = (days, baseValue, variance) => {
  return Array.from({ length: days }, (_, i) => {
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    const trend = Math.sin(i * 0.1) * 0.1; 
    return Math.floor(baseValue * randomFactor * (1 + trend));
  });
};

export const generatePieData = (labels, colors) => {
  return labels.map((label, index) => ({
    label,
    value: Math.floor(Math.random() * 40) + 10,
    color: colors[index % colors.length]
  }));
};

export const generateBarData = (labels, min, max) => {
  return labels.map(label => ({
    label,
    value: Math.floor(Math.random() * (max - min + 1)) + min
  }));
};

export const formatChartValue = (value, type = 'number') => {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(value);
    case 'percentage':
      return `${value}%`;
    case 'number':
    default:
      return new Intl.NumberFormat('es-ES').format(value);
  }
}; 