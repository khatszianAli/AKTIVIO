import type {
  AdvisorContext,
  AdvisorResponse,
  Challenge,
  LiveActivity,
  Publication,
  User,
} from "@/lib/types";
import { DISTRICTS } from "@/lib/constants/districts";
import { CATEGORIES } from "@/lib/constants/categories";
import { BISHKEK_LOCATIONS } from "@/lib/constants/locations";
import { formatTimeAgo, generateId } from "@/lib/utils";

const LOCATION_ALIASES: Record<string, string> = {
  магистрал: "Южная Магистраль",
  magistral: "Южная Магистраль",
  асанбай: "Асанбай",
  asanbay: "Асанбай",
  дзержинк: "Дзержинка",
  dzerzhinka: "Дзержинка",
  "7 микро": "7-й микрорайон",
  "7-м": "7-й микрорайон",
  "7й": "7-й микрорайон",
  восток: "Восток-5",
  джал: "Джал",
  дубов: "Дубовый парк",
  ала: "Смотровая Ала-Арча",
};

export function buildAdvisorContext(
  user: User,
  publications: Publication[],
  challenges: Challenge[],
  liveActivities: LiveActivity[],
  publicationLimit = 5
): AdvisorContext {
  const liveChallenges = challenges.filter((c) => c.isLive);
  const recentPublications = [...publications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, publicationLimit);

  return {
    user,
    recentPublications,
    liveChallenges,
    liveActivities,
  };
}

export function buildOpenAISystemPrompt(context: AdvisorContext): string {
  const district = DISTRICTS[context.user.district];
  const interests = context.user.interests
    .map((i) => CATEGORIES[i].labelRu)
    .join(", ");

  const pubsBlock = context.recentPublications
    .map(
      (p) =>
        `- [${formatTimeAgo(p.createdAt)}] @${p.author.username} (${p.placeName ?? "без места"}): "${p.content.slice(0, 120)}..."`
    )
    .join("\n");

  const mapBlock = [
    ...context.liveChallenges.map(
      (c) =>
        `- LIVE CHALLENGE: "${c.title}" @ ${c.locationName} (${c.participants}/${c.maxParticipants} чел, +${c.xpReward} XP, ${CATEGORIES[c.category].labelRu})`
    ),
    ...context.liveActivities.map(
      (a) =>
        `- LIVE TEAM: "${a.title}" @ ${a.locationName} (${a.participants.length}/${a.maxParticipants} чел, ${CATEGORIES[a.category].labelRu})`
    ),
  ].join("\n");

  return `You are "Салкын" — AI context advisor for Aktivio, a real-life multiplayer game in Bishkek, Kyrgyzstan.
Speak in casual Russian/Kyrgyz youth slang (байке, эже, вайб, гоу, топчик, кринж but legendary).
Always ground answers in the LIVE DATA below — never invent events not listed.

USER PROFILE:
- Name: ${context.user.displayName} (@${context.user.username})
- District: ${district.nameRu} ${district.emoji}
- Interests: ${interests || "не указаны"}
- Level ${context.user.level}, ${context.user.xp} XP, streak ${context.user.streak}

RECENT PUBLICATIONS (Публикации):
${pubsBlock || "(нет постов)"}

ACTIVE MAP EVENTS (City Radar):
${mapBlock || "(нет live-событий)"}

BISHKEK LOCATIONS: ${BISHKEK_LOCATIONS.map((l) => l.nameRu).join(", ")}

Rules:
1. Cross-reference publications + map when user asks "куда пойти", "скучно", etc.
2. Suggest concrete next steps with place names from data.
3. Keep replies under 3 short paragraphs, mobile-friendly.
4. Mention XP rewards when recommending live challenges.`;
}

function detectLocation(message: string): string | null {
  const lower = message.toLowerCase();
  for (const [alias, canonical] of Object.entries(LOCATION_ALIASES)) {
    if (lower.includes(alias)) return canonical;
  }
  for (const loc of BISHKEK_LOCATIONS) {
    if (lower.includes(loc.nameRu.toLowerCase()) || lower.includes(loc.name.toLowerCase())) {
      return loc.nameRu;
    }
  }
  return null;
}

function detectIntent(message: string): "bored" | "food" | "sport" | "social" | "general" {
  const lower = message.toLowerCase();
  if (/скучн|скуча|нечего|куда пой|куда ид|чем зан/.test(lower)) return "bored";
  if (/еда|куш|шаурм|латте|кофе|лимонад|топчик|дешёв|дешев/.test(lower)) return "food";
  if (/спорт|бег|баскет|футбол|скейт|пробеж/.test(lower)) return "sport";
  if (/люди|компан|знаком|встрет/.test(lower)) return "social";
  return "general";
}

function getEventsAtLocation(context: AdvisorContext, location: string) {
  const challenges = context.liveChallenges.filter((c) => c.locationName === location);
  const activities = context.liveActivities.filter((a) => a.locationName === location);
  return { challenges, activities };
}

