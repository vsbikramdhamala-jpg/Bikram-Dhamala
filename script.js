const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const tiltItems = document.querySelectorAll("[data-tilt]");
const form = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
const year = document.querySelector("[data-year]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
    year.textContent = new Date().getFullYear();
}

function updateHeader() {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMenu() {
    if (!nav || !menuToggle) {
        return;
    }

    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    body.classList.remove("nav-open");
}

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
        body.classList.toggle("nav-open", isOpen);
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

revealItems.forEach((item, index) => {
    item.style.setProperty("--delay", `${Math.min((index % 4) * 0.08, 0.24)}s`);
});

if (!prefersReducedMotion && "IntersectionObserver" in window) {
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
        {
            threshold: 0.16
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const id = entry.target.getAttribute("id");

                navLinks.forEach((link) => {
                    const isActive = link.getAttribute("href") === `#${id}`;
                    link.classList.toggle("is-active", isActive);
                });
            });
        },
        {
            rootMargin: "-20% 0px -55% 0px",
            threshold: 0.2
        }
    );

    sections.forEach((section) => navObserver.observe(section));
}

if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    tiltItems.forEach((item) => {
        let frameId = 0;

        item.addEventListener("mousemove", (event) => {
            const bounds = item.getBoundingClientRect();
            const relativeX = (event.clientX - bounds.left) / bounds.width;
            const relativeY = (event.clientY - bounds.top) / bounds.height;
            const rotateY = (relativeX - 0.5) * 10;
            const rotateX = (0.5 - relativeY) * 8;

            cancelAnimationFrame(frameId);

            frameId = window.requestAnimationFrame(() => {
                item.style.transform =
                    `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });

        item.addEventListener("mouseleave", () => {
            cancelAnimationFrame(frameId);
            item.style.transform = "";
        });
    });
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const activeFilter = button.dataset.filter;

        filterButtons.forEach((candidate) => {
            const isActive = candidate === button;
            candidate.classList.toggle("is-active", isActive);
            candidate.setAttribute("aria-pressed", String(isActive));
        });

        projectCards.forEach((card) => {
            const isVisible =
                activeFilter === "all" ||
                card.dataset.category === activeFilter;

            window.clearTimeout(card.hideTimer);

            if (isVisible) {
                card.hidden = false;

                window.requestAnimationFrame(() => {
                    card.classList.remove("is-filtered-out");
                });

                return;
            }

            card.classList.add("is-filtered-out");
            card.hideTimer = window.setTimeout(() => {
                if (card.classList.contains("is-filtered-out")) {
                    card.hidden = true;
                }
            }, 220);
        });
    });
});

if (form && formFeedback) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const project = document.getElementById("project");
        const message = document.getElementById("message");

        if (!name || !email || !project || !message) {
            return;
        }

        if (
            !name.value.trim() ||
            !email.value.trim() ||
            !project.value.trim() ||
            !message.value.trim()
        ) {
            formFeedback.textContent = "Please fill in all fields before sending.";
            formFeedback.dataset.state = "error";
            return;
        }

        if (!email.checkValidity()) {
            formFeedback.textContent = "Please enter a valid email address.";
            formFeedback.dataset.state = "error";
            return;
        }

        const subject = encodeURIComponent(
            `Portfolio enquiry from ${name.value.trim()}`
        );

        const bodyLines = [
            `Name: ${name.value.trim()}`,
            `Email: ${email.value.trim()}`,
            `Project Type: ${project.value.trim()}`,
            "",
            "Message:",
            message.value.trim()
        ];

        const bodyText = encodeURIComponent(bodyLines.join("\n"));

        formFeedback.textContent = "Opening your email app...";
        formFeedback.dataset.state = "success";

        window.location.href =
            `mailto:bikram.official77@gmail.com?subject=${subject}&body=${bodyText}`;

        form.reset();
    });
}
