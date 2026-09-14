// ============================================================================
// O'quv Markazi Moliyaviy Boshqaruv Tizimi - Hisob-Kitob Funksiyalari
// ============================================================================
// Ushbu modulda markazning barcha moliyaviy hisobotlari, sof foyda,
// qarzdorlar ro'yxati va Naqd/Click pul oqimi (Cash Flow) hisoblanadi.
// ============================================================================

import {
  MonthName,
  MonthlyProfitReport,
  StudentDebtor,
  CashFlowReport,
  ParsedMonthData
} from './types';
import { allMonthsData } from './mock-data';

/**
 * 1. Oylik Foyda va Zarar Hisoboti (Profit & Loss)
 * LOGIKA:
 * - Jami tushum = Barcha o'quvchilar Naxt + Clisk (+ Click daftari tushumlari)
 * - Jami xarajatlar = Xodimlar Jami + Markaz xarajatlari
 * - Sof Foyda = Jami tushum - Jami xarajatlar
 */
export function getMonthlyProfit(
  oy: MonthName,
  dataset?: ParsedMonthData
): MonthlyProfitReport {
  const data = dataset || allMonthsData[oy];
  if (!data) {
    return {
      oy,
      tushum: 0,
      tushum_naxt: 0,
      tushum_click: 0,
      xarajat: 0,
      xodimlar_jami: 0,
      markaz_xarajatlari: 0,
      markaz_naqd: 0,
      markaz_click: 0,
      sof_foyda: 0,
      foyda_rentabelligi: 0,
      jami_qarzlar: 0,
      qarzdorlar_soni: 0,
      jami_oquvchilar: 0
    };
  }

  // A) O'quvchilar to'lovlari (Kirim)
  let tushumNaxt = 0;
  let tushumClick = 0;
  let jamiQarzlar = 0;
  let qarzdorlarSoni = 0;

  for (const p of data.payments) {
    tushumNaxt += p.naxt || 0;
    tushumClick += p.click || 0;
    if (p.qoldiq > 0) {
      jamiQarzlar += p.qoldiq;
      qarzdorlarSoni++;
    }
  }

  // Click daftaridagi qo'shimcha kirimlar (agar bo'lsa)
  if (data.clickLedger && data.clickLedger.length > 0) {
    for (const clk of data.clickLedger) {
      if (clk.turi === 'kirim') {
        // Agar o'quvchilar to'lovida hisoblanmagan bo'lsa
        const alreadyInPayments = data.payments.some(p => p.ifo.toLowerCase() === (clk.ifo || '').toLowerCase());
        if (!alreadyInPayments) {
          tushumClick += clk.summa;
        }
      }
    }
  }

  const jamiTushum = tushumNaxt + tushumClick;

  // B) Xodimlar maoshi (Chiqim A)
  // LOGIKA: Xodim yakuniy_jami = Oyligi + oldingi oy qarzi - berilgan Avans - Oshxona
  let xodimlarJami = 0;
  for (const st of data.salaryTransactions) {
    xodimlarJami += st.yakuniy_jami || 0;
  }

  // C) Markaz xarajatlari (Chiqim B)
  let markazNaqd = 0;
  let markazClick = 0;
  for (const ce of data.centerExpenses) {
    if (ce.turi === 'naqd') {
      markazNaqd += ce.summa;
    } else {
      markazClick += ce.summa;
    }
  }

  // Click daftaridagi qo'shimcha chiqimlar (Arenda, Soliq va h.k.)
  if (data.clickLedger && data.clickLedger.length > 0) {
    for (const clk of data.clickLedger) {
      if (clk.turi === 'chiqim') {
        markazClick += clk.summa;
      }
    }
  }

  const markazXarajatlari = markazNaqd + markazClick;
  const jamiXarajatlar = xodimlarJami + markazXarajatlari;
  const sofFoyda = jamiTushum - jamiXarajatlar;
  const rentabellik = jamiTushum > 0 ? (sofFoyda / jamiTushum) * 100 : 0;

  return {
    oy,
    tushum: jamiTushum,
    tushum_naxt: tushumNaxt,
    tushum_click: tushumClick,
    xarajat: jamiXarajatlar,
    xodimlar_jami: xodimlarJami,
    markaz_xarajatlari: markazXarajatlari,
    markaz_naqd: markazNaqd,
    markaz_click: markazClick,
    sof_foyda: sofFoyda,
    foyda_rentabelligi: Math.round(rentabellik * 10) / 10,
    jami_qarzlar: jamiQarzlar,
    qarzdorlar_soni: qarzdorlarSoni,
    jami_oquvchilar: data.payments.length
  };
}

