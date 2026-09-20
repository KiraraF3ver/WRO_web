/* STORE PAGE logic — auto-cycling slider. */

let currentSlide = 0;
const totalSlides = 3;
let autoTimer;

function updateSlider() {
  document.querySelectorAll('.slide').forEach((el, i) => el.classList.toggle('active', i === currentSlide));
  document.querySelectorAll('.dot').forEach((el, i) => el.classList.toggle('active', i === currentSlide));
}

function goToSlide(i) {
  currentSlide = i;
  updateSlider();
  resetAutoTimer();
}

function changeSlide(dir) {
  currentSlide = (currentSlide + dir + totalSlides) % totalSlides;
  updateSlider();
  resetAutoTimer();
}

function resetAutoTimer() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => changeSlide(1), 4000);
}

function toggleMenu() {
  document.getElementById('menu-dropdown').classList.toggle('open');
}

// close the dropdown if the user taps anywhere outside it
document.addEventListener('click', (e) => {
  const wrap = document.querySelector('.menu-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('menu-dropdown').classList.remove('open');
  }
});

resetAutoTimer();
