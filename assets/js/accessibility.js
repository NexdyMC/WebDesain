(function () {
  "use strict";

  let a11yToggle = document.getElementById("a11yToggle");
  let a11yPanel = document.getElementById("a11yPanel");

  if (!a11yToggle || !a11yPanel) {
    const accessibilityWidget = document.createElement("div");
    accessibilityWidget.className = "accessibility-float";
    accessibilityWidget.setAttribute("aria-label", "Panel aksesibilitas");
    accessibilityWidget.innerHTML = `
      <button id="a11yToggle" class="accessibility-toggle" type="button" aria-expanded="false" aria-controls="a11yPanel" aria-label="Buka pengaturan aksesibilitas">
        <i class="fa-solid fa-universal-access" aria-hidden="true"></i>
      </button>
      <div id="a11yPanel" class="accessibility-panel" aria-hidden="true">
        <h3 class="accessibility-panel-title">Alat Aksesibilitas</h3>
        <ul class="accessibility-menu">
          <li><button type="button" data-a11y-action="increase-text" class="accessibility-item"><span class="accessibility-icon"><i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i></span><span>Meningkatkan Teks</span></button></li>
          <li><button type="button" data-a11y-action="decrease-text" class="accessibility-item"><span class="accessibility-icon"><i class="fa-solid fa-magnifying-glass-minus" aria-hidden="true"></i></span><span>Kurangi Teks</span></button></li>
          <li><button type="button" data-a11y-action="grayscale" class="accessibility-item"><span class="accessibility-icon"><i class="fa-solid fa-droplet-slash" aria-hidden="true"></i></span><span>Skala abu-abu</span></button></li>
          <li><button type="button" data-a11y-action="high-contrast" class="accessibility-item"><span class="accessibility-icon"><i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i></span><span>Kontras Tinggi</span></button></li>
          <li><button type="button" data-a11y-action="negative-contrast" class="accessibility-item"><span class="accessibility-icon"><i class="fa-solid fa-circle-dot" aria-hidden="true"></i></span><span>Kontras Negatif</span></button></li>
          <li><button type="button" data-a11y-action="light-bg" class="accessibility-item"><span class="accessibility-icon"><i class="fa-solid fa-sun" aria-hidden="true"></i></span><span>Latar Belakang Cahaya</span></button></li>
          <li><button type="button" data-a11y-action="underline-links" class="accessibility-item"><span class="accessibility-icon"><i class="fa-solid fa-underline" aria-hidden="true"></i></span><span>Tautan Garis Bawah</span></button></li>
          <li><button type="button" data-a11y-action="readable-font" class="accessibility-item"><span class="accessibility-icon"><i class="fa-solid fa-font" aria-hidden="true"></i></span><span>Fonta Yang Dapat Dibaca</span></button></li>
          <li><button type="button" data-a11y-action="reset" class="accessibility-item accessibility-item-reset"><span class="accessibility-icon"><i class="fa-solid fa-arrow-rotate-left" aria-hidden="true"></i></span><span>Reset</span></button></li>
        </ul>
      </div>`;
    document.body.append(accessibilityWidget);
    a11yToggle = accessibilityWidget.querySelector("#a11yToggle");
    a11yPanel = accessibilityWidget.querySelector("#a11yPanel");
  }

  const a11yButtons = document.querySelectorAll("[data-a11y-action]");

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