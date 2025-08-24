const nano = require("nano")("http://admin:1234@127.0.0.1:5984");

const connectDB = async (tableName) => {
  let db;
  try {
    await nano.db.get(tableName);
    db = nano.db.use(tableName);
    return db;
  } catch (error) {
    if (error.statusCode === 404) {
      try {
        await nano.db.create(tableName);
        db = nano.db.use(tableName);
        return db;
      } catch (createError) {
        console.error("Error al crear la base de datos:", createError);
        throw createError;
      }
    } else {
      console.error("Error al obtener información de la base de datos:", error);
    }
  }
};

const flattenTextNodes = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  if ((Object.keys(obj).length === 1 && obj._text !== undefined) || obj._attributes?.type ) {
    const value = obj._text;

    if (obj._attributes?.type === 'string') {
      return value;
    } else if (obj._attributes?.type === 'cif') {
      return value.replace(/[\s-]/g,'');
    } else if (obj._attributes?.type === 'date') {
      const mask = obj._attributes.mask || 'DD-MM-AAAA';
    
      const date = formatDate(value, mask);
      return date;
    } else if (obj._attributes?.type === 'number' || obj._attributes?.type === 'integer') {
      const num = parseInt(value, 10);
      return isNaN(num) ? 0 : num;
    } else if (obj._attributes?.type === 'float') {
      const num = parseFloat(value.toString().replace(',', '.'));
      return isNaN(num) ? 0 : num;
    } else if (obj._attributes?.type === 'logical' || obj._attributes?.type === 'boolean') {
      const val = value.toLowerCase().trim();
      if (val === 'true' || val === 'yes' || val === '1') {
        return true;
      } else if (val === 'false' || val === 'no' || val === '0') {
        return false;
      }
      return false;
    }

    return value;
  }

  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (key === '_attributes') continue;
    
    const value = flattenTextNodes(obj[key]);
    if (Array.isArray(result)) {
      result.push(value);
    } else {
      if (key === 'lines' || typeof value !== 'object' || Object.keys(value).length > 0) {
        result[key] = value;
      }
    }
  }

  return result;
}

module.exports = {
  connectDB,
  flattenTextNodes
};

const formatDate = (dateStr, mask) => {
  let parts;
  if (dateStr.includes('/')) {
    parts = dateStr.split('/');
  } else if (dateStr.includes('-')) {
    parts = dateStr.split('-');
  } else {
    return dateStr;
  }

  let yearIndex = parts.findIndex(part => part.length === 4);
  if (yearIndex === -1) {
    yearIndex = 2;
  }

  const otherIndices = [0, 1, 2].filter(i => i !== yearIndex);
  
  const day = parts[otherIndices[0]].replace(/^0+/, '');
  const month = parts[otherIndices[1]].replace(/^0+/, '');
  const year = parts[yearIndex];

  if (mask.startsWith('AAAA')) {
    return `${year}-${month}-${day}`;
  } else {
    return `${day}-${month}-${year}`;
  }
};