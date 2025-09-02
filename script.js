// REVEAL ON SCROLL
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
window.addEventListener("load", revealOnScroll);

document.addEventListener("DOMContentLoaded", () => {
  // CARROSSEL
  const slides = document.querySelector(".slides");
  const slideImages = document.querySelectorAll(".slides img");
  const totalSlides = slideImages.length;
  let currentIndex = 0;

  function updateSlide() {
    if (slides) {
      slides.style.transform = `translateX(-${currentIndex * 100}vw)`;
    }
  }

  if (slides && totalSlides > 0) {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlide();
    }, 5000);

    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlide();
      });
    }
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
