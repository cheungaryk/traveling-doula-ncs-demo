(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var body = document.body;
  var mainEl = document.getElementById("main");
  var footerEl = document.querySelector(".site-footer");
  var desktopNav = window.matchMedia("(min-width: 1040px)");

  var focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function setToggleLabel(open) {
    if (!toggle) return;
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.textContent = open ? "Close" : "Menu";
  }

  function setPageInert(on) {
    if (mainEl) mainEl.inert = on;
    if (footerEl) footerEl.inert = on;
  }

  function openNav() {
    if (!toggle || !nav) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    setToggleLabel(true);
    body.classList.add("nav-open");
    setPageInert(true);
    var focusFirst = function () {
      if (!isOpen()) return;
      var first = nav.querySelector(focusableSelector);
      if (first) first.focus();
    };
    focusFirst();
    requestAnimationFrame(focusFirst);
  }

  function closeNav() {
    if (!toggle || !nav) return;
    var wasOpen = isOpen();
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    setToggleLabel(false);
    body.classList.remove("nav-open");
    setPageInert(false);
    return wasOpen;
  }

  function isOpen() {
    return !!(toggle && toggle.getAttribute("aria-expanded") === "true");
  }

  function navItems() {
    var nodes = Array.prototype.slice.call(nav.querySelectorAll(focusableSelector));
    nodes.unshift(toggle);
    return nodes.filter(function (el) {
      return el && !el.hasAttribute("disabled");
    });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (isOpen()) closeNav();
      else openNav();
    });

    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeNav();
        toggle.focus();
        return;
      }
      if (e.key !== "Tab") return;
      var nodes = navItems();
      if (!nodes.length) return;
      var first = nodes[0];
      var last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!isOpen()) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && isOpen()) closeNav();
    });

    function onDesktop(e) {
      if (e.matches && isOpen()) closeNav();
    }
    if (desktopNav.addEventListener) desktopNav.addEventListener("change", onDesktop);
    else if (desktopNav.addListener) desktopNav.addListener(onDesktop);
  }

  var form = document.getElementById("consult-form");
  if (form) {
    var summary = document.getElementById("form-errors");

    function validatedControls() {
      return Array.prototype.filter.call(
        form.querySelectorAll("input, textarea, select"),
        function (el) { return el.willValidate; }
      );
    }

    function fieldMessage(el) {
      var field = el.closest(".field");
      var msg = field && field.querySelector(".field-error");
      return msg ? msg.textContent.trim() : "Please check this field.";
    }

    function syncInvalidState() {
      var invalid = [];
      validatedControls().forEach(function (el) {
        if (el.checkValidity()) {
          el.removeAttribute("aria-invalid");
        } else {
          el.setAttribute("aria-invalid", "true");
          invalid.push(el);
        }
      });
      return invalid;
    }

    function renderSummary(invalid) {
      if (!summary) return;
      summary.replaceChildren();
      if (!invalid.length) return;
      var p = document.createElement("p");
      var strong = document.createElement("strong");
      strong.textContent = invalid.length === 1
        ? "Please fix 1 field before requesting a consult."
        : "Please fix " + invalid.length + " fields before requesting a consult.";
      p.appendChild(strong);
      var ul = document.createElement("ul");
      invalid.forEach(function (el) {
        var li = document.createElement("li");
        if (el.id) {
          var link = document.createElement("a");
          link.href = "#" + el.id;
          link.textContent = fieldMessage(el);
          li.appendChild(link);
        } else {
          li.textContent = fieldMessage(el);
        }
        ul.appendChild(li);
      });
      summary.appendChild(p);
      summary.appendChild(ul);
    }

    form.addEventListener("input", function () {
      if (!form.classList.contains("was-validated")) return;
      renderSummary(syncInvalidState());
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("was-validated");
      var invalid = syncInvalidState();
      if (invalid.length) {
        renderSummary(invalid);
        if (summary) summary.focus();
        return;
      }
      renderSummary([]);
      var success = document.getElementById("form-success");
      if (success) {
        success.classList.add("is-visible");
        success.focus();
      }
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  function syncScrollableTables() {
    document.querySelectorAll(".rate-table-wrap").forEach(function (wrap) {
      var overflows = wrap.scrollWidth > wrap.clientWidth + 1;
      var hint = wrap.previousElementSibling;
      if (overflows) {
        wrap.tabIndex = 0;
        wrap.setAttribute("role", "region");
        if (!wrap.getAttribute("aria-label")) {
          wrap.setAttribute("aria-label", "Scroll horizontally to see every column.");
        }
      } else {
        wrap.removeAttribute("tabindex");
        wrap.removeAttribute("role");
      }
      if (hint && hint.classList.contains("table-scroll-hint")) {
        hint.classList.toggle("is-needed", overflows);
        hint.classList.toggle("is-unneeded", !overflows);
      }
    });
  }
  syncScrollableTables();
  window.addEventListener("resize", syncScrollableTables);
  window.addEventListener("load", syncScrollableTables);

  document.querySelectorAll("details.accordion").forEach(function (el) {
    var summaryEl = el.querySelector("summary");
    if (!summaryEl) return;
    function sync() {
      summaryEl.setAttribute("aria-expanded", el.open ? "true" : "false");
    }
    sync();
    el.addEventListener("toggle", sync);
  });
})();
