'use client';

import { FormEvent, useState, useEffect } from 'react';
import './monk.css';
import { useLanguage } from '@/context/LanguageContext';

type Lang = 'hi' | 'en';

interface ContentDictionary {
  nav: {
    about: string;
    tracks: string;
    progression: string;
    schedule: string;
    norms: string;
    faq: string;
    contact: string;
    apply: string;
  };
  hero: {
    mantra: string;
    mantraTranslit: string;
    kicker: string;
    title: string;
    subtitle: string;
    applyBtn: string;
    exploreBtn: string;
    stats: { num: string; label: string }[];
  };
  objective: {
    kicker: string;
    title: string;
    quote: string;
    author: string;
  };
  story: {
    kicker: string;
    title: string;
    titleEm: string;
    desc: string;
    features: string[];
    badgeTitle: string;
    badgeSub: string;
  };
  eligibility: {
    kicker: string;
    title: string;
    intro: string;
    items: { num: string; title: string; body: string }[];
  };
  tracks: {
    kicker: string;
    title: string;
    intro: string;
    items: {
      code: string;
      title: string;
      tag: string;
      desc: string;
      structureLabel: string;
      structure: string;
      trackKey: string;
      btnText: string;
    }[];
  };
  progression: {
    kicker: string;
    title: string;
    intro: string;
    steps: {
      month: string;
      time: string;
      rounds: string;
      body: string;
      pinnacle?: boolean;
    }[];
    acceleratedTitle: string;
    accelerated: string[];
  };
  schedule: {
    kicker: string;
    title: string;
    intro: string;
    items: { time: string; title: string; desc: string }[];
  };
  norms: {
    kicker: string;
    title: string;
    intro: string;
    principlesTitle: string;
    principles: { pillar: string; title: string; body: string }[];
    disciplineTitle: string;
    discipline: { icon: string; title: string; body: string }[];
  };
  advanced: {
    kicker: string;
    title: string;
    intro: string;
    items: { idx: string; title: string; body: string }[];
  };
  pathway: {
    kicker: string;
    title: string;
    intro: string;
    steps: { step: string; title: string; body: string }[];
  };
  faq: {
    kicker: string;
    title: string;
    intro: string;
    items: { q: string; a: string }[];
  };
  cta: {
    kicker: string;
    title: string;
    body: string;
    btn: string;
  };
  contact: {
    kicker: string;
    title: string;
    phoneLabel: string;
    phone: string;
    locationLabel: string;
    location: string;
  };
  form: {
    kicker: string;
    title: string;
    intro: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    selectedBadge: string;
    selectTrackHint: string;
    selectStatusHint: string;
    trustTitle: string;
    guaranteeNote: string;
    callNowBtn: string;
    whatsappBtn: string;
    nextStepsTitle: string;
    nextSteps: { step: string; title: string; desc: string }[];
    fullName: string;
    fullNameHint: string;
    mobile: string;
    mobileHint: string;
    age: string;
    ageHint: string;
    trackChoice: string;
    trackChoiceHint: string;
    trackOptions: { value: string; label: string }[];
    status: string;
    statusHint: string;
    statusOptions: { value: string; label: string }[];
    nativeAddress: string;
    nativeAddressHint: string;
    currentAddress: string;
    currentAddressHint: string;
    notes: string;
    notesHint: string;
    consent: string;
    submit: string;
    submitting: string;
    close: string;
    successTitle: string;
    successBody: string;
    done: string;
    helplineNotice: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    address: string;
  };
}

