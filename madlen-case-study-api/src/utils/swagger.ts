import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Madlen Case Study API Docs',
      version: '1.0.0',
      description: 'API documentation for the Madlen Case Study backend - A web application that enables users to chat with various AI models via OpenRouter'
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

