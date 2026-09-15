// ============================================================================
// O'quv Markazi Moliyaviy Boshqaruv Tizimi - Universal Finance Parser (xlsx)
// ============================================================================
// Ushbu parser May, Iyun, Iyul, Avgust oylik hisobotlaridagi turfa xil va iflos
// tuzilgan Excel jadvallarini avtomatik tozalaydi, normalizatsiya qiladi va
// qat'iy ma'lumotlar bazasi tuzilmasiga o'tkazadi.
// ============================================================================

import * as XLSX from 'xlsx';
import {
  MonthName,
  Payment,
  SalaryTransaction,
  CenterExpense,
  KitchenStaffMonthly,
  ClickLedgerEntry,
  ParsedMonthData,
  PaymentMethod,
  ExpensePeriodType
} from './types';

/**
 * 1. Sana konvertori (Excel serial date -> Real ISO date)
 * Quyidagi barcha formatlarni qabul qiladi:
 * - Excel serial raqami: 46143 yoki "46143"
 * - Vergul bilan ajratilgan: "11,08,26" yoki "11.08.26" yoki "11/08/2026"
 * - Standart vaqt qatori: "2026-07-09 00:00:00" yoki "2026-07-09"
 * - JavaScript Date ob'ekti
 */
export function parseExcelDate(val: any): string | null {
  if (val === null || val === undefined || val === '') return null;

  // Agar allaqachon Date ob'ekti bo'lsa
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val.toISOString().split('T')[0];
  }

  // Agar raqam yoki raqamli qator (Excel serial sana, masalan: 46143) bo'lsa
  if (typeof val === 'number' || (typeof val === 'string' && /^\d{4,6}(\.\d+)?$/.test(val.trim()))) {
    const serial = typeof val === 'number' ? val : parseFloat(val.trim());
    // Excel epoxasi 1899-12-30 (Lotus 1-2-3 kabisa yili hisobga olingan)
    // 25569 kun = 1970-01-01
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400 * 1000;
    const dateObj = new Date(utcValue);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }

  const str = String(val).trim();

  // Format: "11,08,26" yoki "11.08.26" yoki "11/08/26" yoki "11.08.2026" (Kun, Oy, Yil)
  const separatedMatch = str.match(/^(\d{1,2})[,./](\d{1,2})[,./](\d{2,4})/);
  if (separatedMatch) {
    let [_, day, month, year] = separatedMatch;
    if (year.length === 2) {
      year = '20' + year;
    }
    day = day.padStart(2, '0');
    month = month.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Format: "2026-07-09 00:00:00" yoki "2026-07-09" (ISO format)
  const isoMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    const [_, year, month, day] = isoMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Fallback Date.parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return null;
}

/**
 * 2. Raqamlarni tozalash (string yoki raqamdan qat'iy number yasash)
 */
export function parseNumber(val: any, defaultValue = 0): number {
  if (val === null || val === undefined || val === '') return defaultValue;
  if (typeof val === 'number') return isNaN(val) ? defaultValue : val;

  const str = String(val).trim().replace(/\s+/g, '').replace(/,/g, '.');
  const num = parseFloat(str);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 3. Matnni tozalash
 */
export function cleanText(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val).trim().replace(/\s+/g, ' ');
}

/**
 * 4. Telefon raqamini tozalash
 */
export function cleanPhone(val: any): string | undefined {
  if (!val) return undefined;
  const str = String(val).trim();
  if (!str || str === '-' || str.toLowerCase() === 'yoq' || str.toLowerCase() === "yo'q") return undefined;
  return str;
}

/**
 * 5. "Man olmaganman" tekshiruvi
 */
export function isNotReceived(rowText: string): boolean {
  const text = rowText.toLowerCase();
  return text.includes('man olmaganman') ||
         text.includes('men olmaganman') ||
         text.includes('olmaganman') ||
         text.includes('olmadim');
}

