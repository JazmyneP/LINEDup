import { useState, useRef } from "react";

// ─── CUT RECOMMENDATION ENGINE ───────────────────────────────────────────────
// This runs locally — no network call needed. It reads the quiz answers and
// picks the right cut based on hair type, face shape, and style goal keywords.

function generateCutResult(answers) {
  const hair  = (answers.hair_type  || "").toLowerCase();
  const face  = (answers.face_shape || "").toLowerCase();
  const goal  = (answers.style_goal || "").toLowerCase();
  const extra = (answers.extra      || "").toLowerCase();
  const all   = `${hair} ${face} ${goal} ${extra}`;

  // ── Locs / natural coily ──────────────────────────────────────────────────
  if (/loc|dread/.test(hair)) {
    return {
      recommended_cut: "Loc Retwist & Shape",
      why_it_works: "Your locs need regular retwisting to keep new growth tight and your part lines clean. A shape-up around the hairline will frame your face and keep everything looking intentional, not overgrown.",
      how_to_ask: "I need a full retwist, palm-roll technique, and a clean shape-up on my hairline and edges. Keep the length.",
      barber_specialty: "Loc technician or natural hair specialist",
      maintenance: "Come back every 4–6 weeks for retwist. Between visits, moisturize with a light loc oil and sleep with a satin cap.",
      pro_tip: "Ask your barber to retwist in the direction your locs naturally want to turn — forcing the opposite direction causes slippage and thinning over time.",
      vibe: "Natural",
      match_keywords: ["locs", "natural hair"]
    };
  }

  // ── Waves ─────────────────────────────────────────────────────────────────
  if (/wave|360|brush/.test(hair)) {
    return {
      recommended_cut: "360 Wave Taper",
      why_it_works: "A tight taper on the sides and back keeps your wave pattern visible and sharp without breaking the flow. The length on top stays long enough to maintain your 360 pattern.",
      how_to_ask: "I want a taper fade on the sides and back — skin or 1 at the bottom, blending up to a 2 or 3. Don't cut the top, just clean up my edges and part.",
      barber_specialty: "Barber who understands wave patterns and grain direction",
      maintenance: "Come back every 2–3 weeks. Brush 2–3 times daily, always with your grain. Sleep with a durag every night — silk or satin only.",
      pro_tip: "Tell your barber to cut with the grain on top, never against it. Cutting against your wave pattern will set you back weeks.",
      vibe: "Smooth",
      match_keywords: ["waves", "tapers"]
    };
  }

  // ── 4c / coily / tight natural ────────────────────────────────────────────
  if (/4c|4b|coil|coily|tight curl|afro|twa/.test(hair)) {
    const wantsFade = /fade|fresh|clean|low|taper/.test(goal);
    if (wantsFade) {
      return {
        recommended_cut: "High-Top Fade or Burst Fade with Natural Top",
        why_it_works: "Your coily texture is a statement on its own — a clean fade underneath lifts it and makes it look intentional and bold. Works with any face shape by adding vertical height.",
        how_to_ask: "I want my natural texture left on top, shaped into a clean rounded or squared silhouette. Fade the sides — skin or 1 guard at the bottom blending up. Clean up my lineup sharp.",
        barber_specialty: "Barber with experience in natural/coily hair and fades",
        maintenance: "Shape-up every 2–3 weeks. Moisturize daily with a leave-in cream. Stretch with a blow dryer on low heat before your appointment so your barber can see the true length.",
        pro_tip: "Come in with your hair moisturized and stretched, not shrunken — your barber can't cut a clean shape on dry, shrunken coils.",
        vibe: "Bold",
        match_keywords: ["fades", "natural", "textured"]
      };
    }
    return {
      recommended_cut: "Tapered Natural / TWA (Teeny Weeny Afro)",
      why_it_works: "A tapered natural keeps your coily texture at the center of the look while the fade gives it structure and definition. Low maintenance and versatile.",
      how_to_ask: "I want my natural texture on top, tapered on the sides — not a hard fade, more of a soft blend from a 2 up to my natural hair. Keep the top round and even.",
      barber_specialty: "Natural hair barber or stylist comfortable with coily textures",
      maintenance: "Every 3–4 weeks for a shape-up. Daily moisture is everything — use the LOC method (liquid, oil, cream) to keep shrinkage manageable.",
      pro_tip: "A light twist-out or wash-and-go before your appointment shows your barber your curl pattern at its best — helps them cut a more accurate shape.",
      vibe: "Natural",
      match_keywords: ["natural", "tapers", "textured"]
    };
  }

  // ── Curly (type 2–3) ──────────────────────────────────────────────────────
  if (/curl|curly|wavy|type 2|type 3|ringlet|coil/.test(hair)) {
    const wantsClean = /clean|professional|work|interview|low/.test(all);
    if (wantsClean) {
      return {
        recommended_cut: "Textured Crop with Disconnected Undercut",
        why_it_works: "The undercut removes bulk from the sides while letting your curls sit cleanly on top. It looks professional without destroying your natural texture, and the disconnection gives it a modern edge.",
        how_to_ask: "I want a disconnected undercut — clipper the sides short (2 or 3 guard) with a hard part or disconnection line, and scissor-cut the top to keep my curl pattern. Don't use a razor on the top.",
        barber_specialty: "Barber or stylist trained in curly/textured hair — someone who cuts curly hair dry or knows to cut with the curl, not against it",
        maintenance: "Sides every 3 weeks, full cut every 6–8 weeks. Use a curl cream or mousse on wet hair and scrunch upward — never towel-rub.",
        pro_tip: "Always ask to be cut dry on the curly sections. Cutting curly hair wet means it springs up shorter than expected once it dries — you can lose a lot of length.",
        vibe: "Sharp",
        match_keywords: ["curly", "textured", "color"]
      };
    }
    return {
      recommended_cut: "Curly Medium Length with Taper",
      why_it_works: "Keeping medium length on top lets your curl pattern breathe and move naturally. A soft taper on the sides keeps it clean without looking overly groomed.",
      how_to_ask: "I want my curls left natural on top — just take off any dead ends and shape it. Taper the sides with scissors or a 3 guard, no skin fade. Keep it natural-looking.",
      barber_specialty: "Curly hair specialist — look for barbers who advertise DevaCut or textured hair experience",
      maintenance: "Every 6–8 weeks. Refresh curls daily with a water spritz and a small amount of curl cream. Pineapple your hair before bed to preserve the shape.",
      pro_tip: "If your barber reaches for a comb to pull your curls straight before cutting, stop them. Curly hair should always be cut in its natural state.",
      vibe: "Fresh",
      match_keywords: ["curly", "textured"]
    };
  }

  // ── Thick / coarse straight ───────────────────────────────────────────────
  if (/thick|coarse|dense|heavy/.test(hair)) {
    const wantsBold = /bold|different|edgy|statement/.test(goal);
    if (wantsBold) {
      return {
        recommended_cut: "Undercut Pompadour",
        why_it_works: "Thick hair has the natural volume to pull off a pompadour without product overload. Shaving the sides tight makes the volume on top look intentional and powerful rather than unruly.",
        how_to_ask: "I want an undercut — skin fade or 1 guard on the sides and back, hard disconnection. Leave 3–4 inches on top and cut it so it can be swept back into a pompadour. Texturize the top so it's not too heavy.",
        barber_specialty: "Barber comfortable with thick hair — someone who knows how to point-cut and texturize to remove bulk without taking length",
        maintenance: "Sides every 2–3 weeks. Use a medium-hold pomade or clay — not gel, it'll make thick hair stiff. Blow-dry forward then sweep back.",
        pro_tip: "Ask for point-cutting or texturizing shears on the top — this removes internal bulk and makes thick hair move instead of sitting like a helmet.",
        vibe: "Bold",
        match_keywords: ["thick", "fades", "classic"]
      };
    }
    return {
      recommended_cut: "Classic Taper with Textured Top",
      why_it_works: "Thick hair needs weight removal as much as it needs length control. A taper keeps the sides tight while point-cutting the top gives it movement and prevents the puffed-out triangle shape thick hair defaults to.",
      how_to_ask: "I want a classic taper on the sides — 1 or 2 guard at the bottom, blending up. On the top, use texturizing shears to remove bulk and give it movement. Medium length on top.",
      barber_specialty: "Barber experienced with thick or dense hair — ask if they use texturizing shears",
      maintenance: "Every 3–4 weeks. A small amount of matte clay or light pomade will help control the volume without weighing it down.",
      pro_tip: "Never let a barber use a razor or thinning shears aggressively on thick hair — it creates frizz at the ends and makes it look damaged. Texturizing shears are the right tool.",
      vibe: "Classic",
      match_keywords: ["thick", "tapers", "classic"]
    };
  }

  // ── Fine / thin hair ──────────────────────────────────────────────────────
  if (/thin|fine|limp|flat|thinning|receding/.test(hair)) {
    return {
      recommended_cut: "Textured French Crop or Buzz Cut",
      why_it_works: "Fine hair creates the illusion of density when cut short and textured on top. A crop with a short fringe draws attention to the front and away from any thin areas. Alternatively, a uniform buzz cut makes thin hair look deliberate and clean.",
      how_to_ask: "I want a textured crop — scissor-cut on top with a short, blunt or textured fringe, faded or tapered sides. Use point-cutting to add texture so it doesn't lie flat.",
      barber_specialty: "Barber with experience in fine hair — someone who won't over-cut and knows how to add texture",
      maintenance: "Every 3 weeks — fine hair grows out awkwardly fast. Use a lightweight volumizing paste, not heavy pomades which flatten it.",
      pro_tip: "Shampoo every other day max. Over-washing strips the scalp oils that give fine hair its only natural body.",
      vibe: "Clean",
      match_keywords: ["tapers", "classic", "fades"]
    };
  }

  // ── Round face ────────────────────────────────────────────────────────────
  if (/round/.test(face)) {
    return {
      recommended_cut: "High Fade with Height on Top",
      why_it_works: "A high fade tightens the sides which visually slims a round face, while leaving height on top elongates your face shape. This is one of the most flattering cuts for a round face regardless of hair texture.",
      how_to_ask: "I want a high fade — skin or 1 at the bottom, fading up high past the temples. Leave enough length on top to style upward with some height. Keep the top textured, not slicked flat.",
      barber_specialty: "Fade specialist — anyone with strong fade reviews",
      maintenance: "Every 2–3 weeks — high fades grow out quickly and lose their shape fast.",
      pro_tip: "Avoid cuts with width on the sides — anything that adds horizontal volume (like a blowout or side-swept style) will make a round face look wider.",
      vibe: "Sharp",
      match_keywords: ["fades", "tapers"]
    };
  }

  // ── Square / strong jaw ───────────────────────────────────────────────────
  if (/square|strong jaw|wide jaw|angular/.test(face)) {
    return {
      recommended_cut: "Soft Taper with Textured Top",
      why_it_works: "A square jaw is genuinely a great feature — you want a cut that complements it without overpowering it. A soft taper (not a hard skin fade) keeps the jaw as the focal point, while texture on top adds some softness to balance the angles.",
      how_to_ask: "I want a soft taper on the sides — nothing too aggressive, keep a little weight on the sides. Scissor or clipper the top with texture. I don't want a hard skin fade.",
      barber_specialty: "Barber comfortable with both scissors and clippers — not just a fade specialist",
      maintenance: "Every 4 weeks. A matte product like clay or paste works well — nothing shiny that emphasizes the sharpness of the jaw too much.",
      pro_tip: "Avoid super tight skin fades if you have a very square jaw — they can make it look almost architectural, which isn't always the goal. A 1 or 2 guard at the bottom is usually the sweet spot.",
      vibe: "Classic",
      match_keywords: ["tapers", "classic"]
    };
  }

  // ── Low maintenance ───────────────────────────────────────────────────────
  if (/low main|easy|simple|quick|no fuss|minimum/.test(goal)) {
    return {
      recommended_cut: "Buzz Cut or Skin Fade with Short Top",
      why_it_works: "The lowest maintenance cut that still looks intentional. A uniform buzz or a short fade with minimal top length grows out cleanly and looks good even 4–5 weeks later.",
      how_to_ask: "I want a short, low-maintenance cut. Either a uniform buzz (2 or 3 guard all over) or a skin fade on the sides with a 2 or 3 on top. Keep it simple.",
      barber_specialty: "Any experienced barber — this is a foundational cut",
      maintenance: "Every 4–6 weeks depending on how fast your hair grows. No product needed — just keep your scalp moisturized.",
      pro_tip: "If you're going for a buzz, ask your barber to go one guard longer than you think — it always looks shorter than expected once it's done.",
      vibe: "Clean",
      match_keywords: ["fades", "classic", "tapers"]
    };
  }

  // ── Professional / work ───────────────────────────────────────────────────
  if (/professional|work|office|interview|business/.test(goal)) {
    return {
      recommended_cut: "Classic Side Part Taper",
      why_it_works: "The side part taper is the most universally professional cut across hair types. It's polished without being boring, and works in any environment from a boardroom to a creative studio.",
      how_to_ask: "I want a classic side part — taper the sides with a 1 or 2 guard blending up, hard part on the left (or right, your preference), and scissor cut the top so it can be combed to the side. Keep enough length to comb it over cleanly.",
      barber_specialty: "Classic barber — someone who's strong with scissors and knows traditional cuts",
      maintenance: "Every 3–4 weeks. A light hold pomade or cream for the part — avoid heavy gel which looks dated.",
      pro_tip: "Tell your barber which side your hair naturally parts on — forcing a part against your hair's natural growth direction means it'll fight you every morning.",
      vibe: "Sharp",
      match_keywords: ["classic", "tapers", "fades"]
    };
  }

  // ── Default fallback — works for most straight/wavy hair ─────────────────
  return {
    recommended_cut: "Mid Skin Fade with Textured Top",
    why_it_works: "The mid fade is the most versatile cut in the barbershop — it works on virtually every hair type and face shape. Textured on top it looks modern and fresh without being extreme.",
    how_to_ask: "I want a mid skin fade — start the fade around the temple, blend down to skin at the bottom. Leave 2–3 inches on top and texturize it. Clean up my lineup.",
    barber_specialty: "Any barber with strong fade reviews — this is the most common cut so most experienced barbers do it well",
    maintenance: "Every 2–3 weeks to keep the fade fresh. A matte clay or paste on top for texture.",
    pro_tip: "The fastest way to spot a great barber: watch how they blend. The fade should have zero visible lines — it should look like it dissolves into your skin.",
    vibe: "Fresh",
    match_keywords: ["fades", "tapers"]
  };
}


