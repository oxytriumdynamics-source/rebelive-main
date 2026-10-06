export interface ProductBenefit {
  title: string;
  desc: string;
}

export interface NutritionFact {
  label: string;
  amount: string;
  dailyValue?: string;
}

export interface TastingNoteItem {
  name: string;
  note: string;
}

export interface GalleryItem {
  id: string;
  label: string;
  src: string;
  type: 'render' | 'wrap' | 'logo' | 'mood';
}

export interface Product {
  id: string;
  name: string;
  displayTitle: string;
  flavor: string;
  tagline: string;
  description: string;
  story?: string;
  volume: string;
  sugar: string;
  caffeine: string;
  calories: string;
  notes: string[];
  tastingNotesDetailed?: TastingNoteItem[];
  model: string;
  /** Path to the authentic flat can wrap design image */
  canImage: string;
  /** Authentic 3D can render image */
  image: string;
  renderImage?: string;
  /** Brand identity logo & motif artwork */
  brandLogo: string;
  /** Full-page flavor themed background image */
  bgImage: string;
  bgGradient: string;
  primaryTone: string;
  /** Accent color used for atmospheric glow & UI highlights */
  accentHex: string;
  rating?: {
    score: number;
    count: number;
  };
  benefits?: ProductBenefit[];
  nutrition?: NutritionFact[];
  gallery?: GalleryItem[];
  specs: {
    ph: string;
    taurine: string;
    carbonation: string;
    batch: string;
    dimensions?: string;
  };
}

export type PackSize = 3 | 6 | 9 | 12;

export const PRICES: Record<PackSize, { price: number; mrp: number; perCan: number; discount: string }> = {
  3: { price: 449, mrp: 499, perCan: 150, discount: '10% OFF' },
  6: { price: 799, mrp: 950, perCan: 133, discount: '16% OFF' },
  9: { price: 1149, mrp: 1399, perCan: 128, discount: '18% OFF' },
  12: { price: 1499, mrp: 1800, perCan: 125, discount: '17% OFF' },
};

