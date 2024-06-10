const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'Blog-api',
      description: 'An API of my personal blog application.'
    },
    host: 'localhost:5050',
    basePath: "",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: "User",
            description: "Endpoints"
        },
        {
            name: "Admin",
            description: "Endpoints"
        },
        {
            name: "Articles",
            description: "Endpoints"
        },
        {
            name: "Tags",
            description: "Endpoints"
        },
        {
            name: "Comments",
            description: "Endpoints"
        }
    ],
    securityDefinitions: {},
    definitions: {}
};

const outputFile = "./swagger-output.json";
const endPointsFile = ["./app.js"];

swaggerAutogen(outputFile, endPointsFile, doc);