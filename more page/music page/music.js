const GENRES = {
      hiphop: {
        label: 'Hip-Hop',
        color: '#ff3c3c',
        accent: '#ff7070',
        artists: ['2Pac', 'The Notorious B.I.G.', 'Nas', 'Eazy-E']
      },
      rock: {
        label: 'Rock',
        color: '#4fc3f7',
        accent: '#81d4fa',
        artists: ["Guns N' Roses", 'The Beatles', 'Oasis', 'Nirvana']
      },
      country: {
        label: 'Country',
        color: '#f5c518',
        accent: '#ffe066',
        artists: ['Kris Kristofferson', 'Waylon Jennings', 'Johnny Cash', 'Willie Nelson']
      }
    };

    let currentGenre = 'hiphop';
    let isPlaying = false;

    // ── VINYL CANVAS ──────────────────────────────
    function drawVinyl(color) {
      const canvas = document.getElementById('vinyl-canvas');
      const ctx = canvas.getContext('2d');
      const cx = 150, cy = 150, r = 148;

      ctx.clearRect(0, 0, 300, 300);

      // outer disc
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0,    '#2a2a2a');
      grad.addColorStop(0.35, '#111');
      grad.addColorStop(1,    '#0a0a0a');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // grooves
      for (let i = 30; i < r - 10; i += 5) {
        ctx.beginPath();
        ctx.arc(cx, cy, i, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.015 + (i % 15 === 0 ? 0.03 : 0)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // colored band near label
      const band = ctx.createRadialGradient(cx, cy, 44, cx, cy, 58);
      band.addColorStop(0,   color + '00');
      band.addColorStop(0.3, color + '55');
      band.addColorStop(1,   color + '00');
      ctx.beginPath();
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.fillStyle = band;
      ctx.fill();

      // label circle
      const lgrad = ctx.createRadialGradient(cx - 8, cy - 8, 2, cx, cy, 42);
      lgrad.addColorStop(0, '#3a3a3a');
      lgrad.addColorStop(1, '#1a1a1a');
      ctx.beginPath();
      ctx.arc(cx, cy, 42, 0, Math.PI * 2);
      ctx.fillStyle = lgrad;
      ctx.fill();
      ctx.strokeStyle = color + '44';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // center hole
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a0f';
      ctx.fill();

      // shine
      const shine = ctx.createRadialGradient(cx - 40, cy - 40, 0, cx, cy, r);
      shine.addColorStop(0,   'rgba(255,255,255,0.06)');
      shine.addColorStop(0.5, 'rgba(255,255,255,0)');
      shine.addColorStop(1,   'rgba(0,0,0,0.2)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shine;
      ctx.fill();
    }

    // ── SWITCH GENRE ───────────────────────────────
    function switchGenre(genre) {
      if (genre === currentGenre && isPlaying) return;

      // reset playing
      if (isPlaying) toggleVinyl();

      currentGenre = genre;
      const g = GENRES[genre];

      // tabs
      document.querySelectorAll('.genre-tab').forEach(t => {
        t.classList.remove('active', 'hiphop', 'rock', 'country');
      });
      const tab = document.querySelector(`[data-genre="${genre}"]`);
      tab.classList.add('active', genre);

      // bg glow
      const bg = document.getElementById('bg-glow');
      bg.className = `bg-glow ${genre}`;

      // vinyl
      drawVinyl(g.color);

      // info
      document.getElementById('info-genre').textContent = g.label;
      document.getElementById('info-genre').style.color = g.color;

      // artists — stagger in
      const panel = document.getElementById('info-panel');
      const list  = document.getElementById('artist-list');

      // hide first
      panel.classList.remove('visible');
      list.innerHTML = '';

      setTimeout(() => {
        list.innerHTML = g.artists.map((a, i) => `
          <li class="artist-item ${genre}" style="transition-delay:${i * 0.07}s">
            <span class="artist-num">0${i + 1}</span>
            <span class="artist-name">${a}</span>
            <span class="artist-dot"></span>
          </li>
        `).join('');

        panel.classList.add('visible');

        // stagger items
        requestAnimationFrame(() => {
          document.querySelectorAll('.artist-item').forEach((el, i) => {
            setTimeout(() => el.classList.add('show'), i * 80);
          });
        });
      }, 200);
    }

    // ── TOGGLE VINYL ──────────────────────────────
    function toggleVinyl() {
      isPlaying = !isPlaying;
      const vinyl  = document.getElementById('vinyl');
      const needle = document.getElementById('needle');
      const wrap   = document.getElementById('vinyl-wrap');

      vinyl.classList.toggle('playing', isPlaying);
      needle.classList.toggle('on-record', isPlaying);
      wrap.classList.toggle('playing', isPlaying);
    }

    // ── INIT ──────────────────────────────────────
    drawVinyl(GENRES.hiphop.color);

    // show info after short delay
    setTimeout(() => switchGenre('hiphop'), 300);