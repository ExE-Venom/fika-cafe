/* ==========================================================================
   FIKA COFFEE CO. - MENU INTERACTIVITY & PDF DOWNLOAD
   Category Filtering, Live Search, Dietary Filters, PDF Download Handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMenuFilters();
  initMenuSearch();
  initMenuDownload();
});

/* --- CATEGORY TAB FILTERING --- */
function initMenuFilters() {
  const tabs = document.querySelectorAll('.tab-btn');
  const categorySections = document.querySelectorAll('.menu-category');
  const menuItems = document.querySelectorAll('.menu-item');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      // Clear search box when filter tab is selected
      const searchInput = document.getElementById('menu-search-input');
      if (searchInput) searchInput.value = '';

      categorySections.forEach(category => {
        let categoryHasVisibleItem = false;

        const itemsInCategory = category.querySelectorAll('.menu-item');
        itemsInCategory.forEach(item => {
          const categoryTag = item.getAttribute('data-category');
          const isVegan = item.getAttribute('data-vegan') === 'true';
          const isGlutenFree = item.getAttribute('data-gf') === 'true';

          let showItem = false;

          if (filterValue === 'all') {
            showItem = true;
          } else if (filterValue === 'vegan') {
            showItem = isVegan;
          } else if (filterValue === 'gf') {
            showItem = isGlutenFree;
          } else if (filterValue === categoryTag) {
            showItem = true;
          }

          if (showItem) {
            item.style.display = 'flex';
            categoryHasVisibleItem = true;
          } else {
            item.style.display = 'none';
          }
        });

        // Hide empty category headings
        if (categoryHasVisibleItem) {
          category.style.display = 'block';
        } else {
          category.style.display = 'none';
        }
      });
    });
  });
}

/* --- LIVE SEARCH FILTER --- */
function initMenuSearch() {
  const searchInput = document.getElementById('menu-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const categorySections = document.querySelectorAll('.menu-category');

    // Reset active tab to 'All'
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelector('.tab-btn[data-filter="all"]')?.classList.add('active');

    categorySections.forEach(category => {
      let categoryHasVisibleItem = false;
      const items = category.querySelectorAll('.menu-item');

      items.forEach(item => {
        const title = item.querySelector('.menu-item-name')?.textContent.toLowerCase() || '';
        const desc = item.querySelector('.menu-item-desc')?.textContent.toLowerCase() || '';

        if (title.includes(query) || desc.includes(query)) {
          item.style.display = 'flex';
          categoryHasVisibleItem = true;
        } else {
          item.style.display = 'none';
        }
      });

      if (categoryHasVisibleItem) {
        category.style.display = 'block';
      } else {
        category.style.display = 'none';
      }
    });
  });
}

/* --- DOWNLOAD FULL MENU (PDF / PRINT SIMULATOR) --- */
function initMenuDownload() {
  const downloadBtns = document.querySelectorAll('.btn-download-menu');
  if (!downloadBtns.length) return;

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      generateMenuPDF();
    });
  });
}

