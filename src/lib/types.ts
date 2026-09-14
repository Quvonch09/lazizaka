// ============================================================================
// O'quv Markazi Moliyaviy Boshqaruv Tizimi - TypeScript Turlari (Types)
// ============================================================================

export type MonthName = 'May' | 'Iyun' | 'Iyul' | 'Avgust' | string;

export type PaymentMethod = 'naqd' | 'click';
export type ExpensePeriodType = 'oldingi' | 'shu' | 'keyingi';
export type LedgerType = 'kirim' | 'chiqim';

/**
 * 1. O'quvchi modeli
 */
export interface Student {
  id: string;
  ifo: string;               // O'quvchi ismi familiyasi (I.F.O)
  tel_oila?: string;         // Oilasining telefoni
  tel_oziniki?: string;      // O'zining telefoni
  created_at?: string;
}

/**
 * 2. To'lovlar modeli (Kirim moduli)
 */
export interface Payment {
  id: string;
  student_id?: string;
  ifo: string;               // O'quvchi to'liq ismi
  tel_oila?: string;
  tel_oziniki?: string;
  oy: MonthName;             // Hisobot oyi: 'May', 'Iyun', 'Iyul', 'Avgust'
  oylik_narx: number;        // Kurs narxi (masalan 650, 750 yoki ming so'mda)
  naxt: number;              // Naqd to'langan summa
  click: number;             // Click/karta orqali to'langan summa
  qoldiq: number;            // Qoldiq = Oylik to'lov - (Naxt + Click)
  tolov_sanasi_1?: string;   // ISO date (YYYY-MM-DD)
  tolov_sanasi_2?: string;   // ISO date (YYYY-MM-DD)
  raw_date_1?: string | number; // Exceldagi asl xom format ("11,08,26", 46143, etc.)
  raw_date_2?: string | number;
  guruh: string;             // Gurux: "AI-1", "python-8", "java 10", "fullstack-3"
  izoh?: string;             // Masalan: "Elnurga bergan", "Jasminaga tashagan"
  man_olmaganman?: boolean;  // "Man olmaganman" yozilgan bo'lsa = to'liq qarzdor
}

/**
 * 3. Xodim modeli
 */
export interface Staff {
  id: string;
  fio: string;               // Xodim ismi (Elnur Turdiyev direktor, Temurbek, Ismat)
  lavozim?: string;
  oylik: number;             // Belgilangan bazaviy oylik (6000, 1836...)
  ulush_foizi?: number;      // Ulush foizi (masalan 0.17 = 17%)
  created_at?: string;
}

/**
 * 4. Xodim maosh tranzaksiyalari (Chiqim moduli - A bloki)
 * LOGIKA: yakuniy_jami = oylik + oldingi_qarz - avans - oshxona
 */
export interface SalaryTransaction {
  id: string;
  staff_id?: string;
  fio: string;
  oy: MonthName;
  oylik: number;             // Asosiy oylik maosh
  ulush_foizi?: number;      // t (masalan 0.17)
  avans: number;             // Berilgan avans
  oldingi_qarz: number;      // Oldingi oydan qolgan qarz
  shu_oy_uchun: number;      // Shu oy hisobidan ajratilgan
  oshxona: number;           // Oshxona tushlik xarajatlari (Oshxona modulidan bog'lanadi)
  yakuniy_jami: number;      // Jami = Oyligi + oldingi oy qarzi - berilgan Avans - Oshxona
  izoh?: string;
}

/**
 * 5. Markaz xarajatlari (Chiqim moduli - B bloki)
 * Naqd va Click alohida balansda yuritiladi!
 */
export interface CenterExpense {
  id: string;
  sana: string;              // ISO formatdagi sana (YYYY-MM-DD)
  raw_sana?: string | number;
  kimga: string;             // Targetga, svetga, internetga, baxora opaga, kuller, arenda, soliq qarzlari
  izoh: string;              // Masalan "reklama o'chib qolmasligi uchun", "pol yuvishga sredstvalar"
  summa: number;             // Xarajat summasi
  turi: PaymentMethod;       // 'naqd' | 'click'
  oy_turi: ExpensePeriodType;// 'oldingi' | 'shu' | 'keyingi'
  oy: MonthName;             // Xarajat tegishli bo'lgan hisobot oyi
}

