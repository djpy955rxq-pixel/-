const steps = [
  {
    question: "Какой тип уборки вам нужен?",
    options: [
      { label: "Генеральная уборка", value: "general" },
      { label: "Уборка домов и коттеджей", value: "house" },
      { label: "Поддерживающая уборка", value: "regular" },
      { label: "Уборка после ремонта", value: "afterRepair" },
      { label: "Уборка квартир", value: "flat" },
      { label: "Уборка перед заселением / после съезда", value: "move" }
    ]
  },
  { question: "Какая площадь помещения?", input: "area" },
  { question: "Сколько санузлов?", input: "bathrooms" },
  { question: "Сколько окон нужно помыть?", input: "windows" },
  {
    question: "Дополнительные услуги",
    options: [
      { label: "Генеральная уборка кухни", value: "kitchenDeep" },
      { label: "Глубокая уборка ванной и санузла", value: "bathroomDeep" },
      { label: "Уборка внутри шкафов и кухонных ящиков", value: "cabinets" },
      { label: "Мытьё холодильника и бытовой техники", value: "appliances" },
      { label: "Удаление шерсти домашних животных", value: "petHair" }
    ],
    multiple: true
  },
  {
    question: "Дополнительные условия",
    options: [
      { label: "Сильные загрязнения", value: "hard" },
      { label: "Срочно (24 часа)", value: "urgent" }
    ],
    multiple: true
  }
];
const extraServiceLabels = {
  kitchenDeep: "Генеральная уборка кухни",
  bathroomDeep: "Глубокая уборка ванной и санузла",
  cabinets: "Уборка внутри шкафов и ящиков",
  appliances: "Мытьё холодильника и техники",
  petHair: "Удаление шерсти животных"
};

const basePrices = {
  general: 200,
  house: 160,
  regular: 120,
  afterRepair: 220,
  flat: 150,
  move: 190
};
const extraServicesPrices = {
  kitchenDeep: 1200,
  bathroomDeep: 1200,
  cabinets: 1000,
  appliances: 900,
  petHair: 800
};
const typeLabels = {
  general: "Генеральная уборка",
  house: "Уборка домов и коттеджей",
  regular: "Поддерживающая уборка",
  afterRepair: "Уборка после ремонта",
  flat: "Уборка квартир",
  move: "Уборка перед заселением / после съезда"
};

const hints = {
  0: "Тип уборки влияет на объём работ и итоговую стоимость.",
  1: "Если не знаете точную площадь — укажите примерно.",
  2: "Каждый санузел требует отдельной глубокой очистки.",
  3: "Окна считаются отдельно. Можно выбрать «Не нужно».",
  4: "Дополнительные условия могут увеличить стоимость."
};

let step = 0;
let data = {
  type: null,
  area: 50,
  bathrooms: 1,
  windows: 0,
  hard: false,
  urgent: false,

   // доп. услуги
   kitchenDeep: false,
   bathroomDeep: false,
   cabinets: false,
   appliances: false,
   petHair: false,
   extras: []
};

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressBar = document.querySelector(".calc__progress-bar");
const stepEl = document.getElementById("step");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const hintEl = document.getElementById("calcHint");
const livePriceEl = document.getElementById("livePrice");

// Элементы модальных окон
const applicationModal = document.getElementById("applicationModal");
const successModal = document.getElementById("successModal");
const modalClose = document.getElementById("modalClose");
const successClose = document.getElementById("successClose");
const successBtn = document.getElementById("successBtn");
const applicationForm = document.getElementById("applicationForm");
const modalSummary = document.getElementById("modalSummary");

render();
updateLivePrice();


function calculatePrice() {
  if (!data.type || !data.area) return null;

  let price = basePrices[data.type] * data.area;
  price += data.bathrooms * 800;
  price += data.windows * 350;

  if (data.hard) price *= 1.2;
  if (data.urgent) price *= 1.15;
  Object.keys(extraServicesPrices).forEach(key => {
    if (data[key]) {
      price += extraServicesPrices[key];
    }
  });
  return Math.round(price);
}

