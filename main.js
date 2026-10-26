(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var body = document.body;

  var focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function setToggleLabel(open) {
    if (!toggle) return;
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.textContent = open ? "Close" : "Menu";
  }

  function openNav() {
    if (!toggle || !nav) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    setToggleLabel(true);
    body.classList.add("nav-open");
    var first = nav.querySelector(focusableSelector);
    if (first) first.focus();
  }

  function closeNav() {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    setToggleLabel(false);
    body.classList.remove("nav-open");
  }

  function isOpen() {
    return toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (isOpen()) closeNav();
      else openNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        closeNav();
        toggle.focus();
      }
    });

    // Focus trap while mobile nav is open
    nav.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !isOpen()) return;
      var nodes = Array.prototype.slice.call(nav.querySelectorAll(focusableSelector));
      if (!nodes.length) return;
      nodes.unshift(toggle);
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

    // Close when a nav link is activated (mobile)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && isOpen()) closeNav();
    });

    // Close if viewport grows past mobile breakpoint
    var mq = window.matchMedia("(min-width: 861px)");
    function onMq(e) {
      if (e.matches && isOpen()) closeNav();
    }
    if (mq.addEventListener) mq.addEventListener("change", onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }

  // Demo contact form — validate required fields, then show success
  var form = document.getElementById("consult-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        var firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var success = document.getElementById("form-success");
      if (success) {
        success.classList.add("is-visible");
        success.focus();
      }
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  // Accordion: sync aria-expanded on summary (Enter/Space are native on <summary>)
  document.querySelectorAll("details.accordion").forEach(function (el) {
    var summary = el.querySelector("summary");
    if (!summary) return;
    function sync() {
      summary.setAttribute("aria-expanded", el.open ? "true" : "false");
    }
    sync();
    el.addEventListener("toggle", sync);
  });
})();
