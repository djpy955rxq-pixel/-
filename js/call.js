// ========== ЛОГИКА ПОПАПА ЗВОНКА ==========

// Элементы модалок звонка
const callModal = document.getElementById('callModal');
const callSuccessModal = document.getElementById('callSuccessModal');
const callClose = document.getElementById('callClose');
const callSuccessClose = document.getElementById('callSuccessClose');
const callSuccessBtn = document.getElementById('callSuccessBtn');
const callForm = document.getElementById('callForm');
const toCallBtn = document.getElementById('toCall');

// Маска для телефона в попапе звонка
const callPhoneInput = document.getElementById('callPhone');
if (callPhoneInput) {
  callPhoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value[0] === '7' || value[0] === '8') {
        value = value.substring(1);
      }
      
      let formatted = '+7 (';
      
      if (value.length > 0) formatted += value.substring(0, 3);
      if (value.length > 3) formatted += ') ' + value.substring(3, 6);
      if (value.length > 6) formatted += '-' + value.substring(6, 8);
      if (value.length > 8) formatted += '-' + value.substring(8, 10);
      
      e.target.value = formatted.substring(0, 18);
    } else {
      e.target.value = '+7 (';
    }
  });
  
  // Устанавливаем начальное значение
  callPhoneInput.value = '+7 (';
  
  // Валидация при потере фокуса
  callPhoneInput.addEventListener('blur', function(e) {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length < 10) {
      showCallError('callPhone', 'Введите корректный номер телефона');
    }
  });
}

// Функции управления модалкой звонка
function openCallModal() {
  callModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = window.innerWidth > document.documentElement.clientWidth ? '15px' : '0';
  
  // Сбрасываем форму
  callForm.reset();
  callPhoneInput.value = '+7 (';
  
  // Фокусируемся на имени
  setTimeout(() => {
    document.getElementById('callName').focus();
  }, 300);
}

function closeCallModal() {
  callModal.classList.remove('active');
  callSuccessModal.classList.remove('active');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

function openCallSuccessModal() {
  closeCallModal();
  callSuccessModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = window.innerWidth > document.documentElement.clientWidth ? '15px' : '0';
}

// Показать ошибку в форме звонка
function showCallError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const parent = field.closest('.callModal__field') || field.closest('.callModal__agree');
  
  if (!parent) return;
  
  const errorEl = document.createElement('div');
  errorEl.className = 'callModal__error';
  errorEl.textContent = message;
  
  // Удаляем старую ошибку
  const oldError = parent.querySelector('.callModal__error');
  if (oldError) oldError.remove();
  
  parent.appendChild(errorEl);
  
  // Подсвечиваем поле
  if (field.tagName === 'INPUT' || field.tagName === 'SELECT') {
    field.style.borderColor = '#ef4444';
    field.style.backgroundColor = '#fff5f5';
  }
  
  // Убираем подсветку через 3 секунды
  setTimeout(() => {
    if (parent.contains(errorEl)) {
      errorEl.remove();
    }
    if (field) {
      field.style.borderColor = '';
      field.style.backgroundColor = '';
    }
  }, 3000);
}

// Обработчик отправки формы звонка
function handleCallSubmit(event) {
  event.preventDefault();
  
  // Собираем данные
  const formData = {
    name: document.getElementById('callName').value.trim(),
    phone: document.getElementById('callPhone').value.trim(),
    time: document.getElementById('callTime').value,
    topic: document.getElementById('callTopic').value,
    agree: document.getElementById('callAgree').checked,
    dateTime: new Date().toISOString()
  };
  
  // Валидация
  if (!formData.name || formData.name.length < 2) {
    showCallError('callName', 'Введите корректное имя');
    return;
  }
  
  const phoneDigits = formData.phone.replace(/\D/g, '');
  if (!formData.phone || phoneDigits.length < 10) {
    showCallError('callPhone', 'Введите корректный номер телефона');
    return;
  }
  
  if (!formData.agree) {
    showCallError('callAgree', 'Необходимо согласие на обработку данных');
    return;
  }
  
  // Показываем загрузку
  const submitBtn = document.getElementById('callSubmit');
  const originalText = submitBtn.querySelector('.callModal__submit-text').textContent;
  submitBtn.querySelector('.callModal__submit-text').textContent = 'Отправка...';
  submitBtn.disabled = true;
  
  // Имитация отправки
  setTimeout(() => {
    // В реальном приложении здесь fetch запрос
    console.log('Заявка на звонок:', formData);
    
    // Аналитика
    if (typeof gtag !== 'undefined') {
      gtag('event', 'call_request', {
        'event_category': 'lead',
        'event_label': formData.topic || 'consultation'
      });
    }
    
    // Сбрасываем кнопку
    submitBtn.querySelector('.callModal__submit-text').textContent = originalText;
    submitBtn.disabled = false;
    
    // Показываем успех
    openCallSuccessModal();
    
    // Закрываем через 3 секунды
    setTimeout(() => {
      closeCallModal();
    }, 3000);
    
  }, 1500);
}

// ========== НАСТРОЙКА СОБЫТИЙ ==========

// Открытие по кнопке в хедере
if (toCallBtn) {
  toCallBtn.addEventListener('click', openCallModal);
}

// Закрытие по оверлею
callModal.addEventListener('click', function(e) {
  if (e.target.classList.contains('callModal__overlay')) {
    closeCallModal();
  }
});

callSuccessModal.addEventListener('click', function(e) {
  if (e.target.classList.contains('callModal__overlay')) {
    closeCallModal();
  }
});

// Закрытие по кнопкам
callClose.addEventListener('click', closeCallModal);
callSuccessClose.addEventListener('click', closeCallModal);
callSuccessBtn.addEventListener('click', closeCallModal);

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (callModal.classList.contains('active') || callSuccessModal.classList.contains('active')) {
      closeCallModal();
    }
  }
});

// Отправка формы
if (callForm) {
  callForm.addEventListener('submit', handleCallSubmit);
}

// Улучшение UX для селектов
document.querySelectorAll('.callModal__time-select, .callModal__topic-select').forEach(selectWrapper => {
  selectWrapper.addEventListener('click', function() {
    const select = this.querySelector('select');
    select.focus();
  });
});