export function normalizeName(name: string): string {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .replace(/[`'ʻ’ʼ]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatProperName(name: string): string {
  if (!name) return '';
  return String(name).trim().split(/\s+/).map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

export function cleanGroupName(raw: any): string {
  if (!raw) return 'Asosiy guruh';
  let s = String(raw).trim();
  const m = s.match(/^(ai|python|fullstack|frontend|backend|java|foundation|dasturlash)[\s\-_]*0*(\d+)$/i);
  if (m) {
    const prefix = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
    const num = parseInt(m[2], 10);
    if (prefix.toLowerCase() === 'ai') return 'AI-' + num;
    return prefix + '-' + num;
  }
  if (s.length > 2 && s.length < 25 && !/(xarajat|founder|olinishi|berdim|jami|hisobot|qoldiq|naqd|click|oylik)/i.test(s)) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  return 'Asosiy guruh';
}

/**
 * UUID generatsiyasi uchun yordamchi
 */
function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// ============================================================================
// MODULLAR BO'YICHA PARSERLAR
// ============================================================================

/**
 * A) KIRIM MODULI: To'lovlar ro'yxatini tozalash va o'qish
 * Ustunlar: I.F.O, Telefonlar (oila va o'ziniki), Oylik to'lov, Naxt, Clisk, Qoldiq,
 * Sanalar (1-to'lov, 2-to'lov), Guruh, Izoh.
 * O'ng tomondagi "Jami to'lovlar, Jami Naxt, Jami Clisk, Jami Qoldiq" bloklari qatorlarga aralashtirilmaydi.
 */
export function parsePaymentsData(rows: any[][], oy: MonthName): Payment[] {
  const payments: Payment[] = [];
  if (!rows || rows.length === 0) return payments;

  // Header qatorini aniqlash
  let headerIndex = -1;
  for (let r = 0; r < Math.min(rows.length, 10); r++) {
    const rowStr = rows[r].map(c => cleanText(c).toLowerCase()).join(' ');
    if (rowStr.includes('i.f.o') || rowStr.includes('i.f.sh') || rowStr.includes('f.i.o') || rowStr.includes('o‘quvchi') || rowStr.includes('oquvchi') || rowStr.includes('talaba')) {
      headerIndex = r;
      break;
    }
  }

  // Agar maxsus header topilmasa, dastlabki qator deb olamiz
  const startIndex = headerIndex >= 0 ? headerIndex + 1 : 1;

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    let ifo = cleanText(row[0]);
    if ((/^\d+$/.test(ifo) || !ifo) && row[1]) {
      ifo = cleanText(row[1]);
    }
    // Jami, Hisobot, Total, yoki bo'sh qatorlarni chetlab o'tish
    if (!ifo || ifo.toLowerCase().startsWith('jami') || ifo.toLowerCase().startsWith('total') || ifo.toLowerCase().startsWith('hisobot') || ifo.toLowerCase().startsWith('i.f.o')) {
      continue;
    }

    // Butun qator matnini tahlil qilish ("Man olmaganman" tekshiruvi uchun)
    const rowFullText = row.map(c => cleanText(c)).join(' ');
    
    // Qat'iy to'xtatish: jadval ostidagi 17% bonus jadvalini o'quvchilar ro'yxatiga qo'shmaslik
    if (rowFullText.toLowerCase().includes('olingan to`lov') || rowFullText.toLowerCase().includes("olingan to'lov") || rowFullText.toLowerCase().includes('olishi kerak') || row[2] === 0.17 || row[1] === 0.17) {
      break;
    }

    const manOlmaganman = isNotReceived(rowFullText);

    // Telefonlar (odatda 2- va 3-ustunlar)
    const telOila = cleanPhone(row[1] || row[2]);
    const telOziniki = cleanPhone(row[2] || row[3]);

    // Oylik narx, to'lovlar
    let oylikNarx = parseNumber(row[3] || row[4]);
    if (oylikNarx === 0 && parseNumber(row[4])) {
      oylikNarx = parseNumber(row[4]);
    }

    let naxt = parseNumber(row[4] || row[5]);
    let click = parseNumber(row[5] || row[6]);
    let qoldiq = 0;

    if (manOlmaganman) {
      naxt = 0;
      click = 0;
      qoldiq = oylikNarx;
    } else {
      // LOGIKA: Qoldiq = Oylik to'lov - (Naxt + Clisk)
      qoldiq = Math.max(0, oylikNarx - (naxt + click));
    }

    // To'lov sanalari bloki: 1-to'lov, 2-to'lov
    const rawDate1 = row[7] || row[8];
    const rawDate2 = row[8] || row[9];
    const tolovSanasi1 = parseExcelDate(rawDate1) || undefined;
    const tolovSanasi2 = parseExcelDate(rawDate2) || undefined;

    // Guruh
    let guruh = cleanText(row[9] || row[10] || row[6] || '');
    if (!guruh || guruh === '-' || /^\d+$/.test(guruh)) {
      // Heuristik: agar guruh topilmasa, qatordagi guruh nomlarini qidiramiz
      const groupMatch = rowFullText.match(/(AI-\d+|python-\d+|java\s*\d+|fullstack-\d+|frontend-\d+|backend-\d+|foundation[-\s]*\d+)/i);
      guruh = groupMatch ? groupMatch[0] : 'Asosiy guruh';
    }
    guruh = cleanGroupName(guruh);

    // Izoh
    let izoh = cleanText(row[10] || row[11] || row[12] || '');
    // Agar "Elnurga bergan", "Jasminaga tashagan" kabi matnlar bo'lsa
    const noteMatch = rowFullText.match(/(Elnurga\s*bergan|Jasminaga\s*tashagan|Elnur\s*bilan\s*shunday\s*gaplashishgan\s*ekan|[\w\s'ʻ]+bergan|[\w\s'ʻ]+tashagan)/i);
    if (noteMatch && !izoh) {
      izoh = noteMatch[0];
    }

    payments.push({
      id: generateId('pay'),
      ifo,
      tel_oila: telOila,
      tel_oziniki: telOziniki,
      oy,
      oylik_narx: oylikNarx,
      naxt,
      click,
      qoldiq,
      tolov_sanasi_1: tolovSanasi1,
      tolov_sanasi_2: tolovSanasi2,
      raw_date_1: rawDate1 ? String(rawDate1) : undefined,
      raw_date_2: rawDate2 ? String(rawDate2) : undefined,
      guruh,
      izoh: izoh || (manOlmaganman ? 'Man olmaganman' : undefined),
      man_olmaganman: manOlmaganman
    });
  }

  return payments;
}

