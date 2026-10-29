// =====================================
// QUADRÁTICA — FUNCIONALIDADES
// =====================================

// MENU RESPONSIVO
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const aberto = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );
    menuToggle.textContent = aberto ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      menuToggle.textContent = "☰";
    });
  });
}

// =====================================
// CALCULADORA DE BHASKARA
// =====================================

const equationForm = document.querySelector("#equation-form");

if (equationForm) {
  const resultBox = document.querySelector("#calculator-result");

  const formatarNumero = (numero) => {
    if (Math.abs(numero) < 1e-10) {
      numero = 0;
    }

    return Number(numero.toPrecision(10)).toLocaleString("pt-BR", {
      maximumFractionDigits: 8
    });
  };

  equationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const a = Number(document.querySelector("#coef-a").value);
    const b = Number(document.querySelector("#coef-b").value);
    const c = Number(document.querySelector("#coef-c").value);

    if (
      !Number.isFinite(a) ||
      !Number.isFinite(b) ||
      !Number.isFinite(c)
    ) {
      resultBox.innerHTML = `
        <span class="mini-label">ATENÇÃO</span>
        <p>Digite valores numéricos válidos.</p>
      `;
      return;
    }

    if (a === 0) {
      resultBox.innerHTML = `
        <span class="mini-label">ATENÇÃO</span>
        <p>O coeficiente a precisa ser diferente de zero.</p>
        <p>Se a = 0, a equação deixa de ser do segundo grau.</p>
      `;
      return;
    }

    const delta = b * b - 4 * a * c;

    let resultado = `
      <span class="mini-label">RESULTADO DO CÁLCULO</span>
      <p>Δ = b² − 4ac</p>
      <p>Δ = (${formatarNumero(b)})² − 4 ·
      ${formatarNumero(a)} · ${formatarNumero(c)}</p>
      <p><strong>Delta = ${formatarNumero(delta)}</strong></p>
    `;

    if (delta > 0) {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);

      resultado += `
        <p>Como Δ é positivo, existem duas raízes reais distintas.</p>
        <p><strong>x₁ = ${formatarNumero(x1)}</strong></p>
        <p><strong>x₂ = ${formatarNumero(x2)}</strong></p>
      `;
    } else if (delta === 0) {
      const x = -b / (2 * a);

      resultado += `
        <p>Como Δ é zero, existe uma raiz real dupla.</p>
        <p><strong>x = ${formatarNumero(x)}</strong></p>
      `;
    } else {
      resultado += `
        <p>Como Δ é negativo, a equação não possui raízes reais.</p>
      `;
    }

    resultBox.innerHTML = resultado;
  });
}

// =====================================
// QUIZ INTERATIVO
// =====================================

const quizContent = document.querySelector("#quiz-content");

