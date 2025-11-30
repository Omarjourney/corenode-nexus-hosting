const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const gameModulesRouter = require('./routes/game-modules');
const dedicatedRouter = require('./routes/dedicated');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/launch-lab*', (_req, res) => {
  res.redirect(301, '/vps');
});

app.use('/', gameModulesRouter);
app.use('/', dedicatedRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
