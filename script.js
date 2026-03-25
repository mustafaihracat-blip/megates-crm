const TITLES = {
    overview: 'Genel Bakış — Nijerya Pazar İstihbarat Paneli',
    trade: 'Ticaret Verileri — UN Comtrade & Volza',
    projects: 'Aktif Projeler — World Bank & Uluslararası Fonlar',
    tenders: 'İhale Takibi — Canlı İhale Kaynakları',
    disco: 'DisCo Rehberi — 12 Dağıtım Şirketi',
    leads: 'Lead Listesi — 30+ Hedef Firma'
};

async function loadPage(page) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '<div class="loading">📂 Sayfa yükleniyor...</div>';
    
    try {
        const response = await fetch(`pages/${page}.html?_=${Date.now()}`);
        if (!response.ok) throw new Error('Sayfa bulunamadı');
        const html = await response.text();
        contentArea.innerHTML = html;
        
        // Sayfa yüklendikten sonra scriptleri çalıştır
        if (typeof window.initPage === 'function') {
            window.initPage();
        }
    } catch(e) {
        contentArea.innerHTML = `<div class="loading" style="color:#e74c3c;">❌ Sayfa yüklenemedi: ${e.message}</div>`;
    }
}

function checkUser() {
    const userType = localStorage.getItem('megates_user');
    const userName = localStorage.getItem('megates_username') || '';
    const userInfoSpan = document.getElementById('userInfo');
    const adminLink = document.getElementById('adminLink');
    
    if (!userType) {
        window.location.href = 'login.html';
        return;
    }
    
    if (userInfoSpan) {
        userInfoSpan.innerHTML = `👤 ${userName}`;
    }
    
    if (adminLink && userType === 'admin') {
        adminLink.style.display = 'inline-block';
    }
}

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const page = link.dataset.page;
        if (!page) return;
        
        document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        document.getElementById('ptitle').textContent = TITLES[page] || page;
        loadPage(page);
    });
});

checkUser();
loadPage('overview');