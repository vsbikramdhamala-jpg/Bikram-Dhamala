/* =========================================================
   BIKRAM DHAMALA PORTFOLIO
   Vanilla JavaScript
========================================================= */


/* ================= ELEMENTS ================= */

const body = document.body;

const header = document.getElementById("header");

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

const themeBtn = document.getElementById("themeBtn");

const navLinks = document.querySelectorAll(".nav-link");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const projectCards =
    document.querySelectorAll(".project-card");

const revealElements =
    document.querySelectorAll(".reveal");

const contactForm =
    document.getElementById("contactForm");

const toast =
    document.getElementById("toast");

const year =
    document.getElementById("year");


/* ================= CURRENT YEAR ================= */

year.textContent = new Date().getFullYear();


/* ================= MOBILE MENU ================= */

menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("open");

    const icon = menuBtn.querySelector("i");

    if (navMenu.classList.contains("open")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


/* Close mobile menu after clicking a link */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* ================= THEME ================= */

const savedTheme =
    localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {

    body.classList.add("light");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}


themeBtn.addEventListener("click", () => {

    body.classList.toggle("light");

    const isLight =
        body.classList.contains("light");

    localStorage.setItem(
        "portfolio-theme",
        isLight ? "light" : "dark"
    );

    themeBtn.innerHTML = isLight

        ? '<i class="fa-solid fa-sun"></i>'

        : '<i class="fa-solid fa-moon"></i>';

});


/* ================= HEADER SCROLL ================= */

function updateHeader() {

    if (window.scrollY > 30) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}

window.addEventListener("scroll", updateHeader);

updateHeader();


/* ================= ACTIVE NAV ================= */

const sections =
    document.querySelectorAll("section[id]");


function updateActiveNav() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}

window.addEventListener(
    "scroll",
    updateActiveNav
);


/* ================= SCROLL REVEAL ================= */

const observer =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    observer.observe(element);

});


/* ================= PROJECT FILTER ================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter =
            button.dataset.filter;


        /* Active button */

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        /* Filter cards */

        projectCards.forEach(card => {

            const category =
                card.dataset.category;


            if (
                filter === "all" ||
                category === filter
            ) {

                card.classList.remove("hide");

            } else {

                card.classList.add("hide");

            }

        });

    });

});


/* ================= CONTACT FORM ================= */

contactForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();


        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {

            showToast(
                "Please fill in all fields."
            );

            return;

        }


        /*
            This is a frontend-only form.

            To actually send emails, connect this form
            to Formspree, EmailJS, Firebase or your own backend.
        */


        showToast(
            "Message submitted successfully!"
        );


        contactForm.reset();

    }
);


/* ================= TOAST ================= */

let toastTimer;


function showToast(message) {

    const toastText =
        toast.querySelector("span");

    toastText.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* ================= SMOOTH ANCHOR ================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {

    anchor.addEventListener(
        "click",
        function (event) {

            const targetId =
                this.getAttribute("href");

            if (
                targetId === "#" ||
                !targetId
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});


/* ================= BUTTON RIPPLE ================= */

document.querySelectorAll(".btn").forEach(button => {

    button.addEventListener("click", function () {

        this.style.transform =
            "scale(0.98)";

        setTimeout(() => {

            this.style.transform = "";

        }, 120);

    });

});