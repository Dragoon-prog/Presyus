document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollTracker();
    initSoundscape();
});

function initParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    const theme = document.body.className;
    let particleClass = 'particle-bubble';
    if (theme.includes('theme-green')) particleClass = 'particle-leaf';
    if (theme.includes('theme-flowers')) particleClass = 'particle-petal';

    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.classList.add('particle', particleClass);
        if (particleClass === 'particle-bubble') {
            const sz = Math.random() * 12 + 6;
            p.style.width = `${sz}px`; p.style.height = `${sz}px`;
        }
        p.style.left = `${Math.random() * 100}%`;
        p.style.animationDuration = `${Math.random() * 8 + 6}s`;
        p.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(p);
    }
}

function initScrollTracker() {
    const depthText = document.getElementById('depth-text');
    if (!depthText) return;

    const sections = [
        { id: 'surface', depth: '0m • Surface' },
        { id: 'twilight', depth: '200m • Twilight' },
        { id: 'sanctuary', depth: '1,000m • Midnight' },
        { id: 'deep-letter', depth: '6,000m+ • Mariana Trench' }
    ];

    window.addEventListener('scroll', () => {
        let current = '0m • Surface';
        const pos = window.scrollY + 200;
        sections.forEach(s => {
            const el = document.getElementById(s.id);
            if (el && pos >= el.offsetTop) current = s.depth;
        });
        depthText.innerText = `Depth: ${current}`;
    });
}

function generateNote(type) {
    const display = document.getElementById('note-display');
    if (!display) return;

    let notes = [];
    if (type === 'ocean') {
        notes = [
            "I'm whale-y glad I met you! 🐋",
            "You are jaw-somely special to me. 🦈",
            "My love for you runs deeper than the Mariana Trench.",
            "You're completely fin-tastic in every single way! ✨",
            "Out of all the people in the sea, you're the only one for me."
        ];
    } else if (type === 'green') {
        notes = [
            "Being with you feels like taking a deep breath in a calm forest. 🌿",
            "Thank you for being my safe, peaceful haven.",
            "Courting you is a garden I want to nurture every single day.",
            "You bring a quiet, refreshing joy into my life. 🍃",
            "Like a steady oak, my appreciation for you keeps growing."
        ];
    } else if (type === 'flowers') {
        notes = [
            "Every moment with you is like a flower blooming in full color. 🌸",
            "You make even ordinary days feel like a sunlit meadow. 🌼",
            "I'm so glad our paths crossed in this big garden of life.",
            "You are the prettiest bloom in the field. 🌺",
            "My days are brighter because you are in them."
        ];
    }

    const rand = Math.floor(Math.random() * notes.length);
    display.style.opacity = '0';
    setTimeout(() => {
        display.innerHTML = `<span>"${notes[rand]}"</span>`;
        display.style.opacity = '1';
    }, 200);
}

function initSoundscape() {
    const soundBtn = document.getElementById('sound-btn');
    if (!soundBtn) return;

    let audioCtx = null, isPlaying = false, noiseNode = null, lfoNode = null, gainNode = null;

    soundBtn.addEventListener('click', () => {
        if (!isPlaying) {
            startAudio();
            isPlaying = true;
            soundBtn.innerText = '🔊';
        } else {
            stopAudio();
            isPlaying = false;
            soundBtn.innerText = '🌊';
        }
    });

    function startAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 4;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer; noiseNode.loop = true;
        const filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'lowpass'; filterNode.frequency.value = 400;

        lfoNode = audioCtx.createOscillator(); lfoNode.frequency.value = 0.12;
        const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 300;
        lfoNode.connect(lfoGain); lfoGain.connect(filterNode.frequency);

        gainNode = audioCtx.createGain(); gainNode.gain.value = 0.15;
        noiseNode.connect(filterNode); filterNode.connect(gainNode); gainNode.connect(audioCtx.destination);
        noiseNode.start(); lfoNode.start();
    }

    function stopAudio() {
        if (gainNode && audioCtx) {
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            setTimeout(() => { if (noiseNode) noiseNode.stop(); if (lfoNode) lfoNode.stop(); }, 500);
        }
    }
}
