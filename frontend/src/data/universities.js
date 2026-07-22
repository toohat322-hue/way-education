import { grad } from "../theme/tokens.js";

// Replace this with a real API call (e.g. fetch("/api/universities")) once
// there's a backend. Every component reads from here, so swapping the data
// source later only means changing this one file.
// Every university object supports an optional `image` (hero/card photo URL)
// and `gallery` (array of photo URLs). Until real photos are supplied, the UI
// falls back to the gradient placeholder automatically -- just add the URL
// once you have it and no component code needs to change.
//
// Also optional (all default to "off"/empty if omitted, so existing records
// don't need to be backfilled):
//   - `contact: { phone, email, website }` -- shown on the detail page sidebar.
//   - `social: { facebook, instagram, linkedin }` -- URLs, shown alongside contact.
//   - `featured: boolean` -- featured universities sort first in public listings
//     (see `publicUniversities` in src/admin/DataContext.jsx).
//   - `active: boolean` -- set false to hide a university from every public
//     listing and its own detail page (admins can still see/edit it).
//   - `photoCredit: { text, url }` -- shown as a small caption over the hero
//     image on the detail page. Only needed for images whose license requires
//     attribution (e.g. Wikimedia Commons CC BY) -- public-domain or
//     purpose-shot photos can skip it.
export const UNIVERSITIES = [
  {
    id: "iau",
    grad: grad.card1,
    initial: "A",
    image: "/universities/heroes/iau-real.jpg",
    logo: "/universities/logos/iau.webp",
    gallery: [
      "/universities/gallery/iau-1.jpg",
      "/universities/gallery/iau-2.png",
      "/universities/gallery/iau-3.jpg",
      "/universities/gallery/iau-4.webp",
    ],
    name: "Istanbul Aydın University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 2500,
    rating: 4.7,
    reviews: 312,
    ranking: 12,
    founded: 2007,
    studentsCount: "42,000+",
    intl: "6,500+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 75,
    majors: [
      {
        name: { en: "Medicine", ar: "الطب" },
        fee: 9000,
        iconName: "Stethoscope",
      },
      {
        name: { en: "Computer Science", ar: "علوم الحاسوب" },
        fee: 3200,
        iconName: "Code2",
      },
      {
        name: { en: "Business Administration", ar: "إدارة الأعمال" },
        fee: 2500,
        iconName: "Briefcase",
      },
      {
        name: { en: "Architecture", ar: "العمارة" },
        fee: 3800,
        iconName: "Building2",
      },
    ],
    gpaReq: "70%+",
    docs: {
      en: ["High school diploma", "Passport copy", "Transcript", "4 photos"],
      ar: ["شهادة الثانوية", "صورة جواز السفر", "كشف الدرجات", "4 صور شخصية"],
    },
    about: {
      en: "A leading private university in Istanbul known for its modern campuses, strong international community and career-focused programs across medicine, engineering and business.",
      ar: "جامعة خاصة رائدة في إسطنبول تشتهر بحرمها الحديث ومجتمعها الدولي القوي وبرامجها الموجهة نحو سوق العمل في الطب والهندسة وإدارة الأعمال.",
    },
    testimonials: [
      {
        name: "Youssef, Egypt",
        text: {
          en: "The consultants handled everything — I only had to pack my bags.",
          ar: "المستشارون تولوا كل شيء — لم يكن عليّ سوى حزم حقائبي.",
        },
        rating: 5,
      },
      {
        name: "Lina, Jordan",
        text: {
          en: "Got a 50% scholarship I didn't even know I qualified for.",
          ar: "حصلت على منحة 50٪ لم أكن أعلم أنني مؤهلة لها.",
        },
        rating: 5,
      },
    ],
  },
  {
    id: "nisantasi",
    grad: grad.card2,
    initial: "N",
    image: "/universities/heroes/nisantasi.svg",
    logo: "/universities/logos/nisantasi.svg",
    gallery: [],
    name: "Istanbul Nişantaşı University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 2450,
    rating: 4.7,
    reviews: 210,
    ranking: 148,
    founded: 2009,
    studentsCount: "10,400+",
    intl: "3,000+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Mechanical Engineering", ar: "الهندسة الميكانيكية" },
        fee: 2450,
        iconName: "Wrench",
      },
      {
        name: { en: "Architecture", ar: "العمارة" },
        fee: 2950,
        iconName: "Building2",
      },
      {
        name: { en: "Business Administration", ar: "إدارة الأعمال" },
        fee: 2950,
        iconName: "Briefcase",
      },
      {
        name: { en: "Interior Design", ar: "التصميم الداخلي" },
        fee: 2950,
        iconName: "Building2",
      },
      {
        name: { en: "Industrial Engineering", ar: "الهندسة الصناعية" },
        fee: 2950,
        iconName: "Cpu",
      },
      {
        name: { en: "Psychology", ar: "علم النفس" },
        fee: 2950,
        iconName: "HeartPulse",
      },
      {
        name: { en: "Gastronomy & Culinary Arts", ar: "فن الطهي والطهو" },
        fee: 2950,
        iconName: "Utensils",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "High school diploma",
        "Passport copy",
        "Transcript",
        "TOEFL / TOMER certificate (if applicable)",
      ],
      ar: [
        "شهادة الثانوية",
        "صورة جواز السفر",
        "كشف الدرجات",
        "شهادة توفل أو تومر (إن وجدت)",
      ],
    },
    about: {
      en: "Istanbul Nişantaşı University is a premier private university in Istanbul established in 2009. Featuring the state-of-the-art NeoTech Campus in Maslak, project-based education models, and digital technology integration, it holds major international accreditations including MÜDEK, CEA, EUA, EURAS, and European Union recognition.",
      ar: "جامعة إسطنبول نيشان تاشي هي جامعة خاصة متميزة في إسطنبول تأسست عام 2009. تتميز بحرم ماسلاك نيو تك التكنولوجي المتطور، ونظام تعليمي قائم على المشاريع ودمج التقنيات الرقمية، وتحظى باعترافات واعتمادات دولية بارزة مثل MÜDEK وCEA وEUA وEURAS واعتراف الاتحاد الأوروبي.",
    },
    testimonials: [
      {
        name: "Yassine, Morocco",
        text: {
          en: "The Maslak NeoTech Campus and digital labs are outstanding for engineering students.",
          ar: "حرم ماسلاك نيو تك والمختبرات الرقمية ممتازة لطلاب الهندسة.",
        },
        rating: 5,
      },
      {
        name: "Mariam, Jordan",
        text: {
          en: "Great location in Istanbul with a strong international student community and active career support.",
          ar: "موقع ممتاز في إسطنبول ومجتمع طلابي دولي ونشط ودعم مهني فعال.",
        },
        rating: 5,
      },
    ],
  },
  {
    id: "beykent",
    grad: grad.card3,
    initial: "B",
    image: "/universities/heroes/beykent.svg",
    logo: "/universities/logos/beykent.svg",
    gallery: [],
    name: "Istanbul Beykent University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 3056,
    rating: 4.6,
    reviews: 240,
    ranking: 82,
    founded: 1997,
    studentsCount: "30,600+",
    intl: "3,500+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Software Engineering", ar: "هندسة البرمجيات" },
        fee: 3056,
        iconName: "Code2",
      },
      {
        name: { en: "Mechanical Engineering", ar: "الهندسة الميكانيكية" },
        fee: 3361,
        iconName: "Wrench",
      },
      {
        name: { en: "Law", ar: "الحقوق" },
        fee: 3565,
        iconName: "Scale",
      },
      {
        name: {
          en: "Physical Therapy & Rehabilitation",
          ar: "العلاج الطبيعي والتأهيل",
        },
        fee: 3056,
        iconName: "Activity",
      },
      {
        name: { en: "Psychology", ar: "علم النفس" },
        fee: 3056,
        iconName: "HeartPulse",
      },
      {
        name: { en: "Medicine", ar: "الطب البشري" },
        fee: 12000,
        iconName: "Stethoscope",
      },
      {
        name: { en: "Dentistry", ar: "طب الأسنان" },
        fee: 11000,
        iconName: "Smile",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "High school diploma",
        "Passport copy",
        "Transcript",
        "4 personal photos",
        "TOEFL / TOMER C1 certificate (if applicable)",
      ],
      ar: [
        "شهادة الثانوية",
        "صورة جواز السفر",
        "كشف الدرجات",
        "4 صور شخصية",
        "شهادة توفل أو تومر C1 (إن وجدت)",
      ],
    },
    about: {
      en: "Istanbul Beykent University is a prominent private university founded in 1997 by the Adem Çelik Beykent Educational Foundation. Spanning 4 modern campuses across Istanbul (Ayazağa Maslak, Beylikdüzü, Hadımköy, and Taksim), it features 9 faculties, over 100 student clubs, 12 research centers, and international accreditations including MYK, Pearson, and Türkak.",
      ar: "جامعة إسطنبول بيكنت هي جامعة خاصة بارزة تأسست عام 1997 من قبل مؤسسة بيكنت التعليمية. تضم 4 حرم جامعية حديثة موزعة في إسطنبول (أيازاغا ماسلاك، بيليك دوزو، هادملكوي، وتقسيم)، وتشتمل على 9 كليات وأكثر من 100 نادٍ طلابي و12 مركز بحوث واعتمادات دولية مثل MYK وPearson وTürkak.",
    },
    testimonials: [
      {
        name: "Tariq, Syria",
        text: {
          en: "The Ayazağa Maslak campus has top-tier engineering labs and great student activities.",
          ar: "حرم أيازاغا ماسلاك يمتلك أفضل معامل الهندسة وأنشطة طلابية ممتازة.",
        },
        rating: 5,
      },
      {
        name: "Aya, Lebanon",
        text: {
          en: "Studying near Taksim and Maslak gives access to great internship options.",
          ar: "الدراسة بالقرب من تقسيم وماسلاك تتيح فرصة الوصول لفرص تدريب عملي رائعة.",
        },
        rating: 5,
      },
    ],
  },

  {
    id: "topkapi",
    grad: grad.card1,
    initial: "T",
    image: "/universities/heroes/topkapi.svg",
    logo: "/universities/logos/topkapi.svg",
    gallery: [],
    name: "Istanbul Topkapi University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 2900,
    rating: 4.5,
    reviews: 185,
    ranking: 180,
    founded: 2016,
    studentsCount: "9,500+",
    intl: "2,200+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Computer Engineering", ar: "هندسة الحاسوب" },
        fee: 3500,
        iconName: "Code2",
      },
      {
        name: { en: "Software Engineering", ar: "هندسة البرمجيات" },
        fee: 3500,
        iconName: "Cpu",
      },
      {
        name: { en: "Architecture", ar: "العمارة" },
        fee: 3200,
        iconName: "Building2",
      },
      {
        name: { en: "Graphic Design", ar: "التصميم الجرافيكي" },
        fee: 2900,
        iconName: "Palette",
      },
      {
        name: { en: "Gastronomy & Culinary Arts", ar: "فن الطهي والطهو" },
        fee: 2900,
        iconName: "Utensils",
      },
      {
        name: { en: "Psychology", ar: "علم النفس" },
        fee: 2900,
        iconName: "HeartPulse",
      },
      {
        name: { en: "Business Administration", ar: "إدارة الأعمال" },
        fee: 2900,
        iconName: "Briefcase",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "High school diploma",
        "Passport copy",
        "Official transcript",
        "Application form",
        "TÖMER B1 certificate (if applicable)",
      ],
      ar: [
        "شهادة الثانوية",
        "صورة جواز السفر",
        "كشف الدرجات الرسمي",
        "استمارة التقديم",
        "شهادة تومر مستوى B1 (إن وجدت)",
      ],
    },
    about: {
      en: "Istanbul Topkapi University (formerly Ayvansaray University) was established in 2016 in historic Balat, Istanbul. Renowned for its Plato Vocational School, strong focus on arts, design, engineering, and sports sciences, it offers high-quality bilingual education with European accreditation and Erasmus exchange programs.",
      ar: "جامعة إسطنبول توبكابي (جامعة أيفان سراي سابقاً) تأسست عام 2016 في منطقة بلاط التاريخية بإسطنبول. تشتهر بمعهد بلاتو المهني والتركيز القوي على الفنون والتصميم والهندسة وعلوم الرياضة، وتقدم تعليماً عالي الجودة وثنائي اللغة مع اعتمادات أوروبية وبرامج التبادل الطلابي إراسموس.",
    },
    testimonials: [
      {
        name: "Bilal, Morocco",
        text: {
          en: "Topkapi University's design and computer engineering labs are practical and modern.",
          ar: "معامل التصميم وهندسة الحاسوب في جامعة توبكابي عملية وحديثة للغاية.",
        },
        rating: 5,
      },
      {
        name: "Nour, Syria",
        text: {
          en: "The location in historic Balat and close-knit campus environment is ideal for international students.",
          ar: "الموقع في منطقة بلاط التاريخية والبيئة الجامعية مترابطة ومناسبة للطلاب الدوليين.",
        },
        rating: 5,
      },
    ],
  },
  {
    id: "istinye",
    grad: grad.card2,
    initial: "I",
    image: "/universities/heroes/istinye.svg",
    logo: "/universities/logos/istinye.svg",
    gallery: [],
    name: "Istinye University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 3800,
    rating: 4.7,
    reviews: 289,
    ranking: 8,
    founded: 2015,
    studentsCount: "15,000+",
    intl: "4,000+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 85,
    majors: [
      {
        name: { en: "Medicine", ar: "الطب" },
        fee: 11500,
        iconName: "Stethoscope",
      },
      {
        name: { en: "Dentistry", ar: "طب الأسنان" },
        fee: 10800,
        iconName: "Smile",
      },
      { name: { en: "Pharmacy", ar: "الصيدلة" }, fee: 7600, iconName: "Pill" },
    ],
    gpaReq: "70%+",
    docs: {
      en: [
        "High school diploma",
        "Passport copy",
        "Transcript",
        "Language certificate",
      ],
      ar: ["شهادة الثانوية", "صورة جواز السفر", "كشف الدرجات", "شهادة لغة"],
    },
    about: {
      en: "Renowned for its medical school and teaching hospitals, Istinye blends rigorous academics with a vibrant Istanbul campus life.",
      ar: "تشتهر بكليتها الطبية ومستشفياتها التعليمية، وتجمع بين الصرامة الأكاديمية وحياة جامعية نابضة في إسطنبول.",
    },
    testimonials: [
      {
        name: "Dana, Iraq",
        text: {
          en: "Clinical training started in year one — incredible exposure.",
          ar: "التدريب السريري بدأ من السنة الأولى — خبرة رائعة.",
        },
        rating: 5,
      },
    ],
  },
  {
    id: "atlas",
    grad: grad.card1,
    initial: "A",
    image: "",
    logo: "",
    gallery: [],
    name: "Istanbul Atlas University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 3206,
    rating: 4.6,
    reviews: 120,
    ranking: 136,
    founded: 2018,
    studentsCount: "2,400+",
    intl: "500+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Medicine", ar: "الطب البشري" },
        fee: 18000,
        iconName: "Stethoscope",
      },
      {
        name: { en: "Dentistry", ar: "طب الأسنان" },
        fee: 15000,
        iconName: "Smile",
      },
      {
        name: { en: "Computer Engineering", ar: "هندسة الحاسوب" },
        fee: 3206,
        iconName: "Code2",
      },
      {
        name: {
          en: "Molecular Biology and Genetics",
          ar: "البيولوجيا الجزيئية وعلم الوراثة",
        },
        fee: 3206,
        iconName: "Microscope",
      },
      {
        name: { en: "Interior Architecture", ar: "العمارة الداخلية" },
        fee: 2779,
        iconName: "Building2",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: ["High school diploma", "Passport copy", "Transcript", "Photo"],
      ar: ["شهادة الثانوية", "نسخة من جواز السفر", "كشف الدرجات", "صورة شخصية"],
    },
    about: {
      en: "Atlas University aims to provide top-notch education with a focus on health sciences and engineering, featuring a massive library, advanced laboratories, and dedicated student hospitals.",
      ar: "تهدف جامعة أطلس إلى توفير تعليم عالي المستوى مع التركيز على العلوم الصحية والهندسة، وتتميز بمكتبة ضخمة ومختبرات متقدمة ومستشفيات طلابية مخصصة.",
    },
    testimonials: [],
  },
  {
    id: "bau",
    grad: grad.card2,
    initial: "B",
    image: "",
    logo: "",
    gallery: [],
    name: "Bahçeşehir University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 8200,
    rating: 4.8,
    reviews: 340,
    ranking: 24,
    founded: 1998,
    studentsCount: "19,500+",
    intl: "5,000+",
    language: { en: "English", ar: "إنجليزي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Medicine", ar: "الطب البشري" },
        fee: 25000,
        iconName: "Stethoscope",
      },
      {
        name: { en: "Dentistry", ar: "طب الأسنان" },
        fee: 20000,
        iconName: "Smile",
      },
      {
        name: { en: "Engineering", ar: "الهندسة" },
        fee: 8200,
        iconName: "Wrench",
      },
      { name: { en: "Law", ar: "الحقوق" }, fee: 8200, iconName: "Scale" },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "High school diploma",
        "Passport copy",
        "Transcript",
        "English proficiency",
      ],
      ar: [
        "شهادة الثانوية",
        "نسخة من جواز السفر",
        "كشف الدرجات",
        "إثبات إجادة اللغة الإنجليزية",
      ],
    },
    about: {
      en: "Bahçeşehir University (BAU) is a world-class private university in the heart of Istanbul, offering a wide array of degrees in English with hundreds of international partners.",
      ar: "جامعة بهتشه شهير هي جامعة خاصة ذات مستوى عالمي في قلب إسطنبول، تقدم مجموعة واسعة من الدرجات العلمية باللغة الإنجليزية مع مئات الشركاء الدوليين.",
    },
    testimonials: [],
  },
  {
    id: "medipol",
    grad: grad.card3,
    initial: "M",
    image: "",
    logo: "",
    gallery: [],
    name: "Istanbul Medipol University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 5850,
    rating: 4.7,
    reviews: 410,
    ranking: 48,
    founded: 2009,
    studentsCount: "27,500+",
    intl: "1,300+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Medicine", ar: "الطب البشري" },
        fee: 30000,
        iconName: "Stethoscope",
      },
      {
        name: { en: "Dentistry", ar: "طب الأسنان" },
        fee: 30000,
        iconName: "Smile",
      },
      { name: { en: "Pharmacy", ar: "الصيدلة" }, fee: 10080, iconName: "Pill" },
      {
        name: { en: "Architecture", ar: "العمارة" },
        fee: 6000,
        iconName: "Building2",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "High school diploma",
        "Passport copy",
        "Transcript",
        "Language certificate",
      ],
      ar: ["شهادة الثانوية", "نسخة من جواز السفر", "كشف الدرجات", "شهادة لغة"],
    },
    about: {
      en: "Medipol University is one of the best medical and research universities in Istanbul, known for its Medipol Mega Hospitals Complex and top-quality health sciences education.",
      ar: "تعد جامعة ميديبول واحدة من أفضل الجامعات الطبية والبحثية في إسطنبول، وتشتهر بمجمع مستشفيات ميديبول ميجا والتعليم عالي الجودة في العلوم الصحية.",
    },
    testimonials: [],
  },
  {
    id: "kultur",
    grad: grad.card1,
    initial: "K",
    image: "/universities/heroes/kultur.svg",
    logo: "/universities/logos/kultur.svg",
    gallery: [],
    name: "Istanbul Kültür University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 2462,
    rating: 4.6,
    reviews: 205,
    ranking: 106,
    founded: 1997,
    studentsCount: "15,600+",
    intl: "3,200+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: {
          en: "Electrical & Computer Engineering",
          ar: "هندسة الكهرباء والحاسوب",
        },
        fee: 4930,
        iconName: "Code2",
      },
      {
        name: { en: "Civil Engineering", ar: "الهندسة المدنية" },
        fee: 4250,
        iconName: "Wrench",
      },
      {
        name: { en: "Architecture", ar: "العمارة" },
        fee: 5882,
        iconName: "Building2",
      },
      {
        name: { en: "Business Administration", ar: "إدارة الأعمال" },
        fee: 4250,
        iconName: "Briefcase",
      },
      {
        name: {
          en: "Political Science & International Relations",
          ar: "العلوم السياسية والعلاقات الدولية",
        },
        fee: 4930,
        iconName: "Globe",
      },
      {
        name: {
          en: "International Trade & Finance",
          ar: "التجارة الدولية والمالية",
        },
        fee: 4250,
        iconName: "TrendingUp",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "High school certificate",
        "Official transcript",
        "Passport copy",
        "Personal photo",
        "Language proficiency proof",
      ],
      ar: [
        "شهادة الثانوية العامة",
        "كشف الدرجات الرسمي",
        "صورة جواز السفر",
        "صورة شخصية",
        "إثبات إجادة اللغة",
      ],
    },
    about: {
      en: "Istanbul Kültür University was established in 1997 by the Kültür College Education Foundation (KEV). Offering 8 distinguished faculties, over 50 laboratories and research centers, and 80+ Erasmus international agreements, it holds top accreditations including MÜDEK, MIAK, FEDEK, and Pearson.",
      ar: "تأسست جامعة إسطنبول كولتور عام 1997 من قبل مؤسسة كولتور التعليمية. تضم 8 كليات متميزة وأكثر من 50 مختبراً ومحيط أبحاث وأكثر من 80 اتفاقية تبادل إراسموس دولية، وتحظى باعترافات واعتمادات رائدة مثل MÜDEK وMIAK وFEDEK وPearson.",
    },
    testimonials: [
      {
        name: "Ziad, Egypt",
        text: {
          en: "The architecture labs and MIAK accredited program are top quality.",
          ar: "مختبرات العمارة والبرنامج المعتمد من MIAK عالية الجودة.",
        },
        rating: 5,
      },
      {
        name: "Sara, Jordan",
        text: {
          en: "Great campus environment in Istanbul with solid career support and international opportunities.",
          ar: "بيئة جامعية رائعة في إسطنبول مع دعم مهني ممتاز وفرص دولية.",
        },
        rating: 5,
      },
    ],
  },
  {
    id: "gelisim",
    grad: grad.card2,
    initial: "G",
    image: "/universities/heroes/gelisim.svg",
    logo: "/universities/logos/gelisim.svg",
    gallery: [],
    name: "Istanbul Gelişim University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 3500,
    rating: 4.7,
    reviews: 320,
    ranking: 54,
    founded: 2008,
    studentsCount: "34,200+",
    intl: "4,500+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Aeronautical Engineering", ar: "هندسة الطيران" },
        fee: 5250,
        iconName: "Plane",
      },
      {
        name: { en: "Civil Engineering", ar: "الهندسة المدنية" },
        fee: 4000,
        iconName: "Wrench",
      },
      {
        name: { en: "Architecture", ar: "العمارة" },
        fee: 4000,
        iconName: "Building2",
      },
      {
        name: { en: "Business Administration", ar: "إدارة الأعمال" },
        fee: 4000,
        iconName: "Briefcase",
      },
      {
        name: { en: "Dentistry", ar: "طب الأسنان" },
        fee: 11500,
        iconName: "Smile",
      },
      {
        name: { en: "Gastronomy & Culinary Arts", ar: "فن الطهي والطهو" },
        fee: 3750,
        iconName: "Utensils",
      },
      {
        name: {
          en: "English Language & Literature",
          ar: "اللغة الإنجليزية وآدابها",
        },
        fee: 4000,
        iconName: "BookOpen",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "High school diploma / semester transcript",
        "Official transcript",
        "Passport copy",
        "Language proficiency certificate (TOEFL/TÖMER)",
      ],
      ar: [
        "شهادة الثانوية العامة / كشف درجات الفصل الدراسي الأخير",
        "كشف الدرجات الرسمي",
        "صورة جواز السفر",
        "شهادة إجادة اللغة (التوفل/التومر إن وجدت)",
      ],
    },
    about: {
      en: "Istanbul Gelişim University (IGU) was founded in 2008 in central Istanbul. Featuring a massive research complex with over 100 laboratories, 17 research centers, and 50+ student clubs, it holds prestigious international accreditations such as ABET, AQAS, AHPGS, PEARSON, and YÖK.",
      ar: "تأسست جامعة إسطنبول جيليشيم (IGU) عام 2008 في مركز إسطنبول. تضم مجمع أبحاث ضخم يحتوي على أكثر من 100 مختبر و17 مركز أبحاث وأكثر من 50 نادياً طلابياً، وتحظى باعترافات واعتمادات دولية مرموقة مثل ABET وAQAS وAHPGS وPEARSON وYÖK.",
    },
    testimonials: [
      {
        name: "Hamza, Jordan",
        text: {
          en: "The ABET accredited engineering labs and English instruction make Gelişim a top choice.",
          ar: "معامل الهندسة المعتمدة من ABET والتعليم باللغة الإنجليزية يضمنان تجربة ممتازة.",
        },
        rating: 5,
      },
      {
        name: "Laila, Morocco",
        text: {
          en: "Huge research complex and vibrant campus life in the center of Istanbul.",
          ar: "مجمع أبحاث ضخم وحياة جامعية حافلة في وسط إسطنبول.",
        },
        rating: 5,
      },
    ],
  },
  {
    id: "altinbas",
    grad: grad.card3,
    initial: "A",
    image: "/universities/heroes/altinbas.svg",
    logo: "/universities/logos/altinbas.svg",
    gallery: [],
    name: "Altınbaş University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 3500,
    rating: 4.7,
    reviews: 270,
    ranking: 120,
    founded: 2008,
    studentsCount: "13,800+",
    intl: "5,500+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: {
          en: "Engineering & Natural Sciences",
          ar: "الهندسة والعلوم الطبيعية",
        },
        fee: 4000,
        iconName: "Wrench",
      },
      {
        name: {
          en: "Business & Management",
          ar: "إدارة الأعمال والعلوم الإدارية",
        },
        fee: 4000,
        iconName: "Briefcase",
      },
      {
        name: { en: "Law", ar: "الحقوق" },
        fee: 4000,
        iconName: "Scale",
      },
      {
        name: {
          en: "Fine Arts & Design",
          ar: "الفنون الجميلة والتصميم",
        },
        fee: 4000,
        iconName: "Palette",
      },
      {
        name: { en: "Pharmacy", ar: "الصيدلة" },
        fee: 15000,
        iconName: "Pill",
      },
      {
        name: { en: "Dentistry", ar: "طب الأسنان" },
        fee: 20000,
        iconName: "Smile",
      },
      {
        name: { en: "Medicine", ar: "الطب البشري" },
        fee: 25000,
        iconName: "Stethoscope",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "Passport copy",
        "Personal photograph",
        "High school graduation diploma",
        "High school academic transcript",
        "TOEFL IBT (70+) / Language test result",
      ],
      ar: [
        "صورة جواز السفر",
        "صورة شخصية",
        "شهادة الثانوية العامة",
        "كشف الدرجات الأكاديمي",
        "شهادة توفل IBT (70+) أو إثبات إجادة اللغة",
      ],
    },
    about: {
      en: "Altınbaş University is a non-profit foundation university founded in 2008 in Istanbul. Featuring 3 modern campuses in Bağcılar, Bakırköy, and Şişli, it hosts over 5,500 international students from 90 countries (~40% of student body), offering 9 undergraduate schools, flexible double-major tracks, small class sizes, and YÖK & EU accreditations.",
      ar: "تأسست جامعة ألتن باش عام 2008 كجامعة مؤسسية غير ربحية في إسطنبول. تضم 3 حرم جامعية حديثة في باججلار، باكركوي، وشيشلي، وتستضيف أكثر من 5,500 طالب دولي من 90 دولة (يشكلون حوالي 40٪ من الطلاب)، وتوفر 9 كليات جامعية وفصولاً صغيرة واعتمادات YÖK والاتحاد الأوروبي.",
    },
    testimonials: [
      {
        name: "Khaled, Kuwait",
        text: {
          en: "The international community is huge and ~40% international students make it feel globally connected.",
          ar: "المجتمع الدولي ضخم ونسبة 40% طلاب دوليين تجعل البيئة عالمية بحق.",
        },
        rating: 5,
      },
      {
        name: "Maya, Syria",
        text: {
          en: "Great faculty experience, small class sizes, and very flexible double major options.",
          ar: "خبرة تدريسية رائعة وفصول صغيرة وخيارات التخصص المزدوج مرنة جداً.",
        },
        rating: 5,
      },
    ],
  },
  {
    id: "arel",
    grad: grad.card1,
    initial: "A",
    image: "/universities/heroes/arel.svg",
    logo: "/universities/logos/arel.svg",
    gallery: [],
    name: "Istanbul Arel University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 3350,
    rating: 4.6,
    reviews: 180,
    ranking: 139,
    founded: 2007,
    studentsCount: "2,416+",
    intl: "1,000+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Computer Engineering", ar: "هندسة الحاسوب" },
        fee: 3500,
        iconName: "Monitor",
      },
      {
        name: { en: "Industrial Engineering", ar: "الهندسة الصناعية" },
        fee: 3500,
        iconName: "Settings",
      },
      {
        name: {
          en: "Molecular Biology and Genetics",
          ar: "علم الأحياء الجزيئي وعلم الوراثة",
        },
        fee: 3500,
        iconName: "Dna",
      },
      {
        name: { en: "Business Administration", ar: "إدارة الأعمال" },
        fee: 3500,
        iconName: "Briefcase",
      },
      {
        name: { en: "International Relations", ar: "العلاقات الدولية" },
        fee: 3500,
        iconName: "Globe",
      },
      {
        name: {
          en: "Translation and Interpretation",
          ar: "الترجمة التحريرية والفورية",
        },
        fee: 3500,
        iconName: "Languages",
      },
      {
        name: {
          en: "Electrical and Electronic Engineering",
          ar: "الهندسة الكهربائية والإلكترونية",
        },
        fee: 3500,
        iconName: "Zap",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "High school diploma",
        "High school transcript",
        "Passport copy",
        "4 personal photos",
        "TOEFL / Language certificate",
      ],
      ar: [
        "شهادة الثانوية العامة",
        "كشف درجات الثانوية العامة",
        "صورة جواز السفر",
        "4 صور شخصية",
        "شهادة التوفل / شهادة لغة",
      ],
    },
    about: {
      en: "Istanbul Arel University was founded in 2007 in Istanbul. It offers international students a rich student life with excellent facilities including over 60 workshops, labs and research centers. The university also maintains partnerships with over 2,500 companies worldwide, providing students with valuable practical internships.",
      ar: "تأسست جامعة إسطنبول أريل عام 2007 في إسطنبول. توفر للطلاب الدوليين حياة طلابية غنية بمرافق ممتازة تضم أكثر من 60 ورشة عمل ومختبر ومركز أبحاث. كما تحتفظ الجامعة بشراكات مع أكثر من 2500 شركة حول العالم، مما يوفر للطلاب تدريباً عملياً قيماً.",
    },
    testimonials: [
      {
        name: "Omar, Lebanon",
        text: {
          en: "The internships provided through the university's corporate partnerships were invaluable.",
          ar: "التدريب العملي المقدم من خلال شراكات الجامعة مع الشركات كان لا يقدر بثمن.",
        },
        rating: 5,
      },
      {
        name: "Aisha, UAE",
        text: {
          en: "Amazing facilities and a vibrant student life on campus.",
          ar: "مرافق مذهلة وحياة طلابية نابضة بالحياة داخل الحرم الجامعي.",
        },
        rating: 5,
      },
    ],
  },
  {
    id: "uskudar",
    grad: grad.card2,
    initial: "Ü",
    image: "/universities/heroes/uskudar.svg",
    logo: "/universities/logos/uskudar.svg",
    gallery: [],
    name: "Üsküdar University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 3200,
    rating: 4.8,
    reviews: 210,
    ranking: 76,
    founded: 2011,
    studentsCount: "23,690+",
    intl: "2,000+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Medicine", ar: "الطب البشري" },
        fee: 22000,
        iconName: "Stethoscope",
      },
      {
        name: { en: "Dentistry", ar: "طب الأسنان" },
        fee: 15000,
        iconName: "Smile",
      },
      {
        name: { en: "Engineering", ar: "الهندسة" },
        fee: 4500,
        iconName: "Settings",
      },
      {
        name: { en: "Health Sciences", ar: "العلوم الصحية" },
        fee: 3200,
        iconName: "Heart",
      },
      {
        name: {
          en: "Humanities & Social Sciences",
          ar: "العلوم الإنسانية والاجتماعية",
        },
        fee: 3900,
        iconName: "Users",
      },
      {
        name: { en: "Media and Communication", ar: "الإعلام والاتصال" },
        fee: 3200,
        iconName: "Video",
      },
      {
        name: { en: "Economics & Administration", ar: "الاقتصاد والإدارة" },
        fee: 3200,
        iconName: "PieChart",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "Passport copy",
        "High school certificate (translated and certified)",
        "High school transcript (translated and certified)",
        "English language certificate (if applicable)",
      ],
      ar: [
        "صورة جواز السفر",
        "شهادة الثانوية العامة (مترجمة ومصدقة)",
        "كشف درجات الثانوية (مترجم ومصدق)",
        "شهادة لغة إنجليزية (إن وجدت)",
      ],
    },
    about: {
      en: "Üsküdar University is a private university located on the Asian side of Istanbul overlooking the Bosphorus. Established in 2011, it is a pioneer in behavioral sciences and health, offering exceptional medical training and clinical neuroscience research in partnership with NP Istanbul Brain Hospital.",
      ar: "جامعة أسكودار هي جامعة خاصة تقع في الجانب الآسيوي من إسطنبول وتطل على مضيق البوسفور. تأسست في عام 2011، وهي رائدة في العلوم السلوكية والصحية، وتقدم تدريباً طبياً استثنائياً وأبحاثاً في علم الأعصاب السريري بالشراكة مع مستشفى NP إسطنبول لعلاج الدماغ.",
    },
    testimonials: [
      {
        name: "Ali, Iraq",
        text: {
          en: "The neuroscience research facilities here are incredible. A true pioneer in the field.",
          ar: "مرافق أبحاث علم الأعصاب هنا مذهلة. إنها رائدة حقيقية في هذا المجال.",
        },
        rating: 5,
      },
      {
        name: "Sara, Palestine",
        text: {
          en: "A beautiful campus on the Asian side, close to the Bosphorus, and excellent academic programs.",
          ar: "حرم جامعي جميل في الجانب الآسيوي، قريب من البوسفور، وبرامج أكاديمية ممتازة.",
        },
        rating: 5,
      },
    ],
  },
  {
    id: "gedik",
    grad: grad.card1,
    initial: "G",
    image: "/universities/heroes/gedik.svg",
    logo: "/universities/logos/gedik.svg",
    gallery: [],
    name: "İstanbul Gedik University",
    city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" },
    type: { en: "Private", ar: "خاصة" },
    tuition: 2750,
    rating: 4.5,
    reviews: 140,
    ranking: 142,
    founded: 1994,
    studentsCount: "6,254+",
    intl: "400+",
    language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 50,
    majors: [
      {
        name: { en: "Engineering", ar: "الهندسة" },
        fee: 2750,
        iconName: "Settings",
      },
      {
        name: {
          en: "Economics & Administrative Sciences",
          ar: "العلوم الاقتصادية والإدارية",
        },
        fee: 2750,
        iconName: "PieChart",
      },
      {
        name: { en: "Health Sciences", ar: "العلوم الصحية" },
        fee: 2750,
        iconName: "Heart",
      },
      {
        name: { en: "Fine Arts & Architecture", ar: "الفنون الجميلة والعمارة" },
        fee: 2750,
        iconName: "Palette",
      },
      {
        name: {
          en: "Mathematical & Sports Sciences",
          ar: "العلوم الرياضية والرياضة",
        },
        fee: 2750,
        iconName: "Activity",
      },
    ],
    gpaReq: "60%+",
    docs: {
      en: [
        "Passport copy",
        "High school certificate (translated and certified)",
        "English language certificate (if applicable)",
      ],
      ar: [
        "صورة جواز السفر",
        "شهادة الثانوية العامة (مترجمة ومصدقة)",
        "شهادة لغة إنجليزية (إن وجدت)",
      ],
    },
    about: {
      en: "İstanbul Gedik University is a private university founded in 1994 by the Gedik Holding Foundation. It has 5 campuses on the Asian side of Istanbul and focuses on vocational training, scientific research, and practical internships in its affiliated institutions to prepare graduates for the labor market.",
      ar: "جامعة إسطنبول جيديك هي جامعة خاصة تأسست في عام 1994 من قبل مؤسسة جيديك القابضة. تمتلك 5 أحرم جامعية في الجانب الآسيوي من إسطنبول، وتركز على التدريب المهني والبحث العلمي والتدريب العملي في المؤسسات التابعة لها لإعداد الخريجين لسوق العمل.",
    },
    testimonials: [
      {
        name: "Youssef, Egypt",
        text: {
          en: "The focus on practical training really helped me secure a job right after graduation.",
          ar: "التركيز على التدريب العملي ساعدني حقًا في تأمين وظيفة فور التخرج.",
        },
        rating: 5,
      },
      {
        name: "Lina, Morocco",
        text: {
          en: "Quiet campuses on the Asian side with excellent sports and research facilities.",
          ar: "أحرم جامعية هادئة في الجانب الآسيوي مع مرافق رياضية وبحثية ممتازة.",
        },
        rating: 5,
      },
    ],
  },
];

export function getUniversityById(id) {
  return UNIVERSITIES.find((u) => u.id === id);
}
