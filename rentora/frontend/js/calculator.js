/* ===================================================================
   RENTORA – SMART RENT VS BUY CALCULATOR
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const buyPriceInput = document.getElementById('calc-buy-price');
  const rentPriceInput = document.getElementById('calc-rent-price');
  const durationInput = document.getElementById('calc-duration');

  const buyPriceSlider = document.getElementById('calc-buy-slider');
  const rentPriceSlider = document.getElementById('calc-rent-slider');
  const durationSlider = document.getElementById('calc-duration-slider');

  // Outputs
  const totalRentalCostEl = document.getElementById('out-rental-cost');
  const totalBuyCostEl = document.getElementById('out-buy-cost');
  const breakEvenDaysEl = document.getElementById('out-breakeven-days');
  const savingsAmountEl = document.getElementById('out-savings-amount');
  const recommendationBadgeEl = document.getElementById('out-recommendation-badge');
  const recommendationTitleEl = document.getElementById('out-recommendation-title');
  const recommendationDescEl = document.getElementById('out-recommendation-desc');
  const meterFillEl = document.getElementById('calc-meter-fill');

  let comparisonChart = null;

  function calculateRentVsBuy() {
    const buyPrice = Number(buyPriceInput.value) || 0;
    const rentPricePerDay = Number(rentPriceInput.value) || 0;
    const durationDays = Number(durationInput.value) || 1;

    // Rental cost with weekly and monthly progressive discount
    let totalRentalCost = rentPricePerDay * durationDays;
    if (durationDays >= 30) {
      totalRentalCost = Math.round(totalRentalCost * 0.7); // 30% monthly bulk saving
    } else if (durationDays >= 7) {
      totalRentalCost = Math.round(totalRentalCost * 0.85); // 15% weekly discount
    }

    const breakEvenDays = rentPricePerDay > 0 ? Math.ceil(buyPrice / rentPricePerDay) : 0;
    const difference = buyPrice - totalRentalCost;
    const savings = Math.abs(difference);

    if (totalRentalCostEl) totalRentalCostEl.textContent = formatCurrency(totalRentalCost);
    if (totalBuyCostEl) totalBuyCostEl.textContent = formatCurrency(buyPrice);
    if (breakEvenDaysEl) breakEvenDaysEl.textContent = `${breakEvenDays} Days`;
    if (savingsAmountEl) savingsAmountEl.textContent = formatCurrency(savings);

    // Determine recommendation
    let recommendation = 'RENT';
    let badgeClass = 'badge-rent';
    let title = 'Smart Choice: RENT THIS PRODUCT';
    let desc = `You will save ${formatCurrency(savings)} by renting for ${durationDays} days instead of paying full retail ownership costs upfront.`;
    let meterPercent = 30;

    if (totalRentalCost >= buyPrice) {
      recommendation = 'BUY';
      badgeClass = 'badge-sell';
      title = 'Smart Choice: BUY PERMANENTLY';
      desc = `Renting for ${durationDays} days costs ${formatCurrency(totalRentalCost)}, which exceeds the buying price (${formatCurrency(buyPrice)}). Buying outright saves you ${formatCurrency(savings)}.`;
      meterPercent = 90;
    } else if (durationDays >= breakEvenDays * 0.65) {
      recommendation = 'TRY BEFORE YOU BUY';
      badgeClass = 'badge-try';
      title = 'Smart Choice: TRY BEFORE YOU BUY';
      desc = `You are near the break-even threshold (${breakEvenDays} days). Start with a rental test run on Rentora, and convert 100% of your rental payment towards owning it!`;
      meterPercent = 65;
    }

    if (recommendationBadgeEl) {
      recommendationBadgeEl.className = `badge ${badgeClass}`;
      recommendationBadgeEl.innerHTML = `<i class="fas fa-check-circle"></i> ${recommendation}`;
    }
    if (recommendationTitleEl) recommendationTitleEl.textContent = title;
    if (recommendationDescEl) recommendationDescEl.textContent = desc;

    if (meterFillEl) {
      meterFillEl.style.width = `${meterPercent}%`;
      if (recommendation === 'BUY') {
        meterFillEl.style.background = 'var(--gradient-accent)';
      } else if (recommendation === 'RENT') {
        meterFillEl.style.background = 'var(--gradient-primary)';
      } else {
        meterFillEl.style.background = 'linear-gradient(90deg, #6366f1, #ec4899)';
      }
    }

    updateChart(buyPrice, rentPricePerDay);
  }

  // Sync inputs & sliders
  function bindInputSlider(inputEl, sliderEl) {
    if (!inputEl || !sliderEl) return;
    inputEl.addEventListener('input', () => {
      sliderEl.value = inputEl.value;
      calculateRentVsBuy();
    });
    sliderEl.addEventListener('input', () => {
      inputEl.value = sliderEl.value;
      calculateRentVsBuy();
    });
  }

  bindInputSlider(buyPriceInput, buyPriceSlider);
  bindInputSlider(rentPriceInput, rentPriceSlider);
  bindInputSlider(durationInput, durationSlider);

  // Preset Buttons
  document.querySelectorAll('.calc-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calc-preset-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const buy = btn.dataset.buy;
      const rent = btn.dataset.rent;
      const days = btn.dataset.days;

      if (buyPriceInput) buyPriceInput.value = buy;
      if (buyPriceSlider) buyPriceSlider.value = buy;
      if (rentPriceInput) rentPriceInput.value = rent;
      if (rentPriceSlider) rentPriceSlider.value = rent;
      if (durationInput) durationInput.value = days;
      if (durationSlider) durationSlider.value = days;

      calculateRentVsBuy();
    });
  });

  // Chart.js Visualization
  function updateChart(buyPrice, rentPricePerDay) {
    const canvas = document.getElementById('calc-comparison-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const daysAxis = [1, 7, 14, 21, 30, 45, 60, 90, 120];
    const rentalCurve = daysAxis.map((d) => {
      let cost = rentPricePerDay * d;
      if (d >= 30) cost = Math.round(cost * 0.7);
      else if (d >= 7) cost = Math.round(cost * 0.85);
      return cost;
    });
    const buyFlatline = daysAxis.map(() => buyPrice);

    if (comparisonChart) {
      comparisonChart.data.datasets[0].data = rentalCurve;
      comparisonChart.data.datasets[1].data = buyFlatline;
      comparisonChart.update();
      return;
    }

    const ctx = canvas.getContext('2d');
    comparisonChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: daysAxis.map((d) => `${d}d`),
        datasets: [
          {
            label: 'Cumulative Rental Cost',
            data: rentalCurve,
            borderColor: '#06B6D4',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Flat Buy Price',
            data: buyFlatline,
            borderColor: '#EC4899',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 6],
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#94A3B8',
              font: { family: 'Plus Jakarta Sans', weight: '600' },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#64748B' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
          },
          y: {
            ticks: {
              color: '#64748B',
              callback: (value) => '₹' + value.toLocaleString('en-IN'),
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
          },
        },
      },
    });
  }

  // Pre-fill from query params if opened from a product details page
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('buy')) {
    const buyParam = urlParams.get('buy');
    if (buyPriceInput) buyPriceInput.value = buyParam;
    if (buyPriceSlider) buyPriceSlider.value = buyParam;
  }
  if (urlParams.get('rent')) {
    const rentParam = urlParams.get('rent');
    if (rentPriceInput) rentPriceInput.value = rentParam;
    if (rentPriceSlider) rentPriceSlider.value = rentParam;
  }

  // Initial calculation
  calculateRentVsBuy();
});