// ─── CUT PHOTO REFERENCES ────────────────────────────────────────────────────
// These are curated search queries per cut. The app searches Unsplash for each.
// To override with your own photo, replace the query with a direct image URL
// starting with "https://" and the app will use it directly.

const CUT_PHOTOS = {
  "Loc Retwist & Shape":                    ["loc retwist hairstyle black hair", "dreadlocks shape up men", "locs men hairline"],
  "360 Wave Taper":                         ["360 waves men haircut", "waves taper fade men", "360 waves black men"],
  "High-Top Fade or Burst Fade with Natural Top": ["high top fade natural hair men", "burst fade afro men", "natural hair fade black men"],
  "Tapered Natural / TWA (Teeny Weeny Afro)":     ["twa natural hair men taper", "teeny weeny afro men", "natural taper men black hair"],
  "Textured Crop with Disconnected Undercut":     ["textured crop disconnected undercut men", "disconnected undercut curly hair", "textured crop men curly"],
  "Curly Medium Length with Taper":               ["curly hair taper men medium length", "curly taper fade men", "medium curly hair men"],
  "Undercut Pompadour":                     ["undercut pompadour men thick hair", "pompadour fade men", "undercut pompadour hairstyle"],
  "Classic Taper with Textured Top":        ["classic taper fade men textured top", "taper fade textured top men", "classic taper men haircut"],
  "Textured French Crop or Buzz Cut":       ["textured french crop men", "french crop fade men", "buzz cut men clean"],
  "High Fade with Height on Top":           ["high fade height top men", "high fade men round face", "high skin fade men"],
  "Soft Taper with Textured Top":           ["soft taper fade men square jaw", "taper fade textured men", "low taper men haircut"],
  "Buzz Cut or Skin Fade with Short Top":   ["buzz cut men clean", "skin fade short top men", "low maintenance fade men"],
  "Classic Side Part Taper":               ["classic side part taper men", "side part fade men professional", "side part men haircut"],
  "Mid Skin Fade with Textured Top":        ["mid skin fade textured top men", "mid fade men haircut", "skin fade textured men"],
};

