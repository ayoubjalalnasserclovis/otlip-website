// Quiz & Interactive Comparison Logic for Otlip x Quicklify

document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
  initComparisonTool();
  initFaqAccordion();
});

function initQuiz() {
  const quizForm = document.getElementById("project-quiz-form");
  if (!quizForm) return;

  let currentStep = 1;
  const totalSteps = 4;

  const stepElements = [
    document.getElementById("quiz-step-1"),
    document.getElementById("quiz-step-2"),
    document.getElementById("quiz-step-3"),
    document.getElementById("quiz-step-4")
  ];

  const progressBar = document.getElementById("quiz-progress-bar");
  const stepNumberText = document.getElementById("quiz-step-number");
  const btnPrev = document.getElementById("quiz-btn-prev");
  const btnNext = document.getElementById("quiz-btn-next");

  // Session ID & UTM tracking
  let sessionId = localStorage.getItem("otlip_quiz_session_id");
  if (!sessionId) {
    sessionId = "otlip_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem("otlip_quiz_session_id", sessionId);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source") || null;
  const utmMedium = urlParams.get("utm_medium") || null;
  const utmCampaign = urlParams.get("utm_campaign") || null;

  // Selection states
  const quizData = {
    session_id: sessionId,
    current_step: 1,
    status: "in_progress",
    project_type: "vitrine",
    business_name: "",
    activity_sector: "",
    target_audience: "",
    design_style: "minimaliste",
    specific_needs: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign
  };

  // Sync touch or drop-off directly to Supabase REST API (100% reliable, zero cold start)
  async function syncProgress(step, status = "in_progress") {
    quizData.current_step = step;
    quizData.status = status;

    const supabaseUrl = "https://pcxzyykqvenyurffepok.supabase.co/rest/v1/quiz_leads";
    const supabaseKey = "sb_publishable_Yd99sfuyTBruMSOr_KKSzA_8qqkOhbt";

    const payload = JSON.stringify({
      session_id: quizData.session_id,
      current_step: quizData.current_step,
      status: quizData.status,
      project_type: quizData.project_type || null,
      business_name: quizData.business_name || null,
      activity_sector: quizData.activity_sector || null,
      target_audience: quizData.target_audience || null,
      design_style: quizData.design_style || null,
      specific_needs: quizData.specific_needs || null,
      client_name: quizData.client_name || null,
      client_email: quizData.client_email || null,
      client_phone: quizData.client_phone || null,
      utm_source: quizData.utm_source || null,
      utm_medium: quizData.utm_medium || null,
      utm_campaign: quizData.utm_campaign || null,
      updated_at: new Date().toISOString()
    });

    try {
      const response = await fetch(supabaseUrl, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: payload,
        keepalive: true
      });
      return response.ok;
    } catch (err) {
      console.warn("Supabase sync warning:", err);
      return false;
    }
  }

  // Initial sync on load
  syncProgress(1, "in_progress");

  // Option Cards click handlers
  document.querySelectorAll(".quiz-option-card").forEach(card => {
    card.addEventListener("click", () => {
      const group = card.dataset.group;
      const val = card.dataset.value;

      document.querySelectorAll(`.quiz-option-card[data-group="${group}"]`).forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      if (group === "projectType") quizData.project_type = val;
      if (group === "designStyle") quizData.design_style = val;

      syncProgress(currentStep, "in_progress");
    });
  });

  function updateStepUI() {
    stepElements.forEach((el, idx) => {
      if (el) {
        if (idx + 1 === currentStep) {
          el.style.display = "block";
          el.classList.add("active");
        } else {
          el.style.display = "none";
          el.classList.remove("active");
        }
      }
    });

    if (progressBar) {
      progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
    }

    if (stepNumberText) {
      stepNumberText.textContent = `ÉTAPE 0${currentStep} / 0${totalSteps}`;
    }

    if (btnPrev) {
      btnPrev.style.visibility = currentStep === 1 ? "hidden" : "visible";
    }

    if (btnNext) {
      if (currentStep === totalSteps) {
        btnNext.innerHTML = `
          <span>Lancer la création de mon site</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        `;
      } else {
        btnNext.innerHTML = `
          <span>Étape suivante</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        `;
      }
    }
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
        syncProgress(currentStep, "in_progress");
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", async (e) => {
      e.preventDefault();

      // Step validations & Meta Pixel firing
      if (currentStep === 1) {
        if (window.fbq) {
          fbq("trackCustom", "Quiz_Step1_Completed", {
            project_type: quizData.project_type
          });
        }
        currentStep++;
        updateStepUI();
        syncProgress(currentStep, "in_progress");
      } else if (currentStep === 2) {
        const busName = document.getElementById("quiz-business-name")?.value.trim();
        const activity = document.getElementById("quiz-activity")?.value.trim();
        if (!busName || !activity) {
          alert("Veuillez indiquer le nom de votre entreprise et votre activité.");
          return;
        }
        quizData.business_name = busName;
        quizData.activity_sector = activity;
        quizData.target_audience = document.getElementById("quiz-target")?.value.trim() || "";

        if (window.fbq) {
          fbq("trackCustom", "Quiz_Step2_Completed", {
            business_name: busName,
            activity: activity
          });
        }
        currentStep++;
        updateStepUI();
        syncProgress(currentStep, "in_progress");
      } else if (currentStep === 3) {
        quizData.specific_needs = document.getElementById("quiz-needs")?.value.trim() || "";

        if (window.fbq) {
          fbq("trackCustom", "Quiz_Step3_Completed", {
            design_style: quizData.design_style
          });
        }
        currentStep++;
        updateStepUI();
        syncProgress(currentStep, "in_progress");
      } else if (currentStep === 4) {
        const name = document.getElementById("quiz-client-name")?.value.trim();
        const email = document.getElementById("quiz-client-email")?.value.trim();
        const phone = document.getElementById("quiz-client-phone")?.value.trim();

        if (!name || !email || !phone) {
          alert("Veuillez renseigner votre nom, adresse email et téléphone.");
          return;
        }

        quizData.client_name = name;
        quizData.client_email = email;
        quizData.client_phone = phone;
        quizData.status = "completed";

        btnNext.disabled = true;
        btnNext.innerHTML = "Transmission au studio...";

        // Fire Meta Pixel Standard Lead Event
        if (window.fbq) {
          fbq("track", "Lead", {
            content_name: quizData.business_name,
            content_category: quizData.project_type,
            value: 39.00,
            currency: "EUR"
          });
        }

        // Final sync: await network call to guarantee writing before page unload
        await syncProgress(4, "completed");

        window.location.href = "/merci.html";
      }
    });
  }

  updateStepUI();
}

