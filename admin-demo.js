(function () {
    const authKey = 'alfAdminDemoAuth';
    const dataKey = 'alfAdminDemoData';

    const seed = {
        services: ['CCTV', 'Access Door', 'Security Alarm', 'Maintenance'],
        products: ['IP Camera 2MP Full Color', 'Dome Camera 4MP', 'NVR 8 Channel', 'Face Recognition Access', 'Alarm Sensor Pintu', 'PoE Switch 8 Port'],
        packages: ['Paket CCTV Rumah', 'Paket CCTV Bisnis', 'Paket Access Door', 'Paket Maintenance'],
        faqs: ['Apakah bisa survey lokasi dulu?', 'Apakah CCTV bisa dipantau dari HP?', 'Berapa lama proses pemasangan?', 'Apakah tersedia garansi?'],
        portfolio: ['CCTV Project', 'Teknisi CCTV', 'Access Control', 'Security Alarm', 'Maintenance SPBU', 'Palang Parkir'],
        testimonials: 5,
        subscribers: 0,
        tracking: 40,
        leads: [
            { name: 'Bapak Andi', contact: '0812-0000-1234', subject: 'Konsultasi CCTV rumah', status: 'new' },
            { name: 'Ibu Rani', contact: '0813-0000-5678', subject: 'Access door kantor', status: 'contacted' }
        ],
        settings: {
            company_name: 'AlfindoTech',
            whatsapp: '6282118690455',
            hero_title: 'Your Best Security Technology Solution'
        }
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function getData() {
        const raw = localStorage.getItem(dataKey);
        if (!raw) {
            localStorage.setItem(dataKey, JSON.stringify(seed));
            return clone(seed);
        }

        try {
            return Object.assign(clone(seed), JSON.parse(raw));
        } catch (error) {
            localStorage.setItem(dataKey, JSON.stringify(seed));
            return clone(seed);
        }
    }

    function setData(data) {
        localStorage.setItem(dataKey, JSON.stringify(data));
    }

    function textList(title, items) {
        return `<h3>${title}</h3><ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
    }

    function renderDashboard() {
        const stats = document.getElementById('adminStats');

        const data = getData();
        const statItems = [
            ['Layanan', data.services.length, 'fa-screwdriver-wrench', 'blue'],
            ['Produk', data.products.length, 'fa-box-open', 'blue'],
            ['Paket', data.packages.length, 'fa-tags', 'teal'],
            ['Portfolio', data.portfolio.length, 'fa-images', 'gold'],
            ['Testimoni', data.testimonials, 'fa-star', 'red'],
            ['FAQ', data.faqs.length, 'fa-circle-question', 'blue'],
            ['Leads', data.leads.length, 'fa-inbox', 'teal'],
            ['Subscriber', data.subscribers, 'fa-envelope-open-text', 'gold'],
            ['Tracking', data.tracking, 'fa-chart-line', 'red']
        ];

        if (stats) {
            stats.innerHTML = statItems.map(([label, value, icon, tone]) => `
            <div class="admin-stat admin-stat-${tone}">
                <i class="fa-solid ${icon}"></i>
                <div><span>${label}</span><strong>${value}</strong></div>
            </div>
            `).join('');
        }

        const leadRows = document.getElementById('leadRows');
        if (leadRows) {
            leadRows.innerHTML = data.leads.map((lead, index) => `
            <tr>
                <td><strong>${lead.name}</strong><br><span class="text-muted">Demo lead</span></td>
                <td>${lead.contact}<br><span class="text-muted">dummy@demo.local</span></td>
                <td>${lead.subject}</td>
                <td><span class="badge rounded-pill text-bg-primary">${lead.status}</span></td>
                <td><button class="btn btn-sm btn-outline-danger" type="button" data-delete-lead="${index}">Hapus</button></td>
            </tr>
            `).join('');
        }

        const serviceList = document.getElementById('serviceList');
        const productList = document.getElementById('productList');
        const packageList = document.getElementById('packageList');
        const faqList = document.getElementById('faqList');
        const portfolioList = document.getElementById('portfolioList');

        if (serviceList) serviceList.innerHTML = textList('Layanan', data.services);
        if (productList) productList.innerHTML = textList('Produk', data.products);
        if (packageList) packageList.innerHTML = textList('Paket', data.packages);
        if (faqList) faqList.innerHTML = textList('FAQ', data.faqs);
        if (portfolioList) portfolioList.innerHTML = textList('Portfolio', data.portfolio);

        const form = document.getElementById('settingForm');
        if (form) {
            form.company_name.value = data.settings.company_name;
            form.whatsapp.value = data.settings.whatsapp;
            form.hero_title.value = data.settings.hero_title;
        }
    }

    document.getElementById('adminLoginForm')?.addEventListener('submit', function (event) {
        event.preventDefault();
        const form = event.currentTarget;
        const valid = form.email.value === 'admin@demo.com' && form.password.value === 'demo123';
        document.getElementById('adminLoginError').classList.toggle('d-none', valid);
        if (!valid) return;

        localStorage.setItem(authKey, 'true');
        location.href = './admin-dashboard.html';
    });

    document.addEventListener('click', function (event) {
        const toggle = event.target.closest('[data-admin-sidebar-toggle]');
        if (toggle) {
            const root = document.documentElement;
            const expanded = !root.classList.contains('admin-sidebar-expanded');
            root.classList.toggle('admin-sidebar-expanded', expanded);
            root.classList.toggle('admin-sidebar-collapsed', !expanded);
            toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            localStorage.setItem(window.matchMedia('(max-width: 991.98px)').matches ? 'alfAdminDemoSidebarMobile' : 'alfAdminDemoSidebarDesktop', expanded ? 'expanded' : 'collapsed');
        }

        if (event.target.closest('[data-admin-logout]')) {
            localStorage.removeItem(authKey);
            location.href = './admin-login.html';
        }

        const data = getData();

        if (event.target.closest('[data-add-lead]')) {
            data.leads.unshift({ name: 'Lead Demo ' + (data.leads.length + 1), contact: '08xx-demo', subject: 'Kebutuhan sistem keamanan', status: 'new' });
            setData(data);
            renderDashboard();
        }

        if (event.target.closest('[data-add-package]')) {
            data.packages.push('Paket Demo ' + (data.packages.length + 1));
            setData(data);
            renderDashboard();
        }

        if (event.target.closest('[data-add-product]')) {
            data.products.unshift('Produk Demo ' + (data.products.length + 1));
            setData(data);
            renderDashboard();
        }

        if (event.target.closest('[data-add-faq]')) {
            data.faqs.push('FAQ demo baru ' + (data.faqs.length + 1) + '?');
            setData(data);
            renderDashboard();
        }

        if (event.target.closest('[data-add-portfolio]')) {
            data.portfolio.push('Project Demo ' + (data.portfolio.length + 1));
            setData(data);
            renderDashboard();
        }

        if (event.target.closest('[data-reset-demo]')) {
            setData(clone(seed));
            renderDashboard();
        }

        const deleteButton = event.target.closest('[data-delete-lead]');
        if (deleteButton) {
            data.leads.splice(Number(deleteButton.dataset.deleteLead), 1);
            setData(data);
            renderDashboard();
        }
    });

    document.getElementById('settingForm')?.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = getData();
        data.settings.company_name = event.currentTarget.company_name.value;
        data.settings.whatsapp = event.currentTarget.whatsapp.value;
        data.settings.hero_title = event.currentTarget.hero_title.value;
        setData(data);
        alert('Setting demo tersimpan di browser ini.');
        renderDashboard();
    });

    document.querySelectorAll('[data-admin-dummy-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            alert('Data dummy tersimpan di browser preview. Di versi Laravel, data ini masuk database.');
        });
    });

    renderDashboard();
})();
