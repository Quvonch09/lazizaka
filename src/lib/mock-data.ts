// ============================================================================
// O'quv Markazi - 4 Oylik To'liq Mock Ma'lumotlar To'plami (May, Iyun, Iyul, Avgust)
// ============================================================================
// Ushbu ma'lumotlar foydalanuvchi taqdim etgan real Excel strukturalari
// va barcha o'ziga xos holatlar ("Man olmaganman", sana formatlari, ulushlar,
// xarajatlar, oshxona va click daftari) asosida shakllantirilgan.
// ============================================================================

import { ParsedMonthData } from './types';
import { parseExcelDate } from './finance-parser';

// ----------------------------------------------------------------------------
// 1. MAY OYI MA'LUMOTLARI
// ----------------------------------------------------------------------------
export const mayData: ParsedMonthData = {
  oy: 'May',
  payments: [
    {
      id: 'may_pay_1',
      ifo: 'Abdullayev Jasur',
      tel_oila: '+998901234567',
      tel_oziniki: '+998931112233',
      oy: 'May',
      oylik_narx: 750,
      naxt: 500,
      click: 250,
      qoldiq: 0,
      tolov_sanasi_1: parseExcelDate('46143') || '2026-05-02', // Serial format
      tolov_sanasi_2: parseExcelDate('2026-05-18 00:00:00') || '2026-05-18',
      raw_date_1: '46143',
      raw_date_2: '2026-05-18 00:00:00',
      guruh: 'AI-1',
      izoh: 'Elnurga bergan',
      man_olmaganman: false
    },
    {
      id: 'may_pay_2',
      ifo: 'Karimova Dilnoza',
      tel_oila: '+998912223344',
      tel_oziniki: '+998993334455',
      oy: 'May',
      oylik_narx: 650,
      naxt: 0,
      click: 650,
      qoldiq: 0,
      tolov_sanasi_1: parseExcelDate('05,05,26') || '2026-05-05', // Vergul formati
      raw_date_1: '05,05,26',
      guruh: 'python-8',
      izoh: 'Jasminaga tashagan',
      man_olmaganman: false
    },
    {
      id: 'may_pay_3',
      ifo: 'Sultonov Bekzod',
      tel_oila: '+998905556677',
      tel_oziniki: '+998978889900',
      oy: 'May',
      oylik_narx: 750,
      naxt: 350,
      click: 0,
      qoldiq: 400, // 750 - 350 = 400 qarzdor
      tolov_sanasi_1: parseExcelDate('46148') || '2026-05-07',
      raw_date_1: '46148',
      guruh: 'AI-1',
      izoh: 'Qolganini 25-sanada beradi',
      man_olmaganman: false
    },
    {
      id: 'may_pay_4',
      ifo: 'Rustamov Sardor',
      tel_oila: '+998941239876',
      tel_oziniki: '',
      oy: 'May',
      oylik_narx: 650,
      naxt: 0,
      click: 0,
      qoldiq: 650, // Man olmaganman => to'liq qarzdor
      guruh: 'fullstack-3',
      izoh: 'Man olmaganman',
      man_olmaganman: true
    },
    {
      id: 'may_pay_5',
      ifo: 'Nazarova Madina',
      tel_oila: '+998909876543',
      tel_oziniki: '+998918765432',
      oy: 'May',
      oylik_narx: 750,
      naxt: 400,
      click: 350,
      qoldiq: 0,
      tolov_sanasi_1: parseExcelDate('10,05,26') || '2026-05-10',
      raw_date_1: '10,05,26',
      guruh: 'java 10',
      izoh: 'Elnur bilan shunday gaplashishgan ekan',
      man_olmaganman: false
    },
    {
      id: 'may_pay_6',
      ifo: 'Yoqubov Davron',
      tel_oila: '+998934445566',
      tel_oziniki: '+998907778899',
      oy: 'May',
      oylik_narx: 650,
      naxt: 300,
      click: 0,
      qoldiq: 350,
      tolov_sanasi_1: parseExcelDate('12,05,26') || '2026-05-12',
      raw_date_1: '12,05,26',
      guruh: 'python-8',
      izoh: 'Yarmini tolagan',
      man_olmaganman: false
    }
  ],
  salaryTransactions: [
    {
      id: 'may_sal_1',
      fio: 'Elnur Turdiyev direktor',
      oy: 'May',
      oylik: 6000,
      ulush_foizi: 0.17, // 17% ulush
      avans: 1000,
      oldingi_qarz: 500,
      shu_oy_uchun: 5500,
      oshxona: 280, // Kitchen jami
      yakuniy_jami: 6000 + 500 - 1000 - 280, // 5220
      izoh: 'Direktor ulushi hisoblangan'
    },
    {
      id: 'may_sal_2',
      fio: 'Temurbek',
      oy: 'May',
      oylik: 3500,
      ulush_foizi: 0.12,
      avans: 500,
      oldingi_qarz: 0,
      shu_oy_uchun: 3000,
      oshxona: 310,
      yakuniy_jami: 3500 + 0 - 500 - 310, // 2690
      izoh: 'Python ustozi'
    },
    {
      id: 'may_sal_3',
      fio: 'Ismat',
      oy: 'May',
      oylik: 1836,
      ulush_foizi: 0,
      avans: 300,
      oldingi_qarz: 150,
      shu_oy_uchun: 1686,
      oshxona: 190,
      yakuniy_jami: 1836 + 150 - 300 - 190, // 1496
      izoh: 'Mentor'
    }
  ],
  centerExpenses: [
    {
      id: 'may_exp_1',
      sana: '2026-05-02',
      raw_sana: '46143',
      kimga: 'arenda',
      izoh: 'Bino oylik ijara haqi',
      summa: 3000,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'May'
    },
    {
      id: 'may_exp_2',
      sana: '2026-05-05',
      raw_sana: '05,05,26',
      kimga: 'targetga',
      izoh: "reklama o'chib qolmasligi uchun",
      summa: 650,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'May'
    },
    {
      id: 'may_exp_3',
      sana: '2026-05-08',
      raw_sana: '08,05,26',
      kimga: 'svetga',
      izoh: "Elektr energiyasi to'lovi",
      summa: 380,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'May'
    },
    {
      id: 'may_exp_4',
      sana: '2026-05-12',
      raw_sana: '12,05,26',
      kimga: 'internetga',
      izoh: 'Optik tolali internet oylik tolovi',
      summa: 220,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'May'
    },
    {
      id: 'may_exp_5',
      sana: '2026-05-15',
      raw_sana: '15,05,26',
      kimga: 'baxora opaga',
      izoh: 'pol yuvishga sredstvalar va tozalash xizmati',
      summa: 400,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'May'
    },
    {
      id: 'may_exp_6',
      sana: '2026-05-20',
      raw_sana: '20,05,26',
      kimga: 'kuller',
      izoh: 'Oshxona va xonalar uchun toza suv',
      summa: 120,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'May'
    },
    {
      id: 'may_exp_7',
      sana: '2026-05-25',
      raw_sana: '25,05,26',
      kimga: 'soliq qarzlari',
      izoh: 'Soliqdan kelgan talabnoma tolovi',
      summa: 500,
      turi: 'click',
      oy_turi: 'oldingi',
      oy: 'May'
    }
  ],
  kitchenMonthly: [
    {
      id: 'may_kit_1',
      fio: 'Elnur Turdiyev direktor',
      oy: 'May',
      kunlar: { 1: 35, 2: 35, 3: 'X', 4: 35, 5: 35, 6: 35, 7: 35, 8: 35, 9: 35, 10: 'X' },
      jami: 280
    },
    {
      id: 'may_kit_2',
      fio: 'Temurbek',
      oy: 'May',
      kunlar: { 1: 30, 2: 30, 3: 30, 4: 30, 5: 30, 6: 'X', 7: 30, 8: 30, 9: 30, 10: 30, 11: 40 },
      jami: 310
    },
    {
      id: 'may_kit_3',
      fio: 'Ismat',
      oy: 'May',
      kunlar: { 1: 25, 2: 25, 3: 25, 4: 'X', 5: 25, 6: 25, 7: 25, 8: 25, 9: 15 },
      jami: 190
    }
  ],
  clickLedger: []
};

