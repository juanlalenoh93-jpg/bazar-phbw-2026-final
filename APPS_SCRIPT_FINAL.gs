const SHEET_HEADERS = {
  "Bazar": ["ID", "Nama Bazar", "Tanggal"],
  "Pesanan": [
    "ID",
    "Nomor Bazar",
    "Nama Customer",
    "Nama Menu",
    "Qty",
    "Total Harga",
    "Terjual",
    "Dialihkan",
    "Keterangan"
  ],
  "Penjualan": [
    "ID",
    "Nomor Bazar",
    "Nama Customer",
    "Nama Menu",
    "Qty",
    "Total Harga",
    "Jumlah Bayar",
    "Metode Bayar",
    "Status"
  ],
  "Pengeluaran": ["ID", "Bazar ID", "Nama Pengeluaran", "Qty", "Nominal"],
  "Pembayaran Piutang": [
    "ID",
    "Nomor Bazar",
    "Nama Customer",
    "Jumlah Bayar",
    "Metode Bayar",
    "Status",
    "Keterangan",
    "Tanggal Bayar"
  ]
};

const SHEET_FORMATS = {
  "Bazar": {
    text: [1, 2],
    date: [3]
  },
  "Pesanan": {
    text: [1, 2, 3, 4, 8, 9],
    number: [5, 6, 7]
  },
  "Penjualan": {
    text: [1, 2, 3, 4, 8, 9],
    number: [5, 6, 7]
  },
  "Pengeluaran": {
    text: [1, 2, 3],
    number: [4, 5]
  },
  "Pembayaran Piutang": {
    text: [1, 2, 3, 5, 6, 7],
    number: [4],
    datetime: [8]
  }
};

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    if (data.type !== "bulk_export") {
      return output({ ok: false, message: "Tipe data tidak didukung. Gunakan bulk_export." });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = data.sheets || {};
    const counts = {};

    Object.keys(SHEET_HEADERS).forEach(function(sheetName) {
      const headers = SHEET_HEADERS[sheetName];
      const sheet = getOrCreateSheet(ss, sheetName);
      setupHeader(sheet, headers);
      clearSheetData(sheet);
      applyFormats(sheet, sheetName, headers.length);

      const rows = (sheets[sheetName] || []).map(function(row) {
        return normalizeRow(row, headers.length);
      });

      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      }

      counts[sheetName] = rows.length;
    });

    return output({
      ok: true,
      message: "Ekspor berhasil",
      exportedAt: new Date().toISOString(),
      counts: counts
    });
  } catch (err) {
    return output({
      ok: false,
      message: "Gagal ekspor",
      error: err && err.message ? err.message : String(err)
    });
  }
}

function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  return sheet;
}

function setupHeader(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function clearSheetData(sheet) {
  const lastRow = sheet.getLastRow();
  const maxColumns = sheet.getMaxColumns();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, maxColumns).clearContent();
  }
}

function applyFormats(sheet, sheetName, width) {
  const maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  const rule = SHEET_FORMATS[sheetName] || {};
  sheet.getRange(1, 1, sheet.getMaxRows(), width).setNumberFormat("@");

  (rule.number || []).forEach(function(col) {
    sheet.getRange(2, col, maxRows, 1).setNumberFormat("#,##0");
  });

  (rule.date || []).forEach(function(col) {
    sheet.getRange(2, col, maxRows, 1).setNumberFormat("dd/mm/yyyy");
  });

  (rule.datetime || []).forEach(function(col) {
    sheet.getRange(2, col, maxRows, 1).setNumberFormat("dd/mm/yyyy hh:mm");
  });
}

function normalizeRow(row, width) {
  const result = [];
  for (let i = 0; i < width; i++) {
    result.push(row[i] !== undefined && row[i] !== null ? row[i] : "");
  }
  return result;
}

function output(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return output({
    ok: true,
    message: "Apps Script aktif. Gunakan tombol Ekspor Semua Data dari aplikasi."
  });
}