const content: Record<Lang, ContentDictionary> = {
  hi: {
    nav: {
      about: 'परिचय',
      tracks: '३ मार्ग',
      progression: 'साधना क्रम',
      schedule: 'दिनचर्या',
      norms: 'नियम',
      faq: 'प्रश्नोत्तरी',
      contact: 'संपर्क',
      apply: 'रुचि पंजीकरण',
    },
    hero: {
      mantra: '॥ हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥',
      mantraTranslit: 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare | Hare Rama Hare Rama Rama Rama Hare Hare',
      kicker: 'इस्कॉन एनवीसीसी पुणे • आवासीय गुरुकुल प्रशिक्षण',
      title: 'LIVE LIKE A MONK',
      subtitle: 'मंदिर में रहिए • सीखिए • सेवाभाव विकसित कीजिए • आध्यात्मिक जीवन को अपनाइए',
      applyBtn: 'रुचि दर्ज करें — आवेदन करें',
      exploreBtn: 'पाठ्यक्रम विवरण देखें',
      stats: [
        { num: '१८–३० वर्ष', label: 'अनिवार्य आयु सीमा' },
        { num: '३ मार्ग', label: 'करियर, सेवा व आश्रम' },
        { num: '४ से १६ माला', label: 'साधना एवं नाम-जप क्रम' },
        { num: '१००% सात्त्विक', label: 'कृष्ण-प्रसादम एवं संग' },
      ],
    },
    objective: {
      kicker: 'उद्देश्य एवं दृष्टि',
      title: 'अनुशासित एवं सात्त्विक जीवन की ओर एक दृढ़ कदम',
      quote:
        '१८ से ३० वर्ष की आयु के उत्साही युवाओं को एक अनुशासित, आध्यात्मिक रूप से उन्नत और सहयोगी परिवेश प्रदान करना, ताकि वे अपने चारित्रिक गुणों का विकास कर सकें, जीवन के अमूल्य कौशल सीख सकें और वैदिक सिद्धांतों को अपनी दैनिक जीवनशैली में आत्मसात कर सकें—चाहे वे बाह्य व्यावसायिक कर्म चुनें अथवा पूर्णकालिक मंदिर सेवा।',
      author: '— आवासीय गुरुकुल प्रशिक्षण पाठ्यक्रम, इस्कॉन एनवीसीसी पुणे',
    },
    story: {
      kicker: 'श्री श्री राधा वृंदावनचंद्र मंदिर परिसर',
      title: 'मंदिर जीवन को केवल देखिए नहीं —',
      titleEm: 'साक्षात अनुभव कीजिए',
      desc: 'इस्कॉन NVCC पुणे (न्यू वैदिक कल्चरल सेंटर) का सुरम्य परिसर युवाओं को भौतिक जीवन के तनाव और विकर्षणों से दूर एक शांत, पवित्र और प्रेरणादायक वातावरण प्रदान करता है। यहाँ भव्य विग्रह सेवा, वैदिक शास्त्र अध्ययन और वरिष्ठ भक्तों के संग में चरित्र का दिव्य रूपांतरण होता है।',
      features: [
        'वरिष्ठ वैष्णवों का प्रत्यक्ष व्यक्तिगत मार्गदर्शन एवं काउंसिलिंग',
        'एकाग्र, सात्त्विक और शांतिपूर्ण साधना परिवेश',
        'भगवान श्री कृष्ण को अर्पित नित्य शुद्ध सात्त्विक महाप्रसादम',
      ],
      badgeTitle: 'श्री श्री राधा वृंदावनचंद्र मंदिर',
      badgeSub: 'इस्कॉन एनवीसीसी, कात्रज-कोंढवा बायपास, पुणे',
    },
    eligibility: {
      kicker: 'प्रवेश मानक',
      title: '१. पात्रता एवं प्रवेश के नियम',
      intro:
        'मंदिर परिसर में अत्यंत एकाग्र, सौहार्दपूर्ण एवं आध्यात्मिक रूप से दिव्य वातावरण बनाए रखने हेतु प्रवेश प्रक्रिया को निर्धारित मानकों के आधार पर कड़ाई से संचालित किया जाता है।',
      items: [
        {
          num: '०१',
          title: 'आयु सीमा (18 से 30 वर्ष)',
          body: 'प्रवेश के समय अभ्यर्थी की आयु अनिवार्य रूप से १८ से ३० वर्ष के मध्य होनी चाहिए (१८ वर्ष से कम अथवा ३० वर्ष से अधिक के अभ्यर्थी पात्र नहीं हैं)।',
        },
        {
          num: '०२',
          title: 'शैक्षणिक पृष्ठभूमि',
          body: 'शिक्षित एवं अशिक्षित दोनों प्रकार के उत्साही युवाओं का स्वागत है, जिनमें आचरण सुधार तथा आंतरिक रूपांतरण की गहरी जिज्ञासा हो।',
        },
        {
          num: '०३',
          title: 'जीवन लक्ष्य व कार्य दिशा',
          body: 'यह पाठ्यक्रम उन दोनों वर्गों के लिए तैयार किया गया है—जो बाहर नौकरी व करियर जारी रखना चाहते हैं, अथवा मंदिर की प्रत्यक्ष भक्ति-सेवा में समर्पित होना चाहते हैं।',
        },
        {
          num: '०४',
          title: 'अनिवार्य साक्षात्कार',
          body: 'मंदिर में निवास की अंतिम अनुमति प्राप्त करने से पूर्व, प्रत्येक अभ्यर्थी को वरिष्ठ वैष्णवों के पैनल के समक्ष एक औपचारिक साक्षात्कार सफलतापूर्वक उत्तीर्ण करना अनिवार्य है।',
        },
      ],
    },
    tracks: {
      kicker: 'आपके लिए कौन-सा मार्ग?',
      title: 'रणनीतिक नामांकन श्रेणियाँ',
      intro:
        'प्रत्येक अभ्यर्थी को उनके भावी करियर लक्ष्य तथा आध्यात्मिक समर्पण के आधार पर निम्नलिखित तीन प्रमुख श्रेणियों में वर्गीकृत किया जाता है।',
      items: [
        {
          code: 'TRACK A',
          title: 'कामकाजी पेशेवर',
          tag: 'करियर + मंदिर जीवन',
          desc: 'ऐसे युवा जो बाहर स्वतंत्र व्यावसायिक नौकरी/करियर करते हैं अथवा मंदिर के भीतर नियमित सवेतन पदों पर सेवा करते हैं।',
          structureLabel: 'वित्तीय एवं आवासीय व्यवस्था',
          structure:
            'अंशदायी व्यवस्था: आवास रखरखाव, बिजली एवं बुनियादी व्यवस्थाओं हेतु अभ्यर्थी मंदिर प्रशासन को एक निश्चित मासिक सहयोग राशि अर्पित करते हैं।',
          trackKey: 'Track A - कामकाजी पेशेवर (Working Professionals)',
          btnText: 'ट्रैक A चुनें और आवेदन करें',
        },
        {
          code: 'TRACK B',
          title: 'मंदिर स्वयंसेवक',
          tag: 'पूर्णकालिक सेवा',
          desc: 'ऐसे युवा जो मंदिर के विभिन्न सेवा-विभागों एवं परियोजनाओं के संचालन में अवैतनिक, पूर्णकालिक भक्ति-सेवा (सेवा) समर्पित करते हैं।',
          structureLabel: 'वित्तीय एवं आवासीय व्यवस्था',
          structure:
            'पूर्णतः प्रायोजित: मंदिर प्रशासन अभ्यर्थी के आवास एवं दैनिक कृष्ण-प्रसादम का शत-प्रतिशत व्यय पूर्ण रूप से वहन करता है।',
          trackKey: 'Track B - मंदिर स्वयंसेवक (Temple Volunteers)',
          btnText: 'ट्रैक B चुनें और आवेदन करें',
        },
        {
          code: 'TRACK C',
          title: 'ब्रह्मचर्य जीवन आकांक्षी',
          tag: 'गहन आश्रम प्रशिक्षण',
          desc: 'ऐसे युवा जो शुद्ध, एकाग्र और पूर्ण ब्रह्मचर्य-युक्त संन्यासी/मठवासी जीवनशैली के प्रति समर्पित होने का दृढ़ संकल्प रखते हैं।',
          structureLabel: 'वित्तीय एवं आवासीय व्यवस्था',
          structure:
            'ब्रह्मचारी प्रशिक्षण: साधक सीधे समर्पित आश्रम दिनचर्या में प्रवेश करते हैं जहाँ गहन शास्त्र-अध्ययन व साधना-प्रशिक्षण प्रदान किया जाता है।',
          trackKey: 'Track C - ब्रह्मचर्य जीवन आकांक्षी (Celibacy Life Aspirant)',
          btnText: 'ट्रैक C चुनें और आवेदन करें',
        },
      ],
    },
    progression: {
      kicker: 'चरणबद्ध साधना',
      title: '२. आध्यात्मिक प्रगति एवं नाम-जप क्रम',
      intro:
        'गुरुकुल का मूल केंद्र बिंदु साधक का क्रमिक, सुदृढ़ और आध्यात्मिक रूप से दृढ़ रूपांतरण है। नए अभ्यर्थियों के लिए प्रातःकालीन समय और ध्यान साधना का नियम चरणबद्ध तरीके से बढ़ाया जाता है।',
      steps: [
        {
          month: 'प्रथम माह',
          time: 'प्रातः ६:३० बजे',
          rounds: '४ माला जप',
          body: 'पूर्ण स्नान व स्वच्छ वैष्णव वस्त्र धारण कर मंदिर हॉल में उपस्थिति → नित्य ४ माला महामंत्र का जप।',
        },
        {
          month: 'द्वितीय माह',
          time: 'प्रातः ६:०० बजे',
          rounds: '८ माला जप',
          body: 'नियमित समय पर मंदिर हॉल में उपस्थिति → प्रतिदिन ८ माला हरे कृष्ण महामंत्र का जप।',
        },
        {
          month: 'तृतीय माह',
          time: 'प्रातः ५:३० बजे',
          rounds: '१२ माला जप',
          body: 'मंदिर हॉल में साधना हेतु उपस्थिति → प्रतिदिन १२ माला महामंत्र का एकाग्रता पूर्वक जप।',
        },
        {
          month: 'चतुर्थ माह',
          time: 'प्रातः ५:०० बजे',
          rounds: '१६ माला जप',
          body: 'मंदिर हॉल में उपस्थिति → प्रतिदिन १६ माला महामंत्र का विधिपूर्वक जप।',
        },
        {
          month: 'पंचम माह से आगे',
          time: 'प्रातः ४:३० बजे',
          rounds: 'मंगल आरती + १६ माला',
          body: 'पूर्ण मंदिर मानक: नित्य समय पर मंदिर हॉल में मंगल आरती (४:३० AM) में उपस्थिति → शास्त्रीय प्रमाण के अनुसार नित्य अनिवार्य न्यूनतम १६ माला का नियमपूर्वक जप।',
          pinnacle: true,
        },
      ],
      acceleratedTitle: 'पूर्व अभ्यासी भक्त (त्वरित पद्धति)',
      accelerated: [
        'जो साधक पहले से नाम-जप का अभ्यास कर रहे हैं, वे अपने पूर्व निर्धारित जप की संख्या से ही शुरुआत करेंगे।',
        'वे सीधे अंतिम लक्ष्य को अपनाएंगे: नित्य प्रातः ४:३० बजे मंगल आरती में उपस्थिति और प्रतिदिन न्यूनतम १६ माला का जप।',
      ],
    },
    schedule: {
      kicker: 'आश्रम दिनचर्या',
      title: 'एक साधक का दैनिक जीवन',
      intro:
        'एक संतुलित एवं सात्त्विक दिनचर्या जो साधना, शारीरिक ऊर्जा, ज्ञान-वृद्धि और व्यावसायिक/सेवा कर्म में सामंजस्य स्थापित करती है।',
      items: [
        {
          time: '०४:३० AM',
          title: 'मंगल आरती एवं तुलसी पूजा',
          desc: 'दिव्य दर्शन, धूप-दीप आरती एवं तुलसी महारानी की परिक्रमा के साथ दिन का शुभ शुभारंभ।',
        },
        {
          time: '०५:०० AM - ०७:१५ AM',
          title: 'महामंत्र जप साधना',
          desc: 'मंदिर हॉल में शांत वातावरण में एकाग्रतापूर्वक हरे कृष्ण महामंत्र का व्यक्तिगत जप।',
        },
        {
          time: '०७:१५ AM',
          title: 'दर्शन आरती एवं गुरु पूजा',
          desc: 'श्री श्री राधा वृंदावनचंद्र के मनोहारी दर्शन एवं संस्थापक आचार्य श्रील प्रभुपाद की गुरु पूजा।',
        },
        {
          time: '०७:४५ AM',
          title: 'श्रीमद्भागवतम तत्वज्ञान कक्षा',
          desc: 'वरिष्ठ संन्यासियों व विद्वानों द्वारा श्रीमद्भागवतम के श्लोकों का वैज्ञानिक व व्यावहारिक विश्लेषण।',
        },
        {
          time: '०८:४५ AM',
          title: 'भगवान का पवित्र महाप्रसादम',
          desc: 'भगवान श्री कृष्ण को अर्पित १००% शुद्ध, ताजा, सात्त्विक एवं पौष्टिक प्रातःकालीन प्रसादम।',
        },
        {
          time: '०९:३० AM - ०६:०० PM',
          title: 'करियर / मंदिर सेवा / अध्ययन',
          desc: 'ट्रैक A साधक अपने जॉब/कॉलेज जाते हैं; ट्रैक B व C साधक मंदिर सेवा व शास्त्र-अध्ययन करते हैं।',
        },
        {
          time: '०७:०० PM',
          title: 'संध्या गौर आरती एवं संकीर्तन',
          desc: 'शाम की आरती में मृदंग-करताल की मधुर ध्वनि पर आनंदमय हरिनाम संकीर्तन।',
        },
        {
          time: '०८:१५ PM - ०९:३० PM',
          title: 'रात्रि प्रसादम एवं स्वाध्याय',
          desc: 'हल्का सात्त्विक प्रसादम, दिन का अवलोकन, व्यक्तिगत शास्त्र-अध्ययन और समय पर विश्राम।',
        },
      ],
    },
    norms: {
      kicker: 'आध्यात्मिक अनुशासन',
      title: '३. आचार संहिता एवं मंदिर के नियम',
      intro:
        'मंदिर की आध्यात्मिक पवित्रता, सकारात्मक ऊर्जा और सात्त्विक वातावरण बनाए रखने हेतु सभी निवासियों द्वारा इन नियमों का पूर्ण पालन अनिवार्य है।',
      principlesTitle: 'चार नियामक सिद्धांत (The 4 Regulative Principles)',
      principles: [
        {
          pillar: 'दया (Compassion)',
          title: '१. मांसाहार निषेध',
          body: 'जीवों के प्रति दया और करुणा विकसित करने हेतु मांस, मछली, अंडे एवं समुद्री जीवों का पूर्ण त्याग।',
        },
        {
          pillar: 'तपस्या (Austerity)',
          title: '२. नशा निषेध',
          body: 'शराब, मादक द्रव्य, तंबाकू, धूम्रपान, चाय तथा कॉफी का पूर्णतः परित्याग।',
        },
        {
          pillar: 'शौच (Purity)',
          title: '३. अवैध संग निषेध',
          body: 'शारीरिक ब्रह्मचर्य का पालन, नैतिक चरित्र और विचारों की शुचिता बनाए रखना।',
        },
        {
          pillar: 'सत्य (Truthfulness)',
          title: '४. द्यूत क्रीड़ा निषेध',
          body: 'सट्टेबाजी, जुआ, लॉटरी अथवा वित्तीय सट्टे से पूर्ण दूरी बनाए रखना।',
        },
      ],
      disciplineTitle: 'संचार माध्यम, तकनीक एवं आहार अनुशासन',
      discipline: [
        {
          icon: '📱',
          title: 'स्मार्टफोन पर कड़ा नियंत्रण',
          body: 'मोबाइल फोन पर भौतिकतावादी फिल्में देखना, अनावश्यक सोशल मीडिया स्क्रॉल करना अथवा सिनेमाई/पॉप संगीत सुनना पूर्णतः प्रतिबंधित है।',
        },
        {
          icon: '💻',
          title: 'स्वीकृत उपकरण उपयोग',
          body: 'फोन व लैपटॉप का उपयोग केवल आवश्यक व्यावहारिक/कार्यालयीन संचार, शिक्षा, अथवा भक्ति प्रवचन व कीर्तन श्रवण तक ही सीमित रहेगा।',
        },
        {
          icon: '🍲',
          title: 'आहार मर्यादा',
          body: 'मंदिर की सीमा के भीतर बाहर का भोजन, बाजार के तले-भुने स्नैक्स, अथवा कोई भी तामसिक पदार्थ लाना व ग्रहण करना सर्वथा वर्जित है।',
        },
        {
          icon: '✨',
          title: 'प्रसादम निष्ठा',
          body: 'सभी निवासियों को मंदिर के पवित्र भोजनालय में भगवान श्री कृष्ण को अर्पित शुद्ध सात्त्विक महाप्रसादम ही आदरपूर्वक ग्रहण करना होगा।',
        },
        {
          icon: '👔',
          title: 'शुचिता एवं वेशभूषा',
          body: 'प्रत्येक प्रातः मंदिर हॉल में प्रवेश से पूर्व पूर्ण स्नान कर स्वच्छ, धुले हुए धोती-कुर्ता/वैष्णव वस्त्र धारण करना आवश्यक है। सभी प्रातःकालीन कार्यक्रमों में समय की पूर्ण पाबंदी अनिवार्य है।',
        },
        {
          icon: '🕊️',
          title: 'सौहार्दपूर्ण व्यवहार',
          body: 'आश्रम के साथी साधकों व वरिष्ठ वैष्णवों के प्रति विनम्रता, आदर, सेवाभाव एवं पारस्परिक सहयोग की भावना बनाए रखना।',
        },
      ],
    },
    advanced: {
      kicker: 'ट्रैक C विशेष',
      title: '४. उन्नत श्रेणी: ब्रह्मचारी आश्रम प्रशिक्षण',
      intro:
        'ट्रैक C के अंतर्गत जो युवा एक प्रामाणिक मठवासी व संन्यासी जीवनशैली अपनाने के प्रति समर्पित निष्ठा दर्शाते हैं, उन्हें ब्रह्मचारी आश्रम में विशेष प्रवेश दिया जाता है।',
      items: [
        {
          idx: '०१',
          title: 'वरिष्ठ वैष्णव मार्गदर्शन',
          body: 'अनुभवी एवं वरिष्ठ वैष्णवों के प्रत्यक्ष सानिध्य में व्यक्तिगत मार्गदर्शन, नियमित काउंसिलिंग तथा आध्यात्मिक संगति।',
        },
        {
          idx: '०२',
          title: 'विशिष्ट पाठ्यक्रम',
          body: 'गहन शास्त्रीय अध्ययन (भक्ति शास्त्री आदि प्रमाण-पत्र), बैक-अप सेवा प्रबंधन, मंदिर प्रशासन प्रणालियाँ तथा जन-प्रचार व संकीर्तन की व्यावहारिक शिक्षा।',
        },
        {
          idx: '०३',
          title: 'चरित्र निर्माण',
          body: 'वास्तविक विनम्रता (तृणादपि सुनीचेन), पूर्ण इंद्रिय-संयम, नेतृत्व सत्यनिष्ठा और श्री कृष्ण के चरणों में पूर्ण शरणागति का अभ्यास।',
        },
      ],
    },
    pathway: {
      kicker: 'सरल चयन प्रक्रिया',
      title: '५. प्रवेश एवं चयन प्रक्रिया',
      intro:
        'रुचि दर्ज करना अंतिम प्रवेश नहीं है। निवास की अनुमति पूरी तरह चयन एवं व्यक्तिगत साक्षात्कार प्रक्रिया पर निर्भर करती है।',
      steps: [
        {
          step: '१',
          title: 'आवेदन पत्र प्राप्ति',
          body: 'उम्मीदवार की शैक्षणिक पृष्ठभूमि, आयु विवरण, वर्तमान आजीविका तथा पूर्व आध्यात्मिक परिचय का विवरण संकलित करने हेतु मानक प्रपत्र।',
        },
        {
          step: '२',
          title: 'अनिवार्य साक्षात्कार',
          body: 'अंतिम प्रवेश से पूर्व वरिष्ठ भक्तों का मंडल अभ्यर्थी के चरित्र, मानसिक संतुलन और चारों नियमों, प्रातःकालीन साधना व इलेक्ट्रॉनिक प्रतिबंधों के स्वैच्छिक पालन की निष्ठा की गहन जांच करता है।',
        },
        {
          step: '३',
          title: 'आश्रम प्रबंधन व निगरानी',
          body: 'समर्पित आश्रम प्रमुख (Ashram Leader/Mentor) की नियुक्ति, जो दैनिक उपस्थिति, प्रातः जागरण के समय और नित्य जप-माला की प्रगति का निरंतर निरीक्षण व मार्गदर्शन करेंगे।',
        },
      ],
    },
    faq: {
      kicker: 'प्रश्नोत्तरी',
      title: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
      intro: 'गुरुकुल प्रशिक्षण कार्यक्रम से संबंधित आपके सामान्य प्रश्नों के आधिकारिक उत्तर।',
      items: [
        {
          q: 'क्या मैं अपनी कॉलेज की पढ़ाई या प्राइवेट जॉब के साथ इसमें शामिल हो सकता हूँ?',
          a: 'हाँ, बिल्कुल! ट्रैक A (कामकाजी पेशेवर) विशेष रूप से उन युवाओं के लिए तैयार किया गया है जो बाहर अपनी जॉब, ऑफिस या कॉलेज जारी रखते हुए मंदिर के सात्त्विक वातावरण में रहकर आध्यात्मिक साधना करना चाहते हैं।',
        },
        {
          q: 'क्या निवास या प्रशिक्षण के लिए कोई शुल्क है?',
          a: 'ट्रैक A के अभ्यर्थियों के लिए आवास, बिजली और बुनियादी रखरखाव हेतु एक निश्चित मासिक सहयोग राशि निर्धारित है। वहीं ट्रैक B (मंदिर स्वयंसेवक) और ट्रैक C (ब्रह्मचारी आकांक्षी) के अभ्यर्थियों के लिए आवास और सात्त्विक प्रसादम पूर्णतः प्रायोजित (निःशुल्क) होता है।',
        },
        {
          q: 'प्रवेश हेतु आयु सीमा क्या है?',
          a: 'प्रवेश के समय अभ्यर्थी की आयु अनिवार्य रूप से १८ से ३० वर्ष के मध्य (18 to 30 years) होनी चाहिए। १८ वर्ष से कम अथवा ३० वर्ष से अधिक आयु के अभ्यर्थी इस आवासीय पाठ्यक्रम हेतु पात्र नहीं हैं।',
        },
        {
          q: 'क्या लैपटॉप और मोबाइल फोन का उपयोग करने की अनुमति है?',
          a: 'हाँ। जॉब के आधिकारिक कार्य, ऑफिशियल मीटिंग्स, शिक्षा और आध्यात्मिक प्रवचन श्रवण हेतु उपकरण उपयोग करने की पूर्ण अनुमति है। केवल अनावश्यक सोशल मीडिया स्क्रॉलिंग, मूवीज अथवा विकृत मनोरंजन प्रतिबंधित है।',
        },
        {
          q: 'आवेदन करने के बाद की प्रक्रिया क्या होगी?',
          a: 'ऑनलाइन रुचि पंजीकरण प्राप्त होने के बाद हमारी आश्रम टीम आपसे संपर्क करेगी और मंदिर में व्यक्तिगत साक्षात्कार के लिए समय निर्धारित करेगी।',
        },
      ],
    },
    cta: {
      kicker: 'एक नई शुरुआत',
      title: 'क्या आप इस दिव्य जीवनशैली को अनुभव करना चाहते हैं?',
      body: 'यदि आप मंदिर में रहकर अनुशासित जीवन, साधना, सेवा और आध्यात्मिक प्रशिक्षण को गंभीरता से अपनाना चाहते हैं, तो आज ही अपनी रुचि दर्ज करें।',
      btn: 'रुचि है — अभी आवेदन करें',
    },
    contact: {
      kicker: 'संपर्क एवं मार्गदर्शन',
      title: 'कोई प्रश्न है? हमसे सीधे संपर्क करें',
      phoneLabel: 'आश्रम हेल्पलाइन नंबर',
      phone: '9130542150',
      locationLabel: 'मंदिर का पता',
      location:
        'इस्कॉन एनवीसीसी (न्यू वैदिक कल्चरल सेंटर), कात्रज-कोंढवा बायपास, तिलेकर नगर, कोंढवा बुद्रुक, पुणे, महाराष्ट्र ४११०४८',
    },
    form: {
      kicker: 'INTEREST REGISTRATION / रुचि पंजीकरण',
      title: 'Live Like a Monk — आश्रम प्रवेश पंजीकरण',
      intro: 'कृपया नीचे दिए गए प्रपत्र में अपना विवरण दर्ज करें। आश्रम समन्वय समिति २४ से ४८ घंटों के भीतर आपसे संपर्क करेगी।',
      step1Title: 'व्यक्तिगत विवरण (Personal Details)',
      step2Title: 'इच्छित मार्ग एवं व्यवसाय (Track & Occupation)',
      step3Title: 'निवास एवं पूर्व परिचय (Address & Background)',
      selectedBadge: 'चयनित (Selected)',
      selectTrackHint: 'अपनी रुचि व सुविधा अनुसार उपयुक्त श्रेणी चुनें:',
      selectStatusHint: 'अपनी वर्तमान व्यावसायिक स्थिति चुनें:',
      trustTitle: 'आश्रम प्रवेश विश्वसनीयता व सुरक्षा',
      guaranteeNote: 'आपकी समस्त जानकारी इस्कॉन एनवीसीसी पुणे के पास पूर्णतः सुरक्षित व गोपनीय रखी जाती है।',
      callNowBtn: 'हेल्पलाइन पर कॉल करें',
      whatsappBtn: 'व्हाट्सएप पर संपर्क करें',
      nextStepsTitle: 'पंजीकरण के बाद क्या होगा?',
      nextSteps: [
        { step: '१', title: 'प्रारंभिक समीक्षा', desc: 'वरिष्ठ आश्रम समन्वयकों द्वारा आपके आवेदन की समीक्षा।' },
        { step: '२', title: 'साक्षात्कार कॉल', desc: '२४-४८ घंटों में फोन द्वारा व्यक्तिगत साक्षात्कार का समय निर्धारण।' },
        { step: '३', title: 'मंदिर आगमन व निवास', desc: 'कात्रज-कोंढवा परिसर में आश्रम लीडर से प्रत्यक्ष भेंट व प्रवेश।' },
      ],
      fullName: 'पूरा नाम',
      fullNameHint: 'आधार कार्ड अनुसार अपना पूरा नाम लिखें',
      mobile: 'मोबाइल / व्हाट्सएप नंबर',
      mobileHint: '१० अंकों का सक्रिय व्हाट्सएप नंबर',
      age: 'आयु (18-30 वर्ष)',
      ageHint: 'अनिवार्य आयु सीमा: 18 से 30 वर्ष (18 से कम या 30 से अधिक मान्य नहीं)',
      trackChoice: 'इच्छित मार्ग (Preferred Track)',
      trackChoiceHint: 'Select Track',
      trackOptions: [
        { value: 'Track A - कामकाजी पेशेवर (Working Professionals)', label: 'Track A — कामकाजी पेशेवर (Working Professionals)' },
        { value: 'Track B - मंदिर स्वयंसेवक (Temple Volunteers)', label: 'Track B — मंदिर स्वयंसेवक (Temple Volunteers)' },
        { value: 'Track C - ब्रह्मचर्य जीवन आकांक्षी (Celibacy Life Aspirant)', label: 'Track C — ब्रह्मचर्य जीवन आकांक्षी (Celibacy Life Aspirant)' },
      ],
      status: 'वर्तमान स्थिति',
      statusHint: 'Current Status',
      statusOptions: [
        { value: 'विद्यार्थी / Student', label: 'विद्यार्थी / Student' },
        { value: 'नौकरीपेशा / Working Professional', label: 'नौकरीपेशा / Working Professional' },
        { value: 'व्यवसायी / Business Owner', label: 'व्यवसायी / Business Owner' },
        { value: 'नौकरी की तलाश में / Seeking Employment', label: 'नौकरी की तलाश में / Seeking Employment' },
        { value: 'अन्य / Other', label: 'अन्य / Other' },
      ],
      nativeAddress: 'मूल स्थान का स्थायी पता (Native Place Address)',
      nativeAddressHint: 'गाँव/कस्बा, तहसील, जिला एवं राज्य',
      currentAddress: 'वर्तमान निवास का पता (Current Address)',
      currentAddressHint: 'पुणे या जहाँ आप अभी रह रहे हैं (फ्लैट/हॉस्टल/क्षेत्र)',
      notes: 'पूर्व आध्यात्मिक अनुभव या कोई विशेष प्रश्न (वैकल्पिक)',
      notesHint: 'प्रतिदिन माला जप, पूर्व सत्संग या आपके कोई विशेष प्रश्न',
      consent:
        'मैं समझता/समझती हूँ कि यह केवल एक रुचि-पंजीकरण है। आश्रम में अंतिम निवास एवं प्रवेश वरिष्ठ वैष्णवों के साथ औपचारिक साक्षात्कार तथा आचार-संहिता की सहमति पर ही मान्य होगा।',
      submit: 'पंजीकरण जमा करें (Submit Application)',
      submitting: 'पंजीकरण भेजा जा रहा है…',
      close: 'बंद करें',
      successTitle: 'हरे कृष्ण! आपकी रुचि सफलतापूर्वक दर्ज हो गई है',
      successBody: 'धन्यवाद। आपका आवेदन आश्रम समन्वय टीम को प्राप्त हो गया है। हमारी टीम २४ से ४८ घंटों के भीतर आपसे फोन पर संपर्क करेगी।',
      done: 'पूर्ण हुआ (Done)',
      helplineNotice: 'किसी भी तात्कालिक प्रश्न के लिए हमारे आश्रम नंबर पर संपर्क करें:',
    },
    footer: {
      tagline: 'आवासीय गुरुकुल प्रशिक्षण • Residential Gurukul Training',
      copyright: '© 2026 ISKCON NVCC Pune. All rights reserved.',
      address: 'ISKCON NVCC Pune, Katraj-Kondhwa Bypass, Tilekar Nagar, Kondhwa Budruk, Pune, Maharashtra 411048',
    },
  },
  en: {
    nav: {
      about: 'About',
      tracks: '3 Paths',
      progression: 'Progression',
      schedule: 'Daily Life',
      norms: 'Code of Conduct',
      faq: 'FAQs',
      contact: 'Contact',
      apply: 'Register Interest',
    },
    hero: {
      mantra: '॥ हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥',
      mantraTranslit: 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare | Hare Rama Hare Rama Rama Rama Hare Hare',
      kicker: 'ISKCON NVCC PUNE • RESIDENTIAL GURUKUL TRAINING',
      title: 'LIVE LIKE A MONK',
      subtitle: 'Stay in the Temple • Cultivate Character • Serve Selflessly • Embrace Spiritual Excellence',
      applyBtn: 'Register Interest — Apply Now',
      exploreBtn: 'Explore Prospectus',
      stats: [
        { num: '18–30 Yrs', label: 'Age Eligibility' },
        { num: '3 Tracks', label: 'Career, Service & Ashram' },
        { num: '4 to 16 Rds', label: 'Structured Sadhana' },
        { num: '100% Sattvic', label: 'Prasadam & Association' },
      ],
    },
    objective: {
      kicker: 'FOUNDATIONAL VISION',
      title: 'A Decisive Step Toward a Disciplined, Purposeful Life',
      quote:
        'Providing enthusiastic youth aged between 18 and 30 with a disciplined, spiritually elevated and supportive environment to cultivate sterling character, master invaluable life skills, and integrate Vedic principles into daily living—whether pursuing professional careers or dedicating themselves to full-time devotional service.',
      author: '— Residential Gurukul Training Prospectus, ISKCON NVCC Pune',
    },
    story: {
      kicker: 'SRI SRI RADHA VRINDAVANCHANDRA TEMPLE SANCTUARY',
      title: "Don't Just Observe Temple Life — ",
      titleEm: 'Truly Experience It',
      desc: 'The picturesque campus of ISKCON NVCC Pune (New Vedic Cultural Center) provides youth with a peaceful, sacred sanctuary far removed from modern distractions and stress. Through sublime deity worship, in-depth Vedic education, and the elevating association of dedicated devotees, profound inner character transformation is achieved.',
      features: [
        'Direct personal mentorship and spiritual counselling under senior Vaishnavas',
        'Distraction-free, serene, and focused sadhana environment',
        'Pure, sanctified, 100% vegetarian Krishna-Prasadam prepared with devotion',
      ],
      badgeTitle: 'Sri Sri Radha Vrindavanchandra Mandir',
      badgeSub: 'ISKCON NVCC, Katraj-Kondhwa Bypass, Pune',
    },
    eligibility: {
      kicker: 'ADMISSION STANDARDS',
      title: '1. Candidate Eligibility & Admission Requirements',
      intro:
        'To maintain an intensely focused, harmonious, and spiritually elevated sanctuary, admission is managed strictly according to the following benchmarks.',
      items: [
        {
          num: '01',
          title: 'Age Eligibility (18 to 30 Years)',
          body: 'Candidates must strictly be between 18 and 30 years of age at the time of entry (candidates below 18 or above 30 are not eligible).',
        },
        {
          num: '02',
          title: 'Educational Background',
          body: 'Both educated and uneducated youth are welcome when they possess a sincere quest for character improvement and inner transformation.',
        },
        {
          num: '03',
          title: 'Career Orientation',
          body: 'Designed for candidates who wish to continue an external job or career, as well as those wishing to dedicate themselves to direct temple service.',
        },
        {
          num: '04',
          title: 'Mandatory Interview',
          body: 'Before final permission to reside in the temple, every candidate must successfully clear a formal interview before a panel of senior Vaishnavas.',
        },
      ],
    },
    tracks: {
      kicker: 'WHICH PATH FITS YOU?',
      title: 'Three Strategic Enrollment Tracks',
      intro:
        'Candidates are enrolled into one of three dedicated tracks matching their career situation and spiritual aspiration.',
      items: [
        {
          code: 'TRACK A',
          title: 'Working Professionals',
          tag: 'Career + Temple Life',
          desc: 'Youth who work in outside professional careers/jobs or serve in regular salaried positions inside the temple community.',
          structureLabel: 'Living & Financial Structure',
          structure:
            'Contributory Structure: A modest monthly contribution toward room maintenance, electricity, and essential ashram facilities.',
          trackKey: 'Track A - कामकाजी पेशेवर (Working Professionals)',
          btnText: 'Select Track A & Apply',
        },
        {
          code: 'TRACK B',
          title: 'Temple Volunteers',
          tag: 'Full-Time Service',
          desc: 'Youth rendering full-time, voluntary devotional service across various temple departments, deity services, and outreach projects.',
          structureLabel: 'Living & Financial Structure',
          structure:
            'Fully Sponsored: The temple administration bears 100% of the candidate’s accommodation and daily Krishna-prasadam costs.',
          trackKey: 'Track B - मंदिर स्वयंसेवक (Temple Volunteers)',
          btnText: 'Select Track B & Apply',
        },
        {
          code: 'TRACK C',
          title: 'Aspiring for Celibacy Life',
          tag: 'Intensive Ashram Training',
          desc: 'Youth committed to adopting a pure, focused, lifelong celibate monastic lifestyle and deep Vedic spiritual sadhana.',
          structureLabel: 'Living & Financial Structure',
          structure:
            'Brahmachari Training: Direct entry into dedicated monastic routine with comprehensive scriptural study and sadhana mentoring.',
          trackKey: 'Track C - ब्रह्मचर्य जीवन आकांक्षी (Celibacy Life Aspirant)',
          btnText: 'Select Track C & Apply',
        },
      ],
    },
    progression: {
      kicker: 'STEP-BY-STEP TRANSFORMATION',
      title: '2. Spiritual Development & Chanting Progression',
      intro:
        'The core foundation of the Gurukul is steady, resilient, and gradual transformation. For newcomers, wake-up times and chanting commitments scale systematically.',
      steps: [
        {
          month: 'Month 1',
          time: '6:30 AM',
          rounds: '4 Rounds Daily',
          body: 'Be present in the temple hall after bathing in clean Vaishnava clothing → Chant 4 rounds of the Maha-Mantra daily.',
        },
        {
          month: 'Month 2',
          time: '6:00 AM',
          rounds: '8 Rounds Daily',
          body: 'Punctual attendance in the temple hall → Chant 8 rounds of the Hare Krishna Maha-Mantra daily.',
        },
        {
          month: 'Month 3',
          time: '5:30 AM',
          rounds: '12 Rounds Daily',
          body: 'Presence in the temple hall for sadhana → Chant 12 rounds of Maha-Mantra daily with focused concentration.',
        },
        {
          month: 'Month 4',
          time: '5:00 AM',
          rounds: '16 Rounds Daily',
          body: 'Presence in the temple hall → Complete 16 rounds of Maha-Mantra systematically every morning.',
        },
        {
          month: 'Month 5 onward',
          time: '4:30 AM',
          rounds: 'Mangala Arati + 16 Rounds',
          body: 'Full Temple Standard: Punctual attendance at Mangala Arati (4:30 AM) → Maintain a mandatory minimum of 16 rounds daily according to scriptural injunctions.',
          pinnacle: true,
        },
      ],
      acceleratedTitle: 'Practicing Devotees — Accelerated Track',
      accelerated: [
        'Candidates already practicing chanting begin directly at their existing baseline round count.',
        'They immediately align with the long-term standard: Mangala Arati at 4:30 AM and minimum 16 rounds daily.',
      ],
    },
    schedule: {
      kicker: 'DAILY GURUKUL LIFE',
      title: 'A Day in the Life of a Resident',
      intro:
        'A harmonious daily rhythm balancing contemplative meditation, physical vitality, scriptural wisdom, and career/seva responsibilities.',
      items: [
        {
          time: '04:30 AM',
          title: 'Mangala Arati & Tulasi Worship',
          desc: 'Awakening with sublime deity darshan, incense arati, and circumambulation of Srimati Tulasi Devi.',
        },
        {
          time: '05:00 AM - 07:15 AM',
          title: 'Focused Japa Meditation',
          desc: 'Immersive chanting of the Hare Krishna Maha-Mantra in the serene temple hall with peer devotees.',
        },
        {
          time: '07:15 AM',
          title: 'Darshan Arati & Guru Puja',
          desc: 'Adoring Sri Sri Radha Vrindavanchandra in morning shringar, followed by worship of Founder-Acharya Srila Prabhupada.',
        },
        {
          time: '07:45 AM',
          title: 'Srimad Bhagavatam Discourse',
          desc: 'Profound verse-by-verse philosophical insights and practical life application by senior scholars.',
        },
        {
          time: '08:45 AM',
          title: 'Honoring Pure Mahaprasadam',
          desc: '100% sattvic, nutritious, and wholesome morning breakfast prasadam prepared in the temple kitchen.',
        },
        {
          time: '09:30 AM - 06:00 PM',
          title: 'Career / Temple Seva / Study',
          desc: 'Track A candidates pursue office work/studies; Track B & C engage in temple service and deep shastric study.',
        },
        {
          time: '07:00 PM',
          title: 'Evening Gaura Arati & Kirtan',
          desc: 'Enlivening evening kirtan with mridangas and karatals, rejuvenating mind and spirit.',
        },
        {
          time: '08:15 PM - 09:30 PM',
          title: 'Night Prasadam & Rest',
          desc: 'Light evening meal, daily introspection, quiet contemplation, and early bedtime for morning vitality.',
        },
      ],
    },
    norms: {
      kicker: 'SACRED DISCIPLINE',
      title: '3. Code of Conduct & Temple Norms',
      intro:
        'Complete alignment with these guidelines is mandatory for all residents to uphold the spiritual purity and sattvic sanctity of the temple.',
      principlesTitle: 'The 4 Regulative Principles (चार नियामक सिद्धांत)',
      principles: [
        {
          pillar: 'Compassion (दया)',
          title: '1. No Meat Eating',
          body: 'Complete avoidance of meat, fish, poultry, eggs, and seafood to cultivate universal compassion toward all living beings.',
        },
        {
          pillar: 'Austerity (तप)',
          title: '2. No Intoxication',
          body: 'Complete abstinence from alcohol, narcotics, tobacco, smoking, tea, and coffee to preserve mental clarity and serenity.',
        },
        {
          pillar: 'Purity (शौच)',
          title: '3. No Illicit Sex',
          body: 'Upholding strict physical and mental celibacy, moral character, and purity of thought.',
        },
        {
          pillar: 'Truthfulness (सत्य)',
          title: '4. No Gambling',
          body: 'Complete avoidance of betting, casinos, lotteries, and speculative financial gambling.',
        },
      ],
      disciplineTitle: 'Media, Technology & Dietary Discipline',
      discipline: [
        {
          icon: '📱',
          title: 'Strict Smartphone Restriction',
          body: 'Watching materialistic movies, mindless social media doom-scrolling, or listening to cinema/pop music is strictly prohibited.',
        },
        {
          icon: '💻',
          title: 'Permitted Device Usage',
          body: 'Devices are limited strictly to necessary office/job duties, formal education, or hearing devotional lectures and kirtans.',
        },
        {
          icon: '🍲',
          title: 'Dietary Boundaries',
          body: 'Outside restaurant food, market fried snacks, or any tamasic substances (including onions and garlic) are forbidden on campus.',
        },
        {
          icon: '✨',
          title: 'Prasadam Integrity',
          body: 'Residents honor only pure sattvic Krishna-Prasadam prepared and offered with love in the temple kitchen.',
        },
        {
          icon: '👔',
          title: 'Cleanliness & Attire',
          body: 'Every morning, residents must bathe fully and wear clean, washed Vaishnava attire (dhoti-kurta) before entering the hall. Strict punctuality is mandatory.',
        },
        {
          icon: '🕊️',
          title: 'Harmonious Conduct',
          body: 'Cultivating humility, respect, selfless service, and collaborative camaraderie toward fellow residents and senior Vaishnavas.',
        },
      ],
    },
    advanced: {
      kicker: 'TRACK C SANCTUARY',
      title: '4. Advanced Track: Brahmachari Ashram Training',
      intro:
        'Youth in Track C who demonstrate unwavering dedication to authentic monastic life receive admission into the Brahmachari Ashram.',
      items: [
        {
          idx: '01',
          title: 'Senior Vaishnava Mentorship',
          body: 'Direct personal guidance, regular spiritual counselling, and close association under seasoned senior Vaishnavas.',
        },
        {
          idx: '02',
          title: 'Rigorous Scriptural Curriculum',
          body: 'In-depth scriptural degrees (including Bhakti Shastri certifications), operational leadership, temple systems, and practical outreach training.',
        },
        {
          idx: '03',
          title: 'Character Excellence',
          body: 'Cultivation of genuine humility (trinad api sunichena), sense-mastery, exemplary leadership integrity, and full surrender to Sri Krishna.',
        },
      ],
    },
    pathway: {
      kicker: 'HOW IT WORKS',
      title: '5. Implementation & Screening Pathway',
      intro:
        'Submitting an interest form is the initial intake step. Final permission to reside follows the personal interview process.',
      steps: [
        {
          step: '1',
          title: 'Application Intake',
          body: 'A comprehensive intake collecting academic background, age, current livelihood, and spiritual exposure.',
        },
        {
          step: '2',
          title: 'Mandatory Interview',
          body: 'Senior devotees assess the candidate’s character, personal stability, and voluntary commitment to the four regulative principles and morning routine.',
        },
        {
          step: '3',
          title: 'Ashram Oversight',
          body: 'Appointment of a dedicated Ashram Leader/Mentor who personally guides daily attendance, wake-up progression, and steady spiritual advancement.',
        },
      ],
    },
    faq: {
      kicker: 'QUESTIONS & ANSWERS',
      title: 'Frequently Asked Questions (FAQ)',
      intro: 'Clear answers to common questions about the Gurukul residential program.',
      items: [
        {
          q: 'Can I join while pursuing my college studies or an IT/corporate job?',
          a: 'Yes, absolutely! Track A (Working Professionals) is specifically designed for youth who wish to continue their external employment or college studies while residing in the uplifting and peaceful temple ashram environment.',
        },
        {
          q: 'Are there any accommodation fees or course charges?',
          a: 'For Track A, a modest monthly contribution covers room maintenance, electricity, and essential facilities. For Track B (Temple Volunteers) and Track C (Celibacy Aspirants), lodging and sanctified daily prasadam are 100% fully sponsored.',
        },
        {
          q: 'What is the age criteria for admission?',
          a: 'Candidates must strictly be between 18 and 30 years old at the time of entry. Candidates below 18 or above 30 years are not eligible for this residential training program.',
        },
        {
          q: 'Are laptops and mobile phones permitted for job work?',
          a: 'Yes. Devices are fully permitted for productive office work, college studies, family communication, and devotional hearing. Unnecessary social media scrolling and materialistic entertainment are prohibited.',
        },
        {
          q: 'What happens after I submit this registration form?',
          a: 'Our Ashram Coordination team will review your details and contact you via phone to schedule your formal personal interview at the temple.',
        },
      ],
    },
    cta: {
      kicker: 'BEGIN YOUR JOURNEY',
      title: 'Would you like to experience this lifestyle?',
      body: 'If you are sincere about taking up disciplined living, sadhana, selfless service, and spiritual training, register your expression of interest today.',
      btn: 'I’m Interested — Apply Now',
    },
    contact: {
      kicker: 'CONTACT & MENTORSHIP',
      title: 'Have a Question? Speak With Our Mentors',
      phoneLabel: 'Ashram Helpline Number',
      phone: '9130542150',
      locationLabel: 'Temple Address',
      location:
        'ISKCON NVCC (New Vedic Cultural Center), Katraj-Kondhwa Bypass, Tilekar Nagar, Kondhwa Budruk, Pune, Maharashtra 411048',
    },
    form: {
      kicker: 'INTEREST REGISTRATION / रुचि पंजीकरण',
      title: 'Live Like a Monk — Interest Registration',
      intro: 'Please provide your details below. Our ashram coordination team will contact you within 24 to 48 hours.',
      step1Title: 'Personal Details',
      step2Title: 'Choose Your Track & Current Occupation',
      step3Title: 'Address & Spiritual Background',
      selectedBadge: 'Selected',
      selectTrackHint: 'Select the track that best fits your goals:',
      selectStatusHint: 'Select your current occupation status:',
      trustTitle: 'Ashram Trust & Assurance',
      guaranteeNote: 'Your details are strictly confidential and securely handled by ISKCON NVCC Pune.',
      callNowBtn: 'Call Ashram Helpline',
      whatsappBtn: 'WhatsApp Helpline',
      nextStepsTitle: 'What Happens Next?',
      nextSteps: [
        { step: '1', title: 'Application Review', desc: 'Ashram leadership reviews your profile and background.' },
        { step: '2', title: 'Interview Call', desc: 'Personal mentor contacts you within 24-48 hours to schedule your interview.' },
        { step: '3', title: 'Temple Visit & Induction', desc: 'Visit ISKCON NVCC Katraj-Kondhwa to meet the ashram leader and complete orientation.' },
      ],
      fullName: 'Full Name',
      fullNameHint: 'Enter your legal name as on ID',
      mobile: 'Mobile / WhatsApp Number',
      mobileHint: '10-digit active WhatsApp number',
      age: 'Age (18-30 Years)',
      ageHint: 'Strictly 18 to 30 years (Below 18 or above 30 not eligible)',
      trackChoice: 'Preferred Track',
      trackChoiceHint: 'Select Track',
      trackOptions: [
        { value: 'Track A - कामकाजी पेशेवर (Working Professionals)', label: 'Track A — Working Professionals' },
        { value: 'Track B - मंदिर स्वयंसेवक (Temple Volunteers)', label: 'Track B — Temple Volunteers' },
        { value: 'Track C - ब्रह्मचर्य जीवन आकांक्षी (Celibacy Life Aspirant)', label: 'Track C — Celibacy Life Aspirant' },
      ],
      status: 'Current Status',
      statusHint: 'Current Status',
      statusOptions: [
        { value: 'विद्यार्थी / Student', label: 'Student / विद्यार्थी' },
        { value: 'नौकरीपेशा / Working Professional', label: 'Working Professional / नौकरीपेशा' },
        { value: 'व्यवसायी / Business Owner', label: 'Business Owner / व्यवसायी' },
        { value: 'नौकरी की तलाश में / Seeking Employment', label: 'Seeking Employment / नौकरी की तलाश में' },
        { value: 'अन्य / Other', label: 'Other / अन्य' },
      ],
      nativeAddress: 'Native Place Address',
      nativeAddressHint: 'Native town/city with District & State',
      currentAddress: 'Current Residential Address',
      currentAddressHint: 'Where you currently reside in Pune or elsewhere',
      notes: 'Spiritual Exposure or Additional Notes (Optional)',
      notesHint: 'Daily japa rounds, background or any specific questions',
      consent:
        'I understand that this is an expression of interest. Final residence and admission will be subject to personal interview, verification, and acceptance of ashram discipline.',
      submit: 'Submit Registration Application',
      submitting: 'Submitting Application…',
      close: 'Close',
      successTitle: 'Hare Krishna! Your Application Has Been Received',
      successBody: 'Thank you. We have received your registration. Our Ashram Coordination team will contact you within 24 to 48 hours for your interview schedule.',
      done: 'Done',
      helplineNotice: 'For any immediate questions, contact our helpline directly:',
    },
    footer: {
      tagline: 'Residential Gurukul Training • आवासीय गुरुकुल प्रशिक्षण',
      copyright: '© 2026 ISKCON NVCC Pune. All rights reserved.',
      address: 'ISKCON NVCC Pune, Katraj-Kondhwa Bypass, Tilekar Nagar, Kondhwa Budruk, Pune, Maharashtra 411048',
    },
  },
};

