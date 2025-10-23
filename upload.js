document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const displayNameInput = document.getElementById('displayName');
  const uploadStatus = document.getElementById('uploadStatus');
  const clearBtn = document.getElementById('clearLocal');

  let adminKey = null; // store admin key once per session

  function showStatus(message, type = 'success') {
    const color = type === 'success' ? 'green' : 'red';
    uploadStatus.innerHTML = `<span style="color:${color}; font-weight:bold;">${message}</span>`;
    setTimeout(() => (uploadStatus.textContent = ""), 4000);
  }

  // ===== Upload video =====
  fileInput?.addEventListener('change', async () => {
    if (!adminKey) {
      adminKey = prompt("Enter Admin Key");
      if (!adminKey) return showStatus('Admin key required', 'error');
    }

    const files = Array.from(fileInput.files);
    if (!files.length) return showStatus('No video selected.', 'error');

    const displayName = displayNameInput.value || 'Admin';

    for (const file of files) {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('displayName', displayName);
      formData.append('adminKey', adminKey);

      try {
        const res = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) showStatus(`✅ Uploaded ${file.name}!`);
        else showStatus(`❌ Upload failed: ${data.error}`, 'error');
      } catch (err) {
        showStatus(`❌ Upload failed: ${err}`, 'error');
      }
    }

    fileInput.value = null;
  });

  // ===== Clear local storage =====
  clearBtn?.addEventListener('click', () => {
    localStorage.removeItem('videos');
    showStatus("🗑️ All local videos cleared!", "error");
  });

  // ===== Delete video from feed (example) =====
  window.deleteVideo = async (fileId, card) => {
    if (!adminKey) {
      adminKey = prompt("Enter Admin Key");
      if (!adminKey) return alert("Admin key required");
    }

    const confirmDelete = confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/delete/${fileId}?adminKey=${adminKey}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) card.remove();
      else alert(`Failed: ${data.error}`);
    } catch (err) {
      alert(`Failed: ${err}`);
    }
  };
});

  // ================= Optional: Drag & Drop =================
  const dropzone = document.getElementById('dropzone');
  if (dropzone) {
    dropzone.addEventListener('dragover', e => e.preventDefault());
    dropzone.addEventListener('drop', e => {
      e.preventDefault();
      fileInput.files = e.dataTransfer.files; // set dropped files
      fileInput.dispatchEvent(new Event('change')); // trigger upload
    });
  }



  // ====== Hamburger Menu ======
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navbar && navLinks) {
    const openMenu = () => {
      navbar.classList.add('expanded');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
    };
    const closeMenu = () => {
      navbar.classList.remove('expanded');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.contains('expanded') ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (e) => {
      if (!navbar.classList.contains('expanded')) return;
      if (!navbar.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbar.classList.contains('expanded')) closeMenu();
    });

    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });
  }









