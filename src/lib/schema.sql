-- ============================================================================
-- O'QUV MARKAZI MOLIYAVIY BOSHQARUV TIZIMI - DATABASE SCHEMA (PostgreSQL / Supabase)
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. STUDENTS (O'quvchilar jadvali)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ifo VARCHAR(255) NOT NULL,                        -- O'quvchi to'liq ismi (I.F.O)
    tel_oila VARCHAR(50),                              -- Oila a'zosi / Ota-onasi telefoni
    tel_oziniki VARCHAR(50),                           -- O'quvchining shaxsiy telefoni
    asosiy_guruh VARCHAR(100),                         -- Asosiy guruhi (masalan: AI-1, python-8)
    status VARCHAR(50) DEFAULT 'faol',                 -- faol, muzlatilgan, bitirgan
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_ifo ON students(ifo);

-- ----------------------------------------------------------------------------
-- 2. PAYMENTS (To'lovlar jadvali - Kirim moduli)
-- LOGIKA: qoldiq = oylik_narx - (naxt + click)
-- "Man olmaganman" holatida: naxt = 0, click = 0, qoldiq = oylik_narx
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    ifo VARCHAR(255) NOT NULL,                        -- O'quvchi ismi (tarixiylik uchun saqlanadi)
    oy VARCHAR(50) NOT NULL,                          -- Hisobot oyi: 'May', 'Iyun', 'Iyul', 'Avgust'
    oylik_narx NUMERIC(12, 2) NOT NULL DEFAULT 0,     -- Belgilangan kurs narxi (650, 750...)
    naxt NUMERIC(12, 2) NOT NULL DEFAULT 0,           -- Naqd to'lov
    click NUMERIC(12, 2) NOT NULL DEFAULT 0,          -- Click / karta to'lovi
    qoldiq NUMERIC(12, 2) NOT NULL DEFAULT 0,         -- Qoldiq qarzdorlik
    tolov_sanasi_1 DATE,                              -- 1-to'lov sanasi (ISO date)
    tolov_sanasi_2 DATE,                              -- 2-to'lov sanasi (ISO date)
    raw_date_1 TEXT,                                  -- Exceldagi original format (46143, 11,08,26...)
    raw_date_2 TEXT,
    guruh VARCHAR(100) NOT NULL,                      -- AI-1, python-8, java 10, fullstack-3...
    izoh TEXT,                                        -- "Elnurga bergan", "Jasminaga tashagan"
    man_olmaganman BOOLEAN DEFAULT FALSE,             -- "Man olmaganman" belgisi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_oy ON payments(oy);
CREATE INDEX IF NOT EXISTS idx_payments_guruh ON payments(guruh);
CREATE INDEX IF NOT EXISTS idx_payments_qoldiq ON payments(qoldiq);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);

-- ----------------------------------------------------------------------------
-- 3. STAFF (Xodimlar va Ustozlar jadvali)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fio VARCHAR(255) NOT NULL,                        -- Elnur Turdiyev direktor, Temurbek, Ismat...
    lavozim VARCHAR(100),                             -- Direktor, Ustoz, Administrator...
    oylik NUMERIC(12, 2) NOT NULL DEFAULT 0,          -- Belgilangan oylik maosh (6000, 1836...)
    ulush_foizi NUMERIC(5, 4) DEFAULT 0,              -- Ulush ko'rsatkichi (masalan: 0.17 = 17%, 0.12 = 12%)
    telefon VARCHAR(50),
    status VARCHAR(50) DEFAULT 'faol',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_fio ON staff(fio);

-- ----------------------------------------------------------------------------
-- 4. SALARY_TRANSACTIONS (Xodimlar oylik maosh hisoboti - Chiqim moduli A)
-- LOGIKA: yakuniy_jami = oylik + oldingi_qarz - avans - oshxona
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS salary_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    fio VARCHAR(255) NOT NULL,
    oy VARCHAR(50) NOT NULL,                          -- Hisobot oyi ('May', 'Iyun', 'Iyul', 'Avgust')
    oylik NUMERIC(12, 2) NOT NULL DEFAULT 0,          -- Belgilangan oylik
    ulush_foizi NUMERIC(5, 4) DEFAULT 0,              -- t (masalan 0.17)
    avans NUMERIC(12, 2) NOT NULL DEFAULT 0,          -- Berilgan avans
    oldingi_qarz NUMERIC(12, 2) NOT NULL DEFAULT 0,   -- Oldingi oydan qolgan qarz
    shu_oy_uchun NUMERIC(12, 2) NOT NULL DEFAULT 0,   -- Shu oy uchun ajratilgan qism
    oshxona NUMERIC(12, 2) NOT NULL DEFAULT 0,        -- Oshxona tushlik xarajatlari ushlanmasi
    yakuniy_jami NUMERIC(12, 2) NOT NULL DEFAULT 0,   -- Yakunda beriladigan qo'lga tegadigan summa
    izoh TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_salary_oy ON salary_transactions(oy);
CREATE INDEX IF NOT EXISTS idx_salary_staff ON salary_transactions(staff_id);

-- ----------------------------------------------------------------------------
-- 5. CENTER_EXPENSES (Markaz xarajatlari - Chiqim moduli B)
-- NAQD va CLICK alohida balansda yuritiladi!
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS center_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sana DATE NOT NULL,                               -- Xarajat qilingan kun (ISO date)
    raw_sana TEXT,                                    -- Original format
    kimga VARCHAR(255) NOT NULL,                      -- Targetga, svetga, internetga, kuller, arenda, soliq qarzlari
    izoh TEXT,                                        -- "reklama o'chib qolmasligi uchun", "pol yuvishga sredstvalar"
    summa NUMERIC(12, 2) NOT NULL DEFAULT 0,          -- Xarajat summasi
    turi VARCHAR(20) NOT NULL CHECK (turi IN ('naqd', 'click')), -- Naqd yoki Click
    oy_turi VARCHAR(20) NOT NULL CHECK (oy_turi IN ('oldingi', 'shu', 'keyingi')), -- oldingi / shu / keyingi oy uchun
    oy VARCHAR(50) NOT NULL,                          -- Tegishli hisobot oyi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_oy ON center_expenses(oy);
CREATE INDEX IF NOT EXISTS idx_expenses_turi ON center_expenses(turi);
CREATE INDEX IF NOT EXISTS idx_expenses_sana ON center_expenses(sana);

-- ----------------------------------------------------------------------------
-- 6. KITCHEN_EXPENSES (Oshxona moduli - Ustozlar obedi)
-- Har bir ustozning oylik har kunlik tushlik qaydlari
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kitchen_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    fio VARCHAR(255) NOT NULL,                        -- Ustoz ismi
    oy VARCHAR(50) NOT NULL,                          -- Hisobot oyi
    kun SMALLINT NOT NULL CHECK (kun >= 1 AND kun <= 31), -- 1 dan 31 gacha kun
    summa NUMERIC(10, 2) NOT NULL DEFAULT 0,          -- Kunlik ovqat narxi (25, 30, 35 yoki dam olishda 0)
    is_rest_day BOOLEAN DEFAULT FALSE,                -- 'X' bo'lsa dam olish kuni
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kitchen_oy ON kitchen_expenses(oy);
CREATE INDEX IF NOT EXISTS idx_kitchen_staff ON kitchen_expenses(staff_id);

-- ----------------------------------------------------------------------------
-- 7. CLICK_LEDGER (Click moduli - Kirim va Chiqim daftari)
-- Faqat Click tranzaksiyalari (masalan Iyun faylida mavjud)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS click_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    turi VARCHAR(20) NOT NULL CHECK (turi IN ('kirim', 'chiqim')), -- Kirim yoki Chiqim
    sana DATE NOT NULL,
    raw_sana TEXT,
    ifo VARCHAR(255),                                 -- Kirim bo'lsa to'lovchi I.F.O
    summa NUMERIC(12, 2) NOT NULL DEFAULT 0,
    izoh TEXT,                                        -- "Arendaga yetmagandi yechib oldi", "Soliq qarzlariga to`landi"
    oy VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_click_ledger_oy ON click_ledger(oy);
CREATE INDEX IF NOT EXISTS idx_click_ledger_turi ON click_ledger(turi);

-- ============================================================================
-- AVTOMATIK TRIGGERLAR (Biznes-logika yaxlitligini ta'minlash)
-- ============================================================================

-- To'lov qoldig'ini avtomatik hisoblash triggeri
CREATE OR REPLACE FUNCTION trg_calculate_payment_debt()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.man_olmaganman = TRUE THEN
        NEW.naxt := 0;
        NEW.click := 0;
        NEW.qoldiq := NEW.oylik_narx;
    ELSE
        NEW.qoldiq := NEW.oylik_narx - (COALESCE(NEW.naxt, 0) + COALESCE(NEW.click, 0));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payment_calc ON payments;
CREATE TRIGGER trg_payment_calc
BEFORE INSERT OR UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION trg_calculate_payment_debt();

-- Xodim oylik yakuniy maoshini hisoblash triggeri
CREATE OR REPLACE FUNCTION trg_calculate_salary_final()
RETURNS TRIGGER AS $$
BEGIN
    -- Yakuniy jami = Oyligi + oldingi oy qarzi - berilgan Avans - Oshxona
    NEW.yakuniy_jami := COALESCE(NEW.oylik, 0) 
                      + COALESCE(NEW.oldingi_qarz, 0) 
                      - COALESCE(NEW.avans, 0) 
                      - COALESCE(NEW.oshxona, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_salary_calc ON salary_transactions;
CREATE TRIGGER trg_salary_calc
BEFORE INSERT OR UPDATE ON salary_transactions
FOR EACH ROW EXECUTE FUNCTION trg_calculate_salary_final();

-- ============================================================================
-- HISOBOT VIEWLARI (SQL Reports)
-- ============================================================================

-- 1. Oylik Foyda va Zarar (Profit & Loss View)
CREATE OR REPLACE VIEW v_monthly_profit_loss AS
WITH tushum_summary AS (
    SELECT 
        oy,
        SUM(COALESCE(naxt, 0) + COALESCE(click, 0)) AS jami_tushum,
        SUM(COALESCE(naxt, 0)) AS tushum_naxt,
        SUM(COALESCE(click, 0)) AS tushum_click,
        SUM(COALESCE(qoldiq, 0)) AS jami_qoldiq,
        COUNT(id) AS jami_oquvchilar,
        COUNT(CASE WHEN qoldiq > 0 THEN 1 END) AS qarzdorlar_soni
    FROM payments
    GROUP BY oy
),
xodim_summary AS (
    SELECT 
        oy,
        SUM(COALESCE(yakuniy_jami, 0)) AS xodimlar_jami
    FROM salary_transactions
    GROUP BY oy
),
markaz_summary AS (
    SELECT 
        oy,
        SUM(COALESCE(summa, 0)) AS markaz_xarajatlari,
        SUM(CASE WHEN turi = 'naqd' THEN COALESCE(summa, 0) ELSE 0 END) AS markaz_naqd,
        SUM(CASE WHEN turi = 'click' THEN COALESCE(summa, 0) ELSE 0 END) AS markaz_click
    FROM center_expenses
    GROUP BY oy
)
SELECT 
    t.oy,
    COALESCE(t.jami_tushum, 0) AS jami_tushum,
    COALESCE(t.tushum_naxt, 0) AS tushum_naxt,
    COALESCE(t.tushum_click, 0) AS tushum_click,
    (COALESCE(x.xodimlar_jami, 0) + COALESCE(m.markaz_xarajatlari, 0)) AS jami_xarajat,
    COALESCE(x.xodimlar_jami, 0) AS xodimlar_maoshi,
    COALESCE(m.markaz_xarajatlari, 0) AS markaz_xarajatlari,
    COALESCE(m.markaz_naqd, 0) AS markaz_naqd,
    COALESCE(m.markaz_click, 0) AS markaz_click,
    (COALESCE(t.jami_tushum, 0) - (COALESCE(x.xodimlar_jami, 0) + COALESCE(m.markaz_xarajatlari, 0))) AS sof_foyda,
    COALESCE(t.jami_qoldiq, 0) AS jami_qarzlar,
    COALESCE(t.qarzdorlar_soni, 0) AS qarzdorlar_soni,
    COALESCE(t.jami_oquvchilar, 0) AS jami_oquvchilar
FROM tushum_summary t
LEFT JOIN xodim_summary x ON t.oy = x.oy
LEFT JOIN markaz_summary m ON t.oy = m.oy;

-- 2. Qarzdorlar ro'yxati (Debtors View)
CREATE OR REPLACE VIEW v_debtors AS
SELECT 
    p.oy,
    p.ifo,
    p.guruh,
    p.oylik_narx,
    p.naxt,
    p.click,
    p.qoldiq,
    p.tel_oila,
    p.tel_oziniki,
    p.izoh,
    p.man_olmaganman,
    p.tolov_sanasi_1,
    p.tolov_sanasi_2
FROM payments p
WHERE p.qoldiq > 0
ORDER BY p.oy, p.qoldiq DESC;

-- 3. Pul Oqimi (Cash Flow) View - Naqd va Click balansi alohida
CREATE OR REPLACE VIEW v_cash_flow AS
WITH naqd_flow AS (
    SELECT 
        oy,
        SUM(COALESCE(naxt, 0)) AS naqd_kirim,
        0 AS naqd_chiqim
    FROM payments
    GROUP BY oy
    UNION ALL
    SELECT 
        oy,
        0 AS naqd_kirim,
        SUM(COALESCE(summa, 0)) AS naqd_chiqim
    FROM center_expenses
    WHERE turi = 'naqd'
    GROUP BY oy
),
click_flow AS (
    SELECT 
        oy,
        SUM(COALESCE(click, 0)) AS click_kirim,
        0 AS click_chiqim
    FROM payments
    GROUP BY oy
    UNION ALL
    SELECT 
        oy,
        0 AS click_kirim,
        SUM(COALESCE(summa, 0)) AS click_chiqim
    FROM center_expenses
    WHERE turi = 'click'
    GROUP BY oy
    UNION ALL
    SELECT 
        oy,
        SUM(CASE WHEN turi = 'kirim' THEN COALESCE(summa, 0) ELSE 0 END) AS click_kirim,
        SUM(CASE WHEN turi = 'chiqim' THEN COALESCE(summa, 0) ELSE 0 END) AS click_chiqim
    FROM click_ledger
    GROUP BY oy
)
SELECT 
    nf.oy,
    SUM(nf.naqd_kirim) AS naqd_kirim,
    SUM(nf.naqd_chiqim) AS naqd_chiqim,
    (SUM(nf.naqd_kirim) - SUM(nf.naqd_chiqim)) AS naqd_qoldiq,
    COALESCE(cf.click_kirim, 0) AS click_kirim,
    COALESCE(cf.click_chiqim, 0) AS click_chiqim,
    (COALESCE(cf.click_kirim, 0) - COALESCE(cf.click_chiqim, 0)) AS click_qoldiq,
    ((SUM(nf.naqd_kirim) - SUM(nf.naqd_chiqim)) + (COALESCE(cf.click_kirim, 0) - COALESCE(cf.click_chiqim, 0))) AS umumiy_pul_qoldig‘i
FROM naqd_flow nf
LEFT JOIN (
    SELECT 
        oy,
        SUM(click_kirim) AS click_kirim,
        SUM(click_chiqim) AS click_chiqim
    FROM click_flow
    GROUP BY oy
) cf ON nf.oy = cf.oy
GROUP BY nf.oy, cf.click_kirim, cf.click_chiqim;
