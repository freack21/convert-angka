const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Fungsi bantu: bersihkan angka dari simbol
function cleanNumber(str) {
  let numStr = str.toString().replace(/[\$,]/g, "").trim();

  // Jika dalam tanda kurung, berarti negatif
  let isNegative = false;
  if (numStr.startsWith("(") && numStr.endsWith(")")) {
    numStr = numStr.replace(/[()]/g, "");
  }

  let num = parseFloat(numStr);
  if (isNaN(num)) return NaN;
  if (isNegative) num *= -1;
  return num;
}

// =====================
// API: Konversi satuan
// =====================
app.post("/convert", (req, res) => {
  const { value, unit } = req.body;

  let num = cleanNumber(value);
  if (isNaN(num)) return res.status(400).json({ error: "Angka tidak valid" });

  const units = {
    ratusan: 1e2,
    jutaan: 1e6,
    miliaran: 1e9,
    triliunan: 1e12,
  };

  const multiplier = units[unit] || 1;
  const result = num * multiplier;

  res.json({ result });
});

// =====================
// API: Hitung ln(x)
// =====================
app.post("/ln", (req, res) => {
  const { value } = req.body;

  let num = cleanNumber(value);
  if (isNaN(num) || num <= 0) {
    return res
      .status(400)
      .json({ error: "Angka harus lebih besar dari 0 untuk menghitung ln." });
  }

  const result = Math.log(num);
  res.json({ result });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
