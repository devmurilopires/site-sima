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

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelector(".slides");
  const totalSlides = document.querySelectorAll(".slides img").length;
  let currentIndex = 0;
  setInterval(() => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlide();
}, 5000); // 5000ms = 5 segundos


  function updateSlide() {
    slides.style.transform = `translateX(-${currentIndex * 100}vw)`;
  }

  document.querySelector(".prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlide();
  });

  document.querySelector(".next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlide();
  });
});


window.addEventListener("scroll", revealOnScroll);

// Menu responsivo
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav ul");

  toggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
});