const templeImage = 'https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png';
const deityImage = 'https://www.iskconpune.com/wp-content/uploads/2023/02/radha-vrindavanchandra-1024x683.jpeg';
const lotusImage = 'https://www.iskconpune.com/wp-content/uploads/2026/06/icon-lotus.png';

const trackSelectorCards = [
  {
    id: 'Track A - कामकाजी पेशेवर (Working Professionals)',
    badge: 'TRACK A',
    icon: '💼',
    iconBg: '#DBEAFE',
    iconColor: '#1D4ED8',
    titleHi: 'कामकाजी पेशेवर',
    titleEn: 'Working Professionals',
    subtitleHi: 'करियर + मंदिर जीवन • अपनी जॉब/कॉलेज जारी रखते हुए सात्त्विक निवास',
    subtitleEn: 'Career + Ashram Stay • Continue employment or college studies',
    tagHi: 'अंशदायी व्यवस्था • Contributory',
    tagEn: 'Contributory Stay',
    tagBg: '#DBEAFE',
    tagColor: '#1E40AF',
    color: '#1D4ED8',
  },
  {
    id: 'Track B - मंदिर स्वयंसेवक (Temple Volunteers)',
    badge: 'TRACK B',
    icon: '📿',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    titleHi: 'मंदिर स्वयंसेवक',
    titleEn: 'Temple Volunteers',
    subtitleHi: 'पूर्णकालिक भक्ति-सेवा • आवास व प्रसादम १००% पूर्णतः प्रायोजित',
    subtitleEn: 'Full-time Devotional Service • 100% sponsored lodging & prasadam',
    tagHi: '१००% प्रायोजित • Fully Free',
    tagEn: '100% Sponsored Stay',
    tagBg: '#FFEDD5',
    tagColor: '#C2410C',
    color: '#EA580C',
  },
  {
    id: 'Track C - ब्रह्मचर्य जीवन आकांक्षी (Celibacy Life Aspirant)',
    badge: 'TRACK C',
    icon: '🧘',
    iconBg: '#FEE2E2',
    iconColor: '#991B1B',
    titleHi: 'ब्रह्मचर्य आकांक्षी',
    titleEn: 'Celibacy Life Aspirant',
    subtitleHi: 'गुरुकुल संन्यास प्रशिक्षण • गहन शास्त्र अध्ययन व अखंड ब्रह्मचर्य',
    subtitleEn: 'Brahmachari Gurukul Training • Shastra study & lifelong dedication',
    tagHi: 'आजीवन संन्यास • Monastic Life',
    tagEn: 'Gurukul Training',
    tagBg: '#FEE2E2',
    tagColor: '#991B1B',
    color: '#991B1B',
  },
];

