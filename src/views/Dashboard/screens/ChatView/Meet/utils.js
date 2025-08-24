
export const safeText = (text) => {
    if (typeof text === 'string') {
      return text;
    }
    if (text === null || text === undefined) {
      return '';
    }
    if (typeof text === 'object') {
      return JSON.stringify(text);
    }
    return String(text);
  };