import axios from "axios";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email required" });

  const result = { email, checks: {}, breaches: [], gravatar: null, mx: null };

  // Gravatar
  try {
    const crypto = await import("crypto");
    const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
    const g = await axios.get(`https://www.gravatar.com/${hash}.json`, { timeout: 8000, validateStatus: () => true });
    if (g.status === 200 && g.data?.entry) {
      result.gravatar = {
        hash,
        profile: g.data.entry[0].profileUrl,
        name: g.data.entry[0].displayName,
        photo: `https://www.gravatar.com/avatar/${hash}?s=400`
      };
    } else {
      result.gravatar = { hash, exists: false };
    }
  } catch {}

  // MX record via Google DNS API
  try {
    const domain = email.split("@")[1];
    const mx = await axios.get(`https://dns.google/resolve?name=${domain}&type=MX`, { timeout: 8000 });
    result.mx = mx.data.Answer?.map(a => a.data) || [];
  } catch {}

  // Hunter.io-style email format check (public patterns)
  const domain = email.split("@")[1];
  result.patterns = [
    `${domain}`,
    `https://${domain}`,
    `https://haveibeenpwned.com/account/${email}`,
    `https://www.google.com/search?q="${email}"`,
    `https://www.google.com/search?q="${email}" site:linkedin.com`,
    `https://www.google.com/search?q="${email}" site:github.com`,
    `https://www.google.com/search?q="${email}" site:facebook.com`,
    `https://www.google.com/search?q="${email}" filetype:pdf`,
    `https://www.google.com/search?q="${email}" filetype:xlsx`,
  ];

  // Public breach sources (safe mirrors)
  const breachSources = [
    { name: "HaveIBeenPwned", url: `https://haveibeenpwned.com/account/${email}`, note: "Cek manual" },
    { name: "DeHashed", url: `https://dehashed.com/search?query=${email}`, note: "Cek manual" },
    { name: "LeakCheck", url: `https://leakcheck.io/`, note: "Cek manual" },
    { name: "Intelligence X", url: `https://intelx.io/?s=${email}`, note: "Cek manual" },
    { name: "BreachDirectory", url: `https://breachdirectory.org/`, note: "Cek manual" },
    { name: "Snusbase", url: `https://snusbase.com/`, note: "Cek manual" },
    { name: "Leak-Lookup", url: `https://leak-lookup.com/`, note: "Cek manual" },
  ];
  result.breachSources = breachSources;

  res.json(result);
}