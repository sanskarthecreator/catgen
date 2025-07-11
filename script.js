// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const imageContainer = document.getElementById('imageContainer');
const placeholder = document.getElementById('placeholder');
const loadingOverlay = document.getElementById('loadingOverlay');
const catCountElement = document.getElementById('catCount');

// State
let isLoading = false;
let catCount = 0;
let clickCount = 0;

// Init
init();

function init() {
    generateBtn.addEventListener('click', handleGenerate);
    imageContainer.addEventListener('click', handleGenerate);
    document.addEventListener('keydown', handleKeyPress);

    const savedCount = localStorage.getItem('catCount');
    if (savedCount) {
        catCount = parseInt(savedCount);
        updateCatCount();
    }
}

function handleGenerate() {
    if (isLoading) return;
    generateCat();
    trackClick();
}

function handleKeyPress(e) {
    if (isLoading) return;
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
    }
}

function showLoading() {
    isLoading = true;
    loadingOverlay.classList.add('show');
    placeholder.classList.add('hidden');
    generateBtn.style.pointerEvents = 'none';
    generateBtn.style.opacity = '0.6';
}

function hideLoading() {
    isLoading = false;
    loadingOverlay.classList.remove('show');
    generateBtn.style.pointerEvents = 'auto';
    generateBtn.style.opacity = '1';
}

function clearImage() {
    const existingImg = imageContainer.querySelector('img');
    if (existingImg) {
        existingImg.style.opacity = '0';
        existingImg.style.transform = 'scale(0.9)';
        setTimeout(() => {
            existingImg.remove();
        }, 300);
    }
}

function showPlaceholder() {
    placeholder.classList.remove('hidden');
}

function displayImage(src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Adorable cat';
    img.classList.add('cat-image');

    img.onload = () => {
        hideLoading();
        clearImage();

        const frame = document.querySelector('.image-frame');
        frame.appendChild(img);

        // Animate in
        setTimeout(() => img.classList.add('loaded'), 50);

        // Update counter
        catCount++;
        updateCatCount();
        saveCatCount();
        addSuccessParticles();
    };

    img.onerror = () => {
        hideLoading();
        showError();
    };
}

function showError() {
    const pawPrints = placeholder.querySelector('.paw-prints');
    const text = placeholder.querySelector('p');

    pawPrints.innerHTML = '<div class="paw">❌</div>';
    text.textContent = 'oops! try again';

    placeholder.classList.remove('hidden');

    setTimeout(() => {
        pawPrints.innerHTML = `
            <div class="paw">🐾</div>
            <div class="paw">🐾</div>
            <div class="paw">🐾</div>
        `;
        text.textContent = 'click to meet a new friend';
    }, 3000);
}

function updateCatCount() {
    catCountElement.textContent = catCount;
    catCountElement.style.transform = 'scale(1.2)';
    catCountElement.style.color = '#ff6b9d';
    setTimeout(() => {
        catCountElement.style.transform = 'scale(1)';
    }, 300);
}

function saveCatCount() {
    try {
        localStorage.setItem('catCount', catCount.toString());
    } catch (e) {}
}

function addSuccessParticles() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((p, i) => {
        setTimeout(() => {
            p.style.animation = 'particleFloat 2s ease-out';
        }, i * 200);
    });

    setTimeout(() => {
        particles.forEach(p => p.style.animation = '');
    }, 2000);
}

function trackClick() {
    clickCount++;
    if (clickCount === 5) {
        generateBtn.style.background = 'linear-gradient(45deg, #ff6b9d, #c44569, #4834d4, #686de0, #00d2d3, #54a0ff)';
        generateBtn.style.backgroundSize = '400% 400%';
        generateBtn.style.animation = 'rainbow 2s ease infinite';

        setTimeout(() => {
            generateBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #c44569)';
            generateBtn.style.animation = '';
            clickCount = 0;
        }, 4000);
    }
}

async function generateCat() {
    showLoading();
    try {
        const res = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await res.json();
        if (data[0]?.url) {
            setTimeout(() => displayImage(data[0].url), 1000);
        } else {
            throw new Error('No cat image found');
        }
    } catch (e) {
        setTimeout(() => {
            hideLoading();
            showError();
        }, 1000);
    }
}

// Add required styles dynamically
const style = document.createElement('style');
style.textContent = `
    img.cat-image {
        max-width: 100%;
        border-radius: 12px;
        opacity: 0;
        transform: scale(0.95);
        transition: all 0.4s ease;
    }
    img.cat-image.loaded {
        opacity: 1;
        transform: scale(1);
    }
    @keyframes rainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    .loading-overlay.show {
        display: flex !important;
    }
`;
document.head.appendChild(style);
