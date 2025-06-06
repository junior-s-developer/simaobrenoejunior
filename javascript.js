
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

    // Cria a data do evento com hora zerada
    const [ano, mes, dia] = dataTexto.split("-");
    const dataEvento = new Date(ano, mes - 1, dia);
    dataEvento.setHours(0, 0, 0, 0); // ZERA a hora

    // Cria a data de hoje com hora zerada
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // ZERA a hora

    // Se o evento já passou (ontem ou antes), marca como realizado
    if (dataEvento < hoje) {
      const statusSpan = evento.querySelector(".status-evento");
      if (statusSpan) {
        statusSpan.innerHTML = '<i class="fa-solid fa-check icone-verde"></i> Evento Realizado';
        statusSpan.classList.add("evento-passado");
        statusSpan.style.display = 'inline-block';
      }

      evento.classList.add("bloco-passado");

      // Desativa botão
      const botaoDetalhes = evento.querySelector(".button a");
      if (botaoDetalhes) {
        botaoDetalhes.removeAttribute("href");
        botaoDetalhes.setAttribute("title", "Evento já realizado");
        botaoDetalhes.classList.add("desativado");

        const botaoWrapper = botaoDetalhes.closest(".button");
        if (botaoWrapper) {
          botaoWrapper.classList.add("botao-desativado");
        }
      }
    }
  });

  // ====================================================
  // REORDENAR EVENTOS: Todos → Hoje → Futuros → Passados
  // ====================================================
  const containerAgenda = document.querySelector(".container-agenda");

  if (containerAgenda) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const timestampHoje = hoje.getTime();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const eventosHoje = [];
    const eventosFuturos = [];
    const eventosPassados = [];

    const eventosOriginais = Array.from(containerAgenda.querySelectorAll(".container-programacao"));

    eventosOriginais.forEach(evento => {
      const dataTexto = evento.getAttribute("data-date");
      if (!dataTexto) return;

      const horaTexto = (evento.querySelector(".hr")?.textContent || "00:00").replace("hr", "").trim();
      const dataHoraCompleta = new Date(`${dataTexto}T${horaTexto}`);

      const [ano, mes, dia] = dataTexto.split("-");
      const dataZerada = new Date(ano, mes - 1, dia);
      dataZerada.setHours(0, 0, 0, 0);
      const timestampEvento = dataZerada.getTime();

      const eventoMes = dataZerada.getMonth();
      const eventoAno = dataZerada.getFullYear();
      const isMesAnterior =
        eventoAno < anoAtual || (eventoAno === anoAtual && eventoMes < mesAtual);

      if (isMesAnterior) {
        evento.classList.add("mes-anterior");
        evento.style.display = "none";
        return;
      }

      evento.dataset.ordenacao = dataHoraCompleta.getTime();

      if (timestampEvento === timestampHoje) {
        eventosHoje.push(evento);
        evento.classList.add("evento-hoje");
      } else if (timestampEvento > timestampHoje) {
        eventosFuturos.push(evento);
        evento.classList.add("evento-futuro");
      } else {
        eventosPassados.push(evento);
        evento.classList.add("evento-passado");
      }
    });

    const ordenarPorHorario = (a, b) => parseInt(a.dataset.ordenacao) - parseInt(b.dataset.ordenacao);

    eventosHoje.sort(ordenarPorHorario);
    eventosFuturos.sort(ordenarPorHorario);
    eventosPassados.sort(ordenarPorHorario).reverse();

    const eventosTodos = [...eventosHoje, ...eventosFuturos, ...eventosPassados];

    // ============================================
    // FUNÇÃO: Exibir grupo com título e animação
    // ============================================
    function inserirGrupo(container, titulo, eventosGrupo) {
      if (eventosGrupo.length === 0) return;

      const h2 = document.createElement("h2");
      h2.innerHTML = titulo;
      h2.className = "titulo-categoria fade";
      container.appendChild(h2);

      eventosGrupo.forEach(e => {
        const clone = e.cloneNode(true);
        clone.style.display = "flex";
        clone.classList.add("fade");
        container.appendChild(clone);
      });

      requestAnimationFrame(() => {
        h2.classList.add("show");
        Array.from(container.children).forEach(child => {
          if (child.classList.contains("fade")) child.classList.add("show");
        });
      });
    }

    // ========================
    // EXIBIR: TODOS OS EVENTOS
    // ========================
