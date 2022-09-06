//swagger
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const handlers = require('./handlers.ts');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node DynamoDB API',
            version: '1.0.0'
        },
        servers: [
            {
                url: "http://localhost:5000"
            },
        ],
    },
    apis: [`${path.join(__dirname, './handlers.ts')}`],
};
const swaggerDoc = swaggerJsDoc(swaggerOptions);

app.use(express.json);
app.use("/api", handlers);
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerOptions)));

app.get("/", (req, res) => {
    res.send("Welcome to the documentation");
});

app.listen(port, () => {
    console.log('Server listening on port ${port}');
});
