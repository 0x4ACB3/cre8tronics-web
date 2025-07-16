/* ==========================================================================
   1.  EmailJS initialisation
   ========================================================================== */
(function () {
  emailjs.init("PzqKAe993x7KuPt_H");
})();

/* ==========================================================================
   2.  Helper utilities
   ========================================================================== */
function $(selector, scope = document) {
  return scope.querySelector(selector);
}
function $all(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}
function show(el)  { el.hidden = false; }
function hide(el)  { el.hidden = true;  }
function trapFocus(modal) {
  const focusable = $all(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
    'textarea:not([disabled]), button:not([disabled]), [tabindex="0"]',
    modal
  );
  const first = focusable[0], last = focusable[focusable.length - 1];

  function loop(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === first) {
      last.focus(); e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus(); e.preventDefault();
    }
  }
  modal.addEventListener("keydown", loop);
}

/* ==========================================================================
   3.  Product catalogue (34 items)
   ========================================================================== */
const products = [
  {
    id: 1,
    img: "https://res.cloudinary.com/dtjjgiitl/image/upload/q_auto:good,f_auto,fl_progressive/v1752399304/q4kqmzzrmar5hcbguroo.jpg",
    alt: "Flex Sensor Gesture Glove",
    name: "Smart Patient Assistance System (Glove-Based Gesture Control)",
    rating: 4.5,
    desc: "Five flex sensors on a glove let patients trigger predefined messages (\"I need water\", \"Call nurse\") displayed on an LCD/OLED. Arduino Uno / ESP8266 powered – easy to extend with Wi-Fi alerts.",
    price: 4000,
  },
  {
    id: 2,
    img: "https://res.cloudinary.com/dtjjgiitl/image/upload/q_auto:good,f_auto,fl_progressive/v1752399316/fgcvdzvt9oa5rwgsyuo3.jpg",
    alt: "Smart Obstacle Avoider",
    name: "Obstacle-Avoiding Robot – Arduino + ESP8266",
    rating: 4.0,
    desc: "Autonomous rover using ultrasonic sensors to dodge obstacles. ESP8266 adds wireless monitoring. Great intro to sensor-based navigation & IoT.",
    price: 3000,
  },
  {
    id: 3,
    img: "https://res.cloudinary.com/dtjjgiitl/image/upload/q_auto:good,f_auto,fl_progressive/v1752399665/beoawn1mlk9zpy2wyjph.jpg",
    alt: "Mobile Signal Detector",
    name: "Mobile / RF Signal Detector with Germanium Diode",
    rating: 5.0,
    desc: "Detects 2 G-5 G transmissions; LED alerts when phones nearby send data. Learn RF, interference & passive-component circuits.",
    price: 1500,
  },

  /* …­­——  NOTE:  add the remaining 31 product objects exactly the same way ——… */

  {
    id: 34,
    img: "https://res.cloudinary.com/dtjjgiitl/image/upload/q_auto:good,f_auto,fl_progressive/v1752657515/riimmjxai0mifcmph3kw.jpg",
    alt: "Spirit Level System",
    name: "Arduino-Based Spirit-Level Detection System",
    rating: 4.0,
    desc: "Accelerometer / tilt sensor reads surface level; visual/audible feedback helps align objects. Good for DIY & calibration tasks.",
    price: 1200,
  },
];

