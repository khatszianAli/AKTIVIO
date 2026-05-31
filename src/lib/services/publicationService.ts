import type {
  CreatePublicationInput,
  Mission,
  MissionCategory,
  Publication,
  User,
} from "@/lib/types";
import { BISHKEK_LOCATIONS } from "@/lib/constants/locations";
import { generateId } from "@/lib/utils";

const TAG_KEYWORDS: Record<string, string[]> = {
  sport: ["#sport", "#run", "#fitness", "#legenda"],
  creative: ["#creative", "#art", "#streetart", "#vibe"],
  nature: ["#nature", "#mountains", "#alaarcha", "#park"],
  social: ["#social", "#food", "#coffee", "#friends"],
};

const PLACE_TAGS: Record<string, string> = {
  "Дзержинка": "#dzerzhinka",
  "Южная Магистраль": "#magistral",
  "Асанбай": "#asanbay",
  "Восток-5": "#vostok5",
  "7-й микрорайон": "#7micro",
  "Джал": "#jal",
  "Дубовый парк": "#oakpark",
  "Смотровая Ала-Арча": "#alaarcha",
};

export function generateAiTags(
  content: string,
  category?: MissionCategory,
  placeName?: string
): string[] {
  const tags = new Set<string>(["#bishkek", "#aktivio", "#summer"]);

  if (category && TAG_KEYWORDS[category]) {
    TAG_KEYWORDS[category].slice(0, 2).forEach((t) => tags.add(t));
  }

  if (placeName && PLACE_TAGS[placeName]) {
    tags.add(PLACE_TAGS[placeName]);
  }

  const lower = content.toLowerCase();
  if (lower.includes("лимонад") || lower.includes("lemonade")) tags.add("#lemonade");
  if (lower.includes("шаурма") || lower.includes("shawarma")) tags.add("#food");
  if (lower.includes("tiktok") || lower.includes("тикток")) tags.add("#tiktok");
  if (lower.includes("кринж")) tags.add("#cringelegend");
  if (lower.includes("вайб")) tags.add("#summerVibe");

  return Array.from(tags).slice(0, 6);
}

export function resolvePlaceCoordinates(placeName: string) {
  const loc = BISHKEK_LOCATIONS.find(
    (l) => l.nameRu === placeName || l.name === placeName
  );
  return loc?.coordinates;
}

export function buildPublication(
  author: User,
  input: CreatePublicationInput
): Publication {
  const aiTags = generateAiTags(input.content, input.category, input.placeName);
  const placeCoordinates =
    input.placeCoordinates ??
    (input.placeName ? resolvePlaceCoordinates(input.placeName) : undefined);

  return {
    id: generateId(),
    author,
    content: input.content,
    imageUrl: input.imageUrl,
    videoUrl: input.videoUrl,
    type: input.type ?? "general",
    category: input.category,
    placeName: input.placeName,
    placeCoordinates,
    missionId: input.missionId,
    missionTitle: input.missionTitle,
    xpEarned: input.xpEarned,
    reactions: { cringe_legend: 0, summer_vibe: 0, powerful: 0 },
    aiTags,
    createdAt: new Date().toISOString(),
  };
}

export function buildMissionResultPublication(
  author: User,
  mission: Mission,
  imageUrl: string,
  xpEarned: number
): Publication {
  return buildPublication(author, {
    content: `✅ Миссия выполнена: «${mission.title}» на ${mission.location}! +${xpEarned} XP 🔥`,
    imageUrl,
    type: "mission_result",
    category: mission.category,
    placeName: mission.location,
    missionId: mission.id,
    missionTitle: mission.title,
    xpEarned,
  });
}
