require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const appRoutes = require('./routes/app');
const PORT = process.env.PORT || 9000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function handlerError(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON payload passed.',
      status: 'error',
      data: null,
    });
  }
  return next();
}

app.use(handlerError);
app.use('/', appRoutes);

app.listen(PORT, () => console.log(`Application running ${PORT}`));
