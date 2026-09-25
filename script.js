/* =========================================================
   BIKRAM DHAMALA PORTFOLIO
   Vanilla JavaScript
========================================================= */


/* ================= CONFIGURATION ================= */

// Replace this URL with your actual SheetDB API endpoint (e.g., https://sheetdb.io/api/v1/abcd1234efgh)
const SHEETDB_API_URL = "YOUR_SHEETDB_API_URL";


/* ================= ELEMENTS ================= */

const body = document.body;

const header = document.getElementById("header");

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

const themeBtn = document.getElementById("themeBtn");

const navLinks = document.querySelectorAll(".nav-link");

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

const revealElements = document.querySelectorAll(".reveal");

const contactForm = document.getElementById("contactForm") || document.getElementById("contact-form");
const toast = document.getElementById("toast");

const year = document.getElementById("year");

const roleTextEl = document.getElementById("roleText");


/* ================= CURRENT YEAR ================= */

if (year) {
  year.textContent = new Date().getFullYear();
}


/* ================= HERO ROLE TYPEWRITER ================= */

const roles = [
  "UI/UX Designer",
  "Frontend Developer",
  "Graphic Designer"
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (roleTextEl && !prefersReducedMotion) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = false;

  function tickRole() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      if (charIndex > current.length) {
        charIndex = current.length;
        deleting = true;
        setTimeout(tickRole, 1600);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        charIndex = 0;
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    roleTextEl.textContent = roles[roleIndex].slice(0, charIndex);
    setTimeout(tickRole, deleting ? 45 : 85);
  }

  setTimeout(() => {
    deleting = true;
    tickRole();
  }, 1800);
}


/* ================= MOBILE MENU ================= */

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");

    const icon = menuBtn.querySelector("i");
    if (icon) {
      if (navMenu.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    }
  });
}

/* Close mobile menu after clicking a link */
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (navMenu) {
      navMenu.classList.remove("open");
    }
    if (menuBtn) {
      const icon = menuBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    }
  });
});


/* ================= THEME ================= */

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
  body.classList.add("light");
  if (themeBtn) {
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("light");

    const isLight = body.classList.contains("light");
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");

    themeBtn.innerHTML = isLight
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  });
}


/* ================= HEADER SCROLL ================= */

function updateHeader() {
  if (header) {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
}

window.addEventListener("scroll", updateHeader);
updateHeader();


/* ================= ACTIVE NAV ================= */

const sections = document.querySelectorAll("section[id]");

function updateActiveNav() {
  let currentSection = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNav);


/* ================= SCROLL REVEAL ================= */

const observer = new IntersectionObserver(
  (entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        entry.target.classList.add("visible");
        observerInstance.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach(element => {
  observer.observe(element);
});


/* ================= PROJECT FILTER ================= */

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach(card => {
      const category = card.dataset.category;

      if (filter === "all" || category === filter) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    });
  });
});


/* ================= TOAST ================= */

let toastTimer;

function showToast(message) {
  if (toast) {
    const toastText = toast.querySelector("span") || toast;
    toastText.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  } else {
    // Fallback if toast element isn't in DOM
    const resultNotice = document.getElementById("form-result");
    if (resultNotice) {
      resultNotice.textContent = message;
    } else {
      alert(message);
    }
  }
}


/* ================= CONTACT FORM (Web3Forms + SheetDB) ================= */

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name") || contactForm.querySelector('[name="Name"]');
    const emailInput = document.getElementById("email") || contactForm.querySelector('[name="Email"]');
    const subjectInput = document.getElementById("subject") || contactForm.querySelector('[name="Subject"]');
    const messageInput = document.getElementById("message") || contactForm.querySelector('[name="Message"]');

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const subject = subjectInput ? subjectInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!name || !email || !subject || !message) {
      showToast("Please fill in all fields.");
      return;
    }

    showToast("Sending message...");

    const formData = new FormData(contactForm);

    // Step 1: Send via Web3Forms
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
      .then(async (response) => {
        const json = await response.json();

        if (response.status === 200) {
          // Step 2: Push row to SheetDB / Google Sheets
          const dataToSend = {
            data: [
              {
                date: new Date().toLocaleString(),
                name: name,
                email: email,
                subject: subject,
                message: message
              }
            ]
          };

          return fetch(SHEETDB_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
          });
        } else {
          throw new Error(json.message || "Form submission failed.");
        }
      })
      .then((sheetResponse) => {
        if (sheetResponse && sheetResponse.ok) {
          showToast("Message sent and saved successfully!");
          contactForm.reset();
        } else {
          showToast("Message sent to email, but failed to record in spreadsheet.");
        }
      })
      .catch((error) => {
        console.error("Contact Form Error:", error);
        showToast("Something went wrong. Please try again.");
      });
  });
}


/* ================= SMOOTH ANCHOR ================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (event) {
    const targetId = this.getAttribute("href");

    if (targetId === "#" || !targetId) {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


/* ================= BUTTON PRESS FEEDBACK ================= */

document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", function () {
    this.style.transform = "scale(0.98)";

    setTimeout(() => {
      this.style.transform = "";
    }, 120);
  });
});
