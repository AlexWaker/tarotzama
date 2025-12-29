export type TarotSuit = "Major" | "Wands" | "Cups" | "Swords" | "Pentacles";

// 新的塔罗牌结构：项目内统一使用这一套
export type TarotCard = {
  id: number;
  name: string;
  suit: TarotSuit;
  keywords: string[];
  description: string;
};

export const DECK_SIZE = 78 as const;

export const TAROT_DECK: readonly TarotCard[] = [
  // --- Major Arcana (0-21) ---
  { id: 0, name: "The Fool", suit: "Major", keywords: ["New beginnings", "Innocence", "Spontaneity"], description: "A leap of faith into the unknown." },
  { id: 1, name: "The Magician", suit: "Major", keywords: ["Manifestation", "Resourcefulness", "Power"], description: "You have all the tools you need." },
  { id: 2, name: "The High Priestess", suit: "Major", keywords: ["Intuition", "Unconscious", "Inner voice"], description: "Trust your gut feeling." },
  { id: 3, name: "The Empress", suit: "Major", keywords: ["Fertility", "Femininity", "Beauty", "Nature"], description: "Abundance and nurturing energy." },
  { id: 4, name: "The Emperor", suit: "Major", keywords: ["Authority", "Structure", "Control"], description: "Stability through discipline." },
  { id: 5, name: "The Hierophant", suit: "Major", keywords: ["Spiritual wisdom", "Religious beliefs", "Tradition"], description: "Conformity to social rules or spiritual path." },
  { id: 6, name: "The Lovers", suit: "Major", keywords: ["Love", "Harmony", "Relationships", "Values"], description: "A significant union or choice." },
  { id: 7, name: "The Chariot", suit: "Major", keywords: ["Control", "Willpower", "Success", "Action"], description: "Victory through focus and determination." },
  { id: 8, name: "Strength", suit: "Major", keywords: ["Strength", "Courage", "Persuasion", "Influence"], description: "Inner strength and compassion." },
  { id: 9, name: "The Hermit", suit: "Major", keywords: ["Soul-searching", "Introspection", "Being alone"], description: "Looking inward for answers." },
  { id: 10, name: "Wheel of Fortune", suit: "Major", keywords: ["Good luck", "Karma", "Life cycles", "Destiny"], description: "The turning point of fate." },
  { id: 11, name: "Justice", suit: "Major", keywords: ["Justice", "Fairness", "Truth", "Law"], description: "Cause and effect; truth revealed." },
  { id: 12, name: "The Hanged Man", suit: "Major", keywords: ["Pause", "Surrender", "Letting go", "New perspective"], description: "Sacrifice for greater understanding." },
  { id: 13, name: "Death", suit: "Major", keywords: ["Endings", "Change", "Transformation", "Transition"], description: "The end of a cycle, making way for new." },
  { id: 14, name: "Temperance", suit: "Major", keywords: ["Balance", "Moderation", "Patience", "Purpose"], description: "Finding the middle path." },
  { id: 15, name: "The Devil", suit: "Major", keywords: ["Shadow self", "Attachment", "Addiction", "Restriction"], description: "Bondage to material desires." },
  { id: 16, name: "The Tower", suit: "Major", keywords: ["Sudden change", "Upheaval", "Chaos", "Revelation"], description: "Destruction of false structures." },
  { id: 17, name: "The Star", suit: "Major", keywords: ["Hope", "Faith", "Purpose", "Renewal"], description: "A light in the darkness." },
  { id: 18, name: "The Moon", suit: "Major", keywords: ["Illusion", "Fear", "Anxiety", "Subconscious"], description: "Things are not what they seem." },
  { id: 19, name: "The Sun", suit: "Major", keywords: ["Positivity", "Fun", "Warmth", "Success"], description: "Joy and vitality." },
  { id: 20, name: "Judgement", suit: "Major", keywords: ["Judgement", "Rebirth", "Inner calling", "Absolution"], description: "A moment of awakening." },
  { id: 21, name: "The World", suit: "Major", keywords: ["Completion", "Integration", "Accomplishment", "Travel"], description: "A cycle completed successfully." },

  // --- Wands (22-35) ---
  { id: 22, name: "Ace of Wands", suit: "Wands", keywords: ["Inspiration", "New opportunities", "Growth"], description: "A spark of creative energy." },
  { id: 23, name: "Two of Wands", suit: "Wands", keywords: ["Future planning", "Progress", "Decisions"], description: "Planning your next step." },
  { id: 24, name: "Three of Wands", suit: "Wands", keywords: ["Expansion", "Foresight", "Overseas"], description: "Looking ahead to expansion." },
  { id: 25, name: "Four of Wands", suit: "Wands", keywords: ["Celebration", "Joy", "Harmony", "Homecoming"], description: "A time of celebration." },
  { id: 26, name: "Five of Wands", suit: "Wands", keywords: ["Conflict", "Disagreement", "Competition"], description: "Struggle and competition." },
  { id: 27, name: "Six of Wands", suit: "Wands", keywords: ["Success", "Public recognition", "Confidence"], description: "Victory and acclaim." },
  { id: 28, name: "Seven of Wands", suit: "Wands", keywords: ["Challenge", "Competition", "Protection"], description: "Defending your position." },
  { id: 29, name: "Eight of Wands", suit: "Wands", keywords: ["Movement", "Fast paced change", "Action"], description: "Swift action and news." },
  { id: 30, name: "Nine of Wands", suit: "Wands", keywords: ["Resilience", "Courage", "Persistence"], description: "Close to the finish line, but weary." },
  { id: 31, name: "Ten of Wands", suit: "Wands", keywords: ["Burden", "Extra responsibility", "Hard work"], description: "Carrying a heavy load." },
  { id: 32, name: "Page of Wands", suit: "Wands", keywords: ["Exploration", "Enthusiasm", "Discovery"], description: "A messenger of inspiration and new ideas." },
  { id: 33, name: "Knight of Wands", suit: "Wands", keywords: ["Action", "Adventure", "Impulsiveness"], description: "Bold movement fueled by passion." },
  { id: 34, name: "Queen of Wands", suit: "Wands", keywords: ["Confidence", "Warmth", "Determination"], description: "Magnetic confidence and creative leadership." },
  { id: 35, name: "King of Wands", suit: "Wands", keywords: ["Vision", "Leadership", "Entrepreneurship"], description: "A master of passion and long-range vision." },

  // --- Cups (36-49) ---
  { id: 36, name: "Ace of Cups", suit: "Cups", keywords: ["Love", "New feelings", "Compassion"], description: "New emotional beginnings." },
  { id: 37, name: "Two of Cups", suit: "Cups", keywords: ["Unified love", "Partnership", "Attraction"], description: "A deep connection." },
  { id: 38, name: "Three of Cups", suit: "Cups", keywords: ["Celebration", "Friendship", "Creativity"], description: "Joy with friends." },
  { id: 39, name: "Four of Cups", suit: "Cups", keywords: ["Meditation", "Contemplation", "Apathy"], description: "Missing opportunities due to introspection." },
  { id: 40, name: "Five of Cups", suit: "Cups", keywords: ["Loss", "Grief", "Self-pity"], description: "Crying over spilled milk." },
  { id: 41, name: "Six of Cups", suit: "Cups", keywords: ["Revisiting the past", "Childhood memories", "Innocence"], description: "Nostalgia and simple joys." },
  { id: 42, name: "Seven of Cups", suit: "Cups", keywords: ["Opportunities", "Choices", "Wishful thinking"], description: "Many options, potential confusion." },
  { id: 43, name: "Eight of Cups", suit: "Cups", keywords: ["Walking away", "Disillusionment", "Leaving behind"], description: "Seeking something higher." },
  { id: 44, name: "Nine of Cups", suit: "Cups", keywords: ["Contentment", "Satisfaction", "Gratitude"], description: "The wish card; emotional fulfillment." },
  { id: 45, name: "Ten of Cups", suit: "Cups", keywords: ["Divine love", "Blissful relationships", "Harmony"], description: "Perfect family happiness." },
  { id: 46, name: "Page of Cups", suit: "Cups", keywords: ["Creative opportunities", "Intuitive messages", "Curiosity"], description: "A message of love or creativity." },
  { id: 47, name: "Knight of Cups", suit: "Cups", keywords: ["Romance", "Charm", "Imagination"], description: "An invitation led by the heart." },
  { id: 48, name: "Queen of Cups", suit: "Cups", keywords: ["Compassion", "Calm", "Emotional security"], description: "Deep empathy and emotional wisdom." },
  { id: 49, name: "King of Cups", suit: "Cups", keywords: ["Balance", "Diplomacy", "Emotional control"], description: "Stable leadership through emotional maturity." },

  // --- Swords (50-63) ---
  { id: 50, name: "Ace of Swords", suit: "Swords", keywords: ["Breakthroughs", "New ideas", "Mental clarity"], description: "A new idea or truth." },
  { id: 51, name: "Two of Swords", suit: "Swords", keywords: ["Difficult choices", "Indecision", "Stalemate"], description: "Blocked vision; a need to decide." },
  { id: 52, name: "Three of Swords", suit: "Swords", keywords: ["Heartbreak", "Emotional pain", "Sorrow"], description: "Painful separation or grief." },
  { id: 53, name: "Four of Swords", suit: "Swords", keywords: ["Rest", "Relaxation", "Meditation", "Recuperation"], description: "Time to heal and recover." },
  { id: 54, name: "Five of Swords", suit: "Swords", keywords: ["Conflict", "Disagreement", "Competition"], description: "Winning at all costs." },
  { id: 55, name: "Six of Swords", suit: "Swords", keywords: ["Transition", "Change", "Rite of passage"], description: "Moving to calmer waters." },
  { id: 56, name: "Seven of Swords", suit: "Swords", keywords: ["Betrayal", "Deception", "Strategy"], description: "Stealth and strategy." },
  { id: 57, name: "Eight of Swords", suit: "Swords", keywords: ["Imprisonment", "Entrapment", "Self-limiting beliefs"], description: "Trapped by your own thoughts." },
  { id: 58, name: "Nine of Swords", suit: "Swords", keywords: ["Anxiety", "Worry", "Fear"], description: "Nightmares and mental anguish." },
  { id: 59, name: "Ten of Swords", suit: "Swords", keywords: ["Painful endings", "Betrayal", "Loss"], description: "Rock bottom; nowhere to go but up." },
  { id: 60, name: "Page of Swords", suit: "Swords", keywords: ["Curiosity", "Ideas", "Vigilance"], description: "Mental energy and curiosity." },
  { id: 61, name: "Knight of Swords", suit: "Swords", keywords: ["Ambition", "Action", "Directness"], description: "Swift pursuit of a goal." },
  { id: 62, name: "Queen of Swords", suit: "Swords", keywords: ["Independence", "Perception", "Clear communication"], description: "Truthful insight and sharp boundaries." },
  { id: 63, name: "King of Swords", suit: "Swords", keywords: ["Intellect", "Authority", "Logic"], description: "Leadership guided by reason and fairness." },

  // --- Pentacles (64-77) ---
  { id: 64, name: "Ace of Pentacles", suit: "Pentacles", keywords: ["Opportunity", "Prosperity", "New venture"], description: "A new financial or material opportunity." },
  { id: 65, name: "Two of Pentacles", suit: "Pentacles", keywords: ["Multiple priorities", "Time management", "Adaptability"], description: "Juggling resources." },
  { id: 66, name: "Three of Pentacles", suit: "Pentacles", keywords: ["Teamwork", "Collaboration", "Learning"], description: "Building together." },
  { id: 67, name: "Four of Pentacles", suit: "Pentacles", keywords: ["Saving money", "Security", "Scarcity", "Control"], description: "Holding on too tight." },
  { id: 68, name: "Five of Pentacles", suit: "Pentacles", keywords: ["Financial loss", "Hardship", "Isolation"], description: "Hardship and insecurity." },
  { id: 69, name: "Six of Pentacles", suit: "Pentacles", keywords: ["Giving", "Receiving", "Sharing wealth"], description: "Charity and generosity." },
  { id: 70, name: "Seven of Pentacles", suit: "Pentacles", keywords: ["Long-term view", "Sustainable results", "Perseverance"], description: "Waiting for the harvest." },
  { id: 71, name: "Eight of Pentacles", suit: "Pentacles", keywords: ["Apprenticeship", "Practice", "Mastery"], description: "Hard work and craftsmanship." },
  { id: 72, name: "Nine of Pentacles", suit: "Pentacles", keywords: ["Abundance", "Luxury", "Self-sufficiency"], description: "Enjoying the fruits of labor." },
  { id: 73, name: "Ten of Pentacles", suit: "Pentacles", keywords: ["Wealth", "Legacy", "Long-term success"], description: "Legacy and lasting wealth." },
  { id: 74, name: "Page of Pentacles", suit: "Pentacles", keywords: ["Manifestation", "Opportunity", "Skill development"], description: "A message of opportunity." },
  { id: 75, name: "Knight of Pentacles", suit: "Pentacles", keywords: ["Hard work", "Productivity", "Routine"], description: "Slow and steady progress." },
  { id: 76, name: "Queen of Pentacles", suit: "Pentacles", keywords: ["Nurturing", "Practical", "Providing"], description: "Practicality and comfort." },
  { id: 77, name: "King of Pentacles", suit: "Pentacles", keywords: ["Wealth", "Business", "Leadership"], description: "Master of the material realm." },
] as const;