/**
 * B) CHIQIM MODULI: Xarajatlar ro'yxatini tozalash va ajratish
 * 2 ta blokdan iborat:
 * A) Xodimlar maoshi bloki: F.I.O, Oyligi, t (ulush), Avans, oldingi qarz, shu oy, Oshxona, Jami
 *    LOGIKA: Jami = Oyligi + oldingi oy qarzi - berilgan Avans - Oshxona
 * B) Markaz xarajatlari bloki: sana, F.I.O (kimga), izox, oldingi/shu/keyingi oy, Naqd, Click
 */
export function parseExpensesData(
  rows: any[][],
  oy: MonthName,
  kitchenTotals: Record<string, number> = {}
): { salaryTransactions: SalaryTransaction[]; centerExpenses: CenterExpense[] } {
  const salaryTransactions: SalaryTransaction[] = [];
  const centerExpenses: CenterExpense[] = [];

  if (!rows || rows.length === 0) {
    return { salaryTransactions, centerExpenses };
  }

  let currentSection: 'STAFF' | 'CENTER' | 'UNKNOWN' = 'UNKNOWN';

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rowText = row.map(c => cleanText(c)).join(' ').toLowerCase();

    // Blok bo'linishlarini aniqlash
    if (rowText.includes('xodim') || rowText.includes('maosh') || rowText.includes('oyligi') || rowText.includes('ulush')) {
      currentSection = 'STAFF';
      continue;
    }
    if (rowText.includes('markaz xarajat') || rowText.includes('rasxod') || rowText.includes('kimga') || rowText.includes('arenda') || rowText.includes('svet')) {
      currentSection = 'CENTER';
      continue;
    }

    const firstCol = cleanText(row[0]);
    if (!firstCol || firstCol.toLowerCase().startsWith('jami') || firstCol.toLowerCase().startsWith('total')) {
      continue;
    }

    // 1. Agar birinchi ustunda sana bo'lsa yoki "svetga", "targetga", "arenda" bo'lsa => Markaz xarajati
    const dateParsed = parseExcelDate(row[0]);
    const isCenterExpenseRow = dateParsed !== null ||
      rowText.includes('target') ||
      rowText.includes('svet') ||
      rowText.includes('internet') ||
      rowText.includes('kuller') ||
      rowText.includes('arenda') ||
      rowText.includes('soliq') ||
      rowText.includes('baxora opa') ||
      currentSection === 'CENTER';

    if (isCenterExpenseRow && (dateParsed !== null || parseNumber(row[3]) > 0 || parseNumber(row[4]) > 0 || parseNumber(row[5]) > 0)) {
      // B) MARKAZ XARAJATI
      const sana = dateParsed || parseExcelDate(row[1]) || new Date().toISOString().split('T')[0];
      const kimga = cleanText(row[1] || row[0] || 'Umumiy xarajat');
      const izox = cleanText(row[2] || '');

      // Davr turi: oldingi oy uchun, shu oy uchun, keyingi oy uchun
      let oyTuri: ExpensePeriodType = 'shu';
      if (rowText.includes('oldingi')) oyTuri = 'oldingi';
      else if (rowText.includes('keyingi')) oyTuri = 'keyingi';

      // Naqd va Click xarajatlari alohida ustunlarda
      const naqdSumma = parseNumber(row[4] || row[3]);
      const clickSumma = parseNumber(row[5] || row[4]);

      if (naqdSumma > 0) {
        centerExpenses.push({
          id: generateId('exp_naqd'),
          sana,
          raw_sana: row[0],
          kimga,
          izoh: izox,
          summa: naqdSumma,
          turi: 'naqd',
          oy_turi: oyTuri,
          oy
        });
      }

      if (clickSumma > 0) {
        centerExpenses.push({
          id: generateId('exp_click'),
          sana,
          raw_sana: row[0],
          kimga,
          izoh: izox,
          summa: clickSumma,
          turi: 'click',
          oy_turi: oyTuri,
          oy
        });
      }
    } else {
      // A) XODIMLAR MAOSHI BLOKI
      const fio = firstCol;
      const oyligi = parseNumber(row[1]);
      let ulushFoizi = 0;

      // t: Ulush foizi (masalan 0.17 yoki "17%")
      if (row[2] !== undefined && row[2] !== null) {
        const rawT = String(row[2]).trim();
        if (rawT.includes('%')) {
          ulushFoizi = parseFloat(rawT.replace('%', '')) / 100;
        } else {
          ulushFoizi = parseNumber(rawT);
        }
      }

      const avans = parseNumber(row[3]);
      const oldingiQarz = parseNumber(row[4]);
      const shuOyUchun = parseNumber(row[5]);

      // Oshxona xarajati: agar jadvalda bo'lsa yoki Oshxona modulidan bog'langan bo'lsa
      let oshxona = parseNumber(row[6]);
      if (oshxona === 0 && kitchenTotals[fio.toLowerCase()]) {
        oshxona = kitchenTotals[fio.toLowerCase()];
      }

      // LOGIKA: Jami = Oyligi + oldingi oy qarzi - berilgan Avans - Oshxona
      const yakuniyJami = Math.max(0, oyligi + oldingiQarz - avans - oshxona);

      salaryTransactions.push({
        id: generateId('sal'),
        fio,
        oy,
        oylik: oyligi,
        ulush_foizi: ulushFoizi,
        avans,
        oldingi_qarz: oldingiQarz,
        shu_oy_uchun: shuOyUchun,
        oshxona,
        yakuniy_jami: yakuniyJami,
        izoh: cleanText(row[7] || row[8] || '')
      });
    }
  }

  return { salaryTransactions, centerExpenses };
}

