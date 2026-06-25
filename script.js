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
