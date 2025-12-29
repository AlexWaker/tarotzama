export type TarotCardMeaning = {
  id: number;
  name: string;
  arcana: "major" | "minor";
  suit?: string;
  rank?: string;
  element: string;
  description: string;
  upright: string[];
  reversed: string[];
  affirmation: string;
};

type MajorCardBlueprint = Omit<TarotCardMeaning, "id" | "arcana">;

const MAJOR_ARCANA: MajorCardBlueprint[] = [
  {
    name: "0 愚者 · The Fool",
    element: "风 · 自由",
    description: "跳下未知的悬崖，相信宇宙会为你展开新的旅程。",
    upright: ["冒险", "天真", "直觉行动"],
    reversed: ["犹豫", "鲁莽", "走回头路"],
    affirmation: "我相信当下的召唤，勇敢迈步。",
  },
  {
    name: "I 魔术师 · The Magician",
    element: "水银 · 意志",
    description: "掌控四大元素，把灵感化为现实的开始。",
    upright: ["显化", "专注", "资源整合"],
    reversed: ["错失良机", "分心", "技巧受限"],
    affirmation: "我用意识塑造现实。",
  },
  {
    name: "II 女祭司 · High Priestess",
    element: "水 · 潜意识",
    description: "静守内殿，聆听月亮下的低语与直觉。",
    upright: ["神秘", "直觉", "沉潜"],
    reversed: ["隐瞒", "压抑", "情绪失衡"],
    affirmation: "我信任灵魂的答案。",
  },
  {
    name: "III 皇后 · Empress",
    element: "地 · 生长",
    description: "丰饶的花园提醒你滋养自己与作品。",
    upright: ["丰盛", "创造", "母性"],
    reversed: ["匮乏感", "自我忽略", "依赖"],
    affirmation: "我值得被滋养，也滋养他人。",
  },
  {
    name: "IV 皇帝 · Emperor",
    element: "火 · 结构",
    description: "秩序与策略让灵感落地，建立长久的王国。",
    upright: ["领导", "规则", "安全感"],
    reversed: ["控制欲", "僵化", "无力感"],
    affirmation: "我以稳固的根基托起愿景。",
  },
  {
    name: "V 教皇 · Hierophant",
    element: "土 · 传统",
    description: "走进神殿，借由仪式、导师与群体寻求指引。",
    upright: ["传承", "学习", "契约"],
    reversed: ["质疑权威", "打破旧制", "内在导师"],
    affirmation: "我让智慧代代流动。",
  },
  {
    name: "VI 恋人 · Lovers",
    element: "风 · 选择",
    description: "在欲望与价值之间找到与你灵魂契合的道路。",
    upright: ["亲密", "一致性", "心与心的盟约"],
    reversed: ["失衡", "不确定", "价值冲突"],
    affirmation: "我以真心做出与灵魂一致的决定。",
  },
  {
    name: "VII 战车 · Chariot",
    element: "水 · 意志",
    description: "驾驭黑白狮身兽，凭决心穿越摇摆的情绪。",
    upright: ["胜利", "掌控", "自律"],
    reversed: ["方向感迷失", "强压情绪", "停滞"],
    affirmation: "我让意志成为前行的动力。",
  },
  {
    name: "VIII 力量 · Strength",
    element: "火 · 驯服",
    description: "温柔的手掌抚过狮子的鬃毛，勇气来自爱。",
    upright: ["勇敢", "耐心", "柔中带刚"],
    reversed: ["焦虑", "压抑", "自信动摇"],
    affirmation: "我温柔且坚定地拥抱力量。",
  },
  {
    name: "IX 隐士 · Hermit",
    element: "土 · 洞察",
    description: "提灯独行，用寂静照亮需要被看见的真相。",
    upright: ["自省", "指引", "独处的智慧"],
    reversed: ["孤立", "迟疑", "拒绝倾听"],
    affirmation: "我允许自己停下，以便听见灵魂。",
  },
  {
    name: "X 命运之轮 · Wheel of Fortune",
    element: "火 · 轮转",
    description: "轮盘再度转动，生命的章节进入下一个循环。",
    upright: ["机遇", "周期", "福至心灵"],
    reversed: ["抗拒改变", "重复课题", "偶然失序"],
    affirmation: "我欢迎变化带来的启程。",
  },
  {
    name: "XI 正义 · Justice",
    element: "风 · 平衡",
    description: "手握利剑与公平天平，回到因果与责任。",
    upright: ["真相", "秩序", "公平抉择"],
    reversed: ["偏见", "不公", "逃避面对"],
    affirmation: "我对自己的选择负责。",
  },
  {
    name: "XII 倒吊人 · Hanged Man",
    element: "水 · 牺牲",
    description: "倒悬树上，让时间暂停，借由逆位换得洞见。",
    upright: ["放下", "暂停", "换角度"],
    reversed: ["停滞太久", "逃避奉献", "牺牲不平衡"],
    affirmation: "我愿意静止，直到真相浮现。",
  },
  {
    name: "XIII 死神 · Death",
    element: "水 · 转化",
    description: "霜冻的田野等待新芽，对旧故事说再见。",
    upright: ["结尾", "蜕变", "释放"],
    reversed: ["迟疑", "抗拒结束", "内耗"],
    affirmation: "我信任终结带来重生。",
  },
  {
    name: "XIV 节制 · Temperance",
    element: "火水交融",
    description: "天使倾倒金杯，调和对立元素找到平衡。",
    upright: ["节奏", "疗愈", "整合"],
    reversed: ["失衡", "过度", "缺乏耐心"],
    affirmation: "我在呼吸间调和阴阳。",
  },
  {
    name: "XV 恶魔 · Devil",
    element: "土 · 束缚",
    description: "看见锁链其实松弛，欲望可以被觉察与超越。",
    upright: ["欲望", "契约", "诱惑"],
    reversed: ["觉醒", "解链", "善用欲望"],
    affirmation: "我承认阴影，并选择释放它。",
  },
  {
    name: "XVI 高塔 · Tower",
    element: "火 · 闪电",
    description: "突然的闪电击碎旧塔，真理在瓦砾中重建。",
    upright: ["突变", "真相", "清算"],
    reversed: ["延迟崩塌", "拒绝放手", "温和调整"],
    affirmation: "我让虚假的墙倒下。",
  },
  {
    name: "XVII 星星 · Star",
    element: "风 · 希望",
    description: "夜空下引流的活水，提醒你永恒的信念。",
    upright: ["灵感", "疗愈", "指引"],
    reversed: ["怀疑", "灵感匮乏", "需要滋养"],
    affirmation: "我是一颗会发光的星。",
  },
  {
    name: "XVIII 月亮 · Moon",
    element: "水 · 潜影",
    description: "月光引出潜意识，梦境里的狼嚎是讯息。",
    upright: ["直觉", "梦境", "未知"],
    reversed: ["误判", "迷雾", "情绪失控"],
    affirmation: "我温柔地穿越未知。",
  },
  {
    name: "XIX 太阳 · Sun",
    element: "火 · 喜悦",
    description: "赤子在向日葵田奔跑，庆祝生命的盛放。",
    upright: ["成功", "喜悦", "清晰"],
    reversed: ["乐观不足", "骄傲自满", "能量暂缓"],
    affirmation: "我散发耀眼且真实的光。",
  },
  {
    name: "XX 审判 · Judgement",
    element: "火 · 唤醒",
    description: "号角响起，灵魂在迷雾中再次苏醒。",
    upright: ["觉醒", "召回", "复苏"],
    reversed: ["犹豫", "旧伤呼唤", "迟迟未答"],
    affirmation: "我回应灵魂的召唤。",
  },
  {
    name: "XXI 世界 · World",
    element: "土 · 完成",
    description: "舞者在花环中旋转，旅程圆满又准备重来。",
    upright: ["整合", "成就", "圆满"],
    reversed: ["未竟之事", "过度完美", "循环未闭"],
    affirmation: "我携带全部经验迈向新篇章。",
  },
];