/**
 * C) OSHXONA MODULI: Ustozlar obedi (1 dan 31 gacha kunlar)
 * Har bir katakda 25, 30, 35 yoki 'X' (dam olish)
 * Jami ovqat xarajati hisoblanadi va Xodimlarning Oshxona ushlanmasiga uzatiladi.
 */
export function parseKitchenData(rows: any[][], oy: MonthName): KitchenStaffMonthly[] {
  const kitchenList: KitchenStaffMonthly[] = [];
  if (!rows || rows.length === 0) return kitchenList;

  // Header qatorini aniqlash (1..31 kun ustunlari)
  let headerIndex = -1;
  for (let r = 0; r < Math.min(rows.length, 6); r++) {
    const row = rows[r];
    if (row && row.some(c => String(c).trim() === '1' || String(c).trim() === '01')) {
      headerIndex = r;
      break;
    }
  }

  const startIndex = headerIndex >= 0 ? headerIndex + 1 : 1;

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const fio = cleanText(row[0]);
    if (!fio || fio.toLowerCase().startsWith('jami') || fio.toLowerCase().startsWith('total')) {
      continue;
    }

    const kunlar: Record<number, number | 'X'> = {};
    let jami = 0;

    // Kunlar 1 dan 31 gacha
    for (let d = 1; d <= 31; d++) {
      const cellVal = row[d];
      if (cellVal === undefined || cellVal === null || cellVal === '') {
        kunlar[d] = 0;
      } else {
        const strVal = String(cellVal).trim().toUpperCase();
        if (strVal === 'X' || strVal === 'Х') {
          kunlar[d] = 'X';
        } else {
          const num = parseNumber(cellVal, 0);
          kunlar[d] = num;
          jami += num;
        }
      }
    }

    // Agar oxirgi ustunda o'zining Jamisi yozilgan bo'lsa va hisoblanganidan katta bo'lsa
    const explicitJami = parseNumber(row[32] || row[row.length - 1]);
    if (explicitJami > 0 && jami === 0) {
      jami = explicitJami;
    }

    kitchenList.push({
      id: generateId('kit'),
      fio,
      oy,
      kunlar,
      jami
    });
  }

  return kitchenList;
}

