const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

// ── ICON 1024x1024 ──────────────────────────────────────────────
function generateIcon() {
  const size = 1024;
  const c = createCanvas(size, size);
  const ctx = c.getContext('2d');

  // Background gradient — deep purple/navy
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, '#1A0A2E');
  bg.addColorStop(0.5, '#2E1B6B');
  bg.addColorStop(1, '#0D0820');
  ctx.fillStyle = bg;
  ctx.roundRect(0, 0, size, size, 180);
  ctx.fill();

  // Subtle radial glow center
  const glow = ctx.createRadialGradient(512, 430, 0, 512, 430, 420);
  glow.addColorStop(0, 'rgba(123,82,171,0.45)');
  glow.addColorStop(1, 'rgba(123,82,171,0)');
  ctx.fillStyle = glow;
  ctx.roundRect(0, 0, size, size, 180);
  ctx.fill();

  // Outer decorative ring
  ctx.strokeStyle = 'rgba(123,82,171,0.35)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(512, 430, 310, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.strokeStyle = 'rgba(174,133,220,0.2)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(512, 430, 270, 0, Math.PI * 2);
  ctx.stroke();

  // Circle background for emoji area
  const circleBg = ctx.createRadialGradient(512, 430, 0, 512, 430, 230);
  circleBg.addColorStop(0, 'rgba(123,82,171,0.6)');
  circleBg.addColorStop(1, 'rgba(74,48,128,0.3)');
  ctx.fillStyle = circleBg;
  ctx.beginPath();
  ctx.arc(512, 430, 230, 0, Math.PI * 2);
  ctx.fill();

  // 🏛️ emoji
  ctx.font = '380px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏛️', 512, 445);

  // App name below
  ctx.font = 'bold 62px serif';
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('PhilosopherChat', 512, 870);

  // Tagline
  ctx.font = '32px serif';
  ctx.fillStyle = 'rgba(174,133,220,0.8)';
  ctx.fillText('Talk to the Greatest Minds', 512, 920);

  const buf = c.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'icon.png'), buf);
  console.log('✓ icon.png (1024×1024)');
}

// ── ADAPTIVE ICON (Android foreground) ──────────────────────────
function generateAdaptiveIcon() {
  const size = 1024;
  const c = createCanvas(size, size);
  const ctx = c.getContext('2d');

  // transparent background
  ctx.clearRect(0, 0, size, size);

  // Circle
  const circleBg = ctx.createRadialGradient(512, 512, 0, 512, 512, 340);
  circleBg.addColorStop(0, '#7B52AB');
  circleBg.addColorStop(1, '#2E1B6B');
  ctx.fillStyle = circleBg;
  ctx.beginPath();
  ctx.arc(512, 512, 340, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '320px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏛️', 512, 520);

  const buf = c.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), buf);
  console.log('✓ adaptive-icon.png (1024×1024)');
}

// ── SPLASH SCREEN 1284x2778 ─────────────────────────────────────
function generateSplash() {
  const w = 1284, h = 2778;
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0D0820');
  bg.addColorStop(0.5, '#1A0A2E');
  bg.addColorStop(1, '#0A0515');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Center glow
  const glow = ctx.createRadialGradient(642, 1200, 0, 642, 1200, 600);
  glow.addColorStop(0, 'rgba(123,82,171,0.4)');
  glow.addColorStop(1, 'rgba(123,82,171,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Outer ring
  ctx.strokeStyle = 'rgba(123,82,171,0.3)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(642, 1200, 420, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.strokeStyle = 'rgba(174,133,220,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(642, 1200, 370, 0, Math.PI * 2);
  ctx.stroke();

  // Circle bg
  const circleBg = ctx.createRadialGradient(642, 1200, 0, 642, 1200, 300);
  circleBg.addColorStop(0, 'rgba(123,82,171,0.5)');
  circleBg.addColorStop(1, 'rgba(74,48,128,0.2)');
  ctx.fillStyle = circleBg;
  ctx.beginPath();
  ctx.arc(642, 1200, 300, 0, Math.PI * 2);
  ctx.fill();

  // Emoji
  ctx.font = '480px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏛️', 642, 1215);

  // App name
  ctx.font = 'bold 88px serif';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('PhilosopherChat', 642, 1660);

  // Tagline
  ctx.font = '46px serif';
  ctx.fillStyle = 'rgba(174,133,220,0.75)';
  ctx.fillText('Talk to the Greatest Minds', 642, 1730);

  const buf = c.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'splash.png'), buf);
  console.log('✓ splash.png (1284×2778)');
}

// ── FAVICON 48x48 ───────────────────────────────────────────────
function generateFavicon() {
  const size = 48;
  const c = createCanvas(size, size);
  const ctx = c.getContext('2d');
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, '#2E1B6B');
  bg.addColorStop(1, '#0D0820');
  ctx.fillStyle = bg;
  ctx.roundRect(0, 0, size, size, 10);
  ctx.fill();
  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏛️', 24, 26);
  const buf = c.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'favicon.png'), buf);
  console.log('✓ favicon.png (48×48)');
}

generateIcon();
generateAdaptiveIcon();
generateSplash();
generateFavicon();
console.log('\n✅ Bütün asset-lər hazırdır!');
