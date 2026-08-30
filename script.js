const heartPhotos = Array.from({ length: 21 }, (_, i) => `anh${i + 1}.jpeg`);

function switchScreen(fromId, toId) {
  const fromScreen = document.getElementById(fromId);
  const toScreen = document.getElementById(toId);
  if (fromScreen) fromScreen.classList.remove('active');
  setTimeout(() => {
    if (toScreen) toScreen.classList.add('active');
    // Màn hình tâm thư cần cuộn từ trên xuống dưới
    if(toId === 'long-letter-screen') {
        toScreen.scrollTop = 0;
    }
  }, 300);
}

// Bắt đầu
function startExperience() {
  const music = document.getElementById('bg-music');
  if (music) {
    music.currentTime = 0;
    music.play().catch(e => console.warn("Trình duyệt chặn phát âm thanh:", e));
  }
  switchScreen('start-screen', 'matrix-screen');
  startMatrixCountdown();
}

// Đếm ngược Matrix
function startMatrixCountdown() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = "01010101HAPPYBIRTHDAYBON♥18";
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  let currentText = "3";
  const sequence = [ "3", "2", "1", "HAPPY", "BIRTHDAY", "BON", "TUỔI 18", "LẦN THỨ 5", "❤️" ];
  let seqIndex = 0;

  const seqTimer = setInterval(() => {
    seqIndex++;
    if (seqIndex < sequence.length) {
      currentText = sequence[seqIndex];
    } else {
      clearInterval(seqTimer);
      clearInterval(renderTimer);
      switchScreen('matrix-screen', 'letter-screen');
    }
  }, 1000);

  function draw() {
    ctx.fillStyle = "rgba(5, 5, 10, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff69b4";
    ctx.font = fontSize + "px monospace";
    
    for (let i = 0; i < drops.length; i++) {
      const char = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    ctx.save();
    ctx.fillStyle = "#ff1493";
    ctx.shadowColor = "#ff69b4";
    ctx.shadowBlur = 20;
    ctx.font = "bold 55px 'Quicksand', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(currentText, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }
  const renderTimer = setInterval(draw, 33);
}

// Album 3D
let swiperInstance = null;
function goToAlbum() {
  switchScreen('letter-screen', 'album-screen');
  if (!swiperInstance) {
    swiperInstance = new Swiper('.swiper', {
      effect: 'cards',
      grabCursor: true,
      cardsEffect: { slideShadows: true, rotate: true, perSlideRotate: 4, perSlideOffset: 8 }
    });
  }
}

// Màn Trái Tim & Kích hoạt đếm ngược 8 giây (để test thử)
function goToHeart() {
  switchScreen('album-screen', 'heart-screen');
  const stage = document.getElementById('heart-stage');
  stage.innerHTML = '';

  const total = 21;
  const isMobile = window.innerWidth < 600;
  const scaleR = isMobile ? 18 : 42; 

  for (let i = 0; i < total; i++) {
    const img = document.createElement('img');
    img.className = 'heart-img';
    img.src = heartPhotos[i];

    const t = (Math.PI * 2 * i) / total;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const posX = `${x * scaleR}px`;
    const posY = `${y * scaleR}px`;

    img.style.setProperty('--tx', posX);
    img.style.setProperty('--ty', posY);

    img.onclick = function(e) {
      e.stopPropagation();
      openModal(this.src); 
    };

    stage.appendChild(img);

    setTimeout(() => {
      img.style.opacity = '1';
      img.style.transform = `translate(calc(-50% + ${posX}), calc(-50% + ${posY})) scale(1)`;
    }, 150 + i * 65);
  }

  // ============== ĐẾM NGƯỢC HIỂN THỊ THÔNG BÁO MẬT THƯ ==============
  // Đang để 8 giây (8000ms) để test, nếu chạy tốt bạn đổi lại thành 30000ms
  setTimeout(() => {
    const toast = document.getElementById('new-email-toast');
    if (toast) {
      toast.classList.add('show');
      console.log("Đã hiện nút thông báo!");
    }
  }, 8000); 
}

// Modal Ảnh
function openModal(imageSrc) {
  const modal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  if (modal && modalImg) {
    modalImg.src = imageSrc;
    modal.classList.add('open');
  }
}

function closeModal() {
  const modal = document.getElementById('photo-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

/* ================= CHUỖI SỰ KIỆN MỞ MẬT THƯ (EMAIL) ================= */
function openEmailIntro() {
  // Ẩn thông báo toast
  document.getElementById('new-email-toast').classList.remove('show');
  switchScreen('heart-screen', 'email-intro-screen');
}

function openEmailDetail() {
  switchScreen('email-intro-screen', 'email-detail-screen');
}

function openLongLetter() {
  switchScreen('email-detail-screen', 'long-letter-screen');
}
