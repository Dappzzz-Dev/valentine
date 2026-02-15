// ===================== MUSIC PLAYER =====================
const playlist = [
  { file: 'music/Teenage_Dream_-_Stephen_Dawes.mp3', title: 'Teenage Dream', artist: 'Stephen Dawes' },
  { file: 'music/Her_-_jvke.mp3', title: 'Her', artist: 'JVKE' },
  { file: 'music/Unconditionally_-_Kety_Perry.mp3', title: 'Unconditionally', artist: 'Katy Perry' },
  { file: 'music/White_Horse_-_Taylor_Swift.mp3', title: 'White Horse', artist: 'Taylor Swift' },
];

// Shuffle the remaining songs (after the first one)
function shuffleAfterFirst(arr) {
  const first = arr[0];
  const rest = arr.slice(1).sort(() => Math.random() - 0.5);
  return [first, ...rest];
}

let shuffledPlaylist = shuffleAfterFirst(playlist);
let currentTrack = 0;
let audio = new Audio();
let isMuted = false;
let hasInteracted = false;

function loadTrack(index) {
  const track = shuffledPlaylist[index];
  audio.src = track.file;
  audio.loop = false;
  audio.volume = 0.6;

  // Update UI
  document.getElementById('music-title').textContent = track.title;
  document.getElementById('music-artist').textContent = track.artist;

  // Animate track change
  const info = document.getElementById('music-info');
  info.classList.remove('track-slide');
  void info.offsetWidth;
  info.classList.add('track-slide');
}

function playNext() {
  currentTrack = (currentTrack + 1) % shuffledPlaylist.length;
  // Re-shuffle when playlist completes
  if (currentTrack === 0) shuffledPlaylist = shuffleAfterFirst(playlist);
  loadTrack(currentTrack);
  audio.play().catch(() => {});
}

audio.addEventListener('ended', playNext);

// Update progress bar
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('music-bar').style.width = pct + '%';
  }
});

function toggleMute() {
  isMuted = !isMuted;
  audio.muted = isMuted;
  const btn = document.getElementById('music-toggle');
  btn.textContent = isMuted ? '🔇' : '🎵';
  btn.classList.toggle('muted', isMuted);
}

function startMusic() {
  if (!hasInteracted) {
    hasInteracted = true;
    loadTrack(0);
    audio.play().catch(() => {});
    document.getElementById('music-player').classList.add('visible');
  }
}

// Auto-play on first user interaction anywhere
document.addEventListener('click', startMusic, { once: true });
document.addEventListener('touchstart', startMusic, { once: true });

// ===================== PARTICLES =====================
const emojis = ['💗', '🌹', '💫', '✨', '🥀', '💕', '🌸'];
const container = document.getElementById('particles');
for (let i = 0; i < 20; i++) {
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.7 + Math.random() * 0.8) + 'rem';
  el.style.animationDuration = (8 + Math.random() * 12) + 's';
  el.style.animationDelay = (Math.random() * 12) + 's';
  container.appendChild(el);
}

// ===================== NAVIGATION =====================
const screens = {
  intro: 'screen-intro',
  game: 'screen-game',
  message: 'screen-message',
  gift: 'screen-gift',
  final: 'screen-final'
};
let currentScreen = 'intro';

function goTo(name) {
  document.getElementById(screens[currentScreen]).classList.add('hidden');
  document.getElementById(screens[name]).classList.remove('hidden');
  currentScreen = name;
  if (name === 'game') initGame();
  if (name === 'final') triggerConfetti();
}

// ===================== CARD GAME =====================
const cardEmojis = ['💗', '🌹', '💫', '✨'];
let cards = [], flipped = [], matched = 0, canFlip = true;

function initGame() {
  const grid = document.getElementById('cardGrid');
  grid.innerHTML = '';
  matched = 0;
  flipped = [];
  canFlip = true;
  cards = [...cardEmojis, ...cardEmojis].sort(() => Math.random() - 0.5);
  cards.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.emoji = emoji;
    card.dataset.index = i;
    card.innerHTML = `<div class="card-inner"><div class="card-back">💗</div><div class="card-front">${emoji}</div></div>`;
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });
}

function flipCard() {
  if (!canFlip || this.classList.contains('flipped') || this.classList.contains('matched')) return;
  this.classList.add('flipped');
  flipped.push(this);
  if (flipped.length === 2) {
    canFlip = false;
    setTimeout(() => {
      if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
        flipped.forEach(c => { c.classList.add('matched'); c.classList.remove('flipped'); });
        matched++;
        if (matched === cardEmojis.length) setTimeout(() => goTo('message'), 700);
      } else {
        flipped.forEach(c => c.classList.remove('flipped'));
      }
      flipped = [];
      canFlip = true;
    }, 900);
  }
}

// ===================== GIFT =====================
function openGift() {
  const box = document.getElementById('giftBox');
  box.classList.add('gift-explode');
  box.textContent = '🎊';
  setTimeout(() => { goTo('final'); }, 700);
}

// ===================== CONFETTI =====================
function triggerConfetti() {
  const colors = ['#c8415b', '#d4956a', '#f2899a', '#fce8ec', '#ffffff'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random() * 3) + 's';
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.width = piece.style.height = (4 + Math.random() * 8) + 'px';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 4000);
    }, i * 40);
  }
}

// ===================== SHARE / COPY =====================
function shareThis() {
  const text = "💌 Happy Valentine's Day! Ada pesan spesial untukmu";
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: 'Valentine untuk Kamu 💗', text, url }).catch(() => {});
  } else {
    copyLink();
  }
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }).catch(() => {
    showToast('Salin URL dari browser kamu ya!');
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===================== RIPPLE on buttons =====================
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'ripple-effect';
    r.style.left = e.clientX - this.getBoundingClientRect().left + 'px';
    r.style.top = e.clientY - this.getBoundingClientRect().top + 'px';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});
