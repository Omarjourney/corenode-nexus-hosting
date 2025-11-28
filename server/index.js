const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const ampModulesRouter = require('./routes/amp-modules');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', ampModulesRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
