// utils/parseCsv.js
const parseCsv = (rawText) => {
    // Example mock parser
    const rows = rawText.trim().split('\n').slice(1); // skip header
    return rows.map(line => {
      const [timestamp, total] = line.split(',');
      return { timestamp, total: parseFloat(total) };
    });
  };
  
  export default parseCsv;
  