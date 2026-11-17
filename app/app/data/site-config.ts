export type Service = { name: string; price: string; time: string; icon: string; description?: string };
export type LeadStatus = "Новая" | "Связались" | "Подтверждена";
export type Lead = {
  id: number;
  name: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  status: LeadStatus;
  createdAt: string;
};
export type BusinessSettings = {
  name: string;
  city: string;
  district: string;
  /**
   * Населённый пункт в нужном для текста падеже. Не склеиваем «в {city}»,
   * иначе получается «в Москва». Пустое значение — фраза просто не выводится.
   */
  cityIn: string;
  phone: string;
  address: string;
  hours: string;
  messengerPhone: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  /** Публикуемый текст согласия. Пустое значение — чекбокс скрыт. */
  consentText: string;
  /** Как добраться: ориентир, въезд, парковка. Показывается только если заполнено. */
  directions: string;
  /** Ссылка на карточку организации на карте. Пусто — ведём на поиск по адресу. */
  mapUrl: string;
};

/** Русские названия месяцев в родительном падеже для подписи даты. */
const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/**
 * Календарная дата в формате ISO (YYYY-MM-DD) со сдвигом от сегодняшнего дня.
 * Считается при каждом рендере, чтобы демо не «устарело».
 */
export function isoDateIn(daysFromToday: number, today = new Date()): string {
  const date = new Date(today.getTime());
  date.setDate(date.getDate() + daysFromToday);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Человеческий формат даты: «14 сентября» или полная дата, если год другой. */
export function formatPreferredDate(iso: string, today = new Date()): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  const label = `${Number(day)} ${MONTHS_GENITIVE[Number(month) - 1] ?? ""}`.trim();
  return Number(year) === today.getFullYear() ? label : `${label} ${year}`;
}

/** Прогресс обработки заявки для кабинета владельца. */
export const LEAD_STATUS_FLOW: LeadStatus[] = ["Новая", "Связались", "Подтверждена"];

export const businessDefaults: BusinessSettings = {
  name: "WEO Detailing",
  city: "",
  district: "",
  cityIn: "",
  phone: "",
  address: "",
  hours: "",
  messengerPhone: "",
  heroImage: "",
  heroTitle: "Машина снова своя.",
  heroSubtitle:
    "Мойка, химчистка салона и полировка кузова. Перед работой осмотрим автомобиль, согласуем объём и цену.",
  consentText: "Я согласен на обработку персональных данных для связи по заявке.",
  directions: "",
  mapUrl: "",
};

export const serviceDefaults: Service[] = [
  {
    name: "Комплексная мойка",
    price: "от 3 500 ₽",
    time: "2 часа",
    icon: "",
    description: "Кузов, стёкла, коврики и диски.",
  },
  {
    name: "Химчистка салона",
    price: "от 12 000 ₽",
    time: "1 день",
    icon: "",
    description: "Текстиль, кожа и потолок. Покажите пятна заранее — скажем, что не отмоется.",
  },
  {
    name: "Полировка кузова",
    price: "от 8 900 ₽",
    time: "6 часов",
    icon: "",
    description: "Убираем паутинку и мелкие царапины. Перед работой замеряем толщину ЛКП.",
  },
  {
    name: "Защитное покрытие",
    price: "от 15 000 ₽",
    time: "1 день",
    icon: "",
    description: "Водоотталкивающий слой на кузов, держится несколько месяцев.",
  },
];

export const businessBenefits = [
  "Итоговую стоимость называем до начала работ",
  "Дополнительную услугу не добавляем без вашего согласия",
  "Показываем результат при выдаче автомобиля",
];

/** Ответы на вопросы, которые чаще всего задают по телефону. */
export const faqItems = [
  {
    question: "Сколько ждать очереди?",
    answer:
      "Заявка с сайта — не подтверждённая запись. Владелец позвонит и предложит свободное время: обычно это ближайшие дни, на химчистку и полировку — в течение недели.",
  },
  {
    question: "Можно ли оставить машину на день?",
    answer:
      "Да. Химчистка и полировка занимают целый день. Вы привозите автомобиль утром и забираете в согласованное время.",
  },
  {
    question: "Что значит цена «от»?",
    answer:
      "Она зависит от размера автомобиля и степени загрязнения. Точную сумму назовём после осмотра, до начала работ, и не изменим по ходу.",
  },
];

/**
 * Отзывы намеренно пусты: выдуманные отзывы выдавать за реальные нельзя.
 * Блок появится, когда у студии будут настоящие отзывы с согласием авторов.
 */
export type Review = { name: string; service: string; text: string };
export const demoReviews: Review[] = [];

export const demoLeads: Lead[] = [];

export const leadTimeOptions = ["Утро, 09:00–12:00", "После обеда, 12:00–17:00", "Вечер, 17:00–21:00", "Время не важно"];