const statusChipsData = [
  { id: 'विद्यार्थी / Student', icon: '🎓', labelHi: 'विद्यार्थी', labelEn: 'Student' },
  { id: 'नौकरीपेशा / Working Professional', icon: '💼', labelHi: 'नौकरीपेशा', labelEn: 'Working Professional' },
  { id: 'व्यवसायी / Business Owner', icon: '🏢', labelHi: 'व्यवसायी', labelEn: 'Business Owner' },
  { id: 'नौकरी की तलाश में / Seeking Employment', icon: '🔍', labelHi: 'नौकरी की तलाश', labelEn: 'Job Seeker' },
  { id: 'अन्य / Other', icon: '✨', labelHi: 'अन्य', labelEn: 'Other' },
];

const trustBadgesList = [
  {
    icon: '🔒',
    labelHi: 'पूर्णतः गोपनीय',
    labelEn: '100% Confidential',
    descHi: 'सुरक्षित प्रविष्टि',
    descEn: 'Strictly Private',
  },
  {
    icon: '🏛️',
    labelHi: 'इस्कॉन एनवीसीसी',
    labelEn: 'Official ISKCON',
    descHi: 'कात्रज-कोंढवा बायपास',
    descEn: 'NVCC Pune Center',
  },
  {
    icon: '⚡',
    labelHi: 'शीघ्र संपर्क',
    labelEn: 'Quick Callback',
    descHi: '२४-४८ घंटों में मार्गदर्शन',
    descEn: 'Mentor in 24-48h',
  },
  {
    icon: '🍲',
    labelHi: 'सात्त्विक वातावरण',
    labelEn: 'Satvik Living',
    descHi: 'पवित्र प्रसादम व साधना',
    descEn: 'Daily Prasadam',
  },
];

