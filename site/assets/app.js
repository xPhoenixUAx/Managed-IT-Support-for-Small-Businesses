(() => {
  "use strict";

  const config = window.SITE_CONFIG;
  const body = document.body;
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const servicesButton = document.querySelector("[data-services-toggle]");
  const mobileServices = document.querySelector("[data-mobile-services]");

  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open menu");
    mobileMenu?.classList.remove("open");
    mobileMenu?.setAttribute("aria-hidden", "true");
    servicesButton?.setAttribute("aria-expanded", "false");
    mobileServices?.classList.remove("open");
    body.classList.remove("menu-lock");
  };

  menuButton?.addEventListener("click", () => {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
    mobileMenu?.classList.toggle("open", opening);
    mobileMenu?.setAttribute("aria-hidden", String(!opening));
    body.classList.toggle("menu-lock", opening);
  });

  servicesButton?.addEventListener("click", () => {
    const opening = servicesButton.getAttribute("aria-expanded") !== "true";
    servicesButton.setAttribute("aria-expanded", String(opening));
    mobileServices?.classList.toggle("open", opening);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const revealItems = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const showSuccess = (form) => {
    const modal = form.closest("[data-form-shell]")?.querySelector("[data-success-modal]");
    if (!modal) return;
    modal.hidden = false;
    body.classList.add("menu-lock");
    modal.querySelector(".success-modal")?.focus();
  };

  const closeSuccess = (modal) => {
    modal.hidden = true;
    body.classList.remove("menu-lock");
  };

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector("button[type='submit']");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.hidden = true;
      status.textContent = "";
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";

      try {
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch(config.forms.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || "We could not send your request.");
        form.reset();
        showSuccess(form);
      } catch (error) {
        status.innerHTML = "";
        status.append(document.createTextNode(`${error.message || "We could not send your request."} `));
        const fallback = document.createElement("a");
        fallback.href = `mailto:${config.contact.email}`;
        fallback.textContent = `Email ${config.contact.email}`;
        status.append(fallback);
        status.hidden = false;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send request";
      }
    });
  });

  document.querySelectorAll("[data-success-modal]").forEach((modal) => {
    modal.querySelectorAll("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", () => closeSuccess(modal));
    });
    modal.addEventListener("mousedown", (event) => {
      if (event.target === modal) closeSuccess(modal);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) closeSuccess(modal);
    });
  });
})();
