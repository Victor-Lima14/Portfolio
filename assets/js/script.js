/**
 * ==========================================================================
 * Arquivo: /assets/js/script.js
 * Objetivo: Comportamentos interativos (navegação, rolagem, animações, menu).
 * ==========================================================================
 */

(function () {
  'use strict';

  // ======= Elementos do DOM =======
  const loadingScreen = document.getElementById('loading-screen');
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const revealElements = document.querySelectorAll('.reveal');

  // ======= Ocultamento gradual da tela de carregamento (1 segundo) =======
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1000);
  }

  // ======= Menu de navegação mobile =======
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

  // Fecha o menu mobile ao clicar em um link de navegação
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha o menu mobile ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !header.contains(e.target)) {
      closeMenu();
    }
  });


  // ======= Transição do cabeçalho fixo =======
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
  // Execução inicial caso a página seja carregada com rolagem
  handleScrollHeader();


  // ======= Destaque dos links de navegação ativos =======
  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 120; // Deslocamento para a altura do cabeçalho

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


  // ======= Rolagem suave para âncoras com deslocamento =======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || !targetId.startsWith('#') || targetId === '#') return;

      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = 80;
          const targetPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = targetPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } catch (err) {
        // Ignora erros de sintaxe de seletor CSS inválido
      }
    });
  });


  // ======= Intersection Observer para animações de revelação =======
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Interrompe a observação após a exibição para evitar disparos contínuos
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Dispara um pouco antes do elemento ficar totalmente visível
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Alternativa: Se o navegador não suportar IntersectionObserver, torna todos os elementos visíveis imediatamente
    revealElements.forEach(el => el.classList.add('visible'));
  }


  // ======= Mecanismo de carregar mais projetos =======
  const loadMoreBtn = document.getElementById('load-more-btn');
  const loadMoreContainer = document.getElementById('load-more-container');

  if (loadMoreBtn && loadMoreContainer) {
    const getHiddenProjects = () => document.querySelectorAll('.project-card.hidden');

    if (getHiddenProjects().length === 0) {
      loadMoreContainer.classList.add('hidden');
    }

    loadMoreBtn.addEventListener('click', function () {
      const hiddenCards = getHiddenProjects();
      Array.from(hiddenCards).slice(0, 3).forEach(card => {
        card.classList.remove('hidden');
        card.classList.add('visible');
      });

      if (getHiddenProjects().length === 0) {
        loadMoreContainer.classList.add('hidden');
      }
    });
  }


  // ======= Interatividade do modal de projetos =======
  const projectModal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalLink = document.getElementById('modal-link');
  const modalGithub = document.getElementById('modal-github');
  const modalDemo = document.getElementById('modal-demo');
  const modalImgContainer = document.getElementById('modal-img-container');
  const modalImg = document.getElementById('modal-img');
  const modalPlaceholderIcon = document.getElementById('modal-placeholder-icon');

  function openProjectModal(card) {
    if (!projectModal) return;
    const title = card.getAttribute('data-title') || '';
    const description = card.getAttribute('data-description') || '';
    const link = card.getAttribute('data-link');
    const github = card.getAttribute('data-github');
    const demo = card.getAttribute('data-demo');
    const img = card.getAttribute('data-img');
    const gradient = card.getAttribute('data-gradient') || 'from-accent/20 to-cyan-600/10';

    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) modalDescription.textContent = description;

    if (modalImgContainer) {
      modalImgContainer.className = `relative h-44 sm:h-48 rounded-2xl overflow-hidden mb-6 bg-surface-900 bg-gradient-to-br ${gradient} flex items-center justify-center`;
    }

    if (img && modalImg) {
      modalImg.src = img;
      modalImg.alt = title;
      modalImg.classList.remove('hidden');
      if (modalPlaceholderIcon) modalPlaceholderIcon.classList.add('hidden');
    } else {
      if (modalImg) modalImg.classList.add('hidden');
      if (modalPlaceholderIcon) modalPlaceholderIcon.classList.remove('hidden');
    }

    // Configuração dos botões de ação
    if (github || demo) {
      if (modalLink) modalLink.classList.add('hidden');

      if (modalGithub) {
        if (github) {
          modalGithub.href = github;
          modalGithub.setAttribute('href', github);
          modalGithub.setAttribute('target', '_blank');
          modalGithub.setAttribute('rel', 'noopener noreferrer');
          modalGithub.classList.remove('hidden');
          modalGithub.onclick = function (e) {
            e.stopPropagation();
          };
        } else {
          modalGithub.classList.add('hidden');
          modalGithub.removeAttribute('href');
        }
      }

      if (modalDemo) {
        if (demo) {
          modalDemo.href = demo;
          modalDemo.setAttribute('href', demo);
          modalDemo.setAttribute('target', '_blank');
          modalDemo.setAttribute('rel', 'noopener noreferrer');
          modalDemo.classList.remove('hidden');
          modalDemo.onclick = function (e) {
            e.stopPropagation();
          };
        } else {
          modalDemo.classList.add('hidden');
          modalDemo.removeAttribute('href');
        }
      }
    } else {
      if (modalGithub) modalGithub.classList.add('hidden');
      if (modalDemo) modalDemo.classList.add('hidden');
      if (modalLink) {
        if (link) {
          modalLink.href = link;
          modalLink.setAttribute('href', link);
          modalLink.setAttribute('target', '_blank');
          modalLink.setAttribute('rel', 'noopener noreferrer');
          modalLink.classList.remove('hidden');
          modalLink.onclick = function (e) {
            e.stopPropagation();
          };
        } else {
          modalLink.classList.add('hidden');
        }
      }
    }

    projectModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  // Delegação de eventos para cartões de projeto (funciona para cartões iniciais e carregados dinamicamente)
  document.addEventListener('click', function (e) {
    const card = e.target.closest('.project-card');
    if (card && !e.target.closest('a') && !e.target.closest('button')) {
      openProjectModal(card);
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', function (e) {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !projectModal.classList.contains('hidden')) {
        closeProjectModal();
      }
    });
  }

})();


