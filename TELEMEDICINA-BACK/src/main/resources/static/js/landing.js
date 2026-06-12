// Médicos vindos do backend via Thymeleaf
const medicosReais = (window.medicosData || []).map(m => ({
  nome: "Dr(a). " + m.nome,
  especialidade: (m.especialidade && m.especialidade.trim() !== "") ? m.especialidade : "Especialidade não informada"
}));

// Deixa sempre 3 cards, mesmo sem medicos adicionados
const TOTAL_VISIVEIS = 3;
const medicos = [...medicosReais];
while (medicos.length < TOTAL_VISIVEIS) {
  medicos.push({ nome: "Dr(a).", especialidade: "" });
}

let startIndex = 0;

function renderCarousel() {
  const row = document.getElementById("carouselCards");
  row.innerHTML = "";

  for (let i = 0; i < TOTAL_VISIVEIS; i++) {
    const m = medicos[(startIndex + i) % medicos.length];
    const card = document.createElement("div");
    card.className = "carousel-card-container";
    card.innerHTML = `
      <div class="carousel-card-bg">
        <img src="/images/back.png" alt="">
        <div class="carousel-card-bg-overlay"></div>
      </div>
      <div class="carousel-card-content">
        <h2>${m.nome}</h2>
        <p>${m.especialidade}</p>
        <button class="btn-card-agendar" onclick="location.href=(window.usuarioLogado ? '/home' : '/login')">Agendar consulta</button>
      </div>
    `;
    row.appendChild(card);
  }
}

function nextCard() {
  if (medicos.length <= TOTAL_VISIVEIS) return;
  startIndex = (startIndex + 1) % medicos.length;
  renderCarousel();
}

function prevCard() {
  if (medicos.length <= TOTAL_VISIVEIS) return;
  startIndex = (startIndex - 1 + medicos.length) % medicos.length;
  renderCarousel();
}

window.addEventListener("pageshow", function (e) {
  const nav = performance.getEntriesByType("navigation")[0];
  if (e.persisted || (nav && nav.type === "back_forward")) window.location.reload();
});

renderCarousel();