require ('express-async-errors');
require('dotenv').config();
const express = require('express');
const dogRouter = require('/Users/shaanmehta/aa-projects/november/practice-for-week-10-express-long-practice/server/routes/dogs.js')

const app = express();

console.log('LOADED ENV: ', process.env.NODE_ENV);

app.use("/static", express.static('assets'));
app.use(express.json());


// Logger middleware
app.use((req, res, next) => {
  console.log(req.method);
  console.log(req.url);

  res.locals.errorThrown = false;

  res.on('finish', () => {
    if (!res.locals.errorThrown) {
      console.log(res.statusCode);
    }
  })
  next();
})

app.use("/dogs", dogRouter);


// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

// Resource not found

app.use((req, res, next) => {

  res.status(404);
  throw new Error ("The requested resource couldn't be found")
})

//Error handler
app.use((err, req, res, next) => {

  const status = err.statusCode || 500;

  res.locals.errorThrown = true;

  if (process.env.NODE_ENV === 'production') {
    res.status(status).json({
      "message": err.message || "Something went wrong",
      "statusCode": status
    })
  } else {

    console.log(err.stack);

    res.status(status).json({
      "message": err.message || "Something went wrong",
      "statusCode": status,
      "stack": err.stack
    })
  }
})

const port = 5001;
app.listen(port, () => console.log('Server is listening on port', port));
