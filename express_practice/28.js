const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
  res.send(`
  <form action="/" method="post">
    <input type="submit" name="position" value="문과생">
    <input type="submit" name="position" value="이과생">
  </form>
  `);
});

app.post('/', (req, res) => {
  console.log(req.body);
});

app.listen(3000, () => {
  console.log('3000 포트에서 서버 시작');
})