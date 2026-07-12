import { grad } from "../theme/tokens";

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
export const UNIVERSITIES = [
  {
    id: "iau", grad: grad.card1, initial: "A", image: "/universities/heroes/iau-real.jpg", logo: "/universities/logos/iau.webp",
    gallery: [
      "/universities/gallery/iau-1.jpg",
      "/universities/gallery/iau-2.png",
      "/universities/gallery/iau-3.jpg",
      "/universities/gallery/iau-4.webp",
    ],
    name: "Istanbul Aydın University", city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" }, type: { en: "Private", ar: "خاصة" },
    tuition: 2500, rating: 4.7, reviews: 312, ranking: 12, founded: 2007,
    studentsCount: "42,000+", intl: "6,500+", language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 75,
    majors: [
      { name: { en: "Medicine", ar: "الطب" }, fee: 9000, iconName: "Stethoscope" },
      { name: { en: "Computer Science", ar: "علوم الحاسوب" }, fee: 3200, iconName: "Code2" },
      { name: { en: "Business Administration", ar: "إدارة الأعمال" }, fee: 2500, iconName: "Briefcase" },
      { name: { en: "Architecture", ar: "العمارة" }, fee: 3800, iconName: "Building2" },
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
      { name: "Youssef, Egypt", text: { en: "The consultants handled everything — I only had to pack my bags.", ar: "المستشارون تولوا كل شيء — لم يكن عليّ سوى حزم حقائبي." }, rating: 5 },
      { name: "Lina, Jordan", text: { en: "Got a 50% scholarship I didn't even know I qualified for.", ar: "حصلت على منحة 50٪ لم أكن أعلم أنني مؤهلة لها." }, rating: 5 },
    ],
  },
  {
    id: "ihu", grad: grad.card2, initial: "H", image: "/universities/heroes/ihu.svg", logo: "/universities/logos/ihu.svg", gallery: [],
    name: "Istanbul Health & Tech University", city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" }, type: { en: "Private", ar: "خاصة" },
    tuition: 4000, rating: 4.6, reviews: 198, ranking: 18, founded: 2018,
    studentsCount: "9,000+", intl: "2,100+", language: { en: "English", ar: "إنجليزي" },
    scholarship: 50,
    majors: [
      { name: { en: "Dentistry", ar: "طب الأسنان" }, fee: 12000, iconName: "Smile" },
      { name: { en: "Pharmacy", ar: "الصيدلة" }, fee: 8000, iconName: "Pill" },
      { name: { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" }, fee: 4200, iconName: "Cpu" },
    ],
    gpaReq: "75%+",
    docs: {
      en: ["High school diploma", "Passport copy", "Transcript", "Language certificate"],
      ar: ["شهادة الثانوية", "صورة جواز السفر", "كشف الدرجات", "شهادة لغة"],
    },
    about: {
      en: "A specialised health-sciences and technology campus with state-of-the-art labs and hospital partnerships across Istanbul.",
      ar: "حرم متخصص في العلوم الصحية والتكنولوجيا مزوّد بمختبرات حديثة وشراكات مع مستشفيات في إسطنبول.",
    },
    testimonials: [
      { name: "Ahmed, Morocco", text: { en: "The dentistry labs are better than I imagined.", ar: "مختبرات طب الأسنان أفضل مما تخيلت." }, rating: 5 },
    ],
  },
  {
    id: "aybu", grad: grad.card3, initial: "Y", image: "/universities/heroes/aybu.svg", logo: "/universities/logos/aybu.svg", gallery: [],
    name: "Ankara Yıldırım Beyazıt University", city: { en: "Ankara", ar: "أنقرة" },
    country: { en: "Türkiye", ar: "تركيا" }, type: { en: "Public", ar: "حكومية" },
    tuition: 1800, rating: 4.5, reviews: 260, ranking: 9, founded: 2010,
    studentsCount: "26,000+", intl: "3,000+", language: { en: "Turkish / English", ar: "تركي / إنجليزي" },
    scholarship: 100,
    majors: [
      { name: { en: "Engineering", ar: "الهندسة" }, fee: 2100, iconName: "Wrench" },
      { name: { en: "Medicine", ar: "الطب" }, fee: 6000, iconName: "Stethoscope" },
      { name: { en: "Business", ar: "إدارة الأعمال" }, fee: 1800, iconName: "Briefcase" },
    ],
    gpaReq: "65%+",
    docs: {
      en: ["High school diploma", "Passport copy", "Transcript"],
      ar: ["شهادة الثانوية", "صورة جواز السفر", "كشف الدرجات"],
    },
    about: {
      en: "A respected public university in the capital, offering some of Türkiye's most affordable tuition with full-ride scholarship tracks.",
      ar: "جامعة حكومية مرموقة في العاصمة، تقدّم رسومًا من الأرخص في تركيا مع مسارات منح كاملة.",
    },
    testimonials: [
      { name: "Salma, Algeria", text: { en: "Full scholarship changed my family's life.", ar: "المنحة الكاملة غيّرت حياة عائلتي." }, rating: 5 },
    ],
  },
  {
    id: "neu", grad: grad.card4, initial: "N", image: "/universities/heroes/neu.svg", logo: "/universities/logos/neu.svg", gallery: [],
    name: "Near East University", city: { en: "Nicosia", ar: "نيقوسيا" },
    country: { en: "N. Cyprus", ar: "قبرص الشمالية" }, type: { en: "Private", ar: "خاصة" },
    tuition: 3200, rating: 4.8, reviews: 401, ranking: 3, founded: 1988,
    studentsCount: "27,000+", intl: "18,000+", language: { en: "English", ar: "إنجليزي" },
    scholarship: 90,
    majors: [
      { name: { en: "Dentistry", ar: "طب الأسنان" }, fee: 11000, iconName: "Smile" },
      { name: { en: "Medicine", ar: "الطب" }, fee: 10500, iconName: "Stethoscope" },
      { name: { en: "Computer Engineering", ar: "هندسة الحاسوب" }, fee: 3600, iconName: "Code2" },
      { name: { en: "Architecture", ar: "العمارة" }, fee: 3400, iconName: "Building2" },
    ],
    gpaReq: "60%+",
    docs: {
      en: ["High school diploma", "Passport copy", "Transcript", "4 photos"],
      ar: ["شهادة الثانوية", "صورة جواز السفر", "كشف الدرجات", "4 صور شخصية"],
    },
    about: {
      en: "The largest university in Northern Cyprus, with one of the region's biggest international student communities and a dedicated MENA support office.",
      ar: "أكبر جامعة في قبرص الشمالية، وتضم واحدة من أكبر الجاليات الطلابية الدولية في المنطقة ومكتب دعم مخصص لطلاب الشرق الأوسط وشمال إفريقيا.",
    },
    testimonials: [
      { name: "Karim, Lebanon", text: { en: "Felt like home from day one — huge Arab community.", ar: "شعرت أنني في بلدي من اليوم الأول — جالية عربية كبيرة." }, rating: 5 },
      { name: "Nour, Palestine", text: { en: "The visa office handled my paperwork in days.", ar: "مكتب التأشيرات أنهى أوراقي خلال أيام." }, rating: 4 },
    ],
  },
  {
    id: "gau", grad: grad.card1, initial: "G", image: "/universities/heroes/gau.svg", logo: "/universities/logos/gau.svg", gallery: [],
    name: "Girne American University", city: { en: "Kyrenia", ar: "كيرينيا" },
    country: { en: "N. Cyprus", ar: "قبرص الشمالية" }, type: { en: "Private", ar: "خاصة" },
    tuition: 3000, rating: 4.4, reviews: 175, ranking: 6, founded: 1985,
    studentsCount: "12,000+", intl: "7,200+", language: { en: "English", ar: "إنجليزي" },
    scholarship: 70,
    majors: [
      { name: { en: "Business", ar: "إدارة الأعمال" }, fee: 2900, iconName: "Briefcase" },
      { name: { en: "Architecture", ar: "العمارة" }, fee: 3100, iconName: "Building2" },
      { name: { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" }, fee: 3300, iconName: "Cpu" },
    ],
    gpaReq: "60%+",
    docs: {
      en: ["High school diploma", "Passport copy", "Transcript"],
      ar: ["شهادة الثانوية", "صورة جواز السفر", "كشف الدرجات"],
    },
    about: {
      en: "A beachside campus in Kyrenia combining a relaxed Mediterranean lifestyle with career-driven programs and small class sizes.",
      ar: "حرم جامعي على الشاطئ في كيرينيا يجمع بين أسلوب حياة متوسطي هادئ وبرامج موجهة لسوق العمل وفصول صغيرة.",
    },
    testimonials: [
      { name: "Omar, Tunisia", text: { en: "Studying by the sea while building my career — dream setup.", ar: "أدرس بجانب البحر وأبني مستقبلي — إعداد أحلامي." }, rating: 4 },
    ],
  },
  {
    id: "istinye", grad: grad.card2, initial: "I", image: "/universities/heroes/istinye.svg", logo: "/universities/logos/istinye.svg", gallery: [],
    name: "Istinye University", city: { en: "Istanbul", ar: "إسطنبول" },
    country: { en: "Türkiye", ar: "تركيا" }, type: { en: "Private", ar: "خاصة" },
    tuition: 3800, rating: 4.7, reviews: 289, ranking: 8, founded: 2015,
    studentsCount: "15,000+", intl: "4,000+", language: { en: "English / Turkish", ar: "إنجليزي / تركي" },
    scholarship: 85,
    majors: [
      { name: { en: "Medicine", ar: "الطب" }, fee: 11500, iconName: "Stethoscope" },
      { name: { en: "Dentistry", ar: "طب الأسنان" }, fee: 10800, iconName: "Smile" },
      { name: { en: "Pharmacy", ar: "الصيدلة" }, fee: 7600, iconName: "Pill" },
    ],
    gpaReq: "70%+",
    docs: {
      en: ["High school diploma", "Passport copy", "Transcript", "Language certificate"],
      ar: ["شهادة الثانوية", "صورة جواز السفر", "كشف الدرجات", "شهادة لغة"],
    },
    about: {
      en: "Renowned for its medical school and teaching hospitals, Istinye blends rigorous academics with a vibrant Istanbul campus life.",
      ar: "تشتهر بكليتها الطبية ومستشفياتها التعليمية، وتجمع بين الصرامة الأكاديمية وحياة جامعية نابضة في إسطنبول.",
    },
    testimonials: [
      { name: "Dana, Iraq", text: { en: "Clinical training started in year one — incredible exposure.", ar: "التدريب السريري بدأ من السنة الأولى — خبرة رائعة." }, rating: 5 },
    ],
  },
];

export function getUniversityById(id) {
  return UNIVERSITIES.find((u) => u.id === id);
}
