export const SITE = {
  name: "Col. (R) Dr. Muhammad Safdar Khan — In Loving Memory",
  person: "Col. (R) Dr. Muhammad Safdar Khan",
  short: "Safdar Khan Memorial",
  born: "22 November 1942",
  passed: "17 July 2026",
  tagline: "His religion was humanity, kindness his legacy.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  aka: ["Mamajee", "Safdar Mamaji", "Safdar Kaka", "Colonel Sahib", "Mamaji"],
};

export const CATEGORIES: Record<string, string> = {
  family: "Family", childhood: "Childhood", father: "Father", grandfather: "Grandfather", mamajee: "Mamajee",
  friendship: "Friendship", medicine: "Medicine", military: "Military", faith: "Faith", poetry: "Poetry",
  humanity: "Humanity", generosity: "Generosity", wisdom: "Wisdom", travel: "Travel", education: "Education",
  service: "Service", humor: "Humor", "life-lessons": "Life Lessons", farewell: "Farewell",
};

export const GROUPS: Record<string, string> = {
  family: "Family", friends: "Friends", colleagues: "Colleagues", students: "Students",
  grandchildren: "Grandchildren", nephews: "Nephews", others: "Others",
};

export interface Identity { key: string; title: string; line: string }
/** “The Many Sides of Him” — each one opens the memories tagged with that identity. */
export const IDENTITIES: Identity[] = [
  { key: "father", title: "The Father", line: "Daughters, cycle races and two cups of tea" },
  { key: "grandfather", title: "The Grandfather", line: "The pillar of the family" },
  { key: "mamajee", title: "The Uncle / Mamajee", line: "Everyone called him Mamajee" },
  { key: "doctor", title: "The Doctor", line: "Healing with knowledge and kindness" },
  { key: "soldier", title: "The Soldier", line: "Service in uniform" },
  { key: "friend", title: "The Friend", line: "Always there to help" },
  { key: "teacher", title: "The Teacher", line: "Lessons that were lived" },
  { key: "scholar", title: "The Scholar", line: "A library beyond the syllabus" },
  { key: "poet", title: "The Poet", line: "Rahman Baba, Hafiz and verse" },
  { key: "traveler", title: "The Traveler", line: "Across continents" },
  { key: "mentor", title: "The Mentor", line: "“Make me proud”" },
  { key: "humanitarian", title: "The Humanitarian", line: "Service without recognition" },
  { key: "faith", title: "The Man of Faith", line: "Love for Allah and His Messenger ﷺ" },
  { key: "elder", title: "The Elder", line: "The heart of a large family" },
];

export interface Passage { slug: string; text: string }
export interface Chapter { id: string; title: string; passages: Passage[] }

