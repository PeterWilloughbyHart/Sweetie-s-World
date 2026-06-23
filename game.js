(() => {
  "use strict";

  const SAVE_KEY = "sweeties-beach-day-save-v1";
  const LEGACY_SAVE_KEY = "sweeties-dach-dash-save-v1";
  const AUDIO_PREFERENCE_KEY = "sweeties-beach-day-sound-v1";
  const AUDIO_ASSETS = Object.freeze({
    oceanWaves: "assets/audio/ocean_waves_loop.mp3",
    duckQuack: "assets/audio/duck_quack_01.mp3"
  });
  const AUDIO_CONFIG = Object.freeze({
    ambientVolume: 0.25,
    effectVolume: 0.6,
    duckQuackCooldownMs: 450
  });
  const DREAM_BOND = 75;
  const STAND_COOLDOWN_MS = 45_000;
  const STAND_NPC_CONFIG = Object.freeze({
    speechDurationMs: 4_200,
    talkFrameDurationMs: 250
  });
  const DECAY_TICK_MS = 60_000;
  const COPY_ROOT = window.SWEETIE_COPY || {};

  function getCopy(path, fallback) {
    const value = path.split(".").reduce((current, key) => (
      current && Object.prototype.hasOwnProperty.call(current, key) ? current[key] : undefined
    ), COPY_ROOT);
    return value === undefined || value === null ? fallback : value;
  }

  function getCopyList(path, fallback) {
    const value = getCopy(path, fallback);
    return Array.isArray(value) && value.length ? value : fallback;
  }

  function formatCopy(template, values = {}) {
    return String(template).replace(/\{(\w+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
    ));
  }

  function copyText(path, fallback, values = {}) {
    return formatCopy(getCopy(path, fallback), values);
  }

  function applyStaticCopy() {
    document.querySelectorAll("[data-copy]").forEach((element) => {
      element.textContent = getCopy(element.dataset.copy, element.textContent);
    });
    document.querySelectorAll("[data-copy-aria]").forEach((element) => {
      element.setAttribute("aria-label", getCopy(element.dataset.copyAria, element.getAttribute("aria-label") || ""));
    });
    document.querySelectorAll("[data-copy-content]").forEach((element) => {
      element.setAttribute("content", getCopy(element.dataset.copyContent, element.getAttribute("content") || ""));
    });
  }

  function createDefaultState() {
    return {
      joy: 78,
      fullness: 72,
      energy: 68,
      bond: 25,
      treats: 5,
      standReadyAt: 0,
      hiddenNoteDiscovered: false,
      lastSavedAt: Date.now(),
      hasStarted: false
    };
  }

  const messages = {
    pet: getCopyList("messages.pet", ["Sweetie enjoyed the pets."]),
    treat: getCopyList("messages.treat", ["Sweetie enjoyed the treat."]),
    noTreat: getCopyList("messages.noTreat", ["The picnic basket is empty."]),
    water: getCopyList("messages.water", ["Sweetie enjoyed a refreshing drink."]),
    fetch: getCopyList("messages.fetch", ["Sweetie fetched the ball."]),
    gentleFetch: getCopyList("messages.gentleFetch", ["Sweetie brought back a shell instead."]),
    nap: getCopyList("messages.nap", ["Sweetie had a tiny beach nap."]),
    stand: getCopyList("messages.stand", ["The hot dog stand packed three treats."]),
    idle: getCopyList("messages.idle", ["Sweetie is enjoying the beach."]),
    return: getCopyList("messages.return", ["Sweetie is happy you're back."]),
    returningHome: getCopyList("messages.returningHome", ["Sweetie is scampering back!"])
  };

  const standDialogue = Object.freeze({
    visit: Object.freeze([
      ...getCopyList("hotDogStand.dialogue.general", [
        "Fresh hot dogs for discerning beach pups!",
        "A fine day for seaside snacks."
      ]),
      ...getCopyList("hotDogStand.dialogue.sweetie", [
        "For Sweetie? Naturally.",
        "A golden customer with excellent taste."
      ]),
      ...getCopyList("hotDogStand.dialogue.world", [
        "Some call it a stand. I call it an institution.",
        "A duck's work is never done."
      ])
    ]),
    cooldown: Object.freeze(getCopyList("hotDogStand.dialogue.cooldown", [
      "One moment - the next batch is nearly ready.",
      "The grill requires a dignified pause."
    ]))
  });

  const moodFallbacks = {
    happy: { label: "Happy", icon: "\u2600", thought: "Best. Day. Ever.", propText: "" },
    snackish: { label: "Snackish", icon: "\u2661", thought: "A snack, perhaps?", propText: "" },
    sleepy: { label: "Sleepy", icon: "Zz", thought: "Towel... nap...", propText: "Zz" },
    playful: { label: "Playful", icon: "\u25cf", thought: "Throw the ball!", propText: "" },
    calm: { label: "Calm", icon: "\u223c", thought: "Just listening to the waves.", propText: "" }
  };
  const moodDetails = Object.fromEntries(Object.entries(moodFallbacks).map(([key, fallback]) => [key, {
    label: getCopy(`moods.${key}.label`, fallback.label),
    icon: getCopy(`moods.${key}.icon`, fallback.icon),
    thought: getCopy(`moods.${key}.thought`, fallback.thought),
    propText: getCopy(`moods.${key}.propText`, fallback.propText)
  }]));
  const statNames = ["joy", "fullness", "energy", "bond"];
  const IDLE_MIN_MS = 9_000;
  const IDLE_MAX_MS = 16_000;
  const THOUGHT_BUBBLE_CONFIG = Object.freeze({
    snackishFullnessThreshold: 35,
    visibleDurationMs: 4_500,
    minCooldownMs: 20_000,
    maxCooldownMs: 45_000
  });
  const SWEETIE_STROLL_CONFIG = Object.freeze({
    enabled: true,
    idleDelayMin: 12_000,
    idleDelayMax: 24_000,
    retryDelay: 3_500,
    home: Object.freeze({ x: 0.5, y: 0.99, scale: 1 }),
    waterline: Object.freeze({ y: 0.625, scale: 0.62 }),
    xRange: Object.freeze({
      leftVisible: 0.08,
      rightVisible: 0.92,
      minOffscreenBuffer: 0.12,
      offscreenPadding: 0.04
    }),
    departDuration: 1_900,
    crossDurationMin: 7_500,
    crossDurationMax: 10_000,
    reentryDurationMin: 1_300,
    reentryDurationMax: 1_800,
    offscreenPauseMin: 600,
    offscreenPauseMax: 1_000,
    returnDuration: 1_500,
    walkFrameDuration: 180,
    runHomeFrameDuration: 150,
    happyMoodFrameDuration: 450
  });
  const reducedMotionQuery = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };
  const idleBehaviors = [
    { name: "glance-player", duration: 1_900 },
    { name: "ocean-watch", duration: 2_400 },
    { name: "snack-watch", duration: 2_200 },
    { name: "weight-shift", duration: 2_000 },
    { name: "sniff", duration: 2_200 },
    { name: "little-steps", duration: 2_700 },
    { name: "inspect-shell", duration: 2_600 },
    { name: "stretch", duration: 2_500 },
    { name: "perk", duration: 2_000 },
    { name: "proud-bounce", duration: 1_700 },
    { name: "settle", duration: 2_800 }
  ];
  const idleClasses = idleBehaviors.map(({ name }) => `idle-${name}`);
  const reactionClasses = ["reaction-pet", "reaction-treat", "reaction-water", "reaction-fetch", "reaction-fetch-shell", "reaction-nap", "reaction-stand"];
  const reactionDurations = {
    pet: 1_700,
    treat: 1_750,
    water: 1_800,
    fetch: 1_950,
    "fetch-shell": 1_900,
    nap: 2_350,
    stand: 1_050
  };
  const BEACH_SCENE_ASSETS = Object.freeze({
    sky: "assets/backgrounds/beach_sky.png",
    sun: "assets/backgrounds/sun.png",
    cloud01: "assets/backgrounds/cloud_01.png",
    cloud02: "assets/backgrounds/cloud_02.png",
    cloud03: "assets/backgrounds/cloud_03.png",
    sand: "assets/backgrounds/beach_sand.png",
    distantShore: "assets/backgrounds/distant_shore.png",
    oceanTexture: "assets/backgrounds/ocean_water_texture.png",
    waveFoam01: "assets/backgrounds/wave_foam_01.png",
    waveFoam02: "assets/backgrounds/wave_foam_02.png"
  });
  const BEACH_PROP_ASSETS = Object.freeze({
    umbrella: "assets/props/beach_umbrella.png",
    beachTowel: "assets/props/beach_towel.png",
    shell01: "assets/props/shell_01.png",
    shell02: "assets/props/shell_02.png",
    shell03: "assets/props/shell_03.png",
    hotDogStand: "assets/props/hot_dog_stand.png",
    hotDogStandTalk: "assets/props/hot_dog_stand_talk.png",
    hotDogStandTalk02: "assets/props/hot_dog_stand_talk_02.png",
    standOwner: "assets/props/stand_owner.png",
    hotDog: "assets/treats/hot_dog.png",
    treatCrumbs: "assets/treats/treat_crumbs.png"
  });
  const SCENE_DEPTH_CONFIG = Object.freeze({
    minObjectZ: 100,
    maxObjectZ: 500,
    objects: Object.freeze([
      Object.freeze({ name: "umbrella", selector: ".umbrella", anchorRatio: 0.94, depthOffset: 16 }),
      Object.freeze({ name: "towel", selector: ".towel", anchorRatio: 1, depthOffset: 0 }),
      Object.freeze({ name: "shell-one", selector: ".shell-one", anchorRatio: 1, depthOffset: 0 }),
      Object.freeze({ name: "shell-two", selector: ".shell-two", anchorRatio: 1, depthOffset: -22 }),
      Object.freeze({ name: "shell-three", selector: ".shell-three", anchorRatio: 1, depthOffset: -4 }),
      Object.freeze({ name: "hot-dog-stand", selector: ".hot-dog-stand", anchorRatio: 0.94, depthOffset: 8 })
    ])
  });
  const SWEETIE_ASSETS = Object.freeze({
    idle: "assets/sweetie/sweetie_idle.png",
    happy: "assets/sweetie/sweetie_happy.png",
    snackish: "assets/sweetie/sweetie_snackish.png",
    sleepy: "assets/sweetie/sweetie_sleepy.png",
    playful: "assets/sweetie/sweetie_playful.png",
    pet: "assets/sweetie/sweetie_pet.png",
    treat: "assets/sweetie/sweetie_treat.png",
    drink: "assets/sweetie/sweetie_drink.png",
    fetch: "assets/sweetie/sweetie_fetch.png",
    nap: "assets/sweetie/sweetie_nap.png"
  });
  const SWEETIE_MOOD_ASSET_KEYS = Object.freeze({
    happy: "happy",
    snackish: "snackish",
    sleepy: "sleepy",
    playful: "playful",
    calm: "idle"
  });
  const SWEETIE_MOOD_ANIMATION_KEYS = Object.freeze({
    happy: "happyMood"
  });
  const SWEETIE_ACTION_ASSET_KEYS = Object.freeze({
    pet: "pet",
    treat: "treat",
    water: "drink",
    fetch: "fetch",
    "fetch-shell": "fetch",
    nap: "nap"
  });
  const SWEETIE_CARE_ACTIONS = Object.freeze(["pet", "treat", "water", "fetch", "nap"]);
  const SWEETIE_ANIMATIONS = Object.freeze({
    happyMood: Object.freeze({
      frames: Object.freeze([
        "assets/sweetie/sweetie_happy_01.png",
        "assets/sweetie/sweetie_happy_02.png"
      ]),
      fallback: "happy",
      frameDuration: SWEETIE_STROLL_CONFIG.happyMoodFrameDuration,
      loop: true,
      mood: "happy"
    }),
    idleBlink: Object.freeze({
      frames: Object.freeze([
        "assets/sweetie/sweetie_idle_01.png",
        "assets/sweetie/sweetie_idle_02.png"
      ]),
      fallback: "idle",
      blinkFrameDuration: 140,
      minInterval: 3_000,
      maxInterval: 8_000,
      loop: true,
      onlyWhenIdle: true
    }),
    pet: Object.freeze({
      frames: Object.freeze([
        "assets/sweetie/sweetie_pet_01.png",
        "assets/sweetie/sweetie_pet_02.png",
        "assets/sweetie/sweetie_pet_03.png"
      ]),
      fallback: "pet",
      frameDuration: 240,
      loop: false
    }),
    treat: Object.freeze({
      frames: Object.freeze([
        "assets/sweetie/sweetie_treat_01.png",
        "assets/sweetie/sweetie_treat_02.png",
        "assets/sweetie/sweetie_treat_03.png"
      ]),
      fallback: "treat",
      frameDuration: 160,
      loop: false
    }),
    drink: Object.freeze({
      frames: Object.freeze([
        "assets/sweetie/sweetie_drink_01.png",
        "assets/sweetie/sweetie_drink_02.png",
        "assets/sweetie/sweetie_drink_03.png"
      ]),
      fallback: "drink",
      frameDuration: 160,
      loop: false
    }),
    fetch: Object.freeze({
      frames: Object.freeze([
        "assets/sweetie/sweetie_fetch_01.png",
        "assets/sweetie/sweetie_fetch_02.png",
        "assets/sweetie/sweetie_fetch_03.png"
      ]),
      fallback: "fetch",
      frameDuration: 140,
      loop: false
    }),
    nap: Object.freeze({
      frames: Object.freeze([
        "assets/sweetie/sweetie_nap_01.png",
        "assets/sweetie/sweetie_nap_02.png",
        "assets/sweetie/sweetie_nap_03.png"
      ]),
      fallback: "nap",
      frameDuration: 220,
      loop: false
    }),
    walk: Object.freeze({
      frames: Object.freeze([
        "assets/sweetie/sweetie_walk_01.png",
        "assets/sweetie/sweetie_walk_02.png",
        "assets/sweetie/sweetie_walk_03.png",
        "assets/sweetie/sweetie_walk_04.png"
      ]),
      fallback: "idle",
      frameDuration: SWEETIE_STROLL_CONFIG.walkFrameDuration,
      loop: true
    }),
    returnHomeRun: Object.freeze({
      frames: Object.freeze([
        "assets/sweetie/sweetie_run_01.png",
        "assets/sweetie/sweetie_run_02.png",
        "assets/sweetie/sweetie_run_03.png",
        "assets/sweetie/sweetie_run_04.png"
      ]),
      fallback: "idle",
      frameDuration: SWEETIE_STROLL_CONFIG.runHomeFrameDuration,
      loop: true
    })
  });
  const dom = {
    sweetieRoamLayer: document.querySelector("#sweetie-roam-layer"),
    sweetie: document.querySelector("#sweetie-character"),
    sweetieImage: document.querySelector("#sweetie-sprite"),
    beachScene: document.querySelector(".beach-scene"),
    moodProp: document.querySelector("#mood-prop"),
    actionLabel: document.querySelector("#action-label"),
    actionProp: document.querySelector("#action-prop"),
    floatingEffects: document.querySelector("#floating-effects"),
    messageCard: document.querySelector(".message-card"),
    inventoryCard: document.querySelector(".inventory-card"),
    hotDogStand: document.querySelector(".hot-dog-stand"),
    standImage: document.querySelector(".hot-dog-stand-asset"),
    standSpeechBubble: document.querySelector("#stand-speech-bubble"),
    soundToggle: document.querySelector("#sound-toggle"),
    soundLabel: document.querySelector("#sound-label"),
    moodBadge: document.querySelector("#mood-badge"),
    moodIcon: document.querySelector("#mood-icon"),
    sceneMood: document.querySelector("#scene-mood"),
    thoughtBubble: document.querySelector("#thought-bubble"),
    treatCount: document.querySelector("#treat-count"),
    messageText: document.querySelector("#message-text"),
    saveLabel: document.querySelector("#save-label"),
    standButton: document.querySelector("#stand-button"),
    standNote: document.querySelector("#stand-note"),
    questButton: document.querySelector("#quest-button"),
    questNote: document.querySelector("#quest-note"),
    questLock: document.querySelector("#quest-lock"),
    noteButton: document.querySelector("#note-button"),
    noteCopy: document.querySelector("#note-copy"),
    careActionButtons: Array.from(document.querySelectorAll("[data-action]"))
      .filter((button) => SWEETIE_CARE_ACTIONS.includes(button.dataset.action)),
    welcomeScreen: document.querySelector("#welcome-screen"),
    startButton: document.querySelector("#start-button"),
    dialog: document.querySelector("#feature-dialog"),
    dialogTitle: document.querySelector("#dialog-title"),
    dialogMessage: document.querySelector("#dialog-message"),
    dialogIcon: document.querySelector("#dialog-icon"),
    dialogClose: document.querySelector("#dialog-close"),
    dialogOk: document.querySelector("#dialog-ok")
  };

  applyStaticCopy();

  const audioManager = createAudioManager();
  const loaded = loadState();
  let state = loaded.state;
  let currentSweetiePose = "idle";
  let currentSweetieSource = null;
  let currentSweetieMood = "happy";
  let activeSweetieAction = null;
  let sweetieAssetRequestId = 0;
  let sweetieAnimationToken = 0;
  let sweetieFrameTimer = 0;
  let currentSweetieAnimationName = null;
  let sweetieBlinkToken = 0;
  let sweetieBlinkScheduleTimer = 0;
  let sweetieBlinkFrameTimer = 0;
  let isSweetieSequencePlaying = false;
  let reactionTimer = 0;
  let thoughtBubbleScheduleTimer = 0;
  let thoughtBubbleVisibleTimer = 0;
  let isThoughtBubbleVisible = false;
  let standSpeechTimer = 0;
  let standTalkTimer = 0;
  let standTalkToken = 0;
  let isStandTalking = false;
  let currentStandPose = "idle";
  let actionLabelTimer = 0;
  let actionPropTimer = 0;
  let saveStatusTimer = 0;
  let idleScheduleTimer = 0;
  let idleBehaviorTimer = 0;
  let currentIdleBehavior = null;
  let isActionPlaying = false;
  let isSweetieStrolling = false;
  let isSweetieReturningHome = false;
  let pendingSweetieAction = null;
  let sweetieStrollState = "home";
  let sweetieStrollToken = 0;
  let sweetieStrollScheduleTimer = 0;
  let sweetieStrollStepTimer = 0;
  let sweetieStrollStepResolve = null;
  let sweetieReturnToken = 0;
  let sweetieReturnTimer = 0;
  let sweetieReturnResolve = null;
  let sweetieDepthAnimationFrame = 0;
  let sceneDepthRefreshFrame = 0;
  let currentSweetieRoamPosition = { ...SWEETIE_STROLL_CONFIG.home };
  let lastInteractionAt = Date.now();
  const pulseTimers = new WeakMap();
  const sweetieSourceStatus = new Map();
  const sweetieSourcePromises = new Map();
  const sweetieAnimationPromises = new Map();
  const warnedSweetieSources = new Set();
  const beachAssetStatus = new Map();
  const beachAssetPromises = new Map();
  const warnedBeachAssets = new Set();
  const decodedImagePromises = new Map();
  const imageAssetDimensions = new Map();
  const warnedFrameDimensionGroups = new Set();

  function clamp(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function loadSoundPreference() {
    try {
      return localStorage.getItem(AUDIO_PREFERENCE_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function createAudioManager() {
    const audioElements = new Map();
    const warnedAssets = new Set();
    const lastPlayedAt = new Map();
    let soundEnabled = loadSoundPreference();
    let audioUnlocked = false;

    const warnOnce = (key, message) => {
      if (warnedAssets.has(key)) return;
      warnedAssets.add(key);
      console.warn(`[Sweetie audio] ${message}`);
    };

    const savePreference = () => {
      try {
        localStorage.setItem(AUDIO_PREFERENCE_KEY, soundEnabled ? "true" : "false");
      } catch (error) {
        warnOnce("preference", "The sound preference could not be saved on this device.");
      }
    };

    const getAudioElement = (key) => {
      if (!AUDIO_ASSETS[key]) return null;
      if (audioElements.has(key)) return audioElements.get(key);
      if (typeof Audio !== "function") {
        warnOnce(key, "Browser audio is unavailable; continuing without sound.");
        return null;
      }

      const audio = new Audio(AUDIO_ASSETS[key]);
      audio.preload = "auto";
      audio.addEventListener("error", () => {
        warnOnce(key, `Optional audio file not found at ${AUDIO_ASSETS[key]}; continuing silently.`);
      });
      audioElements.set(key, audio);
      return audio;
    };

    const attemptPlayback = (key, audio) => {
      if (!audio) return false;
      try {
        const playback = audio.play();
        if (playback && typeof playback.catch === "function") {
          playback.catch(() => warnOnce(key, `Playback was unavailable for ${AUDIO_ASSETS[key]}; continuing silently.`));
        }
        return true;
      } catch (error) {
        warnOnce(key, `Playback was unavailable for ${AUDIO_ASSETS[key]}; continuing silently.`);
        return false;
      }
    };

    const stopAmbient = (key = "oceanWaves") => {
      const audio = audioElements.get(key);
      if (!audio) return false;
      audio.pause();
      return true;
    };

    const startAmbient = (key = "oceanWaves") => {
      if (!soundEnabled || !audioUnlocked || document.hidden) return false;
      const audio = getAudioElement(key);
      if (!audio) return false;
      audio.loop = true;
      audio.volume = AUDIO_CONFIG.ambientVolume;
      if (!audio.paused) return true;
      return attemptPlayback(key, audio);
    };

    const stopAll = () => {
      audioElements.forEach((audio) => audio.pause());
    };

    const setSoundEnabled = (enabled) => {
      soundEnabled = Boolean(enabled);
      savePreference();
      if (soundEnabled) startAmbient("oceanWaves");
      else stopAll();
      return soundEnabled;
    };

    const unlock = () => {
      if (audioUnlocked) return true;
      audioUnlocked = true;
      if (soundEnabled) startAmbient("oceanWaves");
      return audioUnlocked;
    };

    const playSound = (key) => {
      if (!soundEnabled || !audioUnlocked || document.hidden) return false;
      const cooldown = key === "duckQuack" ? AUDIO_CONFIG.duckQuackCooldownMs : 0;
      const now = Date.now();
      if (cooldown && now - (lastPlayedAt.get(key) || 0) < cooldown) return false;

      const audio = getAudioElement(key);
      if (!audio) return false;
      lastPlayedAt.set(key, now);
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch (error) {
        // Some browsers do not expose currentTime until media metadata is available.
      }
      audio.loop = false;
      audio.volume = AUDIO_CONFIG.effectVolume;
      return attemptPlayback(key, audio);
    };

    return {
      setSoundEnabled,
      getSoundEnabled: () => soundEnabled,
      playSound,
      startAmbient,
      stopAmbient,
      toggleSound: () => setSoundEnabled(!soundEnabled),
      unlock,
      isUnlocked: () => audioUnlocked
    };
  }

  function syncSoundToggle() {
    const enabled = audioManager.getSoundEnabled();
    const label = enabled
      ? getCopy("audio.soundOn", "Sound: On")
      : getCopy("audio.soundOff", "Sound: Off");
    dom.soundLabel.textContent = label;
    dom.soundToggle.setAttribute("aria-label", label);
    dom.soundToggle.setAttribute("aria-pressed", String(enabled));
    dom.soundToggle.classList.toggle("is-enabled", enabled);
  }

  function warnMissingSweetieSource(label, src) {
    if (warnedSweetieSources.has(src)) return;
    warnedSweetieSources.add(src);
    console.warn(`[Sweetie assets] Missing ${label} at ${src}; using the next available fallback.`);
  }

  function warnMissingBeachAsset(label, src) {
    if (warnedBeachAssets.has(src)) return;
    warnedBeachAssets.add(src);
    console.warn(`[Beach assets] Optional ${label} not found at ${src}; keeping the CSS fallback.`);
  }

  function loadAndDecodeImage(src) {
    if (decodedImagePromises.has(src)) return decodedImagePromises.get(src);

    const promise = new Promise((resolve, reject) => {
      const probe = new Image();
      probe.decoding = "async";
      probe.onload = async () => {
        try {
          if (typeof probe.decode === "function") await probe.decode();
        } catch (error) {
          // Some browsers reject decode() for an otherwise usable, fully loaded image.
          if (!probe.complete || probe.naturalWidth <= 0) {
            reject(error);
            return;
          }
        }

        imageAssetDimensions.set(src, {
          width: probe.naturalWidth,
          height: probe.naturalHeight
        });
        resolve(probe);
      };
      probe.onerror = () => reject(new Error(`Unable to load image asset: ${src}`));
      probe.src = src;
    });

    decodedImagePromises.set(src, promise);
    return promise;
  }

  function warnFrameDimensionMismatch(groupName, frameSources) {
    if (warnedFrameDimensionGroups.has(groupName)) return;
    const frames = frameSources
      .map((src) => ({ src, dimensions: imageAssetDimensions.get(src) }))
      .filter((frame) => frame.dimensions);
    if (frames.length < 2) return;

    const first = frames[0].dimensions;
    const hasMismatch = frames.some(({ dimensions }) => (
      dimensions.width !== first.width || dimensions.height !== first.height
    ));
    if (!hasMismatch) return;

    warnedFrameDimensionGroups.add(groupName);
    const details = frames
      .map(({ src, dimensions }) => `${src} (${dimensions.width}x${dimensions.height})`)
      .join(", ");
    console.warn(`[Animation assets] ${groupName} frames use different canvas sizes: ${details}. The stable wrapper prevents layout shifts, but matching canvases and feet anchors will reduce artwork jitter.`);
  }

  function preloadBeachAsset(src, label, { warnIfMissing = true } = {}) {
    if (!src) return Promise.resolve(false);
    if (beachAssetPromises.has(src)) return beachAssetPromises.get(src);

    beachAssetStatus.set(src, "loading");
    const promise = loadAndDecodeImage(src)
      .then(() => {
        beachAssetStatus.set(src, "ready");
        return true;
      })
      .catch(() => {
        beachAssetStatus.set(src, "missing");
        if (warnIfMissing) warnMissingBeachAsset(label, src);
        return false;
      });
    beachAssetPromises.set(src, promise);
    return promise;
  }

  function activateBeachAssetElement(element) {
    const sceneKey = element.dataset.beachSceneAsset;
    const propKey = element.dataset.beachPropAsset;
    const isSceneAsset = Boolean(sceneKey);
    const key = sceneKey || propKey;
    const registry = isSceneAsset ? BEACH_SCENE_ASSETS : BEACH_PROP_ASSETS;
    const src = registry[key];
    if (!key || !src) return;

    preloadBeachAsset(src, `${isSceneAsset ? "scene layer" : "prop"} "${key}"`, {
      warnIfMissing: propKey !== "standOwner"
    }).then((isReady) => {
      if (!isReady) return;
      if (element.tagName === "IMG") {
        element.setAttribute("src", src);
      } else {
        element.style.backgroundImage = `url("${src}")`;
      }
      element.classList.add("asset-ready");
      const parentReadyClass = propKey === "standOwner" ? "has-stand-owner-asset" : "has-image-asset";
      element.parentElement?.classList.add(parentReadyClass);
      if (propKey) scheduleSceneDepthRefresh();
    });
  }

  function initializeBeachAssets() {
    document.querySelectorAll("[data-beach-scene-asset], [data-beach-prop-asset]")
      .forEach(activateBeachAssetElement);
  }

  function initializeStandTalkingAssets() {
    ["hotDogStandTalk", "hotDogStandTalk02"].forEach((key) => {
      preloadBeachAsset(BEACH_PROP_ASSETS[key], `stand talking frame "${key}"`, { warnIfMissing: false });
    });
  }
  function preloadSweetieSource(src, label = `sprite ${src}`) {
    if (!src) return Promise.resolve(false);
    if (sweetieSourcePromises.has(src)) return sweetieSourcePromises.get(src);

    sweetieSourceStatus.set(src, "loading");
    const promise = loadAndDecodeImage(src)
      .then(() => {
        sweetieSourceStatus.set(src, "ready");
        return true;
      })
      .catch(() => {
        sweetieSourceStatus.set(src, "missing");
        warnMissingSweetieSource(label, src);
        return false;
      });
    sweetieSourcePromises.set(src, promise);
    return promise;
  }

  function preloadSweetieAsset(key) {
    return preloadSweetieSource(SWEETIE_ASSETS[key], `"${key}" sprite`);
  }

  function preloadSweetieAnimation(name) {
    if (sweetieAnimationPromises.has(name)) return sweetieAnimationPromises.get(name);
    const animation = SWEETIE_ANIMATIONS[name];
    if (!animation) return Promise.resolve(false);

    const promise = Promise.all(animation.frames.map((src, index) => (
      preloadSweetieSource(src, `"${name}" frame ${String(index + 1).padStart(2, "0")}`)
    ))).then((results) => {
      const isReady = results.every(Boolean);
      if (isReady) warnFrameDimensionMismatch(`Sweetie "${name}" animation`, animation.frames);
      return isReady;
    });
    sweetieAnimationPromises.set(name, promise);
    return promise;
  }

  function markSweetieAssetLoaded() {
    if (currentSweetieSource) sweetieSourceStatus.set(currentSweetieSource, "ready");
    dom.sweetie.classList.remove("asset-loading", "asset-empty");
    if (currentSweetiePose === "idle") scheduleSweetieBlink();
  }

  function showSweetiePlaceholder() {
    stopSweetieBlink(false);
    currentSweetiePose = "placeholder";
    currentSweetieSource = null;
    dom.sweetie.dataset.pose = "placeholder";
    dom.sweetieImage.removeAttribute("src");
    dom.sweetie.classList.remove("asset-loading");
    dom.sweetie.classList.add("asset-empty");
  }

  function applySweetieSource(src, pose) {
    const hasVisibleFrame = dom.sweetieImage.complete && dom.sweetieImage.naturalWidth > 0;
    currentSweetiePose = pose;
    currentSweetieSource = src;
    dom.sweetie.dataset.pose = pose;
    dom.sweetie.classList.remove("asset-empty");

    if (dom.sweetieImage.getAttribute("src") === src && dom.sweetieImage.complete && dom.sweetieImage.naturalWidth > 0) {
      markSweetieAssetLoaded();
      return;
    }

    dom.sweetie.classList.toggle("asset-loading", !hasVisibleFrame);
    dom.sweetieImage.setAttribute("src", src);
  }

  function applySweetieAsset(key) {
    applySweetieSource(SWEETIE_ASSETS[key], key);
  }

  function requestSweetieAsset(candidates) {
    const requestId = ++sweetieAssetRequestId;
    const uniqueCandidates = [...new Set(candidates.filter((key) => SWEETIE_ASSETS[key]))];

    return (async () => {
      for (const key of uniqueCandidates) {
        if (await preloadSweetieAsset(key)) {
          if (requestId !== sweetieAssetRequestId) return currentSweetiePose;
          applySweetieAsset(key);
          return key;
        }
      }
      if (requestId === sweetieAssetRequestId) showSweetiePlaceholder();
      return currentSweetiePose;
    })();
  }

  function getSweetieMoodAssetKey() {
    return SWEETIE_MOOD_ASSET_KEYS[currentSweetieMood] || "idle";
  }

  function getSweetieMoodAnimationName() {
    return SWEETIE_MOOD_ANIMATION_KEYS[currentSweetieMood] || null;
  }

  function isSweetieMoodAnimation(animationName = currentSweetieAnimationName) {
    return Boolean(animationName) && Object.values(SWEETIE_MOOD_ANIMATION_KEYS).includes(animationName);
  }

  function canRunSweetieMoodAnimation(animationName = getSweetieMoodAnimationName()) {
    if (!animationName || reducedMotionQuery.matches) return false;
    const animation = SWEETIE_ANIMATIONS[animationName];
    return Boolean(animation)
      && animation.mood === currentSweetieMood
      && state.hasStarted
      && dom.welcomeScreen.hidden
      && !activeSweetieAction
      && !isActionPlaying
      && !isSweetieStrolling
      && !isSweetieReturningHome
      && !currentIdleBehavior
      && !document.hidden;
  }

  function clearSweetieBlinkTimers() {
    window.clearTimeout(sweetieBlinkScheduleTimer);
    window.clearTimeout(sweetieBlinkFrameTimer);
    sweetieBlinkScheduleTimer = 0;
    sweetieBlinkFrameTimer = 0;
  }

  function stopSweetieBlink(restoreOpenFrame = false) {
    sweetieBlinkToken += 1;
    clearSweetieBlinkTimers();
    const blink = SWEETIE_ANIMATIONS.idleBlink;
    if (restoreOpenFrame && currentSweetiePose === "idle-blink" && sweetieSourceStatus.get(blink.frames[0]) === "ready") {
      applySweetieSource(blink.frames[0], "idle");
    }
  }

  function canSweetieBlink() {
    const blink = SWEETIE_ANIMATIONS.idleBlink;
    return !activeSweetieAction
      && !isActionPlaying
      && !isSweetieSequencePlaying
      && !isSweetieStrolling
      && !isSweetieReturningHome
      && !document.hidden
      && currentSweetiePose === "idle"
      && currentSweetieSource === blink.frames[0];
  }

  function scheduleSweetieBlink() {
    window.clearTimeout(sweetieBlinkScheduleTimer);
    sweetieBlinkScheduleTimer = 0;
    if (!canSweetieBlink()) return;

    const blink = SWEETIE_ANIMATIONS.idleBlink;
    const token = ++sweetieBlinkToken;
    const delay = blink.minInterval + Math.random() * (blink.maxInterval - blink.minInterval);
    sweetieBlinkScheduleTimer = window.setTimeout(() => {
      if (token !== sweetieBlinkToken || !canSweetieBlink()) return;
      applySweetieSource(blink.frames[1], "idle-blink");
      sweetieBlinkFrameTimer = window.setTimeout(() => {
        if (token !== sweetieBlinkToken || activeSweetieAction || isActionPlaying || isSweetieSequencePlaying || document.hidden) return;
        applySweetieSource(blink.frames[0], "idle");
        scheduleSweetieBlink();
      }, blink.blinkFrameDuration);
    }, delay);
  }

  async function enableSweetieIdleBlink() {
    const blink = SWEETIE_ANIMATIONS.idleBlink;
    if (!await preloadSweetieAnimation("idleBlink")) return false;
    if (activeSweetieAction || isActionPlaying || isSweetieSequencePlaying || isSweetieStrolling || isSweetieReturningHome || document.hidden) return false;
    applySweetieSource(blink.frames[0], "idle");
    scheduleSweetieBlink();
    return true;
  }

  async function enableSweetieMoodAnimation() {
    const animationName = getSweetieMoodAnimationName();
    if (!canRunSweetieMoodAnimation(animationName)) return false;
    if (!await preloadSweetieAnimation(animationName)) return false;
    if (!canRunSweetieMoodAnimation(animationName)) return false;
    return playSweetieAnimation(animationName, { holdUntilStopped: true });
  }

  function syncSweetieSprite() {
    if (isSweetieSequencePlaying) {
      if (isSweetieMoodAnimation(currentSweetieAnimationName) && !canRunSweetieMoodAnimation(currentSweetieAnimationName)) {
        stopSweetieAnimation(false);
      } else {
        return Promise.resolve(currentSweetiePose);
      }
    }

    const actionKey = SWEETIE_ACTION_ASSET_KEYS[activeSweetieAction];
    return requestSweetieAsset([actionKey, getSweetieMoodAssetKey(), "idle"]).then(async (selectedKey) => {
      if (!activeSweetieAction && !isActionPlaying) {
        if (await enableSweetieMoodAnimation()) return currentSweetiePose;
        if (selectedKey === "idle") await enableSweetieIdleBlink();
        else stopSweetieBlink(false);
      } else {
        stopSweetieBlink(false);
      }
      return currentSweetiePose;
    });
  }

  function stopSweetieAnimation(restoreSprite = true) {
    sweetieAnimationToken += 1;
    window.clearTimeout(sweetieFrameTimer);
    sweetieFrameTimer = 0;
    isSweetieSequencePlaying = false;
    currentSweetieAnimationName = null;
    if (restoreSprite) syncSweetieSprite();
  }

  async function playSweetieAnimation(actionName, { holdUntilStopped = false, requireActiveAction = false } = {}) {
    const animationName = SWEETIE_ACTION_ASSET_KEYS[actionName] || actionName;
    const animation = SWEETIE_ANIMATIONS[animationName];
    stopSweetieAnimation(false);
    stopSweetieBlink(false);
    const token = sweetieAnimationToken;
    if (!animation || !await preloadSweetieAnimation(animationName)) {
      if (token === sweetieAnimationToken) syncSweetieSprite();
      return false;
    }
    if (token !== sweetieAnimationToken || (requireActiveAction && activeSweetieAction !== actionName)) return false;

    sweetieAssetRequestId += 1;
    isSweetieSequencePlaying = true;
    currentSweetieAnimationName = animationName;
    let frameIndex = 0;
    applySweetieSource(animation.frames[frameIndex], `${animationName}-frame-${frameIndex + 1}`);

    const advanceFrame = () => {
      if (token !== sweetieAnimationToken || !isSweetieSequencePlaying) return;
      frameIndex += 1;
      if (frameIndex >= animation.frames.length) {
        if (!animation.loop) {
          sweetieFrameTimer = 0;
          if (!holdUntilStopped) {
            isSweetieSequencePlaying = false;
            currentSweetieAnimationName = null;
            syncSweetieSprite();
          }
          return;
        }
        frameIndex = 0;
      }
      applySweetieSource(animation.frames[frameIndex], `${animationName}-frame-${frameIndex + 1}`);
      sweetieFrameTimer = window.setTimeout(advanceFrame, animation.frameDuration);
    };
    sweetieFrameTimer = window.setTimeout(advanceFrame, animation.frameDuration);
    return true;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function setSweetieStrollState(stateName) {
    sweetieStrollState = stateName;
    dom.sweetieRoamLayer.dataset.strollState = stateName;
  }

  function setSweetieFacing(direction) {
    dom.sweetieRoamLayer.dataset.facing = direction === "left" ? "left" : "right";
  }

  function sceneDepthFromNormalizedY(normalizedY, depthOffset = 0) {
    const clampedY = Math.max(0, Math.min(1, Number(normalizedY) || 0));
    const depthRange = SCENE_DEPTH_CONFIG.maxObjectZ - SCENE_DEPTH_CONFIG.minObjectZ;
    return SCENE_DEPTH_CONFIG.minObjectZ + Math.round(clampedY * depthRange) + depthOffset;
  }

  function updateFixedSceneDepth() {
    const sceneRect = dom.beachScene.getBoundingClientRect();
    const sceneHeight = sceneRect.height || dom.beachScene.clientHeight || 1;

    SCENE_DEPTH_CONFIG.objects.forEach((item) => {
      const element = dom.beachScene.querySelector(item.selector);
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const relativeTop = Number.isFinite(rect.top) && Number.isFinite(sceneRect.top)
        ? rect.top - sceneRect.top
        : element.offsetTop || 0;
      const elementHeight = rect.height || element.offsetHeight || 0;
      const baseY = relativeTop + elementHeight * item.anchorRatio;
      const normalizedY = baseY / sceneHeight;
      const zIndex = sceneDepthFromNormalizedY(normalizedY, item.depthOffset);
      element.style.zIndex = String(zIndex);
      element.dataset.depthBaseY = normalizedY.toFixed(3);
      element.dataset.depthZ = String(zIndex);
    });
  }

  function scheduleSceneDepthRefresh() {
    if (typeof window.requestAnimationFrame !== "function") {
      window.setTimeout(updateFixedSceneDepth, 0);
      return;
    }
    if (sceneDepthRefreshFrame && typeof window.cancelAnimationFrame === "function") {
      window.cancelAnimationFrame(sceneDepthRefreshFrame);
    }
    sceneDepthRefreshFrame = window.requestAnimationFrame(() => {
      sceneDepthRefreshFrame = 0;
      updateFixedSceneDepth();
    });
  }

  function updateSweetieSceneDepth(normalizedY) {
    const zIndex = sceneDepthFromNormalizedY(normalizedY);
    dom.sweetieRoamLayer.style.zIndex = String(zIndex);
    dom.sweetieRoamLayer.dataset.depthBaseY = Number(normalizedY).toFixed(3);
    dom.sweetieRoamLayer.dataset.depthZ = String(zIndex);
  }

  function animateSweetieSceneDepth(fromY, toY, duration) {
    if (sweetieDepthAnimationFrame && typeof window.cancelAnimationFrame === "function") {
      window.cancelAnimationFrame(sweetieDepthAnimationFrame);
      sweetieDepthAnimationFrame = 0;
    }
    if (duration <= 0 || fromY === toY || typeof window.requestAnimationFrame !== "function") {
      updateSweetieSceneDepth(toY);
      return;
    }

    let startedAt = null;
    const step = (timestamp) => {
      if (startedAt === null) startedAt = timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const easedProgress = progress * progress * (3 - 2 * progress);
      updateSweetieSceneDepth(fromY + (toY - fromY) * easedProgress);
      if (progress < 1) {
        sweetieDepthAnimationFrame = window.requestAnimationFrame(step);
      } else {
        sweetieDepthAnimationFrame = 0;
      }
    };
    sweetieDepthAnimationFrame = window.requestAnimationFrame(step);
  }
  function setSweetieRoamPosition(position, duration = 0) {
    const previousPosition = currentSweetieRoamPosition;
    currentSweetieRoamPosition = { ...position };
    const sceneWidth = dom.beachScene.clientWidth || dom.beachScene.getBoundingClientRect().width || 1;
    const sceneHeight = dom.beachScene.clientHeight || dom.beachScene.getBoundingClientRect().height || 1;
    const home = SWEETIE_STROLL_CONFIG.home;
    const xOffset = (position.x - home.x) * sceneWidth;
    const yOffset = (position.y - home.y) * sceneHeight;

    dom.sweetieRoamLayer.style.setProperty("--sweetie-roam-duration", String(Math.max(0, duration)) + "ms");
    dom.sweetieRoamLayer.style.setProperty("--sweetie-roam-x", String(xOffset) + "px");
    dom.sweetieRoamLayer.style.setProperty("--sweetie-roam-y", String(yOffset) + "px");
    dom.sweetieRoamLayer.style.setProperty("--sweetie-roam-scale", position.scale);
    animateSweetieSceneDepth(previousPosition.y, position.y, Math.max(0, duration));
  }

  function getSweetieStrollLane() {
    const sceneWidth = dom.beachScene.clientWidth || dom.beachScene.getBoundingClientRect().width || 1;
    const layerWidth = dom.sweetieRoamLayer.offsetWidth || dom.sweetieRoamLayer.clientWidth || 330;
    const scaledHalfWidth = layerWidth * SWEETIE_STROLL_CONFIG.waterline.scale * 0.5;
    const offscreenBuffer = Math.max(
      SWEETIE_STROLL_CONFIG.xRange.minOffscreenBuffer,
      scaledHalfWidth / sceneWidth + SWEETIE_STROLL_CONFIG.xRange.offscreenPadding
    );

    return {
      leftOffscreen: -offscreenBuffer,
      leftVisible: SWEETIE_STROLL_CONFIG.xRange.leftVisible,
      rightVisible: SWEETIE_STROLL_CONFIG.xRange.rightVisible,
      rightOffscreen: 1 + offscreenBuffer
    };
  }

  function clearSweetieStrollStep(resolveValue = false) {
    window.clearTimeout(sweetieStrollStepTimer);
    sweetieStrollStepTimer = 0;
    if (sweetieStrollStepResolve) {
      const resolveStep = sweetieStrollStepResolve;
      sweetieStrollStepResolve = null;
      resolveStep(resolveValue);
    }
  }

  function waitForSweetieStrollStep(duration, token) {
    clearSweetieStrollStep(false);
    return new Promise((resolve) => {
      sweetieStrollStepResolve = resolve;
      sweetieStrollStepTimer = window.setTimeout(() => {
        sweetieStrollStepTimer = 0;
        sweetieStrollStepResolve = null;
        resolve(token === sweetieStrollToken && isSweetieStrolling);
      }, duration + 30);
    });
  }

  function clearSweetieReturnStep(resolveValue = false) {
    window.clearTimeout(sweetieReturnTimer);
    sweetieReturnTimer = 0;
    if (sweetieReturnResolve) {
      const resolveReturn = sweetieReturnResolve;
      sweetieReturnResolve = null;
      resolveReturn(resolveValue);
    }
  }

  function waitForSweetieReturnHomeStep(duration, token) {
    clearSweetieReturnStep(false);
    if (duration <= 0) return Promise.resolve(token === sweetieReturnToken && isSweetieReturningHome);
    return new Promise((resolve) => {
      sweetieReturnResolve = resolve;
      sweetieReturnTimer = window.setTimeout(() => {
        sweetieReturnTimer = 0;
        sweetieReturnResolve = null;
        resolve(token === sweetieReturnToken && isSweetieReturningHome);
      }, duration + 30);
    });
  }

  function isSweetieCareAction(action) {
    return SWEETIE_CARE_ACTIONS.includes(action);
  }

  function isSweetieAtHome() {
    const home = SWEETIE_STROLL_CONFIG.home;
    return sweetieStrollState === "home"
      && Math.abs(currentSweetieRoamPosition.x - home.x) < 0.001
      && Math.abs(currentSweetieRoamPosition.y - home.y) < 0.001
      && Math.abs(currentSweetieRoamPosition.scale - home.scale) < 0.001;
  }

  function showReturningHomeMessage() {
    showMessage(pick(messages.returningHome));
  }

  function setSweetieCareActionsLocked(isLocked) {
    dom.careActionButtons.forEach((button) => {
      button.classList.toggle("is-return-locked", isLocked);
      if (isLocked) button.setAttribute("aria-disabled", "true");
      else button.removeAttribute("aria-disabled");
    });
  }

  function canStartSweetieStroll() {
    return SWEETIE_STROLL_CONFIG.enabled
      && state.hasStarted
      && dom.welcomeScreen.hidden
      && !dom.dialog.open
      && !document.hidden
      && !reducedMotionQuery.matches
      && !isSweetieStrolling
      && !isSweetieReturningHome
      && !pendingSweetieAction
      && !isActionPlaying
      && !activeSweetieAction
      && !isSweetieSequencePlaying
      && !currentIdleBehavior
      && Date.now() - lastInteractionAt >= SWEETIE_STROLL_CONFIG.idleDelayMin;
  }

  function scheduleSweetieStroll(delay = randomBetween(
    SWEETIE_STROLL_CONFIG.idleDelayMin,
    SWEETIE_STROLL_CONFIG.idleDelayMax
  )) {
    window.clearTimeout(sweetieStrollScheduleTimer);
    sweetieStrollScheduleTimer = 0;
    if (!SWEETIE_STROLL_CONFIG.enabled || !state.hasStarted || reducedMotionQuery.matches) return;

    sweetieStrollScheduleTimer = window.setTimeout(() => {
      sweetieStrollScheduleTimer = 0;
      if (!canStartSweetieStroll()) {
        scheduleSweetieStroll(SWEETIE_STROLL_CONFIG.retryDelay);
        return;
      }
      startSweetieStroll();
    }, delay);
  }

  async function startSweetieWalkCycle(token) {
    const hasWalkFrames = await playSweetieAnimation("walk", { holdUntilStopped: true });
    if (token !== sweetieStrollToken || !isSweetieStrolling) return false;
    dom.sweetieRoamLayer.classList.toggle("walk-fallback", !hasWalkFrames);
    return hasWalkFrames;
  }

  function finishSweetieStroll(token) {
    if (token !== sweetieStrollToken || !isSweetieStrolling) return false;
    isSweetieStrolling = false;
    dom.sweetieRoamLayer.classList.remove("is-strolling", "walk-fallback");
    setSweetieStrollState("home");
    setSweetieFacing("right");
    setSweetieRoamPosition(SWEETIE_STROLL_CONFIG.home, 0);
    stopSweetieAnimation(false);
    syncSweetieSprite();
    syncThoughtBubble();
    scheduleIdleBehavior();
    scheduleSweetieStroll();
    return true;
  }

  function cancelSweetieStroll({ restoreSprite = true, resetPosition = true } = {}) {
    window.clearTimeout(sweetieStrollScheduleTimer);
    sweetieStrollScheduleTimer = 0;
    sweetieStrollToken += 1;
    clearSweetieStrollStep(false);

    isSweetieStrolling = false;
    dom.sweetieRoamLayer.classList.remove("is-strolling", "walk-fallback");
    if (resetPosition) {
      setSweetieStrollState("home");
      setSweetieFacing("right");
      setSweetieRoamPosition(SWEETIE_STROLL_CONFIG.home, 0);
    }
    stopSweetieAnimation(false);
    if (restoreSprite) syncSweetieSprite();
  }

  function stopSweetieReturnHome({ resetPosition = false, restoreSprite = true, clearPending = false } = {}) {
    sweetieReturnToken += 1;
    clearSweetieReturnStep(false);
    isSweetieReturningHome = false;
    dom.sweetieRoamLayer.classList.remove("is-returning-home", "run-fallback");
    setSweetieCareActionsLocked(false);
    if (clearPending) pendingSweetieAction = null;
    if (resetPosition) {
      setSweetieStrollState("home");
      setSweetieFacing("right");
      setSweetieRoamPosition(SWEETIE_STROLL_CONFIG.home, 0);
    }
    stopSweetieAnimation(false);
    if (restoreSprite) syncSweetieSprite();
  }

  function finishSweetieReturnHome(token) {
    if (token !== sweetieReturnToken || !isSweetieReturningHome) return false;
    clearSweetieReturnStep(false);
    isSweetieReturningHome = false;
    dom.sweetieRoamLayer.classList.remove("is-returning-home", "run-fallback");
    setSweetieStrollState("home");
    setSweetieFacing("right");
    setSweetieRoamPosition(SWEETIE_STROLL_CONFIG.home, 0);
    setSweetieCareActionsLocked(false);
    stopSweetieAnimation(false);

    const queuedAction = pendingSweetieAction;
    pendingSweetieAction = null;
    if (queuedAction) {
      runActionNow(queuedAction.action, queuedAction.button);
    } else {
      syncSweetieSprite();
      syncThoughtBubble();
      scheduleIdleBehavior();
      scheduleSweetieStroll();
    }
    return true;
  }

  async function startSweetieReturnHome({ pendingAction = null } = {}) {
    if (pendingAction && !pendingSweetieAction) pendingSweetieAction = pendingAction;
    if (isSweetieReturningHome) {
      setSweetieCareActionsLocked(true);
      return false;
    }

    window.clearTimeout(sweetieStrollScheduleTimer);
    window.clearTimeout(idleScheduleTimer);
    clearIdleBehavior();
    hideThoughtBubble();
    stopSweetieBlink(false);
    cancelSweetieStroll({ restoreSprite: false, resetPosition: false });

    const token = ++sweetieReturnToken;
    const duration = reducedMotionQuery.matches ? 0 : SWEETIE_STROLL_CONFIG.returnDuration;
    isSweetieReturningHome = true;
    setSweetieCareActionsLocked(true);
    dom.sweetieRoamLayer.classList.add("is-returning-home");
    dom.sweetieRoamLayer.classList.remove("walk-fallback");
    setSweetieStrollState("returningHome");
    setSweetieFacing("right");

    const hasRunFrames = reducedMotionQuery.matches
      ? false
      : await playSweetieAnimation("returnHomeRun", { holdUntilStopped: true });
    if (token !== sweetieReturnToken || !isSweetieReturningHome) return false;

    dom.sweetieRoamLayer.classList.toggle("run-fallback", !hasRunFrames && duration > 0);
    setSweetieRoamPosition(SWEETIE_STROLL_CONFIG.home, duration);
    if (!await waitForSweetieReturnHomeStep(duration, token)) return false;
    return finishSweetieReturnHome(token);
  }

  async function startSweetieStroll() {
    if (!canStartSweetieStroll()) return false;

    window.clearTimeout(sweetieStrollScheduleTimer);
    window.clearTimeout(idleScheduleTimer);
    clearIdleBehavior();
    stopSweetieBlink(true);
    hideThoughtBubble();

    const token = ++sweetieStrollToken;
    const lane = getSweetieStrollLane();
    const firstDirection = Math.random() >= 0.5 ? "right" : "left";
    const firstVisibleX = firstDirection === "right" ? lane.leftVisible : lane.rightVisible;
    const farPosition = {
      x: firstVisibleX,
      y: SWEETIE_STROLL_CONFIG.waterline.y,
      scale: SWEETIE_STROLL_CONFIG.waterline.scale
    };

    isSweetieStrolling = true;
    dom.sweetieRoamLayer.classList.add("is-strolling");
    setSweetieStrollState("departing");
    setSweetieFacing(firstVisibleX < SWEETIE_STROLL_CONFIG.home.x ? "left" : "right");
    setSweetieRoamPosition(farPosition, SWEETIE_STROLL_CONFIG.departDuration);
    startSweetieWalkCycle(token);

    if (!await waitForSweetieStrollStep(SWEETIE_STROLL_CONFIG.departDuration, token)) return false;

    const directions = firstDirection === "right" ? ["right", "left"] : ["left", "right"];
    for (const direction of directions) {
      const offscreenX = direction === "right" ? lane.rightOffscreen : lane.leftOffscreen;
      const visibleX = direction === "right" ? lane.rightVisible : lane.leftVisible;
      const returnDirection = direction === "right" ? "left" : "right";
      const crossDuration = randomBetween(
        SWEETIE_STROLL_CONFIG.crossDurationMin,
        SWEETIE_STROLL_CONFIG.crossDurationMax
      );

      setSweetieStrollState("crossing-" + direction);
      setSweetieFacing(direction);
      setSweetieRoamPosition({
        x: offscreenX,
        y: SWEETIE_STROLL_CONFIG.waterline.y,
        scale: SWEETIE_STROLL_CONFIG.waterline.scale
      }, crossDuration);
      if (!await waitForSweetieStrollStep(crossDuration, token)) return false;

      setSweetieStrollState("offscreen-" + direction);
      const pauseDuration = randomBetween(
        SWEETIE_STROLL_CONFIG.offscreenPauseMin,
        SWEETIE_STROLL_CONFIG.offscreenPauseMax
      );
      if (!await waitForSweetieStrollStep(pauseDuration, token)) return false;

      const reentryDuration = randomBetween(
        SWEETIE_STROLL_CONFIG.reentryDurationMin,
        SWEETIE_STROLL_CONFIG.reentryDurationMax
      );
      setSweetieStrollState("reentering-" + returnDirection);
      setSweetieFacing(returnDirection);
      setSweetieRoamPosition({
        x: visibleX,
        y: SWEETIE_STROLL_CONFIG.waterline.y,
        scale: SWEETIE_STROLL_CONFIG.waterline.scale
      }, reentryDuration);
      if (!await waitForSweetieStrollStep(reentryDuration, token)) return false;
    }

    return startSweetieReturnHome();
  }
  function setSweetiePose(pose = "idle") {
    stopSweetieAnimation(false);
    stopSweetieBlink(false);
    const requestedKey = SWEETIE_ASSETS[pose] ? pose : "idle";
    return requestSweetieAsset([requestedKey, getSweetieMoodAssetKey(), "idle"]);
  }

  function handleSweetieAssetError() {
    const failedSource = currentSweetieSource;
    if (failedSource) {
      sweetieSourceStatus.set(failedSource, "missing");
      sweetieSourcePromises.set(failedSource, Promise.resolve(false));
      for (const [name, animation] of Object.entries(SWEETIE_ANIMATIONS)) {
        if (animation.frames.includes(failedSource)) sweetieAnimationPromises.delete(name);
      }
      warnMissingSweetieSource(`visible frame`, failedSource);
    }
    dom.sweetieImage.removeAttribute("src");
    currentSweetieSource = null;
    stopSweetieAnimation(false);
    stopSweetieBlink(false);
    syncSweetieSprite();
  }

  function normalizeState(saved) {
    const defaults = createDefaultState();
    const restored = { ...defaults, ...saved };
    restored.joy = clamp(saved.joy ?? saved.happiness ?? defaults.joy);
    restored.fullness = clamp(saved.fullness ?? saved.hunger ?? defaults.fullness);
    restored.energy = clamp(saved.energy ?? defaults.energy);
    restored.bond = clamp(saved.bond ?? defaults.bond);
    restored.treats = Math.max(0, Math.floor(Number(saved.treats) || 0));
    restored.hiddenNoteDiscovered = Boolean(saved.hiddenNoteDiscovered);
    restored.hasStarted = Boolean(saved.hasStarted);
    return restored;
  }

  function loadState() {
    try {
      const current = localStorage.getItem(SAVE_KEY);
      const legacy = localStorage.getItem(LEGACY_SAVE_KEY);
      const raw = current || legacy;
      if (!raw) return { state: createDefaultState(), isReturning: false };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid save");
      return { state: normalizeState(parsed), isReturning: Boolean(parsed.hasStarted) };
    } catch (error) {
      return { state: createDefaultState(), isReturning: false };
    }
  }

  function applyGentleDecay() {
    state.fullness = clamp(state.fullness - 0.4);
    state.energy = clamp(state.energy - 0.25);
    if (state.fullness < THOUGHT_BUBBLE_CONFIG.snackishFullnessThreshold || state.energy < 30) {
      state.joy = clamp(state.joy - 0.3);
    }
  }

  function saveState(showStatus = true) {
    state.lastSavedAt = Date.now();
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      localStorage.removeItem(LEGACY_SAVE_KEY);
      if (showStatus) {
        dom.saveLabel.textContent = getCopy("app.save.saved", "Beach day saved");
        window.clearTimeout(saveStatusTimer);
        saveStatusTimer = window.setTimeout(() => {
          dom.saveLabel.textContent = getCopy("app.save.default", "Saved on this device");
        }, 1600);
      }
    } catch (error) {
      dom.saveLabel.textContent = getCopy("app.save.unavailable", "Saving is unavailable");
    }
  }

  function getMood() {
    if (state.fullness < THOUGHT_BUBBLE_CONFIG.snackishFullnessThreshold) return "snackish";
    if (state.energy < 30) return "sleepy";
    if (state.joy >= 78) return "happy";
    if (state.joy >= 62 && state.energy >= 45) return "playful";
    return "calm";
  }

  function hideThoughtBubble({ cancelSchedule = true } = {}) {
    window.clearTimeout(thoughtBubbleVisibleTimer);
    thoughtBubbleVisibleTimer = 0;
    isThoughtBubbleVisible = false;
    dom.thoughtBubble.classList.remove("is-visible");
    dom.thoughtBubble.setAttribute("aria-hidden", "true");
    if (cancelSchedule) {
      window.clearTimeout(thoughtBubbleScheduleTimer);
      thoughtBubbleScheduleTimer = 0;
    }
  }

  function canShowSnackThought() {
    return state.fullness < THOUGHT_BUBBLE_CONFIG.snackishFullnessThreshold
      && state.hasStarted
      && dom.welcomeScreen.hidden
      && !dom.dialog.open
      && !document.hidden
      && !isActionPlaying
      && !activeSweetieAction
      && !isSweetieSequencePlaying
      && !isSweetieStrolling;
  }

  function scheduleSnackThought(delay = randomBetween(
    THOUGHT_BUBBLE_CONFIG.minCooldownMs,
    THOUGHT_BUBBLE_CONFIG.maxCooldownMs
  )) {
    if (state.fullness >= THOUGHT_BUBBLE_CONFIG.snackishFullnessThreshold || !state.hasStarted) {
      hideThoughtBubble();
      return;
    }
    if (thoughtBubbleScheduleTimer || isThoughtBubbleVisible) return;

    thoughtBubbleScheduleTimer = window.setTimeout(() => {
      thoughtBubbleScheduleTimer = 0;
      if (!canShowSnackThought()) {
        scheduleSnackThought();
        return;
      }

      isThoughtBubbleVisible = true;
      dom.thoughtBubble.textContent = moodDetails.snackish.thought;
      dom.thoughtBubble.classList.add("is-visible");
      dom.thoughtBubble.setAttribute("aria-hidden", "false");
      thoughtBubbleVisibleTimer = window.setTimeout(() => {
        hideThoughtBubble({ cancelSchedule: false });
        scheduleSnackThought();
      }, THOUGHT_BUBBLE_CONFIG.visibleDurationMs);
    }, Math.max(0, delay));
  }

  function syncThoughtBubble() {
    if (!canShowSnackThought()) {
      hideThoughtBubble();
      return;
    }
    scheduleSnackThought();
  }

  function render() {
    statNames.forEach((name) => {
      const roundedValue = Math.round(state[name]);
      const meter = document.querySelector(`#${name}-meter`);
      const value = document.querySelector(`#${name}-value`);
      const progress = meter.parentElement;
      meter.style.width = `${roundedValue}%`;
      value.textContent = roundedValue;
      progress.setAttribute("aria-valuenow", roundedValue);
      progress.classList.toggle("meter-low", roundedValue < 30);
    });

    dom.treatCount.textContent = state.treats;
    const mood = getMood();
    currentSweetieMood = mood;
    const moodInfo = moodDetails[mood];
    dom.moodBadge.textContent = moodInfo.label;
    dom.moodBadge.className = `mood-badge mood-${mood}`;
    dom.moodIcon.textContent = moodInfo.icon;
    dom.sceneMood.textContent = moodInfo.label;
    dom.moodProp.className = `mood-prop mood-prop-${mood}`;
    dom.moodProp.dataset.copyText = moodInfo.propText;
    dom.sweetie.classList.remove("mood-happy", "mood-snackish", "mood-sleepy", "mood-playful", "mood-calm");
    dom.sweetie.classList.add(`mood-${mood}`);
    dom.sweetie.setAttribute("aria-label", copyText("accessibility.sweetie", "Sweetie the {mood} blond long-haired dachshund", { mood: moodInfo.label.toLowerCase() }));

    const questUnlocked = state.bond >= DREAM_BOND;
    dom.questButton.classList.toggle("unlocked", questUnlocked);
    dom.questLock.hidden = questUnlocked;
    dom.questNote.textContent = questUnlocked
      ? getCopy("actions.quest.unlockedSubtitle", "A dreamy preview awaits")
      : copyText("actions.quest.lockedSubtitle", "Locked until Bond {bond}", { bond: DREAM_BOND });
    dom.noteButton.hidden = !questUnlocked;
    dom.noteCopy.textContent = state.hiddenNoteDiscovered
      ? getCopy("actions.note.revisitedSubtitle", "Read the little note again")
      : getCopy("actions.note.subtitle", "A tiny corner of paper is peeking out");
    updateStandButton();
    syncSweetieSprite();
    syncThoughtBubble();
  }

  function pulseElement(element, className, duration = 850) {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.clearTimeout(pulseTimers.get(element));
    pulseTimers.set(element, window.setTimeout(() => element.classList.remove(className), duration));
  }

  function showMessage(text) {
    dom.messageText.classList.remove("message-pop");
    void dom.messageText.offsetWidth;
    dom.messageText.textContent = text;
    dom.messageText.classList.add("message-pop");
    pulseElement(dom.messageCard, "message-active", 500);
  }

  function hideStandSpeechBubble() {
    window.clearTimeout(standSpeechTimer);
    standSpeechTimer = 0;
    dom.standSpeechBubble.classList.remove("is-visible");
    dom.standSpeechBubble.setAttribute("aria-hidden", "true");
  }

  function showStandSpeechBubble(dialogueGroup) {
    const lines = standDialogue[dialogueGroup] || standDialogue.visit;
    hideStandSpeechBubble();
    dom.standSpeechBubble.textContent = pick(lines);
    void dom.standSpeechBubble.offsetWidth;
    dom.standSpeechBubble.classList.add("is-visible");
    dom.standSpeechBubble.setAttribute("aria-hidden", "false");
    standSpeechTimer = window.setTimeout(hideStandSpeechBubble, STAND_NPC_CONFIG.speechDurationMs);
  }

  function applyStandNpcFrame(assetKey, pose) {
    const src = BEACH_PROP_ASSETS[assetKey];
    if (!src || beachAssetStatus.get(src) !== "ready" || !dom.standImage.classList.contains("asset-ready")) return false;
    dom.standImage.setAttribute("src", src);
    currentStandPose = pose;
    dom.hotDogStand.dataset.npcPose = pose;
    return true;
  }

  function restoreStandIdleFrame() {
    applyStandNpcFrame("hotDogStand", "idle");
  }

  function stopStandTalkingAnimation({ restoreIdle = true } = {}) {
    standTalkToken += 1;
    window.clearTimeout(standTalkTimer);
    standTalkTimer = 0;
    isStandTalking = false;
    if (restoreIdle) restoreStandIdleFrame();
  }

  async function playStandTalkingAnimation() {
    stopStandTalkingAnimation({ restoreIdle: false });
    const token = standTalkToken;
    if (reducedMotionQuery.matches) {
      restoreStandIdleFrame();
      return false;
    }

    const [idleReady, talkReady, talk02Ready] = await Promise.all([
      preloadBeachAsset(BEACH_PROP_ASSETS.hotDogStand, "stand idle frame"),
      preloadBeachAsset(BEACH_PROP_ASSETS.hotDogStandTalk, "stand talking frame 01", { warnIfMissing: false }),
      preloadBeachAsset(BEACH_PROP_ASSETS.hotDogStandTalk02, "stand talking frame 02", { warnIfMissing: false })
    ]);
    if (token !== standTalkToken || !idleReady || !talkReady || !dom.standImage.classList.contains("asset-ready")) {
      if (token === standTalkToken) restoreStandIdleFrame();
      return false;
    }

    warnFrameDimensionMismatch("Hot dog stand talking animation", [
      BEACH_PROP_ASSETS.hotDogStand,
      BEACH_PROP_ASSETS.hotDogStandTalk,
      ...(talk02Ready ? [BEACH_PROP_ASSETS.hotDogStandTalk02] : [])
    ]);

    const frames = talk02Ready
      ? [["hotDogStand", "idle"], ["hotDogStandTalk", "talk"], ["hotDogStandTalk02", "talk-02"], ["hotDogStandTalk", "talk"], ["hotDogStand", "idle"]]
      : [["hotDogStand", "idle"], ["hotDogStandTalk", "talk"], ["hotDogStand", "idle"], ["hotDogStandTalk", "talk"], ["hotDogStand", "idle"]];
    isStandTalking = true;

    const showFrame = (index) => {
      if (token !== standTalkToken) return;
      const [assetKey, pose] = frames[index];
      applyStandNpcFrame(assetKey, pose);
      if (index === frames.length - 1) {
        standTalkTimer = 0;
        isStandTalking = false;
        return;
      }
      standTalkTimer = window.setTimeout(() => showFrame(index + 1), STAND_NPC_CONFIG.talkFrameDurationMs);
    };
    showFrame(0);
    return true;
  }

  function showFloatingEffect(type, text, position = "body") {
    const effect = document.createElement("span");
    effect.className = `floating-effect effect-${type} effect-${position}`;
    effect.textContent = text;
    dom.floatingEffects.append(effect);
    window.setTimeout(() => effect.remove(), 1500);
  }

  function showActionFeedback({ type, label, stats = [], effects = [], inventory = false, propType = type }) {
    dom.actionLabel.textContent = label;
    dom.actionLabel.classList.remove("is-visible");
    void dom.actionLabel.offsetWidth;
    dom.actionLabel.classList.add("is-visible");
    window.clearTimeout(actionLabelTimer);
    actionLabelTimer = window.setTimeout(() => dom.actionLabel.classList.remove("is-visible"), 1250);

    window.clearTimeout(actionPropTimer);
    dom.actionProp.className = "action-prop";
    if (propType) {
      void dom.actionProp.offsetWidth;
      dom.actionProp.className = `action-prop prop-${propType} is-visible`;
      dom.actionProp.dataset.copyText = propType === "nap"
        ? getCopy("feedback.nap.propText", "Zzz")
        : getCopy("feedback.common.heart", "\u2665");
      actionPropTimer = window.setTimeout(() => {
        dom.actionProp.className = "action-prop";
      }, 1550);
    }

    stats.forEach((name) => {
      pulseElement(document.querySelector(`[data-stat="${name}"]`), "stat-pulse", 850);
    });
    if (inventory) pulseElement(dom.inventoryCard, "inventory-pulse", 900);
    effects.forEach((effect, index) => {
      window.setTimeout(() => showFloatingEffect(effect.type, effect.text, effect.position), index * 90);
    });

    if (type === "nap") pulseElement(dom.beachScene, "scene-nap", 1650);
    if (type === "stand") pulseElement(dom.hotDogStand, "stand-bounce", 900);
  }

  function clearIdleBehavior() {
    window.clearTimeout(idleBehaviorTimer);
    idleBehaviorTimer = 0;
    dom.sweetie.classList.remove(...idleClasses);
    currentIdleBehavior = null;
  }

  function canRunIdleBehavior() {
    return state.hasStarted
      && dom.welcomeScreen.hidden
      && !dom.dialog.open
      && !document.hidden
      && !isActionPlaying
      && !isSweetieStrolling
      && !isSweetieReturningHome
      && Date.now() - lastInteractionAt > 4_000;
  }

  function scheduleIdleBehavior(delay = IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS)) {
    window.clearTimeout(idleScheduleTimer);
    if (!state.hasStarted) return;
    idleScheduleTimer = window.setTimeout(() => {
      if (!canRunIdleBehavior()) {
        scheduleIdleBehavior(3_500);
        return;
      }
      startIdleBehavior();
    }, delay);
  }

  function startIdleBehavior(requestedName) {
    if (!canRunIdleBehavior()) return false;
    const behavior = requestedName
      ? idleBehaviors.find(({ name }) => name === requestedName)
      : pick(idleBehaviors);
    if (!behavior) return false;

    clearIdleBehavior();
    currentIdleBehavior = behavior.name;
    dom.sweetie.classList.add(`idle-${behavior.name}`);
    idleBehaviorTimer = window.setTimeout(() => {
      clearIdleBehavior();
      scheduleIdleBehavior();
    }, behavior.duration);
    return true;
  }

  function prepareForPlayerAction() {
    cancelSweetieStroll({ restoreSprite: false });
    hideThoughtBubble();
    lastInteractionAt = Date.now();
    window.clearTimeout(idleScheduleTimer);
    window.clearTimeout(reactionTimer);
    clearIdleBehavior();
    dom.sweetie.classList.remove(...reactionClasses);
    isActionPlaying = false;
    stopSweetieAnimation(false);
    stopSweetieBlink(false);
    activeSweetieAction = null;
    syncSweetieSprite();
  }

  function react(type) {
    isActionPlaying = true;
    activeSweetieAction = SWEETIE_ACTION_ASSET_KEYS[type] ? type : null;
    syncSweetieSprite();
    playSweetieAnimation(type, { holdUntilStopped: true, requireActiveAction: true });
    dom.sweetie.classList.remove(...reactionClasses);
    void dom.sweetie.offsetWidth;
    dom.sweetie.classList.add(`reaction-${type}`);
    window.clearTimeout(reactionTimer);
    reactionTimer = window.setTimeout(() => {
      dom.sweetie.classList.remove(`reaction-${type}`);
      isActionPlaying = false;
      stopSweetieAnimation(false);
      activeSweetieAction = null;
      syncSweetieSprite();
      syncThoughtBubble();
      scheduleIdleBehavior();
      scheduleSweetieStroll();
    }, reactionDurations[type] || 1_700);
  }
  function changeStats(changes) {
    Object.entries(changes).forEach(([name, amount]) => {
      state[name] = clamp(state[name] + amount);
    });
  }

  function finishAction(message, reaction, feedback) {
    showMessage(message);
    render();
    if (reaction) react(reaction);
    if (feedback) showActionFeedback(feedback);
    saveState();
  }
  function petSweetie() {
    changeStats({ joy: 10, bond: 3 });
    finishAction(pick(messages.pet), "pet", {
      type: "pet",
      label: getCopy("feedback.pet.label", "Pet!"),
      stats: ["joy", "bond"],
      effects: [
        { type: "heart", text: getCopy("feedback.common.heart", "\u2665"), position: "head" },
        { type: "sparkle", text: getCopy("feedback.common.joy", "+Joy"), position: "body" },
        { type: "bond", text: getCopy("feedback.common.bond", "+Bond"), position: "head" }
      ]
    });
  }

  function giveTreat() {
    if (state.treats <= 0) {
      finishAction(pick(messages.noTreat), null, {
        type: "treat-missing",
        label: getCopy("feedback.noTreat.label", "Restock?"),
        propType: null,
        effects: [{ type: "sparkle", text: getCopy("feedback.noTreat.effect", "Stand trip!"), position: "body" }]
      });
      return;
    }
    state.treats -= 1;
    changeStats({ fullness: 18, joy: 8, bond: 2 });
    finishAction(pick(messages.treat), "treat", {
      type: "treat",
      label: getCopy("feedback.treat.label", "Snack!"),
      stats: ["fullness", "joy", "bond"],
      inventory: true,
      effects: [
        { type: "sparkle", text: getCopy("feedback.common.fullness", "+Fullness"), position: "body" },
        { type: "heart", text: getCopy("feedback.common.joy", "+Joy"), position: "head" },
        { type: "bond", text: getCopy("feedback.common.bond", "+Bond"), position: "head" }
      ]
    });
  }

  function giveWater() {
    changeStats({ energy: 6 });
    finishAction(pick(messages.water), "water", {
      type: "water",
      label: getCopy("feedback.water.label", "Sip!"),
      stats: ["energy"],
      effects: [
        { type: "water", text: getCopy("feedback.common.waterDrop", "\u25cf"), position: "head" },
        { type: "energy", text: getCopy("feedback.common.energy", "+Energy"), position: "body" }
      ]
    });
  }

  function playFetch() {
    if (state.energy < 15) {
      changeStats({ joy: 2, bond: 1 });
      finishAction(pick(messages.gentleFetch), "fetch-shell", {
        type: "fetch-shell",
        label: getCopy("feedback.gentleFetch.label", "Shell!"),
        stats: ["joy", "bond"],
        effects: [
          { type: "sparkle", text: getCopy("feedback.gentleFetch.effect", "Excellent shell"), position: "body" },
          { type: "bond", text: getCopy("feedback.common.bond", "+Bond"), position: "head" }
        ]
      });
      return;
    }
    changeStats({ joy: 14, bond: 5, energy: -13, fullness: -3 });
    finishAction(pick(messages.fetch), "fetch", {
      type: "fetch",
      label: getCopy("feedback.fetch.label", "Fetch!"),
      stats: ["joy", "bond", "energy", "fullness"],
      effects: [
        { type: "sparkle", text: getCopy("feedback.common.joy", "+Joy"), position: "body" },
        { type: "bond", text: getCopy("feedback.common.bond", "+Bond"), position: "head" }
      ]
    });
  }

  function takeNap() {
    changeStats({ energy: 26, fullness: -7, joy: 3 });
    finishAction(pick(messages.nap), "nap", {
      type: "nap",
      label: getCopy("feedback.nap.label", "Nap time"),
      stats: ["energy", "fullness", "joy"],
      effects: [
        { type: "energy", text: getCopy("feedback.common.energy", "+Energy"), position: "body" },
        { type: "sparkle", text: getCopy("feedback.nap.effect", "Zzz"), position: "head" }
      ]
    });
  }

  function visitStand() {
    const isRestockReady = state.standReadyAt <= Date.now();
    showStandSpeechBubble(isRestockReady ? "visit" : "cooldown");
    playStandTalkingAnimation();
    audioManager.playSound("duckQuack");

    // Future currency, purchases, and accessories can branch from this single NPC handler.
    if (!isRestockReady) {
      finishAction(getCopy("hotDogStand.waitMessage", "The hot dog stand duck is still arranging the mustard."), null, {
        type: "stand-wait",
        label: getCopy("feedback.standWait.label", "Mustard break"),
        propType: null,
        effects: [{ type: "sparkle", text: getCopy("feedback.standWait.effect", "Soon!"), position: "body" }]
      });
      return;
    }
    state.treats += 3;
    state.standReadyAt = Date.now() + STAND_COOLDOWN_MS;
    changeStats({ joy: 4 });
    finishAction(pick(messages.stand), "stand", {
      type: "stand",
      label: getCopy("feedback.stand.label", "Treat delivery!"),
      stats: ["joy"],
      inventory: true,
      effects: [
        { type: "sparkle", text: getCopy("feedback.stand.treats", "+3 treats"), position: "basket" },
        { type: "heart", text: getCopy("feedback.common.joy", "+Joy"), position: "head" }
      ]
    });
  }
  function showFeature(title, message, icon) {
    dom.dialogTitle.textContent = title;
    dom.dialogMessage.textContent = message;
    dom.dialogIcon.textContent = icon;
    if (typeof dom.dialog.showModal === "function") dom.dialog.showModal();
    else dom.dialog.setAttribute("open", "");
  }

  function openQuest() {
    if (state.bond < DREAM_BOND) {
      showFeature(getCopy("dreamQuest.lockedTitle", "Dream Quest is still snoozing"), getCopy("dreamQuest.lockedMessage", "Sweetie needs a stronger bond before her seaside dream quest begins."), "\u263e");
    } else {
      showFeature(getCopy("dreamQuest.unlockedTitle", "A new dream is stirring"), getCopy("dreamQuest.unlockedMessage", "Coming soon: Sweetie's Dream Quest."), "\u2726");
    }
  }

  function discoverNote() {
    if (state.bond < DREAM_BOND) return;
    const firstDiscovery = !state.hiddenNoteDiscovered;
    state.hiddenNoteDiscovered = true;
    showMessage(firstDiscovery
      ? getCopy("hiddenNote.firstMessage", "Sweetie found a note tucked beneath a seashell.")
      : getCopy("hiddenNote.repeatMessage", "Sweetie carefully unfolded the seashell note again."));
    showFeature(getCopy("hiddenNote.dialogTitle", "A note beneath a seashell"), getCopy("hiddenNote.placeholderMessage", "Hidden dedication coming soon."), "\u2661");
    render();
    saveState();
  }

  function resetSave() {
    const confirmed = window.confirm(getCopy("reset.confirmation", "Reset Sweetie's beach day? Her stats and treats will return to their comfortable starting values."));
    if (!confirmed) return;
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(LEGACY_SAVE_KEY);
    state = { ...createDefaultState(), hasStarted: true };
    showMessage(getCopy("reset.freshMessage", "A fresh beach day begins. Sweetie is ready!"));
    render();
    saveState();
  }

  function handleAction(action) {
    const actions = {
      pet: petSweetie,
      treat: giveTreat,
      water: giveWater,
      fetch: playFetch,
      nap: takeNap,
      stand: visitStand,
      outfits: () => showFeature(getCopy("features.outfitsTitle", "Sweetie's closet"), getCopy("features.outfitsMessage", "Sweetie's closet is coming soon."), "\u2726"),
      tricks: () => showFeature(getCopy("features.tricksTitle", "Trick school"), getCopy("features.tricksMessage", "Sweetie will learn tricks soon."), "\u2605"),
      quest: openQuest,
      note: discoverNote,
      reset: resetSave
    };
    actions[action]?.();
  }

  function runActionNow(action, button) {
    prepareForPlayerAction();
    if (button) pulseElement(button, "is-activated", 380);
    handleAction(action);
    if (!isActionPlaying) {
      syncThoughtBubble();
      scheduleIdleBehavior();
      scheduleSweetieStroll();
    }
  }

  function shouldReturnHomeBeforeCareAction(action) {
    return isSweetieCareAction(action)
      && !isSweetieAtHome();
  }

  function queueSweetieCareAction(action, button) {
    if (pendingSweetieAction || isSweetieReturningHome) {
      showReturningHomeMessage();
      return true;
    }

    pendingSweetieAction = { action, button };
    showReturningHomeMessage();
    startSweetieReturnHome();
    return true;
  }

  function updateStandButton() {
    const seconds = Math.max(0, Math.ceil((state.standReadyAt - Date.now()) / 1000));
    if (seconds > 0) {
      dom.standButton.classList.add("cooling-down");
      dom.standButton.setAttribute("aria-disabled", "true");
      dom.standNote.textContent = copyText("hotDogStand.cooldown", "The duck needs {seconds}s", { seconds });
    } else {
      dom.standButton.classList.remove("cooling-down");
      dom.standButton.removeAttribute("aria-disabled");
      dom.standNote.textContent = getCopy("hotDogStand.ready", "Treat restock available");
    }
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      audioManager.unlock();

      if (isSweetieReturningHome) {
        if (isSweetieCareAction(action) && !pendingSweetieAction) {
          pendingSweetieAction = { action, button };
        }
        showReturningHomeMessage();
        return;
      }

      if (shouldReturnHomeBeforeCareAction(action)) {
        queueSweetieCareAction(action, button);
        return;
      }

      runActionNow(action, button);
    });
  });

  dom.startButton.addEventListener("click", () => {
    audioManager.unlock();
    state.hasStarted = true;
    dom.welcomeScreen.classList.add("welcome-hidden");
    saveState();
    window.setTimeout(() => {
      dom.welcomeScreen.hidden = true;
      lastInteractionAt = Date.now();
      syncSweetieSprite();
      syncThoughtBubble();
      scheduleIdleBehavior(5_000);
      scheduleSweetieStroll();
    }, 450);
  });
  function closeDialog() {
    if (typeof dom.dialog.close === "function") dom.dialog.close();
    else dom.dialog.removeAttribute("open");
    lastInteractionAt = Date.now();
    syncThoughtBubble();
    scheduleIdleBehavior();
    scheduleSweetieStroll();
  }

  dom.soundToggle.addEventListener("click", () => {
    if (!audioManager.getSoundEnabled()) audioManager.unlock();
    audioManager.toggleSound();
    syncSoundToggle();
  });

  dom.dialogClose.addEventListener("click", closeDialog);
  dom.dialogOk.addEventListener("click", closeDialog);
  dom.dialog.addEventListener("click", (event) => {
    if (event.target === dom.dialog) closeDialog();
  });

  dom.sweetieImage.addEventListener("load", markSweetieAssetLoaded);
  dom.sweetieImage.addEventListener("error", handleSweetieAssetError);
  Object.keys(SWEETIE_ASSETS).forEach(preloadSweetieAsset);
  Object.keys(SWEETIE_ANIMATIONS).forEach(preloadSweetieAnimation);
  initializeBeachAssets();
  initializeStandTalkingAssets();
  syncSoundToggle();
  if (state.hasStarted) dom.welcomeScreen.hidden = true;
  setSweetieRoamPosition(SWEETIE_STROLL_CONFIG.home, 0);
  updateFixedSceneDepth();
  render();
  if (loaded.isReturning) showMessage(pick(messages.return));
  saveState(false);
  if (state.hasStarted) {
    scheduleIdleBehavior(5_000);
    scheduleSweetieStroll();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      audioManager.stopAmbient("oceanWaves");
      hideThoughtBubble();
      hideStandSpeechBubble();
      stopStandTalkingAnimation();
      window.clearTimeout(idleScheduleTimer);
      clearIdleBehavior();
      stopSweetieReturnHome({ resetPosition: true, restoreSprite: false, clearPending: true });
      cancelSweetieStroll({ restoreSprite: false });
      stopSweetieBlink(false);
    } else {
      audioManager.startAmbient("oceanWaves");
      lastInteractionAt = Date.now();
      syncSweetieSprite();
      syncThoughtBubble();
      scheduleIdleBehavior(5_000);
      scheduleSweetieStroll();
    }
  });

  const handleReducedMotionChange = () => {
    if (reducedMotionQuery.matches) {
      stopStandTalkingAnimation();
      window.clearTimeout(idleScheduleTimer);
      clearIdleBehavior();
      stopSweetieReturnHome({ resetPosition: true, clearPending: true });
      cancelSweetieStroll();
    } else if (state.hasStarted && !document.hidden) {
      lastInteractionAt = Date.now();
      scheduleIdleBehavior(5_000);
      scheduleSweetieStroll();
    }
  };
  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleReducedMotionChange);
  }

  const refreshSweetieRoamPosition = () => {
    setSweetieRoamPosition(currentSweetieRoamPosition, 0);
    updateFixedSceneDepth();
  };
  if (typeof ResizeObserver === "function") {
    const sweetieSceneResizeObserver = new ResizeObserver(refreshSweetieRoamPosition);
    sweetieSceneResizeObserver.observe(dom.beachScene);
  } else {
    window.addEventListener("resize", refreshSweetieRoamPosition);
  }

  window.setInterval(() => {
    applyGentleDecay();
    render();
    saveState(false);
  }, DECAY_TICK_MS);

  window.setInterval(updateStandButton, 1000);
  window.setInterval(() => {
    if (!dom.dialog.open && dom.welcomeScreen.hidden) showMessage(pick(messages.idle));
  }, 32_000);

  window.sweetiesGame = {
    getAudioAssets: () => ({ ...AUDIO_ASSETS }),
    audio: {
      setSoundEnabled: (enabled) => {
        const result = audioManager.setSoundEnabled(enabled);
        syncSoundToggle();
        return result;
      },
      getSoundEnabled: audioManager.getSoundEnabled,
      playSound: audioManager.playSound,
      startAmbient: audioManager.startAmbient,
      stopAmbient: audioManager.stopAmbient,
      toggleSound: () => {
        const result = audioManager.toggleSound();
        syncSoundToggle();
        return result;
      }
    },
    getState: () => ({ ...state, mood: getMood() }),
    getSweetiePose: () => currentSweetiePose,
    setSweetiePose,
    getSweetieAssets: () => ({ ...SWEETIE_ASSETS }),
    getSweetieAssetStatus: () => Object.fromEntries(Object.entries(SWEETIE_ASSETS).map(([key, src]) => [key, sweetieSourceStatus.get(src) || "unknown"])),
    getBeachSceneAssets: () => ({ ...BEACH_SCENE_ASSETS }),
    getBeachPropAssets: () => ({ ...BEACH_PROP_ASSETS }),
    getStandNpcState: () => ({
      bubbleVisible: dom.standSpeechBubble.classList.contains("is-visible"),
      dialogue: dom.standSpeechBubble.textContent,
      speechDurationMs: STAND_NPC_CONFIG.speechDurationMs,
      talkFrameDurationMs: STAND_NPC_CONFIG.talkFrameDurationMs,
      talking: isStandTalking,
      pose: currentStandPose
    }),
    getBeachAssetStatus: () => ({
      scene: Object.fromEntries(Object.entries(BEACH_SCENE_ASSETS).map(([key, src]) => [key, beachAssetStatus.get(src) || "unknown"])),
      props: Object.fromEntries(Object.entries(BEACH_PROP_ASSETS).map(([key, src]) => [key, beachAssetStatus.get(src) || "unknown"]))
    }),
    getSceneDepthConfig: () => SCENE_DEPTH_CONFIG,
    getSceneDepthSnapshot: () => ({
      sweetie: {
        baseY: Number(dom.sweetieRoamLayer.dataset.depthBaseY),
        zIndex: Number(dom.sweetieRoamLayer.dataset.depthZ)
      },
      objects: Object.fromEntries(SCENE_DEPTH_CONFIG.objects.map((item) => {
        const element = dom.beachScene.querySelector(item.selector);
        return [item.name, {
          baseY: Number(element?.dataset.depthBaseY),
          zIndex: Number(element?.dataset.depthZ)
        }];
      }))
    }),
    getSweetieAnimations: () => SWEETIE_ANIMATIONS,
    getThoughtBubbleConfig: () => THOUGHT_BUBBLE_CONFIG,
    getThoughtBubbleState: () => ({
      visible: isThoughtBubbleVisible,
      text: dom.thoughtBubble.textContent
    }),
    playSweetieAnimation,
    getSweetieStrollConfig: () => SWEETIE_STROLL_CONFIG,
    getSweetieStrollState: () => ({
      state: sweetieStrollState,
      isStrolling: isSweetieStrolling,
      isReturningHome: isSweetieReturningHome,
      pendingAction: pendingSweetieAction?.action || null,
      activeSweetieAnimation: currentSweetieAnimationName,
      position: { ...currentSweetieRoamPosition }
    }),
    runSweetieStroll: () => {
      lastInteractionAt = 0;
      return startSweetieStroll();
    },
    cancelSweetieStroll,
    getIdleBehavior: () => currentIdleBehavior,
    runIdleBehavior: (name) => {
      lastInteractionAt = 0;
      return startIdleBehavior(name);
    },
    setState: (updates) => {
      state = { ...state, ...updates };
      statNames.forEach((name) => {
        state[name] = clamp(state[name]);
      });
      state.treats = Math.max(0, Math.floor(Number(state.treats) || 0));
      render();
      saveState(false);
    },
    decayOnce: () => {
      applyGentleDecay();
      render();
      saveState(false);
    },
    reset: () => {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(LEGACY_SAVE_KEY);
      state = { ...createDefaultState(), hasStarted: true };
      render();
      saveState(false);
    }
  };
})();