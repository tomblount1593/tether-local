const STORE_KEY = "tether_local_store_v1";

const CURRENT_USER = {
  id: "local-user",
  email: "you@tether.local",
  full_name: "Tom",
  role: "user",
};

const DEMO_PEOPLE = [
  { id: "d1", name: "Jamie", age: 31, location: "Shoreditch, London", score: 94, photo: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600&h=750&fit=crop&q=70" },
  { id: "d2", name: "Callum", age: 29, location: "Bermondsey, London", score: 91, photo: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&h=750&fit=crop&q=70" },
  { id: "d3", name: "Finn", age: 33, location: "Islington, London", score: 90, photo: "https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=600&h=750&fit=crop&q=70" },
  { id: "d4", name: "Reuben", age: 35, location: "Chelsea, London", score: 87, photo: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=600&h=750&fit=crop&q=70" },
  { id: "d5", name: "Tom", age: 32, location: "Notting Hill, London", score: 85, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&q=70" },
  { id: "d6", name: "Noah", age: 28, location: "Bristol", score: 76, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=750&fit=crop&q=70" },
  { id: "d7", name: "Leon", age: 30, location: "Peckham, London", score: 68, photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=750&fit=crop&q=70" },
  { id: "d8", name: "Marcus", age: 34, location: "Hackney, London", score: 62, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=750&fit=crop&q=70" },
  { id: "s1", name: "Sophie", age: 28, location: "Chelsea, London", score: 94, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop&q=70" },
  { id: "s2", name: "Mia", age: 31, location: "Shoreditch, London", score: 91, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=750&fit=crop&q=70" },
  { id: "s3", name: "Chloe", age: 29, location: "Islington, London", score: 89, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=750&fit=crop&q=70" },
  { id: "s4", name: "Ava", age: 27, location: "Notting Hill", score: 86, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=750&fit=crop&q=70" },
  { id: "l1", name: "Isla", age: 29, location: "Shoreditch, London", score: 94, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop&q=70" },
  { id: "l2", name: "Margot", age: 32, location: "Islington, London", score: 91, photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop&q=70" },
  { id: "b1", name: "Jamie", age: 31, location: "Shoreditch, London", score: 94, photo: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600&h=750&fit=crop&q=70" },
  { id: "b2", name: "Isla", age: 29, location: "Islington, London", score: 92, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop&q=70" },
  { id: "t1", name: "River", age: 28, location: "Hackney, London", score: 93, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=750&fit=crop&q=70" },
  { id: "t2", name: "Sage", age: 31, location: "Peckham, London", score: 90, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=750&fit=crop&q=70" },
];

const createProfileForPerson = (person) => ({
  id: `profile-${person.id}`,
  created_by: `${person.id}@tether.local`,
  created_date: "2026-01-01T12:00:00.000Z",
  updated_date: "2026-01-01T12:00:00.000Z",
  display_name: person.name,
  age: person.age,
  height_cm: 178,
  location: person.location,
  bio: "Looking for a real connection, good conversation, and dates that feel worth leaving the house for.",
  photos: [person.photo],
  is_verified: true,
  intent: "relationship",
  relationship_structure: "monogamous",
  scene_level: "moderately_social",
  substance_preference: "social_drinking",
  onboarding_complete: true,
  compatibility_complete: true,
  profile_complete: true,
});

const createMatchForPerson = (person) => ({
  id: person.id,
  created_date: "2026-01-02T12:00:00.000Z",
  updated_date: "2026-01-02T12:00:00.000Z",
  user_a_email: CURRENT_USER.email,
  user_b_email: `${person.id}@tether.local`,
  user_a_liked: true,
  user_b_liked: true,
  is_mutual: true,
  status: "matched",
  compatibility_score: person.score,
  match_reason: "Strong alignment across values, lifestyle, and relationship intent.",
});

const createInitialStore = () => ({
  Profile: DEMO_PEOPLE.map(createProfileForPerson),
  Match: DEMO_PEOPLE.map(createMatchForPerson),
  DateBooking: [
    {
      id: "booking-d1",
      created_date: "2026-01-03T12:00:00.000Z",
      updated_date: "2026-01-03T12:00:00.000Z",
      match_id: "d1",
      initiated_by: CURRENT_USER.email,
      venue_name: "Barrafina",
      venue_area: "Soho",
      venue_type: "Restaurant",
      proposed_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      proposed_time: "19:00",
      status: "confirmed",
      user_a_confirmed: true,
      user_a_paid: true,
    },
  ],
  Message: [
    {
      id: "message-d1-1",
      created_date: "2026-01-03T12:15:00.000Z",
      updated_date: "2026-01-03T12:15:00.000Z",
      match_id: "d1",
      sender_email: "d1@tether.local",
      content: "Looking forward to meeting properly.",
    },
  ],
  DatePlan: [],
  PostDateFeedback: [],
});

const getStore = () => {
  if (typeof window === "undefined") return createInitialStore();
  const raw = window.localStorage.getItem(STORE_KEY);
  if (!raw) {
    const initial = createInitialStore();
    saveStore(initial);
    return initial;
  }
  try {
    return { ...createInitialStore(), ...JSON.parse(raw) };
  } catch {
    const initial = createInitialStore();
    saveStore(initial);
    return initial;
  }
};

const saveStore = (store) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }
};

const sortItems = (items, sort) => {
  if (!sort) return items;
  const desc = sort.startsWith("-");
  const key = desc ? sort.slice(1) : sort;
  return [...items].sort((a, b) => {
    const av = a[key] || "";
    const bv = b[key] || "";
    if (av === bv) return 0;
    return (av > bv ? 1 : -1) * (desc ? -1 : 1);
  });
};

const matchesQuery = (item, query = {}) =>
  Object.entries(query).every(([key, value]) => item[key] === value);

const createEntityApi = (collection) => ({
  async list(sort, limit) {
    const store = getStore();
    const items = sortItems(store[collection] || [], sort);
    return typeof limit === "number" ? items.slice(0, limit) : items;
  },

  async filter(query = {}) {
    const store = getStore();
    return (store[collection] || []).filter((item) => matchesQuery(item, query));
  },

  async create(data) {
    const store = getStore();
    const now = new Date().toISOString();
    const item = {
      ...data,
      id: data.id || `${collection.toLowerCase()}-${crypto.randomUUID()}`,
      created_by: data.created_by || (collection === "Profile" ? CURRENT_USER.email : data.created_by),
      created_date: data.created_date || now,
      updated_date: now,
    };
    store[collection] = [item, ...(store[collection] || [])];
    saveStore(store);
    return item;
  },

  async update(id, data) {
    const store = getStore();
    const items = store[collection] || [];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = { ...items[index], ...data, updated_date: new Date().toISOString() };
    store[collection] = [...items.slice(0, index), updated, ...items.slice(index + 1)];
    saveStore(store);
    return updated;
  },
});

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const createCompatibilityScores = (prompt) => {
  const idMatches = [...prompt.matchAll(/"id":\s*"([^"]+)"/g)].map((match) => match[1]);
  return {
    scores: [...new Set(idMatches)].map((id, index) => ({
      id,
      score: Math.max(70, 94 - index * 3),
      reason: "Strong lifestyle and intent alignment.",
      top_markers: ["Values alignment", "Lifestyle fit", "Mutual energy"],
    })),
  };
};

export const localApp = {
  auth: {
    async me() {
      return CURRENT_USER;
    },
    logout() {
      window.location.assign("/");
    },
    redirectToLogin() {
      window.location.assign("/");
    },
  },
  entities: {
    Profile: createEntityApi("Profile"),
    Match: createEntityApi("Match"),
    DateBooking: createEntityApi("DateBooking"),
    Message: createEntityApi("Message"),
    DatePlan: createEntityApi("DatePlan"),
    PostDateFeedback: createEntityApi("PostDateFeedback"),
  },
  integrations: {
    Core: {
      async UploadFile({ file }) {
        return { file_url: await fileToDataUrl(file) };
      },
      async InvokeLLM({ prompt }) {
        if (prompt?.includes("compatibility engine")) {
          return createCompatibilityScores(prompt);
        }
        return {
          evolution_note: "We learned that real-world ease and shared pace matter most.",
          attraction_weight: "unchanged",
          values_weight: "higher",
          lifestyle_weight: "higher",
        };
      },
    },
  },
};
