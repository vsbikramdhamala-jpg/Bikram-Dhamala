/* =========================================================
   BIKRAM DHAMALA PORTFOLIO
========================================================= */

const body = document.body;
const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("section[id]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const projectCards = [...document.querySelectorAll(".project-card")];
const contactForm = document.getElementById("contactForm");
const year = document.getElementById("year");
const toast = document.getElementById("toast");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) {
    year.textContent = new Date().getFullYear();
}

let toastTimer;

function showToast(message) {
    if (!toast) {
        return;
    }

    const text = toast.querySelector("span");
    if (text) {
        text.textContent = message;
    }

    toast.classList.add("show");
    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function setMenuState(isOpen) {
    if (!navMenu || !menuBtn) {
        return;
    }

    navMenu.classList.toggle("is-open", isOpen);
    menuBtn.classList.toggle("is-active", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen && window.innerWidth <= 860);
}

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        const isOpen = !navMenu.classList.contains("is-open");
        setMenuState(isOpen);
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("click", (event) => {
    if (!header || !navMenu || window.innerWidth > 860) {
        return;
    }

    if (navMenu.classList.contains("is-open") && !header.contains(event.target)) {
        setMenuState(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenuState(false);
    }
});

function updateHeader() {
    if (!header) {
        return;
    }

    header.classList.toggle("scrolled", window.scrollY > 20);
}

function updateActiveNav() {
    if (!sections.length || !navLinks.length) {
        return;
    }

    const triggerPoint = window.scrollY + 180;
    let activeId = sections[0].id;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (triggerPoint >= top && triggerPoint < top + height) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const matches = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("active", matches);
    });
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
        setMenuState(false);
    }
});

updateHeader();
updateActiveNav();

if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.16 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter || "all";

        filterButtons.forEach((item) => {
            item.classList.toggle("active", item === button);
        });

        projectCards.forEach((card) => {
            const category = card.dataset.category || "";
            const visible = filter === "all" || category === filter;
            card.classList.toggle("is-hidden", !visible);
        });
    });
});

function setMediaPreview(imageId, placeholderId, dataUrl) {
    const image = document.getElementById(imageId);
    const placeholder = document.getElementById(placeholderId);

    if (!image || !placeholder) {
        return;
    }

    image.src = dataUrl;
    image.hidden = false;
    placeholder.hidden = true;
}

function clearMediaPreview(imageId, placeholderId) {
    const image = document.getElementById(imageId);
    const placeholder = document.getElementById(placeholderId);

    if (!image || !placeholder) {
        return;
    }

    image.removeAttribute("src");
    image.hidden = true;
    placeholder.hidden = false;
}

const mediaFields = {
    profile: {
        inputId: "profileUpload",
        imageId: "profilePreview",
        placeholderId: "profilePlaceholder",
        storageKey: "bikram-portfolio-profile-photo",
        successMessage: "Profile photo updated."
    },
    aurora: {
        inputId: "auroraUpload",
        imageId: "auroraPreview",
        placeholderId: "auroraPlaceholder",
        storageKey: "bikram-portfolio-aurora-logo",
        successMessage: "Aurora logo updated."
    },
    bonsai: {
        inputId: "bonsaiUpload",
        imageId: "bonsaiPreview",
        placeholderId: "bonsaiPlaceholder",
        storageKey: "bikram-portfolio-bonsai-logo",
        successMessage: "Bonsai logo updated."
    }
};

function saveMedia(storageKey, dataUrl) {
    try {
        localStorage.setItem(storageKey, dataUrl);
        return true;
    } catch (error) {
        return false;
    }
}

function loadMedia(storageKey) {
    try {
        return localStorage.getItem(storageKey);
    } catch (error) {
        return null;
    }
}

function removeMedia(storageKey) {
    try {
        localStorage.removeItem(storageKey);
    } catch (error) {
        return;
    }
}

Object.values(mediaFields).forEach((field) => {
    const savedValue = loadMedia(field.storageKey);
    if (savedValue) {
        setMediaPreview(field.imageId, field.placeholderId, savedValue);
    }

    const input = document.getElementById(field.inputId);
    if (!input) {
        return;
    }

    input.addEventListener("change", () => {
        const [file] = input.files || [];
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            showToast("Please choose an image file.");
            input.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const dataUrl = String(reader.result || "");

            if (!dataUrl) {
                showToast("That image could not be loaded.");
                return;
            }

            setMediaPreview(field.imageId, field.placeholderId, dataUrl);

            if (saveMedia(field.storageKey, dataUrl)) {
                showToast(field.successMessage);
            } else {
                showToast("Preview added. Use a smaller image if it does not stay after refresh.");
            }
        };

        reader.readAsDataURL(file);
    });
});

document.querySelectorAll("[data-clear-target]").forEach((button) => {
    button.addEventListener("click", () => {
        const key = button.getAttribute("data-clear-target");
        const field = mediaFields[key];

        if (!field) {
            return;
        }

        clearMediaPreview(field.imageId, field.placeholderId);
        removeMedia(field.storageKey);

        const input = document.getElementById(field.inputId);
        if (input) {
            input.value = "";
        }

        showToast("Preview cleared.");
    });
});

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const subject = document.getElementById("subject")?.value.trim() || "";
        const message = document.getElementById("message")?.value.trim() || "";

        if (!name || !email || !subject || !message) {
            showToast("Please fill in all fields.");
            return;
        }

        const bodyText = [
            `Name: ${name}`,
            `Email: ${email}`,
            "",
            message
        ].join("\n");

        const mailto =
            "mailto:bikram.official77@gmail.com?subject=" +
            encodeURIComponent(subject) +
            "&body=" +
            encodeURIComponent(bodyText);

        showToast("Email draft is opening.");

        setTimeout(() => {
            window.location.href = mailto;
        }, 120);

        contactForm.reset();
    });
}
