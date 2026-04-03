const data = {
      novel: [
        "Negeri 5 Menara",
        "Ranah 3 Warna",
        "Rantau 1 Muara",
        "Negeri Para Bedebah",
        "Negeri di Ujung Tanduk",
        "Bedebah di Ujung Tanduk",
        "Bibbi Bokens magische Bibliothek"
      ],
      textbook: [
        "Schelling's Game Theory — Robert V. Dodge",
        "Performance Evaluation: Metrics, Models and Benchmarks",
        "Financial Statement Analysis — CFA® Program Curriculum",
        "Purple Cow: Transform Your Business — Seth Godin"
      ]
    };

    const bookStates = { novel: false, textbook: false };
    const typewriterTimeouts = {};

    function switchTab(tab) {
      // close current open book
      const allBooks = document.querySelectorAll('.book');
      allBooks.forEach(b => {
        b.classList.remove('active', 'open');
      });
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

      document.getElementById('book-' + tab).classList.add('active');
      document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

      // reset state
      bookStates[tab] = false;
      clearTypewriters(tab);
      const entries = document.getElementById('entries-' + tab);
      entries.innerHTML = '';
    }

    function toggleBook(category) {
      const book = document.getElementById('book-' + category);
      const isOpen = bookStates[category];

      if (!isOpen) {
        book.classList.add('open');
        bookStates[category] = true;
        clearTypewriters(category);
        startTypewriter(category);
      } else {
        book.classList.remove('open');
        bookStates[category] = false;
        clearTypewriters(category);
        const entries = document.getElementById('entries-' + category);
        entries.innerHTML = '';
      }
    }

    function clearTypewriters(category) {
      if (typewriterTimeouts[category]) {
        typewriterTimeouts[category].forEach(t => clearTimeout(t));
      }
      typewriterTimeouts[category] = [];
    }

    function startTypewriter(category) {
      const entries = document.getElementById('entries-' + category);
      entries.innerHTML = '';
      const list = data[category];
      const color = category === 'novel' ? '#c8860a' : '#4fc3f7';
      const timeouts = [];

      list.forEach((title, index) => {
        const delay = 550 + index * 320;

        const t1 = setTimeout(() => {
          const li = document.createElement('li');
          li.className = 'book-entry';
          li.innerHTML = `
            <span class="entry-num">${String(index + 1).padStart(2, '0')}</span>
            <span class="entry-title"></span>
            <span class="typewriter-cursor" style="background:${color}"></span>
          `;
          entries.appendChild(li);

          // animate in
          requestAnimationFrame(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
          });

          const titleEl = li.querySelector('.entry-title');
          const cursor = li.querySelector('.typewriter-cursor');
          let i = 0;

          function typeChar() {
            if (i <= title.length) {
              titleEl.textContent = title.slice(0, i);
              i++;
              const t = setTimeout(typeChar, 28);
              typewriterTimeouts[category].push(t);
            } else {
              // remove cursor from finished items except last
              if (index < list.length - 1) {
                cursor.style.display = 'none';
              }
            }
          }

          const t2 = setTimeout(typeChar, 80);
          timeouts.push(t2);
        }, delay);

        timeouts.push(t1);
      });

      typewriterTimeouts[category] = timeouts;
    }