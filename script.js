/* ============================================================
   NOOR TRAVELS — script.js
   Bug fixes applied:
   1. Removed <script> tags that were illegally inside this .js file
   2. Replaced broken .star-rating span selector with correct
      .star-rating .star button selector
   3. Stars now start EMPTY (no .selected class on load)
   4. Hover previews stars before click
   5. Click locks in the rating, then triggers logic:
        4–5 stars → animate progress bar + open Google review
        1–3 stars → show textarea for improvement feedback
   6. All selectors match the HTML exactly
   ============================================================ */
 
/* ── Navbar toggle ── */
const navToggle = document.querySelector(".nav-toggle");
const siteNav   = document.querySelector(".site-nav");
 
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open", !expanded);
  });
 
  // Close menu when any nav link is clicked (mobile UX)
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}
 
/* ── Footer year ── */
const yearNode = document.querySelector("#year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}
 
/* ── Certificate toggle ── */
function toggleCertificate() {
  const cert = document.getElementById("certificate");
  if (!cert) return;
 
  if (cert.style.display === "none") {
    cert.style.display = "block";
    cert.scrollIntoView({ behavior: "smooth" });
  } else {
    cert.style.display = "none";
  }
}
 
/* ── WhatsApp enquiry form ── */
const whatsappNumber = "919688879994";
const inquiryForm    = document.querySelector("#inquiry-form");
 
if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
 
    const name    = document.querySelector("#traveller-name")?.value.trim() || "Customer";
    const service = document.querySelector("#service-type")?.value           || "Visa service";
    const country = document.querySelector("#country")?.value                || "Saudi Arabia";
    const custom  = document.querySelector("#custom-service")?.value.trim()  || "";
 
    let message = [
      "Hello Noor Travels,",
      `My name is ${name}.`,
      `I need help with ${service} for ${country}.`
    ].join(" ");
 
    if (custom !== "") {
      message += ` Additional requirement: ${custom}.`;
    }
 
    message += " Please share the next steps.";
 
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener"
    );
  });
}
 
/* ── Scroll-reveal animation ── */
const revealItems = document.querySelectorAll(".reveal");
 
if ("IntersectionObserver" in window && revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );
 
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  // Fallback: just show everything if IntersectionObserver isn't supported
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
 
 
/* ============================================================
   STAR RATING WIDGET
   Selectors match the HTML exactly:
     - Container:  #star-rating  (.star-rating)
     - Each star:  .star-rating .star  (button elements)
   States (CSS classes on each button):
     - .hovered   → amber preview on hover, NOT yet locked in
     - .selected  → locked in after click
   Logic:
     - Stars start with NO class → rendered as empty (dim white)
     - Hovering a star previews fill up to that star
     - Clicking a star locks the rating and triggers feedback
   ============================================================ */
 
(function initStarRating() {
 
  /* ── DOM references ── */
  const starButtons    = document.querySelectorAll(".star-rating .star");
  const ratingLabel    = document.getElementById("rating-label");
  const ratingFeedback = document.getElementById("rating-feedback");
  const feedbackPos    = document.getElementById("feedback-positive");
  const feedbackNeg    = document.getElementById("feedback-negative");
  const progressFill   = document.getElementById("progress-fill");
  const feedbackSubmit = document.getElementById("feedback-submit");
  const feedbackThanks = document.getElementById("feedback-thankyou");
  const feedbackInput  = document.getElementById("feedback-text-input");
 
  /* Guard: if the review section isn't on this page, exit silently */
  if (!starButtons.length || !ratingLabel || !ratingFeedback) return;
 
  /* Human-readable labels for each star count */
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
 
  /* Track whether the user has already locked in a rating */
  let ratingLocked = false;
 
  /* ── Helper: apply visual state to all stars ── */
  /* mode = "hover" | "select" | "clear"           */
  function paintStars(upToIndex, mode) {
    starButtons.forEach((btn, i) => {
      /* Remove both state classes first */
      btn.classList.remove("hovered", "selected");
 
      if (i <= upToIndex) {
        btn.classList.add(mode === "select" ? "selected" : "hovered");
      }
    });
  }
 
  /* ── Helper: clear all star classes (reset to empty) ── */
  function clearStars() {
    starButtons.forEach((btn) => btn.classList.remove("hovered", "selected"));
  }
 
  /* ── Hover: preview fill ── */
  starButtons.forEach((btn, index) => {
 
    btn.addEventListener("mouseenter", () => {
      if (ratingLocked) return;       /* ignore hover after user has rated */
      paintStars(index, "hover");
      ratingLabel.textContent = labels[index + 1];
    });
 
    btn.addEventListener("mouseleave", () => {
      if (ratingLocked) return;
      clearStars();
      ratingLabel.textContent = "";
    });
 
    /* ── Click: lock rating and show appropriate feedback ── */
    btn.addEventListener("click", () => {
      if (ratingLocked) return;       /* prevent double-click re-trigger */
      ratingLocked = true;
 
      const rating = index + 1;      /* 1–5 */
 
      /* Paint stars as permanently selected */
      paintStars(index, "select");
      ratingLabel.textContent = labels[rating];
 
      /* Show the feedback container */
      ratingFeedback.style.display = "block";
 
      if (rating >= 4) {
        /* ── Positive path: 4 or 5 stars ── */
        feedbackPos.style.display = "block";
        feedbackNeg.style.display = "none";
 
        /* Animate the progress bar, then open Google Reviews */
        requestAnimationFrame(() => {
          progressFill.classList.add("running"); /* triggers CSS transition */
        });
 
        setTimeout(() => {
  window.open(
    "https://search.google.com/local/writereview?placeid=ChIJaxyfQNMHqTsRT-iT7iIs5o8Q",
    "_blank"
  );
}, 1500);





         
         
      } else {
        /* ── Negative path: 1, 2, or 3 stars ── */
        feedbackPos.style.display = "none";
        feedbackNeg.style.display = "block";
      }
    });
 
  }); /* end forEach star */
 
  /* ── Submit feedback button (negative path) ── */
  if (feedbackSubmit) {
    feedbackSubmit.addEventListener("click", () => {
      const text = feedbackInput ? feedbackInput.value.trim() : "";
 
      /* You can send `text` to a backend here in the future */
 
      /* Hide the textarea + button, show thank-you message */
      if (feedbackInput) feedbackInput.style.display = "none";
      feedbackSubmit.style.display = "none";
      if (feedbackThanks) feedbackThanks.style.display = "block";
    });
  }
 
})(); /* IIFE keeps all variables out of global scope */