function updateLivePrice() {
  const price = calculatePrice();
  if (!price) {
    livePriceEl.textContent = "—";
    return;
  }

  livePriceEl.textContent = `${price.toLocaleString()} ₽`;
  livePriceEl.classList.add("animate");

  setTimeout(() => {
    livePriceEl.classList.remove("animate");
  }, 300);
}

function render() {
  // Удаляем ошибку если есть
  const oldError = document.querySelector('.calc__step-error');
  if (oldError) oldError.remove();
  
  progressBar.style.width = ((step + 1) / steps.length) * 100 + "%";
  stepEl.textContent = step + 1;
  answersEl.innerHTML = "";
  questionEl.textContent = steps[step].question;
  hintEl.textContent = hints[step] || "";

  const current = steps[step];

  if (current.options) {
    current.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "calc__answer";
      btn.textContent = opt.label;

      if (current.multiple && data[opt.value]) btn.classList.add("active");
      if (!current.multiple && data.type === opt.value) btn.classList.add("active");

      btn.onclick = () => {
        if (current.multiple) {
          data[opt.value] = !data[opt.value];
          btn.classList.toggle("active");
        } else {
          data.type = opt.value;
          [...answersEl.children].forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        }
        updateLivePrice();
      };

      answersEl.appendChild(btn);
    });
  }

  if (current.input === "area") {
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.gridColumn = "1 / -1";
    
    const value = document.createElement("div");
    value.textContent = `${data.area} м²`;
    value.style.fontSize = "22px";
    value.style.marginBottom = "15px";
    value.style.textAlign = "center";
    value.style.fontWeight = "600";
    value.style.color = "#111";

    const range = document.createElement("input");
    range.type = "range";
    range.min = 20;
    range.max = 200;
    range.step = 1;
    range.value = data.area;
    range.className = "calc__range";

    range.oninput = e => {
      data.area = +e.target.value;
      value.textContent = `${data.area} м²`;
      updateLivePrice();
    };

    container.append(value, range);
    answersEl.appendChild(container);
  }

  if (current.input === "bathrooms") {
    [1, 2, 3, 4].forEach(num => {
      const btn = document.createElement("button");
      btn.className = "calc__answer";
      btn.textContent = num;
      if (data.bathrooms === num) btn.classList.add("active");

      btn.onclick = () => {
        data.bathrooms = num;
        [...answersEl.children].forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        updateLivePrice();
      };

      answersEl.appendChild(btn);
    });
  }

  if (current.input === "windows") {

    const setActive = (btn) => {
      [...answersEl.children].forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
  
    // ❌ Не нужно
    const noneBtn = document.createElement("button");
    noneBtn.className = "calc__answer";
    noneBtn.textContent = "Не нужно";
  
    if (data.windows === 0) noneBtn.classList.add("active");
  
    noneBtn.onclick = () => {
      data.windows = 0;
      setActive(noneBtn);
      updateLivePrice();
    };
  
    answersEl.appendChild(noneBtn);
  
    // 1–4 окна
    [1, 2, 3, 4].forEach(num => {
      const btn = document.createElement("button");
      btn.className = "calc__answer";
      btn.textContent = num;
  
      if (data.windows === num) btn.classList.add("active");
  
      btn.onclick = () => {
        data.windows = num;
        setActive(btn);
        updateLivePrice();
      };
  
      answersEl.appendChild(btn);
    });
  
    // ➕ Больше
    const moreBtn = document.createElement("button");
    moreBtn.className = "calc__answer";
    moreBtn.textContent = "Больше";
  
    moreBtn.onclick = () => {
      answersEl.innerHTML = "";
    
      let count = data.windows >= 5 ? data.windows : 5;
    
      const wrap = document.createElement("div");
      wrap.className = "calc__window-change";
    
      const value = document.createElement("div");
      value.className = "calc__windows-value";
    
      const controls = document.createElement("div");
      controls.className = "calc__windows-controls";
    
      const minus = document.createElement("button");
      minus.textContent = "−";
    
      const plus = document.createElement("button");
      plus.textContent = "+";
    
      const update = () => {
        value.textContent = `${count} окон`;
        data.windows = count;
        updateLivePrice();
      };
    
      minus.onclick = () => {
        if (count > 5) {
          count--;
          update();
        }
      };
    
      plus.onclick = () => {
        count++;
        update();
      };
    
      update();
    
      controls.append(minus, plus);
      wrap.append(value, controls);
      answersEl.appendChild(wrap);
    };
    
  
    answersEl.appendChild(moreBtn);
  }
  
  
  

  nextBtn.textContent = step === steps.length - 1 ? "Рассчитать" : "Далее";
  prevBtn.disabled = step === 0;
}

