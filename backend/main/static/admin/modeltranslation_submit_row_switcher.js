(function () {
  function getRequestedLanguage(submitSwitch) {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get("lang");
    if (fromQuery) {
      return fromQuery.toLowerCase();
    }
    if (!submitSwitch) {
      return "";
    }
    var selectedOption = submitSwitch.options[submitSwitch.selectedIndex];
    return selectedOption ? selectedOption.text.toLowerCase() : "";
  }

  function syncModeltranslationSwitch() {
    var submitSwitch = document.querySelector(".submit-row__language-select");
    if (!submitSwitch) {
      return true;
    }

    var modeltranslationSwitch = document.getElementById("modeltranslation-main-switch");
    if (!modeltranslationSwitch) {
      return false;
    }

    var requestedLanguage = getRequestedLanguage(submitSwitch);
    var options = Array.prototype.slice.call(modeltranslationSwitch.options);
    var targetOption = options.find(function (option) {
      return option.text.toLowerCase() === requestedLanguage;
    });

    if (targetOption) {
      modeltranslationSwitch.value = targetOption.value;
      modeltranslationSwitch.dispatchEvent(new Event("change", { bubbles: true }));
    }

    modeltranslationSwitch.style.display = "none";
    return true;
  }

  function initialize() {
    if (!document.body.classList.contains("change-form")) {
      return;
    }

    var attempts = 0;
    var intervalId = window.setInterval(function () {
      attempts += 1;
      if (syncModeltranslationSwitch() || attempts >= 40) {
        window.clearInterval(intervalId);
      }
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