/**
 * 2. Qarzdorlar Ro'yxati (Debtors list)
 * Qoidalar:
 * - Faqat qoldiq > 0 bo'lgan o'quvchilar
 * - "Man olmaganman" deb belgilanganlar alohida ko'rsatiladi
 * - Qarz summasi bo'yicha kamayish tartibida saralanadi
 */
export function getDebtors(
  oy: MonthName,
  dataset?: ParsedMonthData
): StudentDebtor[] {
  const data = dataset || allMonthsData[oy];
  if (!data || !data.payments) return [];

  return data.payments
    .filter(p => p.qoldiq > 0)
    .map(p => ({
      ifo: p.ifo,
      guruh: p.guruh,
      tel_oila: p.tel_oila,
      tel_oziniki: p.tel_oziniki,
      oylik_narx: p.oylik_narx,
      tolangan_naxt: p.naxt,
      tolangan_click: p.click,
      qoldiq: p.qoldiq,
      izoh: p.izoh,
      man_olmaganman: p.man_olmaganman
    }))
    .sort((a, b) => b.qoldiq - a.qoldiq);
}

/**
 * 3. Pul Oqimi (Cash Flow) Hisoboti
 * Talab: "Bu yerda Naqd va Click ni alohida balansda yuritish shart!"
 * - Naxt qancha kirdi, qancha chiqdi, qancha qoldi
 * - Click da qancha kirdi, qancha chiqdi, qancha qoldi
 */
export function getCashFlow(
  oy?: MonthName,
  dataset?: ParsedMonthData | ParsedMonthData[]
): CashFlowReport {
  let monthsToProcess: ParsedMonthData[] = [];

  if (dataset) {
    monthsToProcess = Array.isArray(dataset) ? dataset : [dataset];
  } else if (oy && allMonthsData[oy]) {
    monthsToProcess = [allMonthsData[oy]];
  } else {
    monthsToProcess = Object.values(allMonthsData);
  }

  let naqdKirim = 0;
  let naqdChiqim = 0;
  let clickKirim = 0;
  let clickChiqim = 0;

  for (const month of monthsToProcess) {
    // 1. O'quvchilar to'lovlari (Kirim)
    for (const p of month.payments) {
      naqdKirim += p.naxt || 0;
      clickKirim += p.click || 0;
    }

    // 2. Markaz xarajatlari (Chiqim)
    for (const exp of month.centerExpenses) {
      if (exp.turi === 'naqd') {
        naqdChiqim += exp.summa || 0;
      } else if (exp.turi === 'click') {
        clickChiqim += exp.summa || 0;
      }
    }

    // 3. Click daftari (Kirim va Chiqim)
    if (month.clickLedger) {
      for (const clk of month.clickLedger) {
        if (clk.turi === 'kirim') {
          // Takrorlanmaslik tekshiruvi
          const exists = month.payments.some(p => p.ifo.toLowerCase() === (clk.ifo || '').toLowerCase());
          if (!exists) {
            clickKirim += clk.summa;
          }
        } else if (clk.turi === 'chiqim') {
          clickChiqim += clk.summa;
        }
      }
    }
  }

  const naqdQoldiq = naqdKirim - naqdChiqim;
  const clickQoldiq = clickKirim - clickChiqim;
  const jamiQoldiq = naqdQoldiq + clickQoldiq;

  return {
    oy: oy || (monthsToProcess.length === 1 ? monthsToProcess[0].oy : 'Barcha davr'),
    naqd: {
      kirim: naqdKirim,
      chiqim: naqdChiqim,
      qoldiq: naqdQoldiq
    },
    click: {
      kirim: clickKirim,
      chiqim: clickChiqim,
      qoldiq: clickQoldiq
    },
    jami_qoldiq: jamiQoldiq
  };
}

/**
 * 4. Barcha 4 oyning qiyosiy dinamika hisoboti (May, Iyun, Iyul, Avgust)
 */
export function getAllMonthsSummary(): MonthlyProfitReport[] {
  const months: MonthName[] = ['May', 'Iyun', 'Iyul', 'Avgust'];
  return months.map(m => getMonthlyProfit(m));
}