// ----------------------------------------------------------------------------
// 2. IYUN OYI MA'LUMOTLARI (Click daftari bilan birga)
// ----------------------------------------------------------------------------
export const juneData: ParsedMonthData = {
  oy: 'Iyun',
  payments: [
    {
      id: 'jun_pay_1',
      ifo: 'Abdullayev Jasur',
      tel_oila: '+998901234567',
      tel_oziniki: '+998931112233',
      oy: 'Iyun',
      oylik_narx: 750,
      naxt: 750,
      click: 0,
      qoldiq: 0,
      tolov_sanasi_1: '2026-06-03',
      raw_date_1: '03,06,26',
      guruh: 'AI-1',
      izoh: 'Toliq tolandi',
      man_olmaganman: false
    },
    {
      id: 'jun_pay_2',
      ifo: 'Karimova Dilnoza',
      tel_oila: '+998912223344',
      tel_oziniki: '+998993334455',
      oy: 'Iyun',
      oylik_narx: 650,
      naxt: 200,
      click: 450,
      qoldiq: 0,
      tolov_sanasi_1: '2026-06-05',
      raw_date_1: '2026-06-05 00:00:00',
      guruh: 'python-8',
      izoh: 'Jasminaga tashagan',
      man_olmaganman: false
    },
    {
      id: 'jun_pay_3',
      ifo: 'Sultonov Bekzod',
      tel_oila: '+998905556677',
      tel_oziniki: '+998978889900',
      oy: 'Iyun',
      oylik_narx: 750,
      naxt: 0,
      click: 500,
      qoldiq: 250,
      tolov_sanasi_1: '2026-06-10',
      raw_date_1: '10,06,26',
      guruh: 'AI-1',
      izoh: 'Qolgani oy oxiriga',
      man_olmaganman: false
    },
    {
      id: 'jun_pay_4',
      ifo: 'Tolipov Anvar',
      tel_oila: '+998907891234',
      tel_oziniki: '+998971234567',
      oy: 'Iyun',
      oylik_narx: 750,
      naxt: 0,
      click: 0,
      qoldiq: 750,
      guruh: 'java 10',
      izoh: 'Man olmaganman',
      man_olmaganman: true
    },
    {
      id: 'jun_pay_5',
      ifo: 'Xoliqova Shahnoza',
      tel_oila: '+998935551122',
      tel_oziniki: '+998946663344',
      oy: 'Iyun',
      oylik_narx: 650,
      naxt: 400,
      click: 250,
      qoldiq: 0,
      tolov_sanasi_1: '2026-06-12',
      raw_date_1: '46175',
      guruh: 'fullstack-3',
      izoh: 'Elnurga bergan',
      man_olmaganman: false
    }
  ],
  salaryTransactions: [
    {
      id: 'jun_sal_1',
      fio: 'Elnur Turdiyev direktor',
      oy: 'Iyun',
      oylik: 6000,
      ulush_foizi: 0.17,
      avans: 1200,
      oldingi_qarz: 0,
      shu_oy_uchun: 4800,
      oshxona: 320,
      yakuniy_jami: 6000 + 0 - 1200 - 320, // 4480
      izoh: 'Oylik berildi'
    },
    {
      id: 'jun_sal_2',
      fio: 'Temurbek',
      oy: 'Iyun',
      oylik: 3500,
      ulush_foizi: 0.12,
      avans: 700,
      oldingi_qarz: 200,
      shu_oy_uchun: 3000,
      oshxona: 290,
      yakuniy_jami: 3500 + 200 - 700 - 290, // 2710
      izoh: 'Maosh'
    },
    {
      id: 'jun_sal_3',
      fio: 'Ismat',
      oy: 'Iyun',
      oylik: 1836,
      ulush_foizi: 0,
      avans: 200,
      oldingi_qarz: 0,
      shu_oy_uchun: 1636,
      oshxona: 210,
      yakuniy_jami: 1836 + 0 - 200 - 210, // 1426
      izoh: 'Mentor'
    }
  ],
  centerExpenses: [
    {
      id: 'jun_exp_1',
      sana: '2026-06-01',
      kimga: 'arenda',
      izoh: 'Bino ijara haqi',
      summa: 3200,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Iyun'
    },
    {
      id: 'jun_exp_2',
      sana: '2026-06-04',
      kimga: 'targetga',
      izoh: "Facebook va Instagram reklama o'chib qolmasligi uchun",
      summa: 700,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Iyun'
    },
    {
      id: 'jun_exp_3',
      sana: '2026-06-07',
      kimga: 'svetga',
      izoh: "Svet to'lovi",
      summa: 420,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'Iyun'
    },
    {
      id: 'jun_exp_4',
      sana: '2026-06-11',
      kimga: 'internetga',
      izoh: 'Internet provayder',
      summa: 220,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Iyun'
    },
    {
      id: 'jun_exp_5',
      sana: '2026-06-14',
      kimga: 'baxora opaga',
      izoh: 'Oylik tozalash vositalari va xizmat haqi',
      summa: 450,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'Iyun'
    },
    {
      id: 'jun_exp_6',
      sana: '2026-06-18',
      kimga: 'kuller',
      izoh: 'Hujjat yetkazish va suv ballonlar',
      summa: 150,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'Iyun'
    }
  ],
  kitchenMonthly: [
    {
      id: 'jun_kit_1',
      fio: 'Elnur Turdiyev direktor',
      oy: 'Iyun',
      kunlar: { 1: 35, 2: 35, 3: 35, 4: 'X', 5: 35, 6: 35, 7: 35, 8: 35, 9: 35, 10: 40 },
      jami: 320
    },
    {
      id: 'jun_kit_2',
      fio: 'Temurbek',
      oy: 'Iyun',
      kunlar: { 1: 30, 2: 30, 3: 30, 4: 30, 5: 'X', 6: 30, 7: 30, 8: 30, 9: 30, 10: 50 },
      jami: 290
    },
    {
      id: 'jun_kit_3',
      fio: 'Ismat',
      oy: 'Iyun',
      kunlar: { 1: 25, 2: 25, 3: 25, 4: 25, 5: 25, 6: 'X', 7: 25, 8: 30, 9: 30 },
      jami: 210
    }
  ],
  clickLedger: [
    // Clisk to'lovlari (Kirim)
    {
      id: 'jun_clk_1',
      turi: 'kirim',
      sana: '2026-06-05',
      raw_sana: '46175',
      ifo: 'Karimova Dilnoza',
      summa: 450,
      izoh: 'Click orqali tolov qabul qilindi',
      oy: 'Iyun'
    },
    {
      id: 'jun_clk_2',
      turi: 'kirim',
      sana: '2026-06-10',
      raw_sana: '46180',
      ifo: 'Sultonov Bekzod',
      summa: 500,
      izoh: 'Click orqali qisman tolov',
      oy: 'Iyun'
    },
    {
      id: 'jun_clk_3',
      turi: 'kirim',
      sana: '2026-06-12',
      raw_sana: '46182',
      ifo: 'Xoliqova Shahnoza',
      summa: 250,
      izoh: 'Click tushumi',
      oy: 'Iyun'
    },
    // Clisk rasxodlari (Chiqim)
    {
      id: 'jun_clk_4',
      turi: 'chiqim',
      sana: '2026-06-01',
      summa: 1200,
      izoh: 'Arendaga yetmagandi yechib oldi',
      oy: 'Iyun'
    },
    {
      id: 'jun_clk_5',
      turi: 'chiqim',
      sana: '2026-06-25',
      summa: 480,
      izoh: 'Soliq qarzlariga to`landi',
      oy: 'Iyun'
    }
  ]
};

