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

    });
  