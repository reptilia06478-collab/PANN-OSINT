import axios from "axios";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { name, username } = req.query;

  const result = { query: name || username, searches: [], profiles: [] };

  if (username) {
    const sites = [
      { name: "Facebook", url: `https://www.facebook.com/${username}` },
      { name: "Instagram", url: `https://www.instagram.com/${username}/` },
      { name: "Twitter/X", url: `https://x.com/${username}` },
      { name: "TikTok", url: `https://www.tiktok.com/@${username}` },
      { name: "Snapchat", url: `https://www.snapchat.com/add/${username}` },
      { name: "LinkedIn", url: `https://www.linkedin.com/in/${username}` },
      { name: "Reddit", url: `https://www.reddit.com/user/${username}` },
      { name: "Tumblr", url: `https://${username}.tumblr.com` },
      { name: "Pinterest", url: `https://www.pinterest.com/${username}/` },
      { name: "YouTube", url: `https://www.youtube.com/@${username}` },
      { name: "Twitch", url: `https://www.twitch.tv/${username}` },
      { name: "Discord", url: `https://discord.com/users/${username}` },
      { name: "Telegram", url: `https://t.me/${username}` },
      { name: "VK", url: `https://vk.com/${username}` },
      { name: "Odnoklassniki", url: `https://ok.ru/${username}` },
      { name: "Weibo", url: `https://weibo.com/${username}` },
      { name: "Douyin", url: `https://www.douyin.com/user/${username}` },
      { name: "Line", url: `https://line.me/ti/p/~${username}` },
      { name: "KakaoTalk", url: `https://open.kakao.com/o/${username}` },
    ];

    const checks = sites.map(async (site) => {
      try {
        const r = await axios.get(site.url, {
          timeout: 8000, validateStatus: () => true,
          headers: { "User-Agent": "Mozilla/5.0" },
          maxRedirects: 3,
        });
        if (r.status === 200) result.profiles.push({ site: site.name, url: site.url, status: 200 });
      } catch {}
    });
    await Promise.allSettled(checks);
  }

  // Search engine links
  if (name) {
    const q = encodeURIComponent(name);
    result.searches = [
      { name: "Google", url: `https://www.google.com/search?q="${q}"` },
      { name: "Bing", url: `https://www.bing.com/search?q="${q}"` },
      { name: "Yandex", url: `https://yandex.com/search/?text="${q}"` },
      { name: "DuckDuckGo", url: `https://duckduckgo.com/?q="${q}"` },
      { name: "Facebook", url: `https://www.facebook.com/search/top?q=${q}` },
      { name: "LinkedIn", url: `https://www.linkedin.com/search/results/all/?keywords=${q}` },
      { name: "Twitter", url: `https://twitter.com/search?q=${q}` },
      { name: "Instagram", url: `https://www.instagram.com/explore/tags/${q.replace(/\s/g, "")}/` },
      { name: "TikTok", url: `https://www.tiktok.com/search?q=${q}` },
      { name: "YouTube", url: `https://www.youtube.com/results?search_query=${q}` },
    ];
  }

  res.json(result);
}