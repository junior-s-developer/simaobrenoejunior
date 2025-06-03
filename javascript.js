window.indexAtualGlobal = 0; // Agora global

// ==============================
// MENU MOBILE
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggleButton && mobileMenu) {
    toggleButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  // SUBMENU MOBILE
  const sobreLink = document.querySelector('#mobile-menu .dropdown > a');
  const submenu = document.querySelector('#mobile-menu .submenu');

  if (sobreLink && submenu) {
    sobreLink.addEventListener("click", function (e) {
      e.preventDefault();
      submenu.classList.toggle("open");
    });
  }

  // ANIMAÇÃO DE ENTRADA
  document.body.classList.add("fade-in");

  // TRANSIÇÃO DE SAÍDA SUAVE
  let navegando = false;
  document.querySelectorAll("a[href]").forEach(link => {
    const url = link.getAttribute("href");

    const isAnchor = url === "#" || url.startsWith("#");
    const isExternal = url.startsWith("http");
    const isDownload = link.hasAttribute("download");
    const hasTarget = link.hasAttribute("target");

    const isInsideDynamic = link.closest('.galeria-wrapper');

    if (!isAnchor && !isExternal && !isDownload && !hasTarget && !isInsideDynamic) {
      link.addEventListener("click", function (e) {
        if (navegando) return;
        navegando = true;
        e.preventDefault();

        document.body.classList.remove("fade-in");
        document.body.style.opacity = 0;

        setTimeout(() => {
          window.location.href = this.href;
        }, 300);
      });
    }
  });
  // MÁSCARA DE TELEFONE
  const telefoneInput = document.getElementById("telefone");
  if (telefoneInput) {
    telefoneInput.addEventListener("input", function () {
      let valor = this.value.replace(/\D/g, "");
      if (valor.length > 0) valor = "(" + valor;
      if (valor.length > 3) valor = valor.slice(0, 3) + ") " + valor.slice(3);
      if (valor.length > 10) valor = valor.slice(0, 10) + "-" + valor.slice(10);
      if (valor.length > 15) valor = valor.slice(0, 15);
      this.value = valor;
    });
  }

  // BLOQUEIO DE DATAS PASSADAS
  const dataInput = document.getElementById("data");
  if (dataInput) {
    const hoje = new Date().toISOString().split("T")[0];
    dataInput.setAttribute("min", hoje);
  }

  // BOTÃO WHATSAPP
  const btn = document.querySelector("button");
  if (btn) {
    btn.addEventListener("click", function () {
      const nomeInput = document.getElementById("nome");
      const telefoneInput = document.getElementById("telefone");
      const localInput = document.getElementById("local");
      const dataInput = document.getElementById("data");
      const detalhesInput = document.getElementById("mensagem");

      const nome = nomeInput.value.trim();
      const telefone = telefoneInput.value.trim();
      const local = localInput.value.trim();
      const data = dataInput.value.trim();
      const detalhes = detalhesInput.value.trim();

      if (!nome) return alert("Digite seu nome."), nomeInput.focus();
      if (!telefone) return alert("Digite seu telefone."), telefoneInput.focus();
      if (telefone.length !== 15)
        return alert("Digite um número de telefone válido: \nDDD 9XXXX-XXXX."), telefoneInput.focus();
      if (!local) return alert("Informe o local do evento."), localInput.focus();
      if (!data) return alert("Informe a data do evento."), dataInput.focus();

      const hoje = new Date();
      const dataSelecionada = new Date(`${data}T00:00:00`);
      if (dataSelecionada < hoje.setHours(0, 0, 0, 0))
        return alert("A data do evento não pode ser no passado."), dataInput.focus();

      if (!detalhes) return alert("Diga-nos sobre seu evento."), detalhesInput.focus();

      const partesData = data.split("-");
      const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

      const mensagem = `Oi! Aqui é o *${nome}*.

Entrei em contato pelo site, gostaria de saber sobre a disponibilidade e o orçamento para a realização de um show. Agradeço desde já!

*Local*: ${local}  
*Data*: ${dataFormatada}  
*Telefone*: ${telefone}

*DETALHES DO EVENTO*:

${detalhes}`;

      const mensagemCodificada = encodeURIComponent(mensagem);
      const numeroDestino = "5535984728729";
      const url = `https://wa.me/${numeroDestino}?text=${mensagemCodificada}`;

      window.open(url, "_blank");
    });
  }

  // STATUS DE EVENTOS
  const eventos = document.querySelectorAll(".container-programacao");

  eventos.forEach(evento => {
    const dataTexto = evento.getAttribute("data-date");
    if (!dataTexto) return;

    const [ano, mes, dia] = dataTexto.split("-");
    const dataEvento = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataEvento < hoje) {
      const statusSpan = evento.querySelector(".status-evento");
      if (statusSpan) {
        statusSpan.innerHTML = '<i class="fa-solid fa-check icone-verde"></i> Evento Realizado';
        statusSpan.classList.add("evento-passado");
      }
    }
  });
});

// ==============================
// VÍDEO PERSONALIZADO
// ==============================
function configurarVideoClick() {
  const videoWrappers = document.querySelectorAll(".video-wrapper");

  videoWrappers.forEach(wrapper => {
    const video = wrapper.querySelector("video");
    const playOverlay = wrapper.querySelector(".play-overlay");
    const muteBtn = wrapper.querySelector(".botao-controle.mute");
    const fullscreenBtn = wrapper.querySelector(".botao-controle.fullscreen");

    // Play/Pause ao clicar no vídeo
    wrapper.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playOverlay.style.display = "none";
      } else {
        video.pause();
        playOverlay.style.display = "block";
      }
    });

    // Controle de mute
    muteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // evita que pause/play ao clicar
      video.muted = !video.muted;
      const icon = muteBtn.querySelector("i");
      icon.classList.toggle("fa-volume-up", !video.muted);
      icon.classList.toggle("fa-volume-mute", video.muted);
    });

    // Tela cheia
    fullscreenBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const wrapper = fullscreenBtn.closest(".video-wrapper");
      wrapper.classList.toggle("modo-fullscreen");

      // ✅ Aqui está o bloco essencial
      if (!wrapper.classList.contains("modo-fullscreen")) {
        const carrossel = document.querySelector(".carrossel");
        const slides = carrossel?.children;
        if (slides && window.indexAtualGlobal !== undefined) {
          slides[window.indexAtualGlobal].scrollIntoView({ behavior: "instant", inline: "start" });
        }
      }

      // Impede o vídeo de exibir controles nativos mesmo no modo simulado
      const video = wrapper.querySelector("video");
      video.controls = false;

      // Atualiza botão fullscreen para refletir estado
      const icon = fullscreenBtn.querySelector("i");
      icon.classList.toggle("fa-expand");
      icon.classList.toggle("fa-compress");
    });

    // Esconde o ícone de play quando o vídeo está tocando
    video.addEventListener("play", () => {
      playOverlay.style.display = "none";

      // 🔇 Pausa todos os outros vídeos
      document.querySelectorAll(".video-wrapper video").forEach(v => {
        if (v !== video) {
          v.pause();
          v.currentTime = 0;
          v.muted = true;

          const parent = v.closest(".video-wrapper");
          if (parent) {
            const overlay = parent.querySelector(".play-overlay");
            if (overlay) overlay.style.display = "block";

            const muteBtn = parent.querySelector(".botao-controle.mute i");
            if (muteBtn) {
              muteBtn.classList.remove("fa-volume-up");
              muteBtn.classList.add("fa-volume-mute");
            }
          }
        }
      });
    });

    video.addEventListener("pause", () => {
      playOverlay.style.display = "block";
    });
  });
}

