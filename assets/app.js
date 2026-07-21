(() => {
  "use strict";

  const config = window.SITE_CONFIG;
  const body = document.body;

  const serviceIconNames = new Map([
    ["Remote IT Support", "headset"],
    ["Device Management", "laptop"],
    ["Microsoft 365 Setup", "layout-dashboard"],
    ["Google Workspace Setup", "users"],
    ["Business Email Setup", "mail-check"],
    ["Cloud Backup", "cloud-upload"],
    ["Network & Wi-Fi Support", "wifi"],
    ["Cybersecurity Basics", "shield-check"],
    ["IT Support Plans", "clipboard-check"],
    ["Request Technical Support", "life-buoy"],
  ]);
  const guideIconNames = new Map([
    ["EMAIL", "mail-check"],
    ["SECURITY", "shield-check"],
    ["BACKUP", "database-backup"],
  ]);
  const processIconNames = new Map([
    ["Choose the platform", "layout-grid"],
    ["Configure the domain", "settings"],
    ["Connect the team", "users"],
    ["Identify critical data", "folder-search"],
    ["Protect", "shield-check"],
    ["Prove recovery", "refresh-cw"],
    ["Baseline", "search"],
    ["Prioritize", "list-checks"],
    ["Strengthen", "lock-keyhole"],
    ["Inventory", "clipboard-list"],
    ["Standardize", "sliders-horizontal"],
    ["Maintain", "wrench"],
    ["Review", "search"],
    ["Build", "settings"],
    ["Move and verify", "check-circle"],
    ["Discovery", "search"],
    ["Support plan", "file-text"],
    ["Operate and review", "rotate-cw"],
    ["Plan the workspace", "layout-dashboard"],
    ["Configure and migrate", "cloud-upload"],
    ["Launch with guidance", "rocket"],
    ["Assess", "wifi"],
    ["Improve", "router"],
    ["Document", "file-check"],
    ["Tell us what changed", "message-circle"],
    ["We connect securely", "monitor"],
    ["Fix, test, explain", "badge-check"],
    ["Send the request", "send"],
    ["We review", "search"],
    ["Take the next step", "arrow-right"],
    ["Tell us what you need", "message-circle"],
    ["We review and connect", "headset"],
    ["Resolve and document", "clipboard-check"],
  ]);
  const valueIconNames = new Map([
    ["Human first", "heart-handshake"],
    ["Clear thinking", "lightbulb"],
    ["Security built in", "shield-check"],
    ["Documented work", "file-text"],
  ]);
  const highlightIconNames = new Map([
    ["Safer accounts", "shield-check"],
    ["Recoverable files", "database-backup"],
    ["Clear priorities", "list-checks"],
  ]);
  const outcomeIconNames = new Map([
    ["Email from your company domain", "mail"],
    ["Better message delivery", "send"],
    ["Reduced account takeover risk", "shield-check"],
    ["Clear ownership of shared inboxes", "users"],
    ["Recoverable business files", "database-backup"],
    ["Protection from accidental deletion", "shield"],
    ["Less reliance on a single device or account", "copy-check"],
    ["A documented recovery path", "file-check"],
    ["Stronger protection against stolen passwords", "key-round"],
    ["Reduced exposure from old accounts", "user-minus"],
    ["Safer employee devices", "laptop"],
    ["A clear response plan for suspicious activity", "clipboard-check"],
    ["Consistent setup across the team", "settings"],
    ["Better control of company access", "lock-keyhole"],
    ["Faster employee onboarding", "user-plus"],
    ["Reduced risk from lost or old devices", "shield-check"],
    ["Consistent business communication", "message-square"],
    ["Organized team file sharing", "folders"],
    ["Safer account access", "shield-check"],
    ["Simple administration as the team grows", "users"],
    ["Predictable access to support", "headset"],
    ["Fewer neglected maintenance tasks", "wrench"],
    ["Consistent onboarding and offboarding", "users"],
    ["Better planning for technology costs", "bar-chart-3"],
    ["Professional company email", "mail-check"],
    ["Clear access to shared information", "folder-open"],
    ["Safer sign-ins", "key-round"],
    ["A setup employees can understand", "book-open"],
    ["More reliable daily connectivity", "wifi"],
    ["Better coverage in work areas", "radio-tower"],
    ["Safer guest access", "user-check"],
    ["Faster troubleshooting when issues occur", "search"],
    ["Less downtime for employees", "clock"],
    ["A clear point of contact for IT questions", "message-circle"],
    ["Fewer repeated problems", "repeat-2"],
    ["Support that scales with your team", "trending-up"],
    ["A clear starting point", "flag"],
    ["Less time guessing at the cause", "search"],
    ["Support matched to the issue", "route"],
    ["Useful follow-up documentation", "file-text"],
  ]);

  const createIconPlaceholder = (name, className = "") => {
    const icon = document.createElement("i");
    icon.dataset.lucide = name;
    icon.setAttribute("aria-hidden", "true");
    if (className) icon.className = className;
    return icon;
  };

  const replaceWithIcon = (element, name) => {
    const icon = createIconPlaceholder(name, element.className);
    element.replaceWith(icon);
    return icon;
  };

  const initializeIcons = () => {
    if (!window.lucide?.createIcons) return;

    const glyphIcons = new Map([
      ["✉", "mail"],
      ["⌖", "map-pin"],
      ["✦", "sparkles"],
      ["✓", "check"],
      ["◇", "message-circle"],
      ["◷", "monitor"],
      ["⬡", "shield-check"],
      ["•", "wrench"],
      ["↗", "external-link"],
    ]);

    document.querySelectorAll(".icon-glyph").forEach((element) => {
      const glyph = element.textContent.trim();
      let iconName = glyphIcons.get(glyph);
      const serviceTitle = (
        element.closest(".service-card")?.querySelector("h3")?.textContent.trim() ||
        element.closest(".service-hero")?.querySelector("h1")?.textContent.trim()
      );
      if (serviceTitle && serviceIconNames.has(serviceTitle)) {
        iconName = serviceIconNames.get(serviceTitle);
      }
      const guideCategory = element.closest(".guide-card")
        ?.querySelector("span:not(.icon-glyph)")?.textContent.trim();
      if (guideCategory && guideIconNames.has(guideCategory)) {
        iconName = guideIconNames.get(guideCategory);
      }
      const processTitle = element.closest(".process-card")
        ?.querySelector("h3")?.textContent.trim();
      if (processTitle && processIconNames.has(processTitle)) {
        iconName = processIconNames.get(processTitle);
      }
      const valueTitle = element.closest(".value-card")
        ?.querySelector("h3")?.textContent.trim();
      if (valueTitle && valueIconNames.has(valueTitle)) {
        iconName = valueIconNames.get(valueTitle);
      }
      const outcomeTitle = element.closest(".outcome-list > div")
        ?.querySelector("p")?.textContent.trim();
      if (outcomeTitle && outcomeIconNames.has(outcomeTitle)) {
        iconName = outcomeIconNames.get(outcomeTitle);
      }
      const highlightTitle = element.closest(".mini-outcomes > div, .floating-note")
        ?.querySelector("strong")?.textContent.trim();
      if (highlightTitle && highlightIconNames.has(highlightTitle)) {
        iconName = highlightIconNames.get(highlightTitle);
      }
      if (iconName) replaceWithIcon(element, iconName);
    });

    const inlineIcons = new Map([
      ["→", "arrow-right"],
      ["⌄", "chevron-down"],
      ["☰", "menu"],
      ["↗", "external-link"],
    ]);
    document.querySelectorAll('span[aria-hidden="true"]').forEach((element) => {
      const iconName = inlineIcons.get(element.textContent.trim());
      if (iconName) replaceWithIcon(element, iconName);
    });

    document.querySelectorAll(".breadcrumbs > span").forEach((element) => {
      if (element.textContent.trim() === "›") replaceWithIcon(element, "chevron-right");
    });
    document.querySelectorAll(".fit-faq summary > span").forEach((element) => {
      if (element.textContent.trim() === "+") replaceWithIcon(element, "plus");
    });
    document.querySelectorAll(".modal-close").forEach((button) => {
      if (button.textContent.trim() === "×") button.replaceChildren(createIconPlaceholder("x"));
    });
    document.querySelectorAll(".modal-check").forEach((element) => {
      if (element.textContent.trim() === "✓") element.replaceChildren(createIconPlaceholder("check"));
    });
    document.querySelectorAll(".eyebrow").forEach((element) => {
      const label = element.textContent.trim();
      if (!label.startsWith("✦")) return;
      element.replaceChildren(
        createIconPlaceholder("sparkles"),
        document.createTextNode(label.replace(/^✦\s*/, "")),
      );
    });

    window.lucide.createIcons({
      attrs: {
        "aria-hidden": "true",
        "stroke-width": 1.8,
      },
    });
  };

  initializeIcons();

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
    document.querySelectorAll("[data-config-address]").forEach((element) => { element.textContent = config.contact.address; });
    document.querySelectorAll("[data-config-website-label]").forEach((element) => { element.textContent = config.contact.websiteLabel; });
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

    if (config.collaboration) {
      document.querySelectorAll("[data-collaboration-title]").forEach((element) => {
        element.textContent = config.collaboration.title;
      });
      document.querySelectorAll("[data-collaboration-text]").forEach((element) => {
        element.textContent = config.collaboration.text;
      });
    }

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

  const initializeCookieBanner = () => {
    const cookieSettings = config.cookies;
    if (!cookieSettings) return;

    const readPreference = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(cookieSettings.storageKey) || "null");
        return ["all", "essential"].includes(saved?.choice) ? saved.choice : "";
      } catch {
        return "";
      }
    };

    const savePreference = (choice) => {
      document.documentElement.dataset.cookiePreference = choice;
      try {
        localStorage.setItem(cookieSettings.storageKey, JSON.stringify({
          choice,
          savedAt: new Date().toISOString(),
        }));
      } catch {
        // The preference applies for this page even if browser storage is unavailable.
      }
      window.dispatchEvent(new CustomEvent("cookie-preference-change", { detail: { choice } }));
    };

    const closeBanner = (banner) => {
      banner.classList.add("is-closing");
      window.setTimeout(() => banner.remove(), 220);
    };

    const showBanner = () => {
      const openBanner = document.querySelector("[data-cookie-banner]");
      if (openBanner) {
        openBanner.querySelector(".cookie-banner__title")?.focus();
        return;
      }

      const currentChoice = readPreference();
      const banner = document.createElement("section");
      banner.className = "cookie-banner";
      banner.dataset.cookieBanner = "";
      banner.setAttribute("role", "dialog");
      banner.setAttribute("aria-labelledby", "cookie-banner-title");
      banner.setAttribute("aria-describedby", "cookie-banner-message");

      const iconWrap = document.createElement("div");
      iconWrap.className = "cookie-banner__icon";
      iconWrap.append(createIconPlaceholder("cookie"));

      const copy = document.createElement("div");
      copy.className = "cookie-banner__copy";
      const title = document.createElement("h2");
      title.id = "cookie-banner-title";
      title.className = "cookie-banner__title";
      title.tabIndex = -1;
      title.textContent = cookieSettings.title;
      const message = document.createElement("p");
      message.id = "cookie-banner-message";
      message.textContent = cookieSettings.message;
      const policy = document.createElement("a");
      policy.href = cookieSettings.policyUrl;
      policy.textContent = cookieSettings.policyLabel;
      copy.append(title, message, policy);

      const actions = document.createElement("div");
      actions.className = "cookie-banner__actions";
      const essentialButton = document.createElement("button");
      essentialButton.type = "button";
      essentialButton.className = "button button-outline";
      essentialButton.textContent = cookieSettings.essentialLabel;
      essentialButton.setAttribute("aria-pressed", String(currentChoice === "essential"));
      const acceptButton = document.createElement("button");
      acceptButton.type = "button";
      acceptButton.className = "button button-primary";
      acceptButton.textContent = cookieSettings.acceptLabel;
      acceptButton.setAttribute("aria-pressed", String(currentChoice === "all"));
      actions.append(essentialButton, acceptButton);

      const choose = (choice) => {
        savePreference(choice);
        closeBanner(banner);
      };
      essentialButton.addEventListener("click", () => choose("essential"));
      acceptButton.addEventListener("click", () => choose("all"));

      banner.append(iconWrap, copy, actions);
      body.append(banner);
      window.lucide?.createIcons({
        root: banner,
        attrs: { "aria-hidden": "true", "stroke-width": 1.8 },
      });
      window.requestAnimationFrame(() => banner.classList.add("is-visible"));
    };

    const savedChoice = readPreference();
    if (savedChoice) document.documentElement.dataset.cookiePreference = savedChoice;
    else showBanner();

    const footerColumn = document.querySelector(".footer-column");
    if (footerColumn) {
      const settingsButton = document.createElement("button");
      settingsButton.type = "button";
      settingsButton.className = "cookie-settings-link";
      settingsButton.textContent = cookieSettings.settingsLabel;
      settingsButton.addEventListener("click", showBanner);
      footerColumn.append(settingsButton);
    }
  };

  initializeCookieBanner();

  const initializePageTransitions = () => {
    const loader = document.createElement("div");
    loader.className = "page-loader";
    loader.dataset.pageLoader = "";
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-live", "polite");
    loader.setAttribute("aria-hidden", "true");

    const panel = document.createElement("div");
    panel.className = "page-loader__panel";
    const visual = document.createElement("div");
    visual.className = "page-loader__visual";
    const mark = document.createElement("span");
    mark.className = "page-loader__mark";
    mark.textContent = config.brand.shortMark;
    const ring = document.createElement("span");
    ring.className = "page-loader__ring";
    ring.setAttribute("aria-hidden", "true");
    visual.append(mark, ring);

    const copy = document.createElement("div");
    copy.className = "page-loader__copy";
    const brand = document.createElement("strong");
    brand.textContent = config.brand.siteName;
    const label = document.createElement("span");
    label.textContent = config.ui?.pageLoaderLabel || "Loading page";
    copy.append(brand, label);
    panel.append(visual, copy);
    loader.append(panel);
    body.append(loader);

    let navigationTimer = 0;
    const showLoader = () => {
      window.clearTimeout(navigationTimer);
      loader.setAttribute("aria-hidden", "false");
      body.classList.add("page-transitioning");
      window.requestAnimationFrame(() => loader.classList.add("is-active"));
    };
    const hideLoader = () => {
      window.clearTimeout(navigationTimer);
      loader.classList.remove("is-active");
      loader.setAttribute("aria-hidden", "true");
      body.classList.remove("page-transitioning");
    };

    document.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest("a[href]");
      if (
        !link ||
        link.hasAttribute("download") ||
        link.dataset.noTransition !== undefined ||
        (link.target && link.target.toLowerCase() !== "_self")
      ) return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      if (
        destination.origin !== window.location.origin ||
        !["http:", "https:"].includes(destination.protocol) ||
        (
          destination.pathname === window.location.pathname &&
          destination.search === window.location.search
        )
      ) return;

      event.preventDefault();
      showLoader();
      const transitionDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 160;
      navigationTimer = window.setTimeout(() => window.location.assign(destination.href), transitionDelay);
    });

    window.addEventListener("pagehide", showLoader);
    window.addEventListener("pageshow", hideLoader);
  };

  initializePageTransitions();
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

  const serviceCategories = [...document.querySelectorAll("[data-service-category]")];
  if (serviceCategories.length) {
    const compactServicesQuery = window.matchMedia("(max-width: 640px)");
    const syncServiceCategories = (query) => {
      const requestedCategoryIndex = serviceCategories.findIndex((category) => (
        category.id && `#${category.id}` === window.location.hash
      ));
      const compactCategoryIndex = requestedCategoryIndex >= 0 ? requestedCategoryIndex : 0;
      serviceCategories.forEach((category, index) => {
        category.open = query.matches ? index === compactCategoryIndex : true;
      });
    };

    syncServiceCategories(compactServicesQuery);
    if (typeof compactServicesQuery.addEventListener === "function") {
      compactServicesQuery.addEventListener("change", syncServiceCategories);
    } else {
      compactServicesQuery.addListener(syncServiceCategories);
    }
    window.addEventListener("hashchange", () => syncServiceCategories(compactServicesQuery));

    serviceCategories.forEach((category) => {
      category.addEventListener("toggle", () => {
        if (!compactServicesQuery.matches || !category.open) return;
        serviceCategories.forEach((otherCategory) => {
          if (otherCategory !== category) otherCategory.open = false;
        });
      });
    });
  }

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
