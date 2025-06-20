document.addEventListener("DOMContentLoaded", () => {
    gsap.from(".texto h1", {
      y: -50,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out"
    });
  
    gsap.from(".texto p", {
      x: -40,
      opacity: 0,
      delay: 0.4,
      duration: 1.2,
      ease: "power2.out"
    });
  
    gsap.from(".eslogan", {
      x: 40,
      opacity: 0,
      delay: 0.8,
      duration: 1.2,
      ease: "power2.out"
    });
  
    gsap.from("#entrar-btn", {
      scale: 0.8,
      opacity: 0,
      delay: 1.2,
      duration: 1,
      ease: "back.out(1.7)"
    });
  
    gsap.to(".texto h1", {
      y: -10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  
    gsap.to(".texto p", {
      x: 10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".eslogan", {
      opacity: 0.8,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  
    gsap.to("#entrar-btn", {
      boxShadow: "0 0 15px #ffd700",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
  