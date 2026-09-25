(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const iconStyles = document.createElement("link");
    iconStyles.rel = "stylesheet";
    iconStyles.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
    document.head.append(iconStyles);
  }

  const footer = document.querySelector("footer");
  if (footer && !footer.classList.contains("home-footer")) {
    footer.className = "home-footer";
    footer.innerHTML = `
      <div class="container home-footer-grid">
        <div class="footer-brand">
          <a class="footer-wordmark" href="index.html" aria-label="Bikram Dhamala home"><img class="footer-portrait" src="51182 Bikram.jpg" alt="Bikram Dhamala"><strong>Bikram Dhamala</strong></a>
          <p>Thoughtful interfaces and useful digital experiences, designed with care.</p>
          <nav class="footer-socials" aria-label="Social profiles">
            <a href="https://github.com/vsbikramdhamala-jpg" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fa-brands fa-github" aria-hidden="true"></i></a>
            <a href="https://www.linkedin.com/in/biksss-dhamala/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
            <a href="https://www.instagram.com/11bkram.dhamala/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
            <a href="https://www.facebook.com/bikramdhamala.official" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i></a>
            <a href="https://wa.me/9779767486348" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp: 9767486348"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></a>
          </nav>
        </div>
        <div class="footer-column">
          <h2>Contact</h2>
          <a class="footer-detail" href="tel:+9779767486348"><i class="fa-solid fa-phone" aria-hidden="true"></i><span>+977 9767486348</span></a>
          <a class="footer-detail" href="mailto:bikram.official77@gmail.com"><i class="fa-solid fa-envelope" aria-hidden="true"></i><span>bikram.official77@gmail.com</span></a>
          <a class="footer-detail" href="https://wa.me/9779767486348" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>Message on WhatsApp</span></a>
        </div>
        <div class="footer-column">
          <h2>Current Role</h2>
          <p><strong>Operations Officer</strong></p>
          <p>Aurora Education Foundation</p>
          <a class="footer-text-link" href="experience.html">View my experience <span aria-hidden="true">↗</span></a>
        </div>
        <nav class="footer-column footer-quick-links" aria-label="Quick links">
          <h2>Quick Links</h2>
          <a href="index.html"><i class="fa-solid fa-house" aria-hidden="true"></i>Home</a>
          <a href="about.html"><i class="fa-solid fa-user-group" aria-hidden="true"></i>About</a>
          <a href="services.html"><i class="fa-solid fa-layer-group" aria-hidden="true"></i>Services</a>
          <a href="projects.html"><i class="fa-solid fa-table-cells-large" aria-hidden="true"></i>Projects</a>
          <a href="experience.html"><i class="fa-solid fa-briefcase" aria-hidden="true"></i>Experience</a>
          <a href="contact.html"><i class="fa-solid fa-message" aria-hidden="true"></i>Contact</a>
        </nav>
      </div>
      <div class="home-footer-bottom">
        <div class="container home-footer-bottom-inner">
          <span>© ${new Date().getFullYear()} Bikram Dhamala</span>
          <span>UI/UX Design <b>|</b> Frontend Development <b>|</b> Digital Experiences</span>
        </div>
      </div>`;
  }

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-label", "Page scroll progress");
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");
  document.body.append(progress);

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 0;
    progress.style.transform = `scaleX(${value / 100})`;
    progress.setAttribute("aria-valuenow", String(value));
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
  }

  document.querySelectorAll(".skill").forEach(skill => {
    const value = skill.querySelector("strong");
    const percent = Number.parseInt(value?.textContent ?? "0", 10);
    if (!Number.isFinite(percent)) return;
    skill.style.setProperty("--skill-level", `${Math.min(100, Math.max(0, percent))}%`);
    const meter = document.createElement("div");
    meter.className = "skill-meter";
    meter.setAttribute("aria-hidden", "true");
    meter.append(document.createElement("span"));
    skill.append(meter);
  });

  document.querySelectorAll("img").forEach(image => {
    if (!image.hasAttribute("alt")) {
      image.alt = image.closest("a")?.getAttribute("aria-label") || "Portfolio image";
    }
    image.loading = "lazy";
    image.decoding = "async";
  });

  document.querySelectorAll(".photo-slides .photo-slide img").forEach((image, index) => {
    image.alt = `Bikram Dhamala portrait ${index + 1}`;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    if (index === 0) image.fetchPriority = "high";
  });

  const role = document.querySelector(".home-role");
  if (role && !reduceMotion) {
    const roles = ["UI/UX Designer", "Frontend Developer", "Operations Officer"];
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;
    const typeRole = () => {
      const text = roles[roleIndex];
      characterIndex += deleting ? -1 : 1;
      role.firstChild.textContent = text.slice(0, characterIndex);
      if (characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      } else if (characterIndex >= text.length) {
        deleting = true;
        window.setTimeout(typeRole, 1500);
        return;
      }
      window.setTimeout(typeRole, deleting ? 45 : 75);
    };
    role.firstChild.textContent = roles[0];
    window.setTimeout(typeRole, 1800);
  }

  document.querySelectorAll(".contact-item-copy").forEach(button => {
    button.addEventListener("click", async () => {
      const email = button.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        button.textContent = "Copied";
      } catch {
        window.location.href = `mailto:${email}`;
        button.textContent = "Open email";
      }
      window.setTimeout(() => { button.textContent = "Copy email"; }, 1800);
    });
  });

  document.querySelectorAll("form[action^='mailto:']").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      const address = form.action.slice("mailto:".length);
      const subject = encodeURIComponent(data.get("Subject") || "Portfolio inquiry");
      const body = encodeURIComponent(
        `Name: ${data.get("Name")}\nEmail: ${data.get("Email")}\n\n${data.get("Message")}`
      );
      window.location.href = `mailto:${address}?subject=${subject}&body=${body}`;
    });
  });
})();