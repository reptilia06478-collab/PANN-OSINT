import axios from "axios";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  let { ip } = req.query;

  // Kalau ip kosong, ambil IP client
  if (!ip || ip === "me") {
    ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress;
  }

  const result = { ip, geo: null, asn: null, reverse: null, threat: null };

  // IP-API
  try {
    const r = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,reverse,mobile,proxy,hosting,query`, { timeout: 8000 });
    result.geo = r.data;
  } catch {}

  // ipapi.co — extra data
  try {
    const r = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 8000 });
    result.asn = r.data;
  } catch {}

  // Reverse DNS via Google
  try {
    const r = await axios.get(`https://dns.google/resolve?name=${ip.split(".").reverse().join(".")}.in-addr.arpa&type=PTR`, { timeout: 8000 });
    result.reverse = r.data.Answer?.map(a => a.data) || [];
  } catch {}

  res.json(result);
}