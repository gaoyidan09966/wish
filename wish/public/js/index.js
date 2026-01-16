/* ================= A. 星空背景逻辑 ================= */
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [], meteors = [], nebulae = [], pulsars = [];
const starCount = 180;
const meteorCount = 6;
const nebulaCount = 7;
const pulsarCount = 8;
let mouse = { x: 0, y: 0 };

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

class Star {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.z = Math.random() * 2 + 0.5;
    this.size = Math.random() * 1.5;
    this.opacity = Math.random() * 0.6 + 0.4;
    const rand = Math.random();
    if (rand < 0.2) this.baseColor = 'rgba(112, 161, 255, ';
    else if (rand < 0.3) this.baseColor = 'rgba(255, 107, 129, ';
    else this.baseColor = 'rgba(255, 255, 255, ';
    this.vx = 0; this.vy = 0;
  }
  update() {
    this.y += this.z * 0.3;
    if (this.y > height + 10) {
      this.y = -10;
      this.x = Math.random() * width;
    }
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 200 && dist > 0) {
      const force = (200 - dist) / 200 * 0.04;
      this.vx += dx / dist * force;
      this.vy += dy / dist * force;
    }
    this.vx *= 0.94;
    this.vy *= 0.94;
    this.x += this.vx;
    this.y += this.vy;
    if (Math.random() > 0.97) this.opacity = Math.random() * 0.6 + 0.4;
  }
  draw() {
    ctx.fillStyle = this.baseColor + this.opacity + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Meteor {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = -20;
    this.speed = Math.random() * 7 + 5;
    this.angle = Math.random() * (Math.PI / 5) + Math.PI / 8;
    this.length = Math.random() * 80 + 40;
    this.opacity = 1;
    this.tail = [];
  }
  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.opacity -= 0.012;
    this.tail.push({ x: this.x, y: this.y, opacity: 1 });
    if (this.tail.length > 20) this.tail.shift();
    this.tail.forEach(p => p.opacity -= 0.05);
    if (this.opacity <= 0 || this.y > height + this.length) this.reset();
  }
  draw() {
    const grad = ctx.createLinearGradient(this.x, this.y, this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
    grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
    grad.addColorStop(0.4, `rgba(112, 161, 255, ${this.opacity * 0.8})`);
    grad.addColorStop(1, `rgba(255, 107, 129, 0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
    ctx.stroke();
    this.tail.forEach(p => {
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * this.opacity})`;
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    });
  }
}

class Nebula {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 180 + 120;
    this.colorHue = Math.random() < 0.5 ? [112, 161, 255] : [255, 107, 129];
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -this.radius) this.x += width + 2 * this.radius;
    if (this.x > width + this.radius) this.x -= width + 2 * this.radius;
    if (this.y < -this.radius) this.y += height + 2 * this.radius;
    if (this.y > height + this.radius) this.y -= height + 2 * this.radius;
  }
  draw() {
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    grad.addColorStop(0, `rgba(${this.colorHue[0]}, ${this.colorHue[1]}, ${this.colorHue[2]}, 0.25)`);
    grad.addColorStop(0.5, `rgba(${this.colorHue[0]}, ${this.colorHue[1]}, ${this.colorHue[2]}, 0.08)`);
    grad.addColorStop(1, `rgba(${this.colorHue[0]}, ${this.colorHue[1]}, ${this.colorHue[2]}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Pulsar {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseSize = Math.random() * 3 + 1.5;
    this.phase = Math.random() * Math.PI * 2;
  }
  update() {
    this.phase += 0.04; this.y += 0.12;
    if (this.y > height + 10) { this.y = -10; this.x = Math.random() * width; }
  }
  draw() {
    const pulse = Math.sin(this.phase) * 0.5 + 0.5;
    const size = this.baseSize * (1 + pulse * 0.8);
    const opacity = 0.6 + pulse * 0.4;
    ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, size, 0, Math.PI * 2); ctx.fill();
  }
}

function initParticles() {
  stars = Array.from({length: starCount}, () => new Star());
  meteors = Array.from({length: meteorCount}, () => new Meteor());
  nebulae = Array.from({length: nebulaCount}, () => new Nebula());
  pulsars = Array.from({length: pulsarCount}, () => new Pulsar());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';
  nebulae.forEach(n => { n.update(); n.draw(); });
  stars.forEach(s => { s.update(); s.draw(); });
  pulsars.forEach(p => { p.update(); p.draw(); });
  ctx.globalCompositeOperation = 'source-over';
  meteors.forEach(m => { m.update(); m.draw(); });
  requestAnimationFrame(animate);
}

/* ================= B. 交互与模态框 ================= */
function toggleModal() {
  const modal = document.getElementById('wishModal');
  const fab = document.querySelector('.fab-btn');
  modal.classList.toggle('active');
  const isActive = modal.classList.contains('active');
  modal.setAttribute('aria-hidden', !isActive);
  fab.style.transform = isActive ? 'scale(0) rotate(90deg)' : 'scale(1) rotate(0deg)';
  if (isActive) setTimeout(() => document.getElementById('name').focus(), 300);
}

// 事件监听初始化
document.addEventListener('DOMContentLoaded', () => {
  resize();
  initParticles();
  animate();

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', () => { resize(); initParticles(); });

  const modal = document.getElementById('wishModal');
  modal.addEventListener('click', e => { if (e.target === modal) toggleModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) toggleModal();
  });

  // 表单提交
  const form = document.getElementById('wish-form');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const content = form.content.value.trim();
    if (!name || !content) return alert('名字和愿望不能为空哦~');

    const btn = form.querySelector('.submit-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
    btn.disabled = true;

    const data = new URLSearchParams();
    data.append('name', name);
    data.append('content', content);

    try {
      const res = await fetch('/add', { method: 'POST', body: data });
      if (res.ok) {
        await new Promise(r => setTimeout(r, 600));
        addNewWishToDom(name, content);
        triggerMeteorBurst();
        form.reset();
        toggleModal();
      } else { throw new Error(); }
    } catch (err) {
      alert('发送失败，星星好像迷路了。');
    } finally {
      btn.innerHTML = orig;
      btn.disabled = false;
    }
  });

  // 为初始卡片添加效果
  document.querySelectorAll('.wish-item').forEach(addTiltToCard);
});

/* ================= C. 功能函数 ================= */
function triggerMeteorBurst() {
  for (let i = 0; i < 18; i++) {
    setTimeout(() => meteors.push(new Meteor()), i * 70);
  }
}

function addNewWishToDom(name, content) {
  const container = document.getElementById('container');
  const now = new Date();
  const timeStr = now.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).replace(/\//g, '.');

  const firstStrong = container.querySelector('.wish-item strong');
  if (firstStrong && firstStrong.innerText === '系统消息') {
    container.innerHTML = ''; 
  }

  const div = document.createElement('div');
  div.className = 'wish-item';
  div.innerHTML = `
    <strong>${escapeHtml(name)}</strong>
    <span class="content">${escapeHtml(content)}</span>
    <span class="wish-date"><i class="far fa-clock"></i> ${timeStr}</span>
  `;
  container.insertBefore(div, container.firstChild);
  addTiltToCard(div);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function addTiltToCard(card) {
  const handleMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = (cy - y) / cy * 18;
    const rotY = (x - cx) / cx * 18;
    card.style.transform = `translateY(-5px) scale(1.02) perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };
  const handleLeave = () => {
    card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    card.style.transform = '';
  };
  card.addEventListener('mouseenter', () => card.style.transition = 'transform 0.15s ease-out');
  card.addEventListener('mousemove', handleMove);
  card.addEventListener('mouseleave', handleLeave);
}