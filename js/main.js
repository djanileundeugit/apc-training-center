const ICONS = {
  calc: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M16 14h.01M12 18h.01M8 18h.01M16 18h.01"/>',
  percent: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
};
const icon = k => `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;

const COURSES = [
  { t: "Comptabilité informatisée", c: "gestion", i: "calc", d: "Tenue des comptes et logiciels comptables." },
  { t: "Fiscalité des entreprises", c: "gestion", i: "percent", d: "Déclarations, obligations et optimisation fiscale." },
  { t: "Gestion des ressources humaines", c: "gestion", i: "users", d: "Recrutement, paie, droit du travail, développement des talents." },
  { t: "Finance d'entreprise", c: "gestion", i: "chart", d: "Analyse financière, budget et trésorerie." },
  { t: "Développement web & mobile", c: "digital", i: "code", d: "Concevoir des sites et applications modernes." },
  { t: "Anglais professionnel", c: "langues", i: "globe", d: "Communiquer avec aisance en contexte de travail." }
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const label = { gestion: "Gestion & Finance", digital: "Digital & IT", langues: "Langues" };

// courses
$("#courses").innerHTML = COURSES.map(c => `
  <article class="card" data-cat="${c.c}">
    <span class="ci">${icon(c.i)}</span>
    <span class="tag">${label[c.c]}</span>
    <h3>${c.t}</h3>
    <p>${c.d}</p>
    <a href="#contact" data-course="${c.t}">Je m'inscris →</a>
  </article>`).join("");

const select = $("#formationSelect");
select.innerHTML = `<option value="">— Choisir —</option>` + COURSES.map(c => `<option>${c.t}</option>`).join("");

$$(".chip").forEach(b => b.addEventListener("click", () => {
  $$(".chip").forEach(x => x.classList.toggle("active", x === b));
  $$(".card").forEach(card => card.classList.toggle("hide", b.dataset.filter !== "all" && card.dataset.cat !== b.dataset.filter));
}));

$("#courses").addEventListener("click", e => {
  const a = e.target.closest("[data-course]");
  if (a) select.value = a.dataset.course;
});

// actualités
(function () {
  const box = $("#news"), list = window.NEWS || [];
  if (!box || !list.length) { if (box) box.innerHTML = "<p>Aucune actualité pour le moment.</p>"; return; }
  const [top, ...rest] = list;
  const paras = a => a.text.map(p => `<p>${p}</p>`).join("");
  const btn = a => a.link ? `<a class="btn btn-outline btn-sm" href="${a.link.url}" target="_blank" rel="noopener">${a.link.label}</a>` : "";
  let html = `
    <div class="news">
      <figure class="news-main"><img src="${top.image}" alt="${top.alt || top.title}" loading="lazy"></figure>
      <div class="news-text"><span class="date">${top.date}</span><h3>${top.title}</h3>${paras(top)}${btn(top)}</div>
    </div>`;
  if (top.gallery && top.gallery.length)
    html += `<div class="gallery">${top.gallery.map(g => `<img src="${g.src}" alt="${g.alt || ""}" loading="lazy">`).join("")}</div>`;
  if (rest.length)
    html += `<h3 class="news-more">Précédemment</h3><div class="grid">${rest.map(a => `
      <article class="card"><img class="card-img" src="${a.image}" alt="${a.alt || a.title}" loading="lazy">
      <span class="tag">${a.date}</span><h3>${a.title}</h3>${a.text[0] ? `<p>${a.text[0]}</p>` : ""}${a.link ? `<a href="${a.link.url}" target="_blank" rel="noopener">En savoir plus →</a>` : ""}</article>`).join("")}</div>`;
  box.innerHTML = html;
})();

// mobile menu
const burger = $(".burger"), menu = $("#menu");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", menu.classList.toggle("open")));
$$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

// counters
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target, end = +el.dataset.count, t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / 1200, 1);
    el.textContent = Math.round(end * p);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  io.unobserve(el);
}), { threshold: .5 });
$$("[data-count]").forEach(el => io.observe(el));

// forms
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `Nom : ${f.get("nom")}\nTéléphone : ${f.get("tel")}\nFormation : ${f.get("formation") || "-"}\n\n${f.get("msg") || ""}`;
  location.href = `mailto:cabinetapcsarl@gmail.com?subject=${encodeURIComponent("Demande d'inscription — " + (f.get("formation") || "APC Training Center"))}&body=${encodeURIComponent(body)}`;
});

$("#notifyForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = new FormData(e.target).get("email");
  location.href = `mailto:cabinetapcsarl@gmail.com?subject=${encodeURIComponent("Alerte lancement E-learning")}&body=${encodeURIComponent("Merci de me prévenir à : " + email)}`;
});

$("#year").textContent = new Date().getFullYear();
