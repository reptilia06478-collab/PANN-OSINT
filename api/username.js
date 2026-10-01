import axios from "axios";

const SITES = [
  { name: "GitHub", url: "https://github.com/{}", check: (r) => r.status === 200 && !r.data.includes("Not Found") },
  { name: "Twitter/X", url: "https://x.com/{}", check: (r) => r.status === 200 },
  { name: "Instagram", url: "https://www.instagram.com/{}/", check: (r) => r.status === 200 && !r.data.includes("Sorry, this page") },
  { name: "Facebook", url: "https://www.facebook.com/{}", check: (r) => r.status === 200 },
  { name: "Reddit", url: "https://www.reddit.com/user/{}", check: (r) => r.status === 200 && !r.data.includes("Sorry, nobody on Reddit") },
  { name: "TikTok", url: "https://www.tiktok.com/@{}", check: (r) => r.status === 200 },
  { name: "YouTube", url: "https://www.youtube.com/@{}", check: (r) => r.status === 200 },
  { name: "Pinterest", url: "https://www.pinterest.com/{}/", check: (r) => r.status === 200 },
  { name: "Tumblr", url: "https://{}.tumblr.com", check: (r) => r.status === 200 },
  { name: "Medium", url: "https://medium.com/@{}", check: (r) => r.status === 200 },
  { name: "Dev.to", url: "https://dev.to/{}", check: (r) => r.status === 200 },
  { name: "GitLab", url: "https://gitlab.com/{}", check: (r) => r.status === 200 },
  { name: "Bitbucket", url: "https://bitbucket.org/{}/", check: (r) => r.status === 200 },
  { name: "Keybase", url: "https://keybase.io/{}", check: (r) => r.status === 200 },
  { name: "Steam", url: "https://steamcommunity.com/id/{}", check: (r) => r.status === 200 && !r.data.includes("The specified profile could not be found") },
  { name: "Spotify", url: "https://open.spotify.com/user/{}", check: (r) => r.status === 200 },
  { name: "SoundCloud", url: "https://soundcloud.com/{}", check: (r) => r.status === 200 },
  { name: "Twitch", url: "https://www.twitch.tv/{}", check: (r) => r.status === 200 },
  { name: "VK", url: "https://vk.com/{}", check: (r) => r.status === 200 },
  { name: "Telegram", url: "https://t.me/{}", check: (r) => r.status === 200 && !r.data.includes("If you have Telegram") },
  { name: "Patreon", url: "https://www.patreon.com/{}", check: (r) => r.status === 200 },
  { name: "Behance", url: "https://www.behance.net/{}", check: (r) => r.status === 200 },
  { name: "Dribbble", url: "https://dribbble.com/{}", check: (r) => r.status === 200 },
  { name: "Flickr", url: "https://www.flickr.com/people/{}", check: (r) => r.status === 200 },
  { name: "Vimeo", url: "https://vimeo.com/{}", check: (r) => r.status === 200 },
  { name: "About.me", url: "https://about.me/{}", check: (r) => r.status === 200 },
  { name: "Linktree", url: "https://linktr.ee/{}", check: (r) => r.status === 200 },
  { name: "Cash.app", url: "https://cash.app/${}", check: (r) => r.status === 200 },
  { name: "Venmo", url: "https://venmo.com/{}", check: (r) => r.status === 200 },
  { name: "Roblox", url: "https://www.roblox.com/user.aspx?username={}", check: (r) => r.status === 200 },
  { name: "Minecraft", url: "https://api.mojang.com/users/profiles/minecraft/{}", check: (r) => r.status === 200 },
  { name: "Chess.com", url: "https://api.chess.com/pub/player/{}", check: (r) => r.status === 200 },
  { name: "HackerNews", url: "https://news.ycombinator.com/user?id={}", check: (r) => r.status === 200 && !r.data.includes("No such user") },
  { name: "Replit", url: "https://replit.com/@{}", check: (r) => r.status === 200 },
  { name: "CodePen", url: "https://codepen.io/{}", check: (r) => r.status === 200 },
  { name: "Pastebin", url: "https://pastebin.com/u/{}", check: (r) => r.status === 200 && !r.data.includes("Not Found") },
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username required" });

  const results = [];
  const checks = SITES.map(async (site) => {
    const url = site.url.replace("{}", username);
    try {
      const r = await axios.get(url, {
        timeout: 8000, validateStatus: () => true,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
        maxRedirects: 3,
      });
      if (site.check(r)) {
        results.push({ site: site.name, url, status: r.status, found: true });
      }
    } catch {}
  });

  await Promise.allSettled(checks);
  results.sort((a, b) => a.site.localeCompare(b.site));
  res.json({ username, found: results, total: results.length });
}