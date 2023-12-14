START transaction;

SELECT
--  empmSttsCn,accrRqisCn
-- views
minAge,maxAge,ageInfo
FROM T_youth_policies_TEST
WHERE 1=1
-- AND bizId = 'R2023060212950'

-- UPDATE T_youth_policies SET views = views + 1 WHERE rnum = 1
-- ALTER TABLE T_youth_policies ADD UNIQUE (bizId);
;


-- CREATE TABLE IF NOT EXISTS T_youth_policies_TEST (
--     rnum INT PRIMARY KEY,
--     bizId VARCHAR(255),
--     polyBizSecd VARCHAR(255),
--     polyBizTy VARCHAR(255),
--     polyBizSjnm TEXT,
--     polyItcnCn TEXT,
--     sporCn TEXT,
--     sporScvl VARCHAR(255),
--     bizPrdCn TEXT,
--     prdRpttSecd VARCHAR(255),
--     rqutPrdCn TEXT,
--     ageInfo VARCHAR(255),
--     majrRqisCn TEXT,
--     empmSttsCn TEXT,
--     splzRlmRqisCn TEXT,
--     accrRqisCn TEXT,
--     prcpCn TEXT,
--     aditRscn TEXT,
--     prcpLmttTrgtCn TEXT,
--     rqutProcCn TEXT,
--     pstnPaprCn TEXT,
--     jdgnPresCn TEXT,
--     rqutUrla TEXT,
--     rfcSiteUrla1 TEXT,
--     rfcSiteUrla2 TEXT,
--     mngtMson VARCHAR(255),
--     mngtMrofCherCn VARCHAR(255),
--     cherCtpcCn VARCHAR(255),
--     cnsgNmor VARCHAR(255),
--     tintCherCn TEXT,
--     tintCherCtpcCn TEXT,
--     etct TEXT,
--     polyRlmCd VARCHAR(255),
--     minAge VARCHAR(255),
--     maxAge VARCHAR(255),
--     startDate VARCHAR(255),
-- 	endDate VARCHAR(255)
-- 	
-- );
-- ALTER TABLE T_youth_policies_TEST ADD UNIQUE (bizId);

-- ALTER TABLE T_youth_policies_TEST CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ROLLBACK;