/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MonkAvatar {
  id: string;
  name: string; // e.g. "听泉", "清风"
  title: string; // e.g. "灵隐山中小沙弥"
  robeColor: string; // hex
  sashColor: string; // hex
  posture: 'idle' | 'bowing' | 'prostrating' | 'meditating' | 'sweeping' | 'reading';
  x: number; // 0 - 100% of scene
  y: number; // 0 - 100% of scene
  scene: 'grand_hall' | 'courtyard' | 'cold_spring' | 'bell_tower' | 'zen_room';
  statusText?: string;
}

export const MONK_NAMES = [
  "听泉", "清风", "观云", "行深", "闲石", 
  "默照", "觉晓", "澄心", "妙吉祥", "怀远", 
  "净尘", "伴月", "若水", "栖霞", "常乐", 
  "虚怀", "随喜", "安住", "无碍", "见素", 
  "如初", "知足", "守一", "灵澈", "自得"
];

export const ROBE_PALETTES = [
  { robe: "#bf7c43", sash: "#633215", name: "赭石僧袍" }, // Traditional ochre / monk brown
  { robe: "#d9a752", sash: "#7c4a16", name: "姜黄短褐" }, // Golden saffron
  { robe: "#5a685e", sash: "#2c3b31", name: "松烟素衣" }, // Pine ash grey
  { robe: "#4f657a", sash: "#1f3347", name: "云水苍青" }, // Cloud-water blue
  { robe: "#8a584c", sash: "#48261e", name: "赤檀法衣" }, // Red sandalwood
];

export function createRandomMonk(id = "self", defaultName?: string): MonkAvatar {
  const name = defaultName || MONK_NAMES[Math.floor(Math.random() * MONK_NAMES.length)];
  const palette = ROBE_PALETTES[Math.floor(Math.random() * ROBE_PALETTES.length)];
  return {
    id,
    name,
    title: "云林小沙弥",
    robeColor: palette.robe,
    sashColor: palette.sash,
    posture: "idle",
    x: 50,
    y: 72,
    scene: "courtyard",
    statusText: "歇息于灵隐古树下",
  };
}

export function generateOnlineCompanions(count = 6): MonkAvatar[] {
  const postures: MonkAvatar['posture'][] = ['meditating', 'sweeping', 'idle', 'reading'];
  const scenes: MonkAvatar['scene'][] = ['courtyard', 'courtyard', 'cold_spring', 'grand_hall', 'bell_tower'];
  const usedNames = new Set<string>();

  return Array.from({ length: count }, (_, i) => {
    let name = MONK_NAMES[Math.floor(Math.random() * MONK_NAMES.length)];
    while (usedNames.has(name)) {
      name = MONK_NAMES[Math.floor(Math.random() * MONK_NAMES.length)];
    }
    usedNames.add(name);

    const palette = ROBE_PALETTES[i % ROBE_PALETTES.length];
    const posture = postures[i % postures.length];
    const scene = scenes[i % scenes.length];

    // Coordinates distributed naturally in ground zones
    const x = 20 + Math.floor((i * 14 + 7) % 65);
    const y = 62 + Math.floor((i * 7 + 5) % 22);

    let statusText = "静心小憩";
    if (posture === "sweeping") statusText = "扫落庭前落叶";
    else if (posture === "meditating") statusText = "树下闭目静坐";
    else if (posture === "reading") statusText = "手持经卷默读";
    else if (posture === "idle") statusText = "闲看山林白云";

    return {
      id: `companion-${i + 1}`,
      name,
      title: "同修小僧",
      robeColor: palette.robe,
      sashColor: palette.sash,
      posture,
      x,
      y,
      scene,
      statusText,
    };
  });
}
