const toolArea = document.getElementById("tool-area");
const toolTitle = document.getElementById("tool-title");
const navLinks = document.querySelectorAll("nav a");

function h(html) { toolArea.innerHTML = html; }
function setTitle(t) { toolTitle.textContent = t; }
function val(sel) { return document.querySelector(sel)?.value || ""; }

async function api(path) {
  const r = await fetch(path);
  return r.json();
}

function showResult(id, data) {
  document.getElementById(id).textContent =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    setTitle(link.textContent);
    renderTool(link.dataset.tool);
  });
});

function renderTool(tool) {
  const map = {
    dashboard: renderDashboard, email: renderEmail, google: renderGoogle,
    username: renderUsername, phone: renderPhone, ip: renderIp,
    domain: renderDomain, breach: renderBreach, social: renderSocial
  };
  if (map[tool]) map[tool]();
}

function renderDashboard() {
  h(`
    <div class="dash-grid">
      <div class="dash-card"><h4>Tools</h4><div class="num">9</div></div>
      <div class="dash-card"><h4>Status</h4><div class="num">ON</div></div>
      <div class="dash-card"><h4>Deploy</h4><div class="num" style="font-size:16px">Vercel</div></div>
    </div>
    <div class="card" style="margin-top:20px">
      <h3>PANN OSINT Panel</h3>
      <p style="color:#8b96a8;line-height:1.6;margin-bottom:14px">
        Panel OSINT lengkap — email, username, phone, IP, domain, breach, social media.
        Semua jalan di browser, backend serverless di Vercel.
      </p>
      <div class="links">
        <a href="https://epieos.com" target="_blank">Epieos — Google account OSINT</a>
        <a href="https://haveibeenpwned.com" target="_blank">HaveIBeenPwned — breach checker</a>
        <a href="https://intelx.io" target="_blank">Intelligence X — deep web search</a>
        <a href="https://dehashed.com" target="_blank">DeHashed — credential search</a>
        <a href="https://leakcheck.io" target="_blank">LeakCheck — 7B+ leak database</a>
        <a href="https://snusbase.com" target="_blank">Snusbase — breach search</a>
        <a href="https://breachdirectory.org" target="_blank">BreachDirectory — public dataset</a>
        <a href="https://whatsmyname.app" target="_blank">WhatsMyName — username enum</a>
        <a href="https://namechk.com" target="_blank">Namechk — username checker</a>
        <a href="https://checkusernames.com" target="_blank">CheckUsernames</a>
      </div>
    </div>
  `);
}

function renderEmail() {
  h(`
    <div class="card">
      <h3>Email OSINT</h3>
      <div class="form-group"><label>Email</label><input id="em" placeholder="target@gmail.com"></div>
      <button id="go">Lookup</button>
      <div class="result" id="out">Ready.</div>
    </div>
  `);
  document.getElementById("go").onclick = async () => {
    const b = document.getElementById("go");
    b.disabled = true; b.textContent = "Loading...";
    const r = await api(`/api/email?email=${encodeURIComponent(val("#em"))}`);
    showResult("out", r);
    b.disabled = false; b.textContent = "Lookup";
  };
}

function renderGoogle() {
  h(`
    <div class="card">
      <h3>Google Account OSINT</h3>
      <div class="form-group"><label>Gmail / Google Email</label><input id="go-em" placeholder="target@gmail.com"></div>
      <button id="go-btn">Enumerate</button>
      <div class="result" id="go-out">Ready.</div>
    </div>
  `);
  document.getElementById("go-btn").onclick = async () => {
    const b = document.getElementById("go-btn");
    b.disabled = true; b.textContent = "Loading...";
    const r = await api(`/api/google?email=${encodeURIComponent(val("#go-em"))}`);
    showResult("go-out", r);
    b.disabled = false; b.textContent = "Enumerate";
  };
}

