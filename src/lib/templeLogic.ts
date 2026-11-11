/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ZenFortune {
  number: number;
  grade: '上上吉' | '大吉' | '吉祥' | '上吉';
  title: string;
  poem: string[];
  explanation: string;
  advice: string;
}

export const ZEN_FORTUNES: ZenFortune[] = [
  {
    number: 1,
    grade: "上上吉",
    title: "飞来迎瑞 · 万里祥云",
    poem: [
      "灵鹫飞来古寺边",
      "冷泉清澈映青天",
      "随缘安坐心无累",
      "处处春风自得闲"
    ],
    explanation: "灵隐古山深处自有清凉界，烦恼如落叶，风过自消歇。",
    advice: "不急于求成，步履从容，万事皆有其时节。"
  },
  {
    number: 8,
    grade: "大吉",
    title: "冷泉听琴 · 水净心澄",
    poem: [
      "泉声洗尽尘间梦",
      "松色长留物外心",
      "若得胸中宽似海",
      "青山绿水总知音"
    ],
    explanation: "行至水边，洗去浮躁；静心观照，清风自来。",
    advice: "当下若感迷茫，不妨暂歇片刻，静能生慧。"
  },
  {
    number: 16,
    grade: "吉祥",
    title: "古刹晓钟 · 破除幽暗",
    poem: [
      "一声清磬彻虚空",
      "云散天高月正中",
      "莫向行藏争得失",
      "回头尽在不言中"
    ],
    explanation: "钟声悠远，惊醒梦中人；放下一分执着，便得一分清净。",
    advice: "与其忧心前路，不如踏实走好眼前这一步。"
  },
  {
    number: 28,
    grade: "上吉",
    title: "竹林幽径 · 步步生莲",
    poem: [
      "幽篁深处任行藏",
      "自有清风送远香",
      "但得心安随处乐",
      "何须名利竞奔忙"
    ],
    explanation: "心若安宁，身处何处皆是道场；素朴知足，福寿自长。",
    advice: "放慢呼吸，照顾好自己的身体与情绪。"
  },
  {
    number: 33,
    grade: "大吉",
    title: "宝殿光明 · 所愿遂心",
    poem: [
      "慈光普照大千界",
      "善念初生福自生",
      "守得云开见明月",
      "此行一路总清宁"
    ],
    explanation: "念念利他，吉神相随；真诚所至，金石为开。",
    advice: "保持心怀善意，你所期待的美好正在路上。"
  }
];

export interface TempleWish {
  id: string;
  author: string;
  content: string;
  type: 'ribbon' | 'lantern';
  timestamp: number;
}

export const INITIAL_WISHES: TempleWish[] = [
  {
    id: "wish-1",
    author: "小沙弥 · 听泉",
    content: "愿天下父母安康长寿，愿世间少烦忧，多喜乐。",
    type: "ribbon",
    timestamp: Date.now() - 3600000,
  },
  {
    id: "wish-2",
    author: "小沙弥 · 闲石",
    content: "今年考研/面试顺利上岸，心平气和，不骄不馁。",
    type: "ribbon",
    timestamp: Date.now() - 7200000,
  },
  {
    id: "wish-3",
    author: "小沙弥 · 观云",
    content: "在浮躁世界里守护一颗清净心，活在当下，温和待人。",
    type: "lantern",
    timestamp: Date.now() - 10800000,
  },
  {
    id: "wish-4",
    author: "小沙弥 · 默照",
    content: "愿身体无疾，身心自在，夜夜安眠无噩梦。",
    type: "lantern",
    timestamp: Date.now() - 14400000,
  }
];

export function getMeritTitle(meritCount: number): string {
  if (meritCount < 10) return "初入空门";
  if (meritCount < 50) return "云林行者";
  if (meritCount < 108) return "心水自澄";
  if (meritCount < 300) return "万虑俱息";
  if (meritCount < 1000) return "明心见性";
  return "觉行圆满";
}

export function drawRandomFortune(): ZenFortune {
  const idx = Math.floor(Math.random() * ZEN_FORTUNES.length);
  return ZEN_FORTUNES[idx];
}
