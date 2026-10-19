const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillshare-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function publicUser(u) {
  if (!u) return null;
  return { id: u.id, full_name: u.full_name, email: u.email, location: u.location || '', phone: u.phone || '', bio: u.bio || '' };
}

// AUTH
app.post('/api/auth/register', (req, res) => {
  try {
    const { full_name, email, password, location, bio, phone } = req.body;
    if (!full_name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    if (db.findUserByEmail(email)) return res.status(400).json({ error: 'Email already registered' });
    const user = {
      id: uuidv4(), full_name, email,
      password_hash: bcrypt.hashSync(password, 10),
      location: location || '', phone: phone || '', bio: bio || '',
      created_at: new Date().toISOString(),
    };
    db.createUser(user);
    const token = jwt.sign({ id: user.id, email: user.email, full_name: user.full_name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.findUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, full_name: user.full_name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// STATS
app.get('/api/stats', (req, res) => res.json(db.getStats()));

// USERS
app.get('/api/users/:id', auth, (req, res) => {
  const user = db.findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const skills = db.getSkillsByUser(req.params.id);
  const reviews = db.getReviewsFor(req.params.id);
  const avg_rating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  res.json({ ...publicUser(user), created_at: user.created_at, skills, reviews, avg_rating, review_count: reviews.length });
});

app.put('/api/users/:id', auth, (req, res) => {
  if (req.user.id !== req.params.id) return res.status(403).json({ error: 'Can only update your own profile' });
  const { full_name, location, bio, phone } = req.body;
  const updated = db.updateUser(req.params.id, {
    ...(full_name !== undefined && { full_name }),
    ...(location !== undefined && { location }),
    ...(bio !== undefined && { bio }),
    ...(phone !== undefined && { phone }),
  });
  res.json(publicUser(updated));
});

// SKILLS
app.get('/api/skills', (req, res) => res.json(db.getSkills({ q: req.query.q, category: req.query.category })));
app.get('/api/skills/:id', (req, res) => {
  const skill = db.findSkill(req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  res.json(skill);
});
app.post('/api/skills', auth, (req, res) => {
  const { title, description, category, icon } = req.body;
  if (!title || !description || !category) return res.status(400).json({ error: 'Title, description and category required' });
  const skill = {
    id: uuidv4(), user_id: req.user.id, title, description, category,
    icon: icon || 'star', type: 'offering', created_at: new Date().toISOString(),
  };
  res.status(201).json(db.createSkill(skill));
});
app.put('/api/skills/:id', auth, (req, res) => {
  const skill = db.findSkill(req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  if (skill.user_id !== req.user.id) return res.status(403).json({ error: 'Not your skill' });
  const { title, description, category } = req.body;
  res.json(db.updateSkill(req.params.id, {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(category !== undefined && { category }),
  }));
});
app.delete('/api/skills/:id', auth, (req, res) => {
  const skill = db.findSkill(req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  if (skill.user_id !== req.user.id) return res.status(403).json({ error: 'Not your skill' });
  db.deleteSkill(req.params.id);
  res.json({ message: 'Skill deleted' });
});
app.get('/api/users/:id/skills', (req, res) => res.json(db.getSkillsByUser(req.params.id)));
app.get('/api/categories', (req, res) => res.json(db.getCategories()));

// EXCHANGES
app.get('/api/exchanges', auth, (req, res) => {
  res.json(db.getExchangesForUser(req.user.id));
});

app.post('/api/exchanges', auth, (req, res) => {
  const { skill_id, message } = req.body;
  if (!skill_id) return res.status(400).json({ error: 'skill_id required' });
  const skill = db.findSkill(skill_id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  if (skill.user_id === req.user.id) return res.status(400).json({ error: 'Cannot request your own skill' });
  const ex = {
    id: uuidv4(),
    skill_id,
    requester_id: req.user.id,
    provider_id: skill.user_id,
    message: message || '',
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  res.status(201).json(db.createExchange(ex));
});

app.patch('/api/exchanges/:id', auth, (req, res) => {
  const ex = db.findExchange(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Exchange not found' });
  const { status } = req.body;
  if (!['accepted', 'declined', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if ((status === 'accepted' || status === 'declined') && ex.provider_id !== req.user.id) {
    return res.status(403).json({ error: 'Only the skill provider can accept/decline' });
  }
  if (status === 'completed' && ex.requester_id !== req.user.id && ex.provider_id !== req.user.id) {
    return res.status(403).json({ error: 'Not your exchange' });
  }
  const updated = db.updateExchange(req.params.id, { status });
  if (status === 'accepted') {
    let conv = db.findConversationBetween(ex.requester_id, ex.provider_id);
    if (!conv) {
      conv = {
        id: uuidv4(),
        user1_id: ex.requester_id,
        user2_id: ex.provider_id,
        skill_id: ex.skill_id,
        created_at: new Date().toISOString(),
      };
      db.createConversation(conv);
    }
  }
  res.json(updated);
});

// MESSAGES
app.get('/api/messages/conversations', auth, (req, res) => res.json(db.getConversations(req.user.id)));

app.get('/api/messages/unread-count', auth, (req, res) => {
  res.json({ count: db.getUnreadTotal(req.user.id) });
});

app.post('/api/messages/:conversationId/read', auth, (req, res) => {
  const conv = db.findConversation(req.params.conversationId);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  if (conv.user1_id !== req.user.id && conv.user2_id !== req.user.id) {
    return res.status(403).json({ error: 'Not your conversation' });
  }
  db.markConversationRead(req.params.conversationId, req.user.id);
  res.json({ ok: true });
});

app.post('/api/messages/start', auth, (req, res) => {
  const { other_user_id, skill_id } = req.body;
  if (!other_user_id) return res.status(400).json({ error: 'other_user_id required' });
  if (other_user_id === req.user.id) return res.status(400).json({ error: 'Cannot message yourself' });
  let conv = db.findConversationBetween(req.user.id, other_user_id);
  if (!conv) {
    conv = {
      id: uuidv4(),
      user1_id: req.user.id,
      user2_id: other_user_id,
      skill_id: skill_id || null,
      created_at: new Date().toISOString(),
    };
    db.createConversation(conv);
  }
  res.json(conv);
});

app.get('/api/messages/:conversationId', auth, (req, res) => {
  const conv = db.findConversation(req.params.conversationId);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  if (conv.user1_id !== req.user.id && conv.user2_id !== req.user.id) {
    return res.status(403).json({ error: 'Not your conversation' });
  }
  res.json(db.getMessages(req.params.conversationId));
});

app.post('/api/messages', auth, (req, res) => {
  const { conversation_id, message_text, contact_shared } = req.body;
  if (!conversation_id || !message_text) return res.status(400).json({ error: 'conversation_id and message_text required' });
  const conv = db.findConversation(conversation_id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  if (conv.user1_id !== req.user.id && conv.user2_id !== req.user.id) {
    return res.status(403).json({ error: 'Not your conversation' });
  }
  const msg = {
    id: uuidv4(),
    conversation_id,
    sender_id: req.user.id,
    message_text,
    contact_shared: contact_shared ? 1 : 0,
    created_at: new Date().toISOString(),
  };
  res.status(201).json(db.createMessage(msg));
});

// REVIEWS
app.post('/api/reviews', auth, (req, res) => {
  const { reviewed_id, skill_id, rating, comment } = req.body;
  if (!reviewed_id || !rating) return res.status(400).json({ error: 'reviewed_id and rating required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
  if (reviewed_id === req.user.id) return res.status(400).json({ error: 'Cannot review yourself' });
  const review = {
    id: uuidv4(), reviewer_id: req.user.id, reviewed_id,
    skill_id: skill_id || null, rating: Number(rating), comment: comment || '',
    created_at: new Date().toISOString(),
  };
  res.status(201).json(db.createReview(review));
});
app.get('/api/users/:id/reviews', (req, res) => res.json(db.getReviewsFor(req.params.id)));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => console.log(`SkillShare backend running on port ${PORT}`));