/**
 * D) CLICK MODULI: Clisk listi (Iyun faylida mavjud bo'lgan alohida ro'yxat)
 * - Clisk to`lovlari: No, I.F.O, sana (serial), summa (kirim)
 * - Clisk rasxodlari: sana, summa, izox (chiqim: Arendaga yetmagandi, Soliq qarzlariga)
 */
export function parseClickLedgerData(rows: any[][], oy: MonthName): ClickLedgerEntry[] {
  const ledger: ClickLedgerEntry[] = [];
  if (!rows || rows.length === 0) return ledger;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rowText = row.map(c => cleanText(c)).join(' ').toLowerCase();
    if (rowText.includes('no') && rowText.includes('summa')) continue;

    // 1. Clisk to'lovlari (Kirim bloki)
    // Odatda: No, I.F.O, sana, summa
    const ifo = cleanText(row[1]);
    const sana = parseExcelDate(row[2]) || new Date().toISOString().split('T')[0];
    const summaKirim = parseNumber(row[3]);

    if (ifo && summaKirim > 0 && !ifo.toLowerCase().startsWith('jami')) {
      ledger.push({
        id: generateId('clk_in'),
        turi: 'kirim',
        sana,
        raw_sana: row[2],
        ifo,
        summa: summaKirim,
        izoh: cleanText(row[4] || `O'quvchi to'lovi: ${ifo}`),
        oy
      });
    }

    // 2. Clisk rasxodlari (Chiqim bloki - masalan o'ngroqdagi ustunlar yoki pastki qism)
    // Masalan row[5]=sana, row[6]=summa, row[7]=izox
    const chiqimSana = parseExcelDate(row[5]);
    const chiqimSumma = parseNumber(row[6]);
    const chiqimIzox = cleanText(row[7] || row[6] || '');

    if (chiqimSumma > 0 || (chiqimIzox && (chiqimIzox.includes('arenda') || chiqimIzox.includes('soliq')))) {
      ledger.push({
        id: generateId('clk_out'),
        turi: 'chiqim',
        sana: chiqimSana || sana,
        raw_sana: row[5],
        summa: chiqimSumma > 0 ? chiqimSumma : parseNumber(row[7]),
        izoh: chiqimIzox || 'Click chiqimi',
        oy
      });
    }
  }

  return ledger;
}

// ============================================================================
// UNIVERSAL EXCEL WORKBOOK PARSER
// ============================================================================

/**
 * Universal oylik Excel faylni o'qish funksiyasi.
 * xlsx kutubxonasi orqali faylni ochadi, barcha listlarni nomiga qarab aniqlaydi:
 * - Kirim / To'lovlar listi
 * - Chiqim / Xarajatlar listi
 * - Oshxona / Obed listi
 * - Clisk / Click listi
 */
/**
 * D) STANDART SHABLON MODULLARI: Alohida varaqlar uchun parserlar
 */
