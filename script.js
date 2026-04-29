const form = document.querySelector("#travelForm");
const result = document.querySelector("#submissionResult");
const preferredDate = document.querySelector("#date");
const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll("[data-slide-dot]")];
const prevButton = document.querySelector("[data-slider-prev]");
const nextButton = document.querySelector("[data-slider-next]");
let activeSlide = 0;
let sliderTimer;

if (preferredDate) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  preferredDate.min = today.toISOString().split("T")[0];
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const customer = {
    name: data.get("name")?.toString().trim(),
    phone: data.get("phone")?.toString().trim(),
    city: data.get("city")?.toString().trim(),
    travelers: data.get("travelers")?.toString().trim(),
    date: data.get("date")?.toString().trim(),
    package: data.get("package")?.toString().trim(),
    message: data.get("message")?.toString().trim(),
    submittedAt: new Date().toISOString(),
  };

  const savedResponses = JSON.parse(localStorage.getItem("fekTravelResponses") || "[]");
  savedResponses.push(customer);
  localStorage.setItem("fekTravelResponses", JSON.stringify(savedResponses));

  result.innerHTML = `
    <strong>Thank you, ${escapeHtml(customer.name || "Customer")}!</strong>
    Your response for ${escapeHtml(customer.package || "selected package")} has been submitted.
    Team will contact you on ${escapeHtml(customer.phone || "your mobile number")}.
  `;
  result.classList.add("show");
  form.reset();

  if (preferredDate) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    preferredDate.min = today.toISOString().split("T")[0];
  }
});

if (slides.length) {
  showSlide(0);
  startSlider();

  prevButton?.addEventListener("click", () => {
    showSlide(activeSlide - 1);
    restartSlider();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(activeSlide + 1);
    restartSlider();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideDot));
      restartSlider();
    });
  });
}

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeSlide);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSlide);
  });
}

function startSlider() {
  sliderTimer = window.setInterval(() => {
    showSlide(activeSlide + 1);
  }, 4200);
}

function restartSlider() {
  window.clearInterval(sliderTimer);
  startSlider();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}
