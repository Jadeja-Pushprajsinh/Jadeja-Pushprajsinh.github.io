/**
 * Portfolio - script.js
 * Author: Pushparajsinh P. Jadeja
 * Description: All interactive features for the portfolio website
 */

/* ================================================
   1. INITIALIZE AOS (Animate On Scroll)
================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // Initialize AOS library
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,       // Animation duration in ms
      easing: 'ease-out-cubic',
      once: true,          // Only animate once
      offset: 80,          // Trigger offset from bottom of viewport
      delay: 0,
    });
  }

  /* ================================================
     2. NAVBAR SCROLL EFFECT
  ================================================ */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load

  /* ================================================
     3. ACTIVE NAV LINK ON SCROLL
  ================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120; // Offset for navbar

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active from all links
        navLinks.forEach(function (link) {
          link.classList.remove('active');
        });

        // Add active to matching link
        const activeLink = document.querySelector('.nav-link[data-section="' + sectionId + '"]');
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* ================================================
     4. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
  ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Close mobile menu if open
      closeMobileMenu();

      // Scroll to target with offset
      const navbarHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--navbar-height')) || 68;

      const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth',
      });
    });
  });

  /* ================================================
     5. HAMBURGER MENU (MOBILE)
  ================================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMobileMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
        hamburger.focus();
      }
    });
  }

  /* ================================================
     6. TYPING ANIMATION
  ================================================ */
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const roles = [
      'Software Engineer',
      'Backend Developer',
      'ASP.NET Developer',
      'Django Developer',
    ];

    let roleIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;
    let typingTimer;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        // Typing forward
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
          // Finished typing - wait before deleting
          isDeleting = true;
          typingTimer = setTimeout(typeEffect, 2200);
          return;
        }
        typingTimer = setTimeout(typeEffect, 85);
      } else {
        // Deleting
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Finished deleting - move to next role
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          typingTimer = setTimeout(typeEffect, 400);
          return;
        }
        typingTimer = setTimeout(typeEffect, 45);
      }
    }

    // Start after a brief delay
    setTimeout(typeEffect, 1200);
  }

  /* ================================================
     7. COPY EMAIL TO CLIPBOARD
  ================================================ */
  const emailCard  = document.getElementById('email-contact-card');
  const copyToast  = document.getElementById('copy-toast');
  const emailValue = document.getElementById('email-value');
  const copyIcon   = document.getElementById('email-copy-icon');

  function copyEmail() {
    if (!emailCard) return;

    const email = emailCard.getAttribute('data-email') || 'pushparajsinh@example.com';

    // Use Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(showCopySuccess).catch(fallbackCopy.bind(null, email));
    } else {
      fallbackCopy(email);
    }
  }

  function fallbackCopy(text) {
    // Fallback for non-secure contexts
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopySuccess();
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textarea);
  }

  function showCopySuccess() {
    if (copyToast) {
      copyToast.classList.add('show');
      setTimeout(function () {
        copyToast.classList.remove('show');
      }, 2000);
    }
  }

  if (emailCard) {
    emailCard.addEventListener('click', copyEmail);
    emailCard.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyEmail();
      }
    });
  }

  /* ================================================
     8. BACK TO TOP BUTTON
  ================================================ */
  const backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });
  handleBackToTop();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================================================
     9. FOOTER: DYNAMIC YEAR
  ================================================ */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ================================================
     10. LAZY LOAD IMAGES (IntersectionObserver)
  ================================================ */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px',
    });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  /* ================================================
     11. PROJECT CARD TILT EFFECT (subtle)
  ================================================ */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const midX  = rect.width  / 2;
      const midY  = rect.height / 2;
      const rotX  = ((y - midY) / midY) * -4;  // max 4deg
      const rotY  = ((x - midX) / midX) *  4;

      card.style.transform = 'translateY(-6px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
      card.style.transition = 'transform 100ms linear';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'all 350ms cubic-bezier(0.4,0,0.2,1)';
    });
  });

  /* ================================================
     12. SKILL BADGE MICRO-ANIMATION ON HOVER
  ================================================ */
  const skillBadges = document.querySelectorAll('.skill-badge');
  skillBadges.forEach(function (badge) {
    badge.addEventListener('mouseenter', function () {
      this.style.transition = 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });

  /* ================================================
     13. SCROLL PROGRESS INDICATOR (optional)
  ================================================ */
  // Create a thin progress bar at the top of the page
  const progressBar = document.createElement('div');
  progressBar.setAttribute('aria-hidden', 'true');
  progressBar.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'height: 2px',
    'width: 0%',
    'background: linear-gradient(90deg, #0F766E, #14B8A6)',
    'z-index: 9999',
    'transition: width 100ms linear',
    'pointer-events: none',
  ].join(';');
  document.body.prepend(progressBar);

  window.addEventListener('scroll', function () {
    const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress   = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  /* ================================================
     14. CERTIFICATE CARD HOVER GLOW
  ================================================ */
  const certCards = document.querySelectorAll('.certificate-card');
  certCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      this.style.boxShadow = '0 16px 40px rgba(15,118,110,0.18)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.boxShadow = '';
    });
  });

  /* ================================================
     15. CONTACT CARD KEYBOARD NAVIGATION HINT
  ================================================ */
  // Make contact cards focusable and interactive
  const contactCardLinks = document.querySelectorAll('a.contact-card');
  contactCardLinks.forEach(function (card) {
    card.addEventListener('focus', function () {
      this.style.borderColor = 'var(--color-primary)';
    });
    card.addEventListener('blur', function () {
      this.style.borderColor = '';
    });
  });

}); // End DOMContentLoaded