const deckById = new Map<number, TarotCard>(TAROT_DECK.map(card => [card.id, card]));

// 启动时校验：确保新牌库覆盖 0..77，且无重复/越界
(() => {
  const seen = new Set<number>();
  for (const card of TAROT_DECK) {
    if (card.id < 0 || card.id >= DECK_SIZE) {
      throw new Error(`[tarotCards] Invalid card id=${card.id} (expected 0..${DECK_SIZE - 1}).`);
    }
    if (seen.has(card.id)) {
      throw new Error(`[tarotCards] Duplicate card id=${card.id}.`);
    }
    seen.add(card.id);
  }
  const missing: number[] = [];
  for (let i = 0; i < DECK_SIZE; i++) {
    if (!seen.has(i)) missing.push(i);
  }
  if (missing.length) {
    throw new Error(`[tarotCards] Missing card ids: ${missing.join(", ")}`);
  }
})();

const clampCardId = (id: number) => {
  if (Number.isNaN(id)) return 0;
  if (id < 0) return 0;
  if (id >= DECK_SIZE) return DECK_SIZE - 1;
  return id;
};

export const getTarotCard = (rawId: number): TarotCard => {
  const id = clampCardId(rawId);
  return deckById.get(id)!;
};

export const spreadLabels: Record<
  number,
  {
    title: string;
    subtitle: string;
    cards: number;
  }
> = {
  0: { title: "单牌直觉", subtitle: "当下的神谕讯号", cards: 1 },
  1: { title: "三线流动", subtitle: "过去 / 现在 / 未来", cards: 3 },
  2: { title: "五芒圣印", subtitle: "元素均衡与进化路径", cards: 5 },
};

export const formatSpreadTitle = (spreadType: number) => {
  const preset = spreadLabels[spreadType];
  if (!preset) return "未知牌阵";
  return `${preset.title}（${preset.cards}张）`;
};

