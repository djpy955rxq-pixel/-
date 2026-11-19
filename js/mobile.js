const openMenuBtn = document.getElementById('headerOpenMenu');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenuBtn = document.getElementById('closeMobileMenu');
const overlay = mobileMenu.querySelector('.mobile-menu__overlay');

openMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.add('active');
  document.body.classList.add('menu-open');
});

const closeMenu = () => {
  mobileMenu.classList.remove('active');
  document.body.classList.remove('menu-open');
};

closeMenuBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);