function RegistrationFormCard({
  lang,
  c,
  contactPhone,
  selectedTrack,
  setSelectedTrack,
  selectedStatus,
  setSelectedStatus,
  sentSuccess,
  setSentSuccess,
  loading,
  errorMessage,
  onSubmit,
  isModal = false,
  onClose,
}: {
  lang: Lang;
  c: ContentDictionary['form'];
  contactPhone: string;
  selectedTrack: string;
  setSelectedTrack: (track: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sentSuccess: boolean;
  setSentSuccess: (val: boolean) => void;
  loading: boolean;
  errorMessage: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  isModal?: boolean;
  onClose?: () => void;
}) {
  if (sentSuccess) {
    return (
      <div className="success-view-luxury">
        <div className="success-lotus-emblem">✓</div>
        <h2>{c.successTitle}</h2>
        <p className="success-lead-text">{c.successBody}</p>

        <div className="success-next-steps-card">
          <h4>
            <span>✦</span>
            <span>{c.nextStepsTitle}</span>
          </h4>
          {c.nextSteps.map((step, idx) => (
            <div className="success-next-step-item" key={idx}>
              <div className="success-step-pill">{step.step}</div>
              <div>
                <div className="success-step-item-title">{step.title}</div>
                <div className="success-step-item-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="success-actions-row">
          <a className="btn-success-call" href={`tel:${contactPhone}`}>
            <span>📞</span>
            <span>{c.callNowBtn}: +91 {contactPhone}</span>
          </a>
          <a
            className="btn-success-whatsapp"
            href={`https://wa.me/91${contactPhone}?text=Hare%20Krishna%2C%20I%20have%20submitted%20my%20registration%20for%20the%20Live%20Like%20a%20Monk%20program%20at%20ISKCON%20NVCC%20Pune.`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>💬</span>
            <span>{c.whatsappBtn}</span>
          </a>
          <button
            type="button"
            className="btn-success-reset"
            onClick={() => {
              setSentSuccess(false);
              if (isModal && onClose) onClose();
            }}
          >
            {c.done}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card-luxury">
      <div className="card-top-accent-bar" />

      {/* Header */}
      <div className="form-main-header">
        <div className="form-header-badge-row">
          <div className="form-lotus-icon">
            <img src={lotusImage} alt="" />
          </div>
          <div className="section-kicker" style={{ marginBottom: 0 }}>
            {c.kicker}
          </div>
        </div>
        <h2>{c.title}</h2>
        <p className="form-intro-text">{c.intro}</p>
      </div>

      {/* Trust Strip */}
      <div className="form-trust-strip">
        {trustBadgesList.map((badge, idx) => (
          <div className="form-trust-item" key={idx}>
            <div className="form-trust-icon">{badge.icon}</div>
            <div className="form-trust-info">
              <span className="form-trust-title">
                {lang === 'hi' ? badge.labelHi : badge.labelEn}
              </span>
              <span className="form-trust-desc">
                {lang === 'hi' ? badge.descHi : badge.descEn}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit}>
        <input type="hidden" name="track" value={selectedTrack} />
        <input type="hidden" name="status" value={selectedStatus} />

        {/* STEP 1: Personal Details */}
        <div className="form-step-section">
          <div className="form-step-header">
            <div className="form-step-number-pill">01</div>
            <div className="form-step-title-wrap">
              <h3>{c.step1Title}</h3>
              <p className="form-step-subtitle">
                {lang === 'hi'
                  ? 'प्रवेश हेतु आवश्यक प्राथमिक व्यक्तिगत जानकारी'
                  : 'Essential personal information required for admission'}
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* Full Name */}
            <label className="form-label">
              <span>{c.fullName} *</span>
              <span className="form-label-secondary">{c.fullNameHint}</span>
              <div className="input-with-icon-wrap">
                <div className="input-icon-bubble">👤</div>
                <input
                  id={isModal ? 'applicant-name-modal' : 'applicant-name'}
                  className="form-input"
                  name="name"
                  required
                  placeholder={lang === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                />
              </div>
            </label>

            {/* Mobile Number */}
            <label className="form-label">
              <span>{c.mobile} *</span>
              <span className="form-label-secondary">{c.mobileHint}</span>
              <div className="input-with-icon-wrap">
                <div className="input-icon-bubble">📱</div>
                <input
                  className="form-input"
                  name="mobile"
                  type="tel"
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  required
                  placeholder={lang === 'hi' ? '९८७६५४३२१० (१० अंक)' : 'e.g. 9876543210 (10 digits)'}
                />
              </div>
            </label>

            {/* Age */}
            <label className="form-label form-group-full">
              <span>{c.age} *</span>
              <span className="form-label-secondary">{c.ageHint}</span>
              <div className="input-with-icon-wrap">
                <div className="input-icon-bubble">🎂</div>
                <input
                  className="form-input"
                  name="age"
                  type="number"
                  min="18"
                  max="30"
                  required
                  placeholder={lang === 'hi' ? 'उदा. २३ (केवल १८ से ३० वर्ष)' : 'e.g. 23 (strictly 18 to 30 years)'}
                />
              </div>
            </label>
          </div>
        </div>

        {/* STEP 2: Choose Track & Occupation */}
        <div className="form-step-section">
          <div className="form-step-header">
            <div className="form-step-number-pill">02</div>
            <div className="form-step-title-wrap">
              <h3>{c.step2Title}</h3>
              <p className="form-step-subtitle">{c.selectTrackHint}</p>
            </div>
          </div>

          {/* Interactive Track Cards Grid */}
          <div className="track-selector-grid">
            {trackSelectorCards.map((tr) => {
              const isSelected = selectedTrack === tr.id;
              return (
                <div
                  key={tr.id}
                  className={`track-selector-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedTrack(tr.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedTrack(tr.id);
                    }
                  }}
                >
                  <div className="track-card-top-row">
                    <div
                      className="track-card-icon-wrap"
                      style={{ background: tr.iconBg, color: tr.iconColor }}
                    >
                      {tr.icon}
                    </div>
                    {isSelected ? (
                      <span className="track-card-check-pill">
                        <span>✓</span>
                        <span>{c.selectedBadge}</span>
                      </span>
                    ) : (
                      <span className="track-card-code" style={{ color: tr.color }}>
                        {tr.badge}
                      </span>
                    )}
                  </div>

                  <h4>{lang === 'hi' ? tr.titleHi : tr.titleEn}</h4>
                  <p className="track-card-summary">
                    {lang === 'hi' ? tr.subtitleHi : tr.subtitleEn}
                  </p>

                  <div
                    className="track-card-tag"
                    style={{ background: tr.tagBg, color: tr.tagColor }}
                  >
                    {lang === 'hi' ? tr.tagHi : tr.tagEn}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Chips Section */}
          <div style={{ marginTop: 24 }}>
            <label className="form-label">
              <span>{c.status} *</span>
              <span className="form-label-secondary">{c.selectStatusHint}</span>
            </label>
            <div className="status-chips-grid">
              {statusChipsData.map((st) => {
                const isSelected = selectedStatus === st.id;
                return (
                  <button
                    type="button"
                    key={st.id}
                    className={`status-chip-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedStatus(st.id)}
                  >
                    <span className="status-chip-icon">{st.icon}</span>
                    <span>{lang === 'hi' ? st.labelHi : st.labelEn}</span>
                    {isSelected && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* STEP 3: Residence & Spiritual Background */}
        <div className="form-step-section">
          <div className="form-step-header">
            <div className="form-step-number-pill">03</div>
            <div className="form-step-title-wrap">
              <h3>{c.step3Title}</h3>
              <p className="form-step-subtitle">
                {lang === 'hi'
                  ? 'आवासीय पते एवं पूर्व आध्यात्मिक साधना का विवरण'
                  : 'Details of residential address and prior spiritual background'}
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* Native Address */}
            <label className="form-label form-group-full">
              <span>{c.nativeAddress} *</span>
              <span className="form-label-secondary">{c.nativeAddressHint}</span>
              <div className="input-with-icon-wrap">
                <div className="input-icon-bubble">📍</div>
                <textarea
                  className="form-textarea"
                  name="nativeAddress"
                  required
                  placeholder={lang === 'hi' ? 'उदा. गाँव/कस्बा, पोस्ट, तहसील, जिला एवं राज्य, पिन कोड' : 'e.g. Village/Town, District, State, PIN Code'}
                />
              </div>
            </label>

            {/* Current Address */}
            <label className="form-label form-group-full">
              <span>{c.currentAddress} *</span>
              <span className="form-label-secondary">{c.currentAddressHint}</span>
              <div className="input-with-icon-wrap">
                <div className="input-icon-bubble">🏠</div>
                <textarea
                  className="form-textarea"
                  name="currentAddress"
                  required
                  placeholder={lang === 'hi' ? 'उदा. फ्लैट/हॉस्टल/पीजी, क्षेत्र, शहर (पुणे या अन्य शहर)' : 'e.g. Flat/PG/Hostel, Area, City (Pune / elsewhere)'}
                />
              </div>
            </label>

            {/* Notes */}
            <label className="form-label form-group-full">
              <span>{c.notes}</span>
              <span className="form-label-secondary">{c.notesHint}</span>
              <div className="input-with-icon-wrap">
                <div className="input-icon-bubble">✍️</div>
                <textarea
                  className="form-textarea"
                  name="note"
                  placeholder={lang === 'hi' ? 'उदा. प्रतिदिन २-४ माला जप, पुणे में सॉफ्टवेयर इंजीनियर, आध्यात्मिक अनुशासन सीखने की इच्छा' : 'e.g. Chanting 2-4 rounds daily, working in Hinjewadi, seeking spiritual discipline'}
                />
              </div>
            </label>
          </div>

          {/* Consent Box */}
          <div className="form-consent-box-luxury">
            <input
              type="checkbox"
              id={isModal ? 'consent-modal' : 'consent-inline'}
              name="consent"
              required
            />
            <label
              htmlFor={isModal ? 'consent-modal' : 'consent-inline'}
              className="form-consent-luxury-text"
            >
              {c.consent}
            </label>
          </div>

          {/* Helpline Contact Reminder */}
          <div className="form-contact-reminder-luxury">
            <span>{c.helplineNotice}</span>
            <a href={`tel:${contactPhone}`}>
              <span>📞 +91 {contactPhone}</span>
            </a>
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div className="form-error-banner" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button className="form-submit-luxury-btn" type="submit" disabled={loading}>
            {loading ? (
              <span>{c.submitting}</span>
            ) : (
              <>
                <span>{c.submit}</span>
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>

          <div className="form-privacy-guarantee">
            <span>🔒</span>
            <span>{c.guaranteeNote}</span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function LiveLikeAMonkClient() {
  const { language, setLanguage } = useLanguage();
  const lang: Lang = language === 'en' ? 'en' : 'hi';
  const [openModal, setOpenModal] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>(
    'Track A - कामकाजी पेशेवर (Working Professionals)'
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    'नौकरीपेशा / Working Professional'
  );
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const c = content[lang];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openModal) {
        setOpenModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openModal]);

  const openFormWithTrack = (trackName?: string) => {
    if (trackName) {
      setSelectedTrack(trackName);
    }
    setOpenModal(true);
    setSentSuccess(false);
    setErrorMessage('');
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const form = new FormData(e.currentTarget);

    const rawAge = String(form.get('age') || '').trim();
    const ageNum = parseInt(rawAge, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 30) {
      setErrorMessage(
        lang === 'hi'
          ? 'आयु सीमा प्रतिबंध: प्रवेश हेतु आयु अनिवार्य रूप से १८ से ३० वर्ष के मध्य होनी चाहिए (१८ वर्ष से कम या ३० वर्ष से अधिक के अभ्यर्थी पात्र नहीं हैं)।'
          : 'Age Restriction: Admission is strictly restricted to candidates aged between 18 and 30 years (candidates below 18 or above 30 are not eligible).'
      );
      setLoading(false);
      return;
    }

    const templateParams = {
      name: String(form.get('name') || ''),
      mobile: String(form.get('mobile') || ''),
      age: String(ageNum),
      track: String(form.get('track') || selectedTrack || 'Track A - कामकाजी पेशेवर (Working Professionals)'),
      status: String(form.get('status') || selectedStatus || 'नौकरीपेशा / Working Professional'),
      nativeAddress: String(form.get('nativeAddress') || ''),
      currentAddress: String(form.get('currentAddress') || ''),
      note: String(form.get('note') || ''),
      language: lang === 'en' ? 'English' : 'Hindi',
    };

    try {
      // Forward to platform notification endpoint (sends to madhavcarandas@gmail.com via EmailJS & FormSubmit)
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'class_registration',
          details: {
            fullName: templateParams.name,
            phone: templateParams.mobile,
            age: templateParams.age,
            classTitle: templateParams.track,
            preferredMode: templateParams.status,
            questions: `Native: ${templateParams.nativeAddress} | Current: ${templateParams.currentAddress} | Note: ${templateParams.note}`,
          },
        }),
      });

      setSentSuccess(true);
    } catch (err: unknown) {
      console.error('Submission error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to submit registration. Please call our helpline at 9130542150.';
      setErrorMessage(`${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="monk-wrapper">
      <main>
        {/* ================= HERO SECTION ================= */}
      <section className="hero" id="top">
        <img className="hero-bg-media" src={templeImage} alt="ISKCON NVCC Pune Temple Complex" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-mantra-badge">
            <span>{lang === 'hi' ? c.hero.mantra : c.hero.mantraTranslit}</span>
          </div>

          <div className="hero-kicker">
            <span className="hero-kicker-line" />
            <span>{c.hero.kicker}</span>
            <span className="hero-kicker-line rev" />
          </div>

          <div className="hero-lotus-seal">
            <img src={lotusImage} alt="" />
          </div>

          <h1>{c.hero.title}</h1>
          <p className="hero-sub">{c.hero.subtitle}</p>

          <div className="hero-mahamantra-box">
            <p>
              हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।<br />
              हरे राम हरे राम राम राम हरे हरे ॥
            </p>
          </div>

          <div className="hero-cta-group">
            <button className="btn-primary-gold" onClick={() => openFormWithTrack()}>
              <span>{c.hero.applyBtn}</span>
              <span aria-hidden="true">↗</span>
            </button>
            <a className="btn-secondary-ghost" href="#about">
              <span>{c.hero.exploreBtn}</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= HERO HIGHLIGHTS / STATS BAR ================= */}
      <div className="hero-stats-bar">
        <div className="stats-card-grid">
          {c.hero.stats.map((s, idx) => (
            <div className="stat-item" key={idx}>
              <span className="stat-number">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FOUNDATIONAL PURPOSE / OBJECTIVE ================= */}
      <section className="section" id="about">
        <div className="objective-card">
          <div className="section-kicker">{c.objective.kicker}</div>
          <div className="objective-quote-mark">“</div>
          <p className="objective-text">{c.objective.quote}</p>
          <div className="sacred-divider">✦</div>
          <span className="objective-author">{c.objective.author}</span>
        </div>
      </section>

      {/* ================= TEMPLE & DEITY SHOWCASE ================= */}
      <section className="section section-tinted full-width">
        <div className="section" style={{ padding: '0 24px' }}>
          <div className="story-split-grid">
            <div className="story-content">
              <div className="section-kicker">{c.story.kicker}</div>
              <h2>
                {c.story.title} <em>{c.story.titleEm}</em>
              </h2>
              <p>{c.story.desc}</p>

              <div className="story-feature-list">
                {c.story.features.map((feat, i) => (
                  <div className="story-feature-item" key={i}>
                    <span className="story-feature-icon">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div>
                <button className="btn-primary-gold" onClick={() => openFormWithTrack()}>
                  <span>{c.nav.apply}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            <div className="story-gallery-grid">
              <div className="story-gallery-item">
                <img src={templeImage} alt="ISKCON NVCC Pune Temple Architecture" />
                <div className="story-gallery-caption">
                  <strong>{lang === 'hi' ? 'इस्कॉन एनवीसीसी पुणे मंदिर' : 'ISKCON NVCC Pune Temple'}</strong>
                  <span>{lang === 'hi' ? 'कात्रज-कोंढवा बायपास, पुणे' : 'Katraj-Kondhwa Bypass, Pune'}</span>
                </div>
              </div>
              <div className="story-gallery-item">
                <img src={deityImage} alt="Sri Sri Radha Vrindavanchandra at ISKCON NVCC Pune" />
                <div className="story-gallery-caption">
                  <strong>{c.story.badgeTitle}</strong>
                  <span>{c.story.badgeSub}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 1. ELIGIBILITY & ADMISSION ================= */}
      <section className="section" id="eligibility">
        <div className="section-header-split">
          <div>
            <div className="section-kicker">{c.eligibility.kicker}</div>
            <h2 className="section-title">{c.eligibility.title}</h2>
          </div>
          <p className="section-lead" style={{ maxWidth: '540px' }}>
            {c.eligibility.intro}
          </p>
        </div>

        <div className="eligibility-grid">
          {c.eligibility.items.map((item) => (
            <article className="eligibility-card" key={item.num}>
              <div className="eligibility-num">CRITERIA {item.num}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ================= 2. STRATEGIC ENROLLMENT TRACKS (THREE PATHS) ================= */}
      <section className="section section-tinted full-width" id="tracks">
        <div className="section" style={{ padding: '0 24px' }}>
          <div className="section-header-center">
            <div className="section-kicker">{c.tracks.kicker}</div>
            <h2 className="section-title">{c.tracks.title}</h2>
            <p className="section-lead">{c.tracks.intro}</p>
          </div>

          <div className="tracks-grid">
            {c.tracks.items.map((track, i) => (
              <article className={`track-card track-${['a', 'b', 'c'][i]}`} key={track.code}>
                <div className="track-top-badge-row">
                  <span className="track-code">{track.code}</span>
                  <span className="track-tag">{track.tag}</span>
                </div>

                <h3>{track.title}</h3>
                <p className="track-desc">{track.desc}</p>

                <div className="track-arrangement-box">
                  <div className="track-arrangement-title">
                    <span>🏛️</span>
                    <span>{track.structureLabel}</span>
                  </div>
                  <p className="track-arrangement-desc">{track.structure}</p>
                </div>

                <button
                  className="track-select-btn"
                  onClick={() => openFormWithTrack(track.trackKey)}
                >
                  {track.btnText} →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. SPIRITUAL DEVELOPMENT & CHANTING PROGRESSION ================= */}
      <section className="section" id="progression">
        <div className="section-header-split">
          <div>
            <div className="section-kicker">{c.progression.kicker}</div>
            <h2 className="section-title">{c.progression.title}</h2>
          </div>
          <p className="section-lead" style={{ maxWidth: '520px' }}>
            {c.progression.intro}
          </p>
        </div>

        <div className="timeline-stepper">
          {c.progression.steps.map((st, i) => (
            <div className={`timeline-step ${st.pinnacle ? 'pinnacle-step' : ''}`} key={i}>
              <div className="timeline-step-header">
                <div className="timeline-time-col">
                  <span className="timeline-month-label">{st.month}</span>
                  <span className="timeline-time-badge">{st.time}</span>
                </div>
                <div className="timeline-round-pill">
                  <span>📿 {st.rounds}</span>
                </div>
              </div>

              <div className="timeline-desc-col">
                <p>{st.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="accelerated-track-box">
          <h3>
            <span>⚡</span>
            <span>{c.progression.acceleratedTitle}</span>
          </h3>
          <ul>
            {c.progression.accelerated.map((acc, idx) => (
              <li key={idx}>{acc}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= 4. A DAY IN THE GURUKUL (DINACHARYA) ================= */}
      <section className="section section-tinted full-width" id="schedule">
        <div className="section" style={{ padding: '0 24px' }}>
          <div className="section-header-center">
            <div className="section-kicker">{c.schedule.kicker}</div>
            <h2 className="section-title">{c.schedule.title}</h2>
            <p className="section-lead">{c.schedule.intro}</p>
          </div>

          <div className="schedule-grid">
            {c.schedule.items.map((item, idx) => (
              <article className="schedule-card" key={idx}>
                <span className="schedule-time">{item.time}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. CODE OF CONDUCT & TEMPLE NORMS ================= */}
      <section className="section" id="norms">
        <div className="section-header-center">
          <div className="section-kicker">{c.norms.kicker}</div>
          <h2 className="section-title">{c.norms.title}</h2>
          <p className="section-lead">{c.norms.intro}</p>
        </div>

        <div className="sacred-divider">✦ {c.norms.principlesTitle} ✦</div>

        <div className="principles-grid">
          {c.norms.principles.map((pr, i) => (
            <article className="principle-card" key={i}>
              <span className="principle-pillar-badge">{pr.pillar}</span>
              <h3>{pr.title}</h3>
              <p>{pr.body}</p>
            </article>
          ))}
        </div>

        <h3 className="discipline-subheading">{c.norms.disciplineTitle}</h3>
        <div className="discipline-grid">
          {c.norms.discipline.map((disc, idx) => (
            <article className="discipline-card" key={idx}>
              <div className="discipline-card-icon">{disc.icon}</div>
              <h4>{disc.title}</h4>
              <p>{disc.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ================= 6. ADVANCED TRACK: BRAHMACHARI ASHRAM ================= */}
      <section className="section ashram-sanctuary-section full-width" id="advanced">
        <div className="section" style={{ padding: '0 24px' }}>
          <div className="section-header-center">
            <div className="section-kicker">{c.advanced.kicker}</div>
            <h2 className="section-title">{c.advanced.title}</h2>
            <p className="section-lead">{c.advanced.intro}</p>
          </div>

          <div className="ashram-features-grid">
            {c.advanced.items.map((item) => (
              <article className="ashram-card" key={item.idx}>
                <span className="ashram-card-idx">PILLAR {item.idx}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. IMPLEMENTATION & SCREENING PATHWAY ================= */}
      <section className="section" id="pathway">
        <div className="section-header-center">
          <div className="section-kicker">{c.pathway.kicker}</div>
          <h2 className="section-title">{c.pathway.title}</h2>
          <p className="section-lead">{c.pathway.intro}</p>
        </div>

        <div className="pathway-grid">
          {c.pathway.steps.map((pw) => (
            <article className="pathway-card" key={pw.step}>
              <div className="pathway-step-num">{pw.step}</div>
              <h3>{pw.title}</h3>
              <p>{pw.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ================= 8. FREQUENTLY ASKED QUESTIONS (FAQ) ================= */}
      <section className="section section-tinted full-width" id="faq">
        <div className="section" style={{ padding: '0 24px' }}>
          <div className="section-header-center">
            <div className="section-kicker">{c.faq.kicker}</div>
            <h2 className="section-title">{c.faq.title}</h2>
            <p className="section-lead">{c.faq.intro}</p>
          </div>

          <div className="faq-list">
            {c.faq.items.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div className={`faq-item ${isOpen ? 'open' : ''}`} key={index}>
                  <button
                    className="faq-trigger"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      ▾
                    </span>
                  </button>
                  {isOpen && <div className="faq-answer">{item.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 9. FINAL CALL TO ACTION ================= */}
      <section className="section">
        <div className="final-cta-section">
          <div className="section-kicker">{c.cta.kicker}</div>
          <h2>{c.cta.title}</h2>
          <p>{c.cta.body}</p>

          <button className="btn-primary-gold" onClick={() => openFormWithTrack()}>
            <span>{c.cta.btn}</span>
            <span>↗</span>
          </button>
        </div>

        {/* Contact and Location Grid */}
        <div className="contact-grid" id="contact">
          <div className="contact-card">
            <div className="contact-icon-bubble">📞</div>
            <div className="contact-details">
              <h4>{c.contact.phoneLabel}</h4>
              <a className="contact-phone-number" href={`tel:${c.contact.phone}`}>
                +91 {c.contact.phone}
              </a>
              <span style={{ fontSize: '13px', color: '#7E7065' }}>
                {lang === 'hi'
                  ? 'सोमवार से रविवार • प्रातः ९:०० से सायं ७:०० बजे'
                  : 'Monday to Sunday • 9:00 AM to 7:00 PM'}
              </span>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon-bubble">📍</div>
            <div className="contact-details">
              <h4>{c.contact.locationLabel}</h4>
              <p className="contact-location-text">{c.contact.location}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top-row">
            <div className="footer-brand">
              <span className="brand-mark" style={{ width: 40, height: 40 }}>
                <img src={lotusImage} alt="" />
              </span>
              <div>
                <strong style={{ display: 'block', fontSize: 13, letterSpacing: 2 }}>
                  LIVE LIKE A MONK
                </strong>
                <span style={{ fontSize: 11, color: '#D4AF37' }}>
                  ISKCON NVCC PUNE (NEW VEDIC CULTURAL CENTER)
                </span>
              </div>
            </div>

            <div className="footer-mantra">
              <span>॥ हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥</span>
            </div>
          </div>

          <div className="footer-bottom-row">
            <span>{c.footer.tagline}</span>
            <span>{c.footer.copyright}</span>
          </div>
        </div>
      </footer>

      {/* ================= REGISTRATION MODAL FORM ================= */}
      {openModal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenModal(false);
          }}
        >
          <div className="modal-container">
            <button
              className="modal-close-btn"
              onClick={() => setOpenModal(false)}
              aria-label={c.form.close}
            >
              ×
            </button>

            <RegistrationFormCard
              lang={lang}
              c={c.form}
              contactPhone={c.contact.phone}
              selectedTrack={selectedTrack}
              setSelectedTrack={setSelectedTrack}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              sentSuccess={sentSuccess}
              setSentSuccess={setSentSuccess}
              loading={loading}
              errorMessage={errorMessage}
              onSubmit={handleFormSubmit}
              isModal={true}
              onClose={() => setOpenModal(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          title="Top"
        >
          ↑
        </button>
      )}
    </main>
  </div>
  );
}