// ----------------------------------------------------------------------------
// 3. IYUL OYI MA'LUMOTLARI
// ----------------------------------------------------------------------------
export const julyData: ParsedMonthData = {
  oy: 'Iyul',
  payments: [
    {
      id: 'jul_pay_1',
      ifo: 'Abdullayev Jasur',
      tel_oila: '+998901234567',
      tel_oziniki: '+998931112233',
      oy: 'Iyul',
      oylik_narx: 750,
      naxt: 750,
      click: 0,
      qoldiq: 0,
      tolov_sanasi_1: '2026-07-04',
      raw_date_1: '04,07,26',
      guruh: 'AI-1',
      izoh: 'Elnurga bergan',
      man_olmaganman: false
    },
    {
      id: 'jul_pay_2',
      ifo: 'Karimova Dilnoza',
      tel_oila: '+998912223344',
      tel_oziniki: '+998993334455',
      oy: 'Iyul',
      oylik_narx: 650,
      naxt: 0,
      click: 650,
      qoldiq: 0,
      tolov_sanasi_1: '2026-07-08',
      raw_date_1: '2026-07-08 00:00:00',
      guruh: 'python-8',
      izoh: 'Jasminaga tashagan',
      man_olmaganman: false
    },
    {
      id: 'jul_pay_3',
      ifo: 'Nazarova Madina',
      tel_oila: '+998909876543',
      tel_oziniki: '+998918765432',
      oy: 'Iyul',
      oylik_narx: 750,
      naxt: 500,
      click: 250,
      qoldiq: 0,
      tolov_sanasi_1: '2026-07-09',
      raw_date_1: '2026-07-09 00:00:00',
      guruh: 'java 10',
      izoh: 'Toliq tolandi',
      man_olmaganman: false
    },
    {
      id: 'jul_pay_4',
      ifo: 'Bozorov Ilhom',
      tel_oila: '+998971114477',
      tel_oziniki: '',
      oy: 'Iyul',
      oylik_narx: 650,
      naxt: 0,
      click: 0,
      qoldiq: 650,
      guruh: 'fullstack-3',
      izoh: 'Man olmaganman',
      man_olmaganman: true
    },
    {
      id: 'jul_pay_5',
      ifo: 'Rustamov Sardor',
      tel_oila: '+998941239876',
      tel_oziniki: '+998939998877',
      oy: 'Iyul',
      oylik_narx: 650,
      naxt: 350,
      click: 0,
      qoldiq: 300,
      tolov_sanasi_1: '2026-07-15',
      raw_date_1: '15,07,26',
      guruh: 'fullstack-3',
      izoh: 'Elnur bilan shunday gaplashishgan ekan',
      man_olmaganman: false
    }
  ],
  salaryTransactions: [
    {
      id: 'jul_sal_1',
      fio: 'Elnur Turdiyev direktor',
      oy: 'Iyul',
      oylik: 6000,
      ulush_foizi: 0.17,
      avans: 1500,
      oldingi_qarz: 0,
      shu_oy_uchun: 4500,
      oshxona: 340,
      yakuniy_jami: 6000 + 0 - 1500 - 340, // 4160
      izoh: 'Direktor oyligi'
    },
    {
      id: 'jul_sal_2',
      fio: 'Temurbek',
      oy: 'Iyul',
      oylik: 3500,
      ulush_foizi: 0.12,
      avans: 600,
      oldingi_qarz: 0,
      shu_oy_uchun: 2900,
      oshxona: 300,
      yakuniy_jami: 3500 + 0 - 600 - 300, // 2600
      izoh: 'Ustoz maoshi'
    },
    {
      id: 'jul_sal_3',
      fio: 'Ismat',
      oy: 'Iyul',
      oylik: 1836,
      ulush_foizi: 0,
      avans: 250,
      oldingi_qarz: 100,
      shu_oy_uchun: 1686,
      oshxona: 220,
      yakuniy_jami: 1836 + 100 - 250 - 220, // 1466
      izoh: 'Mentor'
    }
  ],
  centerExpenses: [
    {
      id: 'jul_exp_1',
      sana: '2026-07-01',
      kimga: 'arenda',
      izoh: 'Oylik bino arendasi',
      summa: 3200,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Iyul'
    },
    {
      id: 'jul_exp_2',
      sana: '2026-07-06',
      kimga: 'targetga',
      izoh: "reklama o'chib qolmasligi uchun",
      summa: 750,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Iyul'
    },
    {
      id: 'jul_exp_3',
      sana: '2026-07-09',
      kimga: 'svetga',
      izoh: 'Konditsionerlar sababli svet harajati oshgan',
      summa: 580,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'Iyul'
    },
    {
      id: 'jul_exp_4',
      sana: '2026-07-12',
      kimga: 'internetga',
      izoh: 'Internet tolovi',
      summa: 220,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Iyul'
    },
    {
      id: 'jul_exp_5',
      sana: '2026-07-15',
      kimga: 'baxora opaga',
      izoh: 'pol yuvishga sredstvalar',
      summa: 420,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'Iyul'
    },
    {
      id: 'jul_exp_6',
      sana: '2026-07-20',
      kimga: 'kuller',
      izoh: 'Muzdek toza suv ballonlar',
      summa: 160,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'Iyul'
    }
  ],
  kitchenMonthly: [
    {
      id: 'jul_kit_1',
      fio: 'Elnur Turdiyev direktor',
      oy: 'Iyul',
      kunlar: { 1: 35, 2: 35, 3: 35, 4: 35, 5: 35, 6: 35, 7: 35, 8: 35, 9: 35, 10: 25 },
      jami: 340
    },
    {
      id: 'jul_kit_2',
      fio: 'Temurbek',
      oy: 'Iyul',
      kunlar: { 1: 30, 2: 30, 3: 30, 4: 30, 5: 30, 6: 30, 7: 30, 8: 30, 9: 30, 10: 30 },
      jami: 300
    },
    {
      id: 'jul_kit_3',
      fio: 'Ismat',
      oy: 'Iyul',
      kunlar: { 1: 25, 2: 25, 3: 25, 4: 25, 5: 25, 6: 25, 7: 25, 8: 20, 9: 25 },
      jami: 220
    }
  ],
  clickLedger: []
};

