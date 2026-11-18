const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const COMMUNITIES = require('./communities');

const DB_FILE = path.join(__dirname, 'data.json');

const defaultData = () => ({
  users: [],
  skills: [],
  exchanges: [],
  conversations: [],
  messages: [],
  reviews: [],
  notifications: [],
});

function load() {
  if (!fs.existsSync(DB_FILE)) {
    const data = defaultData();
    seed(data);
    save(data);
    return data;
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  if (!data.exchanges) data.exchanges = [];
  if (!data.notifications) data.notifications = [];
  return data;
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function seed(data) {
  const hash = bcrypt.hashSync('password123', 10);
  const users = [
    { id: uuidv4(), full_name: 'Jane Wanjiku', email: 'jane@example.com', password_hash: hash, location: 'JKUAT Main Campus', avatar: '', lat: -1.089, lng: 37.01, phone: '+254712345001', bio: 'Experienced math tutor and piano teacher.', created_at: new Date().toISOString() },
    { id: uuidv4(), full_name: 'David Otieno', email: 'david@example.com', password_hash: hash, location: 'Kisumu', avatar: '', lat: -0.091, lng: 34.768, phone: '+254712345002', bio: 'Plumber and handyman.', created_at: new Date().toISOString() },
    { id: uuidv4(), full_name: 'Amina Hassan', email: 'amina@example.com', password_hash: hash, location: 'Mombasa', avatar: '', lat: -4.043, lng: 39.668, phone: '+254712345003', bio: 'Graphic designer and photographer.', created_at: new Date().toISOString() },
    { id: uuidv4(), full_name: 'Brian Kamau', email: 'brian@example.com', password_hash: hash, location: 'Nakuru', avatar: '', lat: -0.303, lng: 36.08, phone: '+254712345004', bio: 'Full-stack developer.', created_at: new Date().toISOString() },
    { id: uuidv4(), full_name: 'Grace Achieng', email: 'grace@example.com', password_hash: hash, location: 'Juja Town', avatar: '', lat: -1.101, lng: 37.013, phone: '+254712345005', bio: 'Tailor and fashion designer.', created_at: new Date().toISOString() },
    { id: uuidv4(), full_name: 'Ashley Kuthi', email: 'ashley@example.com', password_hash: hash, location: 'Naivasha', avatar: '', lat: -0.717, lng: 36.431, phone: '+254712345006', bio: 'Gym instructor with 5 years of experience.', created_at: new Date().toISOString() },
    { id: uuidv4(), full_name: 'Karen Ruturi', email: 'karen@example.com', password_hash: hash, location: 'Naivasha', avatar: '', lat: -0.717, lng: 36.431, phone: '+254712345007', bio: 'I teach English, Mandarin and Latin.', created_at: new Date().toISOString() },
  ];
  data.users = users;

  const skillDefs = [
    [5, 'Gym instructor', 'I am a gym instructor with 5 years of experience', 'Fitness', 'heart'],
    [6, 'Language teacher', 'I teach English, Mandarin and Latin', 'Education', 'grad'],
    [3, 'Java and Database Development', 'A java developer leveraging my tech with databases like MySQL an Postgres', 'Technology', 'laptop'],
    [0, 'Mathematics Tutoring', 'One-on-one math tutoring for Form 1-4. Algebra, calculus, statistics.', 'Education', 'grad'],
    [0, 'Piano Lessons', 'Beginner piano lessons for kids and adults.', 'Music', 'music'],
    [1, 'Plumbing & Pipe Repairs', 'Fix leaks, install sinks, unblock drains.', 'Home Services', 'tool'],
    [2, 'Logo & Brand Design', 'Professional logo design, business cards, social media graphics.', 'Design', 'palette'],
    [3, 'Website Development', 'Build business websites, landing pages, or fix bugs.', 'Technology', 'laptop'],
    [4, 'Custom Clothing & Alterations', 'Tailoring, dressmaking, alterations.', 'Fashion', 'shirt'],
    [4, 'Sewing Classes', 'Basic to intermediate sewing. Small group or 1-on-1.', 'Education', 'grad'],
  ];

  data.skills = skillDefs.map(([ui, title, description, category, icon]) => ({
    id: uuidv4(),
    user_id: users[ui].id,
    title,
    description,
    category,
    icon: icon || 'star',
    type: 'offering',
    created_at: new Date().toISOString(),
  }));

  // Sample exchange
  data.exchanges = [
    {
      id: uuidv4(),
      skill_id: data.skills[7].id,
      requester_id: users[1].id,
      provider_id: users[3].id,
      message: 'Hi, interested in web development lessons',
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      skill_id: data.skills[7].id,
      requester_id: users[2].id,
      provider_id: users[3].id,
      message: 'Hello. How much do you charge for a Web Development lesson?',
      status: 'completed',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ];

  data.reviews = [
    { id: uuidv4(), reviewer_id: users[1].id, reviewed_id: users[0].id, skill_id: null, rating: 5, comment: 'Excellent math tutor.', created_at: new Date().toISOString() },
    { id: uuidv4(), reviewer_id: users[0].id, reviewed_id: users[3].id, skill_id: null, rating: 5, comment: 'Brian fixed my portfolio site quickly.', created_at: new Date().toISOString() },
    { id: uuidv4(), reviewer_id: users[3].id, reviewed_id: users[2].id, skill_id: null, rating: 4, comment: 'Great logo work.', created_at: new Date().toISOString() },
  ];

  console.log('Demo data seeded. Login: jane@example.com / password123');
}

let data = load();

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

const db = {
  findUserByEmail: (email) => data.users.find((u) => u.email === email),
  findUserById: (id) => data.users.find((u) => u.id === id),
  createUser: (user) => { data.users.push(user); save(data); return user; },
  updateUser: (id, updates) => {
    const i = data.users.findIndex((u) => u.id === id);
    if (i === -1) return null;
    data.users[i] = { ...data.users[i], ...updates };
    save(data);
    return data.users[i];
  },
  getStats: () => ({
    skills: data.skills.length,
    members: data.users.length,
    exchanges: data.exchanges.filter((e) => e.status === 'completed' || e.status === 'accepted').length,
  }),
  getCommunities: () => COMMUNITIES,
  getSkills: (filters = {}) => {
    let list = [...data.skills];
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    if (filters.category && filters.category !== 'All' && filters.category !== 'All Categories') {
      list = list.filter((s) => s.category === filters.category);
    }
    if (filters.type && filters.type !== 'all') {
      list = list.filter((s) => (s.type || 'offering') === filters.type);
    }
    // Community boundary: optional. Use "All Communities" to look outside.
    if (filters.community && filters.community !== 'All Communities') {
      list = list.filter((s) => {
        const u = data.users.find((x) => x.id === s.user_id);
        return u && u.location === filters.community;
      });
    }
    const viewerLat = filters.lat != null && filters.lat !== '' ? Number(filters.lat) : null;
    const viewerLng = filters.lng != null && filters.lng !== '' ? Number(filters.lng) : null;
    const mapped = list.map((s) => {
      const u = data.users.find((x) => x.id === s.user_id);
      const reviews = data.reviews.filter((r) => r.reviewed_id === s.user_id);
      const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;
      let distance_km = null;
      if (viewerLat != null && viewerLng != null && u && u.lat != null && u.lng != null) {
        distance_km = haversineKm(viewerLat, viewerLng, Number(u.lat), Number(u.lng));
      }
      return {
        ...s,
        type: s.type || 'offering',
        provider_name: u?.full_name,
        provider_location: u?.location,
        provider_avatar: u?.avatar || '',
        provider_rating: avg,
        distance_km,
      };
    });
    if (viewerLat != null && viewerLng != null && filters.sort === 'distance') {
      return mapped.sort((a, b) => {
        if (a.distance_km == null && b.distance_km == null) return 0;
        if (a.distance_km == null) return 1;
        if (b.distance_km == null) return -1;
        return a.distance_km - b.distance_km;
      });
    }
    return mapped.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  findSkill: (id) => {
    const s = data.skills.find((x) => x.id === id);
    if (!s) return null;
    const u = data.users.find((x) => x.id === s.user_id);
    return { ...s, type: s.type || 'offering', provider_name: u?.full_name, provider_location: u?.location, provider_bio: u?.bio, provider_avatar: u?.avatar || '' };
  },
  createSkill: (skill) => { data.skills.push(skill); save(data); return skill; },
  updateSkill: (id, updates) => {
    const i = data.skills.findIndex((s) => s.id === id);
    if (i === -1) return null;
    data.skills[i] = { ...data.skills[i], ...updates };
    save(data);
    return data.skills[i];
  },
  deleteSkill: (id) => { data.skills = data.skills.filter((s) => s.id !== id); save(data); },
  getSkillsByUser: (userId) => data.skills.filter((s) => s.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  // Exchanges
  createExchange: (ex) => { data.exchanges.push(ex); save(data); return ex; },
  findExchange: (id) => data.exchanges.find((e) => e.id === id),
  updateExchange: (id, updates) => {
    const i = data.exchanges.findIndex((e) => e.id === id);
    if (i === -1) return null;
    data.exchanges[i] = { ...data.exchanges[i], ...updates };
    save(data);
    return data.exchanges[i];
  },
  getExchangesForUser: (userId) => {
    return data.exchanges
      .filter((e) => e.requester_id === userId || e.provider_id === userId)
      .map((e) => {
        const skill = data.skills.find((s) => s.id === e.skill_id);
        const requester = data.users.find((u) => u.id === e.requester_id);
        const provider = data.users.find((u) => u.id === e.provider_id);
        return {
          ...e,
          skill_title: skill?.title,
          requester_name: requester?.full_name,
          provider_name: provider?.full_name,
          other_name: e.requester_id === userId ? provider?.full_name : requester?.full_name,
          other_id: e.requester_id === userId ? e.provider_id : e.requester_id,
          direction: e.requester_id === userId ? 'sent' : 'received',
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  // Messages
  getConversations: (userId) => {
    return data.conversations
      .filter((c) => c.user1_id === userId || c.user2_id === userId)
      .map((c) => {
        const otherId = c.user1_id === userId ? c.user2_id : c.user1_id;
        const other = data.users.find((u) => u.id === otherId);
        const skill = c.skill_id ? data.skills.find((s) => s.id === c.skill_id) : null;
        const msgs = data.messages.filter((m) => m.conversation_id === c.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const lastRead = (c.last_read && c.last_read[userId]) || '1970-01-01';
        const unread_count = data.messages.filter(
          (m) => m.conversation_id === c.id && m.sender_id !== userId && new Date(m.created_at) > new Date(lastRead)
        ).length;
        return {
          ...c,
          other_name: other?.full_name,
          other_id: otherId,
          skill_title: skill?.title,
          last_message: msgs[0]?.message_text,
          last_message_at: msgs[0]?.created_at,
          unread_count,
        };
      })
      .sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0));
  },
  markConversationRead: (convId, userId) => {
    const c = data.conversations.find((x) => x.id === convId);
    if (!c) return null;
    if (!c.last_read) c.last_read = {};
    c.last_read[userId] = new Date().toISOString();
    save(data);
    return c;
  },
  getUnreadTotal: (userId) => {
    return data.conversations
      .filter((c) => c.user1_id === userId || c.user2_id === userId)
      .reduce((sum, c) => {
        const lastRead = (c.last_read && c.last_read[userId]) || '1970-01-01';
        return sum + data.messages.filter(
          (m) => m.conversation_id === c.id && m.sender_id !== userId && new Date(m.created_at) > new Date(lastRead)
        ).length;
      }, 0);
  },
  findConversation: (id) => data.conversations.find((c) => c.id === id),
  findConversationBetween: (u1, u2) =>
    data.conversations.find((c) => (c.user1_id === u1 && c.user2_id === u2) || (c.user1_id === u2 && c.user2_id === u1)),
  createConversation: (conv) => { data.conversations.push(conv); save(data); return conv; },
  getMessages: (convId) =>
    data.messages
      .filter((m) => m.conversation_id === convId)
      .map((m) => {
        const u = data.users.find((x) => x.id === m.sender_id);
        return { ...m, sender_name: u?.full_name };
      })
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
  createMessage: (msg) => {
    data.messages.push(msg);
    save(data);
    const u = data.users.find((x) => x.id === msg.sender_id);
    return { ...msg, sender_name: u?.full_name };
  },
  createReview: (review) => {
    data.reviews.push(review);
    save(data);
    const u = data.users.find((x) => x.id === review.reviewer_id);
    return { ...review, reviewer_name: u?.full_name };
  },
  getReviewsFor: (userId) =>
    data.reviews
      .filter((r) => r.reviewed_id === userId)
      .map((r) => {
        const u = data.users.find((x) => x.id === r.reviewer_id);
        return { ...r, reviewer_name: u?.full_name };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  createNotification: (n) => {
    if (!data.notifications) data.notifications = [];
    data.notifications.push(n);
    save(data);
    return n;
  },
  getNotifications: (userId) => {
    if (!data.notifications) data.notifications = [];
    return data.notifications
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  getUnreadNotificationCount: (userId) => {
    if (!data.notifications) data.notifications = [];
    return data.notifications.filter((n) => n.user_id === userId && !n.read).length;
  },
  markNotificationsRead: (userId) => {
    if (!data.notifications) data.notifications = [];
    data.notifications.forEach((n) => {
      if (n.user_id === userId) n.read = true;
    });
    save(data);
  },
  markNotificationRead: (id, userId) => {
    if (!data.notifications) data.notifications = [];
    const n = data.notifications.find((x) => x.id === id && x.user_id === userId);
    if (n) { n.read = true; save(data); }
    return n;
  },
  getCategories: () => [...new Set(data.skills.map((s) => s.category))].sort(),
};

module.exports = { db, COMMUNITIES };
