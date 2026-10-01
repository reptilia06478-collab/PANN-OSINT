import axios from "axios";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email required" });

  const result = { email, links: [], hints: [] };

  // Cek akun Google publik via People API (kalau emailnya Gmail, ini bisa ngecek profile)
  if (email.endsWith("@gmail.com")) {
    const username = email.split("@")[0];
    result.hints.push({
      hint: "Gmail username",
      value: username
    });
    result.hints.push({
      hint: "Google+ profile (legacy)",
      value: `https://plus.google.com/${username}`
    });
    result.hints.push({
      hint: "YouTube channel",
      value: `https://www.youtube.com/user/${username}`
    });
  }

  // Search engine queries
  const queries = [
    { name: "Google", url: `https://www.google.com/search?q="${email}"` },
    { name: "Bing", url: `https://www.bing.com/search?q="${email}"` },
    { name: "Yandex", url: `https://yandex.com/search/?text="${email}"` },
    { name: "DuckDuckGo", url: `https://duckduckgo.com/?q="${email}"` },
    { name: "LinkedIn", url: `https://www.google.com/search?q="${email}"+site:linkedin.com` },
    { name: "GitHub", url: `https://github.com/search?q=${email}&type=users` },
    { name: "Twitter/X", url: `https://www.google.com/search?q="${email}"+site:twitter.com+OR+site:x.com` },
    { name: "Facebook", url: `https://www.google.com/search?q="${email}"+site:facebook.com` },
    { name: "Instagram", url: `https://www.google.com/search?q="${email}"+site:instagram.com` },
    { name: "Pastebin", url: `https://www.google.com/search?q="${email}"+site:pastebin.com` },
    { name: "PDF Files", url: `https://www.google.com/search?q="${email}"+filetype:pdf` },
    { name: "Excel Files", url: `https://www.google.com/search?q="${email}"+filetype:xlsx+OR+filetype:csv` },
    { name: "Documents", url: `https://www.google.com/search?q="${email}"+filetype:doc+OR+filetype:docx` },
    { name: "GitHub Code", url: `https://github.com/search?q="${email}"&type=code` },
    { name: "Have I Been Pwned", url: `https://haveibeenpwned.com/account/${email}` },
    { name: "LeakCheck", url: `https://leakcheck.io/` },
    { name: "Snusbase", url: `https://snusbase.com/` },
    { name: "IntelX", url: `https://intelx.io/?s=${email}` },
    { name: "Epios", url: `https://epieos.com/?q=${email}` },
    { name: "Hunter", url: `https://hunter.io/search/${email.split("@")[1]}` },
  ];
  result.links = queries;

  res.json(result);
}