/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { Temple3DScene, TempleSceneId } from './components/Temple3DScene';
import { BottomActionBar } from './components/BottomActionBar';
import { WoodenFishModal } from './components/WoodenFishModal';
import { PrayerBeadsModal } from './components/PrayerBeadsModal';
import { IncenseModal } from './components/IncenseModal';
import { ZenFortuneModal } from './components/ZenFortuneModal';
import { WishRibbonModal } from './components/WishRibbonModal';
import { SoundSettingsModal } from './components/SoundSettingsModal';
import { AvatarDrawer } from './components/AvatarDrawer';
import { createRandomMonk, generateOnlineCompanions, MonkAvatar } from './lib/monkAvatars';
import { templeAudio } from './lib/templeAudio';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  // Check autostart query parameter for testability
  const isAutoStart = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('autostart') === '1';

  const [hasEntered, setHasEntered] = useState<boolean>(isAutoStart);
  const [scene, setScene] = useState<TempleSceneId>('courtyard');
  const [userMonk, setUserMonk] = useState<MonkAvatar>(() => createRandomMonk('self'));
  const [companions] = useState<MonkAvatar[]>(() => generateOnlineCompanions(7));
  const [meritCount, setMeritCount] = useState<number>(18);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [bellRinging, setBellRinging] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isWoodenFishOpen, setIsWoodenFishOpen] = useState(false);
  const [isPrayerBeadsOpen, setIsPrayerBeadsOpen] = useState(false);
  const [isIncenseOpen, setIsIncenseOpen] = useState(false);
  const [isFortuneOpen, setIsFortuneOpen] = useState(false);
  const [isWishesOpen, setIsWishesOpen] = useState(false);
  const [isSoundSettingsOpen, setIsSoundSettingsOpen] = useState(false);
  const [isAvatarDrawerOpen, setIsAvatarDrawerOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleAddMerit = (amount = 1) => {
    setMeritCount(prev => prev + amount);
  };

  const handleSceneChange = (newScene: TempleSceneId) => {
    setScene(newScene);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    templeAudio.setMuted(nextMuted);
    if (!nextMuted) {
      templeAudio.startAmbienceTrack('stream');
      showToast("梵音已启 · 灵隐山水伴君静修");
    } else {
      showToast("已静音");
    }
  };

  // 1. 合掌礼佛
  const handleBow = () => {
    templeAudio.playSingingBowl();
    setUserMonk(prev => ({ ...prev, posture: 'bowing' }));
    handleAddMerit(1);
    showToast("双手合十 · 身心清宁，常生吉祥");
    setTimeout(() => {
      setUserMonk(prev => ({ ...prev, posture: 'idle' }));
    }, 1600);
  };

  // 2. 顶礼拜佛
  const handleProstrate = () => {
    templeAudio.playSingingBowl();
    setUserMonk(prev => ({ ...prev, posture: 'prostrating' }));
    handleAddMerit(3);
    showToast("顶礼三拜 · 降伏傲慢，心地澄明");
    setTimeout(() => {
      setUserMonk(prev => ({ ...prev, posture: 'idle' }));
    }, 2200);
  };

  // 3. 撞响灵隐大钟
  const handleStrikeBell = () => {
    templeAudio.playTempleBell();
    setBellRinging(true);
    handleAddMerit(5);
    showToast("闻钟声，烦恼清，智慧长，菩提生");
    setTimeout(() => {
      setBellRinging(false);
    }, 3500);
  };

  const handleEnterTemple = () => {
    templeAudio.playSingingBowl();
    templeAudio.startAmbienceTrack('stream');
    setHasEntered(true);
    showToast(`欢迎归山，小沙弥 · ${userMonk.name}`);
  };

  return (
    <div className="min-h-screen bg-[#1c1b18] text-stone-100 flex flex-col relative font-serif select-none overflow-hidden">
      {/* 1. Serene Arrival Screen (Sansa landing) */}
      {!hasEntered && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#f3efe6] text-stone-900 select-none animate-in fade-in duration-500">
          <div className="max-w-md w-full flex flex-col items-center text-center">
            {/* Temple Crest Emblem */}
            <div className="w-16 h-16 rounded-full bg-amber-900/10 border border-amber-800/30 flex items-center justify-center text-2xl font-serif text-amber-900 mb-5 shadow-sm">
              寺
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-widest text-stone-900 mb-2">
              灵隐寺 · 且歇片刻
            </h1>
            <p className="text-xs tracking-widest text-stone-500 font-serif mb-6 uppercase">
              Lingyin Temple · Cloud Forest Sanctuary
            </p>

            <div className="w-full bg-[#e9e4d8] border border-stone-300/80 rounded-2xl p-5 mb-8 shadow-sm">
              <span className="text-xs text-stone-500 block mb-1">
                今日您在灵隐山中的法号：
              </span>
              <div className="text-xl font-bold text-amber-900 font-serif mb-1">
                小沙弥 · {userMonk.name}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-serif">
                千峰环野立，一水抱村流。不必匆忙，在此处合掌礼佛、敲击木鱼、捻转108颗佛珠，在所有场景中3D漫步修心。
              </p>
            </div>

            <button
              onClick={handleEnterTemple}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-50 font-serif font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>步入灵隐山门</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="mt-4 text-[11px] text-stone-400 font-serif">
              戴上耳机，轻风细水与晨钟声更沁人心脾
            </p>
          </div>
        </div>
      )}

      {/* 2. Top Bar Navigation with 5 3D scenes */}
      <HeaderBar
        currentScene={scene}
        onSceneChange={handleSceneChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenSoundSettings={() => setIsSoundSettingsOpen(true)}
        onOpenAvatarSettings={() => setIsAvatarDrawerOpen(true)}
        userMonk={userMonk}
        onlineCount={108}
        meritCount={meritCount}
      />

      {/* 3. Main 3D Interactive Sanctuary Walking View */}
      <main className="flex-1 relative overflow-hidden">
        <Temple3DScene
          currentScene={scene}
          userMonk={userMonk}
          companions={companions}
          onOpenWoodenFish={() => setIsWoodenFishOpen(true)}
          onOpenPrayerBeads={() => setIsPrayerBeadsOpen(true)}
          onOpenIncense={() => setIsIncenseOpen(true)}
          onStrikeBell={handleStrikeBell}
          onOpenFortune={() => setIsFortuneOpen(true)}
          onOpenWishes={() => setIsWishesOpen(true)}
          onBow={handleBow}
          onProstrate={handleProstrate}
          bellRinging={bellRinging}
        />
      </main>

      {/* 4. Floating Ritual Action Bar */}
      <BottomActionBar
        onBow={handleBow}
        onProstrate={handleProstrate}
        onOpenWoodenFish={() => setIsWoodenFishOpen(true)}
        onOpenPrayerBeads={() => setIsPrayerBeadsOpen(true)}
        onOpenIncense={() => setIsIncenseOpen(true)}
        onStrikeBell={handleStrikeBell}
        onOpenFortune={() => setIsFortuneOpen(true)}
        onOpenWishes={() => setIsWishesOpen(true)}
        currentPosture={userMonk.posture}
      />

      {/* 5. Serene Central Prompt Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-2 rounded-full bg-stone-900/90 backdrop-blur-md border border-amber-600/40 text-amber-200 text-xs font-serif shadow-2xl flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 6. Interactive Modals */}
      <WoodenFishModal
        isOpen={isWoodenFishOpen}
        onClose={() => setIsWoodenFishOpen(false)}
        onAddMerit={handleAddMerit}
        totalMerit={meritCount}
      />

      <PrayerBeadsModal
        isOpen={isPrayerBeadsOpen}
        onClose={() => setIsPrayerBeadsOpen(false)}
        onAddMerit={handleAddMerit}
      />

      <IncenseModal
        isOpen={isIncenseOpen}
        onClose={() => setIsIncenseOpen(false)}
        onAddMerit={handleAddMerit}
      />

      <ZenFortuneModal
        isOpen={isFortuneOpen}
        onClose={() => setIsFortuneOpen(false)}
        onAddMerit={handleAddMerit}
      />

      <WishRibbonModal
        isOpen={isWishesOpen}
        onClose={() => setIsWishesOpen(false)}
        userName={userMonk.name}
        onAddMerit={handleAddMerit}
      />

      <SoundSettingsModal
        isOpen={isSoundSettingsOpen}
        onClose={() => setIsSoundSettingsOpen(false)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      <AvatarDrawer
        isOpen={isAvatarDrawerOpen}
        onClose={() => setIsAvatarDrawerOpen(false)}
        userMonk={userMonk}
        onUpdateMonk={(updated) => setUserMonk(prev => ({ ...prev, ...updated }))}
        meritCount={meritCount}
      />
    </div>
  );
}
