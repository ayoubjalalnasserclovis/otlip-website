(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function i(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(t){if(t.ep)return;t.ep=!0;const r=i(t);fetch(t.href,r)}})();document.addEventListener("DOMContentLoaded",()=>{f(),p(),b(),g(),y()});function f(){const e=document.getElementById("cursor");if(!e)return;let o=window.innerWidth/2,i=window.innerHeight/2,n=o,t=i;const r=.15;window.addEventListener("mousemove",s=>{o=s.clientX,i=s.clientY});function l(){let s=o-n,c=i-t;n+=s*r,t+=c*r,e.style.left=`${n}px`,e.style.top=`${t}px`,requestAnimationFrame(l)}l(),document.querySelectorAll(".sector-card, .pricing-card, .btn-primary, .btn-secondary, .btn-pricing, .nav-link, .nav-cta, .newsletter-btn").forEach(s=>{s.addEventListener("mouseenter",()=>{e.classList.add("hovered");const c=s.getAttribute("data-cursor-label")||"Otlip";e.setAttribute("data-label",c)}),s.addEventListener("mouseleave",()=>{e.classList.remove("hovered"),e.removeAttribute("data-label")})});const u=document.querySelectorAll(".sectors-section, .process-section, .footer-cta-section");window.addEventListener("scroll",()=>{let s=!1;const c=e.getBoundingClientRect();u.forEach(m=>{const d=m.getBoundingClientRect();c.top>=d.top&&c.bottom<=d.bottom&&c.left>=d.left&&c.right<=d.right&&(s=!0)}),s?e.classList.add("dark-theme"):e.classList.remove("dark-theme")})}function p(){const e=document.getElementById("nav-header");e&&window.addEventListener("scroll",()=>{window.scrollY>50?e.classList.add("scrolled"):e.classList.remove("scrolled")})}function b(){const e=document.querySelectorAll(".reveal"),o=document.createElement("style");o.innerHTML=`
    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
      will-change: transform, opacity;
    }
    .reveal.active {
      opacity: 1;
      transform: translateY(0);
    }
  `,document.head.appendChild(o);const i={root:null,rootMargin:"0px",threshold:.1},n=new IntersectionObserver(t=>{t.forEach(r=>{r.isIntersecting&&(r.target.classList.add("active"),n.unobserve(r.target))})},i);e.forEach(t=>n.observe(t))}function g(){const e=document.getElementById("lead-form");e&&e.addEventListener("submit",o=>{o.preventDefault();const i=document.getElementById("name").value;document.getElementById("email").value;const n=document.getElementById("phone").value,t=document.getElementById("business").value,r=e.querySelector(".newsletter-btn"),l=r.textContent;r.textContent="Initialisation du projet en cours...",r.disabled=!0,setTimeout(()=>{const a=document.createElement("div");a.style.cssText=`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: rgba(12, 16, 24, 0.95);
        color: #fff;
        padding: 4rem 3rem;
        border-radius: 32px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        z-index: 10000;
        text-align: center;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(16px);
        transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        opacity: 0;
      `,a.innerHTML=`
        <span style="font-size: 3rem; display: block; margin-bottom: 2rem;">✨</span>
        <h3 style="font-family: 'Saans Medium', sans-serif; font-size: 2rem; margin-bottom: 1.5rem; letter-spacing: -0.03em;">Félicitations, ${i} !</h3>
        <p style="font-family: 'Saans Light', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 2.5rem;">
          Votre demande de création gratuite a été validée pour l'activité : <strong>${t}</strong>.<br><br>
          Un designer conseil Otlip vous contactera sous 2 heures au <strong>${n}</strong> pour démarrer l'élaboration de votre maquette.
        </p>
        <button id="close-success" style="
          font-family: 'Saans Medium', sans-serif;
          background: #fff;
          color: #0c1018;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 9999px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s;
        ">Retour au studio</button>
      `,document.body.appendChild(a),setTimeout(()=>{a.style.opacity="1",a.style.transform="translate(-50%, -50%) scale(1)"},50),document.getElementById("close-success").addEventListener("click",()=>{a.style.opacity="0",a.style.transform="translate(-50%, -50%) scale(0.9)",setTimeout(()=>{a.remove(),e.reset(),r.textContent=l,r.disabled=!1},500)})},1500)})}function y(){const e=document.querySelector(".mobile-nav-toggle"),o=document.querySelector(".nav-menu");!e||!o||e.addEventListener("click",()=>{o.style.cssText=o.style.display==="flex"?"display: none":`
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 80px;
      left: 0;
      width: 100%;
      background: rgba(12, 16, 24, 0.95);
      backdrop-filter: blur(16px);
      padding: 2rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      gap: 1.5rem;
      z-index: 999;
    `})}