function exibirTodosComTitulos() {
  containerAgenda.innerHTML = "";

  const totalEventos =
    eventosHoje.length + eventosFuturos.length + eventosPassados.length;

  const mostrarTitulos = totalEventos > 1;

  if (mostrarTitulos) {
    inserirGrupo(containerAgenda, "Eventos de <strong>Hoje</strong>", eventosHoje);
    inserirGrupo(containerAgenda, "<strong>Próximos</strong> Eventos", eventosFuturos);
    inserirGrupo(containerAgenda, "Eventos <strong>Realizados</strong>", eventosPassados);
  } else {
    // Caso só tenha um evento, exibe ele direto (sem título)
    const todos = [...eventosHoje, ...eventosFuturos, ...eventosPassados];
    todos.forEach(e => {
      const clone = e.cloneNode(true);
      clone.style.display = "flex";
      clone.classList.add("fade");
      containerAgenda.appendChild(clone);
    });

    requestAnimationFrame(() => {
      Array.from(containerAgenda.children).forEach(child => {
        if (child.classList.contains("fade")) child.classList.add("show");
      });
    });
  }
}


    // ========================
    // EXIBIR FILTRO INDIVIDUAL
    // ========================
    function exibirFiltro(tipo) {
      containerAgenda.innerHTML = "";

      let lista = [];
      let mensagemTexto = "";

      if (tipo === "hoje") {
        lista = eventosHoje;
        mensagemTexto = "Nenhum evento pra <strong>hoje</strong>.";
      }
      if (tipo === "futuros") {
        lista = eventosFuturos;
        mensagemTexto = "Nenhum evento <strong>futuro</strong>.";
      }
      if (tipo === "passados") {
        lista = eventosPassados;
        mensagemTexto = "Nenhum evento <strong>realizado</strong>.";
      }

      if (lista.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.className = "mensagem-vazia fade";
        mensagem.innerHTML = mensagemTexto;
        containerAgenda.appendChild(mensagem);

        requestAnimationFrame(() => mensagem.classList.add("show"));
        return;
      }

      lista.forEach(e => {
        const clone = e.cloneNode(true);
        clone.style.display = "flex";
        clone.classList.add("fade");
        containerAgenda.appendChild(clone);
      });

      requestAnimationFrame(() => {
        Array.from(containerAgenda.children).forEach(child => {
          if (child.classList.contains("fade")) child.classList.add("show");
        });
      });
    }

    // ==================
    // FILTROS DE EVENTOS
    // ==================
    const filtroLinks = document.querySelectorAll(".filtro-link");

    filtroLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();

        filtroLinks.forEach(l => l.classList.remove("ativo"));
        link.classList.add("ativo");

        const filtro = link.dataset.filtro;

        if (filtro === "todos") {
          exibirTodosComTitulos();
        } else {
          exibirFiltro(filtro);
        }
      });
    });

    // ==================
    // EXIBE AO CARREGAR
    // ==================
    exibirTodosComTitulos();
  }
});

// ==============================
// FUNÇÕES AUXILIARES
// ==============================
function silenciarVideo(video) {
  video.pause();
  video.currentTime = 0;
  video.muted = true;

  const wrapper = video.closest(".video-wrapper");
  if (wrapper) {
    const overlay = wrapper.querySelector(".play-overlay");
    if (overlay) overlay.style.display = "block";
    const muteIcon = wrapper.querySelector(".botao-controle.mute i");
    if (muteIcon) {
      muteIcon.classList.remove("fa-volume-up");
      muteIcon.classList.add("fa-volume-mute");
    }
  }
}

function destacarBotaoAtivo(botao) {
  document.querySelectorAll('.link-botao').forEach(btn => btn.classList.remove('ativo'));
  if (botao) botao.classList.add('ativo');
}

// ==============================
// CONTROLES DE VÍDEO PERSONALIZADOS
// ==============================
function configurarVideoClick() {
  document.querySelectorAll(".video-wrapper").forEach(wrapper => {
    const video = wrapper.querySelector("video");
    const playOverlay = wrapper.querySelector(".play-overlay");
    const muteBtn = wrapper.querySelector(".botao-controle.mute");

    wrapper.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playOverlay.style.display = "none";
      } else {
        video.pause();
        playOverlay.style.display = "block";
      }
    });

    muteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      const icon = muteBtn.querySelector("i");
      icon.classList.toggle("fa-volume-up", !video.muted);
      icon.classList.toggle("fa-volume-mute", video.muted);
    });

    video.addEventListener("play", () => {
      playOverlay.style.display = "none";
      document.querySelectorAll(".video-wrapper video").forEach(v => {
        if (v !== video) silenciarVideo(v);
      });
    });

    video.addEventListener("pause", () => {
      playOverlay.style.display = "block";
    });
  });
}