export function parseModularSalaryData(rows: any[][], oy: MonthName, kitchenTotals: Record<string, number> = {}): SalaryTransaction[] {
  const salaryTransactions: SalaryTransaction[] = [];
  if (!rows || rows.length === 0) return salaryTransactions;

  let headerIdx = -1;
  let colStaffName = 1;
  let colRole = 2;
  let colStavka = 3;
  let colFoiz = 4;
  let colAvans = 5;
  let colQarz = 6;
  let colOshxona = 7;
  let colJami = 8;
  let colIzoh = 10;

  for (let r = 0; r < Math.min(rows.length, 6); r++) {
    const row = (rows[r] || []).map(c => cleanText(c).toLowerCase());
    if (row.some(c => c.includes('xodim') || c.includes('f.i.o') || c.includes('ustoz') || c.includes('maosh') || c.includes('stavka'))) {
      headerIdx = r;
      row.forEach((cell, idx) => {
        if (cell.includes('xodim') || cell.includes('f.i.o') || cell.includes('ism') || cell.includes('ustoz')) colStaffName = idx;
        else if (cell.includes('lavozim') || cell.includes("yo'nalish")) colRole = idx;
        else if (cell.includes('stavka') || cell.includes('asosiy') || (cell.includes('oylik') && !cell.includes("qo'lga"))) colStavka = idx;
        else if (cell.includes('ulush') || cell.includes('foiz')) colFoiz = idx;
        else if (cell.includes('avans')) colAvans = idx;
        else if (cell.includes('qarz') || cell.includes('oldingi')) colQarz = idx;
        else if (cell.includes('oshxona') || cell.includes('tushlik')) colOshxona = idx;
        else if (cell.includes("qo'lga") || cell.includes('jami') || cell.includes('olishi') || cell.includes('tegadigan')) colJami = idx;
        else if (cell.includes('izoh') || cell.includes('tafsilot')) colIzoh = idx;
      });
      break;
    }
  }

  const startIdx = headerIdx >= 0 ? headerIdx + 1 : 1;
  for (let i = startIdx; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;

    let fio = cleanText(r[colStaffName]);
    if ((/^\d+$/.test(fio) || !fio) && r[colStaffName + 1]) {
      fio = cleanText(r[colStaffName + 1]);
    }
    if (!fio || fio.toLowerCase().startsWith('jami') || fio.toLowerCase().startsWith('total') || fio.length < 3) continue;

    const oylik = parseNumber(r[colStavka]);
    let ulush = 0;
    const rawFoiz = String(r[colFoiz] || '');
    if (rawFoiz.includes('%')) ulush = parseFloat(rawFoiz.replace('%', '')) / 100;
    else ulush = parseNumber(rawFoiz);

    const avans = parseNumber(r[colAvans]);
    const oldingiQarz = parseNumber(r[colQarz]);
    let oshxona = parseNumber(r[colOshxona]);
    if (oshxona === 0 && kitchenTotals[fio.toLowerCase()]) {
      oshxona = kitchenTotals[fio.toLowerCase()];
    }
    let jami = parseNumber(r[colJami]);
    if (jami === 0 && (oylik > 0 || avans > 0)) {
      jami = Math.max(0, oylik + oldingiQarz - avans - oshxona);
    }

    salaryTransactions.push({
      id: generateId('sal'),
      fio,
      oy,
      oylik,
      ulush_foizi: ulush,
      avans,
      oldingi_qarz: oldingiQarz,
      shu_oy_uchun: 0,
      oshxona,
      yakuniy_jami: jami > 0 ? jami : (avans > 0 ? avans : oylik),
      izoh: cleanText(r[colIzoh] || '')
    });
  }

  return salaryTransactions;
}

export function parseModularCenterData(rows: any[][], oy: MonthName): CenterExpense[] {
  const centerExpenses: CenterExpense[] = [];
  if (!rows || rows.length === 0) return centerExpenses;

  let headerIdx = -1;
  let colSana = 1;
  let colKat = 2;
  let colKimga = 3;
  let colIzoh = 4;
  let colSumma = 5;
  let colTur = 6;

  for (let r = 0; r < Math.min(rows.length, 6); r++) {
    const row = (rows[r] || []).map(c => cleanText(c).toLowerCase());
    if (row.some(c => c.includes('kategoriya') || c.includes('kimga') || c.includes('qayerga') || c.includes('summa'))) {
      headerIdx = r;
      row.forEach((cell, idx) => {
        if (cell.includes('sana')) colSana = idx;
        else if (cell.includes('kategoriya')) colKat = idx;
        else if (cell.includes('kimga') || cell.includes('qayerga')) colKimga = idx;
        else if (cell.includes('izoh') || cell.includes('tavsif') || cell.includes('nima')) colIzoh = idx;
        else if (cell.includes('summa') || cell.includes('narx')) colSumma = idx;
        else if (cell.includes('turi') || cell.includes('tur')) colTur = idx;
      });
      break;
    }
  }

  const startIdx = headerIdx >= 0 ? headerIdx + 1 : 1;
  for (let i = startIdx; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;
    const summa = parseNumber(r[colSumma]);
    if (summa <= 0) continue;

    const kimga = cleanText(r[colKimga] || r[colKat] || 'Markaz xarajati');
    if (kimga.toLowerCase().startsWith('jami') || kimga.toLowerCase().startsWith('total')) continue;
    const izoh = cleanText(r[colIzoh] || '');
    const sana = parseExcelDate(r[colSana]) || new Date().toISOString().split('T')[0];
    const turStr = cleanText(r[colTur] || 'naqd').toLowerCase();
    const isClick = turStr.includes('click') || turStr.includes('karta');

    centerExpenses.push({
      id: generateId('exp_center'),
      sana,
      raw_sana: r[colSana],
      kimga,
      izoh,
      summa,
      turi: isClick ? 'click' : 'naqd',
      oy_turi: 'shu',
      oy
    });
  }

  return centerExpenses;
}