/** Life & Heritage: only chapters the supplied material supports. Every passage is a verbatim excerpt. */
export const CHAPTERS: Chapter[] = [
  { id: "early-life", title: "Early Life & Haji Abad", passages: [
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "Born and raised in a small village in the Charsadda district, Mamajee carried the simplicity and warmth of his origins throughout his life." },
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "He belonged to a large, closely-knit extended family and remained at its heart, particularly beloved by the younger generation." },
  ]},
  { id: "family", title: "Family", passages: [
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "He leaves behind a loving family—his devoted wife, two sons, and three daughters—who will undoubtedly carry forward his legacy of kindness, generosity, and service." },
    { slug: "my-uncle", text: "سگے بھانجوں کی بات کی جائے تو اللہ تعالیٰ نے انہیں دو بھائی اور چھ بہنیں عطا فرمائی تھیں" },
    { slug: "the-friend", text: "تینوں بیٹیاں اب پیا کے گھر سدھار گئی ہیں۔ اپنے والدین کے گھر آتی جاتی ہیں۔ البتہ اب ڈاکٹر صاحب کے قریب کی کرسیاں ان کے نواسے، نواسیوں نے سنبھال لی ہیں۔" },
  ]},
  { id: "family-leadership", title: "Family Leadership", passages: [
    { slug: "my-uncle", text: "لوگ خود ان کی بات کو آخری بات سمجھتے تھے، کیونکہ ان میں ایک اچھے رہنما کی تمام صفات موجود تھیں۔" },
    { slug: "my-uncle", text: "وہ دلوں کے سردار تھے، اور دلوں پر حکومت ووٹوں سے نہیں، کردار سے قائم ہوتی ہے۔" },
  ]},
  { id: "military", title: "Military Service", passages: [
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "He was also a proud veteran who served with distinction in three major conflicts—the wars of 1965 and 1971, and the 1973 Arab-Israel war." },
    { slug: "a-tribute-to-the-life-and-legacy", text: "A Ghazi of three wars—the 1965 Indo-Pak War, the 1971 War, and the Arab-Israel War—he served his country and the Muslim Ummah with extraordinary courage, unwavering honour, and unshakeable commitment." },
  ]},
  { id: "medical", title: "Medical Career", passages: [
    { slug: "words-i-will-never-forget", text: "Before the surgery, I went to see Safdar Kaka at Hearts International Hospital, where he was serving at the time." },
    { slug: "a-tribute-to-the-life-and-legacy", text: "He was far more than a highly respected Army officer and an accomplished cardiac pathologist." },
    { slug: "a-memory-from-jawad-ullah", text: "Colonel sahib used to accompany him and take him to the Dr himself on all visits." },
    { slug: "twenty-six-years-together", text: "کرنل محمد صفدر خان کے ساتھ مجھے تقریباً چھبیس سال کام کرنے کا شرف حاصل ہوا۔" },
  ]},
  { id: "intellectual", title: "Intellectual Life & Languages", passages: [
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "A gifted linguist, he spoke Persian, Arabic, Hebrew, Bengali, and Punjabi with ease besides other languages spoken in Pakistan, and could recite poetry in each of these languages." },
    { slug: "my-uncle", text: "بیٹا! لائبریری اسی لیے ہوتی ہے کہ آدمی نصاب سے آگے بھی پڑھے۔" },
  ]},
  { id: "faith", title: "Faith", passages: [
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "His extensive study of the Holy Qur'an, Hadith, Islamic history, and comparative religion, combined with close friendships with eminent religious scholars, transformed him into a living encyclopedia of religions, particularly Islam." },
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "He firmly rejected sectarianism, ethnic prejudice, and racism, believing that these divisions weakened both society and the true spirit of faith." },
    { slug: "humility-as-a-fundamental-principle", text: "His religion was humanity." },
  ]},
  { id: "travel", title: "Travel", passages: [
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "An avid traveler, he journeyed extensively across Europe, the Middle East, the United States, Australia, and many other parts of the world." },
  ]},
  { id: "humanitarian", title: "Humanitarian Service", passages: [
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "Beyond his military career, he was a committed philanthropist. He quietly supported numerous welfare initiatives and helped educate individuals who otherwise could not have afforded it." },
    { slug: "my-uncle", text: "پانچویں چیز خدمت ہے، اور یہی وہ نعمت ہے جسے کبھی زوال نہیں آتا۔" },
  ]},
  { id: "friendship", title: "Friendship", passages: [
    { slug: "in-loving-memory-of-colonel-sahib", text: "He was always there to help, to support and to encourage quietly, generously and without expectation." },
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "Despite these experiences, the overwhelming majority of his friends were sincere and deeply devoted to him." },
  ]},
  { id: "final-days", title: "Final Days", passages: [
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "Colonel Muhammad Safdar Khan, lovingly known to all as Mamajee, passed away peacefully on 17 July 2026 at CMH Rawalpindi. In his final moments, he was surrounded by those who cherished him most—his close family, dear relatives, and lifelong friends—an enduring testament to a life deeply rooted in love, compassion, and human connection." },
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "During his final days in the ICU, I would visit him at odd hours to ensure he was not alone. Time and again, I witnessed his friends standing beside him, tears in their eyes, speaking of him with profound love and admiration." },
  ]},
  { id: "farewell", title: "Farewell & Burial", passages: [
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "His funeral was held on the afternoon of 18 July 2026 in his native village of Haji Abad, Charsadda, where a vast gathering of relatives, friends, colleagues, admirers, and people from every walk of life came together to bid him a final farewell." },
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "His Janaza prayer was led by the revered Peer Sahib of Gorla Sharif, with whom he shared a lifelong bond of mutual love, respect, and spiritual devotion." },
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "Colonel Muhammad Safdar Khan was laid to eternal rest in his ancestral graveyard in Charsadda, beside his beloved granddaughter, Sahar, and close to his cherished parents." },
  ]},
  { id: "legacy", title: "Legacy", passages: [
    { slug: "the-heart-of-our-family", text: "Though he has returned to Allah, his presence remains with us. His values guide our decisions. His lessons shape how we treat people. And his memories keep him alive in our hearts and in the hearts of the generations to come." },
    { slug: "a-life-of-faith-compassion-and-enduring-legacy", text: "His life reminds us that true greatness lies not in what we accumulate, but in what we give." },
    { slug: "humility-as-a-fundamental-principle", text: "But generations inherit his harvest." },
  ]},
];

