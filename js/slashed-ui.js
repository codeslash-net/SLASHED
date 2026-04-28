/**
 * SLASHED Framework — Optional UI Enhancements
 *
 * Covers three categories:
 * 1. Accessibility gaps in CSS-only interactive components
 * 2. CSS platform gaps (features not yet expressible in CSS alone)
 * 3. Progressive enhancement for native elements
 *
 * Zero dependencies. All features are independent — comment out
 * anything you don't need. ~500 bytes minified.
 *
 * Load optionally:
 *   <script src="js/slashed-ui.js" defer></script>
 */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. Nav dropdown — aria-expanded + keyboard accessibility
     Enhances .cs-nav-dropdown (<details>-based) with proper ARIA.
     Adds: aria-expanded sync, Escape to close, click-outside close.
  --------------------------------------------------------------- */
  function initNavDropdowns() {
    var dropdowns = document.querySelectorAll('.cs-nav-dropdown');
    if (!dropdowns.length) return;

    dropdowns.forEach(function (details) {
      var summary = details.querySelector('summary');
      if (!summary) return;
      summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');

      details.addEventListener('toggle', function () {
        summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      dropdowns.forEach(function (details) {
        if (details.open) {
          details.open = false;
          var summary = details.querySelector('summary');
          if (summary) summary.focus();
        }
      });
    });

    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (details) {
        if (details.open && !details.contains(e.target)) {
          details.open = false;
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     2. Modal — click-outside to close, Escape to close
     Enhances .cs-modal (<dialog>-based).
  --------------------------------------------------------------- */
  function initModals() {
    document.addEventListener('click', function (e) {
      var dialog = e.target.closest('dialog.cs-modal');
      if (!dialog) return;
      var rect = dialog.getBoundingClientRect();
      var clickedOutside =
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top  || e.clientY > rect.bottom;
      if (clickedOutside) dialog.close();
    });
    /* Escape is handled natively by <dialog> — no JS needed */
  }

  /* ---------------------------------------------------------------
     3. Stagger — auto-set --_i index on children
     CSS platform gap: sibling-index() is not yet cross-browser,
     so we set --_i from JS for stagger animations. Unrelated to the
     flexbox/grid `gap` property, which is natively supported.
     Call initStagger() after any dynamic content render.
  --------------------------------------------------------------- */
  function initStagger(root) {
    (root || document).querySelectorAll('.stagger').forEach(function (el) {
      Array.from(el.children).forEach(function (child, i) {
        child.style.setProperty('--_i', i);
      });
    });
  }

  /* ---------------------------------------------------------------
     4. Range input fill — CSS platform gap
     Sets --_fill custom property so CSS can draw a filled track.
     Requires in your CSS:
       input[type="range"] {
         background: linear-gradient(
           to right,
           var(--primary) var(--_fill, 0%),
           var(--color-border) var(--_fill, 0%)
         );
       }
  --------------------------------------------------------------- */
  function initRangeFill() {
    function update(input) {
      var min = parseFloat(input.min) || 0;
      var max = parseFloat(input.max) || 100;
      var val = parseFloat(input.value) || 0;
      var denom = max - min;
      if (denom === 0) {
        input.style.setProperty('--_fill', '0%');
      } else {
        input.style.setProperty('--_fill', ((val - min) / denom * 100) + '%');
      }
    }
    document.querySelectorAll('input[type="range"]').forEach(update);
    document.addEventListener('input', function (e) {
      if (e.target.type === 'range') update(e.target);
    });
  }

  /* ---------------------------------------------------------------
     5. Tabs — sync .is-active on panels when a tab radio changes.
     Progressive enhancement: CSS-only :has() approach works without this,
     but this adds .is-active for SSR/pre-rendered state and environments
     where :has() is unavailable.
  --------------------------------------------------------------- */
  function initTabs() {
    document.addEventListener('change', function (e) {
      var radio = e.target;
      if (radio.type !== 'radio') return;
      var tab = radio.closest('.cs-tabs__tab');
      if (!tab) return;
      var tabs = radio.closest('.cs-tabs');
      if (!tabs) return;
      var tabList = Array.from(tabs.querySelectorAll('.cs-tabs__tab'));
      var panels = Array.from(tabs.querySelectorAll('.cs-tabs__panel'));
      var idx = tabList.indexOf(tab);
      panels.forEach(function (p, i) {
        p.classList.toggle('is-active', i === idx);
      });
    });
  }

  /* ---------------------------------------------------------------
     6. Toast — append a toast into a .cs-toast-stack with auto-dismiss.
     Usage:
       slashedUI.toast('Saved');
       slashedUI.toast({ title: 'Uploaded', body: 'report.pdf', variant: 'success', duration: 3000 });
     Creates the stack on first call if not present (top-end by default).
  --------------------------------------------------------------- */
  function toast(opts) {
    if (typeof opts === 'string') opts = { body: opts };
    opts = opts || {};
    var stack = document.querySelector('.cs-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'cs-toast-stack';
      document.body.appendChild(stack);
    }
    var el = document.createElement('aside');
    el.className = 'cs-toast' + (opts.variant ? ' cs-toast--' + opts.variant : '');
    el.setAttribute('role', 'status');
    var bodySpan = document.createElement('span');
    bodySpan.className = 'cs-toast__body';
    if (opts.title != null) {
      var titleSpan = document.createElement('span');
      titleSpan.className = 'cs-toast__title';
      titleSpan.textContent = String(opts.title);
      bodySpan.appendChild(titleSpan);
      bodySpan.appendChild(document.createTextNode(' '));
    }
    if (opts.body != null) {
      bodySpan.appendChild(document.createTextNode(String(opts.body)));
    }
    el.appendChild(bodySpan);
    var closeBtn = document.createElement('button');
    closeBtn.className = 'cs-toast__close';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', function () { dismiss(el); });
    el.appendChild(closeBtn);
    stack.appendChild(el);
    var duration = opts.duration == null ? 4000 : opts.duration;
    if (duration > 0) setTimeout(function () { dismiss(el); }, duration);
    return el;
  }
  function dismiss(el) {
    if (!el || !el.parentNode) return;
    el.style.transition = 'opacity 200ms, translate 200ms';
    el.style.opacity = '0';
    el.style.translate = '0 -0.5rem';
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 220);
  }

  /* ---------------------------------------------------------------
     Init — run all enhancements on DOMContentLoaded
  --------------------------------------------------------------- */
  function init() {
    initNavDropdowns();
    initModals();
    initTabs();
    initStagger();
    initRangeFill();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose public helpers for dynamic content re-runs and toasts:
     slashedUI.initStagger(containerElement)
     slashedUI.toast({ title, body, variant, duration }) */
  window.slashedUI = { initStagger: initStagger, toast: toast };

})();