export const PRODUCTS: Product[] = [
  {
    id: 'apex',
    name: 'APEX',
    displayTitle: 'APEX',
    flavor: 'Apex',
    tagline: 'FUNCTIONAL BEVERAGE',
    description:
      'Rebelive functional beverage is a zero-added-sugar functional beverage crafted to support sustained energy, focus, stress management, hydration, and gut health. Powered by natural caffeine, L-theanine, Ashwagandha, magnesium, electrolytes, vitamins, prebiotics, and probiotics, it’s designed to help you stay energized, balanced, and ready for whatever comes next.',
    story:
      'Engineered in the obsidian lab series, APEX merges cold-pressed Japanese Yuzu with sun-cured black lime and Korean Red Ginseng. Designed for rapid cognitive activation without the neuro-jitters of synthetic caffeine.',
    volume: '250 ML',
    sugar: 'ZERO SUGAR',
    caffeine: '160 MG',
    calories: '5 KCAL',
    notes: ['COLD YUZU', 'BLACK LIME', 'TAURINE 1000MG', 'KOREAN GINSENG'],
    tastingNotesDetailed: [
      { name: 'Cold-Pressed Yuzu', note: 'Zesty mountain citrus with crisp upfront brightness' },
      { name: 'Black Sun Lime', note: 'Deep mineral undertone with dry obsidian finish' },
      { name: 'Taurine Matrix', note: '1,000mg amino matrix supporting sustained neuro-output' },
      { name: 'Panax Ginseng', note: 'Cellular endurance adaptogen for clean flow states' },
    ],
    model: '/models/soda-can.glb',
    canImage: '/brand/apex-can.webp',
    image: '/products/apex.png',
    renderImage: '/products/apex.png',
    brandLogo: '/brand/APEX.png',
    bgImage: '/brand/APEX-BG.png',
    bgGradient:
      'radial-gradient(ellipse at 50% 45%, rgba(40,40,40,0.45) 0%, rgba(10,10,10,0.9) 65%, #000000 100%)',
    primaryTone: '#E0E0E0',
    accentHex: '#10B981', // subtle emerald/obsidian electric
    rating: {
      score: 4.9,
      count: 438,
    },
    benefits: [
      { title: 'Razor Cognitive Drive', desc: '160mg natural caffeine paired with L-theanine for jitter-free clarity.' },
      { title: 'Zero Glycemic Spikes', desc: 'Naturally sweetened, 0g sugar, 0 sugar alcohol crash.' },
      { title: 'Electrolyte Micro-Matrix', desc: 'Hydrates high-output neural pathways during deep work.' },
      { title: 'Pure Bio-Extraction', desc: 'No artificial colorants, no petrochemical additives, pure lab grade.' },
    ],
    nutrition: [
      { label: 'Serving Size', amount: '1 Can (250ml)' },
      { label: 'Energy / Calories', amount: '5 kcal' },
      { label: 'Total Carbohydrates', amount: '0 g', dailyValue: '0%' },
      { label: 'Total Sugars', amount: '0 g', dailyValue: '0%' },
      { label: 'Natural Caffeine', amount: '160 mg' },
      { label: 'Taurine Pure Grade', amount: '1,000 mg' },
      { label: 'Korean Ginseng Extract', amount: '100 mg' },
      { label: 'Vitamin B3 (Niacinamide)', amount: '16 mg', dailyValue: '100%' },
      { label: 'Vitamin B6 (Pyridoxine)', amount: '1.7 mg', dailyValue: '100%' },
      { label: 'Vitamin B12 (Cobalamin)', amount: '2.4 mcg', dailyValue: '100%' },
      { label: 'Sodium (Electrolytes)', amount: '48 mg', dailyValue: '2%' },
      { label: 'Potassium Matrix', amount: '65 mg', dailyValue: '2%' },
    ],
    gallery: [
      { id: 'render', label: '3D Studio Render', src: '/products/apex.png', type: 'render' },
      { id: 'clean', label: 'Clean Silhouette', src: '/products/apex-clean.png', type: 'render' },
      { id: 'wrap', label: '360° Aluminum Wrap', src: '/brand/apex-can.webp', type: 'wrap' },
      { id: 'perspective', label: 'Lab Perspective', src: '/products/apex.jpg', type: 'mood' },
      { id: 'logo', label: 'Emblem Artwork', src: '/brand/APEX.png', type: 'logo' },
      { id: 'mood', label: 'Atmosphere Visual', src: '/brand/APEX-BG.png', type: 'mood' },
    ],
    specs: {
      ph: '3.4 PH',
      taurine: '1000 MG',
      carbonation: '3.8 VOL',
      batch: 'SERIES 01 // APEX-LAB',
      dimensions: '134 MM × 53.4 MM',
    },
  },
  {
    id: 'aviva',
    name: 'AVIVA',
    displayTitle: 'AVIVA',
    flavor: 'Aviva',
    tagline: 'FUNCTIONAL BEVERAGE',
    description:
      'Rebelive functional beverage is a zero-added-sugar functional beverage crafted to support sustained energy, focus, stress management, hydration, and gut health. Powered by natural caffeine, L-theanine, Ashwagandha, magnesium, electrolytes, vitamins, prebiotics, and probiotics, it’s designed to help you stay energized, balanced, and ready for whatever comes next.',
    story:
      'Formulated with imperial lychee blossom notes, white tea flavonoids, and pure Himalayan mineral salts. AVIVA delivers euphoric focus calibrated for endurance creators, athletes, and midnight builders.',
    volume: '250 ML',
    sugar: 'ZERO SUGAR',
    caffeine: '160 MG',
    calories: '5 KCAL',
    notes: ['IMPERIAL LYCHEE', 'WHITE TEA', 'L-THEANINE 200MG', 'PURE ELECTROLYTES'],
    tastingNotesDetailed: [
      { name: 'Imperial Lychee', note: 'Aromatic sweet floral top notes with zero artificial aftertaste' },
      { name: 'White Tea Essence', note: 'Silky botanical palate cleanser with antioxidant polyphenol' },
      { name: 'L-Theanine 200mg', note: 'Calming alpha-wave enhancer promoting zen-like precision' },
      { name: 'Himalayan Salts', note: 'Ionic trace minerals supporting rapid cellular rehydration' },
    ],
    model: '/models/soda-can.glb',
    canImage: '/brand/aviva-can.webp',
    image: '/products/aviva.png',
    renderImage: '/products/aviva.png',
    brandLogo: '/brand/Aviva.png',
    bgImage: '/brand/AVIVA-BG.png',
    bgGradient:
      'radial-gradient(ellipse at 50% 45%, rgba(75,75,75,0.55) 0%, rgba(22,22,22,0.9) 65%, #080808 100%)',
    primaryTone: '#FFFFFF',
    accentHex: '#F43F5E', // rose lychee electric
    rating: {
      score: 4.95,
      count: 512,
    },
    benefits: [
      { title: 'Alpha Brainwave Boost', desc: '200mg L-Theanine paired synergistically with 160mg natural caffeine.' },
      { title: 'Zero Sugar Guilt', desc: 'Zero glycemic impact, zero sugar hangover, refreshing aftertaste.' },
      { title: 'Hydration Recovery', desc: 'Active ionic electrolytes replenishing fluids lost during intense sessions.' },
      { title: 'Clinical Cold Extraction', desc: 'Retains all delicate tropical bioactives without heat degradation.' },
    ],
    nutrition: [
      { label: 'Serving Size', amount: '1 Can (250ml)' },
      { label: 'Energy / Calories', amount: '5 kcal' },
      { label: 'Total Carbohydrates', amount: '0 g', dailyValue: '0%' },
      { label: 'Total Sugars', amount: '0 g', dailyValue: '0%' },
      { label: 'Natural Caffeine', amount: '160 mg' },
      { label: 'L-Theanine Pharma Grade', amount: '200 mg' },
      { label: 'Taurine', amount: '1,000 mg' },
      { label: 'Vitamin B3 (Niacinamide)', amount: '16 mg', dailyValue: '100%' },
      { label: 'Vitamin B6 (Pyridoxine)', amount: '1.7 mg', dailyValue: '100%' },
      { label: 'Vitamin B12 (Cobalamin)', amount: '2.4 mcg', dailyValue: '100%' },
      { label: 'Sodium (Electrolytes)', amount: '45 mg', dailyValue: '2%' },
      { label: 'Potassium Matrix', amount: '60 mg', dailyValue: '2%' },
    ],
    gallery: [
      { id: 'render', label: '3D Studio Render', src: '/products/aviva.png', type: 'render' },
      { id: 'clean', label: 'Clean Silhouette', src: '/products/aviva-clean.png', type: 'render' },
      { id: 'wrap', label: '360° Aluminum Wrap', src: '/brand/aviva-can.webp', type: 'wrap' },
      { id: 'perspective', label: 'Botanical Perspective', src: '/products/aviva.jpg', type: 'mood' },
      { id: 'logo', label: 'Emblem Artwork', src: '/brand/Aviva.png', type: 'logo' },
      { id: 'mood', label: 'Atmosphere Visual', src: '/brand/AVIVA-BG.png', type: 'mood' },
    ],
    specs: {
      ph: '3.6 PH',
      taurine: '1000 MG',
      carbonation: '3.9 VOL',
      batch: 'SERIES 02 // AVIVA-CORP',
      dimensions: '134 MM × 53.4 MM',
    },
  },
  {
    id: 'capella',
    name: 'CAPELLA',
    displayTitle: 'CAPELLA',
    flavor: 'Capella',
    tagline: 'FUNCTIONAL BEVERAGE',
    description:
      'Rebelive functional beverage is a zero-added-sugar functional beverage crafted to support sustained energy, focus, stress management, hydration, and gut health. Powered by natural caffeine, L-theanine, Ashwagandha, magnesium, electrolytes, vitamins, prebiotics, and probiotics, it’s designed to help you stay energized, balanced, and ready for whatever comes next.',
    story:
      'Inspired by the sub-zero arctic night, CAPELLA fuses wild Nordic lingonberry, dark blackberry, and arctic juniper with 180mg high-potency caffeine and magnesium chelate for supreme reflex speed.',
    volume: '250 ML',
    sugar: 'ZERO SUGAR',
    caffeine: '180 MG',
    calories: '5 KCAL',
    notes: ['NORDIC BERRY', 'WILD JUNIPER', 'CITRULLINE MALATE', 'MAGNESIUM CHELATE'],
    tastingNotesDetailed: [
      { name: 'Arctic Wild Berry', note: 'Deep, mysterious tart berry body with icy crisp sparkle' },
      { name: 'Sub-Zero Juniper', note: 'Aromatic pine botanical top notes delivering instant cooling freshness' },
      { name: 'Citrulline Malate', note: 'Enhances nitric oxide output and vascular oxygen transport' },
      { name: 'Magnesium Chelate', note: 'Neuro-muscular firing optimization preventing muscle fatigue' },
    ],
    model: '/models/soda-can.glb',
    canImage: '/brand/capella-can.webp',
    image: '/products/capella.png',
    renderImage: '/products/capella.png',
    brandLogo: '/brand/Capella.png',
    bgImage: '/brand/CAPELLA-BG.png',
    bgGradient:
      'radial-gradient(ellipse at 50% 45%, rgba(55,55,55,0.5) 0%, rgba(16,16,16,0.9) 65%, #050505 100%)',
    primaryTone: '#D4D4D4',
    accentHex: '#38BDF8', // arctic cyan / midnight electric
    rating: {
      score: 4.92,
      count: 395,
    },
    benefits: [
      { title: 'Maximum Output 180mg', desc: 'Highest clean caffeine concentration in the Rebelive fleet.' },
      { title: 'Vascular Nitric Flow', desc: 'Citrulline malate assists arterial elasticity and blood oxygenation.' },
      { title: 'Deep Neuromuscular Reset', desc: 'Magnesium chelate keeps nervous system firing in sync under pressure.' },
      { title: '100% Zero Sugar', desc: 'Sustained peak energy with zero crash or blood sugar dip.' },
    ],
    nutrition: [
      { label: 'Serving Size', amount: '1 Can (250ml)' },
      { label: 'Energy / Calories', amount: '5 kcal' },
      { label: 'Total Carbohydrates', amount: '0 g', dailyValue: '0%' },
      { label: 'Total Sugars', amount: '0 g', dailyValue: '0%' },
      { label: 'Natural Caffeine', amount: '180 mg' },
      { label: 'Taurine Pure Grade', amount: '1,200 mg' },
      { label: 'Citrulline Malate', amount: '250 mg' },
      { label: 'Magnesium Chelate', amount: '45 mg', dailyValue: '12%' },
      { label: 'Vitamin B3 (Niacinamide)', amount: '16 mg', dailyValue: '100%' },
      { label: 'Vitamin B6 (Pyridoxine)', amount: '1.7 mg', dailyValue: '100%' },
      { label: 'Vitamin B12 (Cobalamin)', amount: '2.4 mcg', dailyValue: '100%' },
      { label: 'Sodium (Electrolytes)', amount: '50 mg', dailyValue: '2%' },
    ],
    gallery: [
      { id: 'render', label: '3D Studio Render', src: '/products/capella.png', type: 'render' },
      { id: 'clean', label: 'Clean Silhouette', src: '/products/capella-clean.png', type: 'render' },
      { id: 'wrap', label: '360° Aluminum Wrap', src: '/brand/capella-can.webp', type: 'wrap' },
      { id: 'perspective', label: 'Arctic Perspective', src: '/products/capella.jpg', type: 'mood' },
      { id: 'logo', label: 'Emblem Artwork', src: '/brand/Capella.png', type: 'logo' },
      { id: 'mood', label: 'Atmosphere Visual', src: '/brand/CAPELLA-BG.png', type: 'mood' },
    ],
    specs: {
      ph: '3.3 PH',
      taurine: '1200 MG',
      carbonation: '4.1 VOL',
      batch: 'SERIES 03 // CAPELLA-ARCTIC',
      dimensions: '134 MM × 53.4 MM',
    },
  },
];

