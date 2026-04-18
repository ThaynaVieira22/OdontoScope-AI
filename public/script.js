function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function setMode(mode) {
  localStorage.setItem("odonto_mode", mode);
}

function getMode() {
  return localStorage.getItem("odonto_mode") || "teste";
}

function applyModeUI() {
  const mode = getMode();
  const modeLabel = qs("[data-mode-label]");
  if (modeLabel) modeLabel.textContent = mode === "profissional" ? "Modo profissional" : "Modo teste";

  qsa("[data-requires-professional]").forEach(el => {
    el.disabled = mode !== "profissional";
    el.title = mode !== "profissional" ? "Disponível no modo profissional" : "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // FAQ acessível
  qsa(".faq-q").forEach(btn => {
    const item = btn.closest(".faq-item");
    const answer = item?.querySelector(".faq-a");
    if (answer && !answer.id) answer.id = "faq-" + Math.random().toString(36).slice(2, 9);
    if (answer) btn.setAttribute("aria-controls", answer.id);
    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  // Tabs login / cadastro
  qsa("[data-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      qsa("[data-tab]").forEach(b => b.classList.remove("active"));
      qsa("[data-panel]").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const panel = qs(`[data-panel="${target}"]`);
      if (panel) panel.classList.add("active");
    });
  });

  // Upload + preview de imagem
  const uploadArea = qs("[data-upload]");
  const uploadInput = qs("[data-upload-input]");
  const uploadText = qs("[data-upload-text]");
  const previewImg = qs("#preview-exame");
  const previewPlaceholder = qs("#preview-placeholder");

  if (uploadArea && uploadInput) {
    uploadArea.addEventListener("click", () => uploadInput.click());

    uploadArea.addEventListener("dragover", e => {
      e.preventDefault();
      uploadArea.classList.add("dragover");
    });

    uploadArea.addEventListener("dragleave", () => uploadArea.classList.remove("dragover"));

    uploadArea.addEventListener("drop", e => {
      e.preventDefault();
      uploadArea.classList.remove("dragover");
      if (e.dataTransfer.files.length) {
        uploadInput.files = e.dataTransfer.files;
        showFileInfo();
        showPreview();
      }
    });

    uploadInput.addEventListener("change", () => {
      showFileInfo();
      showPreview();
    });

    function showFileInfo() {
      const file = uploadInput.files[0];
      if (!file) return;
      const max = 5 * 1024 * 1024;
      if (file.size > max) {
        if (uploadText) {
          uploadText.textContent = "Arquivo acima de 5MB. Selecione uma imagem menor.";
          uploadText.style.color = "#c43d3d";
        }
        uploadInput.value = "";
        if (previewImg && previewPlaceholder) {
          previewImg.style.display = "none";
          previewPlaceholder.style.display = "inline";
          previewPlaceholder.textContent = "Nenhuma imagem válida selecionada.";
        }
        return;
      }
      if (uploadText) {
        uploadText.textContent = `Selecionado: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        uploadText.style.color = "";
      }
    }

    function showPreview() {
      const file = uploadInput.files[0];
      if (!file || !previewImg || !previewPlaceholder) return;

      const reader = new FileReader();
      reader.onload = e => {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        previewPlaceholder.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  }

  // Botão Processar com IA
  const processBtn = qs("[data-process]");
  if (processBtn) {
    processBtn.addEventListener("click", () => {
      const resultTitle = qs("[data-result-title]");
      const resultProb = qs("[data-result-prob]");
      const resultTags = qs("[data-result-tags]");
      const resultExplain = qs("[data-result-explain]");
      const status = qs("[data-status]");
      const statusAnalise = qs("#status-analise");

      const idade = qs("#idade")?.value.trim();
      const sexo = qs("#sexo")?.value.trim();
      const local = qs("#localizacao")?.value.trim();
      const sintoma = qs("#sintomas")?.value.trim();

      if (!uploadInput || !uploadInput.files.length || !idade || !sexo || !local) {
        if (status) {
          status.className = "notice error";
          status.textContent = "Preencha o upload e os dados clínicos obrigatórios antes de processar.";
        }
        if (statusAnalise) {
          statusAnalise.textContent = "";
        }
        return;
      }

      if (status) {
        status.className = "notice";
        status.textContent = "Processando exame com IA...";
      }
      if (statusAnalise) {
        statusAnalise.textContent = "Em processo de análise...";
      }

      setTimeout(() => {
        const prob = (82 + Math.random() * 11).toFixed(1);

        if (resultTitle) resultTitle.textContent = "Provável cisto odontogênico inflamatório";
        if (resultProb) resultProb.textContent = `${prob}%`;
        if (resultTags) {
          resultTags.innerHTML = "";
          [idade + " anos", sexo, local, sintoma || "Sem sintoma informado"].forEach(t => {
            const el = document.createElement("span");
            el.className = "pill";
            el.textContent = t;
            resultTags.appendChild(el);
          });
        }
        if (resultExplain) {
          resultExplain.textContent =
            "A sugestão considera padrão radiográfico, localização, faixa etária e sintomas relatados. Em uma versão real, esta área pode exibir mapa de calor e fatores de relevância da IA.";
        }
        if (status) {
          status.className = "notice success";
          status.textContent = "Análise concluída. Interprete o resultado em conjunto com a avaliação clínica.";
        }
        if (statusAnalise) {
          statusAnalise.textContent = "Análise concluída.";
        }
      }, 1200);
    });
  }

  // Navegação básica
  qsa("[data-open-login]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  });

  qsa("[data-open-home]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  });

  qsa("[data-open-diagnostico]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = "diagnostico.html";
    });
  });

  // Login
  const loginBtn = qs("[data-login]");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const email = qs("#loginEmail")?.value.trim();
      const senha = qs("#loginSenha")?.value.trim();
      const msg = qs("[data-login-msg]");

      if (!email || !senha) {
        if (msg) {
          msg.className = "notice error";
          msg.textContent = "Informe e-mail e senha.";
        }
        return;
      }

      setMode("profissional");
      if (msg) {
        msg.className = "notice success";
        msg.textContent = "Login realizado com sucesso.";
      }
      setTimeout(() => (window.location.href = "index.html"), 700);
    });
  }

  // Cadastro
  const cadastroBtn = qs("[data-cadastro]");
  if (cadastroBtn) {
    cadastroBtn.addEventListener("click", () => {
      const nome = qs("#cadNome")?.value.trim();
      const prof = qs("#cadProfissao")?.value.trim();
      const email = qs("#cadEmail")?.value.trim();
      const inst = qs("#cadInstituicao")?.value.trim();
      const senha = qs("#cadSenha")?.value;
      const confirma = qs("#cadConfirmaSenha")?.value;
      const check = qs("#cadConcordo")?.checked;
      const msg = qs("[data-cadastro-msg]");

      if (!nome || !prof || !email || !inst || !senha || !confirma || !check) {
        if (msg) {
          msg.className = "notice error";
          msg.textContent = "Preencha todos os campos e aceite os termos.";
        }
        return;
      }
      if (senha.length < 6) {
        if (msg) {
          msg.className = "notice error";
          msg.textContent = "A senha deve ter ao menos 6 caracteres.";
        }
        return;
      }
      if (senha !== confirma) {
        if (msg) {
          msg.className = "notice error";
          msg.textContent = "Senha e confirmação não coincidem.";
        }
        return;
      }

      setMode("profissional");
      if (msg) {
        msg.className = "notice success";
        msg.textContent = "Cadastro concluído. Você pode acessar o sistema profissional.";
      }
      setTimeout(() => (window.location.href = "index.html"), 900);
    });
  }

  applyModeUI();
});