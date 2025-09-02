// Reveal on scroll
function reveal() {
  const reveals = document.querySelectorAll(".reveal");
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 100;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}
window.addEventListener("scroll", reveal);
reveal();

// Carousel
const slides = document.querySelector(".slides");
const images = document.querySelectorAll(".slides img");
let index = 0;

document.querySelector(".next").addEventListener("click", () => {
  index = (index + 1) % images.length;
  slides.style.transform = `translateX(-${index * 100}vw)`;
});

document.querySelector(".prev").addEventListener("click", () => {
  index = (index - 1 + images.length) % images.length;
  slides.style.transform = `translateX(-${index * 100}vw)`;
});

// Reveal on scroll
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  for (let el of reveals) {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const visiblePoint = 100;

    if (elementTop < windowHeight - visiblePoint) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  }
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll); // dispara ao carregar a página também

document.addEventListener("DOMContentLoaded", () => {
  // CARROSSEL
  const slides = document.querySelector(".slides");
  const totalSlides = document.querySelectorAll(".slides img").length;
  let currentIndex = 0;

  function updateSlide() {
    slides.style.transform = `translateX(-${currentIndex * 100}vw)`;
  }

  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlide();
  }, 5000);

  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlide();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlide();
    });
  }

  // MENU RESPONSIVO
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav ul");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
});

window.addEventListener("scroll", revealOnScroll);



