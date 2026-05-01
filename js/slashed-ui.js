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
     2. Modal — click-outside to close.
     The browser sets event.target to the <dialog> element itself when the
     click lands on the backdrop pseudo-element. That is the only reliable
     signal — rect comparison and tree containment are heuristics that
     misfire on borders, scrollbars, and portal-rendered popovers.
     Escape is handled natively by <dialog>.
  --------------------------------------------------------------- */
  function initModals() {
    document.addEventListener('click', function (e) {
      var dialog = document.querySelector('dialog.cs-modal:modal');
      if (dialog && e.target === dialog) dialog.close();
    });
  }

  function closeModal(dialog) {
    if (dialog && typeof dialog.close === 'function') dialog.close();
  }

  /* ---------------------------------------------------------------
     3. Modal focus restore — return focus to trigger on dialog close.
     Native <dialog> traps focus inside and handles Escape; the gap
     is restoring focus to the element that opened the dialog.
     Call once: slashedUI.initModalFocusRestore()
  --------------------------------------------------------------- */
  function initModalFocusRestore() {
    var restoreTarget = null;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-modal-trigger]');
      if (trigger) restoreTarget = trigger;
    });

    document.addEventListener('close', function (e) {
      if (!e.target || e.target.tagName !== 'DIALOG') return;
      var target = restoreTarget;
      restoreTarget = null;
      if (target && document.body.contains(target)) {
        target.focus();
      } else {
        document.body.focus();
      }
    }, true);
  }

  /* ---------------------------------------------------------------
     5. Stagger — auto-set --_i index on children
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
  function updateRange(input) {
    if (!input) return;
    var minRaw = parseFloat(input.min);
    var maxRaw = parseFloat(input.max);
    var valRaw = parseFloat(input.value);
    var min = Number.isFinite(minRaw) ? minRaw : 0;
    var max = Number.isFinite(maxRaw) ? maxRaw : 100;
    var val = Number.isFinite(valRaw) ? valRaw : 0;
    var denom = max - min;
    if (denom === 0) {
      input.style.setProperty('--_fill', '0%');
    } else {
      input.style.setProperty('--_fill', ((val - min) / denom * 100) + '%');
    }
  }

  function initRangeFill() {
    document.querySelectorAll('input[type="range"]').forEach(updateRange);
    document.addEventListener('input', function (e) {
      if (e.target.type === 'range') updateRange(e.target);
    });
  }

  /* ---------------------------------------------------------------
     5. Tabs — sync .is-active on panels when a tab radio changes.
     Progressive enhancement: CSS-only :has() approach works without this,
     but this adds .is-active for SSR/pre-rendered state and environments
     where :has() is unavailable.
  --------------------------------------------------------------- */
  function syncTabs(tabs) {
    var tabList = Array.from(tabs.querySelectorAll(':scope > .cs-tabs__list > .cs-tabs__tab'));
    var panels  = Array.from(tabs.querySelectorAll(':scope > .cs-tabs__panels > .cs-tabs__panel'));
    var checked = tabList.findIndex(function (t) {
      var r = t.querySelector('input[type="radio"]');
      return r && r.checked;
    });
    var idx = checked >= 0 ? checked : 0;
    if (checked < 0 && tabList[0]) {
      var firstRadio = tabList[0].querySelector('input[type="radio"]');
      if (firstRadio) firstRadio.checked = true;
    }
    panels.forEach(function (p, i) { p.classList.toggle('is-active', i === idx); });
  }

  function initTabs() {
    document.querySelectorAll('.cs-tabs').forEach(syncTabs);
    document.addEventListener('change', function (e) {
      var radio = e.target;
      if (radio.type !== 'radio') return;
      var tab = radio.closest('.cs-tabs__tab');
      if (!tab) return;
      var tabs = radio.closest('.cs-tabs');
      if (!tabs) return;
      syncTabs(tabs);
    });
  }

  /* ---------------------------------------------------------------
     6. Tabs accessible — WAI-ARIA Tabs keyboard pattern.
     Opt-in enhancement on top of the CSS-only radio/label tab pattern.
     Call instead of or alongside initTabs().
     Adds: role="tab", aria-selected, roving tabindex, Arrow/Home/End.
  --------------------------------------------------------------- */
  function initTabsAccessible() {
    document.querySelectorAll('.cs-tabs').forEach(function (tabs) {
      var list = tabs.querySelector(':scope > .cs-tabs__list');
      if (!list) return;
      var items = Array.from(list.querySelectorAll(':scope > .cs-tabs__tab'));
      if (!items.length) return;

      items.forEach(function (tab, i) {
        var radio = tab.querySelector('input[type="radio"]');
        var active = radio ? radio.checked : i === 0;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.setAttribute('tabindex', active ? '0' : '-1');
      });

      function selectTab(idx) {
        items.forEach(function (tab, i) {
          var radio = tab.querySelector('input[type="radio"]');
          var active = i === idx;
          tab.setAttribute('aria-selected', active ? 'true' : 'false');
          tab.setAttribute('tabindex', active ? '0' : '-1');
          if (active && radio) radio.checked = true;
        });
        items[idx].focus();
        syncTabs(tabs);
      }

      list.addEventListener('keydown', function (e) {
        var idx = items.indexOf(document.activeElement);
        if (idx === -1) return;
        var last = items.length - 1;
        if (e.key === 'ArrowRight') { e.preventDefault(); selectTab(idx < last ? idx + 1 : 0); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); selectTab(idx > 0 ? idx - 1 : last); }
        else if (e.key === 'Home') { e.preventDefault(); selectTab(0); }
        else if (e.key === 'End') { e.preventDefault(); selectTab(last); }
      });
    });
  }

  /* ---------------------------------------------------------------
     7. Toast — append a toast into a .cs-toast-stack with auto-dismiss.
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
    var allowedVariants = { success: true, warning: true, error: true };
    var variant = typeof opts.variant === 'string' ? opts.variant.trim() : '';
    el.className = 'cs-toast' + (allowedVariants[variant] ? ' cs-toast--' + variant : '');
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (el.parentNode) el.parentNode.removeChild(el);
      return;
    }
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

  /* Expose public helpers for dynamic content re-runs, toasts, range
     re-paints, programmatic modal close, and accessible tab keyboard nav:
     slashedUI.initStagger(containerElement)
     slashedUI.toast({ title, body, variant, urgency, duration })
     slashedUI.updateRange(rangeInputElement)
     slashedUI.closeModal(dialogElement)
     slashedUI.initTabsAccessible()
     slashedUI.initModalFocusRestore()
     slashedUI.initFormGroups() */
  window.slashedUI = Object.assign(window.slashedUI || {}, {
    initStagger: initStagger,
    toast: toast,
    updateRange: updateRange,
    closeModal: closeModal,
    initTabsAccessible: initTabsAccessible,
    initModalFocusRestore: initModalFocusRestore
  });

})();