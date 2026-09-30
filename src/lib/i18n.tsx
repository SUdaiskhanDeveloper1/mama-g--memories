"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./types";

type Entry = { en: string; ur: string; ps: string };

/** Interface strings only. Memories, poems and captions always stay in their original language. */
export const D = {
  "nav.life": {
    en: "Life & Heritage",
    ur: "زندگی اور ورثہ",
    ps: "ژوند او میراث",
  },
  "nav.memories": { en: "Memories", ur: "یادیں", ps: "یادونه" },
  "nav.gallery": { en: "Gallery", ur: "تصاویر", ps: "انځورونه" },
  "nav.poetry": { en: "Poetry", ur: "شاعری", ps: "شاعري" },
  "nav.values": {
    en: "Faith & Lessons",
    ur: "ایمان اور اسباق",
    ps: "ایمان او زده کړې",
  },
  "nav.tell": {
    en: "Tell His Story",
    ur: "ان کی کہانی سنائیں",
    ps: "د هغه کیسه ووایاست",
  },
  "nav.menu": { en: "Menu", ur: "مینو", ps: "مینو" },
  "nav.home": { en: "Home", ur: "مرکزی صفحہ", ps: "کور پاڼه" },

  "hero.kicker": {
    en: "In Loving Memory of",
    ur: "محبت بھری یاد میں",
    ps: "په مینه ډکه یاد کې",
  },
  "hero.name": {
    en: "Col. (R) Dr. Muhammad Safdar Khan",
    ur: "کرنل (ر) ڈاکٹر محمد صفدر خان",
    ps: "کرنل (ر) ډاکټر محمد صفدر خان",
  },
  "hero.tagline": {
    en: "His religion was humanity, kindness his legacy.",
    ur: "ان کا مذہب انسانیت تھا، اور مہربانی ان کی میراث۔",
    ps: "د هغه دین انسانیت و، او مهربانی یې میراث.",
  },
  "hero.remembered": {
    en: "Remembered with love, prayers and gratitude.",
    ur: "محبت، دعاؤں اور شکر کے ساتھ یاد کیے جاتے ہیں۔",
    ps: "په مینه، دعا او مننې یادیږي.",
  },
  "hero.explore": {
    en: "Explore His Story",
    ur: "ان کی کہانی دیکھیں",
    ps: "د هغه کیسه وګورئ",
  },
  "hero.share": {
    en: "Share a Memory",
    ur: "اپنی یاد شیئر کریں",
    ps: "خپله یاد شریک کړئ",
  },
  "hero.shareKicker": {
    en: "Tell His Story",
    ur: "ان کی کہانی سنائیں",
    ps: "د هغه کیسه ووایاست",
  },
  "hero.shareSub": {
    en: "Everyone carries a different moment. Yours belongs here.",
    ur: "ہر ایک کے پاس ایک الگ لمحہ ہے۔ آپ کا لمحہ یہاں شامل ہونا چاہیے۔",
    ps: "هر څوک بېل شېبه لري. ستاسو شېبه دلته ځای لري.",
  },
  "hero.dates": {
    en: "22 November 1942 — 17 July 2026",
    ur: "22 نومبر 1942 — 17 جولائی 2026",
    ps: "22 نومبر 1942 — 17 جولای 2026",
  },

  "sides.title": {
    en: "The Many Sides of Him",
    ur: "ان کی کئی پہچانیں",
    ps: "د هغه ډېر اړخونه",
  },
  "sides.sub": {
    en: "One person, remembered through many relationships. Choose one to meet him through those who knew him that way.",
    ur: "ایک شخصیت، کئی رشتوں کی نظر سے۔ ایک پہچان چنیں اور انہیں ان کی آنکھ سے دیکھیں۔",
    ps: "یو کس، د ډېرو اړیکو له لارې. یو اړخ وټاکئ او هغه د هغوی له سترګو وګورئ.",
  },
  "featured.title": {
    en: "Stories to begin with",
    ur: "پڑھنے کے لیے کہانیاں",
    ps: "د پیل لپاره کیسې",
  },
  "eyes.title": {
    en: "Through Their Eyes",
    ur: "ان کی نظر سے",
    ps: "د هغوی له سترګو",
  },
  "eyes.sub": {
    en: "Every memory keeps its author’s name, relationship and place. Nothing is blended into one voice.",
    ur: "ہر یاد اپنے لکھنے والے کے نام، رشتے اور مقام کے ساتھ محفوظ ہے۔",
    ps: "هره یاد د لیکوال نوم، اړیکه او ځای ساتي.",
  },
  "bachay.kicker": {
    en: "A small word",
    ur: "ایک چھوٹا سا لفظ",
    ps: "یوه وړه کلمه",
  },
  "quotes.title": {
    en: "Words That Remain",
    ur: "جو الفاظ باقی ہیں",
    ps: "هغه خبرې چې پاتې دي",
  },
  "quotes.sub": {
    en: "Only words taken directly from the memories, always with the person who shared them.",
    ur: "صرف وہ الفاظ جو براہِ راست یادوں سے لیے گئے، ہمیشہ بیان کرنے والے کے نام کے ساتھ۔",
    ps: "یوازې هغه خبرې چې مستقیم له یادونو اخیستل شوې.",
  },
  "lessons.title": {
    en: "Lessons Left Behind",
    ur: "چھوڑے ہوئے اسباق",
    ps: "پاتې شوې زده کړې",
  },
  "lessons.read": {
    en: "Read the full memory",
    ur: "مکمل یاد پڑھیں",
    ps: "بشپړه یاد ولولئ",
  },
  "cta.title": {
    en: "What Did He Mean To You?",
    ur: "وہ آپ کے لیے کیا تھے؟",
    ps: "هغه ستاسو لپاره څه و؟",
  },
  "cta.sub": {
    en: "A doctor. A father. A grandfather. A mentor. A friend. A Mamajee. Everyone carries a different memory.",
    ur: "ایک ڈاکٹر۔ ایک باپ۔ ایک دادا نانا۔ ایک رہنما۔ ایک دوست۔ ایک ماما جی۔ ہر ایک کے پاس ایک الگ یاد ہے۔",
    ps: "ډاکټر. پلار. نیکه. لارښود. ملګری. ماما جی. هر چا ته بېله یاد ده.",
  },
  "cta.photo": {
    en: "Add a Photograph",
    ur: "تصویر شامل کریں",
    ps: "انځور زیات کړئ",
  },
  "cta.share": {
    en: "Share Your Memory",
    ur: "اپنی یاد شیئر کریں",
    ps: "خپله یاد شریک کړئ",
  },
  "final.title": {
    en: "His Story Continues",
    ur: "ان کی کہانی جاری ہے",
    ps: "د هغه کیسه دوام لري",
  },
  "final.line1": {
    en: "A life may end.",
    ur: "زندگی ختم ہو سکتی ہے۔",
    ps: "ژوند ختمېدلی شي.",
  },
  "final.line2": {
    en: "A legacy does not.",
    ur: "میراث نہیں۔",
    ps: "میراث نه.",
  },
  "final.dua": {
    en: "May Allah grant Col. (R) Dr. Muhammad Safdar Khan the highest place in Jannat-ul-Firdaws. Ameen.",
    ur: "اللہ تعالیٰ کرنل (ر) ڈاکٹر محمد صفدر خان کو جنت الفردوس میں اعلیٰ مقام عطا فرمائے۔ آمین۔",
    ps: "الله تعالی دې کرنل (ر) ډاکټر محمد صفدر خان ته په جنت الفردوس کې لوړ مقام ورکړي. آمین.",
  },
  "final.explore": {
    en: "Explore His Life",
    ur: "ان کی زندگی دیکھیں",
    ps: "د هغه ژوند وګورئ",
  },

  "life.title": {
    en: "His Life & Heritage",
    ur: "ان کی زندگی اور ورثہ",
    ps: "د هغه ژوند او میراث",
  },
  "life.sub": {
    en: "Told only through what the family and friends have shared. Each passage is quoted exactly and credited to the person who wrote it.",
    ur: "صرف اسی سے جو خاندان اور دوستوں نے بتایا۔ ہر اقتباس ہو بہو اور لکھنے والے کے نام کے ساتھ ہے۔",
    ps: "یوازې د هغه څه له مخې چې کورنۍ او ملګرو ویلي. هر اقتباس ورته ډول او د لیکوال په نوم دی.",
  },
  "life.timeline": {
    en: "Life Timeline",
    ur: "زندگی کا سفر",
    ps: "د ژوند مهال ویش",
  },
  "life.timelineNote": {
    en: "Only supplied dates. A date on a memory is shown as “a memory from…”, not as an event in his life.",
    ur: "صرف فراہم کردہ تاریخیں۔ یاد کی تاریخ کو زندگی کا واقعہ نہیں بلکہ “ایک یاد” کے طور پر دکھایا گیا ہے۔",
    ps: "یوازې ورکړل شوې نېټې. د یادونو نېټې د ژوند پېښې نه، بلکې “یاد” ښودل کېږي.",
  },
  "life.final": {
    en: "His Final Journey",
    ur: "ان کا آخری سفر",
    ps: "د هغه وروستی سفر",
  },
  "life.finalNote": {
    en: "Quietly, and only as the family account records it.",
    ur: "خاموشی سے، اور صرف اتنا جتنا خاندان کے بیان میں ہے۔",
    ps: "په ارامۍ سره، او یوازې لکه څنګه چې کورنۍ ثبت کړی.",
  },
  "life.legacy": {
    en: "The Legacy Continues",
    ur: "میراث جاری ہے",
    ps: "میراث دوام لري",
  },
  "life.legacyNote": {
    en: "A wife, sons, daughters, grandchildren, nephews, friends and the many people he helped. A family tree can be added here when names and relationships are supplied.",
    ur: "بیوی، بیٹے، بیٹیاں، نواسے پوتے، بھانجے بھتیجے، دوست اور وہ بہت سے لوگ جن کی اس نے مدد کی۔ نام اور رشتے ملنے پر یہاں شجرہ شامل کیا جا سکتا ہے۔",
    ps: "میرمن، زامن، لوڼې، لمسیان، وراره، ملګري او ډېر خلک چې مرسته یې ورسره وکړه. د نومونو په ورکړه یو شجره دلته زیاتیدلی شي.",
  },
  "life.family": {
    en: "Family & Travels",
    ur: "خاندان اور سفر",
    ps: "کورنۍ او سفرونه",
  },
  "life.familyNote": {
    en: "Photographs with a story. More can be added by the family.",
    ur: "کہانی والی تصاویر۔ خاندان مزید شامل کر سکتا ہے۔",
    ps: "د کیسې سره انځورونه. کورنۍ نور هم زیاتولی شي.",
  },
  "life.contributors": { en: "contributors", ur: "شرکاء", ps: "ونډه والا" },
  "life.memories": { en: "memories", ur: "یادیں", ps: "یادونه" },

  "wall.title": {
    en: "Memory Wall",
    ur: "یادوں کی دیوار",
    ps: "د یادونو دېوال",
  },
  "wall.sub": {
    en: "Every approved memory, in the words of the person who wrote it.",
    ur: "ہر منظور شدہ یاد، لکھنے والے کے اپنے الفاظ میں۔",
    ps: "هره تایید شوې یاد د لیکوال په خپلو ټکو.",
  },
  "wall.all": { en: "All", ur: "سب", ps: "ټول" },
  "wall.allMemories": {
    en: "All Memories",
    ur: "تمام یادیں",
    ps: "ټولې یادونه",
  },
  "wall.more": {
    en: "Load More Memories",
    ur: "مزید یادیں دیکھیں",
    ps: "نورې یادونه",
  },
  "wall.none": {
    en: "No memories match yet.",
    ur: "ابھی کوئی یاد نہیں ملی۔",
    ps: "تر اوسه هېڅ یاد ونه موندل شوه.",
  },
  "wall.byWho": {
    en: "Who is remembering",
    ur: "یاد کرنے والا",
    ps: "یادونکی",
  },
  "wall.byTheme": { en: "Theme", ur: "موضوع", ps: "موضوع" },
  "wall.side": {
    en: "Showing memories of",
    ur: "یہ یادیں دکھائی جا رہی ہیں",
    ps: "دا یادونه ښودل کېږي",
  },
  "wall.clear": { en: "Clear", ur: "صاف کریں", ps: "پاک کړئ" },
  "wall.read": { en: "Read", ur: "پڑھیں", ps: "ولولئ" },

  "story.original": { en: "Original", ur: "اصل", ps: "اصل" },
  "story.translation": {
    en: "English Translation",
    ur: "انگریزی ترجمہ",
    ps: "انګلیسي ژباړه",
  },
  "story.moreFrom": {
    en: "More memories from",
    ur: "مزید یادیں از",
    ps: "نورې یادونه له",
  },
  "story.yours": {
    en: "Share your own memory",
    ur: "اپنی یاد شیئر کریں",
    ps: "خپله یاد شریک کړئ",
  },
  "story.share": {
    en: "Share Memory",
    ur: "یاد شیئر کریں",
    ps: "یاد شریک کړئ",
  },
  "story.copy": { en: "Copy link", ur: "لنک کاپی کریں", ps: "لینک کاپي کړئ" },
  "story.copied": {
    en: "Link copied",
    ur: "لنک کاپی ہو گیا",
    ps: "لینک کاپي شو",
  },
  "story.photos": {
    en: "View Photos From This Memory",
    ur: "اس یاد کی تصاویر دیکھیں",
    ps: "د دې یاد انځورونه وګورئ",
  },
  "story.behind": {
    en: "The Story Behind This Photograph",
    ur: "اس تصویر کے پیچھے کی کہانی",
    ps: "د دې انځور شا ته کیسه",
  },
  "story.remove": {
    en: "Request removal or a correction",
    ur: "ہٹانے یا درستی کی درخواست",
    ps: "د لرې کولو یا سمون غوښتنه",
  },
  "story.listen": {
    en: "Listen to this memory",
    ur: "یہ یاد سنیں",
    ps: "دا یاد واورئ",
  },
  "story.back": { en: "All memories", ur: "تمام یادیں", ps: "ټولې یادونه" },
  "story.by": { en: "Remembered by", ur: "یاد کرنے والا", ps: "یادونکی" },

  "tell.title": {
    en: "Tell His Story",
    ur: "ان کی کہانی سنائیں",
    ps: "د هغه کیسه ووایاست",
  },
  "tell.intro": {
    en: "Everyone remembers him differently. For some, he was Mamajee. For others, Colonel Sahib, a doctor, mentor, friend, father, grandfather, teacher, or simply someone who was there when help was needed.",
    ur: "ہر کوئی انہیں الگ طرح یاد کرتا ہے۔ کسی کے لیے ماما جی، کسی کے لیے کرنل صاحب، ڈاکٹر، رہنما، دوست، باپ، دادا نانا، استاد، یا بس وہ شخص جو ضرورت کے وقت موجود ہوتا تھا۔",
    ps: "هر څوک هغه بېل یادوي. یو ته ماما جی، بل ته کرنل صیب، ډاکټر، لارښود، ملګری، پلار، نیکه، استاد، یا هغه څوک چې په اړتیا کې حاضر و.",
  },
  "tell.prompt": {
    en: "Tell us about the moment you remember most.",
    ur: "وہ لمحہ بتائیں جو آپ کو سب سے زیادہ یاد ہے۔",
    ps: "هغه شېبه راته ووایاست چې تاسو ډېره یادوئ.",
  },
  "tell.name": { en: "Your Name", ur: "آپ کا نام", ps: "ستاسو نوم" },
  "tell.relation": {
    en: "Your Relationship to Him",
    ur: "ان سے آپ کا رشتہ",
    ps: "له هغه سره ستاسو اړیکه",
  },
  "tell.memTitle": {
    en: "Memory Title",
    ur: "یاد کا عنوان",
    ps: "د یاد سرلیک",
  },
  "tell.story": {
    en: "Your Story / Memory",
    ur: "آپ کی کہانی / یاد",
    ps: "ستاسو کیسه / یاد",
  },
  "tell.when": {
    en: "Date or Year of Memory",
    ur: "یاد کی تاریخ یا سال",
    ps: "د یاد نېټه یا کال",
  },
  "tell.where": { en: "Location", ur: "مقام", ps: "ځای" },
  "tell.language": {
    en: "Language of your memory",
    ur: "یاد کی زبان",
    ps: "د یاد ژبه",
  },
  "tell.photos": {
    en: "Add Photos",
    ur: "تصاویر شامل کریں",
    ps: "انځورونه زیات کړئ",
  },
  "tell.photosHint": {
    en: "Add a photograph that belongs with this memory.",
    ur: "ایسی تصویر شامل کریں جو اس یاد سے جڑی ہو۔",
    ps: "داسې انځور زیات کړئ چې د دې یاد سره تړاو لري.",
  },
  "tell.drop": {
    en: "Drag & drop photographs here, or",
    ur: "تصاویر یہاں کھینچ کر چھوڑیں، یا",
    ps: "انځورونه دلته کش کړئ، یا",
  },
  "tell.browse": { en: "browse files", ur: "فائلیں چنیں", ps: "فایلونه وټاکئ" },
  "tell.caption": { en: "Caption", ur: "عنوان", ps: "سرلیک" },
  "tell.people": {
    en: "People in the photo",
    ur: "تصویر میں کون ہیں",
    ps: "په انځور کې څوک دي",
  },
  "tell.remove": { en: "Remove", ur: "ہٹائیں", ps: "لرې کړئ" },
  "tell.voice": {
    en: "Prefer to speak instead of write? Record your memory.",
    ur: "لکھنے کے بجائے بولنا چاہتے ہیں؟ اپنی یاد ریکارڈ کریں۔",
    ps: "د لیکلو پر ځای خبرې کول غواړئ؟ خپله یاد ثبت کړئ.",
  },
  "tell.record": { en: "Record", ur: "ریکارڈ", ps: "ثبت" },
  "tell.stop": { en: "Stop", ur: "روکیں", ps: "بند" },
  "tell.delete": { en: "Delete", ur: "حذف کریں", ps: "ړنګ کړئ" },
  "tell.uploadAudio": {
    en: "or upload an audio file",
    ur: "یا آڈیو فائل اپ لوڈ کریں",
    ps: "یا آډیو فایل پورته کړئ",
  },
  "tell.quote": {
    en: "A line you want remembered (optional)",
    ur: "ایک جملہ جو یاد رہے (اختیاری)",
    ps: "یوه جمله چې یادېدل غواړئ (اختیاري)",
  },
  "tell.private": {
    en: "Keep this memory private — for the family only",
    ur: "یہ یاد نجی رکھیں — صرف خاندان کے لیے",
    ps: "دا یاد خصوصي وساتئ — یوازې د کورنۍ لپاره",
  },
  "tell.consent": {
    en: "I give permission for this memory to be published on the memorial website.",
    ur: "میں اس یاد کو یادگاری ویب سائٹ پر شائع کرنے کی اجازت دیتا/دیتی ہوں۔",
    ps: "زه د دې یاد په یادګاري وېب پاڼه کې د خپرېدو اجازه ورکوم.",
  },
  "tell.submit": {
    en: "Submit Memory",
    ur: "یاد جمع کروائیں",
    ps: "یاد وسپارئ",
  },
  "tell.sending": { en: "Sending…", ur: "بھیجا جا رہا ہے…", ps: "لېږل کېږي…" },
  "tell.thanks": {
    en: "Thank you for helping preserve his story.",
    ur: "ان کی کہانی محفوظ کرنے میں مدد کا شکریہ۔",
    ps: "د هغه د کیسې په ساتلو کې د مرستې مننه.",
  },
  "tell.review": {
    en: "Your memory is now waiting for the family’s review. Nothing is published until it is approved.",
    ur: "آپ کی یاد اب خاندان کے جائزے کی منتظر ہے۔ منظوری تک کچھ شائع نہیں ہوتا۔",
    ps: "ستاسو یاد اوس د کورنۍ د کتنې په تمه ده. تر تایید پورې هېڅ نه خپرېږي.",
  },
  "tell.another": {
    en: "Share another memory",
    ur: "ایک اور یاد شیئر کریں",
    ps: "بله یاد شریک کړئ",
  },
  "tell.required": { en: "Required", ur: "ضروری", ps: "اړین" },
  "tell.optional": { en: "Optional", ur: "اختیاری", ps: "اختیاري" },

  "gallery.title": {
    en: "Photo Gallery",
    ur: "تصویری البم",
    ps: "د انځورونو ګالري",
  },
  "gallery.sub": {
    en: "Every photograph can be connected to a story, a person and a place.",
    ur: "ہر تصویر کو ایک کہانی، شخص اور مقام سے جوڑا جا سکتا ہے۔",
    ps: "هر انځور له کیسې، کس او ځای سره تړل کېدای شي.",
  },
  "gallery.empty": {
    en: "Awaiting photographs",
    ur: "تصاویر کا انتظار",
    ps: "د انځورونو په تمه",
  },
  "gallery.addPhoto": {
    en: "Add a photograph",
    ur: "تصویر شامل کریں",
    ps: "انځور زیات کړئ",
  },

  "film.kicker": {
    en: "A Film in His Memory",
    ur: "ان کی یاد میں ایک فلم",
    ps: "د هغه په یاد کې یو فلم",
  },
  "film.title": {
    en: "A Life, in Moments",
    ur: "ایک زندگی، لمحوں میں",
    ps: "یو ژوند، په شېبو کې",
  },
  "film.sub": {
    en: "From a young officer in uniform to Mamajee in the garden — photographs from across his life, brought together in one short film.",
    ur: "وردی میں ایک نوجوان افسر سے لے کر باغ میں بیٹھے ماما جی تک — ان کی پوری زندگی کی تصاویر، ایک مختصر فلم میں۔",
    ps: "په وردۍ کې له یو ځوان افسر نه تر باغ کې ناست ماما جي پورې — د هغه د ټول ژوند انځورونه، په یوه لنډ فلم کې.",
  },
  "film.withSound": { en: "With sound", ur: "آواز کے ساتھ", ps: "له غږ سره" },
  "film.watch": {
    en: "Watch with Sound",
    ur: "آواز کے ساتھ دیکھیں",
    ps: "له غږ سره یې وګورئ",
  },
  "film.tapSound": {
    en: "Tap for sound",
    ur: "آواز کے لیے ٹیپ کریں",
    ps: "د غږ لپاره ټک وکړئ",
  },
  "film.play": { en: "Play film", ur: "فلم چلائیں", ps: "فلم پیل کړئ" },
  "film.pause": { en: "Pause film", ur: "فلم روکیں", ps: "فلم ودروئ" },
  "film.unmute": { en: "Turn sound on", ur: "آواز کھولیں", ps: "غږ پرانیزئ" },
  "film.mute": { en: "Turn sound off", ur: "آواز بند کریں", ps: "غږ بند کړئ" },
  "film.full": { en: "Full screen", ur: "پوری اسکرین", ps: "بشپړه پرده" },
  "film.seek": { en: "Film position", ur: "فلم کا مقام", ps: "د فلم ځای" },

  "poetry.title": {
    en: "His Words & The Words Written For Him",
    ur: "ان کے الفاظ اور ان کے لیے لکھے گئے الفاظ",
    ps: "د هغه خبرې او د هغه لپاره لیکل شوې خبرې",
  },
  "poetry.sub": {
    en: "Line breaks are kept exactly as they were written.",
    ur: "سطریں بالکل ویسی ہی ہیں جیسی لکھی گئیں۔",
    ps: "کرښې لکه څنګه چې لیکل شوې ساتل شوې.",
  },
  "values.title": {
    en: "His Faith & Values",
    ur: "ان کا ایمان اور اقدار",
    ps: "د هغه ایمان او ارزښتونه",
  },
  "values.sub": {
    en: "These are personal memories and interpretations, each credited to the person who shared it — not statements of record.",
    ur: "یہ ذاتی یادیں اور آراء ہیں، ہر ایک بیان کرنے والے کے نام کے ساتھ — مستند حقائق کا دعویٰ نہیں۔",
    ps: "دا شخصي یادونه او نظرونه دي، هر یو د خپروونکي په نوم — د رسمي ثبت ادعا نه.",
  },


  "footer.line": {
    en: "A living archive of memory, kept by his family.",
    ur: "یادوں کا زندہ آرکائیو، خاندان کی نگرانی میں۔",
    ps: "د یادونو ژوندی آرشیف، د کورنۍ په ساتنه.",
  },
  "footer.contact": {
    en: "For any queries or suggestions, please contact us at",
    ur: "کسی بھی سوال یا تجویز کے لیے ہم سے رابطہ کریں:",
    ps: "د هرې پوښتنې یا وړاندیز لپاره موږ سره اړیکه ونیسئ:",
  },
  "footer.admin": {
    en: "Family sign-in",
    ur: "خاندانی لاگ اِن",
    ps: "د کورنۍ ننوتل",
  },
  "footer.quotes": {
    en: "Words That Remain",
    ur: "جو الفاظ باقی ہیں",
    ps: "پاتې خبرې",
  },
} satisfies Record<string, Entry>;

export type Key = keyof typeof D;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}
const LangCtx = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => D[k].en,
});

export const LANG_LABEL: Record<Lang, string> = {
  en: "English",
  ur: "اردو",
  ps: "پښتو",
};
export const isRtl = (l: Lang) => l !== "en";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setL] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved && saved in LANG_LABEL) setL(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setL(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = isRtl(lang) ? "rtl" : "ltr";
    el.dataset.ui = lang;
  }, [lang]);

  const t = useCallback((k: Key) => D[k][lang] ?? D[k].en, [lang]);
  return (
    <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
  );
}

export const useLang = () => useContext(LangCtx);
export function T({ k }: { k: Key }) {
  return <>{useLang().t(k)}</>;
}
