document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  const cards = Array.from(track.children);

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function cardWidth() {
    const card = cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });

  // Update active dot on scroll
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const index = Math.round(track.scrollLeft / cardWidth());
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }, 80);
  });

  // Auto-scroll loop (gentle, pauses on hover/interaction)
  let autoTimer;
  function startAuto() {
    autoTimer = setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 2) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
      }
    }, 4500);
  }
  function stopAuto() { clearInterval(autoTimer); }

  startAuto();
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  track.addEventListener('touchstart', stopAuto, { passive: true });
});

// Importa os 5 primeiros produtos de produtos.html
fetch('produtos.html')
  .then(r => r.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const cards = Array.from(doc.querySelectorAll('#productsGrid .product-card')).slice(0, 5);
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    cards.forEach(card => track.appendChild(card));
    // reinicia o carrossel após inserir os cards
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });