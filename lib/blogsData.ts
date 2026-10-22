import { AdminBlog } from './adminApi';

export const BLOG_CATEGORIES = [
  'Energy & Science',
  'Nutrition',
  'Mind & Focus',
  'Gut Health',
  'Rebel Mindset',
  'Inside Rebelive',
] as const;

export type BlogCategoryName = (typeof BLOG_CATEGORIES)[number];

export const CATEGORY_ALIASES: Record<string, string[]> = {
  'Energy & Science': [
    'energy & science',
    'Energy Drinks & science',
    'energy and science',
    'Energy Drinks and science',
    'Energy Drinks',
    'science',
    'clean energy',
  ],
  'Nutrition': [
    'nutrition',
    'nutrition & ingredients',
    'nutrition and ingredients',
    'hydration & performance',
    'hydration and performance',
    'hydration',
    'electrolytes',
    'ingredients',
  ],
  'Mind & Focus': [
    'mind & focus',
    'mind and focus',
    'focus',
    'optimization & sleep',
    'optimization and sleep',
    'mind',
    'sleep',
    'circadian',
    'cognitive',
  ],
  'Gut Health': [
    'gut health',
    'gut',
    'microbiome',
    'digestion',
    'gut health & immunity',
  ],
  'Rebel Mindset': [
    'rebel mindset',
    'mindset',
    'rebel',
    'performance mindset',
    'discipline',
  ],
  'Inside Rebelive': [
    'inside rebelive',
    'brand story & culture',
    'brand story',
    'culture',
    'inside story',
    'behind the scenes',
    'lab dispatches',
  ],
};

