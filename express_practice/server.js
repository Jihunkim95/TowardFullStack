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

  // 서버 시작
app.listen(3000,'0.0.0.0', () => {
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


// 외부 API에서 XML 데이터를 가져와 MySQL에 저장하는 함수
async function fetchAndStoreXMLData() {
    const openApiVlak = 'ba522657bfea6c5477a251ee';
    const pageIndex = '6';  
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
            //날짜를 가져져우는 함수
            function extractDates(input) {
                const datePattern = /(\d{4})\. ?(\d{1,2})\.? ?(\d{1,2})?/g;
                let matches = [...input.matchAll(datePattern)];
            
                if (matches.length === 2) {
                    let startDate = new Date(matches[0][1], matches[0][2]-1, matches[0][3] || 1);
                    startDate.setDate(startDate.getDate() + 1);
                    let endDate = new Date(matches[1][1], matches[1][2] - 1, matches[1][3] || new Date(matches[1][1], matches[1][2], 0).getDate());
            
                    let formattedStartDate = startDate.toISOString().slice(0, 10).replace(/-/g, '');
                    let formattedEndDate = endDate.toISOString().slice(0, 10).replace(/-/g, '');
            
                    return [formattedStartDate, formattedEndDate];
                } else {
                    return ["상세확인", "상세확인"];
                }
            }
            youthPolicies.forEach(policy => {
            // 'ageInfo'에서 숫자만 추출
            const ageNumbers = policy.ageInfo.match(/\d+/g) || [];

            if (policy.ageInfo === "제한없음") {
                // '제한없음'의 경우 minAge를 0으로, maxAge를 200으로 설정
                minAge = '0';
                maxAge = '200';
            } else if (ageNumbers.length >= 2) {
                // 두 개 이상의 숫자가 있는 경우, 첫 번째 숫자를 minAge로, 두 번째 숫자를 maxAge로
                [minAge, maxAge] = ageNumbers;
            } else if (ageNumbers.length === 1) {
                // 숫자가 하나만 있는 경우, minAge를 0으로, maxAge를 해당 숫자로 설정
                minAge = '0';
                maxAge = ageNumbers[0];
            } else {
                // 숫자가 없는 경우 기본값을 설정
                minAge = '0';
                maxAge = '0';
            }

                //날짜 추출
                let [startDate, endDate] = extractDates(policy.bizPrdCn);
                console.log(startDate, endDate);

                const query = 'INSERT INTO T_youth_policies_TEST SET ?';
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
                    polyRlmCd: policy.polyRlmCd,
                    minAge: minAge, // 최저나이
                    maxAge: maxAge, // 최고나이
                    startDate: startDate, //날짜 시작
                    endDate: endDate //날짜 끝
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
    let query = "SELECT * FROM T_youth_policies WHERE 1 = 1";
    const queryParams = [];
    //주거지
    if (req.query.residence) {
        query += " AND (polyBizSecd = ? or polyBizSecd = '003002008')";
        queryParams.push(req.query.residence);
    }

    //취업상태
    if (req.query.employmentStatus) {
        let employmentStatus = req.query.employmentStatus === "전체선택" ? `%${""}%` : `%${req.query.employmentStatus}%`;
        query += " AND ((empmSttsCn = '' OR empmSttsCn LIKE ?) OR (empmSttsCn LIKE '%제한없음%' OR empmSttsCn = '-'))";
        queryParams.push(`%${employmentStatus}%`); // ? 값을 %value%로 변경
    }
 
    //학력
    if (req.query.educationLevel) {
        let educationLevel = req.query.educationLevel === "전체선택" ? `%${""}%` : `%${req.query.educationLevel}%`;
        query += " AND ((accrRqisCn = '' OR accrRqisCn LIKE ?) OR (accrRqisCn LIKE '%제한없음%' OR accrRqisCn = '-'))";
        queryParams.push(educationLevel); // ? 값을 %value%로 변경
    }
    //만나이
    if (req.query.age) {
        query += " AND (? >= minAge AND ? <= maxAge)";
        queryParams.push(req.query.age,req.query.age);
    }
    //관심 정책
    if (req.query.policyName) {
        query += " AND (polyBizSjnm LIKE ?) ";
        queryParams.push(`%${req.query.policyName}%`);
    }

    pool.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).send('Server error');
            return;
        }

        // 결과를 JSON 형식으로 변환하여 반환
        res.json(results);
    });
});

//JSON 요청 본문을 파싱
app.use(express.json());

// POST 
app.post('/youth-policies/views', (req, res) => {
    // 요청 본문에서 'bizId'를 추출
    const { bizId } = req.body;
    console.log(req.body);
    if (!bizId) {
        // 'bizId'가 없으면, 400 Bad Request 에러를 클라이언트에게 응답
        return res.status(400).json({ message: 'bizId is required' });
    }

    // 파라미터로 인젝션 방지
    const sql = `UPDATE T_youth_policies SET views = views + 1 WHERE bizId = ?`;

    // 데이터베이스 쿼리를 실행
    pool.query(sql, [bizId], (err, result) => {
        if (err) {
            // 데이터베이스 에러가 발생하면, 서버 에러 메시지를 응답합니다.
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }

        // 성공적으로 업데이트가 완료되면, 성공 메시지를 클라이언트에게 응답합니다.
        res.status(200).json({ message: 'View count updated successfully' });
    });
});
