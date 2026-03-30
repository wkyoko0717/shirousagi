/**
 * 白兎記念病院 — main.js
 * GSAP 3 + ScrollTrigger を使用
 * CDN読み込み済み前提（index.html head に script タグ）
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────
  //  GSAP Plugin 登録
  // ─────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ─────────────────────────────────────────
  //  LOADER
  // ─────────────────────────────────────────
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const body = document.body;

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      if (loaderBar) loaderBar.style.width = '100%';

      // Hide loader after short pause
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            body.classList.remove('is-loading');
            initHeroAnimations();
          }
        });
      }, 400);
    } else {
      if (loaderBar) loaderBar.style.width = progress + '%';
    }
  }, 80);

  // ─────────────────────────────────────────
  //  HERO — 2フェーズ演出
  //  Phase 1: グラデ背景+テキスト（pin固定）
  //  Phase 2: 写真が下から上がってきてclip-path全開
  // ─────────────────────────────────────────
  function initHeroAnimations() {

    // 文字stagger アニメーション
    const chars = document.querySelectorAll('.hero__char');
    if (chars.length) {
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.2
      });
    }

    // eyebrow, sub, tags, scroll
    document.querySelectorAll('.js-fade-up').forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: delay
      });
    });

    // ─── ScrollTrigger: hero pin + 写真reveal ───
    const heroSoftPhase = document.getElementById('heroSoftPhase');
    const heroPhotoPhase = document.getElementById('heroPhotoPhase');
    const heroBg = document.getElementById('heroBg');

    if (!heroSoftPhase || !heroPhotoPhase) return;

    // const heroTl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: '.hero',
    //     start: 'top top',
    //     end: '+=700',        // スクロール量(px)で調整
    //     pin: true,
    //     pinSpacing: true,
    //     scrub: 1.4,          // 数値大きい = なめらかに追従
    //     anticipatePin: 1,
    //   }
    // })

    // heroTl
    //   // Phase 1: テキストをフェードアウト + わずかに縮小
    //   .to([heroSoftPhase, '.hero__photo-overlay', '.hero__bg'], {
    //     opacity: 0,
    //     // scale: 0.97,
    //     // duration: 0.35,
    //     ease: 'power2.in'
    //   })

    // Phase 2: パララックス開始！
    // フィルターが消え始めた「直後」くらいから動かし始めると自然やで
    // .to('.sec-1', {
    //   y: '15%',        // 下に15%分ゆっくり動かす
    //   ease: 'none',    // スクロールに同期させるなら ease は none が一番綺麗
    //   // duration: 1      // タイムラインの中での「動きの長さ」を調整
    // }, '<');      // フェードアウトが終わる少し前から動かし始める隠し味！
    // Phase 2: 写真が下から上がってくる（clip-path reveal）

    //   .to(heroPhotoPhase, {
    //     clipPath: 'inset(0% 0% 0% 0% round 0px)',
    //     // duration: 0.75,
    //     scrub: true,
    //     ease: 'power2.inOut'
    //   }, '-=0.05')

    // 写真BG: 同時にわずかにズームしながら出現（より印象的に）

    // .from(heroBg, {
    //   scale: 1.08,
    //   duration: 0.75,
    //   ease: 'power2.out'
    // }, '<')

    // const zoomTl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: "#concept",
    //     start: "top bottom", // #conceptが画面の下から入ってきた瞬間スタート
    //     end: "bottom top",    // #conceptが画面の上から消えるまで
    //     scrub: 2.5,          // 数字を大きくすると、もっと「ヌルッ」とした動きになるで
    //   }
    // });

    // // タイムラインの中に書くときは、こっちに scrollTrigger は書かない！
    // zoomTl.to(".sec-1", {
    //   backgroundSize: "150%",
    //   ease: "none"
    // });
  }

  // ─────────────────────────────────────────
  //  HEADER: scroll-aware sticky
  // ─────────────────────────────────────────
  const header = document.getElementById('header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -60px',
      onEnter: () => header.classList.add('is-scrolled'),
      onLeaveBack: () => header.classList.remove('is-scrolled'),
    });
  }

  // ─────────────────────────────────────────
  //  MOBILE MENU
  // ─────────────────────────────────────────
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      body.classList.toggle('menu-open', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        body.classList.remove('menu-open');
      });
    });
  }

  // ─────────────────────────────────────────
  //  FLOATING SVG PARTICLES: GSAP float
  // ─────────────────────────────────────────
  document.querySelectorAll('.hero-particle').forEach((p, i) => {
    gsap.to(p, {
      y: `${-18 - i * 4}px`,
      x: `${(i % 2 === 0 ? 1 : -1) * 8}px`,
      opacity: 0.55,
      duration: 3 + i * 0.35,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.25
    });
  });

  // ─────────────────────────────────────────
  //  PHOTO BAND: parallax bg scroll
  // ─────────────────────────────────────────
  const photoBandBg = document.getElementById('photoBandBg');
  if (photoBandBg) {
    gsap.to(photoBandBg, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.photo-band',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  const photoColumns = document.querySelectorAll('.photo-band2__column');

  if (photoColumns.length > 0) {
    gsap.to(photoColumns, {
      yPercent: -25, // 下から上に少しズレる動き
      ease: 'none',
      scrollTrigger: {
        trigger: '.photo-band2', // この枠が見えたらスタート
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }


  // ─────────────────────────────────────────
  //  SCROLL REVEAL: js-reveal (generic)
  // ─────────────────────────────────────────
  document.querySelectorAll('.js-reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ─────────────────────────────────────────
  //  SCROLL REVEAL: js-fade-up-sc (photo band)
  // ─────────────────────────────────────────
  document.querySelectorAll('.js-fade-up-sc').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ─────────────────────────────────────────
  //  SCROLL REVEAL: js-card-reveal (staggered)
  // ─────────────────────────────────────────
  // Stat cards
  const statCards = gsap.utils.toArray('.concept__stats .js-card-reveal');
  if (statCards.length) {
    gsap.fromTo(statCards,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.concept__stats',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // Dept cards
  const deptCards = gsap.utils.toArray('.depts__grid .js-card-reveal');
  if (deptCards.length) {
    gsap.fromTo(deptCards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.depts__grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ─────────────────────────────────────────
  //  COUNTERS
  // ─────────────────────────────────────────
  document.querySelectorAll('.js-counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: target > 100 ? 2.2 : 1.4,
      ease: 'power2.out',
      onUpdate() {
        el.textContent = Math.round(obj.val).toLocaleString('ja-JP');
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // ─────────────────────────────────────────
  //  CONCEPT ARCH: parallax text col
  // ─────────────────────────────────────────
  const conceptTextCol = document.querySelector('.concept__text-col');
  if (conceptTextCol) {
    gsap.fromTo(conceptTextCol,
      { y: 0 },
      {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.concept',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      }
    );
  }

  // ─────────────────────────────────────────
  //  DEPTS BG WORD: parallax
  // ─────────────────────────────────────────
  const bgWord = document.querySelector('.depts__bg-word');
  if (bgWord) {
    gsap.fromTo(bgWord,
      { x: -80 },
      {
        x: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: '.depts',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );
  }

  // ─────────────────────────────────────────
  //  FLOORPLAN CARD: slide-up reveal
  // ─────────────────────────────────────────
  const fpCard = document.querySelector('.floorplan__card');
  if (fpCard) {
    gsap.fromTo(fpCard,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: fpCard,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ─────────────────────────────────────────
  //  ACCESS COLS: slide in from sides
  // ─────────────────────────────────────────
  const hoursCol = document.querySelector('.access__hours-col');
  const mapCol = document.querySelector('.access__map-col');

  if (hoursCol) {
    gsap.fromTo(hoursCol,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: hoursCol,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  if (mapCol) {
    gsap.fromTo(mapCol,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: mapCol,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ─────────────────────────────────────────
  //  MARQUEE: pause on hover
  // ─────────────────────────────────────────
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
      marqueeTrack.querySelectorAll('.marquee-content').forEach(c => {
        c.style.animationPlayState = 'paused';
      });
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = '';
      marqueeTrack.querySelectorAll('.marquee-content').forEach(c => {
        c.style.animationPlayState = '';
      });
    });
  }

  // ─────────────────────────────────────────
  //  SMOOTH ANCHOR SCROLL
  // ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─────────────────────────────────────────
  //  RABBIT COUNT: fun random drift
  // ─────────────────────────────────────────
  const heroRabbitNum = document.getElementById('heroRabbitNum');
  if (heroRabbitNum) {
    setInterval(() => {
      const base = 847;
      const drift = Math.floor(Math.random() * 7) - 3; // -3 〜 +3
      heroRabbitNum.textContent = (base + drift).toString();
    }, 3200);
  }

  // ─────────────────────────────────────────
  //  DEPT CARD hover: rabbit emoji wiggle
  // ─────────────────────────────────────────
  document.querySelectorAll('.dept-card__inner').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.dept-card__icon');
      if (!icon) return;
      gsap.fromTo(icon,
        { rotate: -8 },
        { rotate: 8, duration: 0.15, ease: 'power1.inOut', yoyo: true, repeat: 3 }
      );
    });
  });

  // ─────────────────────────────────────────
  //  SCROLL PROGRESS BAR (thin top line)
  // ─────────────────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(90deg, #F7B8CC, #E8688A, #C44B6F);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  });

  // ─────────────────────────────────────────
  //  RESIZE: refresh ScrollTrigger
  // ─────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });

})();