export function isCategoryMatch(
  blogCategory?: string | null,
  blogTags?: string[],
  selectedCategory?: string
): boolean {
  if (!selectedCategory || selectedCategory === 'ALL') return true;
  if (!blogCategory && (!blogTags || blogTags.length === 0)) return false;

  const bCat = (blogCategory || '').toLowerCase().trim();
  const sCat = selectedCategory.toLowerCase().trim();

  // Exact direct match
  if (bCat === sCat) return true;

  // Check category alias dictionary
  const aliases = CATEGORY_ALIASES[selectedCategory];
  if (aliases) {
    if (
      aliases.some(
        (alias) =>
          bCat === alias ||
          bCat.includes(alias) ||
          alias.includes(bCat)
      )
    ) {
      return true;
    }

    // Check tags if category didn't match directly
    if (blogTags && blogTags.length > 0) {
      const lowerTags = blogTags.map((t) => t.toLowerCase().trim());
      if (
        aliases.some((alias) =>
          lowerTags.some((tag) => tag === alias || tag.includes(alias) || alias.includes(tag))
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

export const FALLBACK_BLOGS: AdminBlog[] = [
  {
    id: 'blog-energy-science',
    slug: 'science-of-clean-Energy Drinks-nootropics',
    title: 'The Science of Clean Energy Drinks: Why Traditional Energy Drinks Crash and How Nootropics Redefine Focus',
    excerpt: 'Explore how neurotransmitter signaling, zero refined sugars, and precision nootropic stacks deliver sustained cognitive drive without the dreaded 2 PM crash.',
    coverImage: '/brand/APEX.webp',
    author: 'Dr. Marcus Vance',
    authorRole: 'Head of Bio-Nutrient Formulation',
    authorAvatar: '/brand/panther_white_icon-transparent.webp',
    category: 'Energy & Science',
    tags: ['Energy Drinks', 'Nootropics', 'Clean Caffeine', 'Cognitive Focus'],
    readTime: '5 min read',
    isPublished: true,
    featured: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `
<h2>The Crash Dilemma: Deconstructing Old-Guard Energy</h2>
<p>For more than two decades, the global energy drink market has been dominated by a singular, fundamentally flawed formulation: hyper-concentrated synthetic caffeine dissolved in up to 30 grams of high-fructose corn syrup or refined sugars. While this triggers an immediate surge of blood glucose and epinephrine, the physiological cost is catastrophic.</p>
<p>When high doses of sugar flood the bloodstream, your pancreas pumps out a massive wave of insulin to clear the excess glucose. The resultant rebound hypoglycemia—colloquially termed the <strong>"2 PM Crash"</strong>—leaves your brain starving for metabolic fuel, causing brain fog, jitteriness, and acute fatigue.</p>
<h2>Enter Precision Energy Drinks: The Nootropic Matrix</h2>
<p>At <strong>REBELIVE</strong>, we set out to construct an alternative from first principles. Rather than shocking the adrenal glands with synthetic stimulants, our formula utilizes a synergistic ratio of natural caffeine, purified L-Theanine, and functional B-vitamin complexes.</p>
<ul>
  <li><strong>Zero Sugar Formulation:</strong> Eliminates rebound glycemic drops and systemic inflammation.</li>
  <li><strong>Sustained Plasma Curves:</strong> Natural caffeine absorption is smoothed over a 4 to 6 hour plateau.</li>
  <li><strong>Clean Aftertaste:</strong> Crafted with crisp botanicals and zero artificial chemical residue.</li>
</ul>
    `.trim(),
  },
  {
    id: 'blog-nutrition',
    slug: 'cellular-hydration-electrolytes-endurance',
    title: 'Hydration at the Cellular Level: The Critical Role of Electrolytes in High-Performance Living',
    excerpt: 'Why drinking plain water isn’t enough when pushing your boundaries. How ionic osmolytes maintain neuromuscular velocity.',
    coverImage: '/brand/Aviva.webp',
    author: 'Elena Rostova',
    authorRole: 'Director of Performance Athletics',
    authorAvatar: '/brand/panther_white_icon-transparent.webp',
    category: 'Nutrition',
    tags: ['Hydration', 'Electrolytes', 'Nutrition', 'Performance', 'Endurance'],
    readTime: '4 min read',
    isPublished: true,
    featured: false,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `
<h2>Why Drinking Plain Water Is Only Half the Equation</h2>
<p>We are told from childhood to drink eight glasses of water a day. Yet endurance athletes, high-output executives, and relentless creators frequently report afternoon sluggishness and persistent headaches despite guzzling liters of purified water.</p>
<p>The explanation lies in a physiological reality: <strong>hyponatremic dilution</strong>. When you sweat or expend heavy mental energy, you do not simply lose H2O—you excrete critical electrolytes including sodium ($Na^+$), potassium ($K^+$), and magnesium ($Mg^{2+}$).</p>
<h3>Key Mineral Co-Factors in REBELIVE:</h3>
<ul>
  <li><strong>Ionic Sodium:</strong> Regulates extracellular fluid volume and prevents muscle cramps.</li>
  <li><strong>Potassium Citrate:</strong> Buffers metabolic acidity and facilitates smooth cardiac rhythm.</li>
  <li><strong>Chelated Magnesium:</strong> Vital for over 300 enzymatic reactions, including direct ATP synthesis.</li>
</ul>
    `.trim(),
  },
  {
    id: 'blog-mind-focus',
    slug: 'circadian-caffeine-timing-for-peak-clarity',
    title: 'The Circadian Protocol: Precision Caffeine Timing for Peak Clarity Without Disrupting Deep Sleep',
    excerpt: 'Master the half-life of methylxanthines. Learn when to dose clean caffeine to synchronize with your body’s cortisol curve.',
    coverImage: '/brand/Capella.webp',
    author: 'Kaelen Thorne',
    authorRole: 'Sleep & Human Optimization Specialist',
    authorAvatar: '/brand/panther_white_icon-transparent.webp',
    category: 'Mind & Focus',
    tags: ['Caffeine Timing', 'Circadian Rhythm', 'Mind & Focus', 'Deep Sleep', 'Focus'],
    readTime: '4 min read',
    isPublished: true,
    featured: false,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `
<h2>The 90-Minute Morning Golden Window</h2>
<p>Most people stumble out of bed and immediately reach for a stimulant. Delaying your first caffeine intake by 90 to 120 minutes post-waking allows your adenosine receptors to naturally clear endogenous adenosine buildup from sleep before competitive antagonism begins.</p>
<h2>The REBELIVE Framework:</h2>
<ul>
  <li><strong>First Can:</strong> 10:00 AM – 11:30 AM (Peak morning cognitive workload).</li>
  <li><strong>Midday Renewal:</strong> 1:30 PM – 2:30 PM (Pre-training or afternoon strategic sprint).</li>
  <li><strong>Stimulant Cutoff:</strong> 3:00 PM – Ensure full clearance before nightfall.</li>
</ul>
    `.trim(),
  },
  {
    id: 'blog-gut-health',
    slug: 'microbiome-axis-gut-health-and-athletic-drive',
    title: 'The Gut-Brain Axis: How Microbiome Health Directs Daily Cognitive Drive and Immunity',
    excerpt: 'Uncovering the biological cross-talk between beneficial intestinal flora and neurotransmitter production for sustained daytime vigor.',
    coverImage: '/brand/DSCF8117.webp',
    author: 'Dr. Soraya Lin',
    authorRole: 'Microbiome Researcher',
    authorAvatar: '/brand/panther_white_icon-transparent.webp',
    category: 'Gut Health',
    tags: ['Gut Health', 'Microbiome', 'Energy Drinks', 'Cognitive Drive', 'Immunity'],
    readTime: '5 min read',
    isPublished: true,
    featured: false,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `
<h2>The Second Brain in Your Abdomen</h2>
<p>Over 90% of your body’s serotonin and roughly 50% of its dopamine are synthesized in the enteric nervous system, regulated directly by your gut microbiota. When your microbiome is assaulted by artificial sweeteners, emulsifiers, and processed additives, cellular inflammation triggers sluggish cognitive reflexes and systemic fatigue.</p>
<p>Clean formulation means honoring the digestive tract. By eliminating harsh synthetic dyes and chemical preservatives, REBELIVE protects your delicate gastrointestinal lining while providing cellular hydration that promotes smooth, steady nutrient absorption.</p>
    `.trim(),
  },
  {
    id: 'blog-rebel-mindset',
    slug: 'the-rebel-mindset-defying-conventional-beverage-standards',
    title: 'The Rebel Mindset: Why We Refused to Conform to the Beverage Industry Playbook',
    excerpt: 'The story behind REBELIVE’s founding: ditching artificial dyes, cutting out the middlemen, and engineering what real performers demanded.',
    coverImage: '/brand/APEX.webp',
    author: 'Oxytrium Dynamics Founder',
    authorRole: 'Founding Team',
    authorAvatar: '/brand/panther_white_icon-transparent.webp',
    category: 'Rebel Mindset',
    tags: ['Rebel Mindset', 'Founders Story', 'Innovation', 'Zero Sugar'],
    readTime: '6 min read',
    isPublished: true,
    featured: false,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `
<h2>The Legacy Beverage Monopoly Was Broken</h2>
<p>Look at the ingredients label on the typical supermarket shelf beverage. You will find artificial food coloring (Red 40, Yellow 5), chemical preservatives like sodium benzoate, synthetic sweeteners that upset the gut microbiome, and empty promises printed on metallic foil.</p>
<p>When we founded <strong>REBELIVE</strong> under the Oxytrium Dynamics banner, our mission wasn't to build another commodity can. It was to forge an uncompromising tool for creators, lifters, builders, and thinkers who demand pure biological leverage.</p>
    `.trim(),
  },
  {
    id: 'blog-inside-rebelive',
    slug: 'inside-rebelive-origins-clean-label-engineering',
    title: 'Inside Rebelive: Formulating Clean High-Performance Energy from First Principles',
    excerpt: 'A behind-the-scenes look into our testing labs, ingredient sourcing protocols, and the relentless pursuit of zero-compromise fuel.',
    coverImage: '/brand/Capella.webp',
    author: 'Rebelive R&D Lab',
    authorRole: 'Product Architecture',
    authorAvatar: '/brand/panther_white_icon-transparent.webp',
    category: 'Inside Rebelive',
    tags: ['Inside Rebelive', 'Brand Story', 'Laboratory', 'Quality', 'Performance'],
    readTime: '5 min read',
    isPublished: true,
    featured: false,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `
<h2>Engineering from First Principles</h2>
<p>Most canned beverage brands outsource their formulation to white-label flavour houses that reuse identical sugary bases. At REBELIVE, every ingredient ratio was designed in-house from ground zero.</p>
<p>We systematically stress-tested active nootropics alongside ionic mineral salts to ensure that the mouthfeel, carbonation bite, and sustained cognitive boost delivered an unrivaled sensory and neuro-performance experience.</p>
    `.trim(),
  },
];