function getPhotoQueries(cutName) {
  // Try exact match first
  if (CUT_PHOTOS[cutName]) return CUT_PHOTOS[cutName];
  // Try partial match
  const key = Object.keys(CUT_PHOTOS).find(k => cutName.toLowerCase().includes(k.toLowerCase().split(" ")[0]));
  if (key) return CUT_PHOTOS[key];
  // Fallback: use the cut name itself as a search query
  return [cutName + " men haircut", cutName + " hairstyle", "barbershop haircut men"];
}

// ─── BARBER DATA ─────────────────────────────────────────────────────────────

const BARBERS = [
  {
    id: 1,
    name: "Marcus \"The Sculptor\" Webb",
    shop: "Precision Cuts Barbershop",
    neighborhood: "Bethesda, MD",
    specialties: ["fades", "tapers", "shape-ups", "beard sculpting"],
    hairTypes: ["straight", "wavy", "waves", "type 3"],
    rating: 4.9, reviews: 312, wait: "~20 min", price: "$$",
    bookingUrl: "#", platform: "Booksy",
    tags: ["FADE KING", "BEARD WORK"],
    bio: "15 years in the game. Known for surgical fades and crisp lines. Clients fly in from out of state."
  },
  {
    id: 2,
    name: "Destiny \"D-Loc\" Charles",
    shop: "The Loc Studio",
    neighborhood: "Silver Spring, MD",
    specialties: ["locs", "loc maintenance", "retwist", "loc styles", "natural hair"],
    hairTypes: ["locs", "coily", "4c", "natural"],
    rating: 5.0, reviews: 178, wait: "By appt only", price: "$$$",
    bookingUrl: "#", platform: "Squire",
    tags: ["LOC SPECIALIST", "NATURAL HAIR"],
    bio: "Certified loc technician with a deep understanding of hair health. Every loc journey is personal."
  },
  {
    id: 3,
    name: "Tony Reyes",
    shop: "Old School Barbershop",
    neighborhood: "Rockville, MD",
    specialties: ["classic cuts", "pompadour", "slick back", "old school fades", "kids cuts"],
    hairTypes: ["straight", "wavy", "fine", "thick"],
    rating: 4.8, reviews: 524, wait: "~35 min", price: "$",
    bookingUrl: "#", platform: "Booksy",
    tags: ["CLASSIC CUTS", "KIDS WELCOME"],
    bio: "Third generation barber. No frills, just clean cuts. The neighborhood's been coming to him for 20 years."
  },
  {
    id: 4,
    name: "Jordan \"JK\" Kim",
    shop: "Fresh Canvas Studio",
    neighborhood: "Chevy Chase, MD",
    specialties: ["textured cuts", "curly hair", "disconnected undercut", "modern styles", "color"],
    hairTypes: ["curly", "wavy", "type 2", "type 3", "mixed"],
    rating: 4.9, reviews: 267, wait: "~15 min", price: "$$$",
    bookingUrl: "#", platform: "Squire",
    tags: ["CURLY SPECIALIST", "COLOR WORK"],
    bio: "Trained in NYC and London. Specializes in textured and curly hair. Every cut is customized to your curl pattern."
  },
  {
    id: 5,
    name: "Big Mike Thompson",
    shop: "Waves & Fades",
    neighborhood: "Bethesda, MD",
    specialties: ["waves", "360 waves", "tapers", "fades", "durag training advice"],
    hairTypes: ["waves", "coily", "type 4", "4a", "4b"],
    rating: 4.9, reviews: 441, wait: "~25 min", price: "$$",
    bookingUrl: "#", platform: "Booksy",
    tags: ["WAVE WHISPERER", "360 WAVES"],
    bio: "If you're trying to get your waves right, this is your guy. Period."
  },
  {
    id: 6,
    name: "Sofia Mendez",
    shop: "Cortes Studio",
    neighborhood: "Takoma Park, MD",
    specialties: ["tapers", "low fades", "thick hair cuts", "womens cuts", "kids"],
    hairTypes: ["thick", "straight", "wavy", "coarse"],
    rating: 4.8, reviews: 389, wait: "~30 min", price: "$$",
    bookingUrl: "#", platform: "Squire",
    tags: ["THICK HAIR PRO", "ALL GENDERS"],
    bio: "Specializes in thick, coarse hair textures. Bilingual. The whole family comes here."
  }
];