/* ==========================================================================
   4.  DOM ready bootstrap
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* 4-a.  Render product cards */
  const grid = $("#productGrid");
  grid.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image">
        <img src="${p.img}" alt="${p.alt}" loading="lazy" width="320" height="180">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="rating" aria-label="Rating ${p.rating}">
          ${"★".repeat(Math.floor(p.rating))}${p.rating % 1 ? "½" : ""} (${p.rating})
        </div>
        <p class="product-description">${p.desc}</p>
        <div class="product-footer">
          <span class="price">₹${p.price.toLocaleString()}</span>
          <button class="btn btn-primary quick-view">Quick View</button>
        </div>
      </div>
    </article>
  `).join("");

  /* 4-b.  Mobile nav */
  const hamburger = $("#hamburger");
  const nav      = $(".nav");
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
  });

  $all(".nav-link").forEach(a =>
    a.addEventListener("click", () => {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    })
  );

  /* 4-c.  Sticky header + active link on scroll */
  const header = $("#header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);

    const pos = window.scrollY;
    $all("section[id]").forEach(sec => {
      const top = sec.offsetTop - 100;
      const h   = sec.offsetHeight;
      if (pos >= top && pos < top + h) {
        $all(".nav-link").forEach(l => l.classList.toggle(
          "active", l.getAttribute("href") === `#${sec.id}`
        ));
      }
    });
  });

  /* 4-d.  Forms – shared validation */
  function validateInput(input) {
    const err = input.nextElementSibling;
    if (input.validity.valid) {
      err.textContent = ""; hide(err); input.style.borderColor = "";
    } else {
      show(err); input.style.borderColor = "var(--error-color)";
      err.textContent = input.validity.valueMissing ? "Required" :
                        input.validity.typeMismatch ? "Invalid format" :
                        input.validity.rangeUnderflow ? `Min ${input.min}` :
                        input.validity.tooShort ? `Min ${input.minLength} chars` : "Invalid";
    }
  }
  $all("form input, form textarea, form select").forEach(inp => {
    inp.addEventListener("input", () => validateInput(inp));
    inp.addEventListener("blur",  () => validateInput(inp));
  });

  /* 4-e.  Project form */
  const projectForm = $("#projectForm");
  const formSuccess = $("#formSuccess");
  $("#deadline").min = new Date().toISOString().split("T")[0];
  $("#date").value   = new Date().toLocaleDateString();

  projectForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!projectForm.checkValidity()) return projectForm.reportValidity();

    const btn = $(".submit-btn", projectForm);
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';

    emailjs.sendForm("service_pi2f9dl", "template_ewzo99a", projectForm)
      .then(() => {
        show(formSuccess);
        setTimeout(() => hide(formSuccess), 3000);
        projectForm.reset();
      })
      .catch(() => alert("Failed to send. Please try later."))
      .finally(() => { btn.disabled = false; btn.textContent = "Submit Request"; });
  });

  /* 4-f.  Quick-view modal + purchase flow */
  const modal           = $("#productModal");
  const purchaseSuccess = $("#purchaseSuccess");

  grid.addEventListener("click", e => {
    if (!e.target.closest(".quick-view")) return;
    const card = e.target.closest(".product-card");
    const id   = +card.dataset.id;
    const p    = products.find(x => x.id === id);

    $("#modalProductImage").src         = p.img;
    $("#modalProductName").textContent  = p.name;
    $("#modalProductRating").textContent= p.rating;
    $("#modalProductDescription").textContent = p.desc;
    $("#modalProductPrice").textContent = `₹${p.price.toLocaleString()}`;

    $("#productName").value  = p.name;
    $("#productPrice").value = p.price;
    $("#orderDate").value    = new Date().toLocaleDateString();

    show(modal); document.body.style.overflow = "hidden";
    trapFocus(modal);
  });

  function closeModal() {
    hide(modal); hide(purchaseSuccess);
    document.body.style.overflow = "";
  }
  $all(".close-modal").forEach(btn => btn.addEventListener("click", closeModal));
  window.addEventListener("click", e => {
    if (e.target === modal || e.target === purchaseSuccess) closeModal();
  });
  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  $("#purchaseForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!this.checkValidity()) return this.reportValidity();

    const btn = $(".submit-btn", this);
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing…';

    const params = Object.fromEntries(new FormData(this).entries());
    emailjs.send("service_pi2f9dl", "template_7yl5huk", params)
      .then(() => {
        hide(modal); show(purchaseSuccess); this.reset();
        $(".close-success").focus();
      })
      .catch(() => alert("Failed to place order."))
      .finally(() => { btn.disabled = false; btn.textContent = "Confirm Purchase"; });
  });
  $(".close-success").addEventListener("click", closeModal);

  /* 4-g.  Contact form */
  $("#contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!this.checkValidity()) return this.reportValidity();

    const btn = $(".submit-btn", this);
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    emailjs.sendForm("service_pi2f9dl", "template_ewzo99a", this)
      .then(() => { alert("Message sent!"); this.reset(); })
      .catch(() => alert("Failed to send message."))
      .finally(() => { btn.disabled = false; btn.textContent = "Send Message"; });
  });

  /* 4-h.  Newsletter */
  $("#newsletterForm").addEventListener("submit", e => {
    e.preventDefault();
    const emailInp = $("input[type=email]", e.target);
    if (!emailInp.validity.valid) return emailInp.reportValidity();

    const btn = $("button", e.target);
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    setTimeout(() => {
      alert("Thanks for subscribing!");
      e.target.reset(); btn.disabled = false; btn.textContent = "Subscribe";
    }, 1200);
  });

  /* 4-i.  Product search */
  const searchInput = $("#productSearch");
  let searchTmo;
  function doSearch() {
    const q = searchInput.value.trim().toLowerCase();
    let found = false;
    $all(".product-card", grid).forEach(card => {
      const text = card.textContent.toLowerCase();
      const showCard = q === "" || text.includes(q);
      card.style.display = showCard ? "block" : "none";
      if (showCard) found = true;
    });
    if (!found && q) {
      if (!$(".no-results", grid)) {
        const p = document.createElement("p");
        p.className = "no-results"; p.textContent = "No products found";
        grid.appendChild(p);
      }
    } else {
      $(".no-results", grid)?.remove();
    }
  }
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTmo); searchTmo = setTimeout(doSearch, 300);
  });
  $(".search-box").addEventListener("submit", e => { e.preventDefault(); doSearch(); });

  /* 4-j.  Lightbox */
  grid.addEventListener("click", e => {
    const img = e.target.closest(".product-image img");
    if (!img) return;
    $(".lightbox-img").src = img.src;
    show($(".lightbox")); document.body.style.overflow = "hidden";
  });
  $(".close-btn").addEventListener("click", () => hide($(".lightbox")));
  $(".lightbox").addEventListener("click", e => {
    if (e.target === e.currentTarget) hide($(".lightbox"));
  });
  function hide(lb){ lb.hidden = true; document.body.style.overflow = ""; }
});
