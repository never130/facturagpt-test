import React, { useState } from 'react';
// import { Download, Eye, Trash2, RefreshCw } from 'lucide-react';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// import { ScrapingResult } from '../App';
import styles from './ResultsTable.module.css';
import { ReactComponent as IconRefresh } from './assets/icon-refresh.svg';
import { ReactComponent as IconDownload } from './assets/icon-download.svg';

const DataPreview = ({ data }) => {
  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <div className={styles.arrayPreview}>
          {value.map((item, index) => (
            <div key={index} className={styles.arrayItem}>
              {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
            </div>
          ))}
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return <pre className={styles.objectPreview}>{JSON.stringify(value, null, 2)}</pre>;
    }
    
    if (typeof value === 'string' && value.startsWith('http')) {
      return <a href={value} target="_blank" rel="noopener noreferrer" className={styles.link}>{value}</a>;
    }
    
    return String(value);
  };

  return (
    <div className={styles.dataPreview}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className={styles.dataField}>
          <div className={styles.fieldName}>{key}:</div>
          <div className={styles.fieldValue}>
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ResultsTable = ({ results }) => {
  const [selectedResult, setSelectedResult] = useState(null);

  const exportToCSV = () => {
    if (results.length === 0) return;

    const allKeys = new Set();s
    results.forEach(result => {
      Object.keys(result.data).forEach(key => allKeys.add(key));
    });

    const headers = ['Layer', 'Timestamp', ...Array.from(allKeys)];
    const csvContent = [
      headers.join(','),
      ...results.map(result => {
        const row = [
          result.layerName,
          result.timestamp.toISOString(),
          ...Array.from(allKeys).map(key => {
            const value = result.data[key];
            if (Array.isArray(value) || typeof value === 'object') {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            return `"${String(value).replace(/"/g, '""')}"`;
          })
        ];
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `scraping-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `scraping-results-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (results.length === 0) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <h3>Resultados del Scraping</h3>
          <div className={styles.resultCount}>0 resultados</div>
        </div>
        <div className={styles.emptyResults}>
          {/* <RefreshCw size={48} className={styles.emptyIcon} /> */}
          <IconRefresh />
          {/* icon refresh */}
          <h4>No hay resultados aún</h4>
          <p>Los datos extraídos aparecerán aquí después de ejecutar el scraping</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <div className={styles.resultsInfo}>
          <h3>Resultados del Scraping</h3>
          <div className={styles.resultCount}>{results.length} resultados</div>
        </div>
        
        <div className={styles.exportButtons}>
          <button variant="outline" size="sm" onClick={exportToCSV}>
            {/* <Download size={16} /> */}
            <IconDownload />
            {/* icon download */}
            CSV
          </button>
          <button variant="outline" size="sm" onClick={exportToJSON}>
            {/* <Download size={16} /> */}
            <IconDownload />
            {/* icon download */}
            JSON
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Capa</th>
              <th>Campos Extraídos</th>
              <th>Timestamp</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>
                  <div className={styles.layerCell}>
                    <div className={styles.layerName}>{result.layerName}</div>
                  </div>
                </td>
                <td>
                  <div className={styles.fieldsCell}>
                    {Object.keys(result.data).map(field => (
                      <label key={field} variant="secondary" className={styles.fieldBadge}>
                        {field}
                      </label>
                    ))}
                    {/* {Object.keys(result.data).map(field => (
                      <Badge key={field} variant="secondary" className={styles.fieldBadge}>
                        {field}
                      </Badge>
                    ))} */}
                  </div>
                </td>
                <td>
                  <div className={styles.timestamp}>
                    {result.timestamp.toLocaleString()}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                        dialog trigger
                      {/* <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedResult(result)}
                        >
                          <Eye size={14} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={styles.previewDialog}>
                        <DialogHeader>
                          <DialogTitle>Datos de {result.layerName}</DialogTitle>
                        </DialogHeader>
                        <DataPreview data={result.data} />
                      </DialogContent>
                    </Dialog> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Capa</TableHead>
              <TableHead>Campos Extraídos</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell>
                  <div className={styles.layerCell}>
                    <div className={styles.layerName}>{result.layerName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.fieldsCell}>
                    {Object.keys(result.data).map(field => (
                      <Badge key={field} variant="secondary" className={styles.fieldBadge}>
                        {field}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.timestamp}>
                    {result.timestamp.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.actions}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedResult(result)}
                        >
                          <Eye size={14} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={styles.previewDialog}>
                        <DialogHeader>
                          <DialogTitle>Datos de {result.layerName}</DialogTitle>
                        </DialogHeader>
                        <DataPreview data={result.data} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
   
      </div>
    </div>
  );
};