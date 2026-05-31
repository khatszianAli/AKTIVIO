import type { ThreadPost } from "@/lib/types";
import { MOCK_USERS } from "./users";

export const MOCK_THREADS: ThreadPost[] = [
  {
    id: "thread-001",
    author: MOCK_USERS[1],
    content:
      "Только что пробежала Legenda Sprint на Дзержинке 🔥 Вода + фонтан = чистый летний вайб. Кто следующий?",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    category: "sport",
    placeName: "Дзержинка",
    placeCoordinates: { lat: 42.882, lng: 74.612 },
    challengeId: "ch-001",
    reactions: { cringe_legend: 12, summer_vibe: 34, powerful: 28 },
    userReaction: "summer_vibe",
    aiTags: ["#sport", "#dzerzhinka", "#summer", "#legenda"],
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "thread-002",
    author: MOCK_USERS[5],
    content:
      "Нашла топчик в 7-м микрорайоне — лимонад 120 сомов, огромный стакан, Wi-Fi есть. Эже за стойкой самая добрая 🍋",
    category: "social",
    placeName: "7-й микрорайон",
    placeCoordinates: { lat: 42.836, lng: 74.601 },
    reactions: { cringe_legend: 3, summer_vibe: 45, powerful: 8 },
    aiTags: ["#food", "#7micro", "#cheap", "#lemonade"],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "thread-003",
    author: MOCK_USERS[3],
    content:
      "Chalk-art на Магистрали готов! Кринж? Может. Легендарно? 100%. Приходите фоткаться до дождя 🎨",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-609a1276579f?w=400&h=300&fit=crop",
    category: "creative",
    placeName: "Южная Магистраль",
    placeCoordinates: { lat: 42.845, lng: 74.595 },
    challengeId: "ch-002",
    reactions: { cringe_legend: 67, summer_vibe: 22, powerful: 15 },
    userReaction: "cringe_legend",
    aiTags: ["#creative", "#magistral", "#streetart"],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "thread-004",
    author: MOCK_USERS[2],
    content:
      "Восток-5 ночной забег — 4:32 на круг! Bekzat, я тебя догоняю 💪 Кто составит компанию завтра?",
    category: "sport",
    placeName: "Восток-5",
    placeCoordinates: { lat: 42.891, lng: 74.638 },
    reactions: { cringe_legend: 5, summer_vibe: 18, powerful: 41 },
    aiTags: ["#running", "#vostok5", "#nightrun"],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];
