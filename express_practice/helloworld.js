const express = require('express');
const bodyParser = require('body-parser');
const bodyParserXML = require('body-parser-xml');
const xml2js = require('xml2js');

const app = express();

// XML을 파싱하기 위한 설정
bodyParserXML(app);
app.use(bodyParser.urlencoded({ extended: flase }));
app.use(bodyParser.json()); // JSON 파싱 설정 추가

// XML을 JSON으로 변환하는 미들웨어
app.use((req, res, next) => {
  const contentType = req.get('Content-Type');

  if (contentType === 'application/xml' || contentType === 'text/xml') {
    console.log("req.boby: ",req.body)
    let xmlData = req.body;

    // Check if req.body is an object, convert to string if necessary
    if (typeof req.body !== 'string') {
      xmlData = req.body.toString();
    }

    // Remove non-whitespace characters before first tag
    xmlData = xmlData.replace(/^[^<]+/, '');

    xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      req.body = result;
      next();
    });
  } else {
    next();
  }
});

// 이제 XML 데이터를 JSON으로 파싱할 수 있습니다.
app.post('/convert', (req, res) => {
  console.log(req.body)
  console.log('Received XML data:', req.body);

  res.json(req.body);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
