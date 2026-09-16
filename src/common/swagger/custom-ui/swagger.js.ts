export const SWAGGER_CUSTOM_JS = `
(function() {
  'use strict';

  var UI_READY_POLL_MS = 300;
  var MAX_RETRIES = 20;

  function init(retries) {
    retries = retries || 0;
    if (retries >= MAX_RETRIES) return;

    var authBtn = document.querySelector('.auth-wrapper .authorize');
    var existing = document.getElementById('buff-auth-widget');
    if (!authBtn || existing) {
      setTimeout(function () { init(retries + 1); }, UI_READY_POLL_MS);
      return;
    }

    var wrapper = document.createElement('span');
    wrapper.id = 'buff-auth-widget';
    wrapper.style.cssText = 'display:inline-flex;align-items:center;margin-left:8px;';

    /* ---- Status badge ---- */
    var badge = document.createElement('span');
    badge.id = 'buff-badge';
    badge.className = 'auth-status-badge unauthorized';
    badge.innerHTML = '<span class="dot"></span> No token';

    /* ---- Clear button ---- */
    var clearBtn = document.createElement('button');
    clearBtn.id = 'buff-clear';
    clearBtn.className = 'btn-auth-clear';
    clearBtn.title = 'Remove the saved JWT token';
    clearBtn.textContent = '\\u2715 Clear';

    function clearAuth() {
      /* Clear all Swagger UI auth tokens from localStorage */
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && (key.indexOf('authorized') !== -1 || key.indexOf('swagger') !== -1)) {
          localStorage.removeItem(key);
          i--;
        }
      }
      /* Also clear sessionStorage */
      for (var j = 0; j < sessionStorage.length; j++) {
        var sk = sessionStorage.key(j);
        if (sk && (sk.indexOf('authorized') !== -1 || sk.indexOf('swagger') !== -1)) {
          sessionStorage.removeItem(sk);
          j--;
        }
      }

      /* Update UI immediately after clearing storage */
      updateUI();

      /* Also click Logout through the modal to keep Swagger UI internal state in sync */
      var authorizeBtn = document.querySelector('.auth-wrapper .authorize');
      if (!authorizeBtn) return;

      authorizeBtn.click();

      /* Wait for modal to render, then click Logout and close */
      var modalObserver = new MutationObserver(function (mutations, obs) {
        var logoutBtn = document.querySelector('.auth-btn-wrapper .btn-done');
        if (!logoutBtn) return;
        if (logoutBtn.textContent.indexOf('Logout') === -1) return;

        logoutBtn.click();
        obs.disconnect();

        /* Dispatch Escape key to close the modal */
        setTimeout(function () {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27 }));
        }, 100);
      });
      modalObserver.observe(document.body, { childList: true, subtree: true });

      /* Safety: if modal never appears, bail after 3s */
      setTimeout(function () { modalObserver.disconnect(); }, 3000);
    }

    clearBtn.addEventListener('click', clearAuth);

    wrapper.appendChild(badge);
    wrapper.appendChild(clearBtn);
    authBtn.parentNode.insertBefore(wrapper, authBtn.nextSibling);

    function updateUI() {
      var hasAuth = false;
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf('authorized') !== -1) {
          var val = localStorage.getItem(key);
          if (val && val !== '{}' && val !== '[]') {
            hasAuth = true;
            break;
          }
        }
      }
      if (hasAuth) {
        badge.className = 'auth-status-badge authorized';
        badge.innerHTML = '<span class="dot"></span> Authenticated';
        clearBtn.style.display = 'inline-block';
      } else {
        badge.className = 'auth-status-badge unauthorized';
        badge.innerHTML = '<span class="dot"></span> No token';
        clearBtn.style.display = 'none';
      }
    }

    updateUI();

    /* Poll for auth changes (Swagger UI updates localStorage) */
    var lastAuth = JSON.stringify(getAuthKeys());
    function getAuthKeys() {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf('authorized') !== -1) {
          keys.push({ k: key, v: localStorage.getItem(key) });
        }
      }
      return keys;
    }
    setInterval(function () {
      var now = JSON.stringify(getAuthKeys());
      if (now !== lastAuth) {
        lastAuth = now;
        updateUI();
      }
    }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(0); });
  } else {
    init(0);
  }
})();
`;
