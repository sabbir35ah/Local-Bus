/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine, GameStats, PlayerControls } from './game/GameEngine.ts';
import { BUS_SKINS, BusSkin } from './game/rules.ts';
import { DialogueItem } from './game/dialogues.ts';
import { soundManager } from './game/sound.ts';
import { TitleScreen } from './components/TitleScreen.tsx';
import { HUD } from './components/HUD.tsx';
import { BusGarageModal } from './components/BusGarageModal.tsx';
import { PauseModal } from './components/PauseModal.tsx';
import { GameOverModal } from './components/GameOverModal.tsx';
import { HowToPlayModal } from './components/HowToPlayModal.tsx';

type GameState = 'title' | 'playing' | 'paused' | 'gameover';

const STORAGE_KEYS = {
  HIGH_SCORE: 'dhaka_bus_boss_high_score',
  TOTAL_CASH: 'dhaka_bus_boss_total_cash',
  UNLOCKED_SKINS: 'dhaka_bus_boss_unlocked_skins',
  SELECTED_SKIN: 'dhaka_bus_boss_selected_skin',
  SFX: 'dhaka_bus_boss_sfx',
  VOICE: 'dhaka_bus_boss_voice',
};

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Game State Machine
  const [gameState, setGameState] = useState<GameState>('title');
  const [showGarage, setShowGarage] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Persistence State
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '0', 10);
    } catch {
      return 0;
    }
  });

  const [totalCash, setTotalCash] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_CASH) || '50', 10);
    } catch {
      return 50;
    }
  });

  const [unlockedSkinIds, setUnlockedSkinIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.UNLOCKED_SKINS);
      return stored ? JSON.parse(stored) : ['sobuj_sathi'];
    } catch {
      return ['sobuj_sathi'];
    }
  });

  const [selectedSkinId, setSelectedSkinId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_SKIN) || 'sobuj_sathi';
    } catch {
      return 'sobuj_sathi';
    }
  });

  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SFX);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VOICE);
      return stored !== null ? stored === 'true' : false;
    } catch {
      return false;
    }
  });

  // Active HUD Stats
  const [stats, setStats] = useState<GameStats>({
    speed: 0,
    distance: 0,
    score: 0,
    cash: 0,
    passengers: 0,
    damage: 0,
    nextStopName: 'ফার্মগেট বাস স্টপ',
    distanceToStop: 380,
    combo: 1,
  });

  const [currentDialogue, setCurrentDialogue] = useState<DialogueItem | null>(null);
  const [nearMissBonus, setNearMissBonus] = useState<number | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Controls
  const [controls, setControls] = useState<PlayerControls>({
    gas: false,
    brake: false,
    left: false,
    right: false,
    handbrake: false,
    horn: false,
  });

  // Mirror state to document.body.dataset.state for CSS & testability
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Keep soundManager settings synced
  useEffect(() => {
    soundManager.sfxEnabled = sfxEnabled;
    soundManager.voiceEnabled = voiceEnabled;
    try {
      localStorage.setItem(STORAGE_KEYS.SFX, String(sfxEnabled));
      localStorage.setItem(STORAGE_KEYS.VOICE, String(voiceEnabled));
    } catch {
      // Ignore storage errors
    }
  }, [sfxEnabled, voiceEnabled]);

  const activeSkin = BUS_SKINS.find((s) => s.id === selectedSkinId) || BUS_SKINS[0];

  // Engine Callbacks
  const handleStatsUpdate = useCallback((newStats: GameStats) => {
    setStats(newStats);
  }, []);

  const handleDialogue = useCallback((dialogue: DialogueItem) => {
    setCurrentDialogue(dialogue);
  }, []);

  const handleNearMissBonus = useCallback((bonusCash: number) => {
    setNearMissBonus(bonusCash);
    setTimeout(() => {
      setNearMissBonus(null);
    }, 1500);
  }, []);

  const handleStopArrival = useCallback((_stopName: string) => {
    // Stop arrived
  }, []);

  const handleGameOver = useCallback(
    (finalStats: GameStats, reason: string) => {
      setGameOverReason(reason);
      setGameState('gameover');

      // Update High Score & Total Cash
      setHighScore((prev) => {
        const isNew = finalStats.score > prev;
        setIsNewHighScore(isNew);
        const best = Math.max(prev, finalStats.score);
        try {
          localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(best));
        } catch {
          // Ignore storage errors
        }
        return best;
      });

      setTotalCash((prev) => {
        const next = prev + finalStats.cash;
        try {
          localStorage.setItem(STORAGE_KEYS.TOTAL_CASH, String(next));
        } catch {
          // Ignore storage errors
        }
        return next;
      });
    },
    []
  );

  // Initialize GameEngine once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new GameEngine(canvasMountRef.current, activeSkin, {
      onStatsUpdate: handleStatsUpdate,
      onDialogue: handleDialogue,
      onGameOver: handleGameOver,
      onNearMissBonus: handleNearMissBonus,
      onStopArrival: handleStopArrival,
    });
    engineRef.current = engine;

    const handleResize = () => {
      if (canvasMountRef.current && engineRef.current) {
        engineRef.current.handleResize(
          canvasMountRef.current.clientWidth,
          canvasMountRef.current.clientHeight
        );
      }
    };
    window.addEventListener('resize', handleResize);

    // Check ?autostart=1 query parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      soundManager.initOnUserAction();
      engine.isPaused = false;
      setGameState('playing');
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Update skin on engine when changed
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSkin(activeSkin);
    }
  }, [activeSkin]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow start on Space or Enter when in title screen
      if (gameState === 'title' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        startGame();
        return;
      }

      // Pause toggle on Escape or P
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (gameState === 'playing') {
          pauseGame();
          return;
        } else if (gameState === 'paused') {
          resumeGame();
          return;
        }
      }

      if (gameState !== 'playing' || !engineRef.current) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        engineRef.current.controls.gas = true;
        setControls((c) => ({ ...c, gas: true }));
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        engineRef.current.controls.brake = true;
        setControls((c) => ({ ...c, brake: true }));
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        engineRef.current.controls.left = true;
        setControls((c) => ({ ...c, left: true }));
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        engineRef.current.controls.right = true;
        setControls((c) => ({ ...c, right: true }));
      }
      if (e.code === 'Space') {
        engineRef.current.controls.handbrake = true;
        setControls((c) => ({ ...c, handbrake: true }));
      }
      if (e.code === 'KeyH') {
        engineRef.current.honkHorn();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        engineRef.current.controls.gas = false;
        setControls((c) => ({ ...c, gas: false }));
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        engineRef.current.controls.brake = false;
        setControls((c) => ({ ...c, brake: false }));
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        engineRef.current.controls.left = false;
        setControls((c) => ({ ...c, left: false }));
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        engineRef.current.controls.right = false;
        setControls((c) => ({ ...c, right: false }));
      }
      if (e.code === 'Space') {
        engineRef.current.controls.handbrake = false;
        setControls((c) => ({ ...c, handbrake: false }));
      }
    };

    const handleWindowBlur = () => {
      if (engineRef.current) {
        engineRef.current.controls = {
          gas: false,
          brake: false,
          left: false,
          right: false,
          handbrake: false,
          horn: false,
        };
        setControls({
          gas: false,
          brake: false,
          left: false,
          right: false,
          handbrake: false,
          horn: false,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [gameState]);

  // Touch control trigger
  const handleTouchControl = (key: keyof PlayerControls, active: boolean) => {
    if (!engineRef.current) return;
    engineRef.current.controls[key] = active;
    setControls((c) => ({ ...c, [key]: active }));
  };

  const startGame = () => {
    soundManager.initOnUserAction();
    if (engineRef.current) {
      engineRef.current.restart();
      engineRef.current.isPaused = false;
    }
    setGameState('playing');
  };

  const pauseGame = () => {
    if (engineRef.current) {
      engineRef.current.isPaused = true;
    }
    setGameState('paused');
  };

  const resumeGame = () => {
    if (engineRef.current) {
      engineRef.current.isPaused = false;
    }
    setGameState('playing');
  };

  const restartGame = () => {
    soundManager.initOnUserAction();
    if (engineRef.current) {
      engineRef.current.restart();
      engineRef.current.isPaused = false;
    }
    setGameState('playing');
  };

  const returnToMenu = () => {
    if (engineRef.current) {
      engineRef.current.isPaused = true;
    }
    setGameState('title');
  };

  const handleSelectSkin = (skin: BusSkin) => {
    setSelectedSkinId(skin.id);
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_SKIN, skin.id);
    } catch {
      // Ignore
    }
  };

  const handleUnlockSkin = (skin: BusSkin) => {
    if (totalCash < skin.price) return;
    const nextCash = totalCash - skin.price;
    const nextUnlocked = [...unlockedSkinIds, skin.id];

    setTotalCash(nextCash);
    setUnlockedSkinIds(nextUnlocked);
    setSelectedSkinId(skin.id);

    try {
      localStorage.setItem(STORAGE_KEYS.TOTAL_CASH, String(nextCash));
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_SKINS, JSON.stringify(nextUnlocked));
      localStorage.setItem(STORAGE_KEYS.SELECTED_SKIN, skin.id);
    } catch {
      // Ignore
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* Isolated Three.js WebGL Mount Container */}
      <div
        ref={canvasMountRef}
        data-testid="three-canvas"
        className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
      />

      {/* Screen 1: Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          onStart={startGame}
          onOpenGarage={() => setShowGarage(true)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          currentSkin={activeSkin}
          highScore={highScore}
          totalCash={totalCash}
          sfxEnabled={sfxEnabled}
          voiceEnabled={voiceEnabled}
          onToggleSfx={() => setSfxEnabled(!sfxEnabled)}
          onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        />
      )}

      {/* Screen 2: Active Playing HUD */}
      {gameState === 'playing' && (
        <HUD
          stats={stats}
          currentDialogue={currentDialogue}
          nearMissBonus={nearMissBonus}
          onPause={pauseGame}
          onHonk={() => engineRef.current?.honkHorn()}
          sfxEnabled={sfxEnabled}
          voiceEnabled={voiceEnabled}
          onToggleSfx={() => setSfxEnabled(!sfxEnabled)}
          onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
          controls={controls}
          onControlChange={handleTouchControl}
        />
      )}

      {/* Screen 3: Paused Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={resumeGame}
          onRestart={restartGame}
          onHome={returnToMenu}
          sfxEnabled={sfxEnabled}
          voiceEnabled={voiceEnabled}
          onToggleSfx={() => setSfxEnabled(!sfxEnabled)}
          onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        />
      )}

      {/* Screen 4: Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          stats={stats}
          reason={gameOverReason}
          isNewHighScore={isNewHighScore}
          highScore={highScore}
          onRestart={restartGame}
          onHome={returnToMenu}
          onOpenGarage={() => setShowGarage(true)}
        />
      )}

      {/* Auxiliary Modal: Bus Garage */}
      {showGarage && (
        <BusGarageModal
          unlockedSkinIds={unlockedSkinIds}
          selectedSkinId={selectedSkinId}
          totalCash={totalCash}
          onSelectSkin={handleSelectSkin}
          onUnlockSkin={handleUnlockSkin}
          onClose={() => setShowGarage(false)}
        />
      )}

      {/* Auxiliary Modal: How to Play */}
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
    </main>
  );
}