/**
 * 6. Oshxona xarajatlari (Oshxona moduli)
 */
export interface KitchenDailyExpense {
  kun: number;               // 1 dan 31 gacha
  summa: number;             // 25, 30, 35 yoki dam olish (0)
  isRestDay: boolean;        // 'X' bo'lsa true
}

export interface KitchenStaffMonthly {
  id: string;
  staff_id?: string;
  fio: string;               // Ustoz ismi-sharifi
  oy: MonthName;
  kunlar: Record<number, number | 'X'>; // 1-31 kunlik kataklar
  jami: number;              // Oylik jami ovqat xarajati (summa)
}

export interface KitchenExpenseItem {
  id: string;
  staff_id?: string;
  fio: string;
  oy: MonthName;
  kun: number;
  summa: number;
}

/**
 * 7. Click daftari (Click moduli - faqat Iyun yoki mavjud oylarda)
 */
export interface ClickLedgerEntry {
  id: string;
  turi: LedgerType;          // 'kirim' | 'chiqim'
  sana: string;              // ISO format (YYYY-MM-DD)
  raw_sana?: string | number;
  ifo?: string;              // Kirim bo'lsa to'lovchi ismi
  summa: number;
  izoh: string;              // Masalan: "Arendaga yetmagandi yechib oldi", "Soliq qarzlariga to'landi"
  oy: MonthName;
}

/**
 * 8. Qarzdorlar hisoboti modeli
 */
export interface StudentDebtor {
  ifo: string;
  guruh: string;
  tel_oila?: string;
  tel_oziniki?: string;
  oylik_narx: number;
  tolangan_naxt: number;
  tolangan_click: number;
  qoldiq: number;            // Qarz summasi (> 0)
  izoh?: string;
  man_olmaganman?: boolean;
}

/**
 * 9. Oylik moliyaviy yakuniy hisobot
 */
export interface MonthlyProfitReport {
  oy: MonthName;
  tushum: number;            // Jami tushum = Barcha o'quvchilar Naxt + Clisk
  tushum_naxt: number;       // O'quvchilardan tushgan naqd
  tushum_click: number;      // O'quvchilardan tushgan Click
  xarajat: number;           // Jami xarajatlar = Xodimlar Jami + Markaz xarajatlari
  xodimlar_jami: number;     // Xodimlarga to'lanadigan jami maosh
  markaz_xarajatlari: number;// Markazning barcha xarajatlari
  markaz_naqd: number;       // Markaz naqd xarajatlari
  markaz_click: number;      // Markaz click xarajatlari
  sof_foyda: number;         // Sof Foyda = Jami tushum - Jami xarajatlar
  foyda_rentabelligi: number;// Foydalilik foizi (%)
  jami_qarzlar: number;      // Yig'ilmagan jami qoldiq summa
  qarzdorlar_soni: number;   // Qarzdor o'quvchilar soni
  jami_oquvchilar: number;   // Jami o'quvchilar soni
}

/**
 * 10. Pul oqimi (Cash Flow) hisoboti
 */
export interface CashFlowBalance {
  kirim: number;
  chiqim: number;
  qoldiq: number;            // Kirim - Chiqim
}

export interface CashFlowReport {
  oy?: MonthName | 'Barcha davr';
  naqd: CashFlowBalance;     // Naqd pul balansi
  click: CashFlowBalance;    // Click pul balansi
  jami_qoldiq: number;       // Naqd qoldiq + Click qoldiq
}

/**
 * To'liq parsed oy to'plami
 */
export interface ParsedMonthData {
  oy: MonthName;
  payments: Payment[];
  salaryTransactions: SalaryTransaction[];
  centerExpenses: CenterExpense[];
  kitchenMonthly: KitchenStaffMonthly[];
  clickLedger: ClickLedgerEntry[];
  summary?: MonthlyProfitReport;
}
