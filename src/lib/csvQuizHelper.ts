export interface ParsedQuizQuestion {
  id: number;
  question: { en: string; hi: string };
  options: {
    A: { en: string; hi: string };
    B: { en: string; hi: string };
    C: { en: string; hi: string };
    D: { en: string; hi: string };
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: { en: string; hi: string };
  points: number;
  imageUrl?: string;
}

export const SAMPLE_CSV_CONTENT = `question_hi,question_en,option_a_hi,option_a_en,option_b_hi,option_b_en,option_c_hi,option_c_en,option_d_hi,option_d_en,correct_answer,explanation_hi,explanation_en,points,image_url
"भगवद्गीता के अनुसार आत्मा का क्या स्वभाव है?","According to Bhagavad-gītā, what is the nature of the soul?","नश्वर और विनाशी","Perishable & destructible","अविनाशी और शाश्वत","Eternal & indestructible","केवल एक रासायनिक प्रक्रिया","A chemical reaction","परिवर्तनशील","Constantly changing","B","आत्मा कभी जन्म नहीं लेती और न कभी मरती है (अध्याय 2 श्लोक 20)।","The soul is never born and never dies; it is eternal and indestructible (BG 2.20).",10,"https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80"
"कुरुक्षेत्र युद्ध में अर्जुन के सारथी कौन थे?","Who was Arjuna's charioteer on the battlefield of Kurukṣetra?","भगवान श्रीकृष्ण","Lord Śrī Kṛṣṇa","भीष्म पितामह","Grandfather Bhīṣma","द्रोणाचार्य","Droṇācārya","युधिष्ठिर","Yudhiṣṭhira","A","भगवान श्रीकृष्ण ने स्वयं पार्थसारथी बनकर अर्जुन का रथ चलाया।","Lord Kṛṣṇa lovingly took the position of Pārtha-sārathi, Arjuna's charioteer.",10,"https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
"भगवद्गीता में कुल कितने अध्याय हैं?","How many chapters are there in the Bhagavad-gītā?","12","12","16","16","18","18","24","24","C","भगवद्गीता महाभारत के भीष्म पर्व का अंग है जिसमें 18 अध्याय हैं।","The Bhagavad-gītā consists of 18 sacred chapters spoken by Lord Kṛṣṇa.",10,"https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80"
"कलियुग में परम सिद्धि प्राप्त करने का सर्वोत्तम साधन क्या है?","What is the topmost method to achieve spiritual perfection in Kali Yuga?","कठिन तपस्या","Severe Austerities","विशाल यज्ञ","Grand Sacrifices","मंदिर निर्माण","Temple construction","हरे कृष्ण महामंत्र का जप","Chanting Hare Kṛṣṇa Mahā-Mantra","D","कलौ संकीर्तनाद् विष्णोः - कलियुग में केवल हरिनाम संकीर्तन ही मुक्ति का साधन है।","In this age of Kali, congregational chanting of the Holy Names is the only deliverance.",10,"https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन - यह श्लोक किस अध्याय का है?","In which chapter does the famous verse 'Karmanye vadhi karaste...' appear?","अध्याय 1","Chapter 1","अध्याय 2","Chapter 2","अध्याय 4","Chapter 4","अध्याय 6","Chapter 6","B","यह श्लोक अध्याय 2 श्लोक 47 में कर्मयोग का मूलभूत सिद्धांत सिखाता है।","This verse appears in Chapter 2, Verse 47 teaching selfless duty.",10,"https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80"
"प्रकृति के तीन गुण कौन से हैं?","What are the three modes of material nature (Guṇas)?","सत्व, रज, तम","Sattva, Rajas, Tamas","आकाश, वायु, अग्नि","Ether, Air, Fire","मन, बुद्धि, अहंकार","Mind, Intellect, False Ego","धर्म, अर्थ, काम","Dharma, Artha, Kama","A","सत्व (शांति), रज (इच्छा), और तम (अज्ञान) भौतिक प्रकृति के 3 गुण हैं।","Sattva (goodness), Rajas (passion), and Tamas (ignorance) bind the conditioned soul.",10,"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
"भगवद्गीता का उपदेश अर्जुन के अतिरिक्त सबसे पहले किसने सुना?","Besides Arjuna, who heard the Bhagavad-gītā directly on the battlefield?","संजय और धृतराष्ट्र","Sañjaya & Dhṛtarāṣṭra","कर्ण","Karṇa","दुर्योधन","Duryodhana","कुन्ती महारानी","Queen Kuntī","A","संजय ने दिव्य दृष्टि से कुरुक्षेत्र की वार्ता सीधे धृतराष्ट्र को सुनाई।","Sañjaya received divine vision from Vyāsadeva to narrate the dialogue to Dhṛtarāṣṭra.",10,"https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80"
"मन को वश में करने के दो मुख्य साधन भगवान ने क्या बताए हैं?","What two essential means did Lord Kṛṣṇa prescribe to control the restless mind?","अभ्यास और वैराग्य","Practice & Detachment","धन और प्रतिष्ठा","Wealth & Prestige","मौन और उपवास","Silence & Fasting","हठयोग और व्यायाम","Physical Exercise & Yoga","A","अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते (अध्याय 6 श्लोक 35)।","The restless mind can be curbed by constant practice and detachment (BG 6.35).",10,"https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
"भगवान श्रीकृष्ण का दिव्य धाम कौन सा है?","What is the supreme transcendental abode of Lord Śrī Kṛṣṇa?","गोलोक वृन्दावन","Goloka Vṛndāvana","कैलाश","Kailāsa","ब्रह्मलोक","Brahmaloka","स्वर्गलोक","Svargaloka","A","न तद्भासयते सूर्यो... यद्गत्वा न निवर्तन्ते तद्धाम परमं मम (भगवद्गीता 15.6)।","Goloka Vṛndāvana is the eternal spiritual abode of Lord Kṛṣṇa (BG 15.6).",10,"https://www.iskconpune.com/wp-content/uploads/2023/02/radha-vrindavanchandra-1024x683.jpeg"
"भगवद्गीता का अंतिम उपदेश (18.66) क्या है?","What is the ultimate conclusion of the Bhagavad-gītā (BG 18.66)?","समस्त धर्मों को त्यागकर केवल भगवान की शरण में जाना","Abandon all varieties of religion and surrender unto Kṛṣṇa alone","केवल ज्ञान संचय करना","Accumulating academic knowledge","कर्मकांड करना","Performing ritual sacrifices","निष्क्रिय हो जाना","Becoming inactive and renouncing duties","A","सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥","Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions (BG 18.66).",10,"https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png"`;

export function parseCSVToQuestions(csvText: string): { questions: ParsedQuizQuestion[]; error?: string } {
  try {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return { questions: [], error: "CSV file must contain a header line and at least one question." };
    }

    const questions: ParsedQuizQuestion[] = [];

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim().replace(/^["']|["']$/g, ""));
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^["']|["']$/g, ""));
      return result;
    };

    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      if (cols.length < 11) continue;

      const [
        qHi, qEn,
        optAHi, optAEn,
        optBHi, optBEn,
        optCHi, optCEn,
        optDHi, optDEn,
        rawAnswer,
        expHi = "", expEn = "",
        rawPoints = "10",
        imageUrl = ""
      ] = cols;

      const answer = rawAnswer.toUpperCase().trim() as 'A' | 'B' | 'C' | 'D';
      if (!['A', 'B', 'C', 'D'].includes(answer)) {
        continue;
      }

      questions.push({
        id: i,
        question: { hi: qHi || qEn, en: qEn || qHi },
        options: {
          A: { hi: optAHi || optAEn, en: optAEn || optAHi },
          B: { hi: optBHi || optBEn, en: optBEn || optBHi },
          C: { hi: optCHi || optCEn, en: optCEn || optCHi },
          D: { hi: optDHi || optDEn, en: optDEn || optDHi },
        },
        correctAnswer: answer,
        explanation: { hi: expHi || expEn, en: expEn || expHi },
        points: parseInt(rawPoints, 10) || 10,
        imageUrl: imageUrl.trim() || undefined,
      });
    }

    if (questions.length === 0) {
      return { questions: [], error: "No valid questions could be parsed from the CSV." };
    }

    return { questions };
  } catch (err: any) {
    return { questions: [], error: "Failed to parse CSV: " + err.message };
  }
}

export function downloadSampleCsvTemplate(fileName = "sample_vedic_quiz_template.csv") {
  if (typeof window === "undefined") return;
  const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
