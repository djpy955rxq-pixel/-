const faqItems = document.querySelectorAll('.FAQ__questions-items');

faqItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});
