document.addEventListener('DOMContentLoaded', () => {
const popup = document.getElementById('orderServicesPopup');
const popupServiceName = document.getElementById('popupServiceName');
const popupClose = popup.querySelector('.orderServicesPopup__close');
const popupForm = popup.querySelector('.orderServicesPopup__form');

const orderButtons = document.querySelectorAll('.services__card-main-btn.done');

orderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.services__card-main');
    const serviceTitle = card.querySelector('.services__card-main-title').textContent;
    
    // Обновляем название услуги в попапе
    popupServiceName.textContent = serviceTitle;
    
    // Показываем попап
    popup.classList.add('show');
    
    // Блокируем скролл на странице
    document.body.style.overflow = 'hidden';
    
    // Фокусируемся на первом поле формы
    setTimeout(() => {
      popupForm.querySelector('input').focus();
    }, 300);
  });
});

// Закрытие попапа
function closePopup() {
  popup.classList.remove('show');
  document.body.style.overflow = '';
}

popupClose.addEventListener('click', closePopup);
popup.querySelector('.orderServicesPopup__overlay').addEventListener('click', closePopup);

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popup.classList.contains('show')) {
    closePopup();
  }
});

// Обработка отправки формы
popupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const submitBtn = popupForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Имитация отправки
  submitBtn.textContent = 'Отправка...';
  submitBtn.disabled = true;
  
  // Здесь будет реальный AJAX запрос
  setTimeout(() => {
    alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    closePopup();
  }, 1500);
});
});