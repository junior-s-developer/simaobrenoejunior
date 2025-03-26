document.addEventListener("DOMContentLoaded", () => {
    
    // MENU MOBILE
    const toggleButton = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
        });
    }

    // FADE-IN ao entrar
    document.body.classList.add("fade-in");

    // FADE-OUT ao sair
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
                e.preventDefault();
                document.body.classList.remove("fade-in");
                document.body.style.opacity = 0;

                setTimeout(() => {
                    window.location.href = this.href;
                }, 300); // tempo do fade-out (mesmo do CSS)
            });
        }
    });

    // BOTÃO VOLTAR AO TOPO
    const backToTopButton = document.getElementById('voltar-topo');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ENVIAR WHATSAPP (fora do DOMContentLoaded porque pode ser chamado de botão)
function enviarWhatsApp() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const local = document.getElementById('local').value;
    const data = document.getElementById('data').value;
    const detalhes = document.getElementById('detalhes').value;

    const numeroDestino = "5535984368959";

    const mensagem = `Olá, meu nome é *${nome}*. Gostaria de agendar um show.
📍 Local: *${local}*  
📅 Data: *${data}*  
📞 Telefone: *${telefone}*  
📝 Detalhes: *${detalhes}*`;

    const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}