export const VARIETY_BUNDLE: Product = {
  id: 'variety',
  name: 'THE REBEL TRIO',
  displayTitle: 'TRIO PACK',
  flavor: 'APEX + AVIVA + CAPELLA',
  tagline: 'ALL 3 FLAGSHIP FLAVOURS IN ONE HIGH-CALIBER CRATE',
  description:
    'Equal parts APEX (Dark Citrus), AVIVA (Exotic Lychee), and CAPELLA (Midnight Berry). The ultimate bio-energy allocation.',
  story:
    'Experience the complete spectrum of REBELIVE engineering. Every crate delivers 4 cans of APEX for razor sharpness, 4 cans of AVIVA for calm clarity, and 4 cans of CAPELLA for unbridled midnight intensity.',
  volume: '250 ML ',
  sugar: 'ZERO SUGAR',
  caffeine: '160–180 MG',
  calories: '5 KCAL',
  notes: ['4× APEX CITRUS', '4× AVIVA LYCHEE', '4× CAPELLA BERRY'],
  tastingNotesDetailed: [
    { name: '4× APEX (Citrus)', note: 'Japanese Yuzu & Black Lime obsidian punch' },
    { name: '4× AVIVA (Lychee)', note: 'Exotic imperial lychee with soothing white tea' },
    { name: '4× CAPELLA (Berry)', note: 'Dark arctic lingonberry & sub-zero juniper' },
    { name: 'The Complete Trifecta', note: 'Calibrated for all phases of high-performance work & life' },
  ],
  model: '/models/soda-can.glb',
  canImage: '/products/apex.png',
  image: '/products/apex.png',
  renderImage: '/products/apex.png',
  brandLogo: '/brand/panther_white_icon-transparent.png',
  bgImage: '/brand/fuji.png',
  bgGradient:
    'radial-gradient(ellipse at 50% 45%, rgba(60,60,60,0.5) 0%, rgba(15,15,15,0.9) 65%, #050505 100%)',
  primaryTone: '#FFFFFF',
  accentHex: '#EAB308', // amber / gold trio electric
  rating: {
    score: 4.98,
    count: 780,
  },
  benefits: [
    { title: 'Complete Formula Access', desc: 'Rotate between Apex, Aviva, and Capella depending on your daily cognitive demands.' },
    { title: 'Best Value Allocation', desc: 'Maximum savings per can with full laboratory diversity.' },
    { title: 'Zero Sugar Standard', desc: 'All 3 flavors maintain zero sugar, 5 calories, and bio-available electrolytes.' },
    { title: 'Reinforced Cold Pack Crate', desc: 'Shipped Pan-India in temperature-insulating heavy duty packaging.' },
  ],
  nutrition: [
    { label: 'Serving Size', amount: '1 Can (250ml)' },
    { label: 'Total Cans Included', amount: '12 Cans (or 24 Cans in Double Crate)' },
    { label: 'Apex Breakdown', amount: '4 Cans (Citrus, 160mg Caffeine)' },
    { label: 'Aviva Breakdown', amount: '4 Cans (Lychee, 160mg Caffeine)' },
    { label: 'Capella Breakdown', amount: '4 Cans (Berry, 180mg Caffeine)' },
    { label: 'Sugar Across All', amount: '0g (Zero Glycemic Index)' },
    { label: 'Calories Per Can', amount: '5 kcal' },
  ],
  gallery: [
    { id: 'render', label: 'Trio Flagship Cluster', src: '/products/apex.png', type: 'render' },
    { id: 'apex-can', label: 'Apex Citrus Can', src: '/products/apex-clean.png', type: 'render' },
    { id: 'aviva-can', label: 'Aviva Lychee Can', src: '/products/aviva-clean.png', type: 'render' },
    { id: 'capella-can', label: 'Capella Berry Can', src: '/products/capella-clean.png', type: 'render' },
    { id: 'apex-wrap', label: 'Apex 360° Wrap', src: '/brand/apex-can.webp', type: 'wrap' },
    { id: 'aviva-wrap', label: 'Aviva 360° Wrap', src: '/brand/aviva-can.webp', type: 'wrap' },
    { id: 'capella-wrap', label: 'Capella 360° Wrap', src: '/brand/capella-can.webp', type: 'wrap' },
    { id: 'fuji-mood', label: 'Alpine Atmosphere', src: '/brand/fuji.png', type: 'mood' },
  ],
  specs: {
    ph: '3.3–3.6 PH',
    taurine: '1000–1200 MG',
    carbonation: '3.8–4.1 VOL',
    batch: 'SERIES TRIO // MASTER-ALLOCATION',
  },
};

export const ALL_PRODUCTS: Product[] = [
  ...PRODUCTS,
  VARIETY_BUNDLE,
];

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id.toLowerCase() === id.toLowerCase());
}
