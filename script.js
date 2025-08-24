
    // Current year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Filtering logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = [...document.querySelectorAll('.card[data-category]')];
    const searchInput = document.getElementById('search');

    function applyFilters(){
      const active = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
      const q = (searchInput.value || '').toLowerCase().trim();
      cards.forEach(card=>{
        const matchCategory = active === 'all' || card.dataset.category === active;
        const hay = (card.dataset.title + ' ' + card.dataset.tags).toLowerCase();
        const matchQuery = !q || hay.includes(q);
        card.style.display = (matchCategory && matchQuery) ? '' : 'none';
      });
    }

    filterButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        filterButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
      })
    })

    searchInput.addEventListener('input', applyFilters);

    // Lightbox logic
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightboxVideo');

    document.getElementById('closeLightbox').addEventListener('click', ()=>{
      lightboxVideo.pause();
      lightbox.classList.remove('open');
      lightboxVideo.src = '';
    });

    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && lightbox.classList.contains('open')){
        lightboxVideo.pause();
        lightbox.classList.remove('open');
        lightboxVideo.src = '';
      }
    });

    document.getElementById('grid').addEventListener('click', (e)=>{
      const btn = e.target.closest('.play');
      if(!btn) return;
      const src = btn.getAttribute('data-video');
      console.log("Attempting to play video from:", src); // Debugging line
      if(!src) {
        console.error("No video source found for this card.");
        return;
      }
      lightboxVideo.src = src;
      lightbox.classList.add('open');
      
      // Explicitly mute before attempting to play
      lightboxVideo.muted = true; 

      // Attempt to play and catch potential autoplay errors
      lightboxVideo.play().then(() => {
        console.log("Video autoplay started successfully.");
      }).catch(error => {
        console.error("Video autoplay blocked:", error);
        // No alert, just let the user use the controls
      });
    });

    // Accessibility: close when clicking outside the content
    lightbox.addEventListener('click', (e)=>{
      const content = e.target.closest('.lightbox-content');
      if(!content){
        lightboxVideo.pause();
        lightbox.classList.remove('open');
        lightboxVideo.src = '';
      }
    });

    // --- Scroll Reveal Animation Logic ---
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Optional: remove 'visible' class if you want elements to re-animate on scroll back up
                // entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });

    // Initial filter
    applyFilters();

    // Theme switching logic
    function setTheme(themeName) {
        document.body.className = themeName; // Apply the theme class
        localStorage.setItem('theme', themeName); // Save preference
        console.log("Theme set to:", themeName); // Debugging line
    }

    // Load theme preference on startup
    document.addEventListener('DOMContentLoaded', () => {
        const savedTheme = localStorage.getItem('theme') || 'dark-theme'; // Default to dark
        document.body.className = savedTheme;
        document.getElementById('theme-switcher').value = savedTheme;
        console.log("Initial theme loaded:", savedTheme); // Debugging line
    });

    