export interface Lesson { key: string; title: string; slug: string; quote: string; photo?: string }
export const LESSONS: Lesson[] = [
  { key: "humility", title: "Humility", slug: "humility-as-a-fundamental-principle", quote: "He never sought recognition. He sought usefulness.", photo: "p8" },
  { key: "patience", title: "Patience", slug: "patience-and-grace", quote: "Make yourself humble like the earth, and accessible like the wind—for everyone, especially your relatives." },
  { key: "forgiveness", title: "Forgiveness", slug: "a-life-of-faith-compassion-and-enduring-legacy", quote: "He was a man who never believed in revenge; no matter the circumstance, he chose to forgive." },
  { key: "generosity", title: "Generosity", slug: "a-life-of-faith-compassion-and-enduring-legacy", quote: "Brother, that is a gift from my side. There is nothing to return.", photo: "p2" },
  { key: "service", title: "Service", slug: "my-uncle", quote: "پانچویں چیز خدمت ہے، اور یہی وہ نعمت ہے جسے کبھی زوال نہیں آتا۔" },
  { key: "knowledge", title: "Knowledge", slug: "my-uncle", quote: "بیٹا! لائبریری اسی لیے ہوتی ہے کہ آدمی نصاب سے آگے بھی پڑھے۔" },
  { key: "courage", title: "Courage", slug: "words-i-will-never-forget", quote: "Watch three surgeries, and you will be able to perform the fourth." },
  { key: "compassion", title: "Compassion", slug: "a-life-of-faith-compassion-and-enduring-legacy", quote: "Allah Malik hai—what can I do? They need a place for the night." },
  { key: "faith", title: "Faith", slug: "a-life-of-faith-compassion-and-enduring-legacy", quote: "If Allah grants me without counting, why should I count?" },
  { key: "family", title: "Family", slug: "visiting-hospital-to-see-my-son-hamza", quote: "No matter how busy he was he would make time for family.", photo: "p5" },
];

export interface Quote { text: string; slug: string; by: "col" | "contributor"; speaker: string }
/** Words That Remain. `by:col` = words the contributor reports him saying; every string is verified against its memory. */
export const QUOTES: Quote[] = [
  { text: "Bachay.", slug: "the-magic-word-bachay", by: "col", speaker: "Safdar Mama Ji" },
  { text: "Mumtaz, jobs don’t matter—they are temporary. What truly matters is love and prayers.", slug: "a-life-of-faith-compassion-and-enduring-legacy", by: "col", speaker: "Col. Safdar Khan" },
  { text: "If Allah grants me without counting, why should I count?", slug: "a-life-of-faith-compassion-and-enduring-legacy", by: "col", speaker: "Col. Safdar Khan" },
  { text: "Brother, that is a gift from my side. There is nothing to return.", slug: "a-life-of-faith-compassion-and-enduring-legacy", by: "col", speaker: "Col. Safdar Khan" },
  { text: "Allah Malik hai—what can I do? They need a place for the night.", slug: "a-life-of-faith-compassion-and-enduring-legacy", by: "col", speaker: "Col. Safdar Khan" },
  { text: "I want your name to be a source of recognition for me.", slug: "col-safdar-is-my-uncle", by: "col", speaker: "Col. Safdar Khan" },
  { text: "Finally, you have made me proud.", slug: "col-safdar-is-my-uncle", by: "col", speaker: "Col. Safdar Khan" },
  { text: "Watch three surgeries, and you will be able to perform the fourth.", slug: "words-i-will-never-forget", by: "col", speaker: "Safdar Kaka" },
  { text: "Make yourself humble like the earth, and accessible like the wind—for everyone, especially your relatives.", slug: "patience-and-grace", by: "col", speaker: "Col (R) Dr. Safdar Khan" },
  { text: "بیٹا! لائبریری اسی لیے ہوتی ہے کہ آدمی نصاب سے آگے بھی پڑھے۔", slug: "my-uncle", by: "col", speaker: "ماموں" },
  { text: "پانچویں چیز خدمت ہے، اور یہی وہ نعمت ہے جسے کبھی زوال نہیں آتا۔", slug: "my-uncle", by: "col", speaker: "ماموں" },
  { text: "He is with me.", slug: "col-safdar-is-my-uncle", by: "contributor", speaker: "Habib, at the gate" },
  { text: "No matter how busy he was he would make time for family.", slug: "visiting-hospital-to-see-my-son-hamza", by: "contributor", speaker: "Mumtaz Ali Khan" },
  { text: "His religion was humanity.", slug: "humility-as-a-fundamental-principle", by: "contributor", speaker: "Ally Raza Qureshi" },
  { text: "He never sought recognition. He sought usefulness.", slug: "humility-as-a-fundamental-principle", by: "contributor", speaker: "Ally Raza Qureshi" },
  { text: "He believed in learning, in service, and in doing the right thing even when no one was watching.", slug: "the-heart-of-our-family", by: "contributor", speaker: "Wahab Ali" },
  { text: "In his presence, distinctions dissolved; only humanity remained.", slug: "a-life-of-faith-compassion-and-enduring-legacy", by: "contributor", speaker: "Mumtaz Ali Khan" },
];

