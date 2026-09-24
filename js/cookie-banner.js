/* ==========================================================================
   FIKA COFFEE CO. - GLOBAL COOKIE CONSENT BANNER & MANAGEMENT
   Uses localStorage ('fika_cookie_consent'). Controls tracking scripts.
   ========================================================================== */

const COOKIE_STORAGE_KEY = 'fika_cookie_consent';

document.addEventListener('DOMContentLoaded', () => {
  initCookieConsent();
});

function initCookieConsent() {
  const consent = localStorage.getItem(COOKIE_STORAGE_KEY);

  // If user has not decided yet, render cookie banner
  if (!consent) {
    createCookieBannerHTML();
    setTimeout(() => {
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) banner.classList.add('show');
    }, 1000);
  } else {
    // Apply existing consent decision
    applyConsentPreferences(JSON.parse(consent));
  }
}

function createCookieBannerHTML() {
  if (document.getElementById('cookie-consent-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'cookie-consent-banner';
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie Consent Banner');

  banner.innerHTML = `
    <div class="cookie-header">
      <div class="cookie-title">
        <span>🍪</span> Cookie & Privacy Preferences
      </div>
    </div>
    <div class="cookie-text">
      We use cookies and lightweight analytics to enhance your coffee browsing experience, understand site traffic, and optimize our digital menu. Choose your preferences below.
    </div>
    <div class="cookie-actions">
      <button id="cookie-accept-all" class="btn btn-cookie-accept">Accept All</button>
      <button id="cookie-decline-all" class="btn btn-cookie-decline">Decline Non-Essential</button>
      <button id="cookie-customize" class="btn-cookie-custom">Customize Preferences</button>
    </div>
  `;

  document.body.appendChild(banner);

  // Attach event listeners
  document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
    hideCookieBanner();
    if (window.showToast) window.showToast('Cookie preferences saved: All Accepted');
  });

  document.getElementById('cookie-decline-all')?.addEventListener('click', () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
    hideCookieBanner();
    if (window.showToast) window.showToast('Cookie preferences saved: Non-essential declined');
  });

  document.getElementById('cookie-customize')?.addEventListener('click', () => {
    hideCookieBanner();
    openCookieModal();
  });
}

function hideCookieBanner() {
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 500);
  }
}

function saveConsent(preferences) {
  localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(preferences));
  applyConsentPreferences(preferences);
}

function applyConsentPreferences(preferences) {
  if (preferences.analytics) {
    // Simulated Google Analytics script loading
    console.log('[FIKA Cookie Consent] Analytics cookies enabled.');
    window['fika_analytics_enabled'] = true;
  } else {
    console.log('[FIKA Cookie Consent] Analytics cookies disabled by user.');
    window['fika_analytics_enabled'] = false;
    // Block or disable any tracking script window globals
  }
}

/* --- COOKIE CUSTOMIZATION MODAL --- */
window.openCookiePreferencesModal = function() {
  openCookieModal();
};

function openCookieModal() {
  let modalOverlay = document.getElementById('cookie-modal-overlay');
  
  const currentConsent = JSON.parse(localStorage.getItem(COOKIE_STORAGE_KEY) || '{"essential":true,"analytics":false,"marketing":false}');

  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'cookie-modal-overlay';
    modalOverlay.className = 'cookie-modal-overlay';
    
    modalOverlay.innerHTML = `
      <div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
        <div class="cookie-modal-header">
          <h3 id="cookie-modal-title" class="font-heading">Cookie Preferences</h3>
          <button id="cookie-modal-close" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>
        <p style="margin-bottom:1.5rem; font-size:0.9rem;">Manage how FIKA COFFEE CO. uses cookies. Essential cookies are required to make the site function properly.</p>

        <div class="cookie-option">
          <div class="cookie-option-header">
            <strong>Essential Cookies (Required)</strong>
            <span style="font-size:0.8rem; color:var(--clr-sage); font-weight:600;">Always Active</span>
          </div>
          <p style="font-size:0.85rem;">Necessary for basic page navigation, smooth scrolling, security, and storing your consent preferences.</p>
        </div>

        <div class="cookie-option">
          <div class="cookie-option-header">
            <strong>Performance & Analytics</strong>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-analytics" ${currentConsent.analytics ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <p style="font-size:0.85rem;">Helps us aggregate anonymous visitor statistics to improve menu loading speeds and site navigation.</p>
        </div>

        <div class="cookie-option">
          <div class="cookie-option-header">
            <strong>Marketing & Social Media</strong>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-marketing" ${currentConsent.marketing ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <p style="font-size:0.85rem;">Enables social media sharing embeds and interactive location map features.</p>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
          <button id="save-cookie-prefs" class="btn btn-primary">Save Preferences</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    document.getElementById('cookie-modal-close')?.addEventListener('click', closeCookieModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeCookieModal();
    });

    document.getElementById('save-cookie-prefs')?.addEventListener('click', () => {
      const analyticsVal = document.getElementById('toggle-analytics')?.checked || false;
      const marketingVal = document.getElementById('toggle-marketing')?.checked || false;

      saveConsent({
        essential: true,
        analytics: analyticsVal,
        marketing: marketingVal
      });

      closeCookieModal();
      if (window.showToast) window.showToast('Cookie preferences updated successfully!');
    });
  }

  // Show modal
  setTimeout(() => modalOverlay.classList.add('show'), 10);
}

function closeCookieModal() {
  const modalOverlay = document.getElementById('cookie-modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('show');
    setTimeout(() => modalOverlay.remove(), 300);
  }
}