function getPublicationsAbout(context: AdvisorContext, location?: string) {
  if (location) {
    return context.recentPublications.filter(
      (p) => p.placeName === location || p.content.toLowerCase().includes(location.toLowerCase())
    );
  }
  return context.recentPublications;
}

function formatPublicationHint(pub: Publication): string {
  const ago = formatTimeAgo(pub.createdAt);
  const place = pub.placeName ? ` в ${pub.placeName}` : "";
  const snippet = pub.content.length > 80 ? `${pub.content.slice(0, 80)}...` : pub.content;
  return `${ago} в Публикациях @${pub.author.username}${place}: «${snippet}»`;
}

function formatChallengeHint(c: Challenge): string {
  return `«${c.title}» на ${c.locationName} (${c.participants}/${c.maxParticipants} чел, +${c.xpReward} XP)`;
}

function buildBoredAtLocationReply(context: AdvisorContext, location: string): string {
  const atLocation = getEventsAtLocation(context, location);
  const crowdLevel =
    atLocation.challenges.reduce((s, c) => s + c.participants, 0) +
    atLocation.activities.reduce((s, a) => s + a.participants.length, 0);

  const otherPubs = context.recentPublications.filter((p) => p.placeName && p.placeName !== location);
  const otherChallenges = context.liveChallenges.filter((c) => c.locationName !== location);
  const otherActivities = context.liveActivities.filter((a) => a.locationName !== location);

  let opener = `Окей, ${context.user.displayName.split(" ")[0]}, на ${location} `;
  opener +=
    crowdLevel >= 4
      ? "сейчас реально толпа — скейт, челленджи, народу полно 🔥"
      : crowdLevel > 0
        ? "есть движ, но не критично"
        : "пока спокойно";

  const hints: string[] = [];

  const asanbayPub = otherPubs.find((p) => p.placeName === "Асанбай" || p.content.toLowerCase().includes("асанбай"));
  if (asanbayPub) {
    hints.push(formatPublicationHint(asanbayPub));
  }

  const sevenMicroBasket = otherChallenges.find(
    (c) => c.locationName.includes("7") && c.category === "sport"
  );
  if (sevenMicroBasket) {
    hints.push(`прямо сейчас на карте висит сбор — ${formatChallengeHint(sevenMicroBasket)}`);
  } else {
    const bestChallenge = otherChallenges.sort((a, b) => b.participants - a.participants)[0];
    if (bestChallenge) {
      hints.push(`на карте live: ${formatChallengeHint(bestChallenge)}`);
    }
  }

  const lemonadePub = otherPubs.find(
    (p) => p.content.toLowerCase().includes("лимонад") || p.placeName?.includes("7")
  );
  if (lemonadePub && !hints.some((h) => h.includes(lemonadePub.author.username))) {
    hints.push(formatPublicationHint(lemonadePub));
  }

  const bestActivity = otherActivities[0];
  if (bestActivity && hints.length < 3) {
    hints.push(
      `live-команда «${bestActivity.title}» @ ${bestActivity.locationName} (${bestActivity.participants.length} чел уже там)`
    );
  }

  const district = DISTRICTS[context.user.district];
  const interestHint =
    context.user.interests.length > 0
      ? `Учитываю твои интересы (${context.user.interests.map((i) => CATEGORIES[i].labelRu).join(", ")}) и район ${district.nameRu}. `
      : "";

  const body =
    hints.length > 0
      ? hints.slice(0, 3).join(". ") + "."
      : "Гляну Публикации и карту — пока тихо, но могу накидать миссию в Generator ⚡";

  const closer =
    location.includes("Магистраль") || location.includes("магистрал")
      ? " Гоу туда, а по пути заскочите за айс-латте — на Асанбае как раз топчик 🧊"
      : " Жми Join Activity на карте — не тупи дома, байке!";

  return `${interestHint}${opener}. ${body}${closer}`;
}

function buildInterestBasedReply(context: AdvisorContext): string {
  const primary = context.user.interests[0] ?? "sport";
  const matching = context.liveChallenges.filter((c) => c.category === primary);
  const district = DISTRICTS[context.user.district];

  if (matching.length === 0) {
    const any = context.liveChallenges[0];
    return any
      ? `Салкын на связи! Для ${district.nameRu} советую ${formatChallengeHint(any)} — гоу на карту и Join 🚀`
      : "Пока на радаре тихо — загляни в Mission Generator, накину персональную миссию под твой вайб ⚡";
  }

  const top = matching.sort((a, b) => b.participants - a.participants)[0];
  const pub = context.recentPublications.find((p) => p.category === primary);

  let reply = `Йо, ${context.user.displayName.split(" ")[0]}! Ты любишь ${CATEGORIES[primary].labelRu} — `;
  reply += `топ live сейчас: ${formatChallengeHint(top)}. `;
  if (pub) reply += `Кстати, ${formatPublicationHint(pub)}. `;
  reply += "District War не ждёт — давай XP! 💪";
  return reply;
}

