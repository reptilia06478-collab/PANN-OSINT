import axios from "axios";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email required" });

  const result = { email, breachSources: [], searchLinks: [] };

  // Sumber-sumber publik untuk cek breach
  result.breachSources = [
    { name: "Have I Been Pwned", url: `https://haveibeenpwned.com/account/${email}`, description: "Kumpulan breach terbesar" },
    { name: "DeHashed", url: `https://dehashed.com/search?query=${email}`, description: "Search breach database" },
    { name: "LeakCheck.io", url: `https://leakcheck.io/`, description: "Cek 7B+ leak" },
    { name: "Intelligence X", url: `https://intelx.io/?s=${email}`, description: "Deep + dark web" },
    { name: "BreachDirectory", url: `https://breachdirectory.org/`, description: "Public breach dataset" },
    { name: "Snusbase", url: `https://snusbase.com/`, description: "Breach search engine" },
    { name: "Leak-Lookup", url: `https://leak-lookup.com/`, description: "Multi-database" },
    { name: "WeLeakInfo (mirror)", url: `https://weleakinfo.io/`, description: "Cek manual" },
    { name: "HIBP Pwned Passwords", url: `https://api.pwnedpasswords.com/`, description: "Cek hash password" },
    { name: "CyberNews Leak Checker", url: `https://cybernews.com/personal-data-leak-check/`, description: "Free check" },
    { name: "Firefox Monitor", url: `https://monitor.firefox.com/`, description: "Mozilla breach checker" },
    { name: "Google One Dark Web", url: `https://one.google.com/`, description: "Untuk Gmail user" },
  ];

  // Auto-check via HIBP public API (free tier)
  try {
    const r = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
      timeout: 10000, validateStatus: () => true,
      headers: { "User-Agent": "PANN-OSINT" }
    });
    if (r.status === 200) {
      result.breaches = r.data.map(b => ({
        name: b.Name,
        domain: b.Domain,
        date: b.BreachDate,
        pwnCount: b.PwnCount,
        dataClasses: b.DataClasses,
        description: b.Description
      }));
    } else if (r.status === 404) {
      result.breaches = [];
      result.clean = true;
    } else if (r.status === 401) {
      result.hint = "HIBP butuh API key berbayar. Cek manual di link di bawah.";
    }
  } catch {}

  res.json(result);
}