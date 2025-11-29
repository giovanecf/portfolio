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

// Internationalization - I18n
const translations = {
  "pt-BR": {
    navSkills: "Habilidades",
    navProjects: "Projetos",
    navContact: "Contato",
    downloadCV: "Download CV",
    heroTitle: "Criando com",
    heroSubtitle:
      "FULLSTACK DEVELOPER | CONSTRUINDO EXPERIÊNCIAS WEB INCRÍVEIS",
    heroDescription:
      "Apaixonado por criar soluções intuitivas, escaláveis e de alta performance.",
    sectionSkillsTitle: "MINHAS HABILIDADES",
    skillCategoryFrontend: "FRONTEND",
    skillCategoryBackend: "BACKEND",
    skillCategoryDatabase: "BANCO DE DADOS",
    skillCategoryDevOps: "DEVOPS E PLATAFORMAS",
    sectionProjectsTitle: "MEUS PROJETOS",
    sectionProjectsSubtitleProfessional: "PROJETOS PROFISSIONAIS",
    sectionProjectsSubtitleStudy: "CASOS DE ESTUDO E PESQUISA",
    projectBtnView: "VER",
    projectBtnCode: "CÓDIGO",
    projectDescriptionFafarSite:
      "Site Institucional para a Faculdade de Farmácia da UFMG",
    projectDescriptionFafarIntranet:
      "Intranet para a Faculdade de Farmácia da UFMG",
    projectDescriptionEscutaFafar:
      "Sistema Web para registro de sessões de apoio psicológico aos estudantes, permitindo à universidade acompanhar problemas comuns, analisar tendências e melhorar os serviços estudantis com base em dados.",
    projectDescriptionStageManager:
      "Sistema Web para gerenciamento de projeção de mídias e timers para palestras.",
    projectDescriptionCf7Crud:
      "Add-on WordPress para Contact Form 7, que permite a criação e edição de objetos com base no formulário criado pelo CF7.",
    projectDescriptionHermes:
      "Serviço de envio de e-mails em Node.js com Nodemailer.",
    projectDescriptionPrometheusBot:
      "Serviço de raspagem de dados na web, para integração com serviços e automatização de tarefas burocráticas.",
    projectDescriptionDirectMailSender:
      "Sistema Web gerenciador de mala direta, com envio agendado. Utilizado em projeto de pesquisa, publicado, para aquisição de dados.",
    projectDescriptionCamControl:
      "Painel de controle web para câmera IP Sony RZ25NP. O oficial necessita do Internet Explorer 8 ou menor.",
    projectDescriptionTaskTimer:
      "Um cronômetro simples para cronometrar seu tempo de tarefa ao longo da semana, mês e ano.",
    projectDescriptionRedacaoModel:
      "Site para criar modelos de redação para o ENEM.",
    projectDescriptionHomemadeCFTV:
      "Script que tranforma qualquer computador com distribuição Linux em um CFTV - com gravação - utilizando o software Guvcview(WebCam) + uma webcam.",
    sectionContactTitle: "ENTRE EM CONTATO",
    formLabelName: "Nome",
    formLabelEmail: "Email",
    formLabelMessage: "Mensagem",
    formSubmitButton: "Enviar Mensagem",
    contactInfoEmail: "Email:",
    contactInfoLinkedIn: "LinkedIn:",
    contactInfoGitHub: "GitHub:",
    modalTitlePlaceholder: "Título do Projeto",
    modalDescriptionPlaceholder: "Descrição ampliada do projeto.",
    modalButtonDemo: "Ver Demo",
    modalButtonCode: "Código Fonte",
  },
  en: {
    navSkills: "Skills",
    navProjects: "Projects",
    navContact: "Contact",
    downloadCV: "Download CV",
    heroTitle: "Creating with",
    heroSubtitle: "FULLSTACK DEVELOPER | BUILDING AMAZING WEB EXPERIENCES",
    heroDescription:
      "Passionate about creating intuitive, scalable, and high-performance solutions.",
    sectionSkillsTitle: "MY SKILLS",
    skillCategoryFrontend: "FRONTEND",
    skillCategoryBackend: "BACKEND",
    skillCategoryDatabase: "DATABASE",
    skillCategoryDevOps: "DEVOPS AND PLATFORMS",
    sectionProjectsTitle: "MY PROJECTS",
    sectionProjectsSubtitleProfessional: "PROFESSIONAL PROJECTS",
    sectionProjectsSubtitleStudy: "CASE STUDIES AND RESEARCH",
    projectBtnView: "VIEW",
    projectBtnCode: "CODE",
    projectDescriptionFafarSite:
      "Institutional Website for the Faculty of Pharmacy at UFMG",
    projectDescriptionFafarIntranet:
      "Intranet for the Faculty of Pharmacy at UFMG",
    projectDescriptionEscutaFafar:
      "Web System for recording psychological support sessions for students, allowing the university to track common issues, analyze trends, and improve student services based on data.",
    projectDescriptionStageManager:
      "Web System for managing media projection and timers for lectures.",
    projectDescriptionCf7Crud:
      "WordPress Add-on for Contact Form 7, which allows the creation and editing of objects based on the form created by CF7.",
    projectDescriptionHermes:
      "Email sending service in Node.js with Nodemailer.",
    projectDescriptionPrometheusBot:
      "Web data scraping service, for integration with services and automation of bureaucratic tasks.",
    projectDescriptionDirectMailSender:
      "Web System for managing direct mail, with scheduled sending. Used in a published research project for data acquisition.",
    projectDescriptionCamControl:
      "Web control panel for the Sony RZ25NP IP camera. The official one requires Internet Explorer 8 or lower.",
    projectDescriptionTaskTimer:
      "A simple stopwatch to time your task duration over the week, month, and year.",
    projectDescriptionRedacaoModel: "Website to create essay models for ENEM.",
    projectDescriptionHomemadeCFTV:
      "Shell Script that turns any computer with a Linux distribution into a CCTV - **with recording** - using the Guvcview (WebCam) software + a webcam.",
    sectionContactTitle: "GET IN TOUCH",
    formLabelName: "Name",
    formLabelEmail: "Email",
    formLabelMessage: "Message",
    formSubmitButton: "Send Message",
    contactInfoEmail: "Email:",
    contactInfoLinkedIn: "LinkedIn:",
    contactInfoGitHub: "GitHub:",
    modalTitlePlaceholder: "Project Title",
    modalDescriptionPlaceholder: "Expanded project description.",
    modalButtonDemo: "View Demo",
    modalButtonCode: "Source Code",
  },
};

function setLanguage(currentLanguage) {
  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");

    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      el.textContent = translations[currentLanguage][key];
    }
  });

  document.querySelector("html").lang = currentLanguage;
}

document
  .querySelector("#lang-pt")
  .addEventListener("click", () => setLanguage("pt-BR"));
document
  .querySelector("#lang-en")
  .addEventListener("click", () => setLanguage("en"));

setLanguage("en");
