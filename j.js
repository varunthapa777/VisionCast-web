document.addEventListener('DOMContentLoaded', () => {

  // ================== Video Feed ==================
  const feed = document.getElementById('feed');
  const videos = JSON.parse(localStorage.getItem('videos') || '[]');

  if (feed) {
    feed.innerHTML = "";
    if (videos.length > 0) {
      videos.forEach(videoObj => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <strong style="color:#e50914; display:block; margin-bottom:10px;">
            ${videoObj.name}
          </strong>
          <video src="${videoObj.video}" controls width="100%"></video>
        `;
        feed.appendChild(card);
      });
    }
  }

  // ================== Profile Upload ==================
  const profileBadge  = document.getElementById('profileBadge');
  const profileUpload = document.getElementById('profileUpload');
  const chooseBtn     = document.getElementById('chooseBtn');
  const removeBtn     = document.getElementById('removeBtn');
  const initials      = profileBadge ? profileBadge.textContent : 'UD';

  function resetProfile() {
    if (!profileBadge) return;
    profileBadge.style.backgroundImage = 'none';
    profileBadge.textContent = initials;
    profileBadge.style.color = 'var(--text-dark)';
  }

  if (profileBadge) {
    const saved = localStorage.getItem('profileImage');
    if (saved) {
      profileBadge.style.backgroundImage = `url('${saved}')`;
      profileBadge.textContent = '';
      profileBadge.style.color = 'transparent';
    } else resetProfile();
  }

  function resizeImage(file, maxDim = 150) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > width && height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          } else if (width > maxDim) {
            width = maxDim;
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  if (profileUpload) {
    profileUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      try {
        const dataUrl = await resizeImage(file, 150);
        profileBadge.style.backgroundImage = `url('${dataUrl}')`;
        profileBadge.textContent = '';
        profileBadge.style.color = 'transparent';
        localStorage.setItem('profileImage', dataUrl);
      } catch (err) {
        console.error('Image processing failed', err);
      }
    });
  }

  if (chooseBtn) chooseBtn.addEventListener('click', () => profileUpload && profileUpload.click());
  if (removeBtn) removeBtn.addEventListener('click', () => {
    resetProfile();
    if (profileUpload) profileUpload.value = '';
    localStorage.removeItem('profileImage');
  });

  // ================== Hamburger Menu ==================
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const links = document.getElementById('primary-navigation');

  if (hamburger && nav && links) {
    function openMenu() {
      nav.classList.add('expanded');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      nav.classList.remove('expanded');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.contains('expanded') ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('expanded') && !nav.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('expanded')) closeMenu();
    });

    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });
  }

});
const loginBtn = document.getElementById('loginBtn');

// Redirect to login.html when clicked
loginBtn.addEventListener('click', () => {
  window.location.href = 'login.html';
});