function showQuizSuccessModal(data) {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: rgba(12, 16, 24, 0.96);
    color: #fff;
    padding: 3.5rem 3rem;
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    z-index: 10000;
    text-align: center;
    max-width: 560px;
    width: 92%;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    opacity: 0;
  `;

  modal.innerHTML = `
    <span style="font-size: 3.5rem; display: block; margin-bottom: 1.5rem;">✨</span>
    <span style="font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; color: var(--color-accent-orange); letter-spacing: 0.15em; font-weight: 700; display: block; margin-bottom: 0.75rem;">BRIEF ENREGISTRÉ · CRÉATION 100% OFFERTE</span>
    <h3 style="font-family: var(--font-sans); font-size: 2rem; margin-bottom: 1.25rem; letter-spacing: -0.03em;">Votre site est en préparation, ${data.clientName}.</h3>
    <p style="font-family: var(--font-sans); font-size: 0.98rem; color: rgba(255,255,255,0.75); line-height: 1.6; margin-bottom: 2rem;">
      Notre équipe conçoit l'architecture et les maquettes de <strong>${data.businessName}</strong>. Vous recevrez l'accès interactif pour tester l'intégralité du site en conditions réelles.<br><br>
      <span style="color: #ffffff; background: rgba(228, 108, 68, 0.15); padding: 0.35rem 0.75rem; border-radius: 8px; border: 1px solid rgba(228, 108, 68, 0.3);">
        <strong>Engagement contractuel :</strong> Vous validez le résultat avant le moindre prélèvement.
      </span>
    </p>
    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.25rem; margin-bottom: 2.5rem; font-size: 0.88rem; color: rgba(255,255,255,0.7); text-align: left;">
      <p style="margin-bottom: 0.5rem;">✉️ Lien de démonstration envoyé à : <strong>${data.clientEmail}</strong></p>
      <p style="margin: 0;">📱 Notification de mise à disposition au : <strong>${data.clientPhone}</strong></p>
    </div>
    <button id="close-quiz-success" style="
      font-family: var(--font-sans);
      font-weight: 600;
      background: #ffffff;
      color: #0c1018;
      border: none;
      padding: 1.1rem 2.75rem;
      border-radius: 9999px;
      font-size: 1rem;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
      transition: all 0.3s;
    ">Retour au site</button>
  `;

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.style.opacity = "1";
    modal.style.transform = "translate(-50%, -50%) scale(1)";
  }, 50);

  document.getElementById("close-quiz-success")?.addEventListener("click", () => {
    modal.style.opacity = "0";
    modal.style.transform = "translate(-50%, -50%) scale(0.9)";
    setTimeout(() => {
      modal.remove();
      document.getElementById("project-quiz-form")?.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 450);
  });
}

function initComparisonTool() {
  const monthsSlider = document.getElementById("comparison-months-slider");
  const agencyCostDisplay = document.getElementById("agency-calculated-cost");
  const otlipCostDisplay = document.getElementById("otlip-calculated-cost");
  const savingsDisplay = document.getElementById("savings-calculated-amount");
  const sliderMonthsLabel = document.getElementById("slider-months-count");

  if (!monthsSlider) return;

  function recalculate() {
    const months = parseInt(monthsSlider.value, 10);
    if (sliderMonthsLabel) sliderMonthsLabel.textContent = `${months} mois`;

    // Traditional Agency calculation:
    // Upfront: 2500€
    // Maintenance & fixes: 90€/month
    // Hosting + Domain: 15€/month
    const agencyTotal = 2500 + (months * 105);

    // Otlip leasing model:
    // Upfront: 0€
    // Monthly all inclusive: 39€/month
    const otlipTotal = months * 39;

    const savings = agencyTotal - otlipTotal;

    if (agencyCostDisplay) agencyCostDisplay.textContent = `${agencyTotal.toLocaleString("fr-FR")} €`;
    if (otlipCostDisplay) otlipCostDisplay.textContent = `${otlipTotal.toLocaleString("fr-FR")} €`;
    if (savingsDisplay) savingsDisplay.textContent = `${savings.toLocaleString("fr-FR")} €`;
  }

  monthsSlider.addEventListener("input", recalculate);
  recalculate();
}

function initFaqAccordion() {
  const accordionItems = document.querySelectorAll(".faq-accordion-item");
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const header = item.querySelector(".faq-accordion-header");
    if (!header) return;

    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all items
      accordionItems.forEach(i => {
        i.classList.remove("open");
        const h = i.querySelector(".faq-accordion-header");
        if (h) h.setAttribute("aria-expanded", "false");
      });

      // If it wasn't open, open it
      if (!isOpen) {
        item.classList.add("open");
        header.setAttribute("aria-expanded", "true");
      }
    });
  });
}