function validateStep() {
  const currentStep = steps[step];
  
  // Валидация для выбора типа уборки
  if (step === 0 && !data.type) {
    showStepError("Пожалуйста, выберите тип уборки");
    return false;
  }
  
  return true;
}

function showStepError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'calc__step-error';
  errorEl.textContent = message;
  errorEl.style.cssText = `
    color: #ff4444;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    padding: 12px;
    background: #fff0f0;
    border-radius: 10px;
    border: 1px solid #ffcccc;
    animation: fadeIn 0.3s ease;
    grid-column: 1 / -1;
    font-weight: 500;
  `;
  
  // Удаляем старую ошибку если есть
  const oldError = document.querySelector('.calc__step-error');
  if (oldError) oldError.remove();
  
  // Добавляем новую ошибку
  answersEl.appendChild(errorEl);
  
  // Автоудаление через 4 секунды
  setTimeout(() => {
    if (errorEl.parentNode) {
      errorEl.style.opacity = '0';
      errorEl.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        if (errorEl.parentNode) errorEl.remove();
      }, 300);
    }
  }, 4000);
}

nextBtn.onclick = () => {
  // Валидация текущего шага
  if (!validateStep()) {
    return;
  }
  
  if (step === steps.length - 1) {
    showResult();
  } else {
    step++;
    render();
  }
};

prevBtn.onclick = () => {
  step--;
  render();
};

function showResult() {
  const price = calculatePrice();
  hintEl.style.display = "none";
  document.querySelector(".calc__live-price").style.display = "none";

  questionEl.textContent = "";
  answersEl.innerHTML = `
  <div class="calc__final">
    
    <div class="calc__final-price">
      <span>Ваша цена</span>
      <strong>${price.toLocaleString()} ₽</strong>
    </div>

    <ul class="calc__final-benefits">
      <li>✔ Цена зафиксирована</li>
      <li>✔ Без скрытых доплат</li>
      <li>✔ Выезд в удобное время</li>
    </ul>

    <button class="calc__cta" id="openApplication">
      Оставить заявку и зафиксировать цену
    </button>

    <p class="calc__final-note">
      Менеджер свяжется с вами в течение 10 минут
    </p>

    <button class="calc__recalc">
      Пересчитать
    </button>

  </div>
`;

  nextBtn.style.display = "none";
  prevBtn.style.display = "none";

  document.querySelector(".calc__recalc").onclick = resetCalc;
  
  // Добавляем обработчик для кнопки заявки
  document.getElementById("openApplication").onclick = openApplicationModal;
}

function resetCalc() {
  step = 0;
  data = {
    type: null,
    area: 50,
    bathrooms: 1,
    windows: 0,
    hard: false,
    urgent: false
  };

  // Возвращаем UI
  hintEl.style.display = "block";
  document.querySelector(".calc__live-price").style.display = "block";

  nextBtn.style.display = "inline-block";
  prevBtn.style.display = "inline-block";

  render();
  updateLivePrice();
}

