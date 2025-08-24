const axios = require("axios");
const { connectDB } = require("./utils");


const API_KEY = "728d826a-45f9-4cec-9d11-c7c12bdb231c";
const API_URL = `https://newsapi.ai/api/v1/article/getArticles?lang=spa&sortBy=date&resultType=articles&articlesCount=5&page=1&apiKey=${API_KEY}`;


const getFormattedDate = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}${mm}${yyyy}`;
};

const getNews = async (req, res) => {
  const dbName = `db_${getFormattedDate()}_notices`;
  let db;

  try {
    db = await connectDB(dbName);
  } catch (err) {
    try {
      const syncRes = await axios.get("http://localhost:3006/api/sync-news");
      db = await connectDB(dbName); 
    } catch (error) {
      return res.status(500).json({ error: "No se pudo sincronizar noticias" });
    }
  }

  try {
    const view = await db.list({ include_docs: true });
    const news = view.rows
      .map(row => row.doc)
      .filter(doc => doc.type === "news");

    return res.status(200).json({
      success: true,
      message: "Noticias obtenidas correctamente",
      count: news.length,
      data: news
    });
  } catch (err) {
    console.error("❌ Error al leer noticias:", err.message);
    return res.status(500).json({ error: "Error al leer noticias" });
  }
};





const categories = [
  "Lionel Messi",
  "Pelota de Futbol",
  "Bebidas alcoholicas",
  "Noticias",
  "Finanzas",
  "Tecnología",
  "Política",
  "Iphone",
  "Classico",
  "Madrid",
  "Leo Messi"
];




const syncNews = async (req, res) => {
  console.log("🔄 Sincronizando noticias");
  try {
    const dbName = `db_${getFormattedDate()}_notices`;
    const db = await connectDB(dbName);

    const user_category = [
      "Noticias",
      "Finanzas",
    ];

    try {
      const existingNews = await db.find({
        selector: {
          type: { $in: user_category }
        }
      });

      console.log("🔄 Noticias encontradas en la base de datos", existingNews.docs);


      if (existingNews.docs.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Noticias encontradas en la base de datos",
          count: existingNews.docs.length,
          data: existingNews.docs,
          db: dbName
        });
      }
    } catch (error) {
      console.error("No se encontraron noticias existentes, procediendo a buscar nuevas");
    }


    const response = await axios.get(`https://newsapi.ai/api/v1/article/getArticles`, {
      params: {
        lang: 'spa',
        sortBy: 'date',
        resultType: 'articles',
        articlesCount: 20,
        apiKey: API_KEY,
        keyword: categories
      }
    });

    
    const allArticles = response.data?.articles?.results
    

    const inserted = await Promise.all(
      allArticles.map((article, i) => {
        const doc = {
          type: user_category,
          _id: `news_${i}_${Date.now()}`,
          title: article.title?.slice(0, 100) || "Sin título",
          description: article.body?.slice(0, 300) || article.summary?.slice(0, 300) || "",
          source: article.source?.title || "newsapi.ai",
          publishedAt: article.dateTime || article.publishedAt || new Date().toISOString(),
          url: article.url,
          image: article.image || "",
          language: article.lang || "es",
        };
        return db.insert(doc);
      })
    );

    const userCategoryNews = inserted.filter(doc => user_category.includes(doc.category));

    res.status(200).json({
      success: true,
      message: "Noticias sincronizadas y almacenadas correctamente",
      count: inserted.length,
      userCategoryCount: userCategoryNews.length,
      userCategoryNews: userCategoryNews,
      db: dbName
    });

  } catch (error) {
    console.error("❌ Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Error al sincronizar noticias" });
  }
};

module.exports = {
  syncNews
};



