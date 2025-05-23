/*function handleCaptchaResponse(token) {
  console.log("reCAPTCHA validado com sucesso:", token);
}*/

document.addEventListener("DOMContentLoaded", () => {
  // MENU MOBILE
  const toggleButton = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggleButton && mobileMenu) {
    toggleButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  // SUB-MENU MOBILE
  const sobreLink = document.querySelector('#mobile-menu .dropdown > a');
  const submenu = document.querySelector('#mobile-menu .submenu');

  if (sobreLink && submenu) {
    sobreLink.addEventListener('click', function (e) {
      e.preventDefault(); // impede navegação
      submenu.classList.toggle('open');
    });
  }

  // FADE-IN ao entrar
  document.body.classList.add("fade-in");

  // FADE-OUT ao sair
  let navegando = false;
  document.querySelectorAll("a[href]").forEach(link => {
    const url = link.getAttribute("href");

    if (
      url &&
      !url.startsWith("#") &&
      !url.startsWith("http") &&
      !link.hasAttribute("download") &&
      !link.target // ignora target="_blank"
    ) {
      link.addEventListener("click", function (e) {
        if (navegando) return;
        navegando = true;

        e.preventDefault();
        document.body.classList.remove("fade-in");
        document.body.style.opacity = 0;

        setTimeout(() => {
          window.location.href = this.href;
        }, 300); // tempo do fade-out
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
  document.querySelector('button').addEventListener('click', function () {
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const localInput = document.getElementById('local');
    const dataInput = document.getElementById('data');
    const detalhesInput = document.getElementById('mensagem');

    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const local = localInput.value.trim();
    const data = dataInput.value.trim();
    const detalhes = detalhesInput.value.trim();

    if (!nome) {
      alert('Digite seu nome.');
      nomeInput.focus();
      return;
    }

    if (!telefone) {
      alert('Digite seu telefone.');
      telefoneInput.focus();
      return;
    }

    if (telefone.length !== 15) {
      alert("Digite um número de telefone válido: \nDDD 9XXXX-XXXX.");
      telefoneInput.focus();
      return;
    }

    if (!local) {
      alert('Informe o local do evento.');
      localInput.focus();
      return;
    }

    if (!data) {
      alert('Informe a data do evento.');
      dataInput.focus();
      return;
    }

    const hoje = new Date();
    const dataSelecionada = new Date(data + 'T00:00:00');
    if (dataSelecionada < hoje.setHours(0, 0, 0, 0)) {
      alert('A data do evento não pode ser no passado.');
      dataInput.focus();
      return;
    }

    if (!detalhes) {
      alert('Diga-nos sobre seu evento.');
      detalhesInput.focus();
      return;
    }

    const partesData = data.split('-');
    const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

    const mensagem = `Oi! Aqui é o *${nome}*.

  Entrei em contato pelo site, gostaria de saber sobre a disponibilidade e o orçamento para a realização de um show. Agradeço desde já!

  *Local*: ${local}  
  *Data*: ${dataFormatada}  
  *Telefone*: ${telefone}

  *DETALHES DO EVENTO*:

  ${detalhes}`;

    const mensagemCodificada = encodeURIComponent(mensagem);
    const numeroDestino = '5535984728729';
    const url = `https://wa.me/${numeroDestino}?text=${mensagemCodificada}`;

    window.open(url, '_blank');
  });

  // reCAPTCHA
  
})