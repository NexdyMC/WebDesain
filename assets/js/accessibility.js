// filepath: d:\FEBRI\WebDesain\assets\js\accessibility.js
(function () {
  "use strict";

  const a11yToggle = document.getElementById("a11yToggle");
  const a11yPanel = document.getElementById("a11yPanel");
  const a11yButtons = document.querySelectorAll("[data-a11y-action]");

  if (!a11yToggle || !a11yPanel) return;

  const state = {
    fontScale: 1,
    grayscale: false,
    highContrast: false,
    negativeContrast: false,
    lightBg: false,
    underlineLinks: false,
    readableFont: false,
  };

  function applyAccessibilityState() {
    document.documentElement.style.setProperty(
      "--isyaratok-font-scale",
      String(state.fontScale)
    );

    document.body.classList.toggle("a11y-grayscale", state.grayscale);
    document.body.classList.toggle("a11y-high-contrast", state.highContrast);
    document.body.classList.toggle(
      "a11y-negative-contrast",
      state.negativeContrast
    );
    document.body.classList.toggle("a11y-light-bg", state.lightBg);
    document.body.classList.toggle(
      "a11y-underline-links",
      state.underlineLinks
    );
    document.body.classList.toggle(
      "a11y-readable-font",
      state.readableFont
    );
  }

  function closePanel() {
    a11yPanel.classList.remove("is-open");
    a11yToggle.setAttribute("aria-expanded", "false");
    a11yPanel.setAttribute("aria-hidden", "true");
  }

  function resetAccessibilityState() {
    Object.assign(state, {
      fontScale: 1,
      grayscale: false,
      highContrast: false,
      negativeContrast: false,
      lightBg: false,
      underlineLinks: false,
      readableFont: false,
    });

    applyAccessibilityState();
  }

  a11yToggle.addEventListener("click", function (event) {
    event.stopPropagation();

    const isOpen = a11yPanel.classList.toggle("is-open");
    a11yToggle.setAttribute("aria-expanded", String(isOpen));
    a11yPanel.setAttribute("aria-hidden", String(!isOpen));
  });

  document.addEventListener("click", function (event) {
    if (
      !a11yPanel.contains(event.target) &&
      !a11yToggle.contains(event.target)
    ) {
      closePanel();
    }
  });

  a11yButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      switch (button.dataset.a11yAction) {
        case "increase-text":
          state.fontScale = Math.min(state.fontScale + 0.08, 1.4);
          break;

        case "decrease-text":
          state.fontScale = Math.max(state.fontScale - 0.08, 0.8);
          break;

        case "grayscale":
          state.grayscale = !state.grayscale;
          break;

        case "high-contrast":
          state.highContrast = !state.highContrast;
          state.negativeContrast = false;
          break;

        case "negative-contrast":
          state.negativeContrast = !state.negativeContrast;
          state.highContrast = false;
          break;

        case "light-bg":
          state.lightBg = !state.lightBg;
          break;

        case "underline-links":
          state.underlineLinks = !state.underlineLinks;
          break;

        case "readable-font":
          state.readableFont = !state.readableFont;
          break;

        case "reset":
          resetAccessibilityState();
          return;
      }

      applyAccessibilityState();
    });
  });

  applyAccessibilityState();
})();