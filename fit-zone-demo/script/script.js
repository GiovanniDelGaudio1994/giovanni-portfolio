// Nascondi il preloader quando la pagina è completamente caricata
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
});

// Carousel automatico
const carousel = document.querySelector('.carousel');
const images = carousel ? carousel.querySelectorAll('img') : [];
let currentIndex = 0;

function showImage(index) {
  images.forEach((img, i) => {
    img.style.transform = `translateX(-${index * 100}%)`;
  });
}

function startCarousel() {
  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }, 4000);
}

if (images.length > 0) {
  showImage(0);
  startCarousel();
}

// Animazione di visibilità per le sezioni
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  section.classList.add('hidden');
  observer.observe(section);
});

// Gestione del menu hamburger
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.hero nav ul');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('show');
});

// Chiudere il menu quando si clicca fuori
document.addEventListener('click', (event) => {
  if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('show');
  }
});
