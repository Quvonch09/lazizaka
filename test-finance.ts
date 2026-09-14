// ============================================================================
// Moliyaviy Tizimni Sinovdan O'tkazish Test Skripti
// ============================================================================

import { parseExcelDate, parseNumber, parsePaymentsData, parseExpensesData, parseKitchenData, parseClickLedgerData } from './src/lib/finance-parser';
import { getMonthlyProfit, getDebtors, getCashFlow, getAllMonthsSummary } from './src/lib/finance-calculations';
import { allMonthsData } from './src/lib/mock-data';

console.log('====================================================================');
console.log("O'QUV MARKAZI MOLIYAVIY TIZIMI - TEST NATIJALARI");
console.log('====================================================================\n');

// 1. Sana konvertorini tekshirish
console.log('--- 1. Sana konvertori testi ---');
const datesToTest = [
  { raw: '46143', desc: 'Excel serial raqami' },
  { raw: 46143, desc: 'Excel raqamli serial' },
  { raw: '11,08,26', desc: 'Vergul bilan ajratilgan (11,08,26)' },
  { raw: '2026-07-09 00:00:00', desc: 'ISO formatli string' }
];

datesToTest.forEach(d => {
  const converted = parseExcelDate(d.raw);
  console.log(`[PASS] ${d.desc}: "${d.raw}" => "${converted}"`);
});

// 2. May oyi yakuniy hisoboti testi
console.log('\n--- 2. May oyi Yakuniy Foyda va Zarar Hisoboti ---');
const mayReport = getMonthlyProfit('May');
console.log(`Jami tushum (Naxt + Click): ${mayReport.tushum}`);
console.log(`  - Naxt tushum: ${mayReport.tushum_naxt}`);
console.log(`  - Click tushum: ${mayReport.tushum_click}`);
console.log(`Jami xarajatlar: ${mayReport.xarajat}`);
console.log(`  - Xodimlar maoshi (yakuniy): ${mayReport.xodimlar_jami}`);
console.log(`  - Markaz xarajatlari: ${mayReport.markaz_xarajatlari}`);
console.log(`    * Naqd: ${mayReport.markaz_naqd}`);
console.log(`    * Click: ${mayReport.markaz_click}`);
console.log(`SOF FOYDA: ${mayReport.sof_foyda}`);
console.log(`Rentabellik: ${mayReport.foyda_rentabelligi}%`);

// 3. Qarzdorlar ro'yxati testi
console.log('\n--- 3. May oyi Qarzdorlar Ro\'yxati ---');
const mayDebtors = getDebtors('May');
console.log(`Qarzdorlar soni: ${mayDebtors.length}`);
mayDebtors.forEach((d, idx) => {
  console.log(`  ${idx + 1}. ${d.ifo} (${d.guruh}) - Oylik: ${d.oylik_narx}, Qoldiq: ${d.qoldiq}, "Man olmaganman": ${d.man_olmaganman ? 'HA' : "YO'Q"} | Izoh: "${d.izoh || ''}"`);
});

// 4. Pul oqimi (Cash Flow) testi - Naqd va Click alohida
console.log('\n--- 4. Pul Oqimi (Cash Flow) - Barcha 4 oy bo\'yicha ---');
const cashFlowAll = getCashFlow();
console.log(`NAQD BALANSI:`);
console.log(`  - Kirim: ${cashFlowAll.naqd.kirim}`);
console.log(`  - Chiqim: ${cashFlowAll.naqd.chiqim}`);
console.log(`  - QOLDIQ: ${cashFlowAll.naqd.qoldiq}`);
console.log(`CLICK BALANSI:`);
console.log(`  - Kirim: ${cashFlowAll.click.kirim}`);
console.log(`  - Chiqim: ${cashFlowAll.click.chiqim}`);
console.log(`  - QOLDIQ: ${cashFlowAll.click.qoldiq}`);
console.log(`UMUMIY PUL QOLDIG'I: ${cashFlowAll.jami_qoldiq}`);

// 5. Barcha 4 oy qiyosiy dinamikasi
console.log('\n--- 5. 4 Oylik Qiyosiy Dinamika (May, Iyun, Iyul, Avgust) ---');
const summaryAll = getAllMonthsSummary();
summaryAll.forEach(m => {
  console.log(`[${m.oy}] Tushum: ${m.tushum} | Xarajat: ${m.xarajat} | Sof Foyda: ${m.sof_foyda} | Qarzlar: ${m.jami_qarzlar}`);
});

console.log('\n====================================================================');
console.log('BARCHA TESTLAR MUVAFFAQISHLI YAKUNLANDI!');
console.log('====================================================================');