export function parseModularFounderData(rows: any[][], oy: MonthName): FounderExpense[] {
  const founderExpenses: FounderExpense[] = [];
  if (!rows || rows.length === 0) return founderExpenses;

  let headerIdx = -1;
  let colSana = 1;
  let colIsm = 2;
  let colMaqsad = 3;
  let colIzoh = 4;
  let colSumma = 5;
  let colTur = 6;

  for (let r = 0; r < Math.min(rows.length, 6); r++) {
    const row = (rows[r] || []).map(c => cleanText(c).toLowerCase());
    if (row.some(c => c.includes("ta'sischi") || c.includes('tasischi') || c.includes('founder') || c.includes('maqsad') || c.includes('summa'))) {
      headerIdx = r;
      row.forEach((cell, idx) => {
        if (cell.includes('sana')) colSana = idx;
        else if (cell.includes("ta'sischi") || cell.includes('tasischi') || cell.includes('founder') || cell.includes('ism')) colIsm = idx;
        else if (cell.includes('maqsad') || cell.includes('kategoriya')) colMaqsad = idx;
        else if (cell.includes('izoh') || cell.includes('tafsilot')) colIzoh = idx;
        else if (cell.includes('summa') || cell.includes('miqdor')) colSumma = idx;
        else if (cell.includes('tur')) colTur = idx;
      });
      break;
    }
  }

  const startIdx = headerIdx >= 0 ? headerIdx + 1 : 1;
  for (let i = startIdx; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;
    const summa = parseNumber(r[colSumma]);
    if (summa <= 0) continue;

    const founder_name = cleanText(r[colIsm] || 'Founder');
    if (founder_name.toLowerCase().startsWith('jami') || founder_name.toLowerCase().startsWith('total')) continue;
    const maqsad = cleanText(r[colMaqsad] || 'Founder xarajati');
    const izoh = cleanText(r[colIzoh] || '');
    const sana = parseExcelDate(r[colSana]) || new Date().toISOString().split('T')[0];
    const turStr = cleanText(r[colTur] || 'naqd').toLowerCase();
    const isClick = turStr.includes('click') || turStr.includes('karta');

    founderExpenses.push({
      id: generateId('exp_founder'),
      sana,
      founder_name,
      maqsad,
      izoh,
      summa,
      turi: isClick ? 'click' : 'naqd',
      oy
    });
  }

  return founderExpenses;
}