// ========== ЛОГИКА ЗАЯВКИ ==========

function openApplicationModal() {
  const price = calculatePrice();
  // Формируем сводку заказа
  let summaryHTML = '';

    // Составляем массив выбранных доп. услуг
  const selectedExtras = [];

  Object.keys(extraServiceLabels).forEach(key => {
    if (data[key]) {
      selectedExtras.push(extraServiceLabels[key]);
    }
  });
  
  // Тип уборки
  if (data.type && typeLabels[data.type]) {
    summaryHTML += `
      <div class="caclModal__summary-item">
        <span class="caclModal__summary-label">Тип уборки:</span>
        <span class="caclModal__summary-value">${typeLabels[data.type]}</span>
      </div>
    `;
  }
  
  // Площадь
  summaryHTML += `
    <div class="caclModal__summary-item">
      <span class="caclModal__summary-label">Площадь:</span>
      <span class="caclModal__summary-value">${data.area} м²</span>
    </div>
  `;
  
  // Санузлы
  summaryHTML += `
    <div class="caclModal__summary-item">
      <span class="caclModal__summary-label">Санузлы:</span>
      <span class="caclModal__summary-value">${data.bathrooms} шт</span>
    </div>
  `;
  
  // Окна
  summaryHTML += `
    <div class="caclModal__summary-item">
      <span class="caclModal__summary-label">Окна:</span>
      <span class="caclModal__summary-value">${data.windows === 0 ? 'Не нужно' : data.windows + ' шт'}</span>
    </div>
  `;
  
  // Дополнительные условия
  const extras = [];
  if (data.hard) extras.push("Сильные загрязнения");
  if (data.urgent) extras.push("Срочно (24 часа)");
  
  if (extras.length > 0) {
    summaryHTML += `
      <div class="caclModal__summary-item">
        <span class="caclModal__summary-label">Дополнительно:</span>
        <span class="caclModal__summary-value">${extras.join(', ')}</span>
      </div>
    `;
  }

  summaryHTML += `
  <div class="caclModal__summary-item">
    <span class="caclModal__summary-label">
      Выбранные дополнительные услуги:
    </span>
    <span class="caclModal__summary-value">
      ${
        selectedExtras.length
          ? selectedExtras.join(", ")
          : "Не выбраны"
      }
    </span>
  </div>
`;

  
  // Итоговая цена
  summaryHTML += `
    <div class="caclModal__summary-price">
      Итоговая стоимость: ${price.toLocaleString()} ₽
    </div>
  `;
  modalSummary.innerHTML = summaryHTML;


  // Вставляем сводку в модалку
  
  // Открываем модалку
  applicationModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Сбрасываем форму
  applicationForm.reset();
}

