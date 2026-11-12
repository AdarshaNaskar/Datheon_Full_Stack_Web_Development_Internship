
// DOM ELEMENTS

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const projectModal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalTech = document.getElementById("modalTech");
const modalLink = document.getElementById("modalLink");

// DARK LIGHT THEME

const savedTheme = localStorage.getItem("portfolio-theme") || "dark";

document.documentElement.setAttribute("data-theme", savedTheme);

function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    themeToggle.textContent =
        currentTheme === "dark" ? "☼" : "☾";

    themeToggle.setAttribute(
        "aria-label",
        currentTheme === "dark"
            ? "Switch to light theme"
            : "Switch to dark theme"
    );
}

updateThemeIcon();

themeToggle.addEventListener("click", () => {
    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);

    localStorage.setItem("portfolio-theme", newTheme);

    updateThemeIcon();
});

// MOBILE NAVIGATION

function closeMenu() {
    navLinks.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.textContent = isOpen ? "✕" : "☰";

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

// Close menu when a navigation link is clicked

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

// Close menu when clicking outside

document.addEventListener("click", (event) => {
    const clickedInsideMenu =
        navLinks.contains(event.target) ||
        menuToggle.contains(event.target);

    if (!clickedInsideMenu && navLinks.classList.contains("active")) {
    closeMenu();
}
});

// Close menu when pressing Escape

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});
// PROJECT DETAILS

const projects = {

    interviewpal: {
        title: "InterviewPal",

        description:
            "An AI-powered interview preparation platform. " +
            "Users can login with email securely and generate reports. " +
            "Users can upload their resumes and receive personalized " +
            "interview preparation reports, technical questions, " +
            "behavioral questions and skill gap analysis.",

        technologies: [
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "AI"
        ],

        link:"https://interviewpal-seven.vercel.app/"

    },

    nypf: {
        title: "NYPF",

        description:
            "A modern pizza café website designed to showcase " +
            "the brand, explore its menu and deliver an engaging " +
            "digital experience through interactive web design " +
            "lazy loading and interactive hero section " +
            "and animations.",

        technologies: [
            "HTML",
            "CSS",
            "JavaScript",
            "GSAP"
        ],

        link:"https://nypf.netlify.app/"

    },

    desktopAI: {
        title: "Desktop AI",

        description:
            "An AI-powered desktop assistant designed to " +
            "simplify everyday tasks through intelligent     " +
            "interactions and automation.",

        technologies: [
            "Python"
        ],

        link:"https://github.com/AdarshaNaskar/Desktop-AI"

    }

};


// Open project modal

document.querySelectorAll(".project-details").forEach(button => {

    button.addEventListener("click", () => {

        const projectId = button.dataset.project;
        const project = projects[projectId];

        if (!project) return;

        modalTitle.textContent = project.title;

        modalDescription.textContent = project.description;

        // Clear existing technologies

        modalTech.replaceChildren();

        // Add project technologies safely

        project.technologies.forEach(technology => {

            const tag = document.createElement("span");

            tag.textContent = technology;

            modalTech.appendChild(tag);

        });

        // Configure project link

        if (project.link) {

            modalLink.href = project.link;
            modalLink.style.display = "inline-block";

        } else {

            modalLink.removeAttribute("href");
            modalLink.style.display = "none";

        }

        projectModal.classList.add("active");

        projectModal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        modalClose.focus();

    });

});


// Close project modal

function closeModal() {

    projectModal.classList.remove("active");

    projectModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


// Close button

modalClose.addEventListener("click", closeModal);


// Close by clicking outside the modal

projectModal.addEventListener("click", (event) => {

    if (event.target === projectModal) {

        closeModal();

    }

});


// Close using Escape key

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && projectModal.classList.contains("active")) {

        closeModal();

    }

});
// SCROLL REVEAL ANIMATIONS

const revealElements = document.querySelectorAll(
    ".section-heading, " +
    ".about-text, " +
    ".about-details, " +
    ".skill-card, " +
    ".project-card, " +
    ".contact-content"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(

    (entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    }

);

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ACTIVE NAVIGATION

const sections = document.querySelectorAll("main section[id]");

const navigationLinks = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const currentId = entry.target.id;

                navigationLinks.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${currentId}`
                    );

                });

            }

        });

    },

    {
        threshold: 0,
        rootMargin: "-35% 0px -55% 0px"
    }

);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// CURRENT YEAR

const footerCopyright = document.querySelector(".footer-content p");

if (footerCopyright) {

    footerCopyright.textContent =
        `© ${new Date().getFullYear()} Adarsha Naskar`;

}

// INITIALNIZATIO

console.log("Portfolio initialized successfully 🚀");