export interface TimelineEvent { when: string; sort: number; title: string; body: string; slug?: string; kind: "life" | "memory" }
/** Only supplied dates. Memory dates are shown as “A memory from…”, never as events in his life. */
export const TIMELINE: TimelineEvent[] = [
  { when: "22 November 1942", sort: 1942.9, kind: "life", title: "Born", body: "The birth date printed on the title page of the memoir book." },
  { when: "1977", sort: 1977, kind: "memory", title: "A memory from Bannu", body: "Habibullah Khan Khattak remembers evenings at Col. Safdar’s home in Bannu Cantonment.", slug: "the-friend" },
  { when: "1992", sort: 1992, kind: "memory", title: "A memory from Cadet College Razmak", body: "Habib’s interview, and the five words that opened doors: “Col Safdar is my uncle.”", slug: "col-safdar-is-my-uncle" },
  { when: "2016", sort: 2016, kind: "memory", title: "A memory from Hearts International Hospital", body: "Sajid I. Dawezai and the words he will never forget.", slug: "words-i-will-never-forget" },
  { when: "Summer 2025", sort: 2025.5, kind: "memory", title: "A memory from Mardan", body: "Muhammad Hamza remembers two brief conversations by phone.", slug: "in-memory-of-a-noble-soul" },
  { when: "17 July 2026", sort: 2026.54, kind: "life", title: "Passing", body: "He passed away peacefully at CMH Rawalpindi, surrounded by close family, relatives and friends.", slug: "a-life-of-faith-compassion-and-enduring-legacy" },
  { when: "18 July 2026", sort: 2026.55, kind: "life", title: "Funeral and burial", body: "Funeral in his native village of Haji Abad, Charsadda; the Janaza was led by the Peer Sahib of Gorla Sharif.", slug: "a-life-of-faith-compassion-and-enduring-legacy" },
  { when: "July 2026", sort: 2026.56, kind: "memory", title: "Tributes gather", body: "Habib, Ali Gauher Khan, Riaz Khan, Wahab Ali, Quaid Iqbal and others write in the days that follow.", slug: "a-tribute-to-the-life-and-legacy" },
  { when: "Summer 2026", sort: 2026.6, kind: "memory", title: "Family memories", body: "Habib’s poem from Karachi.", slug: "safdar-mama-ji-poem" },
  { when: "September 2026", sort: 2026.7, kind: "memory", title: "Later remembrance", body: "“Miss You Mama Ji” — a poem in Pashto.", slug: "miss-you-mama-ji" },
];

export const MILESTONES = [
  { label: "1992", title: "Cadet College Razmak", note: "The interview: “He is a farmer, but Col Safdar is my uncle.”" },
  { label: "The Challenge", title: "The eve of departure", note: "“I want your name to be a source of recognition for me.”" },
  { label: "Pakistan Naval Academy", title: "Karachi", note: "Two intense years of military and naval training." },
  { label: "PNEC Karachi", title: "Pakistan Navy Engineering College", note: "A message from the main gate: guests are waiting." },
  { label: "At the gate", title: "“Finally, you have made me proud.”", note: "" },
  { label: "Across the base", title: "“He is with me.”", note: "" },
  { label: "The legacy continues", title: "Earning the right to share it", note: "" },
];
