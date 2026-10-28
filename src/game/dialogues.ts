/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DialogueItem {
  id: string;
  category: 'helper_call' | 'passenger_complaint' | 'driver_bravado' | 'fare_collection' | 'near_miss' | 'crash' | 'horn_reaction' | 'bus_stop' | 'game_over';
  speaker: 'হেলপার (Helper)' | 'যাত্রী (Passenger)' | 'ড্রাইভার (Driver)' | 'ট্রাফিক (Traffic)' | 'কনডাক্টর (Conductor)';
  text: string;
  tone?: 'funny' | 'urgent' | 'proud' | 'scared';
}

export const DHAKA_DIALOGUES: DialogueItem[] = [
  // Helper calls (বাসের ডাক)
  { id: 'h1', category: 'helper_call', speaker: 'হেলপার (Helper)', text: 'গুলিস্তান! গুলিস্তান! উইঠা পড়েন, ভেতরে সিট ফাঁকা আছে!' },
  { id: 'h2', category: 'helper_call', speaker: 'হেলপার (Helper)', text: 'ফার্মগেট, কারওয়ান বাজার, শাহবাগ, প্রেস ক্লাব, মতিঝিল!' },
  { id: 'h3', category: 'helper_call', speaker: 'হেলপার (Helper)', text: 'মামা একটু চাইপা দাঁড়ান, আরও পাঁচজন ঢুকবে!' },
  { id: 'h4', category: 'helper_call', speaker: 'হেলপার (Helper)', text: 'সামনে আগান ভাই, দরজার মুখে ভিড় কইরেন না!' },
  { id: 'h5', category: 'helper_call', speaker: 'হেলপার (Helper)', text: 'উত্তরা! এয়ারপোর্ট! সোজা ভিআইপি রোড, ডাইরেক্ট বুলেট!' },
  { id: 'h6', category: 'helper_call', speaker: 'হেলপার (Helper)', text: 'এই আস্তে ওস্তাদ! বামে যাত্রী আছে, দুইজন মহিলা!' },

  // Passenger complaints (যাত্রীদের হাহাকার ও ডায়লগ)
  { id: 'p1', category: 'passenger_complaint', speaker: 'যাত্রী (Passenger)', text: 'ভাই আস্তে চালান! বাসায় আমার নতুন বিয়ের আলাপ চলতেছে!' },
  { id: 'p2', category: 'passenger_complaint', speaker: 'যাত্রী (Passenger)', text: 'ভাই নামায় দেন! কোথায় নামব পরে মনে করতেছি, আগে নামান!' },
  { id: 'p3', category: 'passenger_complaint', speaker: 'যাত্রী (Passenger)', text: 'ও ভাই, ড্রাইভার কি প্লেন চালানোর ট্রেনিং নিয়া আসছে?' },
  { id: 'p4', category: 'passenger_complaint', speaker: 'যাত্রী (Passenger)', text: 'আমার ডিমের খাঁচি ভাইঙ্গা গেছে ওস্তাদ! একটু আস্তে!' },
  { id: 'p5', category: 'passenger_complaint', speaker: 'যাত্রী (Passenger)', text: 'ভাই ফ্যান তো চলে না, বাতাসও নাই, এইটা কি ওভেন নাকি?' },
  { id: 'p6', category: 'passenger_complaint', speaker: 'যাত্রী (Passenger)', text: 'মামা অফিস টাইম শ্যাষ হয়া যাইতেছে, উড়ায়া নিয়া যান!' },
  { id: 'p7', category: 'passenger_complaint', speaker: 'যাত্রী (Passenger)', text: 'হাতলটা তো আমার হাতে খুইলা চইলা আসলো ভাই!' },

  // Driver bravado (ড্রাইভারের গর্জন)
  { id: 'd1', category: 'driver_bravado', speaker: 'ড্রাইভার (Driver)', text: 'রাস্তা ফাঁকা, মনও ফাঁকা—চলেন ঢাকার রাজপথ কাঁপাই!' },
  { id: 'd2', category: 'driver_bravado', speaker: 'ড্রাইভার (Driver)', text: 'জ্যাম দেখে যারা ভয় পায়, তারা ঢাকায় বাস চালায় না!' },
  { id: 'd3', category: 'driver_bravado', speaker: 'ড্রাইভার (Driver)', text: 'ওস্তাদের মাইর শেষ রাইতে, এখন শুধু ফাঁকা দিয়ে টান!' },
  { id: 'd4', category: 'driver_bravado', speaker: 'ড্রাইভার (Driver)', text: 'ব্রেক ধরি না কারণ আমি ভাগ্যে বিশ্বাস করি!' },
  { id: 'd5', category: 'driver_bravado', speaker: 'ড্রাইভার (Driver)', text: 'সিএনজি মামা, আমাদের সাথে পাল্লা দিও না, হাওয়া হয়া যাবা!' },
  { id: 'd6', category: 'driver_bravado', speaker: 'ড্রাইভার (Driver)', text: 'ডান দিয়ে রাস্তা না পাইলে বামের ফুটপাত দিয়া যামু!' },

  // Fare collection (ভাড়া কালেকশন)
  { id: 'f1', category: 'fare_collection', speaker: 'কনডাক্টর (Conductor)', text: 'ভাড়া দেন ভাই! বাস কি আপনার মামার শ্বশুরের?' },
  { id: 'f2', category: 'fare_collection', speaker: 'কনডাক্টর (Conductor)', text: 'খুচরা কুড়ি টাকা নাই কেন? এক হাজার টাকার নোট পকেটে রাইখা দেন!' },
  { id: 'f3', category: 'fare_collection', speaker: 'কনডাক্টর (Conductor)', text: 'স্টুডেন্ট হাফ পাস সকাল আটটায় শেষ, এখন ফুল ভাড়া!' },
  { id: 'f4', category: 'fare_collection', speaker: 'কনডাক্টর (Conductor)', text: 'পেছনে যে ভাই না শোনার ভান করতেছেন, টিকেট কাটেন!' },
  { id: 'f5', category: 'fare_collection', speaker: 'কনডাক্টর (Conductor)', text: 'মাশাআল্লাহ! সব যাত্রী ভাড়া দিয়া দিছে, আজ পোলাও খামু!' },

  // Near miss & crazy overtakes (চরম ওভারটেক)
  { id: 'nm1', category: 'near_miss', speaker: 'হেলপার (Helper)', text: 'বাপরে বাপ! মাত্র এক ইঞ্চি দিয়ে বাইচা গেল!' },
  { id: 'nm2', category: 'near_miss', speaker: 'ড্রাইভার (Driver)', text: 'একে বলে আসল ঢাকার ড্রাইভিং! জ্যামের ফাঁক দিয়া সুতা গলানো!' },
  { id: 'nm3', category: 'near_miss', speaker: 'যাত্রী (Passenger)', text: 'ইয়া আল্লাহ! আমার হার্টবিট তো মিনিটে দুইশত হয়ে গেছে!' },
  { id: 'nm4', category: 'near_miss', speaker: 'হেলপার (Helper)', text: 'ওস্তাদ জোশ! পাশের বাসের লুকিং গ্লাসে বাতাস লাগাইয়া দিছেন!' },

  // Crash & damage (ধাক্কা ও দুর্ঘটনা)
  { id: 'c1', category: 'crash', speaker: 'ট্রাফিক (Traffic)', text: 'এই মামা! ব্রেক বলে একটা জিনিস আবিষ্কার হইছে, জানেন না?' },
  { id: 'c2', category: 'crash', speaker: 'হেলপার (Helper)', text: 'আরে গেল গেল! নতুন লাগানো বাম্পারটা বাঁকা হয়া গেল ওস্তাদ!' },
  { id: 'c3', category: 'crash', speaker: 'ড্রাইভার (Driver)', text: 'কিছু হয় নাই মামা! সামান্য পুটিং আর রঙ লাগাইলেই নতুনের মতো!' },
  { id: 'c4', category: 'crash', speaker: 'যাত্রী (Passenger)', text: 'আমার কোমর শেষ! পরের স্টপে আমারে নামায় দেন ভাই!' },
  { id: 'c5', category: 'crash', speaker: 'ট্রাফিক (Traffic)', text: 'সিগন্যালে দাঁড়ান না কেন? ফাইন কাটা হবে পাঁচ হাজার টাকা!' },

  // Horn reaction (হর্নের প্রতিক্রিয়া)
  { id: 'hr1', category: 'horn_reaction', speaker: 'হেলপার (Helper)', text: 'মারো হর্ন ওস্তাদ! যাতে সামনের রিকশা আসমানে উইড়া যায়!' },
  { id: 'hr2', category: 'horn_reaction', speaker: 'ট্রাফিক (Traffic)', text: 'এইটা বাসের হর্ন নাকি বিয়ার সানাই বাজাইতেছো?' },
  { id: 'hr3', category: 'horn_reaction', speaker: 'ড্রাইভার (Driver)', text: 'হর্ন হইল বাসের ভাষা! না বাজাইলে রাস্তা খালি করবে কে?' },
  { id: 'hr4', category: 'horn_reaction', speaker: 'যাত্রী (Passenger)', text: 'কানের পর্দা ফাইটা গেল ভাই! একটু আস্তে বাজান!' },

  // Bus Stop actions (স্ট্যান্ডের কথাবার্তা)
  { id: 'bs1', category: 'bus_stop', speaker: 'হেলপার (Helper)', text: 'ফার্মগেট আইসা পড়ছে! যারা নামবেন বাঁ হাত দিয়া হাতল ধরেন!' },
  { id: 'bs2', category: 'bus_stop', speaker: 'হেলপার (Helper)', text: 'শাহবাগ মোড়! উঠেন উঠেন, ঝটপট উঠেন, ট্রাফিক পুলিশ তাকায়া আছে!' },
  { id: 'bs3', category: 'bus_stop', speaker: 'হেলপার (Helper)', text: 'মতিঝিল শাপলা চত্বর! ব্যাংক পাড়ার যাত্রীরা রেডি হন!' },
  { id: 'bs4', category: 'bus_stop', speaker: 'হেলপার (Helper)', text: 'গুলিস্তান পার্ক! নামেন নামেন, টাইম নাই ওস্তাদ টানে চলেন!' },

  // Game over (খেলা শেষ)
  { id: 'go1', category: 'game_over', speaker: 'ড্রাইভার (Driver)', text: 'বাস থামছে কিন্তু ঢাকার বাসের কিংবদন্তি থামে নাই!' },
  { id: 'go2', category: 'game_over', speaker: 'হেলপার (Helper)', text: 'আজকের মতো গ্যারেজে চলেন ওস্তাদ! চা আর গরম পরোটা খাই!' },
  { id: 'go3', category: 'game_over', speaker: 'ট্রাফিক (Traffic)', text: 'জ্যাম আর খানাখন্দ জিতেছে, আপনি মেরামত কইরা আবার নামেন!' },
  { id: 'go4', category: 'game_over', speaker: 'যাত্রী (Passenger)', text: 'আজকের মতো জীবন বাঁচছে! কালকে আবার এই বাসেই চড়মু!' }
];

