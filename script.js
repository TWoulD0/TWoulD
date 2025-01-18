  const themeBtn = document.querySelector(".theme_btn");
  const indicatorBar = document.querySelector(".scroll-indicator-bar");

  const navBar = document.querySelector(".nav-bar");
  const navItemsA = document.querySelectorAll(".nav-items a");
  const navigation = document.querySelector(".navigation");

  const sections = document.querySelectorAll(".section");

  const contactForm = document.querySelector(".contact-form");
  let ct_name = document.getElementById("name");
  let ct_email = document.getElementById("email");
  let ct_subject = document.getElementById("subject");
  let ct_message = document.getElementById("message");


  
  const loading = document.querySelector('.loading');
  const screen = document.querySelector('.screen');
  let dots = 0;
  let progress = 0;
  
  // Audio elements
  const fadeInSound = new Audio('Sounds/tv-shut-down.mp3');
  
// Press to Start element
const pressToStart = document.querySelector(".press_container");
loading.style.display = 'none';
pressToStart.addEventListener("click", function() {
  // Start the loading process only after clicking the "Press to Start" button
  fadeInSound.volume = 0.1;

  loading.style.display = 'block';
  // Hide the press-to-start button
  pressToStart.style.opacity = '0';
  pressToStart.style.pointerEvents = 'none';
  window.scrollTo(0, 0);

  // Start the progress update
  setTimeout(updateProgress, 1000);
});

function updateDots() {
  const totalDots = window.innerWidth <= 768 ? 10 : 18;
  dots = (dots + 1) % (totalDots + 1);
  const dotString = '.'.repeat(dots) + ' '.repeat(totalDots - dots);
  loading.textContent = `Loading ${dotString} ${Math.floor(progress)}%`;
}

function updateProgress() {
  if (progress < 100) {
    progress += Math.random() * 20;
    if (progress > 100) progress = 100;

    if (progress === 100) {

      startTransition();
    } else {
      setTimeout(updateProgress, Math.random() * 300 + 100);
      document.body.style.overflowY = 'hidden';
    }
  }
}

function startTransition() {
  setTimeout(() => { 
    // Stage 1: CRT power off effect
    screen.classList.add('crt-off');
    fadeInSound.play(); // Play fade-in sound
    document.body.style.overflowY = 'auto'; // Enable scroll

    setTimeout(() => {
      clearInterval(dotsInterval);
      loading.style.display = 'none';
      
      setTimeout(() => {
        revealContent();
      }, 300);
    }, 500);
  }, 1000);
}

const dotsInterval = setInterval(updateDots, 100);




document.addEventListener('DOMContentLoaded', function() {
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const tooltip = document.getElementById('tooltip');
  const email = 'webtwould@gmail.com'; // Replace with your actual email

  copyEmailBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      try {
          await navigator.clipboard.writeText(email);
          
          // Show tooltip near the button
          const rect = copyEmailBtn.getBoundingClientRect();
          tooltip.style.top = `${rect.top - 40}px`;
          tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
          tooltip.classList.add('show');        
          
          // Reset after 2 seconds
          setTimeout(() => {
              tooltip.classList.remove('show');
          }, 2000);
          
      } catch (err) {
          console.error('Failed to copy email:', err);
          // Fallback for browsers that don't support clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = email;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
      }
  });
});

