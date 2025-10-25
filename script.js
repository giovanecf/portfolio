document.addEventListener("DOMContentLoaded", () => {
  // --- Efeito de Clique Simples (Simulação de feedback do shadcn/ui) ---
  const buttons = document.querySelectorAll(".js-button-effect");

  buttons.forEach((button) => {
    button.addEventListener("mousedown", () => {
      button.classList.add("clicked");
    });

    button.addEventListener("mouseup", () => {
      setTimeout(() => {
        button.classList.remove("clicked");
      }, 100);
    });

    button.addEventListener("mouseleave", () => {
      button.classList.remove("clicked");
    });
  });

  // --- Comportamento do Formulário (Apenas para demonstração) ---
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    // contactForm.addEventListener("submit", (e) => {
    //   e.preventDefault();
    //   alert("Mensagem enviada com sucesso! (Demonstração em HTML Puro)");
    //   contactForm.reset();
    // });
  }

  // --- Smooth Scroll (Melhoria de usabilidade para navegação interna) ---
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // --- Animação de Digitação da Stack ---
  const dynamicTextElement = document.getElementById("dynamic-stack-text");
  const stacks = [
    "Javascript",
    "Typescript",
    "Node.js",
    "React.js",
    "Rails",
    "PHP",
    "Laravel",
    "Docker",
    "Git",
  ];
  let stackIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 75; // Velocidade de digitação
  let deletingSpeed = 75; // Velocidade de exclusão
  let delayBetweenStacks = 1500; // Tempo antes de começar a digitar a próxima stack

  function typeEffect() {
    const currentStack = stacks[stackIndex];
    let displayText = "";

    if (isDeleting) {
      // Excluindo
      displayText = currentStack.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = deletingSpeed;
    } else {
      // Digitanto
      displayText = currentStack.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75; // Reseta a velocidade de digitação
    }

    dynamicTextElement.textContent = displayText;

    if (!isDeleting && charIndex === currentStack.length) {
      // Terminou de digitar a palavra, começa a deletar após um atraso
      typingSpeed = delayBetweenStacks;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Terminou de deletar a palavra, vai para a próxima stack
      isDeleting = false;
      stackIndex = (stackIndex + 1) % stacks.length; // Cicla pelas stacks
      typingSpeed = 200; // Pequeno atraso antes de digitar a próxima
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Inicia a animação quando a página carrega
  typeEffect();
});

// --- Lógica do Modal de Projeto ---
// --- Lógica do Modal de Projeto com Carrossel ---
const modalOverlay = document.getElementById("project-modal");
const modalClose = document.querySelector(".modal-close");
const clickableImages = document.querySelectorAll(".project-img-placeholder"); // Os containers de imagem clicáveis nos cards

// Elementos do Modal
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalDemoLink = document.getElementById("modal-demo-link");
const modalCodeLink = document.getElementById("modal-code-link");

// Elementos do Carrossel
const modalImagesWrapper = document.getElementById("modal-images-wrapper");
const carouselPrevBtn = document.getElementById("carousel-prev");
const carouselNextBtn = document.getElementById("carousel-next");

let currentImages = []; // Array das URLs das imagens do projeto atual
let currentImageIndex = 0; // Índice da imagem atualmente exibida no carrossel

function loadCarouselImages(imageUrls) {
  modalImagesWrapper.innerHTML = ""; // Limpa imagens anteriores
  currentImages = imageUrls;
  currentImageIndex = 0; // Volta para a primeira imagem ao abrir o modal

  if (currentImages.length > 0) {
    currentImages.forEach((url) => {
      const imgElement = document.createElement("img");
      imgElement.src = url;
      imgElement.alt = "Screenshot do Projeto";
      imgElement.classList.add("carousel-image");
      modalImagesWrapper.appendChild(imgElement);
    });
    updateCarouselPosition();
    updateCarouselControls();
  } else {
    // Caso não haja imagens, mostra um placeholder simples
    const placeholderDiv = document.createElement("div");
    placeholderDiv.textContent = "Nenhuma imagem disponível";
    placeholderDiv.classList.add("carousel-image");
    modalImagesWrapper.appendChild(placeholderDiv);
    updateCarouselControls(); // Esconde as setas
  }
}

function updateCarouselPosition() {
  if (currentImages.length > 0) {
    const offset = -currentImageIndex * 100;
    modalImagesWrapper.style.transform = `translateX(${offset}%)`;
  }
}

function updateCarouselControls() {
  if (currentImages.length <= 1) {
    carouselPrevBtn.classList.add("hidden");
    carouselNextBtn.classList.add("hidden");
  } else {
    carouselPrevBtn.classList.remove("hidden");
    carouselNextBtn.classList.remove("hidden");

    carouselPrevBtn.disabled = currentImageIndex === 0;
    carouselNextBtn.disabled = currentImageIndex === currentImages.length - 1;
  }
}

function showNextImage() {
  if (currentImageIndex < currentImages.length - 1) {
    currentImageIndex++;
    updateCarouselPosition();
    updateCarouselControls();
  }
}

function showPrevImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    updateCarouselPosition();
    updateCarouselControls();
  }
}

function openModal(data) {
  modalTitle.textContent = data.title;
  modalDescription.textContent = data.description;
  modalDemoLink.href = data.demoUrl;
  modalCodeLink.href = data.codeUrl;

  console.log(modalDemoLink.href, data.demoUrl);

  if (data.demoUrl === "#") {
    modalDemoLink.classList.add("btn-disabled");
  } else {
    modalDemoLink.classList.remove("btn-disabled");
  }

  if (data.codeUrl === "#") {
    modalCodeLink.classList.add("btn-disabled");
  } else {
    modalCodeLink.classList.remove("btn-disabled");
  }

  // Carrega as imagens para o carrossel
  const imagesArray = data.images
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url !== "");
  loadCarouselImages(imagesArray);

  modalOverlay.style.display = "flex";
  setTimeout(() => {
    modalOverlay.classList.add("active");
  }, 10);
  document.body.style.overflow = "hidden"; // Evita scroll no corpo
}

function closeModal() {
  modalOverlay.classList.remove("active");
  setTimeout(() => {
    modalOverlay.style.display = "none";
    // Limpa as imagens do carrossel ao fechar para evitar acúmulo
    modalImagesWrapper.innerHTML = "";
  }, 300);
  document.body.style.overflow = "auto";
}

// Event Listeners para abrir o modal
clickableImages.forEach((image) => {
  image.addEventListener("click", () => {
    const data = {
      title: image.getAttribute("data-title"),
      description: image.getAttribute("data-description"),
      images: image.getAttribute("data-images"),
      demoUrl: image.getAttribute("data-demo-url"),
      codeUrl: image.getAttribute("data-code-url"),
    };
    openModal(data);
  });
});

// Event Listeners para o carrossel
carouselPrevBtn.addEventListener("click", showPrevImage);
carouselNextBtn.addEventListener("click", showNextImage);

// Event Listeners para fechar o modal
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.style.display === "flex") {
    closeModal();
  }
  // Navegação do carrossel com setas do teclado
  if (modalOverlay.style.display === "flex") {
    if (e.key === "ArrowRight") {
      showNextImage();
    } else if (e.key === "ArrowLeft") {
      showPrevImage();
    }
  }
});
