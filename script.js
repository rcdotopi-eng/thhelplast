/* =========================================================
   Thesis Help Pakistan — Global Script (FINAL)
   Vanilla JS only | Academic & Institutional
   ========================================================= */

(() => {
  "use strict";

  /* -----------------------------
     Helpers
  ------------------------------ */
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const formatPKR = (n) =>
    "PKR " + Math.round(n).toLocaleString("en-PK");

  /* -----------------------------
     Footer year
  ------------------------------ */
  const yearEl = qs("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------
     Announcement dismiss
  ------------------------------ */
  const ann = qs("[data-announcement]");
  const annClose = qs("[data-announcement-close]");
  if (ann && annClose) {
    annClose.addEventListener("click", () => ann.remove());
  }

  /* -----------------------------
     Mobile nav toggle
  ------------------------------ */
  const navToggle = qs("[data-nav-toggle]");
  const navList = qs("[data-nav-list]");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navList.style.display = open ? "none" : "flex";
    });
  }

  /* -----------------------------
     WhatsApp CTA wiring
     (replace number once live)
  ------------------------------ */
  const WHATSAPP_NUMBER = "920000000000";
  qsa("[data-whatsapp]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const msg = encodeURIComponent(
        "Hello, I would like academic guidance regarding my thesis/research."
      );
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,
        "_blank",
        "noopener"
      );
    });
  });

  /* ========================================================
     Academic Price Calculator
     ======================================================== */
  const baseRateByType = {
    proposal: 4500,
    thesis: 6000,
    litreview: 5500,
    methodology: 6500,
    editing: 3000,
    formatting: 2500
  };

  const levelMultiplier = {
    bs: 1.0,
    ms: 1.25,
    phd: 1.5
  };

  const deadlineMultiplier = {
    30: 1.0,
    14: 1.15,
    7: 1.3,
    3: 1.6
  };

  const rubricMultiplier = {
    standard: 1.0,
    detailed: 1.15,
    hec: 1.25
  };

  const minimumFee = 5000;

  const calcForm = qs("[data-calc-form]");
  const priceEl = qs("[data-calc-price]");

  const computeEstimate = () => {
    if (!calcForm || !priceEl) return;

    const paperType = qs("#paperType")?.value;
    const level = qs("#level")?.value;
    const unitType = qs("#unitType")?.value;
    const quantity = Math.max(1, parseInt(qs("#quantity")?.value || 1, 10));
    const deadline = qs("#deadline")?.value;
    const rubric = qs("#rubric")?.value;

    const base = baseRateByType[paperType] || 0;
    const lv = levelMultiplier[level] || 1;
    const dl = deadlineMultiplier[deadline] || 1;
    const rb = rubricMultiplier[rubric] || 1;

    const pages =
      unitType === "words" ? Math.ceil(quantity / 250) : quantity;

    let total = base * pages * lv * dl * rb;
    total = Math.max(total, minimumFee);

    priceEl.textContent = formatPKR(total);
  };

  if (calcForm) {
    qsa("select, input", calcForm).forEach((el) =>
      el.addEventListener("change", computeEstimate)
    );
    computeEstimate();
  }

  /* ========================================================
     Reviews Slider
     ======================================================== */
  const slider = qs("[data-review-slider]");
  const track = qs("[data-review-track]");
  const prevBtn = qs("[data-review-prev]");
  const nextBtn = qs("[data-review-next]");
  let index = 0;

  const updateSlider = () => {
    if (!track) return;
    const width = slider.clientWidth;
    track.style.transform = `translateX(-${index * width}px)`;
  };

  if (track && prevBtn && nextBtn) {
    nextBtn.addEventListener("click", () => {
      index = Math.min(index + 1, track.children.length - 1);
      updateSlider();
    });
    prevBtn.addEventListener("click", () => {
      index = Math.max(index - 1, 0);
      updateSlider();
    });
    window.addEventListener("resize", updateSlider);
  }

  /* ========================================================
     FAQ Accordion
     ======================================================== */
  qsa("[data-accordion] .faq__q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      const panel = btn.closest(".faq__item")?.querySelector(".faq__a");
      if (panel) panel.hidden = expanded;
    });
  });

  /* ========================================================
     PDF-style Sample Viewer Modal
     ======================================================== */
  const modal = qs("[data-pdf-modal]");
  const closeModal = qs("[data-pdf-close]");

  qsa("[data-sample-view]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (modal) modal.hidden = false;
    });
  });

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => (modal.hidden = true));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  }

  /* ========================================================
     Faculty Directory Search / Filter
     ======================================================== */
  (() => {
    const search = qs("[data-dir-search]");
    const filter = qs("[data-dir-filter]");
    const cards = qsa("[data-dir-card]");
    if (!search || !filter || !cards.length) return;

    const apply = () => {
      const q = search.value.toLowerCase();
      const f = filter.value;
      cards.forEach((card) => {
        const tags = (card.dataset.tags || "").toLowerCase();
        const text = card.textContent.toLowerCase();
        const okQ = !q || tags.includes(q) || text.includes(q);
        const okF = f === "all" || tags.includes(f);
        card.style.display = okQ && okF ? "" : "none";
      });
    };

    search.addEventListener("input", apply);
    filter.addEventListener("change", apply);
    apply();
  })();

  /* ========================================================
     Research Glossary Search
     ======================================================== */
  (() => {
    const search = qs("[data-gloss-search]");
    const filter = qs("[data-gloss-filter]");
    const terms = qsa("[data-term]");
    if (!search || !filter || !terms.length) return;

    const apply = () => {
      const q = search.value.toLowerCase();
      const cat = filter.value;
      terms.forEach((t) => {
        const key = (t.dataset.key || "").toLowerCase();
        const c = (t.dataset.cat || "").toLowerCase();
        const text = t.textContent.toLowerCase();
        const okQ = !q || key.includes(q) || text.includes(q);
        const okC = cat === "all" || c === cat;
        t.style.display = okQ && okC ? "" : "none";
      });
    };

    search.addEventListener("input", apply);
    filter.addEventListener("change", apply);
    apply();
  })();

  /* ========================================================
     Supervisor Comment Upload (local only)
     ======================================================== */
  const fileInput = qs("#commentsFile");
  const fileInfo = qs("#fileInfo");
  const clearBtn = qs("#clearFile");

  if (fileInput && fileInfo && clearBtn) {
    fileInput.addEventListener("change", () => {
      const f = fileInput.files[0];
      if (!f) return;
      fileInfo.hidden = false;
      fileInfo.textContent = `Attached file: ${f.name} (${Math.round(
        f.size / 1024
      )} KB)`;
    });

    clearBtn.addEventListener("click", () => {
      fileInput.value = "";
      fileInfo.hidden = true;
      fileInfo.textContent = "";
    });
  }

  /* ========================================================
     Bilingual Toggle (EN / UR)
     ======================================================== */
  const LANG_KEY = "thp_lang";
  const langBtns = qsa("[data-lang]");

  const I18N = {
    en: {
      faculty_title: "Consultant faculty profiles (research-focused)",
      faculty_lead:
        "Our consultants follow academic conventions: supervision notes, citation discipline, and methodology alignment.",
      defense_title:
        "Defense-prep consultation (viva & final submission)",
      defense_lead:
        "Structured preparation for presentations, examiner questions, and methodology justification—delivered in calm, academic language."
    },
    ur: {
      faculty_title: "کنسلٹنٹ فیکلٹی پروفائلز (ریسرچ فوکسڈ)",
      faculty_lead:
        "ہمارے کنسلٹنٹس تعلیمی اصولوں کے مطابق رہنمائی فراہم کرتے ہیں۔",
      defense_title:
        "ڈیفنس پریپ کنسلٹیشن (وائیوا اور فائنل سبمشن)",
      defense_lead:
        "پریزنٹیشن اور ایگزامنر سوالات کے لیے منظم تعلیمی تیاری۔"
    }
  };

  const applyLang = (lang) => {
    const dict = I18N[lang] || I18N.en;
    qsa("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });

    document.documentElement.lang = lang === "ur" ? "ur-PK" : "en-PK";
    document.body.classList.toggle("is-rtl", lang === "ur");

    langBtns.forEach((b) => {
      const active = b.dataset.lang === lang;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active);
    });

    localStorage.setItem(LANG_KEY, lang);
  };

  langBtns.forEach((b) =>
    b.addEventListener("click", () => applyLang(b.dataset.lang))
  );

  applyLang(
    new URLSearchParams(location.search).get("lang") ||
      localStorage.getItem(LANG_KEY) ||
      "en"
  );

  /* ========================================================
     HEC Checklist — Real PDF Generator (text-only)
     ======================================================== */
  (() => {
    const btn = qs("#downloadChecklistPdf");
    const content = qs("#checklistContent");
    if (!btn || !content) return;

    const extractLines = () => {
      const lines = [];
      content.querySelectorAll("h1,h2,li").forEach((el) => {
        lines.push(el.textContent.trim());
      });
      return lines;
    };

    const makePdf = (lines) => {
      const esc = (s) =>
        s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
      let text = "BT /F1 11 Tf 56 800 Td\n";
      lines.forEach((l) => {
        text += `(${esc(l)}) Tj\n0 -14 Td\n`;
      });
      text += "ET";

      const pdf =
        `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]
/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
5 0 obj << /Length ${text.length} >> stream
${text}
endstream endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000061 00000 n
0000000120 00000 n
0000000250 00000 n
0000000315 00000 n
trailer << /Size 6 /Root 1 0 R >>
startxref
420
%%EOF`;

      return new Blob([pdf], { type: "application/pdf" });
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const blob = makePdf(extractLines());
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "HEC-Thesis-Checklist.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 500);
    });
  })();
})();
