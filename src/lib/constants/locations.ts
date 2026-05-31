import type { Coordinates } from "@/lib/types";

export const BISHKEK_CENTER: Coordinates = {
  lat: 42.8746,
  lng: 74.5698,
};

export interface BishkekLocation {
  id: string;
  name: string;
  nameRu: string;
  coordinates: Coordinates;
  district: "sverdlovsky" | "pervomaisky" | "oktyabrsky" | "leninsky";
  vibe: string;
}

export const BISHKEK_LOCATIONS: BishkekLocation[] = [
  {
    id: "dzerzhinka",
    name: "Dzerzhinka",
    nameRu: "Дзержинка",
    coordinates: { lat: 42.882, lng: 74.612 },
    district: "sverdlovsky",
    vibe: "Самый живой район, тут всегда что-то происходит",
  },
  {
    id: "yuzhnaya-magistral",
    name: "Yuzhnaya Magistral",
    nameRu: "Южная Магистраль",
    coordinates: { lat: 42.845, lng: 74.595 },
    district: "leninsky",
    vibe: "Летний вайб, скейт и лимонад",
  },
  {
    id: "asanbay",
    name: "Asanbay",
    nameRu: "Асанбай",
    coordinates: { lat: 42.823, lng: 74.628 },
    district: "oktyabrsky",
    vibe: "Микрорайон с лучшими кофейнями",
  },
  {
    id: "vostok5",
    name: "Vostok-5",
    nameRu: "Восток-5",
    coordinates: { lat: 42.891, lng: 74.638 },
    district: "pervomaisky",
    vibe: "Парк, фонтаны, вечерние пробежки",
  },
  {
    id: "ala-archa-view",
    name: "Ala-Archa Viewpoint",
    nameRu: "Смотровая Ала-Арча",
    coordinates: { lat: 42.858, lng: 74.545 },
    district: "leninsky",
    vibe: "Горы на горизонте — идеально для фото",
  },
  {
    id: "oak-park",
    name: "Oak Park",
    nameRu: "Дубовый парк",
    coordinates: { lat: 42.877, lng: 74.589 },
    district: "sverdlovsky",
    vibe: "Центр города, скамейки и музыканты",
  },
  {
    id: "7th-micro",
    name: "7th Microdistrict",
    nameRu: "7-й микрорайон",
    coordinates: { lat: 42.836, lng: 74.601 },
    district: "oktyabrsky",
    vibe: "Дешёвый лимонад и скрытые дворы",
  },
  {
    id: "jal",
    name: "Jal",
    nameRu: "Джал",
    coordinates: { lat: 42.865, lng: 74.615 },
    district: "pervomaisky",
    vibe: "Базар, шаурма и настоящий Бишкек",
  },
];

export const MAP_DEFAULT_ZOOM = 13;
