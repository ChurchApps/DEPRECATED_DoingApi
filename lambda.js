const serverlessExpress = require('@codegenie/serverless-express');
const { init } = require('./dist/app');
const { Pool } = require('@churchapps/apihelper');
const { Environment } = require('./dist/helpers/Environment');
const { AutomationHelper } = require('./dist/helpers/AutomationHelper');

let serverlessExpressInstance;

const checkPool = async () => {
  if (!Environment.connectionString) {
    await Environment.init(process.env.APP_ENV || 'dev');
    
    // For local testing, skip database connection if not available
    if (process.env.SKIP_DB_INIT !== 'true') {
      try {
        Pool.initPool();
      } catch (error) {
        console.warn('Database connection failed, continuing without DB:', error.message);
      }
    }
  }
};

const universal = async (event, context) => {
  try {
    console.log('Lambda invocation:', event.httpMethod, event.path);
    
    await checkPool();
    
    // Initialize the handler only once
    if (!serverlessExpressInstance) {
      const app = await init();
      serverlessExpressInstance = serverlessExpress({ 
        app,
        binarySettings: {
          contentTypes: [
            'application/octet-stream',
            'font/*', 
            'image/*',
            'application/pdf'
          ]
        },
        stripBasePath: false,
        resolutionMode: 'PROMISE'
      });
    }
    
    return serverlessExpressInstance(event, context);
  } catch (error) {
    console.error('Lambda handler error:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

const nightly = async (event, context) => {
  await checkPool();
  await AutomationHelper.checkAll();
};

module.exports.universal = universal;
module.exports.nightly = nightly;