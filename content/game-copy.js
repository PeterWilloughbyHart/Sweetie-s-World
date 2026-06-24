/*
 * Editable player-facing copy for Sweetie's Beach Day.
 * Change quoted text values freely. Keep object keys unchanged unless game.js is updated too.
 * Placeholders such as {seconds}, {bond}, {mood}, and {stat} are filled by the game.
 */
window.SWEETIE_COPY = {
  app: {
    documentTitle: "Sweetie's Beach Day",
    metaDescription: "Spend a cozy beach day caring for Sweetie, a cheerful dachshund.",
    eyebrow: "A tiny virtual pet beach day",
    title: "Sweetie's Beach Day",
    tagline: "Hot dogs, short legs, and seaside dreams.",
    footer: "Made for slow afternoons, sandy paws, and one very good dog.",
    save: {
      default: "Saved on this device",
      saved: "Beach day saved",
      unavailable: "Saving is unavailable"
    }
  },

  audio: {
    soundOn: "Sound: On",
    soundOff: "Sound: Off"
  },

  headings: {
    checkInEyebrow: "Beach day check-in",
    checkInTitle: "How's Sweetie?",
    actionsEyebrow: "Pick a cozy moment",
    actionsTitle: "Sweetie's care tray",
    actionsIntro: "Care, play, and little seaside plans.",
    dailyEyebrow: "Everyday favorites",
    dailyTitle: "Daily Care",
    playEyebrow: "Short-leg adventures",
    playTitle: "Play",
    futureEyebrow: "Tucked in the beach bag",
    futureTitle: "Coming Soon"
  },

  stats: {
    joy: { label: "Joy" },
    fullness: { label: "Fullness" },
    energy: { label: "Energy" },
    bond: { label: "Bond" }
  },

  inventory: {
    heading: "Picnic basket",
    itemLabel: "hot dog treats"
  },

  economy: {
    shells: {
      label: "Shells",
      itemLabel: "collected shells",
      ariaLabel: "{shells} collected shells"
    },
    shop: {
      hotDogTreat: { label: "Hot dog treat" }
    }
  },

  moods: {
    happy: { label: "Happy", icon: "☀", thought: "Best. Day. Ever.", propText: "" },
    snackish: { label: "Snackish", icon: "♡", thought: "A snack, perhaps?", propText: "" },
    sleepy: { label: "Sleepy", icon: "Zz", thought: "Towel... nap...", propText: "Zz" },
    playful: { label: "Playful", icon: "●", thought: "Throw the ball!", propText: "" },
    calm: { label: "Calm", icon: "∼", thought: "Just listening to the waves.", propText: "" }
  },

  actions: {
    pet: { label: "Pet Sweetie", subtitle: "Head pats, obviously" },
    treat: { label: "Give hot dog treat", subtitle: "A tiny gourmet moment" },
    water: { label: "Give water", subtitle: "Hydration station" },
    nap: { label: "Nap", subtitle: "A premium towel snooze", iconText: "Zz" },
    fetch: { label: "Play fetch", subtitle: "Maximum short-leg speed" },
    stand: { label: "Visit hot dog stand", subtitle: "Hot dog treat - 3 shells" },
    shellWords: { label: "Shell Words", subtitle: "Make little beach words" },
    outfits: { label: "Outfits", subtitle: "Coming soon: beachwear" },
    tricks: { label: "Tricks", subtitle: "Coming soon: trick school" },
    quest: {
      label: "Sweetie's Dream Quest",
      lockedSubtitle: "Locked until Bond {bond}",
      unlockedSubtitle: "A dreamy preview awaits",
      lockBadge: "LOCKED"
    },
    note: {
      label: "Inspect sparkly seashell",
      subtitle: "A tiny corner of paper is peeking out",
      revisitedSubtitle: "Read the little note again"
    },
    reset: { label: "Reset save", subtitle: "Start a fresh beach day" }
  },


  shellWords: {
    eyebrow: "Beach bag mini-game",
    title: "Shell Words",
    instructions: "Tap shell letters to make cozy beach words. Find five before the timer runs out.",
    timerLabel: "Timer",
    progressLabel: "Progress",
    foundHeading: "Found words",
    startButton: "Start round",
    newRoundButton: "New round",
    submitButton: "Submit",
    clearButton: "Clear",
    shuffleButton: "Shuffle",
    emptyWord: "Tap shells to spell a word.",
    readyStatus: "Ready when you are.",
    unavailableStatus: "No shell piles are ready yet.",
    startStatus: "The shells are listening.",
    tooShortStatus: "Tiny word, tiny pause - try at least {minimum} letters.",
    notFromLettersStatus: "Those letters are not all in this shell pile.",
    notAcceptedStatus: "Sweetie tilts her head. Try another beachy little word.",
    duplicateStatus: "Already found. Sweetie is politely impressed twice.",
    acceptedStatus: "Found: {word}",
    bonusStatus: "Bonus shell word: {word}",
    completedStatus: "Five words found. Sweetie declares this a tiny triumph.",
    timedOutStatus: "Time is up, but the beach remains very proud of you.",
    exitedStatus: "Shell Words tucked back into the beach bag.",
    puzzleTitle: "Shell pile: {title}",
    progressText: "{found} / {target}",
    summaryCompleted: "Round complete: {found} target words and {bonus} bonus words found.",
    summaryTimedOut: "Round ended: {found} of {target} target words found, plus {bonus} bonus words.",
    summaryExited: "Round tucked away: {found} of {target} target words found, plus {bonus} bonus words.",
    rewardEarned: "You earned {shells} shells.",
    rewardEarnedWithBonus: "You earned {shells} shells, including {bonusShells} bonus shells.",
    rewardNone: "No shells this round, but Sweetie enjoyed the hunt."
  },
  messages: {
    initial: "Sweetie thinks today is a very good beach day.",
    pet: [
      "Sweetie wagged her feathery tail.",
      "Sweetie leaned into the pets like a tiny golden noodle.",
      "Sweetie gave you the very serious look of a dog requesting more pats.",
      "One ear flopped inside out. Sweetie considers this fashionable.",
      "Sweetie has entered her luxurious beach era."
    ],
    treat: [
      "Sweetie loved the hot dog treat.",
      "Sweetie performed a flawless snack disappearance trick.",
      "That treat received eleven out of ten tail wags.",
      "Sweetie says compliments to the tiny chef."
    ],
    noTreat: [
      "The picnic basket is empty. The hot dog stand has more treats.",
      "Sweetie checked the basket twice. A visit to the hot dog stand may be in order."
    ],
    water: [
      "Sweetie accepted the water with quiet dignity.",
      "Sweetie drank politely, then stepped directly in the water bowl.",
      "A refreshing drink for a very busy beach dog.",
      "Sweetie is hydrated and ready to inspect the shoreline."
    ],
    fetch: [
      "Sweetie chased the ball with maximum short-leg velocity.",
      "Sweetie believes fetch is both sport and art.",
      "Sweetie flopped dramatically in the sand after one heroic sprint.",
      "The ball was fetched. The dignity was optional."
    ],
    gentleFetch: [
      "Sweetie brought back a shell instead. This seems intentional.",
      "Sweetie found a shell and seems very proud of the substitution."
    ],
    nap: [
      "Sweetie had a tiny beach nap.",
      "Sweetie tucked her nose under one floppy ear and snoozed.",
      "A warm breeze, a soft towel, and one spectacular nap.",
      "Sweetie dreamed of a hot dog longer than she is."
    ],
    stand: [
      "The duck wrapped one hot dog treat with excellent ceremony.",
      "One beach snack joined the picnic basket. Sweetie approves of planning ahead.",
      "The stand completed a very respectable treat transaction."
    ],
    idle: [
      "Sweetie watched a seagull with deep suspicion.",
      "Sweetie thinks today is a very good beach day.",
      "Sweetie has detected a suspicious duck nearby.",
      "Sweetie believes the umbrella was placed here by providence.",
      "Sweetie gave the ocean a thoughtful glance.",
      "Sweetie is not worried about the seagulls, but she is monitoring them."
    ],
    return: [
      "Sweetie is happy you're back.",
      "Sweetie saved you a spot under the umbrella.",
      "Sweetie has been keeping an eye on the ducks."
    ],
    returningHome: [
      "Sweetie is scampering back!"
    ]
  },

  feedback: {
    common: {
      heart: "♥",
      waterDrop: "●",
      joy: "+Joy",
      bond: "+Bond",
      energy: "+Energy",
      fullness: "+Fullness"
    },
    pet: { label: "Pet!" },
    treat: { label: "Snack!" },
    noTreat: { label: "Restock?", effect: "Stand trip!" },
    water: { label: "Sip!" },
    fetch: { label: "Fetch!" },
    gentleFetch: { label: "Shell!", effect: "Excellent shell" },
    nap: { label: "Nap time", effect: "Zzz", propText: "Zzz" },
    stand: { label: "Treat delivery!", treats: "+1 treat", shellCost: "-{price} shells" },
    standWait: { label: "Mustard break", effect: "Soon!" },
    standInsufficient: { label: "More shells", effect: "Shell hunt!" }
  },

  hotDogStand: {
    sign: "HOT DOGS",
    ariaLabel: "A hot dog stand run by a cheerful duck vendor",
    ready: "Treat restock available",
    purchaseReady: "Hot dog treat - {price} shells",
    needShells: "Hot dog treat - {price} shells ({shells}/{price})",
    cooldown: "The duck needs {seconds}s",
    waitMessage: "The hot dog stand duck is still arranging the mustard.",
    purchaseMessage: "The duck wrapped one hot dog treat for {price} shells.",
    insufficientMessage: "A few more shells and the duck will happily wrap one up.",
    dialogue: {
      general: [
        "Fresh hot dogs for discerning beach pups!",
        "A fine day for seaside snacks.",
        "Step right up - tiny paws welcome.",
        "The grill is warm and the buns are dignified.",
        "A very respectable snack decision."
      ],
      sweetie: [
        "For Sweetie? Naturally.",
        "A golden customer with excellent taste.",
        "Short legs, big appetite. I respect it.",
        "One snack for the beach's finest dachshund.",
        "She knows quality when she smells it."
      ],
      cooldown: [
        "One moment - the next batch is nearly ready.",
        "The grill requires a dignified pause.",
        "Fresh batch coming right up.",
        "I cannot rush craftsmanship.",
        "The buns are aligning as we speak."
      ],
      purchase: [
        "One beach dog delicacy, respectfully prepared.",
        "For Sweetie? Naturally.",
        "A fine snack decision.",
        "The grill approves."
      ],
      insufficientShells: [
        "A few more shells, perhaps.",
        "Quality snacks require quality shells.",
        "The bun is ready, but the shells are not."
      ],
      world: [
        "Business has been brisk with the shore birds today.",
        "Some call it a stand. I call it an institution.",
        "Only the finest beach cuisine leaves this counter.",
        "The gulls have been negotiating all morning.",
        "A duck's work is never done."
      ]
    }
  },

  dreamQuest: {
    lockedTitle: "Dream Quest is still snoozing",
    lockedMessage: "Sweetie needs a stronger bond before her seaside dream quest begins.",
    unlockedTitle: "A new dream is stirring",
    unlockedMessage: "Coming soon: Sweetie's Dream Quest."
  },

  hiddenNote: {
    firstMessage: "Sweetie found a note tucked beneath a seashell.",
    repeatMessage: "Sweetie carefully unfolded the seashell note again.",
    dialogTitle: "A note beneath a seashell",
    placeholderMessage: "Hidden dedication coming soon."
  },

  features: {
    outfitsTitle: "Sweetie's closet",
    outfitsMessage: "Sweetie's closet is coming soon.",
    tricksTitle: "Trick school",
    tricksMessage: "Sweetie will learn tricks soon."
  },

  reset: {
    confirmation: "Reset Sweetie's beach day? Her stats and treats will return to their comfortable starting values.",
    freshMessage: "A fresh beach day begins. Sweetie is ready!"
  },

  scene: {
    ariaLabel: "Sweetie relaxing on a sunny beach",
    captionSuffix: "beach pup"
  },

  beachSections: {
    label: "Beach section",
    goTo: "Go to {section}",
    cupidsCove: {
      title: "Cupid's Cove",
      description: "A quiet sandy nook for future heart-shaped surprises."
    },
    mainBeach: {
      title: "Sweetie's Spot",
      description: "Sweetie's favorite beach towel, picnic basket, and hot dog stand are here."
    },
    lazyLighthouse: {
      title: "The Lazy Lighthouse",
      description: "A breezy future stop for lighthouse errands and seaside discoveries."
    }
  },

  welcome: {
    eyebrow: "Welcome to the beach",
    titleName: "Sweetie's",
    titlePlace: "Beach Day",
    tagline: "Hot dogs, short legs, and seaside dreams.",
    message: "Sweetie has cleared her schedule for snacks, naps, and quality time with you.",
    startButton: "Start the beach day"
  },

  dialog: {
    closeAriaLabel: "Close",
    eyebrow: "A little peek ahead",
    defaultTitle: "Coming soon",
    okButton: "Back to the beach"
  },

  accessibility: {
    gameLayout: "Sweetie's beach day",
    statMeter: "{stat}",
    sweetie: "Sweetie the {mood} blond long-haired dachshund"
  }
};