// Функция закрытия модалки
function closeModal() {
  applicationModal.classList.remove('active');
  successModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Функция открытия окна успеха
function openSuccessModal() {
  closeModal();
  successModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Обработчик отправки формы
function handleSubmit(event) {
  event.preventDefault();
  
  // Получаем данные формы
  const formData = {
    name: document.getElementById('modalName').value.trim(),
    phone: document.getElementById('modalPhone').value.trim(),
    comment: document.getElementById('modalComment').value.trim(),
    orderData: {
      type: data.type,
      typeLabel: typeLabels[data.type] || data.type,
      area: data.area,
      bathrooms: data.bathrooms,
      windows: data.windows,
      extras: {
        hard: data.hard,
        urgent: data.urgent
      },
      price: calculatePrice(),
      dateTime: new Date().toISOString()
    }
  };
  
  // Валидация
  if (!formData.name || formData.name.length < 2) {
    showModalError("modalName", "Введите корректное имя");
    return;
  }
  
  if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
    showModalError("modalPhone", "Введите корректный номер телефона");
    return;
  }
  
  // Показываем кнопку загрузки
  const submitBtn = document.getElementById('modalSubmit');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Отправка...';
  submitBtn.disabled = true;
  
  // Имитация отправки на сервер
  setTimeout(() => {
    // В реальном приложении здесь был бы fetch запрос
    console.log('Данные заявки отправлены:', formData);
    
    // Можно отправить в Google Analytics или Яндекс.Метрику
    if (typeof gtag !== 'undefined') {
      gtag('event', 'application_submit', {
        'event_category': 'calculator',
        'event_label': formData.orderData.typeLabel,
        'value': formData.orderData.price
      });
    }
    
    // Сбрасываем форму
    applicationForm.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Показываем окно успеха
    openSuccessModal();
    
    // Сбрасываем калькулятор через 2 секунды
    setTimeout(() => {
      closeModal();
      resetCalc();
    }, 2000);
    
  }, 1500);
}

// Показать ошибку в модалке
function showModalError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.createElement('div');
  errorEl.className = 'caclModal__error';
  errorEl.textContent = message;
  errorEl.style.cssText = `
    color: #ff4444;
    font-size: 13px;
    margin-top: 5px;
    padding: 6px 10px;
    background: #fff0f0;
    border-radius: 6px;
    border-left: 3px solid #ff4444;
  `;
  
  // Удаляем старую ошибку если есть
  const oldError = field.parentNode.querySelector('.caclModal__error');
  if (oldError) oldError.remove();
  
  field.parentNode.appendChild(errorEl);
  
  // Подсвечиваем поле
  field.style.borderColor = '#ff4444';
  field.style.backgroundColor = '#fffafa';
  
  // Убираем подсветку через 3 секунды
  setTimeout(() => {
    if (field.parentNode) {
      field.style.borderColor = '#e5e7eb';
      field.style.backgroundColor = '#fcfcfc';
      if (errorEl.parentNode) errorEl.remove();
    }
  }, 3000);
}

// ========== НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ ==========

// Закрытие по клику на оверлей
applicationModal.addEventListener('click', function(e) {
  if (e.target.classList.contains('caclModal__overlay')) {
    closeModal();
  }
});

successModal.addEventListener('click', function(e) {
  if (e.target.classList.contains('caclModal__overlay')) {
    closeModal();
  }
});

// Закрытие по кнопке
modalClose.addEventListener('click', closeModal);
successClose.addEventListener('click', closeModal);
successBtn.addEventListener('click', closeModal);

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Отправка формы
applicationForm.addEventListener('submit', handleSubmit);

// Маска для телефона
const phoneInput = document.getElementById('modalPhone');
if (phoneInput) {
  phoneInput.addEventListener('input', function(e) {
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
    }
  });
  
  // Валидация при потере фокуса
  phoneInput.addEventListener('blur', function(e) {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length < 10 && value.length > 0) {
      showModalError('modalPhone', 'Введите не менее 10 цифр');
    }
  });
}

// Валидация имени
const nameInput = document.getElementById('modalName');
if (nameInput) {
  nameInput.addEventListener('blur', function(e) {
    const value = e.target.value.trim();
    if (value.length === 1) {
      showModalError('modalName', 'Имя слишком короткое');
    }
  });
}

// Добавляем анимацию для кнопки заявки
document.addEventListener('DOMContentLoaded', function() {
  const ctaBtn = document.querySelector('.calc__cta');
  if (ctaBtn) {
    ctaBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    ctaBtn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  }
});

// Анимация для появления ошибок
if (!document.querySelector('#calcErrorStyles')) {
  const style = document.createElement('style');
  style.id = 'calcErrorStyles';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .calc__step-error {
      animation: fadeIn 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);
}

// Инициализация маски телефона при загрузке
if (phoneInput && !phoneInput.value) {
  phoneInput.value = '+7 (';
}

console.log('Калькулятор уборки инициализирован');