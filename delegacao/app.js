const balanceData = {
  abandonment: {
    title: "Abandono",
    text: "Entrega a tarefa sem contexto, autoridade, recursos, marcos ou disponibilidade para apoiar.",
    color: "#8c999e"
  },
  delegation: {
    title: "Delegação",
    text: "Combina resultado, pessoa, autoridade, apoio, checkpoints e aprendizagem.",
    color: "#78bd78"
  },
  micro: {
    title: "Microgestão",
    text: "Define cada passo, revisa tudo e retoma a tarefa diante do primeiro desvio.",
    color: "#8c999e"
  }
};

const autonomyData = {
  1: ["Levante dados", "Eu decido com base nas informações."],
  2: ["Compare", "Apresente alternativas e critérios."],
  3: ["Recomende", "Traga uma proposta para validação."],
  4: ["Decida", "Avise antes de executar."],
  5: ["Decida e execute", "Informe depois."]
};

const autonomyColors = {
  1: "#00638f",
  2: "#087aa1",
  3: "#7d9659",
  4: "#678248",
  5: "#4f6c36"
};

const riskData = [
  {
    title: "Concentração identificada.",
    copy: "O conhecimento essencial ainda depende de uma única pessoa.",
    portrait: "assets/designer/olivia-worry.webp",
    alt: "Olívia refletindo sobre o risco."
  },
  {
    title: "A ausência revela a dependência.",
    copy: "Sem procedimento, acesso e substituto preparado, a rotina perde continuidade.",
    portrait: "assets/designer/tomas-worry.webp",
    alt: "Tomás preocupado com a interrupção da rotina."
  },
  {
    title: "O impacto chega à entrega.",
    copy: "Prazos, atendimento e conformidade ficam expostos quando o trabalho não é transferível.",
    portrait: "assets/designer/olivia-focus.webp",
    alt: "Olívia concentrada na proteção da entrega."
  }
];

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".chapter-nav");
const progress = document.querySelector("#reading-progress");
const backToTop = document.querySelector("#back-to-top");

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

function updateScrollUI() {
  const root = document.documentElement;
  const max = root.scrollHeight - root.clientHeight;
  const ratio = max > 0 ? root.scrollTop / max : 0;
  progress.style.width = `${ratio * 100}%`;
  backToTop.classList.toggle("show", root.scrollTop > 700);
}

document.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const navLinks = [...document.querySelectorAll(".chapter-nav a")];
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
}, { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.25] });
document.querySelectorAll("section[id]").forEach((section) => sectionObserver.observe(section));

const riskTitle = document.querySelector("#risk-title");
const riskCopy = document.querySelector("#risk-copy");
const riskPortrait = document.querySelector("#risk-portrait");
document.querySelectorAll(".risk-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".risk-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    const data = riskData[Number(card.dataset.risk)];
    riskTitle.textContent = data.title;
    riskCopy.textContent = data.copy;
    riskPortrait.src = data.portrait;
    riskPortrait.alt = data.alt;
  });
});

const activityInput = document.querySelector("#critical-activity");
const activityFeedback = document.querySelector("#activity-feedback");
document.querySelector("#save-activity").addEventListener("click", () => {
  const value = activityInput.value.trim();
  activityFeedback.textContent = value
    ? `Ponto de partida definido: “${value}”. Agora escolha uma parte completa e observável para transferir.`
    : "Descreva uma atividade antes de registrar.";
});

const balanceTabs = [...document.querySelectorAll("[data-balance]")];
balanceTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    const data = balanceData[tab.dataset.balance];
    document.querySelectorAll("[data-balance]").forEach((item) => item.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    const panel = document.querySelector("#balance-panel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.innerHTML = `<strong>${data.title}</strong><p>${data.text}</p>`;
    panel.style.borderTop = `6px solid ${data.color}`;
  });
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = balanceTabs[(index + direction + balanceTabs.length) % balanceTabs.length];
    next.focus();
    next.click();
  });
});

document.querySelectorAll(".criterion").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".criterion").forEach((item) => item.setAttribute("aria-expanded", "false"));
    button.setAttribute("aria-expanded", String(!expanded));
  });
});

const agreementInputs = [...document.querySelectorAll("#agreement-list input")];
const agreementCount = document.querySelector("#agreement-count");
const agreementProgress = document.querySelector("#agreement-progress");
agreementInputs.forEach((input) => input.addEventListener("change", () => {
  const checked = agreementInputs.filter((item) => item.checked).length;
  agreementCount.textContent = `${checked} de ${agreementInputs.length}`;
  agreementProgress.style.width = `${(checked / agreementInputs.length) * 100}%`;
}));

const autonomyRange = document.querySelector("#autonomy-range");
function updateAutonomy() {
  const value = autonomyRange.value;
  const [title, copy] = autonomyData[value];
  document.querySelector("#autonomy-number").textContent = value;
  document.querySelector("#autonomy-title").textContent = title;
  document.querySelector("#autonomy-copy").textContent = copy;
  document.querySelector("#autonomy-card").style.background = autonomyColors[value];
  autonomyRange.setAttribute("aria-valuetext", `Nível ${value}: ${title}. ${copy}`);
}
autonomyRange.addEventListener("input", updateAutonomy);
updateAutonomy();

const heroScene = document.querySelector(".hero-scene");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (heroScene && !reducedMotion.matches) {
  heroScene.addEventListener("pointermove", (event) => {
    const bounds = heroScene.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
    heroScene.style.setProperty("--move-x", `${x}px`);
    heroScene.style.setProperty("--move-y", `${y}px`);
  });
  heroScene.addEventListener("pointerleave", () => {
    heroScene.style.setProperty("--move-x", "0px");
    heroScene.style.setProperty("--move-y", "0px");
  });
}