export function parseMonthWorkbook(workbook: XLSX.WorkBook, defaultOy: MonthName): ParsedMonthData {
  const sheetNames = workbook.SheetNames;

  let paymentsSheet: XLSX.WorkSheet | null = null;
  let salarySheet: XLSX.WorkSheet | null = null;
  let centerExpSheet: XLSX.WorkSheet | null = null;
  let founderExpSheet: XLSX.WorkSheet | null = null;
  let legacyExpSheet: XLSX.WorkSheet | null = null;
  let kitchenSheet: XLSX.WorkSheet | null = null;
  let clickSheet: XLSX.WorkSheet | null = null;

  // Listlarni avtomatik aniqlash (Heuristic matching)
  for (const name of sheetNames) {
    const lower = name.toLowerCase().replace(/[`'ʻ’ʼ]/g, "'");
    if (lower.includes('oshxona') || lower.includes('obed') || lower.includes('ovqat')) {
      kitchenSheet = workbook.Sheets[name];
    } else if (lower.includes('clisk') || lower.includes('click')) {
      clickSheet = workbook.Sheets[name];
    } else if (lower.includes("o'qituvchi") || lower.includes('oqituvchi') || lower.includes('ustoz') || ((lower.includes('oylig') || lower.includes('maosh')) && !lower.includes("to'lov"))) {
      salarySheet = workbook.Sheets[name];
    } else if (lower.includes('founder') || lower.includes("ta'sischi") || lower.includes('tasischi')) {
      founderExpSheet = workbook.Sheets[name];
    } else if (lower.includes('markaz') || (lower.includes('operatsion') && lower.includes('xarajat'))) {
      centerExpSheet = workbook.Sheets[name];
    } else if (lower.includes('xarajat') || lower.includes('chiqim') || lower.includes('rasxod')) {
      legacyExpSheet = workbook.Sheets[name];
    } else if (lower.includes("to'lov") || lower.includes('tolov') || lower.includes('kirim') || lower.includes('talaba')) {
      paymentsSheet = workbook.Sheets[name];
    }
  }

  // Agar list nomi bo'yicha aniqlanmasa, tartib bo'yicha oladi
  if (!paymentsSheet && sheetNames.length > 0) {
    paymentsSheet = workbook.Sheets[sheetNames[0]];
  }

  // 1. Oshxona modulini o'qish
  let kitchenMonthly: KitchenStaffMonthly[] = [];
  const kitchenTotals: Record<string, number> = {};
  if (kitchenSheet) {
    const kitchenRows = XLSX.utils.sheet_to_json<any[]>(kitchenSheet, { header: 1, raw: false });
    kitchenMonthly = parseKitchenData(kitchenRows, defaultOy);
    kitchenMonthly.forEach(k => {
      kitchenTotals[k.fio.toLowerCase()] = k.jami;
    });
  }

  // 2. Kirim modulini o'qish
  let payments: Payment[] = [];
  if (paymentsSheet) {
    const payRows = XLSX.utils.sheet_to_json<any[]>(paymentsSheet, { header: 1, raw: false });
    payments = parsePaymentsData(payRows, defaultOy);
  }

  // 3. Chiqim modullarini o'qish
  let salaryTransactions: SalaryTransaction[] = [];
  let centerExpenses: CenterExpense[] = [];
  let founderExpenses: FounderExpense[] = [];

  const isModular = Boolean(salarySheet || centerExpSheet || founderExpSheet);

  if (salarySheet) {
    const sRows = XLSX.utils.sheet_to_json<any[]>(salarySheet, { header: 1, raw: false });
    salaryTransactions = parseModularSalaryData(sRows, defaultOy, kitchenTotals);
  }

  const targetCenter = centerExpSheet || (isModular ? legacyExpSheet : null);
  if (targetCenter) {
    const cRows = XLSX.utils.sheet_to_json<any[]>(targetCenter, { header: 1, raw: false });
    centerExpenses = parseModularCenterData(cRows, defaultOy);
  }

  if (founderExpSheet) {
    const fRows = XLSX.utils.sheet_to_json<any[]>(founderExpSheet, { header: 1, raw: false });
    founderExpenses = parseModularFounderData(fRows, defaultOy);
  }

  // Legacy fallback (birgalikdagi xarajatlar ro'yxati)
  if (!isModular && legacyExpSheet) {
    const expRows = XLSX.utils.sheet_to_json<any[]>(legacyExpSheet, { header: 1, raw: false });
    const parsedExp = parseExpensesData(expRows, defaultOy, kitchenTotals);
    salaryTransactions = parsedExp.salaryTransactions;
    centerExpenses = parsedExp.centerExpenses;
  }

  // 4. Click modulini o'qish (faqat Iyun yoki tegishli list bo'lsa)
  let clickLedger: ClickLedgerEntry[] = [];
  if (clickSheet) {
    const clickRows = XLSX.utils.sheet_to_json<any[]>(clickSheet, { header: 1, raw: false });
    clickLedger = parseClickLedgerData(clickRows, defaultOy);
  }

  return {
    oy: defaultOy,
    payments,
    salaryTransactions,
    centerExpenses,
    founderExpenses,
    kitchenMonthly,
    clickLedger
  };
}

/**
 * Fayl Buffer / ArrayBuffer dan o'qish yordamchisi
 */
export function parseExcelFileBuffer(data: ArrayBuffer | Uint8Array, oy: MonthName): ParsedMonthData {
  const workbook = XLSX.read(data, { type: 'array', cellDates: true });
  return parseMonthWorkbook(workbook, oy);
}
