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
  sheet.setFrozenRows(1);
}

function clearSheetData(sheet) {
  const lastRow = sheet.getLastRow();
  const maxColumns = sheet.getMaxColumns();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, maxColumns).clearContent();
  }
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
