
global.foodData = require('./db')(function call(err, data, CatData) {
  // console.log(data)
  if (err) console.log(err);
  global.foodData = data;
  global.foodCategory = CatData;
})

const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json())

app.get('/', (req, res) => {
  res.send('SERVER IS RUNNING!')
})

app.use('/api/auth', require('./Routes/Auth'));
app.use('/api/auth', require('./Routes/Admin-Route'))
app.use('/api/auth', require('./Routes/UserApi'))

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})

