// Main JavaScript file for the portfolio website (Refactored for Simplicity)

// Global variables
let animationCleanup = null;

// Web Projects Data
const projectData = {
    project1: {
        title: "E-commerce Platform",
        description: "A complete e-commerce solution built with modern technologies.",
        url: "https://example.com/ecommerce-demo",
        technologies: ["React", "Node.js", "MongoDB", "Stripe API", "JWT"],
        image: "https://via.placeholder.com/600x400/3B82F6/ffffff?text=E-commerce+Platform"
    },
    project2: {
        title: "Analytics Dashboard",
        description: "Interactive dashboard for real-time data visualization.",
        url: "https://example.com/analytics-demo",
        technologies: ["Vue.js", "D3.js", "Express", "PostgreSQL"],
        image: "https://via.placeholder.com/600x400/10B981/ffffff?text=Analytics+Dashboard"
    },
    project3: {
        title: "Task Manager App",
        description: "Mobile-first task management application with cloud sync.",
        url: "https://example.com/taskmanager-demo",
        technologies: ["React Native", "Firebase", "Redux"],
        image: "https://via.placeholder.com/600x400/8B5CF6/ffffff?text=Task+Manager+App"
    }
};

// ===================================================================
// INÍCIO DA SECÇÃO DE VÍDEOS OTIMIZADA
// ===================================================================

// DADOS DOS VÍDEOS - A única secção que você precisa de editar
const videoData = {
    reels: [ // Vídeos verticais
        { title_key: 'reel1_title', desc_key: 'reel1_desc', source: 'https://drive.google.com/file/d/1BAew-9YGEgKVYv3dxT3OUJE5tTz3cfFX/view', aspect: '9:16' },
        { title_key: 'reel2_title', desc_key: 'reel2_desc', source: 'https://drive.google.com/file/d/1FF4JqYFU504MBfMLWztb9afrzHNIpWsU/view', aspect: '9:16' },
        { title_key: 'reel3_title', desc_key: 'reel3_desc', source: 'https://drive.google.com/file/d/19ikX5Zd0eNOUdENfdx0O7nSYLbVZzx-R/view', aspect: '9:16' },
        { title_key: 'reel4_title', desc_key: 'reel4_desc', source: 'https://drive.google.com/file/d/19ikX5Zd0eNOUdENfdx0O7nSYLbVZzx-R/view', aspect: '9:16' },
    ],
    retail: [ // Anúncios
        { title_key: 'retail1_title', desc_key: 'retail1_desc', source: 'https://drive.google.com/file/d/14sab3OuZXWW4q72iXGmkIfVosrtmy88k/view', aspect: '9:16' },
        { title_key: 'retail2_title', desc_key: 'retail2_desc', source: 'https://drive.google.com/file/d/1FF4JqYFU504MBfMLWztb9afrzHNIpWsU/view', aspect: '9:16' },
        { title_key: 'retail3_title', desc_key: 'retail3_desc', source: 'https://drive.google.com/file/d/19ikX5Zd0eNOUdENfdx0O7nSYLbVZzx-R/view', aspect: '9:16' },
        { title_key: 'retail4_title', desc_key: 'retail4_desc', source: 'https://drive.google.com/file/d/19ikX5Zd0eNOUdENfdx0O7nSYLbVZzx-R/view', aspect: '9:16' },
    ],
    vsl: [ // Vídeos de Vendas
        { title_key: 'vsl1_title', desc_key: 'vsl1_desc', source: 'https://drive.google.com/file/d/1nEMPLfmANjjxnQxkMi_0tKxDiCH7JB9U/view', aspect: '16:9' },
        { title_key: 'vsl2_title', desc_key: 'vsl2_desc', source: 'https://drive.google.com/file/d/1HyasgJ-2xU6_9Mx2Bd3A9k_jgsjKBI48/view', aspect: '16:9' },
        { title_key: 'vsl3_title', desc_key: 'vsl3_desc', source: 'https://drive.google.com/file/d/1g2hJFRD0FWJdW06ypxbb97ku4s01dzRk/view', aspect: '16:9' },
        { title_key: 'vsl4_title', desc_key: 'vsl4_desc', source: 'https://drive.google.com/file/d/1-_dybyAies9S3XcgP1b386VogW0YfQJk/view', aspect: '16:9' },
        { title_key: 'vsl5_title', desc_key: 'vsl5_desc', source: 'https://drive.google.com/file/d/1YiQPgLR1CheOD6EvK-AY1FBVqM5mUgm3/view', aspect: '16:9' }
    ]
};

