/* ==========================================================================
   FIKA COFFEE CO. - MODERN INTERACTIVE JAVASCRIPT
   Custom Cursor, Scroll Progress, Scroll Reveal Observer, 3D Card Tilt,
   Taste Match Quiz Widget, Quick Detail Modals, Copy Address Utility
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCustomCursor();
  initScrollReveal();
  initCard3DTilt();
  initTasteQuiz();
  initQuickItemModals();
  initNavbar();
  initMobileDrawer();
  initCafeStatus();
  initSmoothScroll();
  highlightActiveNavLink();
  initCopyAddress();
});

/* --- 1. SCROLL PROGRESS INDICATOR --- */
function initScrollProgress() {
  let progress = document.querySelector('.scroll-progress-bar');
  if (!progress) {
    progress = document.createElement('div');
    progress.className = 'scroll-progress-bar';
    document.body.appendChild(progress);
  }

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progressWidth = (window.scrollY / totalHeight) * 100;
    progress.style.width = `${progressWidth}%`;
  });
}

/* --- 2. CUSTOM MAGNETIC CURSOR FOLLOWER --- */
function initCustomCursor() {
  if (window.innerWidth <= 992) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';

  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Lerp loop for smooth follower animation
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover scale on interactive elements
  const interactives = document.querySelectorAll('a, button, .card, .tab-btn, input, textarea, select');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });
}

/* --- 3. SCROLL REVEAL INTERSECTION OBSERVER --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, optional unobserve
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* --- 4. 3D CARD TILT EFFECT --- */
function initCard3DTilt() {
  const cards = document.querySelectorAll('.card, .amenity-card');
  if (window.innerWidth <= 768) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* --- 5. INTERACTIVE TASTE MATCH QUIZ WIDGET --- */
function initTasteQuiz() {
  const quizButtons = document.querySelectorAll('.quiz-opt-btn');
  const resultCard = document.getElementById('quiz-result-card');

  if (!quizButtons.length || !resultCard) return;

  const tasteMatches = {
    bold: {
      title: "Fika Espresso Tonic 🧊",
      desc: "Bold single-origin espresso layered over artisanal Indian tonic water with fresh orange twist.",
      price: "₹290",
      tags: "Vegan • Refreshing",
      img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
      link: "menu.html#cat-brews"
    },
    creamy: {
      title: "Swedish Oat Milk Cappuccino ☕",
      desc: "Silky steamed Swedish oat milk over double shot dark roast espresso.",
      price: "₹260",
      tags: "Vegan • Dairy-Free",
      img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80",
      link: "menu.html#cat-espresso"
    },
    sweet: {
      title: "Kanelbulle + Cardamom Vanilla Latte 🥐",
      desc: "Authentic braided cinnamon bun paired with freshly cracked cardamom vanilla latte.",
      price: "₹520 Combo",
      tags: "Swedish Classic",
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
      link: "menu.html#cat-bakery"
    },
    light: {
      title: "Pour Over V60 (Chikmagalur Floral) 🌸",
      desc: "Light roast pour over with delicate notes of jasmine, nectarine & lemon zest.",
      price: "₹270",
      tags: "Single Origin • Vegan",
      img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80",
      link: "menu.html#cat-brews"
    }
  };

  quizButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      quizButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tasteKey = btn.getAttribute('data-taste');
      const match = tasteMatches[tasteKey];

      if (match) {
        resultCard.innerHTML = `
          <img src="${match.img}" alt="${match.title}" style="width:100px; height:100px; border-radius:12px; object-fit:cover; flex-shrink:0;">
          <div style="flex-grow:1;">
            <span style="font-size:0.8rem; text-transform:uppercase; color:var(--clr-gold); font-weight:700; letter-spacing:0.05em;">Your Perfect Fika Match:</span>
            <h4 style="color:white; font-size:1.2rem; font-family:var(--ff-heading); margin:4px 0;">${match.title}</h4>
            <p style="color:#D6C9BF; font-size:0.875rem; margin-bottom:8px;">${match.desc}</p>
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
              <span style="color:var(--clr-terracotta); font-weight:800; font-size:1.1rem;">${match.price}</span>
              <a href="${match.link}" class="btn btn-primary" style="padding:0.4rem 1rem; font-size:0.825rem; min-height:36px;">Order In Cafe ➔</a>
            </div>
          </div>
        `;
        resultCard.classList.add('show');
      }
    });
  });
}