// ==============================
// CARROSSEL DE VÍDEOS E IMAGENS
// ==============================
function configurarCarrossel() {
  document.querySelectorAll('.galeria-wrapper').forEach(wrapper => {
    const carrossel = wrapper.querySelector('.carrossel');
    const slides = Array.from(carrossel.children);
    const btnEsquerda = wrapper.querySelector('.seta.esquerda');
    const btnDireita = wrapper.querySelector('.seta.direita');
    const indicadoresContainer = wrapper.querySelector('.indicadores');

    if (!carrossel || !slides.length || !indicadoresContainer) return;

    let indexAtual = 0;
    let ignorarScrollTemporariamente = false;

    // Criar indicadores
    indicadoresContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === 0) btn.classList.add('ativo');
      btn.addEventListener('click', () => irParaSlide(i));
      indicadoresContainer.appendChild(btn);
    });

    const atualizarIndicadores = () => {
      indicadoresContainer.querySelectorAll('button').forEach((btn, i) => {
        btn.classList.toggle('ativo', i === indexAtual);
      });
      btnEsquerda.style.display = indexAtual === 0 ? 'none' : 'block';
      btnDireita.style.display = indexAtual === slides.length - 1 ? 'none' : 'block';
    };

    const irParaSlide = (i) => {
      indexAtual = i;
      carrossel.scrollTo({ left: i * carrossel.clientWidth, behavior: 'smooth' });
      atualizarIndicadores();
    };

    btnEsquerda.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (indexAtual > 0) irParaSlide(indexAtual - 1);
    });

    btnDireita.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (indexAtual < slides.length - 1) irParaSlide(indexAtual + 1);
    });

    carrossel.addEventListener('scroll', () => {
      if (ignorarScrollTemporariamente) return;

      const scrollLeft = carrossel.scrollLeft;
      const larguraSlide = carrossel.clientWidth;
      const novoIndex = Math.round(scrollLeft / larguraSlide);

      const estaEmFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
      const temModoFullscreen = !!wrapper.querySelector(".modo-fullscreen");
      if (estaEmFullscreen || temModoFullscreen) return;

      if (novoIndex !== indexAtual) {
        indexAtual = novoIndex;
        atualizarIndicadores();
      }

      slides.forEach((slide, i) => {
        const video = slide.querySelector('video');
        if (!video) return;

        const overlay = slide.querySelector(".play-overlay");
        const muteIcon = slide.querySelector(".botao-controle.mute i");

        if (i === indexAtual) {
          video.currentTime = 0;
          video.muted = true;
          video.play().catch(() => { });
          if (overlay) overlay.style.display = "none";
          if (muteIcon) {
            muteIcon.classList.remove("fa-volume-up");
            muteIcon.classList.add("fa-volume-mute");
          }
        } else {
          silenciarVideo(video);
        }
      });
    });

    // Fullscreen
    wrapper.querySelectorAll('.botao-controle.fullscreen').forEach(fullscreenBtn => {
      fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrapper = fullscreenBtn.closest(".video-wrapper");
        const video = wrapper.querySelector("video");
        const icon = fullscreenBtn.querySelector("i");
        const entrouFullscreen = !wrapper.classList.contains("modo-fullscreen");
        wrapper.classList.toggle("modo-fullscreen");
        video.controls = false;
        icon.classList.toggle("fa-expand");
        icon.classList.toggle("fa-compress");

        if (!entrouFullscreen) {
          ignorarScrollTemporariamente = true;
          requestAnimationFrame(() => {
            const index = slides.indexOf(wrapper);
            if (index >= 0) {
              carrossel.scrollTo({ left: index * carrossel.clientWidth, behavior: 'instant' });
              indexAtual = index;
              atualizarIndicadores();
            }
          });
          setTimeout(() => ignorarScrollTemporariamente = false, 100);
        }
      });
    });

    atualizarIndicadores();
  });
}

// ==============================
// CARREGAR CONTEÚDO EXTERNO (HTML)
// ==============================
function carregarConteudo(caminho, botao) {
  const container = document.getElementById("conteudo-dinamico");
  if (!container) return console.error("Div #conteudo-dinamico não encontrada.");

  // Inicia o fade-out
  container.classList.remove("fade-in");
  container.style.opacity = 0;

  // Aguarda a transição de 300ms antes de trocar o conteúdo
  setTimeout(() => {
    fetch(caminho)
      .then(response => {
        if (!response.ok) throw new Error(`Erro ao carregar ${caminho}`);
        return response.text();
      })
      .then(html => {
        container.innerHTML = html;

        configurarVideoClick();
        configurarCarrossel();
        destacarBotaoAtivo(botao);

        // Força reflow para garantir que o fade-in funcione
        void container.offsetWidth;

        // Aplica o fade-in após inserir o conteúdo
        container.classList.add("fade-in");
        container.style.opacity = 1;
      })
      .catch(error => console.error("Erro ao carregar o conteúdo:", error));
  }, 300);
}

// ==============================
// ATIVAR CONTEÚDO PADRÃO NA CARGA
// ==============================
function carregarConteudoInicial(caminho, botao) {
  const container = document.getElementById("conteudo-dinamico");
  if (!container) return console.error("Div #conteudo-dinamico não encontrada.");

  fetch(caminho)
    .then(response => {
      if (!response.ok) throw new Error(`Erro ao carregar ${caminho}`);
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;

      configurarVideoClick();
      configurarCarrossel();
      destacarBotaoAtivo(botao);

      // NÃO aplica fade-in
      container.classList.remove("fade-in");
      container.style.opacity = 1;
    })
    .catch(error => console.error("Erro ao carregar o conteúdo:", error));
}

document.addEventListener('DOMContentLoaded', () => {
  const botao = document.getElementById('botao-shows');
  carregarConteudoInicial('../includes/shows.html', botao);
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