// Função que gera o código do vídeo automaticamente
function generateVideoEmbed(source, title) {
    if (!source || !source.trim()) {
        return `<div class="w-full h-full rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><p class="text-gray-500">Vídeo não disponível</p></div>`;
    }

    source = source.trim();

    if (source.startsWith('<iframe')) {
        return source;
    }
    
    const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const driveMatch = source.match(driveRegex);

    if (driveMatch && driveMatch[1]) {
        return `<iframe src="https://drive.google.com/file/d/${driveMatch[1]}/preview" title="${title}" frameborder="0" allowfullscreen class="w-full h-full rounded-lg shadow-lg"></iframe>`;
    }

    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = source.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
        return `<iframe src="https://www.youtube.com/embed/${youtubeMatch[1]}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full rounded-lg shadow-lg"></iframe>`;
    }
    
    if (source.length === 11 && !source.includes('/')) {
        return `<iframe src="https://www.youtube.com/embed/${source}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full rounded-lg shadow-lg"></iframe>`;
    }

    if (source.endsWith('.mp4')) {
        return `<video controls class="w-full h-full rounded-lg shadow-lg"><source src="${source}" type="video/mp4">Seu navegador não suporta o vídeo.</video>`;
    }

    return `<div class="w-full h-full rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><p class="text-gray-500">Formato de vídeo inválido</p></div>`;
}

// Função que renderiza os vídeos na página
function renderVideos(category) {
    const activeCategory = document.querySelector(`[data-category="${category}"].video-category`);
    if (!activeCategory || !videoData[category]) return;
    
    const videos = videoData[category];
    const container = activeCategory.querySelector('.grid');
    if (!container) return;

    // Garante que o grid tenha as classes corretas para o layout responsivo
    container.className = 'grid md:grid-cols-2 lg:grid-cols-4 gap-6';

    container.innerHTML = '';
    
    // Pega o idioma atual para exibir o texto padrão correto antes da tradução total
    const currentLang = window.currentLanguage ? window.currentLanguage() : 'pt';

    videos.forEach(video => {
        // Pega o texto padrão da chave de tradução, se existir
        const defaultTitle = translations[currentLang]?.[video.title_key] || video.title_key;
        const defaultDesc = translations[currentLang]?.[video.desc_key] || video.desc_key;

        const videoEmbed = generateVideoEmbed(video.source, defaultTitle);
        const aspectClass = video.aspect === '9:16' ? 'aspect-w-9 aspect-h-16' : 'aspect-w-16 aspect-h-9';
        
        const videoHTML = `
            <div class="video-item">
                <div class="${aspectClass}">
                    ${videoEmbed}
                </div>
                <h3 class="text-lg font-semibold mt-4 mb-2" data-translate="${video.title_key}">${defaultTitle}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm" data-translate="${video.desc_key}">${defaultDesc}</p>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', videoHTML);
    });

    // Garante que a tradução seja aplicada após a renderização
    if (typeof translatePage === 'function') {
        translatePage(currentLang);
    }
}

function initVideoTabs() {
    const tabs = document.querySelectorAll('.video-tab');
    
    function switchTab(category) {
        tabs.forEach(tab => {
            const isSelected = tab.getAttribute('data-category') === category;
            tab.classList.toggle('active', isSelected);
            tab.classList.toggle('text-primary', isSelected);
            tab.classList.toggle('border-primary', isSelected);
            tab.classList.toggle('text-gray-600', !isSelected);
            tab.classList.toggle('dark:text-gray-300', !isSelected);
            tab.classList.toggle('border-transparent', !isSelected);
        });

        document.querySelectorAll('.video-category').forEach(cat => {
            cat.style.display = cat.getAttribute('data-category') === category ? 'block' : 'none';
        });

        renderVideos(category);
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            switchTab(category);
        });
    });
    
    const initialCategory = document.querySelector('.video-tab.active')?.getAttribute('data-category') || 'reels';
    switchTab(initialCategory);
}

// ===================================================================
// FIM DA SECÇÃO DE VÍDEOS OTIMIZADA
// ===================================================================

function initApp() {
    console.log('Initializing Portfolio Application...');
    // A inicialização do sistema de idiomas deve vir primeiro
    if (typeof initLanguageSystem === 'function') {
        initLanguageSystem();
    } else {
        console.error("Language system not found!");
    }
    
    if (typeof initAnimations === 'function') animationCleanup = initAnimations();
    initThemeSystem();
    initMobileMenu();
    initNavigationHighlighting();
    initVideoTabs();
    console.log('Portfolio Application initialized successfully!');
}

function initThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') { htmlElement.classList.add('dark'); } 
    else { htmlElement.classList.remove('dark'); }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });
    }
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

function initNavigationHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    function updateActiveNavigation() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('text-primary', 'font-semibold'));
                const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('text-primary', 'font-semibold');
            }
        });
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNavigation();
                ticking = false;
            });
            ticking = true;
        }
    });
    updateActiveNavigation();
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        initApp();
    } catch (error) {
        console.error('Initialization Error:', error);
    }
});

window.addEventListener('beforeunload', () => {
    if (animationCleanup && typeof animationCleanup === 'function') {
        animationCleanup();
    }
});