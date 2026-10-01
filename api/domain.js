import axios from "axios";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ error: "domain required" });

  const result = { domain, dns: {}, whois: null, subdomains: [], tech: {}, links: [] };

  // DNS A record
  try {
    const r = await axios.get(`https://dns.google/resolve?name=${domain}&type=A`, { timeout: 8000 });
    result.dns.A = r.data.Answer?.map(a => a.data) || [];
  } catch {}

  // DNS MX
  try {
    const r = await axios.get(`https://dns.google/resolve?name=${domain}&type=MX`, { timeout: 8000 });
    result.dns.MX = r.data.Answer?.map(a => a.data) || [];
  } catch {}

  // DNS TXT
  try {
    const r = await axios.get(`https://dns.google/resolve?name=${domain}&type=TXT`, { timeout: 8000 });
    result.dns.TXT = r.data.Answer?.map(a => a.data) || [];
  } catch {}

  // DNS NS
  try {
    const r = await axios.get(`https://dns.google/resolve?name=${domain}&type=NS`, { timeout: 8000 });
    result.dns.NS = r.data.Answer?.map(a => a.data) || [];
  } catch {}

  // crt.sh subdomains
  try {
    const r = await axios.get(`https://crt.sh/?q=%25.${domain}&output=json`, { timeout: 15000 });
    const names = new Set();
    r.data.forEach(e => e.name_value.split("\n").forEach(n => names.add(n.trim().toLowerCase())));
    result.subdomains = [...names].filter(n => n.endsWith(domain) && !n.includes("*"));
  } catch {}

  // Fingerprint tech + extract links
  try {
    const r = await axios.get(`https://${domain}`, {
      timeout: 10000, validateStatus: () => true,
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    result.tech.server = r.headers.server || "";
    result.tech.poweredBy = r.headers["x-powered-by"] || "";
    result.tech.cms = r.headers["x-generator"] || "";

    // Extract links
    const cheerio = await import("cheerio");
    const $ = cheerio.load(r.data);
    $("a").each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.startsWith("http")) result.links.push(href);
    });
    result.links = [...new Set(result.links)].slice(0, 50);
  } catch {}

  res.json(result);
}