type SuitKey = "wands" | "cups" | "swords" | "pentacles";

const SUITS: Record<
  SuitKey,
  {
    zh: string;
    element: string;
    theme: string;
    upright: string[];
    reversed: string[];
    mantra: string;
    summary: string;
  }
> = {
  wands: {
    zh: "权杖",
    element: "火",
    theme: "热情 / 行动",
    upright: ["热忱", "冒险"],
    reversed: ["冲动", "分散"],
    mantra: "我的火焰照亮前路",
    summary: "关于灵感、事业与自我驱动力",
  },
  cups: {
    zh: "圣杯",
    element: "水",
    theme: "情感 / 关系",
    upright: ["共鸣", "疗愈"],
    reversed: ["情绪阻塞", "依赖"],
    mantra: "我的心流畅通无阻",
    summary: "关于情感、直觉与亲密",
  },
  swords: {
    zh: "宝剑",
    element: "风",
    theme: "思想 / 真相",
    upright: ["清晰", "沟通"],
    reversed: ["焦虑", "言语伤人"],
    mantra: "我的思绪如剑般锐利",
    summary: "关于决策、沟通与信念",
  },
  pentacles: {
    zh: "钱币",
    element: "土",
    theme: "物质 / 实务",
    upright: ["扎根", "稳定"],
    reversed: ["物欲", "拖延"],
    mantra: "我的根系稳稳扎进大地",
    summary: "关于资源、身体与现实结构",
  },
};

type RankBlueprint = {
  label: string;
  zh: string;
  summary: string;
  upright: string[];
  reversed: string[];
  mantra: string;
};