let lastSpokenIndex = -1;
let lastSpeechTime = 0;

/**
 * Gets a random dialogue line filtered by category, avoiding immediate repeats.
 */
export function getRandomDialogue(category?: DialogueItem['category']): DialogueItem {
  const filtered = category 
    ? DHAKA_DIALOGUES.filter(d => d.category === category)
    : DHAKA_DIALOGUES;

  if (filtered.length === 0) return DHAKA_DIALOGUES[0];

  let chosen: DialogueItem;
  let attempts = 0;
  do {
    const idx = Math.floor(Math.random() * filtered.length);
    chosen = filtered[idx];
    attempts++;
  } while (chosen.id === (DHAKA_DIALOGUES[lastSpokenIndex]?.id) && attempts < 5);

  lastSpokenIndex = DHAKA_DIALOGUES.findIndex(d => d.id === chosen.id);
  return chosen;
}

/**
 * Speaks text using Web Speech API if Bengali voice is supported.
 * Falls back safely without throwing errors.
 */
export function playBanglaSpeech(text: string, enabled: boolean = true): void {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  const now = Date.now();
  if (now - lastSpeechTime < 2500) {
    // Avoid speech queue pileup
    return;
  }
  lastSpeechTime = now;

  try {
    window.speechSynthesis.cancel(); // clear stuck speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 0.85;

    // Look for Bengali voices (bn-BD or bn-IN)
    const voices = window.speechSynthesis.getVoices();
    const bnVoice = voices.find(v => v.lang.startsWith('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'));
    if (bnVoice) {
      utterance.voice = bnVoice;
      utterance.lang = bnVoice.lang;
    } else {
      utterance.lang = 'bn-BD';
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Silently ignore speech errors - text subtitle is always displayed
  }
}