function renderUsername() {
  h(`
    <div class="card">
      <h3>Username Enumeration</h3>
      <div class="form-group"><label>Username</label><input id="un" placeholder="johndoe"></div>
      <button id="go">Scan (butuh ~20 detik)</button>
      <div class="result" id="out">Ready.</div>
    </div>
  `);
  document.getElementById("go").onclick = async () => {
    const b = document.getElementById("go");
    b.disabled = true; b.textContent = "Scanning 36 sites...";
    const r = await api(`/api/username?username=${encodeURIComponent(val("#un"))}`);
    showResult("out", r);
    b.disabled = false; b.textContent = "Scan (butuh ~20 detik)";
  };
}

function renderPhone() {
  h(`
    <div class="card">
      <h3>Phone OSINT</h3>
      <div class="form-group"><label>Phone (format +628...)</label><input id="ph" placeholder="+6281234567890"></div>
      <button id="go">Lookup</button>
      <div class="result" id="out">Ready.</div>
    </div>
  `);
  document.getElementById("go").onclick = async () => {
    const b = document.getElementById("go");
    b.disabled = true; b.textContent = "Loading...";
    const r = await api(`/api/phone?phone=${encodeURIComponent(val("#ph"))}`);
    showResult("out", r);
    b.disabled = false; b.textContent = "Lookup";
  };
}

function renderIp() {
  h(`
    <div class="card">
      <h3>IP Lookup</h3>
      <div class="form-group"><label>IP Address (kosong = IP kamu)</label><input id="ip" placeholder="8.8.8.8"></div>
      <button id="go">Lookup</button>
      <div class="result" id="out">Ready.</div>
    </div>
  `);
  document.getElementById("go").onclick = async () => {
    const b = document.getElementById("go");
    b.disabled = true; b.textContent = "Loading...";
    const r = await api(`/api/ip?ip=${encodeURIComponent(val("#ip"))}`);
    showResult("out", r);
    b.disabled = false; b.textContent = "Lookup";
  };
}

function renderDomain() {
  h(`
    <div class="card">
      <h3>Domain / Website OSINT</h3>
      <div class="form-group"><label>Domain</label><input id="dm" placeholder="example.com"></div>
      <button id="go">Lookup</button>
      <div class="result" id="out">Ready.</div>
    </div>
  `);
  document.getElementById("go").onclick = async () => {
    const b = document.getElementById("go");
    b.disabled = true; b.textContent = "Loading...";
    const r = await api(`/api/domain?domain=${encodeURIComponent(val("#dm"))}`);
    showResult("out", r);
    b.disabled = false; b.textContent = "Lookup";
  };
}

function renderBreach() {
  h(`
    <div class="card">
      <h3>Breach Checker</h3>
      <div class="form-group"><label>Email</label><input id="br" placeholder="target@gmail.com"></div>
      <button id="go">Check</button>
      <div class="result" id="out">Ready.</div>
    </div>
  `);
  document.getElementById("go").onclick = async () => {
    const b = document.getElementById("go");
    b.disabled = true; b.textContent = "Loading...";
    const r = await api(`/api/breach?email=${encodeURIComponent(val("#br"))}`);
    showResult("out", r);
    b.disabled = false; b.textContent = "Check";
  };
}

function renderSocial() {
  h(`
    <div class="card">
      <h3>Social Media Finder</h3>
      <div class="form-group"><label>Nama / Username</label><input id="sc" placeholder="johndoe"></div>
      <button id="go">Find</button>
      <div class="result" id="out">Ready.</div>
    </div>
  `);
  document.getElementById("go").onclick = async () => {
    const b = document.getElementById("go");
    b.disabled = true; b.textContent = "Loading...";
    const q = val("#sc");
    const r = await api(`/api/social?name=${encodeURIComponent(q)}&username=${encodeURIComponent(q)}`);
    showResult("out", r);
    b.disabled = false; b.textContent = "Find";
  };
}

renderDashboard();