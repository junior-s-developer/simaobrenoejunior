function iniciarSliderShows() {
    const midias = [
        {
            src: '../img/coopcostas1.jpg',
            alt: 'Show da dupla Simão Breno & Júnior durante o evento.',
            titulo: 'Show Simão Breno & Júnior',
            texto: 'Uma apresentação emocionante da dupla trazendo música e animação para todos.'
        },
        {
            src: '../img/coopcostas3.jpg',
            alt: 'Equipe da Cooperativa dos Costas reunida para a confraternização.',
            titulo: 'Família Cooperativa Dos Costas',
            texto: 'Celebrando união e conquistas em mais um momento especial com a comunidade.'
        },
        {
            src: '../img/coopcostas2.jpg',
            alt: 'Vista geral do evento com público, espaço e estacionamento.',
            titulo: 'Vista do Evento',
            texto: 'Um dia de confraternização em Boa Esperança com muita alegria e participação das famílias.'
        }
    ];

    let indiceAtual = 0;
    const midia = document.getElementById("midia-slide");
    const texto = document.getElementById("texto-slide");
    const indicadores = document.getElementById("indicadores-slide");

    function mostrarMidia(index) {
        const atual = midias[index];
        midia.src = atual.src;
        midia.alt = atual.alt;
        texto.innerHTML = `<h3>${atual.titulo}</h3><p>${atual.texto}</p>`;

        document.querySelectorAll("#indicadores-slide button").forEach((btn, i) => {
            btn.classList.toggle("ativo", i === index);
        });
    }

    // Criar indicadores
    indicadores.innerHTML = "";
    midias.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.addEventListener("click", () => {
            indiceAtual = i;
            mostrarMidia(indiceAtual);
        });
        indicadores.appendChild(btn);
    });

    // Eventos de seta
    const anteriorBtn = document.getElementById("anterior");
    const proximoBtn = document.getElementById("proximo");

    if (anteriorBtn && proximoBtn) {
        anteriorBtn.addEventListener("click", () => {
            indiceAtual = (indiceAtual - 1 + midias.length) % midias.length;
            mostrarMidia(indiceAtual);
        });

        proximoBtn.addEventListener("click", () => {
            indiceAtual = (indiceAtual + 1) % midias.length;
            mostrarMidia(indiceAtual);
        });
    }

    mostrarMidia(indiceAtual); // Iniciar com o primeiro slide
}