// Barra de progresso de leitura
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("scrollProgress").style.width = scrolled + "%";
    
    // Mostrar/Esconder botão voltar ao topo
    const btnTop = document.getElementById("backToTop");
    if (winScroll > 300) {
        btnTop.classList.add("visible");
    } else {
        btnTop.classList.remove("visible");
    }
};

// Menu Mobile
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});