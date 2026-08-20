/**
 * ==========================================================================
 * File: /assets/js/script.js
 * Purpose: Interactive behaviors (navigation, scrolling, animations, menu).
 * Author: [SEU NOME AQUI]
 * ==========================================================================
 */

(function () {
  'use strict';

  // ======= DOM Elements =======
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const revealElements = document.querySelectorAll('.reveal');

  // ======= Mobile Navigation Menu =======
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('hidden', !isMenuOpen);
    menuIcon.classList.toggle('fa-bars', !isMenuOpen);
    menuIcon.classList.toggle('fa-xmark', isMenuOpen);
  }

  function closeMenu() {
    isMenuOpen = false;
    mobileMenu.classList.add('hidden');
    menuIcon.classList.add('fa-bars');
    menuIcon.classList.remove('fa-xmark');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  // Close mobile menu when clicking a navigation link
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !header.contains(e.target)) {
      closeMenu();
    }
  });


  // ======= Sticky Header Transition =======
  function handleScrollHeader() {
    if (window.scrollY > 50) {
      header.classList.add('glass', 'shadow-lg', 'shadow-surface-950/50');
      header.classList.remove('border-transparent');
    } else {
      header.classList.remove('glass', 'shadow-lg', 'shadow-surface-950/50');
      header.classList.add('border-transparent');
    }
  }

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  // Initial run in case the page is loaded scrolled down
  handleScrollHeader();


  // ======= Active Navigation Links Highlighting =======
  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 120; // Offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('text-white', 'bg-surface-700/50');
          link.classList.add('text-gray-400');

          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-white', 'bg-surface-700/50');
            link.classList.remove('text-gray-400');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveSection, { passive: true });
  highlightActiveSection();


  // ======= Smooth Anchor Scrolling with Offsets =======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = 80;
        const targetPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = targetPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ======= Intersection Observer for Reveal Animations =======
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after showing to prevent continuous triggering
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: If browser doesn't support IntersectionObserver, make all elements visible immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

})();
