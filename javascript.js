document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    toggleButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });
});

// ENVIAR MENSAGEM //

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

