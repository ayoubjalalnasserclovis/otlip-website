// Quiz & Interactive Comparison Logic for Otlip x Quicklify

document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
  initComparisonTool();
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

  // Selection states
  const quizData = {
    projectType: "vitrine",
    currentSituation: "creation",
    businessName: "",
    activitySector: "",
    targetAudience: "",
    designStyle: "minimaliste",
    hasLogoContent: "none",
    specificNeeds: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    preferredContact: "whatsapp"
  };

  // Option Cards click handlers
  document.querySelectorAll(".quiz-option-card").forEach(card => {
    card.addEventListener("click", () => {
      const group = card.dataset.group;
      const val = card.dataset.value;

      document.querySelectorAll(`.quiz-option-card[data-group="${group}"]`).forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      quizData[group] = val;
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
          <span>Générer ma Maquette Gratuite</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        `;
      } else {
        btnNext.innerHTML = `
          <span>Continuer</span>
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
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", (e) => {
      e.preventDefault();

      // Step validations
      if (currentStep === 1) {
        currentStep++;
        updateStepUI();
      } else if (currentStep === 2) {
        const busName = document.getElementById("quiz-business-name")?.value.trim();
        const activity = document.getElementById("quiz-activity")?.value.trim();
        if (!busName || !activity) {
          alert("Veuillez renseigner le nom de votre entreprise et votre domaine d'activité.");
          return;
        }
        quizData.businessName = busName;
        quizData.activitySector = activity;
        quizData.targetAudience = document.getElementById("quiz-target")?.value.trim() || "";
        currentStep++;
        updateStepUI();
      } else if (currentStep === 3) {
        quizData.specificNeeds = document.getElementById("quiz-needs")?.value.trim() || "";
        currentStep++;
        updateStepUI();
      } else if (currentStep === 4) {
        const name = document.getElementById("quiz-client-name")?.value.trim();
        const email = document.getElementById("quiz-client-email")?.value.trim();
        const phone = document.getElementById("quiz-client-phone")?.value.trim();

        if (!name || !email || !phone) {
          alert("Veuillez renseigner votre nom, email et téléphone afin de recevoir le lien de prévisualisation.");
          return;
        }

        quizData.clientName = name;
        quizData.clientEmail = email;
        quizData.clientPhone = phone;

        btnNext.disabled = true;
        btnNext.innerHTML = "Création du dossier en cours...";

        // Fire Meta Pixel lead if present
        if (window.fbq) {
          fbq("track", "Lead", {
            content_name: quizData.businessName,
            content_category: quizData.projectType
          });
        }

        setTimeout(() => {
          showQuizSuccessModal(quizData);
          btnNext.disabled = false;
          btnNext.innerHTML = "Générer ma Maquette Gratuite";
        }, 1200);
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
    <span style="font-size: 3.5rem; display: block; margin-bottom: 1.5rem;">🎉</span>
    <span style="font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; color: var(--color-accent-orange); letter-spacing: 0.15em; font-weight: 700; display: block; margin-bottom: 0.75rem;">DOSSIER VALIDÉ · 0€ À AVANCER</span>
    <h3 style="font-family: var(--font-sans); font-size: 2rem; margin-bottom: 1.25rem; letter-spacing: -0.03em;">Félicitations, ${data.clientName} !</h3>
    <p style="font-family: var(--font-sans); font-size: 0.98rem; color: rgba(255,255,255,0.75); line-height: 1.6; margin-bottom: 2rem;">
      Votre brief pour <strong>${data.businessName}</strong> est transmis au studio. Nous concevons la maquette interactive de votre site sous <strong>72 heures</strong>.<br><br>
      <span style="color: #ffffff; background: rgba(228, 108, 68, 0.15); padding: 0.35rem 0.75rem; border-radius: 8px; border: 1px solid rgba(228, 108, 68, 0.3);">
        <strong>Rappel Garanti :</strong> Vous verrez et testerez le site complet avant de payer le moindre centime.
      </span>
    </p>
    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.25rem; margin-bottom: 2.5rem; font-size: 0.88rem; color: rgba(255,255,255,0.7); text-align: left;">
      <p style="margin-bottom: 0.5rem;">📱 Contact de confirmation envoyé à : <strong>${data.clientEmail}</strong></p>
      <p style="margin: 0;">📞 Suivi WhatsApp/SMS sous 2h au : <strong>${data.clientPhone}</strong></p>
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
    ">Retour à l'accueil</button>
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
    // Creation fee: 2500€
    // Maintenance: 90€/month
    // Hosting + Domain: 15€/month
    const agencyTotal = 2500 + (months * 105);

    // Otlip calculation:
    // Creation fee: 0€
    // Monthly leasing: 39€/month all inclusive
    const otlipTotal = months * 39;

    const savings = agencyTotal - otlipTotal;

    if (agencyCostDisplay) agencyCostDisplay.textContent = `${agencyTotal.toLocaleString("fr-FR")} €`;
    if (otlipCostDisplay) otlipCostDisplay.textContent = `${otlipTotal.toLocaleString("fr-FR")} €`;
    if (savingsDisplay) savingsDisplay.textContent = `${savings.toLocaleString("fr-FR")} €`;
  }

  monthsSlider.addEventListener("input", recalculate);
  recalculate();
}
