(function () {
    const cameraCount = document.getElementById('cameraCount');
    const cameraOutput = document.getElementById('cameraOutput');
    const estimateOutput = document.getElementById('estimateOutput');

    if (cameraCount && cameraOutput && estimateOutput) {
        const format = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        });

        function updateEstimate() {
            const count = Number(cameraCount.value);
            const total = 2200000 + (count * 825000);
            cameraOutput.textContent = count + ' titik';
            estimateOutput.textContent = format.format(total);
        }

        cameraCount.addEventListener('input', updateEstimate);
        updateEstimate();
    }

    document.getElementById('dummyForm')?.addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Dummy terkirim. Di GitHub Pages, data tidak masuk database.');
        event.currentTarget.reset();
    });

    document.getElementById('newsletterForm')?.addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Email dummy terdaftar. Di GitHub Pages, data tidak masuk database.');
        event.currentTarget.reset();
    });

    const productFilters = document.querySelectorAll('[data-product-filter]');
    const kindFilters = document.querySelectorAll('[data-kind-filter]');
    const productCards = document.querySelectorAll('[data-product-category]');
    const productGrid = document.querySelector('.product-grid');
    const productPagination = document.getElementById('productPagination');
    let currentProductPage = 1;

    if (productFilters.length && productCards.length) {
        function productsPerPage() {
            return window.matchMedia('(max-width: 1199.98px)').matches ? 4 : 6;
        }

        function currentKind() {
            return document.querySelector('[data-kind-filter].active')?.dataset.kindFilter || 'all';
        }

        function renderProductPage(matchedCards) {
            const perPage = productsPerPage();
            const totalPages = Math.ceil(matchedCards.length / perPage);
            currentProductPage = Math.min(currentProductPage, Math.max(totalPages, 1));

            productCards.forEach(function (card) {
                card.hidden = true;
            });

            matchedCards.forEach(function (card, index) {
                const start = (currentProductPage - 1) * perPage;
                const end = start + perPage;
                card.hidden = index < start || index >= end;
            });

            if (!productPagination) return;

            productPagination.hidden = totalPages <= 1;
            productPagination.innerHTML = Array.from({ length: totalPages }, function (_, index) {
                const page = index + 1;
                return `<button class="${page === currentProductPage ? 'active' : ''}" type="button" data-product-page="${page}">${page}</button>`;
            }).join('');
        }

        function applyProductFilter(selected, kind = currentKind(), brand = '', resetPage = true) {
            if (resetPage) currentProductPage = 1;

            productFilters.forEach(function (item) {
                item.classList.toggle('active', item.dataset.productFilter === selected);
            });

            const matchedCards = [];

            productCards.forEach(function (card) {
                const matchesCategory = selected === 'all' || card.dataset.productCategory === selected;
                const matchesKind = kind === 'all' || card.dataset.productKind === kind;
                const matchesBrand = !brand || card.dataset.productBrand === brand;
                const isVisible = matchesCategory && matchesKind && matchesBrand;
                if (isVisible) matchedCards.push(card);
            });

            if (productGrid) {
                productGrid.classList.toggle('product-grid-package', kind === 'package');
            }

            renderProductPage(matchedCards);
        }

        productFilters.forEach(function (filter) {
            filter.addEventListener('click', function () {
                applyProductFilter(filter.dataset.productFilter);
            });
        });

        kindFilters.forEach(function (filter) {
            filter.addEventListener('click', function () {
                kindFilters.forEach(function (item) {
                    item.classList.toggle('active', item === filter);
                });

                const selectedCategory = document.querySelector('[data-product-filter].active')?.dataset.productFilter || 'all';
                applyProductFilter(selectedCategory, filter.dataset.kindFilter, new URLSearchParams(window.location.search).get('brand') || '');
            });
        });

        productPagination?.addEventListener('click', function (event) {
            const button = event.target.closest('[data-product-page]');
            if (!button) return;

            currentProductPage = Number(button.dataset.productPage);
            const selectedCategory = document.querySelector('[data-product-filter].active')?.dataset.productFilter || 'all';
            const selectedBrand = new URLSearchParams(window.location.search).get('brand') || '';
            applyProductFilter(selectedCategory, currentKind(), selectedBrand, false);
        });

        const params = new URLSearchParams(window.location.search);
        const selectedCategory = params.get('category') || 'all';
        const selectedKind = params.get('kind') || 'all';
        const selectedBrand = params.get('brand') || '';

        kindFilters.forEach(function (item) {
            item.classList.toggle('active', item.dataset.kindFilter === selectedKind);
        });

        applyProductFilter(selectedCategory, selectedKind, selectedBrand);

        window.matchMedia('(max-width: 1199.98px)').addEventListener('change', function () {
            const activeCategory = document.querySelector('[data-product-filter].active')?.dataset.productFilter || 'all';
            applyProductFilter(activeCategory, currentKind(), new URLSearchParams(window.location.search).get('brand') || '');
        });
    }

    const backTop = document.querySelector('.back-top');
    if (backTop) {
        window.addEventListener('scroll', function () {
            backTop.classList.toggle('show', window.scrollY > 500);
        });

        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();
