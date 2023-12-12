const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const mysql = require('mysql');

const app = express();

const axios = require('axios');
// MySQL 데이터베이스 연결 설정
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '3274',
    database: 'test_db' //접속할 db
  });

// 외부 API에서 XML 데이터를 가져와 MySQL에 저장하는 함수
async function fetchAndStoreXMLData() {
    const openApiVlak = 'ba522657bfea6c5477a251ee';
    const pageIndex = '2';  
    const display = '100';
    const srchPolyBizSecd = '003002008';  
      const apiUrl = `https://www.youthcenter.go.kr/opi/youthPlcyList.do?openApiVlak=${openApiVlak}&pageIndex=${pageIndex}&display=${display}&srchPolyBizSecd=${srchPolyBizSecd}`;


    try {
        const response = await axios.get(apiUrl);
        const xmlData = response.data;

        xml2js.parseString(xmlData, { explicitArray: false, trim: true }, (err, result) => {
            if (err) {
                console.error('XML parsing error:', err);
                return;
            }

            // 'youthPolicyList' 내의 'youthPolicy' 배열을 가져옴
            const youthPolicies = result.youthPolicyList.youthPolicy;
            if (!Array.isArray(youthPolicies)) {
                console.error('Invalid data structure');
                return;
            }

            youthPolicies.forEach(policy => {
                const query = 'INSERT INTO T_youth_policies SET ?';
                pool.query(query, {
                    rnum: policy.rnum,
                    bizId: policy.bizId,
                    polyBizSecd: policy.polyBizSecd,
                    polyBizTy: policy.polyBizTy,
                    polyBizSjnm: policy.polyBizSjnm,
                    polyItcnCn: policy.polyItcnCn,
                    sporCn: policy.sporCn,
                    sporScvl: policy.sporScvl,
                    bizPrdCn: policy.bizPrdCn,
                    prdRpttSecd: policy.prdRpttSecd,
                    rqutPrdCn: policy.rqutPrdCn,
                    ageInfo: policy.ageInfo,
                    majrRqisCn: policy.majrRqisCn,
                    empmSttsCn: policy.empmSttsCn,
                    splzRlmRqisCn: policy.splzRlmRqisCn,
                    accrRqisCn: policy.accrRqisCn,
                    prcpCn: policy.prcpCn,
                    aditRscn: policy.aditRscn,
                    prcpLmttTrgtCn: policy.prcpLmttTrgtCn,
                    rqutProcCn: policy.rqutProcCn,
                    pstnPaprCn: policy.pstnPaprCn,
                    jdgnPresCn: policy.jdgnPresCn,
                    rqutUrla: policy.rqutUrla,
                    rfcSiteUrla1: policy.rfcSiteUrla1,
                    rfcSiteUrla2: policy.rfcSiteUrla2,
                    mngtMson: policy.mngtMson,
                    mngtMrofCherCn: policy.mngtMrofCherCn,
                    cherCtpcCn: policy.cherCtpcCn,
                    cnsgNmor: policy.cnsgNmor,
                    tintCherCn: policy.tintCherCn,
                    tintCherCtpcCn: policy.tintCherCtpcCn,
                    etct: policy.etct,
                    polyRlmCd: policy.polyRlmCd
                }, (err, results) => {
                    if (err) {
                        console.error('Database insert error:', err);
                        return;
                    }
                    console.log('Data inserted, ID:', results.insertId);
                });
            });
        });
    } catch (error) {
        console.error('API request error:', error);
    }
}

// 데이터 가져오기 및 저장을 시작하는 라우트
app.get('/fetch-data', (req, res) => {
    fetchAndStoreXMLData();
    res.send('Started fetching and storing data.');
});


//T_youth_policies에 데이터를 가져와서 json형식으로 변환
app.get('/youth-policies', (req, res) => {

    const query = "SELECT * FROM T_youth_policies WHERE mngtMson LIKE '%화성%'"; // 데이터를 가져오는 SQL 쿼리

    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).send('Server error');
            return;
        }

        // 결과를 JSON 형식으로 변환하여 반환
        res.json(results);
    });
});

// 서버 시작
app.listen(3000, () => {
    console.log('Server running on port 3000');
        // 데이터베이스 연결 확인
        pool.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
            if (err) {
                console.error('Database connection error:', err);
                return;
            }
            console.log('Database connection successful, solution:', results[0].solution);
        });
});