// ----------------------------------------------------------------------------
// 4. AVGUST OYI MA'LUMOTLARI
// ----------------------------------------------------------------------------
export const augustData: ParsedMonthData = {
  oy: 'Avgust',
  payments: [
    {
      id: 'aug_pay_1',
      ifo: 'Abdullayev Jasur',
      tel_oila: '+998901234567',
      tel_oziniki: '+998931112233',
      oy: 'Avgust',
      oylik_narx: 750,
      naxt: 750,
      click: 0,
      qoldiq: 0,
      tolov_sanasi_1: parseExcelDate('11,08,26') || '2026-08-11', // Promptdagi aynan: "11,08,26"
      raw_date_1: '11,08,26',
      guruh: 'AI-1',
      izoh: 'Elnurga bergan',
      man_olmaganman: false
    },
    {
      id: 'aug_pay_2',
      ifo: 'Karimova Dilnoza',
      tel_oila: '+998912223344',
      tel_oziniki: '+998993334455',
      oy: 'Avgust',
      oylik_narx: 650,
      naxt: 0,
      click: 650,
      qoldiq: 0,
      tolov_sanasi_1: '2026-08-12',
      raw_date_1: '12,08,26',
      guruh: 'python-8',
      izoh: 'Jasminaga tashagan',
      man_olmaganman: false
    },
    {
      id: 'aug_pay_3',
      ifo: 'Sultonov Bekzod',
      tel_oila: '+998905556677',
      tel_oziniki: '+998978889900',
      oy: 'Avgust',
      oylik_narx: 750,
      naxt: 450,
      click: 0,
      qoldiq: 300,
      tolov_sanasi_1: '2026-08-14',
      raw_date_1: '14,08,26',
      guruh: 'AI-1',
      izoh: 'Qisman tolagan',
      man_olmaganman: false
    },
    {
      id: 'aug_pay_4',
      ifo: 'Nazarova Madina',
      tel_oila: '+998909876543',
      tel_oziniki: '+998918765432',
      oy: 'Avgust',
      oylik_narx: 750,
      naxt: 350,
      click: 400,
      qoldiq: 0,
      tolov_sanasi_1: '2026-08-15',
      raw_date_1: '15,08,26',
      guruh: 'java 10',
      izoh: 'Toliq tolandi',
      man_olmaganman: false
    },
    {
      id: 'aug_pay_5',
      ifo: 'Xoliqova Shahnoza',
      tel_oila: '+998935551122',
      tel_oziniki: '+998946663344',
      oy: 'Avgust',
      oylik_narx: 650,
      naxt: 0,
      click: 0,
      qoldiq: 650,
      guruh: 'fullstack-3',
      izoh: 'Man olmaganman',
      man_olmaganman: true
    },
    {
      id: 'aug_pay_6',
      ifo: 'Yoqubov Davron',
      tel_oila: '+998934445566',
      tel_oziniki: '+998907778899',
      oy: 'Avgust',
      oylik_narx: 650,
      naxt: 450,
      click: 0,
      qoldiq: 200,
      tolov_sanasi_1: '2026-08-18',
      raw_date_1: '18,08,26',
      guruh: 'python-8',
      izoh: 'Yarmi qolgan',
      man_olmaganman: false
    }
  ],
  salaryTransactions: [
    {
      id: 'aug_sal_1',
      fio: 'Elnur Turdiyev direktor',
      oy: 'Avgust',
      oylik: 6000,
      ulush_foizi: 0.17,
      avans: 1000,
      oldingi_qarz: 0,
      shu_oy_uchun: 5000,
      oshxona: 350,
      yakuniy_jami: 6000 + 0 - 1000 - 350, // 4650
      izoh: 'Direktor oyligi'
    },
    {
      id: 'aug_sal_2',
      fio: 'Temurbek',
      oy: 'Avgust',
      oylik: 3500,
      ulush_foizi: 0.12,
      avans: 500,
      oldingi_qarz: 0,
      shu_oy_uchun: 3000,
      oshxona: 320,
      yakuniy_jami: 3500 + 0 - 500 - 320, // 2680
      izoh: 'Python ustozi'
    },
    {
      id: 'aug_sal_3',
      fio: 'Ismat',
      oy: 'Avgust',
      oylik: 1836,
      ulush_foizi: 0,
      avans: 300,
      oldingi_qarz: 50,
      shu_oy_uchun: 1586,
      oshxona: 240,
      yakuniy_jami: 1836 + 50 - 300 - 240, // 1346
      izoh: 'Mentor'
    }
  ],
  centerExpenses: [
    {
      id: 'aug_exp_1',
      sana: '2026-08-01',
      kimga: 'arenda',
      izoh: 'Bino oylik ijara haqi',
      summa: 3200,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Avgust'
    },
    {
      id: 'aug_exp_2',
      sana: '2026-08-05',
      kimga: 'targetga',
      izoh: "reklama o'chib qolmasligi uchun",
      summa: 800,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Avgust'
    },
    {
      id: 'aug_exp_3',
      sana: '2026-08-09',
      kimga: 'svetga',
      izoh: "Svet to'lovi",
      summa: 510,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'Avgust'
    },
    {
      id: 'aug_exp_4',
      sana: '2026-08-12',
      kimga: 'internetga',
      izoh: 'Optik internet',
      summa: 220,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Avgust'
    },
    {
      id: 'aug_exp_5',
      sana: '2026-08-15',
      kimga: 'baxora opaga',
      izoh: 'pol yuvishga sredstvalar',
      summa: 450,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'Avgust'
    },
    {
      id: 'aug_exp_6',
      sana: '2026-08-20',
      kimga: 'kuller',
      izoh: 'Kuller xizmati',
      summa: 140,
      turi: 'naqd',
      oy_turi: 'shu',
      oy: 'Avgust'
    },
    {
      id: 'aug_exp_7',
      sana: '2026-08-28',
      kimga: 'soliq qarzlari',
      izoh: 'QQS va daromad soligi tolovi',
      summa: 600,
      turi: 'click',
      oy_turi: 'shu',
      oy: 'Avgust'
    }
  ],
  kitchenMonthly: [
    {
      id: 'aug_kit_1',
      fio: 'Elnur Turdiyev direktor',
      oy: 'Avgust',
      kunlar: { 1: 35, 2: 35, 3: 35, 4: 35, 5: 35, 6: 35, 7: 35, 8: 35, 9: 35, 10: 35 },
      jami: 350
    },
    {
      id: 'aug_kit_2',
      fio: 'Temurbek',
      oy: 'Avgust',
      kunlar: { 1: 30, 2: 30, 3: 30, 4: 30, 5: 30, 6: 30, 7: 30, 8: 30, 9: 50, 10: 30 },
      jami: 320
    },
    {
      id: 'aug_kit_3',
      fio: 'Ismat',
      oy: 'Avgust',
      kunlar: { 1: 25, 2: 25, 3: 25, 4: 25, 5: 25, 6: 25, 7: 25, 8: 30, 9: 30, 10: 25 },
      jami: 240
    }
  ],
  clickLedger: []
};

// Barcha 4 oy to'plami
export const allMonthsData: Record<string, ParsedMonthData> = {
  May: mayData,
  Iyun: juneData,
  Iyul: julyData,
  Avgust: augustData
};
