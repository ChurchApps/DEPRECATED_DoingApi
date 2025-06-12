#!/usr/bin/env node

// Test local serverless functionality with proper error handling
process.env.NODE_ENV = 'test';
process.env.APP_ENV = 'dev';

const serverlessExpress = require('@codegenie/serverless-express');

console.log('🧪 Testing serverless-express integration...');

// Create a simple Express app for testing
async function createTestApp() {
  const express = require('express');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  
  const app = express();
  
  // Basic middleware
  app.use(cors());
  app.use(bodyParser.json());
  
  // Test routes
  app.get('/', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'DoingApi local test successful!',
      timestamp: new Date().toISOString()
    });
  });
  
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'doing-api' });
  });
  
  app.post('/test', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'POST request received',
      body: req.body 
    });
  });
  
  return app;
}

async function testServerlessExpress() {
  try {
    console.log('Creating test Express app...');
    const app = await createTestApp();
    
    console.log('Creating serverless-express instance...');
    const serverlessInstance = serverlessExpress({ app });
    
    // Test GET request
    console.log('Testing GET request...');
    const getEvent = {
      version: '2.0',
      routeKey: 'GET /',
      rawPath: '/',
      rawQueryString: '',
      headers: { 'content-type': 'application/json' },
      requestContext: {
        http: { method: 'GET', path: '/', protocol: 'HTTP/1.1', sourceIp: '127.0.0.1' }
      },
      body: null,
      isBase64Encoded: false
    };
    
    const context = { 
      callbackWaitsForEmptyEventLoop: false,
      awsRequestId: 'test-123' 
    };
    
    const getResult = await serverlessInstance(getEvent, context);
    console.log('✅ GET test successful!');
    console.log('Status:', getResult.statusCode);
    console.log('Body:', getResult.body);
    
    // Test POST request
    console.log('\\nTesting POST request...');
    const postEvent = {
      ...getEvent,
      routeKey: 'POST /test',
      rawPath: '/test',
      requestContext: {
        http: { method: 'POST', path: '/test', protocol: 'HTTP/1.1', sourceIp: '127.0.0.1' }
      },
      body: JSON.stringify({ test: 'data', number: 42 }),
      isBase64Encoded: false
    };
    
    const postResult = await serverlessInstance(postEvent, context);
    console.log('✅ POST test successful!');
    console.log('Status:', postResult.statusCode);
    console.log('Body:', postResult.body);
    
    console.log('\\n🎉 All serverless-express tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testServerlessExpress();