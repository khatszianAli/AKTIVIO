import type {
  Mission,
  MissionCategory,
  BudgetTier,
  TimeAvailable,
  District,
} from "@/lib/types";
import { BISHKEK_LOCATIONS } from "@/lib/constants/locations";
import { generateId } from "@/lib/utils";

interface MissionInput {
  location?: string;
  budget: BudgetTier;
  timeMinutes: TimeAvailable;
  category: MissionCategory;
  district?: District;
  interests?: MissionCategory[];
}

export function pickCategoryFromInterests(interests: MissionCategory[]): MissionCategory {
  if (interests.length === 0) return "sport";
  return interests[Math.floor(Math.random() * interests.length)];
}

const MISSION_TEMPLATES: Record<
  MissionCategory,
  Array<(loc: string, budget: BudgetTier, time: TimeAvailable) => Omit<Mission, "id">>
> = {
  sport: [
    (loc, budget, time) => ({
      title: "Legenda Sprint",
      description: `Купи Legenda за ${budget === "free" ? "0" : budget === "low" ? "35" : "50"} KGS, добеги до ближайшего фонтана в ${loc} и сними 15-сек TikTok`,
      category: "sport",
      location: loc,
      district: "sverdlovsky",
      budget,
      timeMinutes: time,
      xpReward: time === 15 ? 80 : time === 30 ? 150 : 220,
      tips: ["Разминка 2 мин обязательна", "Фонтан обычно у центральной аллеи"],
      verificationHint: "На фото должны быть бутылка Legenda и фонтан",
    }),
    (loc, budget, time) => ({
      title: "Топчан Challenge",
      description: `Найди топчан в ${loc}, сделай 20 приседаний и попроси прохожего заснять — ${time} мин на всё`,
      category: "sport",
      location: loc,
      district: "leninsky",
      budget: "free",
      timeMinutes: time,
      xpReward: time === 15 ? 60 : 100,
      tips: ["Топчаны часто во дворах", "Байке на скамейке — лучший оператор"],
      verificationHint: "Видео с приседаниями на фоне двора",
    }),
    (loc, _budget, time) => ({
      title: "Park Run Record",
      description: `Пробеги круг в ${loc} — засеки время в приложении и побей свой рекорд`,
      category: "sport",
      location: loc,
      district: "pervomaisky",
      budget: "free",
      timeMinutes: time,
      xpReward: 120,
      tips: ["Беги утром — меньше жары", "Возьми воду"],
      verificationHint: "Скриншот таймера + фото на финише",
    }),
  ],
  creative: [
    (loc, budget, time) => ({
      title: "Chalk Art Mission",
      description: `Найди стену в ${loc}, нарисуй chalk-art с #AktivioBishkek — бюджет до ${budget === "low" ? "100" : "200"} KGS на мелки`,
      category: "creative",
      location: loc,
      district: "leninsky",
      budget,
      timeMinutes: time,
      xpReward: 130,
      tips: ["Мелки продают в Globus", "Выбирай стену не на солнцепёке"],
      verificationHint: "Фото готового рисунка",
    }),
    (loc, _budget, time) => ({
      title: "Vibe Photo Hunt",
      description: `Сделай 3 креативных фото ${loc} в стиле «летний Бишкек» — используй необычные ракурсы`,
      category: "creative",
      location: loc,
      district: "oktyabrsky",
      budget: "free",
      timeMinutes: time,
      xpReward: 90,
      tips: ["Золотой час — после 18:00", "Снимай отражения в лужах после дождя"],
      verificationHint: "Коллаж из 3 фото",
    }),
  ],
  nature: [
    (loc, _budget, time) => ({
      title: "Mountain View Quest",
      description: `Поднимись на смотровую в ${loc}, сфоткай горы и запиши voice-note о летнем плане (30 сек)`,
      category: "nature",
      location: loc,
      district: "leninsky",
      budget: "free",
      timeMinutes: time,
      xpReward: 200,
      tips: ["Берите ветровку — наверху ветрено", "Лучший свет утром"],
      verificationHint: "Фото с горами на фоне",
    }),
    (loc, budget, time) => ({
      title: "Tree Hugger",
      description: `Найди самое старое дерево в ${loc}, обними его (да, серьёзно) и расскажи его «историю» в Threads`,
      category: "nature",
      location: loc,
      district: "sverdlovsky",
      budget,
      timeMinutes: time,
      xpReward: 70,
      tips: ["Дубовый парк — топ для этого", "Не стесняйся — все делают"],
      verificationHint: "Фото объятий дерева",
    }),
  ],
  social: [
    (loc, budget, time) => ({
      title: "Coffee Connection",
      description: `Найди кофейню в ${loc} (до ${budget === "low" ? "150" : "300"} KGS), закажи айс-латте и познакомься с кем-то за соседним столом`,
      category: "social",
      location: loc,
      district: "oktyabrsky",
      budget,
      timeMinutes: time,
      xpReward: 180,
      tips: ["Асанбай — много кофеен", "Спроси «можно присесть?» — все friendly"],
      verificationHint: "Selfie с новым знакомым (с согласия!)",
    }),
    (loc, budget, time) => ({
      title: "Shaурма Review",
      description: `Попробуй шаурму в ${loc} (до ${budget === "low" ? "200" : "350"} KGS), оцени и напиши отзыв в Threads`,
      category: "social",
      location: loc,
      district: "pervomaisky",
      budget,
      timeMinutes: time,
      xpReward: 90,
      tips: ["Джал — лучшие точки", "Добавь соус — не жалей"],
      verificationHint: "Фото шаурмы + текст отзыва",
    }),
  ],
};

export function generateMission(input: MissionInput): Mission {
  const location =
    input.location ??
    BISHKEK_LOCATIONS[Math.floor(Math.random() * BISHKEK_LOCATIONS.length)].nameRu;

  const templates = MISSION_TEMPLATES[input.category];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const base = template(location, input.budget, input.timeMinutes);

  const locData = BISHKEK_LOCATIONS.find(
    (l) => l.nameRu === location || l.name === location
  );

  return {
    id: generateId(),
    ...base,
    district: input.district ?? locData?.district ?? base.district,
    location: locData?.nameRu ?? location,
  };
}

export async function generateMissionAsync(
  input: MissionInput
): Promise<Mission> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return generateMission(input);
}