function buildFoodReply(context: AdvisorContext): string {
  const foodPubs = context.recentPublications.filter(
    (p) =>
      /лимонад|шаурм|латте|кофе|топчик|еда|сом/.test(p.content.toLowerCase()) ||
      p.type === "place_tip"
  );

  if (foodPubs.length > 0) {
    const pub = foodPubs[0];
    return `Салкын знает где жрать/пить 🍋 ${formatPublicationHint(pub)}. ${pub.placeName ? `Место: ${pub.placeName}.` : ""} Если бюджет до 150 — айс-латte на Асанбае тоже огонь. Гоу и напиши в Публикации!`;
  }

  const jal = context.liveChallenges.find((c) => c.locationName === "Джал");
  if (jal) {
    return `На карте есть «${jal.title}» на Джале — шаурма + XP, кринж но легендарно 😬🔥 ${formatChallengeHint(jal)}`;
  }

  return "Топчиков в ленте мало — загляни в 7-й микрорайон, там эже с лимонадом 120 сомов, народ хвалит в Публикациях 🍋";
}

function buildSportReply(context: AdvisorContext): string {
  const sportEvents = [
    ...context.liveChallenges.filter((c) => c.category === "sport"),
    ...context.liveActivities.filter((a) => a.category === "sport"),
  ];

  if (sportEvents.length === 0) {
    return "Спорт-live пока спит — попробуй Mission Generator, накину Legenda Sprint или забег 🏃";
  }

  const basket = context.liveChallenges.find((c) =>
    c.title.toLowerCase().includes("баскет")
  );
  if (basket) {
    return `Баскетбол live! ${formatChallengeHint(basket)} — мяч есть, гoу 3 на 3. + потом лимонад в 7-м микро, эже не подведёт 🏀`;
  }

  const c = context.liveChallenges.find((x) => x.category === "sport");
  const a = context.liveActivities.find((x) => x.category === "sport");
  if (c) return `Спорт-радар: ${formatChallengeHint(c)}. Join на карте! ⚽`;
  if (a) return `Live-команда «${a.title}» @ ${a.locationName} — ${a.participants.length} чел уже катают. Подключайся!`;
  return buildInterestBasedReply(context);
}

function generateContextualReply(message: string, context: AdvisorContext): string {
  const location = detectLocation(message);
  const intent = detectIntent(message);

  if (intent === "bored" && location) {
    return buildBoredAtLocationReply(context, location);
  }

  if (intent === "bored") {
    const magistralActivity = context.liveActivities.find((a) =>
      a.locationName.includes("Магистраль")
    );
    if (magistralActivity) {
      return buildBoredAtLocationReply(context, "Южная Магистраль");
    }
    return buildInterestBasedReply(context);
  }

  if (intent === "food") return buildFoodReply(context);
  if (intent === "sport") return buildSportReply(context);

  if (location) {
    const { challenges, activities } = getEventsAtLocation(context, location);
    const pubs = getPublicationsAbout(context, location);
    const parts: string[] = [`По ${location}:`];

    if (activities.length) {
      parts.push(
        `live «${activities[0].title}» (${activities[0].participants.length} чел)`
      );
    }
    if (challenges.length) {
      parts.push(formatChallengeHint(challenges[0]));
    }
    if (pubs.length) {
      parts.push(formatPublicationHint(pubs[0]));
    }
    if (parts.length === 1) {
      parts.push("пока тихо на радаре — могу сгенерить миссию под локацию ⚡");
    }
    return `Салкын 🧊 ${parts.join(". ")}.`;
  }

  if (/привет|салам|йо|hello|hi/.test(message.toLowerCase())) {
    const district = DISTRICTS[context.user.district];
    return `Йо, ${context.user.displayName.split(" ")[0]}! Я Салкын — твой AI-адvisor 🧊 Слежу за Публикациями и картой в ${district.nameRu}. Скучно? Скажи где ты — подкину live-варики с вайбом!`;
  }

  return buildInterestBasedReply(context);
}

export async function queryAdvisor(
  message: string,
  context: AdvisorContext
): Promise<AdvisorResponse> {
  const systemPrompt = buildOpenAISystemPrompt(context);

  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 600));

  const apiKey = process.env.OPENAI_API_KEY ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (apiKey && typeof fetch !== "undefined") {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 350,
          temperature: 0.85,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return { reply, systemPrompt };
        }
      }
    } catch {
      // fall through to mock
    }
  }

  const reply = generateContextualReply(message, context);
  return {
    reply,
    systemPrompt,
    suggestedActions: [
      "Мне скучно, мы на Магистрали, куда пойти?",
      "Где дешёво перекусить?",
      "Что сейчас live на карте?",
    ],
  };
}

export function createWelcomeMessage(context: AdvisorContext): string {
  const district = DISTRICTS[context.user.district];
  const liveCount =
    context.liveChallenges.length + context.liveActivities.length;
  return `Салам! Я Салкын 🧊 Вижу ${liveCount} live-событий на карте и ${context.recentPublications.length} свежих Публикаций. Ты в ${district.nameRu} — спрашивай «куда пойти», «скучно», «где топчик» — отвечу по реальным данным, не фантазиям!`;
}

export function createChatMessage(role: "user" | "assistant", content: string) {
  return {
    id: generateId(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}