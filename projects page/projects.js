// SIMPLE JS: toggle panels (one-open-at-time), ESC to close, keyboard accessibility
  (function () {
    const panels = Array.from(document.querySelectorAll('.project-panel'));

    function closeAll() {
      panels.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-expanded', 'false');
      });
    }

    function openPanel(el) {
      closeAll();
      el.classList.add('active');
      el.setAttribute('aria-expanded', 'true');
    }

    // click handler
    panels.forEach(p => {
      p.addEventListener('click', (e) => {
        const isActive = p.classList.contains('active');
        if (isActive) {
          closeAll();
        } else {
          openPanel(p);
        }
      });

      // keyboard support: Enter or Space toggles
      p.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          p.click();
        }
      });
    });

    // close on Escape
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeAll();
    });

    // optional: close if clicking outside panels (rare because panels fill center)
    document.addEventListener('click', (ev) => {
      const inside = ev.target.closest('.project-panel');
      if (!inside) {
        // don't close if click is on the "Learn more" anchor (they have preventDefault)
        closeAll();
      }
    });
  })();
