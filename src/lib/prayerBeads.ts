/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BeadInfo {
  index: number; // 1 to 108
  quote: string;
  source?: string;
  isMilestone: boolean;
}

export const ZEN_BEAD_QUOTES: string[] = [
  "应无所住，而生其心。",
  "心平何劳持戒，行直何用修禅。",
  "一花一世界，一叶一菩提。",
  "若无闲事挂心头，便是人间好时节。",
  "溪声便是广长舌，山色岂非清净身。",
  "本来无一物，何处惹尘埃。",
  "心生种种法生，心灭种种法灭。",
  "不乱于心，不困于情。不畏将来，不念过往。",
  "放下执念，万般自在。",
  "山中何所有，岭上多白云。",
  "千江有水千江月，万里无云万里天。",
  "随富随贫且欢乐，不乱不浊是清流。",
  "身是菩提树，心如明镜台。",
  "时时勤拂拭，莫使惹尘埃。",
  "一念放下，万般从容。",
  "春有百花秋有月，夏有凉风冬有雪。",
  "行到水穷处，坐看云起时。",
  "宠辱不惊，闲看庭前花开花落。",
  "去留无意，漫随天外云卷云舒。",
  "大千世界，安住当下。",
  "念念不忘，必有回响。",
  "风来疏竹，风过而竹不留声。",
  "雁渡寒潭，雁去而潭不留影。",
  "常乐我净，慈悲喜舍。",
  "但愿众生得离苦，不为自己求安乐。",
  "心包太虚，量周沙界。",
  "以欢喜心过生活，以平常心生情味。"
];

export function getQuoteForBead(beadIndex: number): string {
  const normalized = Math.max(1, Math.min(108, beadIndex));
  const quoteIdx = (normalized - 1) % ZEN_BEAD_QUOTES.length;
  return ZEN_BEAD_QUOTES[quoteIdx];
}

export function advanceBead(currentBead: number, completedLaps: number): { nextBead: number; nextLaps: number; isFullLap: boolean } {
  if (currentBead >= 108) {
    return {
      nextBead: 1,
      nextLaps: completedLaps + 1,
      isFullLap: true,
    };
  }
  return {
    nextBead: currentBead + 1,
    nextLaps: completedLaps,
    isFullLap: false,
  };
}

export function getBeadProgressPercent(currentBead: number): number {
  const clamped = Math.max(1, Math.min(108, currentBead));
  return Math.round((clamped / 108) * 100);
}

export function isMilestoneBead(beadIndex: number): boolean {
  return [18, 36, 54, 72, 90, 108].includes(beadIndex);
}