// navigation
  function updateActiveNavLinks() {
    const scrollY = window.pageYOffset;
  
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      const id = current.getAttribute("id");

      const navLink = document.querySelector(`.nav-items a[href="#${id}"]`);
  
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add("active");
        } else {
          navLink.classList.remove("active");
        }
      }
    });
  }
  
  navItemsA.forEach(item => {
    item.addEventListener('click', scrollToSection);
  });
  
  function scrollToSection(event) {
    event.preventDefault();
  
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
  
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

 
  // Toolbox
  document.addEventListener("DOMContentLoaded", () => {
    const toolboxContent = document.querySelector(".toolbox_content");
    const toolCards = Array.from(document.querySelectorAll(".tool-card"));
    let animationFrameId;
    let isPaused = false;
    
    // Calculate card width and gap based on viewport
    const getCardMetrics = () => {
      const cardStyle = window.getComputedStyle(toolCards[0]);
      const cardWidth = parseFloat(cardStyle.width);
      // Get gap from CSS clamp value in toolbox_content
      const containerStyle = window.getComputedStyle(toolboxContent);
      const gap = parseFloat(containerStyle.gap) || clamp(8, 32, 50); // Default to clamp(1rem, 2vw, 2rem) in pixels
      return { cardWidth, gap };
    };
  
    // Initialize cards
    const initializeCards = () => {
      toolboxContent.innerHTML = '';
      toolCards.forEach(card => toolboxContent.appendChild(card));
      
      const { cardWidth, gap } = getCardMetrics();
      toolCards.forEach((card, index) => {
        card.style.position = "absolute";
        card.style.left = `${index * (cardWidth + gap)}px`;
      });
    };
  
    // Handle card movement and visibility
    const moveCards = () => {
      if (!isPaused) {
        const containerWidth = toolboxContent.offsetWidth;
        const { cardWidth, gap } = getCardMetrics();
        const totalCardWidth = cardWidth + gap;
        const scrollSpeed = Math.max(1, containerWidth * 0.001); // Responsive speed
  
        toolCards.forEach(card => {
          const currentLeft = parseFloat(card.style.left);
          const newLeft = currentLeft - scrollSpeed;
  
          // Reposition card
          if (newLeft < -totalCardWidth) {
            const maxLeft = Math.max(...toolCards.map(c => parseFloat(c.style.left)));
            card.style.left = `${maxLeft + totalCardWidth}px`;
          } else {
            card.style.left = `${newLeft}px`;
          }
        });
      }
      animationFrameId = requestAnimationFrame(moveCards);
    };
  
    // Helper function for clamp calculation
    function clamp(min, val, max) {
      return Math.min(Math.max(min, val), max);
    }
  
    // Handle hover effects
    toolCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate relative position as percentage
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        card.style.setProperty('--x', `${xPercent}%`);
        card.style.setProperty('--y', `${yPercent}%`);
        card.style.setProperty('--opacity', '0.15');
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--opacity', '0');
      });
    });
  
    // Handle container hover
    toolboxContent.addEventListener("mouseenter", () => isPaused = true);
    toolboxContent.addEventListener("mouseleave", () => isPaused = false);
  
    // Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initializeCards();
      }, 250);
    });
  
    // Start animation
    initializeCards();
    moveCards();
  });



let text = document.querySelector(".text");
let clouds_1 = document.getElementById('clouds_1');
let rocks = document.getElementById('rocks');
let clouds_2 = document.getElementById('clouds_2');
let ground_1 = document.getElementById('ground_1');
let ground_2 = document.getElementById('ground_2');
let ground_3 = document.getElementById('ground_3');

  function ScrollParallax(){
    let value = window.scrollY;

    text.style.marginTop = value * 1 + 'px';
    clouds_1.style.marginTop = value * 0.75 + 'px';
    rocks.style.marginTop = value * 0.6 + 'px';
    clouds_2.style.marginTop = value * 0.45 + 'px';
    ground_1.style.marginTop = value * 0.3 + 'px';
    ground_2.style.marginTop = value * 0.15 + 'px';
    ground_3.style.marginTop = value * 0 + 'px';
  }

  window.addEventListener("scroll", () => {
    updateActiveNavLinks();
    indicatorBarFunct();
    ScrollParallax();
  });

  window.addEventListener("load", () => {

    navBar.style.transform = "translateY(0)";
    updateActiveNavLinks();
  });

  function indicatorBarFunct() {
    const pageScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollValue = (pageScroll / height) * 100;

    indicatorBar.style.width = scrollValue + "%";
  }

  navigation.addEventListener("click", () => {
    navigation.classList.remove("active");
  });

  navItemsA.forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("active");
    });
  });


  ScrollReveal({
    reset: true,
    distance: '60px',
    duration: 2500,
    delay: 50
  });
  
  ScrollReveal().reveal('.section-title', {delay: 100, origin: 'top'});
  ScrollReveal().reveal('.about .folder_identity', {origin: 'bottom'});
  ScrollReveal().reveal('.about .folder_about', {distance: '100px',delay: 100,origin: 'left'});
  ScrollReveal().reveal('.about .folder_skills', {delay: 250,origin: 'right'});
  ScrollReveal().reveal('.contact-form input, .contact-form textarea, .contact-form .btn', {distance: '150px', delay: 50, origin: 'bottom', interval: 300});
  ScrollReveal().reveal('.contact-list li', {delay: 100, origin: 'left', interval: 200});
  ScrollReveal().reveal('.logo h2', {distance: '100px',delay: 200, origin: 'left'});
  ScrollReveal().reveal('.footer-copyright p', {distance: '20px', delay: 100, origin: 'bottom'});
  ScrollReveal().reveal('.follow li', {delay: 300, origin: 'top', interval: 300});