const QUIZ_STEPS = [
  { id: "hair_type",  question: "What's your hair like?",      sub: "Texture, length, anything goes",    placeholder: "e.g. thick and curly, fine and straight, 4c natural, waves, locs..." },
  { id: "face_shape", question: "Describe your face shape",    sub: "A rough idea is totally fine",       placeholder: "e.g. round face, square jaw, long face, oval, wide forehead..." },
  { id: "style_goal", question: "What vibe are you going for?",sub: "Think lifestyle, not just looks",    placeholder: "e.g. clean and professional, fresh for summer, low maintenance, bold..." },
  { id: "extra",      question: "Anything else to know?",      sub: "Optional but really helps",          placeholder: "e.g. job interview next week, haven't cut in 6 months...", optional: true },
];

// ─── THEME ───────────────────────────────────────────────────────────────────

const T = {
  bg:           "#F5F0E8",
  surface:      "#FFFFFF",
  border:       "rgba(30,20,10,0.1)",
  borderStrong: "rgba(30,20,10,0.22)",
  accent:       "#C1440E",
  accentLight:  "rgba(193,68,14,0.07)",
  accentMid:    "rgba(193,68,14,0.2)",
  ink:          "#1A1208",
  muted:        "rgba(26,18,8,0.45)",
  faint:        "rgba(26,18,8,0.04)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:rgba(30,20,10,0.2); border-radius:2px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spinCw { to{transform:rotate(360deg)} }
  @keyframes stripes { from{background-position:0 0} to{background-position:0 40px} }
  .fu  { animation:fadeUp 0.44s cubic-bezier(.22,.68,0,1.2) both; }
  .fu2 { animation:fadeUp 0.44s 0.08s cubic-bezier(.22,.68,0,1.2) both; }
  .fu3 { animation:fadeUp 0.44s 0.16s cubic-bezier(.22,.68,0,1.2) both; }
  .nl { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; transition:color 0.18s; }
  .nl:hover { color:#C1440E; }
  .card { background:#fff; border:1px solid rgba(30,20,10,0.1); transition:box-shadow 0.2s,transform 0.2s; }
  .card:hover { box-shadow:0 6px 28px rgba(30,20,10,0.08); transform:translateY(-2px); }
  .btn { display:inline-block; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:opacity 0.15s,transform 0.12s; }
  .btn:hover { opacity:0.85; }
  .btn:active { transform:scale(0.97); }
  .bp { background:#C1440E; color:#fff; }
  .bo { background:transparent; color:#1A1208; border:1.5px solid rgba(30,20,10,0.22); }
  .bo:hover { border-color:#C1440E; color:#C1440E; opacity:1; }
  .chip { display:inline-block; padding:4px 11px; font-family:'DM Sans',sans-serif; font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; border:1px solid rgba(30,20,10,0.1); color:rgba(26,18,8,0.45); cursor:pointer; transition:all 0.15s; margin:2px; }
  .chip:hover,.chip.on { border-color:#C1440E; color:#C1440E; background:rgba(193,68,14,0.07); }
  textarea,input { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:300; color:#1A1208; background:rgba(26,18,8,0.04); border:1.5px solid rgba(30,20,10,0.1); transition:border-color 0.2s; width:100%; padding:14px 16px; line-height:1.6; }
  textarea:focus,input:focus { outline:none; border-color:#C1440E; background:#fff; }
  textarea::placeholder,input::placeholder { color:rgba(26,18,8,0.4); }
  .pole { width:5px; border-radius:3px; overflow:hidden; flex-shrink:0; background:repeating-linear-gradient(180deg,#C1440E 0,#C1440E 6px,#fff 6px,#fff 10px,#1A1208 10px,#1A1208 16px,#fff 16px,#fff 20px); background-size:5px 40px; animation:stripes 1s linear infinite; }
`;

function Lbl({ children, style={} }) {
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:T.accent, display:"flex", alignItems:"center", gap:10, ...style }}>
      <span style={{ display:"inline-block", width:20, height:1.5, background:T.accent, flexShrink:0 }}/>
      {children}
    </div>
  );
}

function Stars({ r }) {
  return (
    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>
      <span style={{ color:T.accent }}>{"★".repeat(Math.floor(r))}</span>
      <span style={{ color:T.border }}>{"★".repeat(5-Math.floor(r))}</span>
      <span style={{ color:T.muted, marginLeft:5 }}>{r}</span>
    </span>
  );
}

function BCard({ b, compact=false }) {
  return (
    <div className="card" style={{ padding:compact?20:28, marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
            {b.tags.map(t=><span key={t} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:700, letterSpacing:"0.16em", padding:"3px 8px", background:T.accentLight, color:T.accent, border:`1px solid ${T.accentMid}` }}>{t}</span>)}
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:T.ink, marginBottom:2 }}>{b.name}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:T.muted, fontWeight:300, marginBottom:8 }}>{b.shop} · {b.neighborhood}</div>
          <Stars r={b.rating}/><span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.muted, marginLeft:6 }}>({b.reviews})</span>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:T.ink }}>{b.price}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.muted, marginTop:4 }}>{b.wait}</div>
        </div>
      </div>
      {!compact && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:T.muted, lineHeight:1.7, margin:"16px 0", fontWeight:300 }}>{b.bio}</p>}
      <div style={{ margin:"12px 0 16px" }}>
        {(compact?b.specialties.slice(0,4):b.specialties).map(s=><span key={s} className="chip" style={{ cursor:"default" }}>{s}</span>)}
      </div>
      <a href={b.bookingUrl} className="btn bp" style={{ padding:"10px 22px", fontSize:11, textDecoration:"none", display:"inline-block" }}>Book on {b.platform} →</a>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function Home({ nav }) {
  return (
    <div>
      <div style={{ minHeight:"90vh", display:"flex", alignItems:"center", padding:"40px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`repeating-linear-gradient(transparent,transparent 47px,${T.border} 47px,${T.border} 48px)`, opacity:0.5 }}/>
        <div style={{ position:"absolute", right:-20, top:"50%", transform:"translateY(-50%)", fontFamily:"'Playfair Display',serif", fontSize:"clamp(160px,28vw,320px)", fontWeight:900, fontStyle:"italic", color:"transparent", WebkitTextStroke:`1px ${T.border}`, lineHeight:1, pointerEvents:"none", userSelect:"none", whiteSpace:"nowrap" }}>CUT</div>
        <div style={{ position:"relative", maxWidth:680, zIndex:1 }}>
          <div className="fu" style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
            <div className="pole" style={{ height:52 }}/>
            <Lbl>AI-Powered Barber Intelligence</Lbl>
          </div>
          <h1 className="fu2" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(64px,14vw,128px)", fontWeight:900, fontStyle:"italic", lineHeight:0.9, color:T.ink, marginBottom:32 }}>
            Lined<br/><span style={{ color:T.accent }}>Up.</span>
          </h1>
          <p className="fu3" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:18, lineHeight:1.75, color:T.muted, maxWidth:400, marginBottom:44, fontWeight:300 }}>
            Find your perfect cut. Match with the right barber. Walk in knowing exactly what to say.
          </p>
          <div className="fu3" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button className="btn bp" onClick={()=>nav("quiz")} style={{ padding:"15px 38px", fontSize:12 }}>Find My Cut →</button>
            <button className="btn bo" onClick={()=>nav("directory")} style={{ padding:"15px 38px", fontSize:12 }}>Browse Barbers</button>
          </div>
        </div>
      </div>

      <div style={{ background:T.ink, padding:"80px 24px" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <Lbl style={{ color:T.accent, marginBottom:16 }}>How It Works</Lbl>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(36px,7vw,56px)", color:"#F5F0E8", lineHeight:1, marginBottom:52 }}>Three steps.<br/>Zero guesswork.</h2>
          {[
            { n:"01", t:"Describe Your Hair", b:"Tell us your hair type, face shape, and the style you want. Under two minutes." },
            { n:"02", t:"Get Your Recommendation", b:"Get the exact cut name, why it works for you, and word-for-word what to say in the chair." },
            { n:"03", t:"Match With a Specialist", b:"We point you to the right barber in your city for that specific style. Book via Booksy or Squire." },
          ].map((s,i)=>(
            <div key={i} style={{ display:"flex", gap:32, paddingBottom:40, marginBottom:40, borderBottom:i<2?"1px solid rgba(245,240,232,0.08)":"none" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:56, color:T.accent, lineHeight:1, flexShrink:0, width:64, opacity:0.65 }}>{s.n}</div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:17, color:"#F5F0E8", marginBottom:8 }}>{s.t}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:14, color:"rgba(245,240,232,0.5)", lineHeight:1.7 }}>{s.b}</div>
              </div>
            </div>
          ))}
          <button className="btn bp" onClick={()=>nav("quiz")} style={{ padding:"15px 38px", fontSize:12, marginTop:8 }}>Start The Quiz →</button>
        </div>
      </div>

      <div style={{ background:T.accentLight, borderTop:`1px solid ${T.accentMid}`, borderBottom:`1px solid ${T.accentMid}`, padding:"48px 24px" }}>
        <div style={{ maxWidth:680, margin:"0 auto", display:"flex", gap:40, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:240 }}>
            <Lbl style={{ marginBottom:12 }}>For Barbers</Lbl>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(24px,5vw,36px)", color:T.ink, lineHeight:1.15, marginBottom:12 }}>Integrate with your booking system</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:14, color:T.muted, lineHeight:1.7 }}>Clients complete the style quiz before arrival. You receive a full brief before they sit down. Works with Booksy and Squire.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {["Booksy","Squire"].map(p=><div key={p} style={{ padding:"12px 28px", border:`1.5px solid ${T.accentMid}`, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.12em", color:T.accent, background:"#fff" }}>{p}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────

function Quiz({ nav, setResult }) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const current = QUIZ_STEPS[step];

  const advance = async () => {
    const val = input.trim();
    if (!val && !current.optional) return;
    const updated = { ...answers, [current.id]: val };
    setAnswers(updated);
    setInput("");
    const isLast = step === QUIZ_STEPS.length - 1;
    if (!isLast) { setStep(s => s + 1); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const parsed = generateCutResult(updated);
    setResult({ result: parsed, answers: updated });
    nav("result");
  };

  const back = () => {
    const prev = QUIZ_STEPS[step - 1];
    setInput(answers[prev.id] || "");
    setStep(s => s - 1);
  };

  if (loading) return (
    <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
      <div style={{ fontSize:52, animation:"spinCw 1.4s linear infinite", display:"inline-block" }}>✂</div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:T.muted }}>Reading your hair…</p>
    </div>
  );

  return (
    <div className="fu" style={{ maxWidth:580, margin:"0 auto", padding:"52px 24px 80px" }}>
      <div style={{ display:"flex", gap:6, marginBottom:52 }}>
        {QUIZ_STEPS.map((_,i)=><div key={i} style={{ flex:1, height:2, background:i<=step?T.accent:T.border, transition:"background 0.3s" }}/>)}
      </div>
      <Lbl style={{ marginBottom:14 }}>Step {step+1} of {QUIZ_STEPS.length}{current.optional?" — optional":""}</Lbl>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(32px,7vw,52px)", color:T.ink, lineHeight:1, marginBottom:8 }}>{current.question}</h2>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:T.muted, marginBottom:28, fontWeight:300 }}>{current.sub}</p>
      <textarea key={step} rows={4} value={input} autoFocus
        onChange={e=>setInput(e.target.value)}
        onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); advance(); }}}
        placeholder={current.placeholder}
        style={{ resize:"none", borderColor:input.trim()?T.accent:T.border }}
      />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
        {step>0 ? <button className="btn bo" onClick={back} style={{ padding:"12px 24px", fontSize:11 }}>← Back</button> : <div/>}
        <button className="btn bp" onClick={advance}
          style={{ padding:"13px 34px", fontSize:11, opacity:(!input.trim()&&!current.optional)?0.35:1, cursor:(!input.trim()&&!current.optional)?"default":"pointer" }}>
          {step===QUIZ_STEPS.length-1?"Get My Cut →":"Next →"}
        </button>
      </div>
    </div>
  );
}

// ─── RESULT ───────────────────────────────────────────────────────────────────

function PhotoGallery({ cutName }) {
  const [open, setOpen]     = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  const queries = getPhotoQueries(cutName);

  const load = async () => {
    if (photos.length > 0) { setOpen(true); return; }
    setOpen(true);
    setLoading(true);
    // Use Unsplash source for reliable, free hair/barbershop photos
    const urls = queries.slice(0, 3).map((q, i) =>
      `https://source.unsplash.com/600x400/?${encodeURIComponent(q)}&sig=${Date.now() + i}`
    );
    setPhotos(urls);
    setLoading(false);
  };

  return (
    <div style={{ marginBottom:10 }}>
      <button
        className="btn bo"
        onClick={load}
        style={{ width:"100%", padding:"14px 24px", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}
      >
        <span style={{ fontSize:16 }}>📸</span>
        {open ? "Hide Examples" : "See What This Looks Like →"}
      </button>

      {open && (
        <div style={{ marginTop:12, background:T.surface, border:`1px solid ${T.border}`, padding:20 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:T.muted, fontWeight:600, marginBottom:14 }}>
            Visual References — {cutName}
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"32px 0", color:T.muted, fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>Loading examples…</div>
          ) : (
            <>
              {/* Main photo */}
              <div style={{ position:"relative", marginBottom:10, overflow:"hidden", background:T.faint }}>
                <img
                  src={photos[active]}
                  alt={cutName}
                  style={{ width:"100%", height:280, objectFit:"cover", display:"block" }}
                  onError={e => { e.target.src = `https://source.unsplash.com/600x400/?barbershop,haircut&sig=${active}`; }}
                />
                <div style={{ position:"absolute", bottom:10, right:10, background:"rgba(26,18,8,0.6)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:10, padding:"4px 10px", letterSpacing:"0.1em" }}>
                  {active + 1} / {photos.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div style={{ display:"flex", gap:8 }}>
                {photos.map((p, i) => (
                  <div key={i} onClick={() => setActive(i)}
                    style={{ flex:1, height:72, overflow:"hidden", cursor:"pointer", border:`2px solid ${i === active ? T.accent : "transparent"}`, transition:"border-color 0.15s" }}>
                    <img src={p} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                      onError={e => { e.target.src = `https://source.unsplash.com/200x150/?haircut,men&sig=${i+10}`; }} />
                  </div>
                ))}
              </div>

              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:T.muted, marginTop:12, lineHeight:1.6, fontWeight:300 }}>
                These are reference photos to give you a visual idea. Your exact result will depend on your hair texture and your barber's style.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Result({ data, nav }) {
  const { result:r } = data;
  const kw = (r.match_keywords||[]).map(k=>k.toLowerCase());
  const matched = BARBERS.filter(b=>kw.some(k=>b.specialties.some(s=>s.toLowerCase().includes(k))||b.hairTypes.some(h=>h.toLowerCase().includes(k))));
  const display = matched.length>0 ? matched.slice(0,2) : BARBERS.slice(0,2);

  return (
    <div className="fu" style={{ maxWidth:660, margin:"0 auto", padding:"52px 24px 80px" }}>
      <Lbl style={{ marginBottom:20 }}>Your Result</Lbl>
      <div style={{ borderLeft:`3px solid ${T.accent}`, paddingLeft:28, marginBottom:24 }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:T.muted, marginBottom:8 }}>Recommended Cut</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(44px,9vw,72px)", fontWeight:900, color:T.ink, lineHeight:0.92, marginBottom:16 }}>{r.recommended_cut}</h1>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", background:T.accent, color:"#fff", padding:"5px 14px" }}>{r.vibe}</span>
      </div>

      {/* Photo gallery — right under the cut name */}
      <div style={{ marginBottom:32 }}>
        <PhotoGallery cutName={r.recommended_cut} />
      </div>

      {[
        { icon:"◈", label:"Why It Works For You",     body:r.why_it_works },
        { icon:"◎", label:"What To Say In The Chair", body:r.how_to_ask, hi:true },
        { icon:"⟳", label:"Maintenance",              body:r.maintenance },
        { icon:"✦", label:"Pro Tip",                  body:r.pro_tip },
      ].map((c,i)=>(
        <div key={i} style={{ background:c.hi?T.accentLight:T.surface, border:`1px solid ${c.hi?T.accentMid:T.border}`, padding:"22px 24px", marginBottom:10 }}>
          <div style={{ display:"flex", gap:16 }}>
            <span style={{ color:T.accent, fontSize:18, lineHeight:1, flexShrink:0 }}>{c.icon}</span>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:T.muted, fontWeight:600, marginBottom:7 }}>{c.label}</div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", margin:0, fontSize:14, lineHeight:1.75, color:c.hi?T.ink:T.muted, fontStyle:c.hi?"italic":"normal", fontWeight:c.hi?500:300 }}>{c.body}</p>
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop:52 }}>
        <Lbl style={{ marginBottom:12 }}>Matched Barbers</Lbl>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(28px,6vw,40px)", color:T.ink, lineHeight:1, marginBottom:24 }}>Who can do this in your city</h2>
        {display.map(b=><BCard key={b.id} b={b} compact/>)}
        <button className="btn bo" onClick={()=>nav("directory")} style={{ width:"100%", padding:14, fontSize:11, marginTop:8 }}>See Full Directory →</button>
      </div>

      <div style={{ display:"flex", gap:12, marginTop:44 }}>
        <button className="btn bo" onClick={()=>nav("quiz")} style={{ flex:1, padding:15, fontSize:11 }}>Start Over ↺</button>
        <button className="btn bp" onClick={()=>nav("booking")} style={{ flex:1, padding:15, fontSize:11 }}>Book Now →</button>
      </div>
    </div>
  );
}

// ─── DIRECTORY ────────────────────────────────────────────────────────────────

function Directory({ nav }) {
  const allSpecs = [...new Set(BARBERS.flatMap(b=>b.specialties))];
  const [active, setActive] = useState(null);
  const filtered = active ? BARBERS.filter(b=>b.specialties.includes(active)) : BARBERS;
  return (
    <div className="fu" style={{ maxWidth:700, margin:"0 auto", padding:"52px 24px 80px" }}>
      <Lbl style={{ marginBottom:16 }}>Barber Directory</Lbl>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(44px,9vw,68px)", fontWeight:900, color:T.ink, lineHeight:0.92, marginBottom:12 }}>Find your<br/><span style={{ color:T.accent }}>specialist.</span></h1>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:15, color:T.muted, marginBottom:36 }}>Every barber curated and tagged by what they actually do best.</p>
      <div style={{ marginBottom:32, display:"flex", flexWrap:"wrap", alignItems:"center", gap:4 }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:T.muted, letterSpacing:"0.15em", textTransform:"uppercase", marginRight:8 }}>Filter:</span>
        <span className={`chip${!active?" on":""}`} onClick={()=>setActive(null)}>All</span>
        {allSpecs.slice(0,12).map(s=><span key={s} className={`chip${active===s?" on":""}`} onClick={()=>setActive(s===active?null:s)}>{s}</span>)}
      </div>
      {filtered.length===0
        ? <p style={{ fontFamily:"'DM Sans',sans-serif", color:T.muted, fontSize:14 }}>No barbers match that filter yet.</p>
        : filtered.map(b=><BCard key={b.id} b={b}/>)}
      <div style={{ background:T.accentLight, border:`1px solid ${T.accentMid}`, padding:32, textAlign:"center", marginTop:48 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:T.muted, marginBottom:16, fontWeight:300 }}>Not sure which specialist is right for you?</p>
        <button className="btn bp" onClick={()=>nav("quiz")} style={{ padding:"14px 36px", fontSize:11 }}>Take The Style Quiz →</button>
      </div>
    </div>
  );
}

// ─── BOOKING ──────────────────────────────────────────────────────────────────

function Booking({ nav }) {
  const [barber, setBarber] = useState(null);
  const [brief, setBrief]   = useState({});
  const [form, setForm]     = useState({ name:"", phone:"", date:"", time:"" });
  const [screen, setScreen] = useState("pick");
  const TIMES = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];

  if (screen==="pick") return (
    <div className="fu" style={{ maxWidth:700, margin:"0 auto", padding:"52px 24px 80px" }}>
      <Lbl style={{ marginBottom:16 }}>Book An Appointment</Lbl>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(40px,9vw,60px)", fontWeight:900, color:T.ink, lineHeight:0.92, marginBottom:32 }}>Choose your<br/><span style={{ color:T.accent }}>barber.</span></h1>
      {BARBERS.map(b=>(
        <div key={b.id} className="card" onClick={()=>{ setBarber(b); setScreen("brief"); }}
          style={{ padding:"18px 22px", marginBottom:10, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:T.ink, marginBottom:2 }}>{b.name}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:T.muted, fontWeight:300 }}>{b.shop} · {b.neighborhood}</div>
            <div style={{ marginTop:6 }}>{b.tags.map(t=><span key={t} className="chip" style={{ fontSize:9, cursor:"default" }}>{t}</span>)}</div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <Stars r={b.rating}/><br/>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:T.muted }}>{b.price} · {b.wait}</span>
          </div>
        </div>
      ))}
    </div>
  );

  if (screen==="brief") return (
    <div className="fu" style={{ maxWidth:580, margin:"0 auto", padding:"52px 24px 80px" }}>
      <Lbl style={{ marginBottom:16 }}>Pre-Appointment Style Brief</Lbl>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(34px,7vw,50px)", fontWeight:900, color:T.ink, lineHeight:0.95, marginBottom:12 }}>Help your barber<br/><span style={{ color:T.accent }}>prepare.</span></h1>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:14, color:T.muted, marginBottom:36 }}>
        Booking with <strong style={{ color:T.ink, fontWeight:600 }}>{barber.name}</strong>. Answer a few quick questions so they know what to expect.
      </p>
      {QUIZ_STEPS.map(q=>(
        <div key={q.id} style={{ marginBottom:20 }}>
          <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:T.muted, display:"block", marginBottom:7 }}>
            {q.question}{q.optional?" (optional)":""}
          </label>
          <textarea rows={2} placeholder={q.placeholder} value={brief[q.id]||""} onChange={e=>setBrief({...brief,[q.id]:e.target.value})} style={{ resize:"none" }}/>
        </div>
      ))}
      <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:28, marginTop:8 }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:T.muted, marginBottom:16 }}>Your Info</div>
        {[["name","Your name","text"],["phone","Phone number","tel"]].map(([k,p,t])=>(
          <input key={k} type={t} placeholder={p} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={{ marginBottom:10 }}/>
        ))}
        <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ marginBottom:16, colorScheme:"light" }}/>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:28 }}>
          {TIMES.map(t=>(
            <button key={t} onClick={()=>setForm({...form,time:t})} style={{ padding:"8px 13px", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, cursor:"pointer", background:form.time===t?T.accent:"#fff", color:form.time===t?"#fff":T.muted, border:`1.5px solid ${form.time===t?T.accent:T.border}`, transition:"all 0.15s" }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:12 }}>
        <button className="btn bo" onClick={()=>setScreen("pick")} style={{ flex:1, padding:14, fontSize:11 }}>← Back</button>
        <button className="btn bp" onClick={()=>setScreen("confirm")} style={{ flex:2, padding:14, fontSize:11 }}>Confirm Booking →</button>
      </div>
    </div>
  );

  return (
    <div className="fu" style={{ maxWidth:520, margin:"0 auto", padding:"52px 24px 80px", textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:24 }}>✂️</div>
      <Lbl style={{ justifyContent:"center", marginBottom:16 }}>You're Booked</Lbl>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(44px,9vw,68px)", fontWeight:900, color:T.ink, marginBottom:12 }}>You're <span style={{ color:T.accent }}>lined up.</span></h1>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:15, color:T.muted, lineHeight:1.7, marginBottom:36 }}>
        Your style brief has been sent to <strong style={{ color:T.ink, fontWeight:600 }}>{barber.name}</strong>.<br/>They'll know exactly what to expect.
      </p>
      <div className="card" style={{ padding:28, textAlign:"left", marginBottom:36 }}>
        {[["Barber",barber.name],["Shop",barber.shop],["Date",form.date||"TBD"],["Time",form.time||"TBD"],["Platform",barber.platform]].map(([k,v])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:T.muted }}>{k}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, color:T.ink }}>{v}</span>
          </div>
        ))}
      </div>
      <button className="btn bp" onClick={()=>{ setScreen("pick"); setBarber(null); setForm({name:"",phone:"",date:"",time:""}); setBrief({}); }} style={{ padding:"15px 40px", fontSize:11 }}>Book Another →</button>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About({ nav }) {
  return (
    <div className="fu" style={{ maxWidth:660, margin:"0 auto", padding:"52px 24px 80px" }}>
      <Lbl style={{ marginBottom:16 }}>About</Lbl>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(44px,9vw,68px)", fontWeight:900, color:T.ink, lineHeight:0.92, marginBottom:44 }}>Built by a<br/><span style={{ color:T.accent }}>real barber.</span></h1>
      <div className="card" style={{ padding:36, marginBottom:36, display:"flex", gap:24, alignItems:"flex-start", flexWrap:"wrap" }}>
        <div style={{ width:72, height:72, background:T.accentLight, border:`2px solid ${T.accentMid}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>✂</div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:T.ink, marginBottom:4 }}>Jazmyne Pragji</h2>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:T.accent, letterSpacing:"0.08em", marginBottom:12 }}>Barber · Au Pair · Founder</div>
          <div>{["Licensed Barber","Based in Bethesda, MD","Founder of LINED UP"].map(t=><span key={t} className="chip" style={{ cursor:"default" }}>{t}</span>)}</div>
        </div>
      </div>
      {[
        { h:"Why I Built This", b:"When I moved to the US, one of the hardest things was finding the right barber — someone who actually understood my hair and listened. I spent months going to the wrong places. I know that feeling, and I built LINED UP so nobody else has to waste their time or money in the wrong chair." },
        { h:"The Barber Side",  b:"I've been cutting hair for [X] years. Half of every consultation is just figuring out what someone actually wants. LINED UP fixes that — clients come in prepared, barbers know what to expect, and the whole experience gets better for everyone." },
        { h:"The Vision",       b:"LINED UP isn't just an app — it's a bridge between people and the right barber for them. I'm building direct integrations with Booksy and Squire so every booking comes with a style brief. Every barber in the directory is personally vetted. Barbershop culture, powered by AI." },
      ].map((s,i,arr)=>(
        <div key={i} style={{ marginBottom:36, paddingBottom:36, borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:26, color:T.ink, marginBottom:12 }}>{s.h}</h3>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:15, color:T.muted, lineHeight:1.8 }}>{s.b}</p>
        </div>
      ))}
      <div style={{ background:T.accentLight, border:`1px solid ${T.accentMid}`, padding:32, marginBottom:32 }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:26, color:T.ink, marginBottom:8 }}>Are you a barber?</h3>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:14, color:T.muted, lineHeight:1.7, marginBottom:20 }}>Get listed and receive pre-appointment style briefs from every client. Connect your Booksy or Squire profile.</p>
        <button className="btn bp" style={{ padding:"12px 28px", fontSize:11 }}>Apply To Be Listed →</button>
      </div>
      <button className="btn bp" onClick={()=>nav("quiz")} style={{ width:"100%", padding:17, fontSize:12 }}>Try The Style Quiz →</button>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function LinedUp() {
  const [page, setPage]             = useState("home");
  const [quizResult, setQuizResult] = useState(null);
  const topRef                      = useRef(null);

  const nav = p => { setPage(p); topRef.current?.scrollIntoView({ behavior:"smooth" }); };

  const navItems = [
    { id:"home",      label:"Home" },
    { id:"quiz",      label:"Find My Cut" },
    { id:"directory", label:"Barbers" },
    { id:"booking",   label:"Book" },
    { id:"about",     label:"About" },
  ];

  return (
    <div style={{ background:T.bg, minHeight:"100vh", color:T.ink }}>
      <style>{css}</style>
      <div ref={topRef}/>
      <nav style={{ position:"sticky", top:0, zIndex:100, background:`${T.bg}F2`, backdropFilter:"blur(14px)", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:54 }}>
        <div onClick={()=>nav("home")} style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:22, fontWeight:900, color:T.ink, cursor:"pointer" }}>
          Lined <span style={{ color:T.accent }}>Up.</span>
        </div>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          {navItems.map(n=><span key={n.id} className="nl" onClick={()=>nav(n.id)} style={{ color:page===n.id?T.accent:T.muted }}>{n.label}</span>)}
        </div>
      </nav>

      {page==="home"      && <Home nav={nav}/>}
      {page==="quiz"      && <Quiz nav={nav} setResult={setQuizResult}/>}
      {page==="result"    && quizResult && <Result data={quizResult} nav={nav}/>}
      {page==="directory" && <Directory nav={nav}/>}
      {page==="booking"   && <Booking nav={nav}/>}
      {page==="about"     && <About nav={nav}/>}

      <footer style={{ borderTop:`1px solid ${T.border}`, padding:"28px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:900, fontSize:18, color:T.muted }}>Lined <span style={{ color:T.accent }}>Up.</span></div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"rgba(26,18,8,0.22)", letterSpacing:"0.14em" }}>AI-POWERED BARBER INTELLIGENCE · {new Date().getFullYear()}</div>
        <div style={{ display:"flex", gap:20 }}>
          {["Booksy","Squire"].map(p=><span key={p} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"rgba(26,18,8,0.22)", letterSpacing:"0.12em" }}>WORKS WITH {p.toUpperCase()}</span>)}
        </div>
      </footer>
    </div>
  );
}