const RANKS: RankBlueprint[] = [
  {
    label: "Ace",
    zh: "王牌",
    summary: "崭新火花、灵感萌芽",
    upright: ["新开始", "灵感乍现"],
    reversed: ["延迟", "方向迷茫"],
    mantra: "我欢迎新火苗。",
  },
  {
    label: "Two",
    zh: "二",
    summary: "对话、平衡、初步选择",
    upright: ["计划", "合作意图"],
    reversed: ["犹豫", "缺乏协调"],
    mantra: "我允许双向能量流动。",
  },
  {
    label: "Three",
    zh: "三",
    summary: "扩张、初见成果",
    upright: ["成长", "团队"],
    reversed: ["进度拖延", "愿景需调整"],
    mantra: "我庆祝每一步成果。",
  },
  {
    label: "Four",
    zh: "四",
    summary: "结构、休整或保护",
    upright: ["稳定", "庆祝"],
    reversed: ["固守舒适圈", "停滞"],
    mantra: "我允许稳定与流动共存。",
  },
  {
    label: "Five",
    zh: "五",
    summary: "挑战、混乱带来的觉醒",
    upright: ["考验", "竞争/悲伤"],
    reversed: ["冲突缓解", "自我反思"],
    mantra: "我在混乱中找到意义。",
  },
  {
    label: "Six",
    zh: "六",
    summary: "善意、馈赠、旅程中继点",
    upright: ["分享", "记忆/调和"],
    reversed: ["付出失衡", "怀旧停滞"],
    mantra: "我给予也接受温暖。",
  },
  {
    label: "Seven",
    zh: "七",
    summary: "评估、坚守、愿景筛选",
    upright: ["洞察", "坚持"],
    reversed: ["焦躁", "迷失目标"],
    mantra: "我审视真正重要的事。",
  },
  {
    label: "Eight",
    zh: "八",
    summary: "精进、前行或撤离",
    upright: ["努力锻炼", "果断离开/加速"],
    reversed: ["过劳", "逃避问题"],
    mantra: "我行动与放手都出于觉知。",
  },
  {
    label: "Nine",
    zh: "九",
    summary: "成就、界限与自我肯定",
    upright: ["自信", "愿望达成/坚持界限"],
    reversed: ["孤立", "过度紧绷"],
    mantra: "我珍视自己的成果与边界。",
  },
  {
    label: "Ten",
    zh: "十",
    summary: "周期圆满、群体故事",
    upright: ["丰收", "圆满/责任"],
    reversed: ["能量耗竭", "家庭/团队压力"],
    mantra: "我在终点感谢所有旅伴。",
  },
  {
    label: "Page",
    zh: "侍从",
    summary: "学习者的心，敏锐好奇",
    upright: ["探索", "信息讯息"],
    reversed: ["分心", "消息延迟"],
    mantra: "我保持好奇与谦逊。",
  },
  {
    label: "Knight",
    zh: "骑士",
    summary: "行动派，驱动故事发展",
    upright: ["执行力", "冒险精神"],
    reversed: ["冲动极端", "脚步迟缓"],
    mantra: "我驾驭速度，以心为缰。",
  },
  {
    label: "Queen",
    zh: "皇后",
    summary: "成熟能量，内在掌控",
    upright: ["直觉领导", "滋养"],
    reversed: ["过度情绪化", "内耗"],
    mantra: "我以温柔驾驭力量。",
  },
  {
    label: "King",
    zh: "国王",
    summary: "外在掌控与宏观视角",
    upright: ["权威", "策略"],
    reversed: ["固执", "滥权"],
    mantra: "我让领导力服务更高目的。",
  },
];

const MINOR_OFFSET = MAJOR_ARCANA.length;

export const DECK_SIZE = 78;

const clampCardId = (id: number) => {
  if (Number.isNaN(id)) return 0;
  if (id < 0) return 0;
  if (id >= DECK_SIZE) return DECK_SIZE - 1;
  return id;
};

const buildMinorCard = (id: number): TarotCardMeaning => {
  const normalized = id - MINOR_OFFSET;
  const suitIndex = Math.floor(normalized / RANKS.length);
  const rankIndex = normalized % RANKS.length;
  const suitKeys: SuitKey[] = ["wands", "cups", "swords", "pentacles"];
  const suit = SUITS[suitKeys[suitIndex]];
  const rank = RANKS[rankIndex];
  const upright = Array.from(new Set([...rank.upright, ...suit.upright]));
  const reversed = Array.from(new Set([...rank.reversed, ...suit.reversed]));

  return {
    id,
    arcana: "minor",
    name: `${rank.zh}${suit.zh} · ${rank.label} of ${suit.zh}`,
    suit: suit.zh,
    rank: rank.zh,
    element: `${suit.element} · ${suit.theme}`,
    description: `${rank.summary}，并且触及${suit.summary}的课题。`,
    upright,
    reversed,
    affirmation: `${rank.mantra} · ${suit.mantra}`,
  };
};

export const getTarotCard = (rawId: number): TarotCardMeaning => {
  const id = clampCardId(rawId);
  if (id < MINOR_OFFSET) {
    const blueprint = MAJOR_ARCANA[id];
    return {
      id,
      arcana: "major",
      ...blueprint,
    };
  }
  return buildMinorCard(id);
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

