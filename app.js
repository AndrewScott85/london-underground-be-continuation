const express = require('express');
const router = require('./config/routes');
const cors = require('cors');
const app = express();

app.use(cors());
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}


app.use(express.json());

//Add all routes to app
router(app);

app.listen(port, () => {
    console.log(`App running, listening on port ${port}`);
});