function generateMenuPDF() {
  if (window.showToast) {
    window.showToast('📄 Generating downloadable FIKA COFFEE CO. Menu PDF...');
  }

  // Create printable text window or Blob download
  const menuContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>FIKA COFFEE CO. - Official Menu</title>
      <style>
        body { font-family: 'Georgia', serif; color: #2A1810; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
        h1 { font-size: 32px; text-align: center; margin-bottom: 5px; color: #2A1810; }
        .tagline { text-align: center; font-style: italic; color: #C86D51; margin-bottom: 30px; }
        .info { text-align: center; font-size: 14px; margin-bottom: 40px; border-bottom: 2px solid #E8DFD5; padding-bottom: 20px; }
        .category { margin-bottom: 30px; }
        .category-title { font-size: 22px; border-bottom: 1px solid #C86D51; color: #C86D51; padding-bottom: 5px; margin-bottom: 15px; }
        .item { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .item-name { font-weight: bold; font-size: 16px; }
        .item-price { font-weight: bold; color: #C86D51; }
        .item-desc { font-size: 13px; color: #555; margin-top: 2px; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align:right; margin-bottom: 20px;">
        <button onclick="window.print()" style="background:#C86D51; color:white; border:none; padding:10px 20px; font-size:16px; border-radius:20px; cursor:pointer;">🖨️ Print / Save as PDF</button>
      </div>
      <h1>FIKA COFFEE CO.</h1>
      <div class="tagline">Pause. Sip. Connect.</div>
      <div class="info">
        T40, Hauz Khas Village, Deer Park, Hauz Khas, New Delhi 110016 | Tel: +91 81303 83199<br>
        Open Daily: 8:00 AM – 11:00 PM | Specialty Coffee & Fresh Scandinavian Bakes
      </div>

      <div class="category">
        <div class="category-title">☕ Espresso & Coffee Bar</div>
        <div class="item"><div><div class="item-name">Fika House Espresso</div><div class="item-desc">Single-origin Araku Valley roast, notes of dark chocolate & plum</div></div><div class="item-price">₹180</div></div>
        <div class="item"><div><div class="item-name">Swedish Oat Milk Cappuccino (V)</div><div class="item-desc">Silky steamed Swedish oat milk over double shot espresso</div></div><div class="item-price">₹260</div></div>
        <div class="item"><div><div class="item-name">Cortado</div><div class="item-desc">Equal parts rich espresso and textured micro-foamed warm milk</div></div><div class="item-price">₹210</div></div>
        <div class="item"><div><div class="item-name">Cardamom Vanilla Latte</div><div class="item-desc">Infused with freshly cracked cardamom pods and organic Madagascar vanilla</div></div><div class="item-price">₹280</div></div>
      </div>

      <div class="category">
        <div class="category-title">🧊 Manual Brews & Cold Refreshers</div>
        <div class="item"><div><div class="item-name">Fika Espresso Tonic</div><div class="item-desc">Single origin cold brew, artisanal Indian tonic, fresh orange twist</div></div><div class="item-price">₹290</div></div>
        <div class="item"><div><div class="item-name">Pour Over V60 (Seasonal Light Roast)</div><div class="item-desc">Chikmagalur floral bean, notes of jasmine, peach & lemon zest</div></div><div class="item-price">₹270</div></div>
        <div class="item"><div><div class="item-name">Nitro Cold Brew</div><div class="item-desc">Nitrogen-infused 18-hour steep, velvety cascading cream texture</div></div><div class="item-price">₹310</div></div>
      </div>

      <div class="category">
        <div class="category-title">🥐 Swedish Bakery & Fresh Pastries</div>
        <div class="item"><div><div class="item-name">Kanelbulle (Swedish Cinnamon Bun)</div><div class="item-desc">Traditional braided sourdough pastry infused with ceylon cinnamon & pearl sugar</div></div><div class="item-price">₹240</div></div>
        <div class="item"><div><div class="item-name">Kardemummabulle (Cardamom Bun)</div><div class="item-desc">Aromatic cardamom spiced Swedish knotted bun (Staff Favorite)</div></div><div class="item-price">₹250</div></div>
        <div class="item"><div><div class="item-name">Artisanal Sourdough Croissant</div><div class="item-desc">72-hour slow fermented French butter croissant</div></div><div class="item-price">₹220</div></div>
      </div>

      <div class="category">
        <div class="category-title">🥗 Light Fare & Artisanal Toasts</div>
        <div class="item"><div><div class="item-name">Smoked Avocado & Truffle Sourdough (V, GF Option)</div><div class="item-desc">Hass avocado, white truffle oil, hemp seeds, microgreens, toasted sourdough</div></div><div class="item-price">₹380</div></div>
        <div class="item"><div><div class="item-name">Wild Mushroom & Goat Cheese Toast</div><div class="item-desc">Sautéed cremini & shiitake mushrooms, creamy goat cheese, thyme, balsamic glaze</div></div><div class="item-price">₹410</div></div>
        <div class="item"><div><div class="item-name">Fika Acai & Superfood Smoothie Bowl (V, GF)</div><div class="item-desc">Organic acai berry blend topped with house granola, fresh berries, chia & almond butter</div></div><div class="item-price">₹440</div></div>
      </div>

      <div class="footer">
        © 2026 FIKA COFFEE CO. All prices include applicable taxes. V = Vegan, GF = Gluten Free.
      </div>
    </body>
    </html>
  `;

  const printWin = window.open('', '_blank');
  printWin.document.write(menuContent);
  printWin.document.close();
}
