const express = require('express');
const cors = require('cors');
const routes = require('../src/routes');

const port = process.env.PORT || 3765;
const app = express();
app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(port, () =>{
    console.log('API respondendo em http://localhost:' + port);
});