if (quizContent) {
  const perguntas = [
    {
      pergunta: "Qual é a forma geral de uma equação do segundo grau?",
      opcoes: [
        "ax + b = 0",
        "ax² + bx + c = 0, com a diferente de zero",
        "ax³ + bx² + c = 0",
        "a + b + c = 0"
      ],
      correta: 1,
      explicacao: "A forma geral contém o termo quadrático ax², o termo linear bx e o termo independente c."
    },
    {
      pergunta: "Na equação 3x² + 4x − 7 = 0, qual é o valor de a?",
      opcoes: ["−7", "4", "3", "0"],
      correta: 2,
      explicacao: "O coeficiente a acompanha x². Portanto, a = 3."
    },
    {
      pergunta: "Qual é a fórmula do discriminante delta?",
      opcoes: [
        "Δ = b² − 4ac",
        "Δ = b + 4ac",
        "Δ = a² − bc",
        "Δ = 2a + b"
      ],
      correta: 0,
      explicacao: "O discriminante é calculado pela expressão Δ = b² − 4ac."
    },
    {
      pergunta: "Se Δ for negativo, quantas raízes reais distintas a equação possui?",
      opcoes: [
        "Duas",
        "Uma",
        "Três",
        "Nenhuma"
      ],
      correta: 3,
      explicacao: "Delta negativo indica que não existem raízes reais."
    },
    {
      pergunta: "Quais são as raízes de x² − 5x + 6 = 0?",
      opcoes: [
        "x = 1 e x = 6",
        "x = 2 e x = 3",
        "x = −2 e x = −3",
        "x = 0 e x = 5"
      ],
      correta: 1,
      explicacao: "O delta é 1. Aplicando Bhaskara, encontramos x₁ = 3 e x₂ = 2."
    }
  ];

  const questionTitle = document.querySelector("#quiz-question");
  const optionsContainer = document.querySelector("#quiz-options");
  const feedback = document.querySelector("#quiz-feedback");
  const nextButton = document.querySelector("#quiz-next");
  const counter = document.querySelector("#quiz-counter");
  const progress = document.querySelector("#quiz-progress");
  const resultScreen = document.querySelector("#quiz-result");
  const finalTitle = document.querySelector("#quiz-final-title");
  const scoreDisplay = document.querySelector("#quiz-score");
  const resultMessage = document.querySelector("#quiz-message");
  const restartButton = document.querySelector("#quiz-restart");

  let indiceAtual = 0;
  let pontuacao = 0;
  let respondida = false;

  function mostrarPergunta() {
    const atual = perguntas[indiceAtual];

    respondida = false;
    questionTitle.textContent = atual.pergunta;
    counter.textContent =
      `Pergunta ${indiceAtual + 1} de ${perguntas.length}`;

    progress.style.width =
      `${(indiceAtual / perguntas.length) * 100}%`;

    feedback.textContent = "";
    feedback.className = "quiz-feedback";
    optionsContainer.innerHTML = "";
    nextButton.disabled = true;

    atual.opcoes.forEach((opcao, indice) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "quiz-option";

      const letra = document.createElement("span");
      letra.className = "option-letter";
      letra.textContent = String.fromCharCode(65 + indice);

      const texto = document.createElement("span");
      texto.textContent = opcao;

      botao.append(letra, texto);
      botao.addEventListener("click", () => selecionarResposta(indice));

      optionsContainer.appendChild(botao);
    });

    nextButton.textContent =
      indiceAtual === perguntas.length - 1
        ? "Ver resultado →"
        : "Próxima pergunta →";
  }

  function selecionarResposta(indiceEscolhido) {
    if (respondida) return;

    respondida = true;

    const atual = perguntas[indiceAtual];
    const botoes = optionsContainer.querySelectorAll(".quiz-option");

    botoes.forEach((botao, indice) => {
      botao.disabled = true;

      if (indice === atual.correta) {
        botao.classList.add("correct");
      }

      if (indice === indiceEscolhido && indice !== atual.correta) {
        botao.classList.add("incorrect");
      }
    });

    if (indiceEscolhido === atual.correta) {
      pontuacao++;

      feedback.textContent = `✓ Correto! ${atual.explicacao}`;
      feedback.classList.add("good");
    } else {
      feedback.textContent = `Não foi dessa vez. ${atual.explicacao}`;
      feedback.classList.add("bad");
    }

    progress.style.width =
      `${((indiceAtual + 1) / perguntas.length) * 100}%`;

    nextButton.disabled = false;
  }

  function mostrarResultado() {
    quizContent.hidden = true;
    resultScreen.hidden = false;

    const percentual = (pontuacao / perguntas.length) * 100;

    scoreDisplay.textContent =
      `${pontuacao} de ${perguntas.length} (${percentual}%)`;

    if (pontuacao === perguntas.length) {
      finalTitle.textContent = "Perfeito! Você arrasou!";
      resultMessage.textContent =
        "Você acertou todas as perguntas. Continue praticando para manter esse conhecimento!";
    } else if (pontuacao >= 3) {
      finalTitle.textContent = "Muito bem!";
      resultMessage.textContent =
        "Você já domina uma boa parte do conteúdo. Revise os pontos em que teve dificuldade e tente novamente.";
    } else {
      finalTitle.textContent = "Continue praticando!";
      resultMessage.textContent =
        "Volte às páginas de conceitos e Bhaskara, revise os exemplos e faça o quiz novamente. Você consegue!";
    }

    progress.style.width = "100%";
    counter.textContent = "Quiz concluído";
  }

  nextButton.addEventListener("click", () => {
    if (!respondida) return;

    if (indiceAtual < perguntas.length - 1) {
      indiceAtual++;
      mostrarPergunta();
    } else {
      mostrarResultado();
    }
  });

  restartButton.addEventListener("click", () => {
    indiceAtual = 0;
    pontuacao = 0;
    respondida = false;

    resultScreen.hidden = true;
    quizContent.hidden = false;

    mostrarPergunta();
  });

  mostrarPergunta();
}