/* --- 6. QUICK ITEM DETAIL MODAL --- */
function initQuickItemModals() {
  const itemData = {
    "Swedish Kanelbulle": {
      name: "Swedish Kanelbulle (Cinnamon Bun)",
      price: "₹240",
      desc: "Traditional braided sourdough pastry filled with Ceylon cinnamon, green cardamom, and sprinkled with authentic Swedish pearl sugar.",
      roast: "Freshly Baked Daily at 8:00 AM & 2:00 PM",
      flavors: ["Ceylon Cinnamon", "Cardamom", "Sourdough", "Pearl Sugar"],
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    },
    "Fika Espresso Tonic": {
      name: "Fika Espresso Tonic",
      price: "₹290",
      desc: "Single-origin Araku Valley cold espresso layered over premium Indian tonic water with a twist of fresh Valencia orange.",
      roast: "Dark Roast • Single Origin Araku Valley",
      flavors: ["Citrus Zest", "Dark Cacao", "Effervescent", "Plum"],
      img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    },
    "Smoked Avocado Toast": {
      name: "Smoked Avocado & Truffle Toast",
      price: "₹380",
      desc: "Smashed Hass avocado, white truffle oil, toasted hemp seeds, and fresh microgreens served on house-baked sourdough.",
      roast: "Artisanal Sourdough • Organic Avocado",
      flavors: ["White Truffle", "Creamy Hass", "Toasted Hemp", "Microgreens"],
      img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
    },
    "Swedish Oat Cappuccino": {
      name: "Swedish Oat Milk Cappuccino",
      price: "₹260",
      desc: "Silky steamed Swedish oat milk paired with our dark roast espresso blend. Smooth, creamy, naturally sweet finish.",
      roast: "Medium-Dark Blend",
      flavors: ["Toasted Oats", "Espresso Cream", "Caramel Finish"],
      img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80"
    }
  };

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    const titleEl = card.querySelector('.card-title');
    if (!titleEl) return;

    const titleText = titleEl.textContent.trim();
    const data = itemData[titleText];

    if (data) {
      openItemModal(data);
    }
  });
}

function openItemModal(data) {
  let modalOverlay = document.getElementById('item-detail-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'item-detail-modal-overlay';
    modalOverlay.className = 'cookie-modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  const flavorPills = data.flavors.map(f => `<span class="flavor-pill">✨ ${f}</span>`).join(' ');

  modalOverlay.innerHTML = `
    <div class="item-modal-content">
      <div style="position:relative;">
        <img src="${data.img}" alt="${data.name}" class="item-modal-img">
        <button id="item-modal-close" style="position:absolute; top:1rem; right:1rem; background:rgba(0,0,0,0.6); color:white; border:none; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer;">&times;</button>
      </div>
      <div class="item-modal-body">
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.5rem;">
          <h3 class="font-heading" style="font-size:1.5rem;">${data.name}</h3>
          <span style="font-family:var(--ff-accent); font-weight:800; font-size:1.3rem; color:var(--clr-terracotta);">${data.price}</span>
        </div>
        <p style="font-size:0.95rem; margin-bottom:1rem;">${data.desc}</p>
        <div style="font-size:0.85rem; color:var(--clr-sage); font-weight:700; margin-bottom:0.75rem;">🌱 ${data.roast}</div>
        <div style="margin-bottom:1.5rem;">
          <strong style="display:block; font-size:0.85rem; color:var(--clr-espresso); text-transform:uppercase; margin-bottom:0.4rem;">Flavor Profile & Notes:</strong>
          <div class="flavor-notes-bar">${flavorPills}</div>
        </div>
        <div style="display:flex; gap:1rem;">
          <a href="menu.html" class="btn btn-primary" style="flex:1;">View On Menu 🍷</a>
          <button onclick="document.getElementById('item-detail-modal-overlay').classList.remove('show')" class="btn btn-outline">Close</button>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => modalOverlay.classList.add('show'), 10);
  document.getElementById('item-modal-close')?.addEventListener('click', () => modalOverlay.classList.remove('show'));
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('show');
  });
}

/* --- 7. COPY ADDRESS TO CLIPBOARD UTILITY --- */
function initCopyAddress() {
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy-address]');
    if (!copyBtn) return;

    const addressText = "T40, Hauz Khas Village, Deer Park, Hauz Khas, New Delhi, Delhi 110016";
    navigator.clipboard.writeText(addressText).then(() => {
      if (window.showToast) {
        window.showToast('📋 Address copied to clipboard!');
      }
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
}

/* --- NAVBAR STICKY EFFECT --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --- MOBILE DRAWER --- */
function initMobileDrawer() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileClose = document.querySelector('.mobile-drawer-close');

  if (!mobileToggle || !mobileDrawer) return;

  function openDrawer() {
    mobileDrawer.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', openDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  const drawerLinks = mobileDrawer.querySelectorAll('.nav-link, .btn');
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
}

/* --- CAFE OPEN/CLOSED STATUS --- */
function initCafeStatus() {
  const statusElement = document.getElementById('cafe-open-status');
  if (!statusElement) return;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const openHour = 8;
  const closeHour = 23;

  const isOpen = (currentHour > openHour || (currentHour === openHour && currentMinute >= 0)) && 
                 (currentHour < closeHour);

  if (isOpen) {
    statusElement.innerHTML = `
      <span class="badge badge-open">
        <span class="pulse-dot"></span> Open Now (Closes at 11:00 PM)
      </span>
    `;
  } else {
    statusElement.innerHTML = `
      <span class="badge badge-closed">
        ● Closed - Opens at 8:00 AM
      </span>
    `;
  }
}

/* --- SMOOTH SCROLL FOR ANCHORS --- */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="#location-map"]');
    if (!link) return;

    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/') ||
                       !window.location.pathname.includes('.html');

    if (isHomePage) {
      const targetSection = document.getElementById('location-map');
      if (targetSection) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
}

/* --- ACTIVE NAV HIGHLIGHT --- */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const linkPath = href.split('#')[0];
    if (currentPath.endsWith(linkPath) || (linkPath === 'index.html' && (currentPath.endsWith('/') || currentPath === ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- GLOBAL TOAST --- */
window.showToast = function(message, duration = 4000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
};