// ==============================
// CARROSSEL DE IMAGENS/VÍDEOS
// ==============================
function iniciarTodosCarrosseis() {
  const galerias = document.querySelectorAll('.galeria-wrapper');

  galerias.forEach(galeria => {
    const carrossel = galeria.querySelector('.carrossel');
    const slides = carrossel.querySelectorAll('img, .video-wrapper');
    const indicadores = galeria.querySelector('.indicadores');
    const btnAnterior = galeria.querySelector('.anterior');
    const btnProximo = galeria.querySelector('.proximo');

    let indiceAtual = 0;

    // Cria os indicadores
    indicadores.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.addEventListener('click', () => {
        indiceAtual = i;
        scrollParaSlide(i);
      });
      indicadores.appendChild(btn);
    });

    function scrollParaSlide(i) {
      const slide = slides[i];
      if (slide) {
        // Pausa todos os vídeos que não estão visíveis
        slides.forEach((s, index) => {
          const video = s.querySelector('video');
          if (video && index !== i) {
            video.pause();
          }
        });

        // Tenta dar play no vídeo do slide atual
        const videoAtual = slide.querySelector('video');
        if (videoAtual) {
          videoAtual.play().catch(err => console.warn("Autoplay bloqueado:", err));
        }

        carrossel.scrollTo({
          left: slide.offsetLeft,
          behavior: 'auto'
        });

        atualizarIndicadores(i);
        atualizarSetas();
      }
    }

    function atualizarIndicadores(ativo) {
      indicadores.querySelectorAll('button').forEach((btn, i) => {
        btn.classList.toggle('ativo', i === ativo);
      });
    }

    function atualizarSetas() {
      btnAnterior.style.display = indiceAtual === 0 ? 'none' : 'flex';
      btnProximo.style.display = indiceAtual === slides.length - 1 ? 'none' : 'flex';
    }

    btnAnterior.addEventListener('click', () => {
      if (indiceAtual > 0) {
        indiceAtual--;
        scrollParaSlide(indiceAtual);
      }
    });

    btnProximo.addEventListener('click', () => {
      if (indiceAtual < slides.length - 1) {
        indiceAtual++;
        scrollParaSlide(indiceAtual);
      }
    });

    // Observa quais slides estão visíveis
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          indiceAtual = Array.from(slides).indexOf(entry.target);
          atualizarIndicadores(indiceAtual);
          atualizarSetas();

          // Pausa vídeos que não são o slide atual
          slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (video && index !== indiceAtual) {
              video.pause();
            }
          });

          // Dá play no vídeo do slide visível
          const videoVisivel = entry.target.querySelector('video');
          if (videoVisivel) {
            videoVisivel.play().catch(err => console.warn("Autoplay bloqueado:", err));
          }
        }
      });
    }, {
      root: carrossel,
      threshold: 0.6
    });

    slides.forEach(slide => observer.observe(slide));

    // Inicializa
    atualizarIndicadores(0);
    atualizarSetas();

    // Dá play no vídeo do primeiro slide, se existir
    const primeiroSlide = slides[0];
    if (primeiroSlide) {
      const video = primeiroSlide.querySelector('video');
      if (video) {
        video.play().catch(err => console.warn("Autoplay bloqueado:", err));
      }
    }
  });
}

// ==============================
// CARREGAR CONTEÚDO
// ==============================
function carregarConteudo(caminho, botao) {
  fetch(caminho)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro ao carregar ${caminho}`);
      }
      return response.text();
    })
    .then(html => {
      const container = document.getElementById("conteudo-dinamico");
      if (!container) return console.error("Div #conteudo-dinamico não encontrada.");
      container.innerHTML = html;

      // Ativa funcionalidades após carregar
      configurarVideoClick();
      iniciarTodosCarrosseis();

      // Atualiza botão ativo
      document.querySelectorAll('.link-botao').forEach(btn => btn.classList.remove('ativo'));
      if (botao) botao.classList.add('ativo');
    })
    .catch(error => {
      console.error("Erro ao carregar o conteúdo:", error);
    });
}

// Ao carregar a página, ativa "Shows" por padrão
document.addEventListener('DOMContentLoaded', () => {
  const botaoShows = document.getElementById('botao-shows');
  carregarConteudo('../includes/shows.html', botaoShows);
});

// ==============================
// CONFIGURAÇÕES DO FORMULÁRIO BREVO
// ==============================
window.REQUIRED_CODE_ERROR_MESSAGE = "Escolha um código de país";
window.LOCALE = "pt";
window.EMAIL_INVALID_MESSAGE =
  window.SMS_INVALID_MESSAGE =
  window.GENERIC_INVALID_MESSAGE =
  "Opa! Algumas informações parecem estar incorretas. Verifique os campos e tente novamente.";
window.REQUIRED_ERROR_MESSAGE = "Por favor, preencha este campo. ";
window.translation = {
  common: {
    selectedList: "{quantity} lista selecionada",
    selectedLists: "{quantity} listas selecionadas",
    selectedOption: "{quantity} selecionado",
    selectedOptions: "{quantity} selecionados",
  },
};
var AUTOHIDE = Boolean(0);

// ==============================
// CARREGAR RODAPÉ E SCRIPT BREVO
// ==============================
fetch("../includes/rodape.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("rodape-container").innerHTML = data;

    const brevoScript = document.createElement("script");
    brevoScript.src = "https://sibforms.com/forms/end-form/build/main.js";
    brevoScript.defer = true;
    document.body.appendChild(brevoScript);
  });