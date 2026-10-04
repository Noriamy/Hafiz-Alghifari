const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('navMenu');
const siteHeader = document.querySelector('.site-header');
const revealItems = document.querySelectorAll('.reveal');

function initNavigation() {
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initHeaderScroll() {
  const updateHeader = () => {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('is-scrolled');
    } else {
      siteHeader?.classList.remove('is-scrolled');
    }
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initCounterAnimation() {
  const counters = document.querySelectorAll('.count-up');

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    let current = 0;
    const duration = 1000;
    const step = Math.ceil(target / (duration / 16));

    const update = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
        return;
      }
      counter.textContent = current;
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }
}

function initWireComparison() {
  const diagram = document.getElementById('wireDiagram');
  const buttons = document.querySelectorAll('.standard-toggle');

  if (!diagram || !buttons.length) return;

  const wiringMap = {
    T568A: ['White/Green', 'Green', 'White/Orange', 'Blue', 'White/Blue', 'Orange', 'White/Brown', 'Brown'],
    T568B: ['White/Orange', 'Orange', 'White/Green', 'Blue', 'White/Blue', 'Green', 'White/Brown', 'Brown']
  };

  const colorMap = {
    'White/Green': '#4ade80',
    Green: '#16a34a',
    'White/Orange': '#fbbf24',
    Blue: '#2563eb',
    'White/Blue': '#60a5fa',
    Orange: '#f97316',
    'White/Brown': '#a16207',
    Brown: '#7c2d12',
    'White/Orange': '#fbbf24',
    'White/Green': '#4ade80'
  };

  const renderDiagram = (standard) => {
    diagram.innerHTML = '';
    wiringMap[standard].forEach((color, index) => {
      const pin = document.createElement('div');
      pin.className = 'wire-pin';
      pin.innerHTML = `
        <span class="pin-index">Pin ${index + 1}</span>
        <span class="wire-swatch" style="--wire-color: ${colorMap[color]};"></span>
        <span class="wire-name">${color}</span>
      `;
      diagram.appendChild(pin);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.toggle('active', item === button));
      renderDiagram(button.dataset.standard);
    });
  });

  renderDiagram('T568A');
}

function initQuiz() {
  const questions = [
    {
      question: 'Apa fungsi utama kabel LAN?',
      options: [
        'Menghubungkan perangkat dalam jaringan',
        'Mengisi baterai perangkat',
        'Menyimpan data di perangkat',
        'Menghasilkan listrik'
      ],
      answer: 0
    },
    {
      question: 'Berapa jumlah pin pada konektor RJ45?',
      options: ['4', '6', '8', '10'],
      answer: 2
    },
    {
      question: 'PC ke switch biasanya menggunakan kabel apa?',
      options: ['Straight-through', 'Crossover', 'Rollover', 'Fiber'],
      answer: 0
    },
    {
      question: 'Standar urutan kabel T568B dimulai dengan warna?',
      options: ['White/Green', 'White/Orange', 'Blue', 'Brown'],
      answer: 1
    },
    {
      question: 'Dalam model peer-to-peer, perangkat dapat saling bertukar data tanpa?',
      options: ['Server pusat', 'Router', 'USB', 'Modem'],
      answer: 0
    }
  ];

  const questionElement = document.getElementById('quizQuestion');
  const optionsElement = document.getElementById('quizOptions');
  const progressElement = document.getElementById('quizProgress');
  const scoreElement = document.getElementById('quizScore');
  const nextButton = document.getElementById('nextButton');
  const restartButton = document.getElementById('restartButton');
  const resultElement = document.getElementById('quizResult');

  if (!questionElement || !optionsElement || !progressElement || !scoreElement || !nextButton || !restartButton || !resultElement) {
    return;
  }

  let index = 0;
  let score = 0;
  let answered = false;

  const showQuestion = () => {
    answered = false;
    resultElement.classList.add('hidden');
    nextButton.textContent = index === questions.length - 1 ? 'Submit' : 'Next';
    nextButton.disabled = false;
    questionElement.textContent = questions[index].question;
    progressElement.textContent = `${index + 1} / ${questions.length}`;
    scoreElement.textContent = `Skor: ${score}`;
    optionsElement.innerHTML = '';

    questions[index].options.forEach((option, optionIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.textContent = `${String.fromCharCode(65 + optionIndex)}. ${option}`;
      button.addEventListener('click', () => handleAnswer(button, optionIndex));
      optionsElement.appendChild(button);
    });
  };

  const handleAnswer = (selectedButton, optionIndex) => {
    if (answered) return;
    answered = true;

    const correctIndex = questions[index].answer;
    Array.from(optionsElement.children).forEach((button, buttonIndex) => {
      button.disabled = true;
      if (buttonIndex === correctIndex) {
        button.classList.add('correct');
      }
      if (buttonIndex === optionIndex && optionIndex !== correctIndex) {
        button.classList.add('incorrect');
      }
    });

    if (optionIndex === correctIndex) {
      score += 1;
      scoreElement.textContent = `Skor: ${score}`;
      resultElement.textContent = 'Benar! Jawaban yang tepat.';
    } else {
      resultElement.textContent = `Salah. Jawaban benar adalah ${String.fromCharCode(65 + correctIndex)}.`;
    }

    resultElement.classList.remove('hidden');
    nextButton.disabled = false;
  };

  const handleNext = () => {
    if (!answered && index < questions.length) {
      resultElement.textContent = 'Silakan pilih salah satu jawaban terlebih dahulu.';
      resultElement.classList.remove('hidden');
      return;
    }

    if (index < questions.length - 1) {
      index += 1;
      showQuestion();
      return;
    }

    resultElement.textContent = `Kuis selesai! Skor akhir Anda: ${score} / ${questions.length}.`;
    resultElement.classList.remove('hidden');
    nextButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
    optionsElement.innerHTML = '';
    questionElement.textContent = 'Semua pertanyaan telah selesai.';
    progressElement.textContent = 'Result';
    scoreElement.textContent = `Skor: ${score}`;
  };

  nextButton.addEventListener('click', handleNext);
  restartButton.addEventListener('click', () => {
    index = 0;
    score = 0;
    answered = false;
    nextButton.classList.remove('hidden');
    restartButton.classList.add('hidden');
    showQuestion();
  });

  showQuestion();
}

function initRJ45Pins() {
  const pins = document.querySelectorAll('.pin');
  pins.forEach((pin) => {
    const color = pin.dataset.color || 'Cable';
    const func = pin.dataset.function || 'Data';
    pin.style.setProperty('--pin-color', `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(59,130,246,0.45))`);
    pin.setAttribute('aria-label', `Pin ${pin.dataset.pin}: ${color}, ${func}`);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initRevealAnimations();
  initCounterAnimation();
  initWireComparison();
  initQuiz();
  initRJ45Pins();
});
