// ============================================================================
// Real Excel (.xlsx) Faylini Yaratish va Uni Parser Orqali O'qish Testi
// ============================================================================

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { parseMonthWorkbook } from './src/lib/finance-parser';
import { getMonthlyProfit, getDebtors, getCashFlow } from './src/lib/finance-calculations';

console.log('--- Real .xlsx Workbook Parser Testi Boshlanmoqda ---');

// 1. Yangi Excel Workbook yaratamiz
const wb = XLSX.utils.book_new();

// A) To'lovlar listi (Kirim moduli)
const paymentsData = [
  // Header
  ["I.F.O", "Oila telefoni", "O'zining telefoni", "Oylik to'lov", "Naxt", "Clisk", "Qoldiq", "1 to'lov", "2 to'lov", "Guruxlar", "Izohlar"],
  // Qator 1: Serial sana bilan
  ["Abdullayev Jasur", "+998901234567", "+998931112233", 750, 500, 250, 0, 46143, "2026-05-18 00:00:00", "AI-1", "Elnurga bergan"],
  // Qator 2: Vergulli sana bilan
  ["Karimova Dilnoza", "+998912223344", "+998993334455", 650, 0, 650, 0, "11,08,26", "", "python-8", "Jasminaga tashagan"],
  // Qator 3: "Man olmaganman" deb yozilgan
  ["Rustamov Sardor", "+998941239876", "", 650, "Man olmaganman", 0, 650, "", "", "fullstack-3", "Man olmaganman"],
  // Qator 4: Qarz qolgan
  ["Sultonov Bekzod", "+998905556677", "+998978889900", 750, 350, 0, 400, "10,05,26", "", "java 10", "Elnur bilan shunday gaplashishgan ekan"]
];
const wsPayments = XLSX.utils.aoa_to_sheet(paymentsData);
XLSX.utils.book_append_sheet(wb, wsPayments, "To'lovlar");

// B) Oshxona listi (Obed moduli: 1-31 kunlar)
const kitchenData = [
  ["Familiya Ismi", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jami"],
  ["Elnur Turdiyev direktor", 35, 35, "X", 35, 35, 35, 35, 35, 35, "X", 280],
  ["Temurbek", 30, 30, 30, 30, 30, "X", 30, 30, 30, 30, 300],
  ["Ismat", 25, 25, 25, "X", 25, 25, 25, 25, 15, "X", 190]
];
const wsKitchen = XLSX.utils.aoa_to_sheet(kitchenData);
XLSX.utils.book_append_sheet(wb, wsKitchen, "Oshxona");

// C) Xarajatlar listi (Chiqim moduli: Xodimlar maoshi va Markaz xarajatlari)
const expensesData = [
  // Xodimlar maoshi bloki
  ["F.I.O", "Oyligi", "t", "berilgan Avans", "oldingi oy qarzi", "shu oy uchun", "Oshxona xarajatlari", "Jami", "Izoh"],
  ["Elnur Turdiyev direktor", 6000, "0.17", 1000, 500, 5500, 280, 5220, "Direktor"],
  ["Temurbek", 3500, "0.12", 500, 0, 3000, 300, 2700, "Mentor"],
  ["Ismat", 1836, 0, 300, 150, 1686, 190, 1496, "Yordamchi"],
  ["", "", "", "", "", "", "", "", ""],
  // Markaz xarajatlari bloki
  ["sana", "F.I.O", "izox", "oldingi oy uchun", "Naqd", "Click"],
  ["2026-05-02", "arenda", "Bino oylik arendasi", "", 0, 3000],
  ["2026-05-05", "targetga", "reklama o'chib qolmasligi uchun", "", 0, 650],
  ["2026-05-08", "svetga", "Elektr toki", "", 380, 0],
  ["2026-05-12", "internetga", "Optik internet", "", 0, 220],
  ["2026-05-15", "baxora opaga", "pol yuvishga sredstvalar", "", 400, 0]
];
const wsExpenses = XLSX.utils.aoa_to_sheet(expensesData);
XLSX.utils.book_append_sheet(wb, wsExpenses, "Xarajatlar");

// D) Clisk listi (Click moduli: Kirim va Chiqim)
const clickData = [
  ["No", "I.F.O", "sana", "summa", "izoh", "chiqim_sana", "chiqim_summa", "chiqim_izox"],
  [1, "Karimova Dilnoza", "46175", 650, "Click tushumi", "46170", 1200, "Arendaga yetmagandi yechib oldi"],
  [2, "Abdullayev Jasur", "46180", 250, "Click tolov", "46185", 480, "Soliq qarzlariga to`landi"]
];
const wsClick = XLSX.utils.aoa_to_sheet(clickData);
XLSX.utils.book_append_sheet(wb, wsClick, "Clisk");

// 2. Faylga yozish va o'qish
const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
const parsedResult = parseMonthWorkbook(wb, 'May');

console.log(`[PASS] Workbookdan o'qilgan to'lovlar soni: ${parsedResult.payments.length}`);
console.log(`[PASS] Xodimlar maosh tranzaksiyalari soni: ${parsedResult.salaryTransactions.length}`);
console.log(`[PASS] Markaz xarajatlari soni: ${parsedResult.centerExpenses.length}`);
console.log(`[PASS] Oshxona yozuvlari soni: ${parsedResult.kitchenMonthly.length}`);
console.log(`[PASS] Click yozuvlari soni: ${parsedResult.clickLedger.length}`);

// Hisob-kitob funksiyalarini ushbu parslangan ma'lumotlar bilan tekshirish
const profit = getMonthlyProfit('May', parsedResult);
const debtors = getDebtors('May', parsedResult);
const cashFlow = getCashFlow('May', parsedResult);

console.log(`[PASS] Parslangan fayl bo'yicha tushum: ${profit.tushum}, xarajat: ${profit.xarajat}, sof foyda: ${profit.sof_foyda}`);
console.log(`[PASS] Parslangan fayldagi qarzdorlar: ${debtors.map(d => `${d.ifo} (qoldiq: ${d.qoldiq}, "Man olmaganman": ${d.man_olmaganman})`).join(', ')}`);
console.log(`[PASS] Parslangan Naqd qoldiq: ${cashFlow.naqd.qoldiq}, Click qoldiq: ${cashFlow.click.qoldiq}`);
console.log('--- Real .xlsx Workbook Parser Testi A\'LO DARAJADA O\'TDI! ---');
