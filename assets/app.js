(() => {
  "use strict";

  const config = window.SITE_CONFIG;
  const body = document.body;

  const applyConfig = () => {
    const renderedSiteName = document.querySelector(".brand-copy strong")?.textContent.trim() || "";
    const renderedCompanyName = document.querySelector(".footer-bottom p")?.textContent.split("·")[0].trim() || "";
    const namesNeedUpdate = (
      (renderedSiteName && renderedSiteName !== config.brand.siteName) ||
      (renderedCompanyName && renderedCompanyName !== config.brand.companyName)
    );
    const companyToken = "[[CONFIG_COMPANY_NAME]]";
    const replaceConfiguredNames = (value) => {
      let result = value;
      if (renderedCompanyName) result = result.replaceAll(renderedCompanyName, companyToken);
      if (renderedSiteName) result = result.replaceAll(renderedSiteName, config.brand.siteName);
      return result.replaceAll(companyToken, config.brand.companyName);
    };

    if (namesNeedUpdate) {
      const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (["SCRIPT", "STYLE", "TEXTAREA"].includes(node.parentElement?.tagName)) continue;
        node.nodeValue = replaceConfiguredNames(node.nodeValue);
      }
      document.title = replaceConfiguredNames(document.title);
      document.querySelectorAll("meta[content]").forEach((meta) => {
        meta.content = replaceConfiguredNames(meta.content);
      });
    }

    const websiteBase = config.contact.website.replace(/\/$/, "");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `${websiteBase}${new URL(canonical.href).pathname}`;
    const socialImage = document.querySelector('meta[property="og:image"]');
    if (socialImage) socialImage.content = `${websiteBase}/og.png`;

    const configuredLinks = [
      ...(config.navigation?.primary || []),
      ...(config.navigation?.legal || []),
    ];
    const urlsByLabel = new Map(configuredLinks.map((link) => [link.label, link.url]));
    document.querySelectorAll("a").forEach((element) => {
      const configuredUrl = urlsByLabel.get(element.textContent.trim());
      if (configuredUrl) element.href = configuredUrl;
    });
    if (config.navigation?.supportUrl) {
      document.querySelectorAll('a[href^="/services/request-technical-support"]').forEach((element) => {
        element.href = config.navigation.supportUrl;
      });
    }

    document.querySelectorAll(".brand-mark").forEach((element) => { element.textContent = config.brand.shortMark; });
    document.querySelectorAll(".brand-copy strong").forEach((element) => { element.textContent = config.brand.siteName; });
    document.querySelectorAll(".brand-copy small").forEach((element) => { element.textContent = config.brand.tagline; });
    document.querySelectorAll(".brand").forEach((element) => { element.setAttribute("aria-label", `${config.brand.siteName} home`); });

    document.querySelectorAll('a[href^="mailto:"]').forEach((element) => {
      element.href = `mailto:${config.contact.email}`;
      const icon = element.querySelector(".icon-glyph");
      if (icon) element.replaceChildren(icon, document.createTextNode(` ${config.contact.email}`));
      else element.textContent = config.contact.email;
    });

    document.querySelectorAll(".footer-brand > p:not(.service-area)").forEach((element) => { element.textContent = config.footer.text; });
    document.querySelectorAll(".service-area").forEach((element) => { element.textContent = config.footer.serviceArea; });
    document.querySelectorAll(".footer-contact p span:not(.icon-glyph)").forEach((element) => { element.textContent = config.contact.address; });
    document.querySelectorAll('.footer-contact a[href^="http"], .contact-info-card a[href^="http"]').forEach((element) => {
      element.href = config.contact.website;
      const arrow = element.querySelector('[aria-hidden="true"]');
      if (arrow) element.replaceChildren(document.createTextNode(`${config.contact.websiteLabel} `), arrow);
      else element.textContent = config.contact.websiteLabel;
    });

    document.querySelectorAll(".contact-info-card").forEach((card) => {
      const isAddressCard = [...card.querySelectorAll("span")]
        .some((element) => element.textContent.trim() === "Company address");
      if (!isAddressCard) return;
      const address = card.querySelector("p");
      const companyId = card.querySelector("small");
      if (address) address.textContent = config.contact.address;
      if (companyId) companyId.textContent = `Company ID ${config.contact.companyId}`;
    });

    const footerLines = document.querySelectorAll(".footer-bottom p");
    if (footerLines[0]) footerLines[0].textContent = `${config.brand.companyName} · ${config.contact.address} · Company ID ${config.contact.companyId}`;
    if (footerLines[1]) footerLines[1].textContent = `© ${new Date().getFullYear()} ${config.brand.siteName}. ${config.footer.copyright}`;

    document.querySelectorAll(".consent > span").forEach((element) => { element.textContent = config.forms.consentLabel; });
    document.querySelectorAll(".form-note").forEach((element) => { element.textContent = `Messages are sent securely to ${config.contact.email}.`; });
    document.querySelectorAll('select[name="inquiryType"]').forEach((select) => {
      const selectedValue = select.value;
      const serviceTypes = config.forms.serviceTypes || [];
      const inquiryTypes = config.forms.inquiryTypes || [];
      const allowedTypes = [...new Set([...serviceTypes, ...inquiryTypes])];
      const options = [];

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select a request type";
      placeholder.disabled = true;
      placeholder.selected = !allowedTypes.includes(selectedValue);
      options.push(placeholder);

      if (serviceTypes.includes(selectedValue)) {
        const serviceOption = document.createElement("option");
        serviceOption.value = selectedValue;
        serviceOption.textContent = selectedValue;
        serviceOption.selected = true;
        options.push(serviceOption);
      }

      inquiryTypes.forEach((type) => {
        if (type === selectedValue && serviceTypes.includes(selectedValue)) return;
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        option.selected = type === selectedValue;
        options.push(option);
      });

      select.replaceChildren(...options);
    });
    document.querySelectorAll("[data-success-modal]").forEach((modal) => {
      const title = modal.querySelector("h2");
      const message = modal.querySelector("h2 + p");
      const delivered = modal.querySelector(".modal-email");
      if (title) title.textContent = config.forms.successTitle;
      if (message) message.textContent = `Thanks for contacting ${config.brand.siteName}. ${config.forms.successMessage}`;
      if (delivered) delivered.textContent = `A copy was delivered to ${config.contact.email}.`;
    });
  };

  applyConfig();
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
