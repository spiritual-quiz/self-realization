export interface CourseLesson {
  id: string;
  title: { en: string; hi: string };
  duration: string;
  videoUrl: string; // YouTube embed URL
  summary: { en: string; hi: string };
  keyTakeaways: { en: string[]; hi: string[] };
  verseRef?: string;
}

export interface CourseQuizQuestion {
  question: { en: string; hi: string };
  options: { en: string[]; hi: string[] };
  correctIndex: number;
  explanation: { en: string; hi: string };
}

export interface LMSCourse {
  id: string;
  title: { en: string; hi: string };
  desc: { en: string; hi: string };
  level: "Beginner" | "Intermediate" | "Advanced";
  lessonsCount: string;
  duration: string;
  price: string;
  isPaid: boolean;
  instructor: string;
  thumbnail: string;
  lessons: CourseLesson[];
  assessment: CourseQuizQuestion[];
}

export const LMS_COURSES: LMSCourse[] = [
  {
    id: "discover-yourself",
    title: {
      en: "Discover Yourself: Fundamentals of Bhagavad-gītā",
      hi: "स्वयं को जानें: भगवद्गीता के मूलभूत सिद्धांत"
    },
    desc: {
      en: "A structured 6-session foundation journey exploring soul, mind, reincarnation, karma, and supreme identity.",
      hi: "आत्मा, मन, पुनर्जन्म, कर्म और परम सत्य के रहस्यों को उद्घाटित करने वाली 6 सत्रों की व्यवस्थित यात्रा।"
    },
    level: "Beginner",
    lessonsCount: "6 Lessons",
    duration: "3.5 Hours",
    price: "Free Access",
    isPaid: false,
    instructor: "H.G. Gauranga Das & Senior Vedic Scholars",
    thumbnail: "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png",
    lessons: [
      {
        id: "dysc-1",
        title: {
          en: "Session 1: Can a Scientist Believe in God?",
          hi: "सत्र 1: क्या वैज्ञानिक ईश्वर में विश्वास कर सकता है?"
        },
        duration: "35 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/fDcfkZ5y6oA",
        summary: {
          en: "Explore the harmony between objective scientific inquiry and the Vedic worldview. Discover why matter cannot generate life and how intelligent cosmic design points to supreme intelligence.",
          hi: "वैज्ञानिक अनुसंधान और वैदिक दृष्टिकोण के अद्भुत सामंजस्य को समझें। जानें कि कैसे जड़ पदार्थ से चेतना उत्पन्न नहीं हो सकती और ब्रह्मांड की व्यवस्थित संरचना परम चेतना का प्रमाण है।"
        },
        keyTakeaways: {
          en: [
            "Limitations of empirical sensory perception (Indriya-pratyakṣa).",
            "Consciousness as the irreducible property of the soul, distinct from bio-chemistry.",
            "The cosmic fine-tuning principle and intelligent design."
          ],
          hi: [
            "इंद्रिय प्रत्यक्ष (Empirical perception) की चार मूलभूत सीमाएं।",
            "चेतना आत्मा का अविभाज्य लक्षण है, जो केवल रासायनिक संयोजन नहीं हो सकती।",
            "सृष्टि का सूक्ष्म संतुलन और परम नियंता की अनिवार्यता।"
          ]
        },
        verseRef: "Bhagavad-gītā 7.4 – 7.5"
      },
      {
        id: "dysc-2",
        title: {
          en: "Session 2: Getting the Eyes of Knowledge (The Vedas)",
          hi: "सत्र 2: ज्ञान चक्षु की प्राप्ति (वेद क्या हैं?)"
        },
        duration: "30 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/N0bW2rM3mGE",
        summary: {
          en: "Understand how knowledge is acquired through ascending vs descending methodologies. Discover why the Vedic literature is the user manual for human life.",
          hi: "ज्ञान प्राप्ति की आरोह और अवरोह प्रणालियों को समझें। जानें कि वैदिक साहित्य मानव जीवन के लिए एक प्रामाणिक मार्गदर्शिका (User Manual) के समान क्यों है।"
        },
        keyTakeaways: {
          en: [
            "Three methods of knowing: Pratyakṣa (Direct), Anumāna (Hypothesis), and Śabda (Revealed Testimony).",
            "Śabda-pramāṇa as the topmost flawless source for transcendental subjects.",
            "The structure of Vedic literature from Śrutis to Bhagavad-gītā and Śrīmad-Bhāgavatam."
          ],
          hi: [
            "ज्ञान प्राप्ति के तीन साधन: प्रत्यक्ष, अनुमान और शब्द प्रमाण।",
            "अलौकिक विषयों को समझने के लिए शब्द प्रमाण ही पूर्ण एवं त्रुटिरहित माध्यम है।",
            "वेदों, उपनिषदों से लेकर भगवद्गीता तक ज्ञान की समृद्ध शृंखला।"
          ]
        },
        verseRef: "Bhagavad-gītā 4.34"
      },
      {
        id: "dysc-3",
        title: {
          en: "Session 3: Science of the Soul & Reincarnation",
          hi: "सत्र 3: आत्मा का विज्ञान एवं पुनर्जन्म का रहस्य"
        },
        duration: "40 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/5qap5aO4i9A",
        summary: {
          en: "Analyze the fundamental distinction between the gross body, the subtle mind, and the eternal spiritual soul (Ātmā). Discover scientific and scriptural evidence for transmigration.",
          hi: "स्थूल शरीर, सूक्ष्म मन और शाश्वत जीवात्मा (आत्मा) के अंतर का गहरा विश्लेषण। पुनर्जन्म के वैज्ञानिक प्रमाणों और गीता के सूत्रों का अध्ययन।"
        },
        keyTakeaways: {
          en: [
            "Dehino 'smin yathā dehe: changing bodies from boyhood, youth to old age (BG 2.13).",
            "The soul is indestructible, unburnable, and eternal (BG 2.20).",
            "How the subtle body (mind, intelligence, false ego) carries the soul to the next birth."
          ],
          hi: [
            "बाल्यावस्था, यौवन और वृद्धावस्था के समान देहांतरण की वास्तविकता (गीता २.१३)।",
            "आत्मा को न शस्त्र काट सकते हैं, न अग्नि जला सकती है (गीता २.२३)।",
            "सूक्ष्म शरीर (मन, बुद्धि, अहंकार) आत्मा को नए शरीर में कैसे ले जाता है।"
          ]
        },
        verseRef: "Bhagavad-gītā 2.13 – 2.25"
      },
      {
        id: "dysc-4",
        title: {
          en: "Session 4: One God or Many Gods? Understanding the Supreme",
          hi: "सत्र 4: एक ईश्वर अथवा अनेक देव? परम सत्य का स्वरूप"
        },
        duration: "35 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/4W1aG9mGg9c",
        summary: {
          en: "Demystify the Vedic pantheon. Learn the relationship between the Supreme Lord (Īśvara) and the administrative deities (Devatās), and explore the three aspects of the Absolute Truth.",
          hi: "वैदिक देवमंडली के वास्तविक स्वरूप को जानें। परमेश्वर और प्रशासनिक देवी-देवताओं के संबंध तथा ब्रह्म, परमात्मा और भगवान के तीन स्तरों का स्पष्टीकरण।"
        },
        keyTakeaways: {
          en: [
            "Three realizations of the Absolute: Brahman (All-pervading light), Paramātmā (Indwelling Supersoul), and Bhagavān (Personal Lord).",
            "Devatās as cosmic ministers acting under the direction of the Supreme Lord.",
            "Mattaḥ parataraṁ nānyat: There is no truth superior to Kṛṣṇa (BG 7.7)."
          ],
          hi: [
            "परम सत्य की तीन अभिव्यक्तियां: ब्रह्म (ज्योति), परमात्मा (हृदयस्थ) और भगवान (दिव्य स्वरूप)।",
            "देवी-देवता ब्रह्मांडीय व्यवस्था के मंत्री हैं जो परमेश्वर के अधीन कार्य करते हैं।",
            "मत्तः परतरं नान्यत्: श्रीकृष्ण से श्रेष्ठ कोई अन्य सत्य नहीं है (गीता ७.७)।"
          ]
        },
        verseRef: "Bhagavad-gītā 7.7, 10.8"
      },
      {
        id: "dysc-5",
        title: {
          en: "Session 5: Why Do Bad Things Happen to Good People? (The Law of Karma)",
          hi: "सत्र 5: अच्छे लोगों के साथ बुरा क्यों होता है? (कर्म का अटल नियम)"
        },
        duration: "45 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/8tPnX7OPo0Q",
        summary: {
          en: "Unpack the rigorous mechanics of Karma. Understand why suffering exists, how individual accountability works, and how to become free from the endless cycle of karmic reactions.",
          hi: "कर्म के सूक्ष्म और अटल नियमों को समझें। कष्ट और विपत्तियों के कारण, व्यक्तिगत उत्तरदायित्व और कर्म के बंधनों से पूर्ण मुक्ति (अकर्म) का सूत्र।"
        },
        keyTakeaways: {
          en: [
            "Three types of actions: Karma (Pious), Vikarma (Sinful), and Akarma (Transcendental duty).",
            "Phases of reaction: Bīja (Seed), Kūṭa (Tendency), Phalonmukha (Imminent), and Prārabdha (Manifested).",
            "How devotional service burns away all accumulated past reactions."
          ],
          hi: [
            "कर्म के तीन प्रकार: कर्म (सत्कर्म), विकर्म (निषिद्ध कर्म) और अकर्म (भक्तिमय निष्काम कर्म)।",
            "कर्म फल की चार अवस्थाएं: बीज, कूट, फलोन्मुख और प्रारब्ध।",
            "भक्तिमय जीवन कैसे संचित कर्म फलों को दग्ध कर देता है।"
          ]
        },
        verseRef: "Bhagavad-gītā 4.17 – 4.18"
      },
      {
        id: "dysc-6",
        title: {
          en: "Session 6: The Topmost Yoga System for the Modern Age",
          hi: "सत्र 6: आधुनिक युग हेतु सर्वश्रेष्ठ योग प्रणाली"
        },
        duration: "40 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        summary: {
          en: "Trace the yoga ladder from Karma-yoga, Jñāna-yoga, Aṣṭāṅga-yoga to the pinnacle: Bhakti-yoga. Learn the practical art of Mantra Meditation with the Hare Kṛṣṇa Mahā-Mantra.",
          hi: "योग की सीढ़ी: कर्मयोग, ज्ञानयोग, अष्टांगयोग से लेकर सर्वोच्च भक्तियोग तक। महामंत्र जप ध्यान की व्यावहारिक विधि और शांति का अनुभव।"
        },
        keyTakeaways: {
          en: [
            "Yoginām api sarveṣāṁ: The devotee connected in loving service is the topmost yogī (BG 6.47).",
            "The Hare Kṛṣṇa Mahā-Mantra as the recommended cleansing process for the age of Kali.",
            "Practical daily 15-minute meditation routine for mental focus and spiritual equilibrium."
          ],
          hi: [
            "योगिनामपि सर्वेषां: श्रद्धापूर्वक भक्ति करने वाला भक्त सर्वश्रेष्ठ योगी है (गीता ६.४७)।",
            "कलियुग में चित्त की शुद्धि हेतु हरे कृष्ण महामंत्र की प्रामाणिकता।",
            "दैनिक जीवन में १५ मिनट का व्यावहारिक मंत्र ध्यान अभ्यास।"
          ]
        },
        verseRef: "Bhagavad-gītā 6.47, 9.2"
      }
    ],
    assessment: [
      {
        question: {
          en: "According to the Bhagavad-gītā (2.20), what is the intrinsic nature of the soul?",
          hi: "भगवद्गीता (२.२०) के अनुसार आत्मा का वास्तविक स्वभाव क्या है?"
        },
        options: {
          en: ["Perishable and created at physical birth", "Eternal, unborn, and indestructible", "A temporary byproduct of electrical brain impulses", "Constantly changing into new energy"],
          hi: ["नश्वर और जन्म के साथ उत्पन्न होने वाली", "शाश्वत, अजन्मा और अविनाशी", "मस्तिष्क के रासायनिक संकेतों का परिणाम", "समय के साथ बदलने वाली ऊर्जा"]
        },
        correctIndex: 1,
        explanation: {
          en: "The soul is never born, never dies, and is not slain when the body is slain (na hanyate hanyamāne śarīre).",
          hi: "आत्मा न कभी जन्म लेती है और न कभी मरती है; शरीर के नष्ट होने पर भी आत्मा कभी नष्ट नहीं होती।"
        }
      },
      {
        question: {
          en: "Which category of knowledge acquisition is considered flawless for spiritual realization?",
          hi: "आध्यात्मिक ज्ञान प्राप्ति हेतु कौन सा प्रमाण निर्दोष और सर्वोच्च माना गया है?"
        },
        options: {
          en: ["Pratyakṣa (Direct observation)", "Anumāna (Intellectual speculation)", "Śabda (Vedic revealed testimony)", "Yukti (Personal trial and error)"],
          hi: ["प्रत्यक्ष प्रमाण (इंद्रिय अनुभव)", "अनुमान प्रमाण (मानसिक कल्पना)", "शब्द प्रमाण (वैदिक श्रुति ज्ञान)", "युक्ति (परीक्षण एवं त्रुटि)"]
        },
        correctIndex: 2,
        explanation: {
          en: "Śabda-pramāṇa (hearing from authorized disciplic succession) is free from the 4 human defects.",
          hi: "शब्द प्रमाण मानवीय चार दोषों (भ्रम, प्रमाद, विप्रलिप्सा, करणापाटव) से सर्वथा मुक्त होता है।"
        }
      },
      {
        question: {
          en: "What is 'Akarma' as defined in Bhagavad-gītā Chapter 4?",
          hi: "भगवद्गीता अध्याय ४ के अनुसार 'अकर्म' का क्या अर्थ है?"
        },
        options: {
          en: ["Laziness and sitting idle without duty", "Sinful action that creates heavy distress", "Selfless devotional action done for the pleasure of the Supreme", "Giving up family responsibilities"],
          hi: ["आलस्यवश कर्म त्याग देना", "पापकर्म जिससे दुख मिलता है", "भगवान की प्रसन्नता हेतु किया गया निष्काम भक्तिमय कर्म", "पारिवारिक दायित्वों से भाग जाना"]
        },
        correctIndex: 2,
        explanation: {
          en: "Akarma refers to transcendental action that produces no material binding reactions.",
          hi: "अकर्म वह दिव्य कर्म है जो कर्ता को किसी भौतिक कर्म-बंधन या प्रतिक्रिया में नहीं बांधता।"
        }
      },
      {
        question: {
          en: "According to Lord Kṛṣṇa in BG 6.47, who is the topmost of all yogīs?",
          hi: "भगवद्गीता ६.४७ के अनुसार भगवान श्रीकृष्ण ने किसे सर्वश्रेष्ठ योगी बताया है?"
        },
        options: {
          en: ["One who fasts in mountain caves for decades", "One who masters advanced gymnastic poses", "One who always abides in Me with great faith and loving devotion", "One who accumulates vast academic book knowledge"],
          hi: ["जो गुफाओं में रहकर दशकों तक तप करता है", "जो कठिन शारीरिक आसनों में निपुण है", "जो श्रद्धापूर्वक अपने अंतःकरण में भगवान की भक्ति में लीन रहता है", "जो अत्यधिक शास्त्रीय वाद-विवाद करता है"]
        },
        correctIndex: 2,
        explanation: {
          en: "Yoginām api sarveṣāṁ mad-gatenāntar-ātmanā... Lord Kṛṣṇa confirms the devotee is the highest yogī.",
          hi: "जो भक्त अपने मन को भगवान में लगाकर श्रद्धापूर्वक भक्ति करता है, वही सभी योगियों में परम श्रेष्ठ है।"
        }
      }
    ]
  },
  {
    id: "science-of-self-realization",
    title: {
      en: "Science of Self-Realization & Practical Devotion",
      hi: "आत्म-साक्षात्कार का विज्ञान एवं व्यावहारिक भक्ति"
    },
    desc: {
      en: "Mastering practical devotion in day-to-day work, balancing modern career stress, and developing inner consciousness.",
      hi: "दैनिक कार्यस्थल में भक्तिमय संतुलन साधने, कार्य-तनाव से मुक्ति पाने और कर्म को योग बनाने का प्रामाणिक मार्ग।"
    },
    level: "Intermediate",
    lessonsCount: "4 Lessons",
    duration: "2.5 Hours",
    price: "Free Access",
    isPaid: false,
    instructor: "H.G. Radheshyam Das (M.Tech IIT Bombay)",
    thumbnail: "https://www.iskconpune.com/wp-content/uploads/2023/02/radha-vrindavanchandra-1024x683.jpeg",
    lessons: [
      {
        id: "ssr-1",
        title: {
          en: "Module 1: Defining the Living Entity & Mind Architecture",
          hi: "मॉड्यूल 1: जीवात्मा एवं मन की संरचना"
        },
        duration: "40 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/fDcfkZ5y6oA",
        summary: {
          en: "Analyze the chariot analogy of Kaṭha Upaniṣad: Senses as horses, Mind as reins, Intelligence as driver, Soul as passenger.",
          hi: "कठोपनिषद् के रथ रूपक द्वारा शरीर, मन और आत्मा की संरचना का अध्ययन।"
        },
        keyTakeaways: {
          en: [
            "Mind is restless by default; sharp spiritual intelligence is required to rein it in.",
            "Higher taste (paraṁ dṛṣṭvā nivartate) replaces lower attachments effortlessly."
          ],
          hi: [
            "मन चंचल है; शुद्ध आध्यात्मिक बुद्धि ही इसे नियंत्रित कर सकती है।",
            "उच्च रस की प्राप्ति से स्वतः ही निम्न आकर्षण शांत हो जाते हैं।"
          ]
        },
        verseRef: "Bhagavad-gītā 2.59, 6.5"
      },
      {
        id: "ssr-2",
        title: {
          en: "Module 2: The Three Modes of Material Nature (Guṇas)",
          hi: "मॉड्यूल 2: प्रकृति के तीन गुण (सत्व, रज, तम)"
        },
        duration: "45 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/N0bW2rM3mGE",
        summary: {
          en: "Understand how Sattva (goodness), Rajas (passion), and Tamas (ignorance) influence our thoughts, habits, food, and emotional wellness.",
          hi: "सत्व, रज और तम गुण हमारे विचारों, भोजन और आदतों को कैसे प्रभावित करते हैं।"
        },
        keyTakeaways: {
          en: [
            "Sattva brings clarity and inner joy; Rajas breeds greed and unrest; Tamas brings depression and lethargy.",
            "Cultivate pure goodness (Viśuddha-sattva) through spiritual practices."
          ],
          hi: [
            "सत्व गुण शांति देता है; रजोगुण अशांति और तृष्णा लाता है; तमोगुण आलस्य और विषाद देता है।",
            "साधना के माध्यम से गुणातीत स्थिति प्राप्त करना ही मानव जीवन का लक्ष्य है।"
          ]
        },
        verseRef: "Bhagavad-gītā 14.5 – 14.20"
      },
      {
        id: "ssr-3",
        title: {
          en: "Module 3: Overcoming Lust, Anger & Mental Burnout",
          hi: "मॉड्यूल 3: काम, क्रोध और मानसिक तनाव पर विजय"
        },
        duration: "40 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/5qap5aO4i9A",
        summary: {
          en: "Trace the 8-stage psychological descent described in BG 2.62-63 and discover practical tools to reverse it.",
          hi: "भगवद्गीता २.६२-६३ में वर्णित पतन की आठ सीढ़ियों का अध्ययन और मन को शांत रखने के सूत्र।"
        },
        keyTakeaways: {
          en: [
            "Contemplation of sense objects leads to attachment, which leads to lust, and then anger.",
            "Channeling energy into devotional service is the ultimate immunity against mental burnout."
          ],
          hi: [
            "विषयों का ध्यान करने से आसक्ति, आसक्ति से काम और काम में बाधा पड़ने पर क्रोध उत्पन्न होता है।",
            "भगवान की सेवा में ऊर्जा लगाने से मानसिक शांति प्राप्त होती है।"
          ]
        },
        verseRef: "Bhagavad-gītā 2.62 – 2.63"
      },
      {
        id: "ssr-4",
        title: {
          en: "Module 4: The Practical Science of Japa Meditation",
          hi: "मॉड्यूल 4: जप ध्यान की व्यावहारिक कला"
        },
        duration: "35 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/4W1aG9mGg9c",
        summary: {
          en: "Learn proper posture, concentration techniques, and mental attitude for attentive chanting on Tulasī beads.",
          hi: "तुलसी माला पर एकाग्रतापूर्वक हरे कृष्ण महामंत्र जप की प्रामाणिक विधि और लाभ।"
        },
        keyTakeaways: {
          en: [
            "Clarity of pronunciation: hearing each syllable of the Holy Name attentively.",
            "Morning Brahma-muhūrta as the prime time for deep spiritual absorption."
          ],
          hi: [
            "स्पष्ट उच्चारण और प्रत्येक नाम का ध्यानपूर्वक श्रवण।",
            "ब्रह्ममुहूर्त में जप करने से विशेष आध्यात्मिक ऊर्जा प्राप्त होती है।"
          ]
        },
        verseRef: "Caitanya Caritāmṛta Ādi 17.21"
      }
    ],
    assessment: [
      {
        question: {
          en: "In the chariot analogy, what does the 'driver' represent?",
          hi: "कठोपनिषद् के रथ रूपक में 'सारथी' किसे दर्शाया गया है?"
        },
        options: {
          en: ["The physical body", "The restless mind", "The discerning intelligence (Buddhi)", "The physical senses"],
          hi: ["स्थूल शरीर को", "चंचल मन को", "विवेकशील बुद्धि को", "शारीरिक इंद्रियों को"]
        },
        correctIndex: 2,
        explanation: {
          en: "Intelligence (Buddhi) acts as the driver holding the reins (Mind) to control the horses (Senses).",
          hi: "सारथी बुद्धि का प्रतीक है, जो मन रूपी लगाम से इंद्रिय रूपी घोड़ों को नियंत्रित करता है।"
        }
      }
    ]
  }
];

export function getCourseById(id: string): LMSCourse | undefined {
  return LMS_COURSES.find((c) => c.id === id);
}
