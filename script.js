const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const yearNode = document.querySelector("#year");

const whatsappNumber = "919688879994";

/* =========================
   CERTIFICATE TOGGLE FIX
========================= */
function toggleCertificate() {
  const cert = document.getElementById("certificate");

  if (!cert) return;

  if (cert.style.display === "none" || cert.style.display === "") {
    cert.style.display = "block";
    cert.scrollIntoView({ behavior: "smooth" });
  } else {
    cert.style.display = "none";
  }
}

/* =========================
   MOBILE NAV TOGGLE
========================= */
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("open");
  });

  siteNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("open");
    });
  });
}

/* =========================
   YEAR AUTO UPDATE
========================= */
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
