import axios from "axios";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: "phone required" });

  const clean = phone.replace(/[^0-9+]/g, "");
  const result = { phone: clean, checks: [], intel: null };

  // Cek format & region pakai libphonenumber dari Google
  try {
    const r = await axios.get(`https://phonevalidation.abstractapi.com/v1/?api_key=demo&phone=${clean}`, { timeout: 6000, validateStatus: () => true });
    result.intel = r.data;
  } catch {}

  // Public OSINT lookups
  result.checks = [
    { name: "Truecaller", url: `https://www.truecaller.com/search/id/${clean}`, note: "Nama pemilik" },
    { name: "Google", url: `https://www.google.com/search?q="${clean}"`, note: "Web mention" },
    { name: "Google (with quotes dash)", url: `https://www.google.com/search?q=${clean}`, note: "Web mention" },
    { name: "WhatsApp Check", url: `https://wa.me/${clean.replace("+","")}`, note: "Cek WA aktif" },
    { name: "Telegram", url: `https://t.me/+${clean}`, note: "Cek Telegram" },
    { name: "Facebook Search", url: `https://www.facebook.com/search/top?q=${clean}`, note: "Cari di FB" },
    { name: "Instagram Search", url: `https://www.instagram.com/explore/tags/${clean}/`, note: "IG tag" },
    { name: "Sync.me", url: `https://sync.me/search/?number=${clean}`, note: "Cek caller ID" },
    { name: "NumLookup", url: `https://www.numlookup.com/`, note: "Cek manual" },
    { name: "HLR Lookup", url: `https://www.hlr-lookups.com/en/`, note: "Cek operator" },
  ];

  res.json(result);
}