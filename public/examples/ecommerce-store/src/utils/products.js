
export const getProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 1,
      name: "iPhone 15 Pro",
      description: "El iPhone más avanzado con chip A17 Pro y cámara de 48MP",
      price: 999.99,
      originalPrice: 1199.99,
      category: "Smartphones",
      image: "https://via.placeholder.com/300x300/007AFF/FFFFFF?text=iPhone+15+Pro",
      rating: 4.8,
      reviewCount: 1247,
      stock: 15,
      discount: 17,
      isNew: true,
      specifications: [
        "Pantalla Super Retina XDR de 6.1 pulgadas",
        "Chip A17 Pro con GPU de 6 núcleos",
        "Cámara triple de 48MP + 12MP + 12MP",
        "Batería de hasta 23 horas de reproducción de video"
      ],
      features: [
        "Face ID",
        "Resistente al agua IP68",
        "Carga inalámbrica",
        "5G Ultra Rápido"
      ]
    },
    {
      id: 2,
      name: "MacBook Air M2",
      description: "Portátil ultraligero con chip M2 y hasta 18 horas de batería",
      price: 1199.99,
      category: "Laptops",
      image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=MacBook+Air+M2",
      rating: 4.9,
      reviewCount: 892,
      stock: 8,
      isNew: false,
      specifications: [
        "Pantalla Liquid Retina de 13.6 pulgadas",
        "Chip M2 con CPU de 8 núcleos y GPU de 10 núcleos",
        "8GB de memoria unificada",
        "SSD de 256GB"
      ],
      features: [
        "Hasta 18 horas de batería",
        "Cámara FaceTime HD de 1080p",
        "Touch ID",
        "Dos puertos Thunderbolt"
      ]
    },
    {
      id: 3,
      name: "Samsung Galaxy S24",
      description: "Flagship Android con IA integrada y cámara de 200MP",
      price: 899.99,
      originalPrice: 999.99,
      category: "Smartphones",
      image: "https://via.placeholder.com/300x300/1428A0/FFFFFF?text=Galaxy+S24",
      rating: 4.7,
      reviewCount: 567,
      stock: 22,
      discount: 10,
      isNew: true,
      specifications: [
        "Pantalla Dynamic AMOLED 2X de 6.2 pulgadas",
        "Procesador Snapdragon 8 Gen 3",
        "Cámara principal de 200MP",
        "Batería de 4000mAh"
      ],
      features: [
        "S Pen integrado",
        "Resistente al agua IP68",
        "Carga inalámbrica",
        "5G"
      ]
    },
    {
      id: 4,
      name: "Sony WH-1000XM5",
      description: "Auriculares inalámbricos con cancelación de ruido líder en la industria",
      price: 349.99,
      category: "Audio",
      image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Sony+WH-1000XM5",
      rating: 4.8,
      reviewCount: 2341,
      stock: 45,
      isNew: false,
      specifications: [
        "Cancelación de ruido adaptativa",
        "Batería de hasta 30 horas",
        "Carga rápida de 3 minutos = 3 horas",
        "Control táctil"
      ],
      features: [
        "Sonido Hi-Res",
        "Conexión multipunto",
        "Aplicación Sony Headphones Connect",
        "Diseño plegable"
      ]
    },
    {
      id: 5,
      name: "iPad Air",
      description: "Tablet versátil con chip M1 y compatibilidad con Apple Pencil",
      price: 599.99,
      category: "Tablets",
      image: "https://via.placeholder.com/300x300/007AFF/FFFFFF?text=iPad+Air",
      rating: 4.6,
      reviewCount: 743,
      stock: 12,
      isNew: false,
      specifications: [
        "Pantalla Liquid Retina de 10.9 pulgadas",
        "Chip M1 con Neural Engine",
        "Cámara trasera de 12MP",
        "Cámara frontal de 12MP Ultra Wide"
      ],
      features: [
        "Compatibilidad con Apple Pencil (2ª generación)",
        "Magic Keyboard",
        "Touch ID",
        "Wi-Fi 6"
      ]
    },
    {
      id: 6,
      name: "Dell XPS 13",
      description: "Laptop premium con pantalla InfinityEdge y procesador Intel Core i7",
      price: 1299.99,
      originalPrice: 1499.99,
      category: "Laptops",
      image: "https://via.placeholder.com/300x300/007DB8/FFFFFF?text=Dell+XPS+13",
      rating: 4.5,
      reviewCount: 456,
      stock: 6,
      discount: 13,
      isNew: false,
      specifications: [
        "Pantalla InfinityEdge de 13.4 pulgadas 4K",
        "Procesador Intel Core i7-1250U",
        "16GB RAM LPDDR5",
        "SSD de 512GB"
      ],
      features: [
        "Diseño de aluminio y fibra de carbono",
        "Teclado retroiluminado",
        "Lector de huellas dactilares",
        "Thunderbolt 4"
      ]
    },
    {
      id: 7,
      name: "AirPods Pro",
      description: "Auriculares inalámbricos con cancelación de ruido activa y audio espacial",
      price: 249.99,
      category: "Audio",
      image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=AirPods+Pro",
      rating: 4.7,
      reviewCount: 1892,
      stock: 67,
      isNew: false,
      specifications: [
        "Cancelación de ruido activa",
        "Audio espacial personalizado",
        "Resistente al agua y al sudor IPX4",
        "Hasta 4.5 horas de audio"
      ],
      features: [
        "Conexión automática",
        "Control táctil",
        "Estuche de carga inalámbrica",
        "Compatibilidad con Siri"
      ]
    },
    {
      id: 8,
      name: "Nintendo Switch OLED",
      description: "Consola híbrida con pantalla OLED de 7 pulgadas y almacenamiento de 64GB",
      price: 349.99,
      category: "Gaming",
      image: "https://via.placeholder.com/300x300/E60012/FFFFFF?text=Nintendo+Switch+OLED",
      rating: 4.8,
      reviewCount: 1123,
      stock: 34,
      isNew: false,
      specifications: [
        "Pantalla OLED de 7 pulgadas",
        "Almacenamiento interno de 64GB",
        "Batería de hasta 9 horas",
        "Wi-Fi mejorado"
      ],
      features: [
        "Modo portátil y de sobremesa",
        "Joy-Con desmontables",
        "Compatibilidad con todos los juegos de Switch",
        "Soporte para microSD"
      ]
    }
  ];
};

export const getProductById = async (id) => {
  const products = await getProducts();
  return products.find(product => product.id === parseInt(id));
};

export const getProductsByCategory = async (category) => {
  const products = await getProducts();
  return products.filter(product => product.category === category);
};

export const searchProducts = async (query) => {
  const products = await getProducts();
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getCategories = async () => {
  const products = await getProducts();
  return [...new Set(products.map(product => product.category))];
}; 