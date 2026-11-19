const servicesData = {

    general: {
      title: "Генеральная уборка квартир в Пензе",
      description: "Глубокая уборка для полного обновления пространства. Подходит, если давно не убирались или нужен идеальный порядок.",
      list: [
        "Мытьё полов, плинтусов и стен",
        "Очистка кухни и санузла",
        "Удаление пыли со всех поверхностей",
        "Мытьё зеркал и стеклянных поверхностей",
        "Уборка труднодоступных мест"
      ],
      price: "от 200 ₽ (кв/м)",
      link: "generalnaya-uborka-penza.html"
    },
  
    flat: {
      title: "Уборка квартир в Пензе",
      description: "Быстрая и аккуратная уборка квартиры любого размера. Поддержим чистоту и уют без лишних хлопот.",
      list: [
        "Пылесосим и моем полы",
        "Протираем поверхности и мебель",
        "Уборка кухни и ванной комнаты",
        "Вынос мусора"
      ],
      price: "от 150 ₽ (кв/м)",
      link: "uborka-kvartir-penza.html"
    },
  
    house: {
      title: "Уборка домов и коттеджей в Пензе",
      description: "Комплексная уборка частных домов и коттеджей. Работаем с большими площадями и любыми покрытиями.",
      list: [
        "Уборка всех жилых помещений",
        "Мытьё полов, лестниц и перил",
        "Очистка кухни и санузлов",
        "Удаление пыли и загрязнений"
      ],
      price: "от 160 ₽ (кв/м)",
      link: "uborka-domov-penza.html"
    },
  
    afterRepair: {
      title: "Уборка после ремонта в Пензе",
      description: "Удаляем строительную пыль, следы краски и мусор. Подготовим помещение к комфортному проживанию.",
      list: [
        "Удаление строительной пыли",
        "Мытьё окон, рам и подоконников",
        "Очистка плитки, швов и поверхностей",
        "Вынос мелкого строительного мусора"
      ],
      price: "от 220 ₽ (кв/м)",
      link: "uborka-posle-remonta-penza.html"
    },
  
    regular: {
      title: "Поддерживающая уборка в Пензе",
      description: "Регулярная уборка для поддержания чистоты. Отличный вариант для занятых людей.",
      list: [
        "Мытьё полов и поверхностей",
        "Уборка кухни и санузла",
        "Удаление пыли",
        "Поддержание общего порядка"
      ],
      price: "от 120 ₽ (кв/м)",
      link: "podderzhivayushchaya-uborka-penza.html"
    },
    moveInOut : {
        title: "Уборка перед заселением и после съезда в Пензе",
        description: "Подготовим квартиру к заезду или приведём её в порядок после съезда жильцов. Убираем быстро и тщательно.",
        list: [
          "Полная уборка всех помещений",
          "Мытьё полов, плинтусов и поверхностей",
          "Очистка кухни и санузла",
          "Удаление следов проживания и запахов",
          "Подготовка квартиры к сдаче или заселению"
        ],
        price: "от 190 ₽ (кв/м)",
        link: "uborka-pered-zaseleniem-penza.html"
      }
  
  };
  
  const modal = document.getElementById("serviceModal");
  const title = modal.querySelector(".modal__title");
  const description = modal.querySelector(".modal__description");
  const list = modal.querySelector(".modal__list");
  const price = modal.querySelector(".modal__price");
  const serviceLink = modal.querySelector(".modal__btn--secondary");
  
  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const service = servicesData[btn.dataset.service];
  
      title.textContent = service.title;
      description.textContent = service.description;
      price.textContent = service.price;
      serviceLink.href = service.link;
  
      list.innerHTML = "";
      service.list.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
  
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
  
  modal.querySelector(".modal__close").onclick = closeModal;
  modal.querySelector(".modal__overlay").onclick = closeModal;
  
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

const serviceModal = document.getElementById('serviceModal');
const orderPopup = document.getElementById('orderServicesPopup');

const openOrderBtn = serviceModal.querySelector('.modal__btn--primary');

openOrderBtn.addEventListener('click', (e) => {
  e.preventDefault();

  // передаём название услуги
  popupServiceName.textContent = serviceTitle.textContent;

  // закрываем serviceModal
  serviceModal.classList.remove('active');

  // открываем popup
  orderPopup.classList.add('show');

  // overflow оставляем заблокированным
  document.body.style.overflow = 'hidden';
});
const popupServiceName = document.getElementById('popupServiceName');
const serviceTitle = serviceModal.querySelector('.modal__title');