/**
 * ACET College Complaint Portal – Shared Data Layer
 * All data is stored in localStorage to simulate a backend.
 * Keys used:
 *   acet_complaints        → Array of all complaint objects
 *   acet_notifs_<username> → Array of notifications per user
 *   acet_user              → Currently logged-in user
 *   acet_logged_in         → 'true' if logged in
 *   acet_registered_users  → Array of registered student accounts
 */

// ============================================================
// SEED DATA – Pre-loaded demo complaints for student1
// ============================================================
const SEED_COMPLAINTS = [
  {
    id: 1700000001,
    student: 'student1',
    title: 'Exam timetable not updated on portal',
    category: 'Academics',
    description: 'The exam timetable for 3rd semester was supposed to be updated by October 1st but it still shows old data. Many students are confused about which hall to report to.',
    status: 'Resolved',
    response: 'The timetable has been updated on the portal. Please clear your browser cache and reload. Contact exam cell at extension 201 for further clarification.',
    submitted_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 1700000002,
    student: 'student1',
    title: 'Hostel water supply not available in Block C',
    category: 'Hostel',
    description: 'Water supply in Block C girls hostel has been irregular since last Monday. Rooms 201–230 are most affected. Morning water supply cuts off by 6 AM which causes a lot of inconvenience.',
    status: 'In Progress',
    response: null,
    submitted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 1700000003,
    student: 'student1',
    title: 'Library projector not functioning',
    category: 'Infrastructure',
    description: 'The projector in the library reading hall (Room 104) has been broken for two weeks. It is needed for study group presentations and seminar preparations.',
    status: 'Pending',
    response: null,
    submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 1700000004,
    student: 'priya',
    title: 'Wi-Fi not working in CSE Department',
    category: 'Infrastructure',
    description: 'The Wi-Fi connection in the CSE department lab block has been extremely slow or completely absent since the last week. This is affecting our practical sessions and lab assignments.',
    status: 'Pending',
    response: null,
    submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 1700000005,
    student: 'rahul',
    title: 'Canteen food quality has deteriorated',
    category: 'Others',
    description: 'The quality of food served in the main canteen has dropped significantly in the past month. Several students have complained of stomach issues after eating there. Please take strict action.',
    status: 'In Progress',
    response: 'We have contacted the canteen management and a quality inspection has been scheduled for this Friday. Please avoid the canteen until further notice.',
    submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 1700000006,
    student: 'student1',
    title: 'Attendance not marked properly in EEE subject',
    category: 'Academics',
    description: 'My attendance for the EEE subject (EE5201) has not been marked for the past 3 classes even though I was physically present. The professor might have missed it. This is affecting my attendance percentage.',
    status: 'Pending',
    response: null,
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const SEED_NOTIFS = {
  student1: [
    { id: 1, icon: '✅', text: 'Your complaint "Exam timetable not updated" has been Resolved!', time: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), read: true },
    { id: 2, icon: '🔄', text: 'Your complaint "Hostel water supply" is now In Progress.', time: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), read: false },
    { id: 3, icon: '📝', text: 'Your complaint "Library projector" has been received and is under review.', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), read: false },
  ]
};

// ============================================================
// INIT – Seed data on first load
// ============================================================
function initSeedData() {
  if (!localStorage.getItem('acet_seeded')) {
    localStorage.setItem('acet_complaints', JSON.stringify(SEED_COMPLAINTS));
    Object.entries(SEED_NOTIFS).forEach(([user, notifs]) => {
      localStorage.setItem('acet_notifs_' + user, JSON.stringify(notifs));
    });
    localStorage.setItem('acet_seeded', 'true');
  }
}
initSeedData();

// ============================================================
// COMPLAINTS CRUD
// ============================================================

/** Get complaints for a specific student */
function getComplaints(username) {
  const all = JSON.parse(localStorage.getItem('acet_complaints') || '[]');
  return all.filter(c => c.student === username);
}

/** Get ALL complaints (admin) */
function getAllComplaints() {
  return JSON.parse(localStorage.getItem('acet_complaints') || '[]');
}

/** Add a new complaint */
function addComplaint(complaint) {
  const all = JSON.parse(localStorage.getItem('acet_complaints') || '[]');
  all.push(complaint);
  localStorage.setItem('acet_complaints', JSON.stringify(all));
}

/** Update a complaint's status and response (admin) */
function updateComplaint(id, newStatus, response) {
  const all = JSON.parse(localStorage.getItem('acet_complaints') || '[]');
  const idx = all.findIndex(c => c.id == id);
  if (idx !== -1) {
    all[idx].status = newStatus;
    if (response) all[idx].response = response;
    localStorage.setItem('acet_complaints', JSON.stringify(all));
  }
}

// ============================================================
// NOTIFICATIONS
// ============================================================

function getNotifications(username) {
  return JSON.parse(localStorage.getItem('acet_notifs_' + username) || '[]');
}

function addNotification(username, notif) {
  const notifs = getNotifications(username);
  notif.id = Date.now();
  notif.read = false;
  notifs.unshift(notif);
  localStorage.setItem('acet_notifs_' + username, JSON.stringify(notifs.slice(0, 20)));
}

// ============================================================
// UTILITY FUNCTIONS (also used in main.js)
// ============================================================

/** Format ISO date to readable string */
function formatDate(iso) {
  if (!iso) return '–';
  const d = new Date(iso);
  const opts = { day: '2-digit', month: 'short', year: 'numeric' };
  return d.toLocaleDateString('en-IN', opts);
}

/** Render a status badge HTML string */
function statusBadge(status) {
  const map = {
    'Pending': `<span class="status-badge status-pending"><span class="status-dot dot-pending"></span>Pending</span>`,
    'In Progress': `<span class="status-badge status-progress"><span class="status-dot dot-progress"></span>In Progress</span>`,
    'Resolved': `<span class="status-badge status-resolved"><span class="status-dot dot-resolved"></span>Resolved</span>`
  };
  return map[status] || `<span class="status-badge">${status}</span>`;
}

/** Draw a donut SVG chart */
function drawDonut(svgId, values, colors, total) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  // Remove old segments
  svg.querySelectorAll('.donut-seg').forEach(el => el.remove());
  if (!total) return;

  const r = 52, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  values.forEach((val, i) => {
    if (!val) return;
    const pct = val / total;
    const dash = pct * circ;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', colors[i]);
    circle.setAttribute('stroke-width', '20');
    circle.setAttribute('stroke-dasharray', `${dash} ${circ - dash}`);
    circle.setAttribute('stroke-dashoffset', -offset);
    circle.setAttribute('transform', `rotate(-90 ${cx} ${cy})`);
    circle.setAttribute('class', 'donut-seg');
    circle.style.transition = 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)';
    svg.appendChild(circle);
    offset += dash;
  });
}

/** Animate a count-up number */
function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start;
    if (start >= target) clearInterval(timer);
  }, 30);
}
