const axios = require('axios');
const http = require('http');
const express = require('express');
const { sendEmail } = require('./services/email');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);

const checkApiStatus = async () => {
  try {
    const response = await axios.get('https://facturagpt.com/api/user/db');
    
    if (response.status !== 200) {
      console.error('API Status Error:', response.status);
      await sendEmail(
        'info@aythen.com',
        'api-status-error',
        {
          status: response.status,
          timestamp: new Date().toISOString(),
          url: 'https://facturagpt.com/api/user/db'
        }
      );
    } 
  } catch (error) {
    console.error('API Check Failed:', error.message);
    await sendEmail(
      'info@aythen.com',
      'api-status-error',
      {
        error: error.message,
        timestamp: new Date().toISOString(),
        url: 'https://facturagpt.com/api/user/db'
      }
    );
    console.error('Shutting down server due to API error');
  }
};

const startMonitoring = () => {
  checkApiStatus();
  
  setInterval(checkApiStatus, 3600000);
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/monitor', (req, res) => {
  exec('pm2 list | grep backend', (error, stdout, stderr) => {
    if (error) {
      if (error.code === 1) {
        exec('cd /var/www/facturagpt/app && pm2 start index.js -f --name backend', (startError) => {
          if (startError) {
            return res.status(500).json({
              success: false,
              message: 'Error creating backend process',
              error: startError.message,
              timestamp: new Date().toISOString()
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Backend process not found. Created successfully.',
            timestamp: new Date().toISOString()
          });
        });
        return;
      }
      return res.status(500).json({
        success: false,
        message: 'Error checking backend process',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    if (stdout.includes('stopped')) {
      exec('pm2 start backend', (startError) => {
        if (startError) {
          return res.status(500).json({
            success: false,
            message: 'Error starting backend process',
            error: startError.message,
            timestamp: new Date().toISOString()
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Backend process was stopped. Started successfully.',
          timestamp: new Date().toISOString()
        });
      });
      return;
    }

    if (stdout.includes('online')) {
      return res.status(200).json({
        success: true,
        message: 'Backend process is running properly',
        timestamp: new Date().toISOString()
      });
    }

    exec('pm2 restart backend', (restartError) => {
      if (restartError) {
        return res.status(500).json({
          success: false,
          message: 'Error restarting backend process',
          error: restartError.message,
          timestamp: new Date().toISOString()
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Backend process was in an invalid state. Restarted successfully.',
        timestamp: new Date().toISOString()
      });
    });
  });
});
  
server.listen(3001, () => {
  startMonitoring();
});

module.exports = {
  startMonitoring,
}; 