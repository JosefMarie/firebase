// Firebase Usage & Billing Dynamic Engine with Per-Month Customization & Global Rate Synchronization

document.addEventListener('DOMContentLoaded', () => {

  // Helper number formatters
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toString();
  }

  function formatCurrency(val) {
    return '$' + (Number(val) || 0).toFixed(2);
  }

  // Quotas definition for Firebase Blaze Plan
  const quotas = {
    invocations: 2000000,
    writesPerDay: 20000,
    readsPerDay: 50000,
    deletesPerDay: 20000,
    hostingStorageGB: 10,
    hostingDownloadsMBPerDay: 360,
  };

  // Global Unit Rates ($)
  const globalRates = {
    rateInvocations: 0.40,      // $ per 1M
    rateWrites: 0.18,           // $ per 100K
    rateReads: 0.06,            // $ per 100K
    rateDeletes: 0.02,          // $ per 100K
    rateHostingStorage: 0.026,  // $ per GB
    rateHostingDownloads: 0.15, // $ per GB
  };

  const DAY_SHORTS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Weighted multiplier: Monday, Tuesday, Wednesday, Thursday have the highest usage
  function getWeekdayFactor(dayOfWeek) {
    switch (dayOfWeek) {
      case 1: return 1.45; // Monday (Peak business day)
      case 2: return 1.55; // Tuesday (Peak business day)
      case 3: return 1.50; // Wednesday (Peak business day)
      case 4: return 1.40; // Thursday (Peak business day)
      case 5: return 0.95; // Friday (Moderate)
      case 6: return 0.42; // Saturday (Low weekend)
      case 0: return 0.38; // Sunday (Low weekend)
      default: return 1.0;
    }
  }

  // Get current active day of month dynamically from live date
  function getLiveAugustCurrentDay() {
    const now = new Date();
    // If testing in August 2026, use real current day; default to 27 or real day
    if (now.getFullYear() === 2026 && now.getMonth() === 7) {
      return Math.min(31, now.getDate());
    }
    return 27; // Baseline test date
  }

  // Generate deterministic daily log for June 2026 (30 days, 21 Users)
  function generateJuneDailyData(userCount = 21, baseInvocations = 85000) {
    const daily = [];
    const daysInMonth = 30;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(2026, 5, day); // Month 5 = June
      const dow = dateObj.getDay();
      const dowName = DAY_SHORTS[dow];
      const weekdayFactor = getWeekdayFactor(dow);
      const naturalVariance = 0.96 + ((day * 7 + 3) % 9) * 0.01;
      const weight = weekdayFactor * naturalVariance;

      const activeUsers = Math.max(1, Math.round(userCount * (0.65 + weight * 0.25)));
      const invRatio = baseInvocations / 85000;
      const invocations = Math.round(2833 * weight * invRatio);
      const reads = Math.round(12400 * weight);
      const writes = Math.round(3100 * weight);
      const deletes = Math.round(150 * weight);
      const downloadsMB = parseFloat((14.2 * weight).toFixed(1));

      daily.push({
        monthKey: '2026-06',
        monthName: 'June',
        day: day,
        dayOfWeek: dow,
        dayOfWeekName: dowName,
        dateFormatted: `${dowName}, Jun ${day < 10 ? '0' + day : day}, 2026`,
        activeUsers,
        invocations,
        reads,
        writes,
        deletes,
        downloadsMB,
        storageGB: 4.5,
        weight,
        cost: 0,
        highlight: null
      });
    }
    return daily;
  }

  // Generate deterministic daily log for July 2026 (31 days, 34 Users - Peak User Month)
  function generateJulyDailyData(userCount = 34, baseInvocations = 201500) {
    const daily = [];
    const daysInMonth = 31;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(2026, 6, day); // Month 6 = July
      const dow = dateObj.getDay();
      const dowName = DAY_SHORTS[dow];
      const weekdayFactor = getWeekdayFactor(dow);
      const naturalVariance = 0.96 + ((day * 11 + 5) % 9) * 0.01;
      let weight = weekdayFactor * naturalVariance;

      let highlight = null;
      if (day === 15) {
        weight *= 1.35;
        highlight = 'Peak User Influx (34 Users)';
      }

      const activeUsers = Math.max(1, Math.round(userCount * (0.68 + weight * 0.24)));
      const invRatio = baseInvocations / 201500;
      const invocations = Math.round(6500 * weight * invRatio);
      const reads = Math.round(18500 * weight);
      const writes = Math.round(4200 * weight);
      const deletes = Math.round(210 * weight);
      const downloadsMB = parseFloat((18.4 * weight).toFixed(1));

      daily.push({
        monthKey: '2026-07',
        monthName: 'July',
        day: day,
        dayOfWeek: dow,
        dayOfWeekName: dowName,
        dateFormatted: `${dowName}, Jul ${day < 10 ? '0' + day : day}, 2026`,
        activeUsers,
        invocations,
        reads,
        writes,
        deletes,
        downloadsMB,
        storageGB: 5.8,
        weight,
        cost: 0,
        highlight
      });
    }
    return daily;
  }

  // Generate deterministic daily log for August 2026 (31 days, 28 Users - High Usage Surge on Aug 11)
  function generateAugustDailyData(userCount = 28, baseInvocations = 2450000) {
    const daily = [];
    const daysInMonth = 31;
    const currentDay = getLiveAugustCurrentDay();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(2026, 7, day); // Month 7 = August
      const dow = dateObj.getDay();
      const dowName = DAY_SHORTS[dow];
      const weekdayFactor = getWeekdayFactor(dow);
      const naturalVariance = 0.96 + ((day * 13 + 7) % 9) * 0.01;
      let weight = weekdayFactor * naturalVariance;

      const isPastOrToday = day <= currentDay;
      const isAug11 = (day === 11);

      let activeUsers = Math.max(1, Math.round(userCount * (0.65 + weight * 0.25)));
      let invocations = Math.round(79000 * weight * (baseInvocations / 2450000));
      let reads = Math.round(68000 * weight);
      let writes = Math.round(22500 * weight);
      let deletes = Math.round(450 * weight);
      let downloadsMB = parseFloat((380.0 * weight * 0.4).toFixed(1));
      let highlight = null;

      // Major surge: August 11 Peak Spike Event (Balanced so it remains the peak day without exceeding $6.00)
      if (isAug11) {
        weight = 3.6;
        activeUsers = userCount;
        invocations = Math.round(baseInvocations * 0.14); // ~343,000 invocations
        reads = 128500;
        writes = 42800;
        deletes = 850;
        downloadsMB = 1450.0;
        highlight = 'Peak Usage Surge (Aug 11)';
      } else if (day === currentDay) {
        highlight = `Current Date (Aug ${day})`;
      }

      if (!isPastOrToday) {
        invocations = 0;
        reads = 0;
        writes = 0;
        deletes = 0;
        downloadsMB = 0;
        activeUsers = 0;
      }

      daily.push({
        monthKey: '2026-08',
        monthName: 'August',
        day: day,
        dayOfWeek: dow,
        dayOfWeekName: dowName,
        dateFormatted: `${dowName}, Aug ${day < 10 ? '0' + day : day}, 2026`,
        activeUsers: Math.max(0, activeUsers),
        invocations,
        reads,
        writes,
        deletes,
        downloadsMB,
        storageGB: 6.2,
        weight,
        cost: 0,
        highlight,
        isToday: (day === currentDay)
      });
    }
    return daily;
  }

  // Reactive Month Profiles Store
  const monthProfiles = {
    '2026-08': {
      name: 'August 2026',
      shortName: 'Aug',
      isCurrent: true,
      users: 28,
      statusBadge: 'Current Month · 28 Users · Aug 11 Spike',
      invoiceId: '5652490837',
      statementDate: 'August 27, 2026',
      billingPeriod: 'August 2026 (Aug 1, 2026 – Aug 27, 2026)',
      daysInMonth: 31,
      currentDay: 27,
      invocations: 2450000,
      writesPerDay: 22500,
      readsPerDay: 68000,
      deletesPerDay: 450,
      hostingStorageGB: 6.2,
      hostingDownloadsMBPerDay: 380.0,
      rates: { ...globalRates },
      calculatedCost: 28.60,
      dailyData: []
    },
    '2026-07': {
      name: 'July 2026',
      shortName: 'Jul',
      isCurrent: false,
      users: 34,
      statusBadge: 'Peak Users · 34 Active Users',
      invoiceId: '5652490836',
      statementDate: 'July 31, 2026',
      billingPeriod: 'July 2026 (Jul 1, 2026 – Jul 31, 2026)',
      daysInMonth: 31,
      currentDay: 31,
      invocations: 201500,
      writesPerDay: 4200,
      readsPerDay: 18500,
      deletesPerDay: 210,
      hostingStorageGB: 5.8,
      hostingDownloadsMBPerDay: 18.4,
      rates: { ...globalRates },
      calculatedCost: 16.42,
      dailyData: []
    },
    '2026-06': {
      name: 'June 2026',
      shortName: 'Jun',
      isCurrent: false,
      users: 21,
      statusBadge: 'Baseline · 21 Active Users',
      invoiceId: '5652490835',
      statementDate: 'June 30, 2026',
      billingPeriod: 'June 2026 (Jun 1, 2026 – Jun 30, 2026)',
      daysInMonth: 30,
      currentDay: 30,
      invocations: 85000,
      writesPerDay: 3100,
      readsPerDay: 12400,
      deletesPerDay: 150,
      hostingStorageGB: 4.5,
      hostingDownloadsMBPerDay: 14.2,
      rates: { ...globalRates },
      calculatedCost: 4.85,
      dailyData: []
    }
  };

  // Generate initial daily datasets
  monthProfiles['2026-06'].dailyData = generateJuneDailyData(21, 85000);
  monthProfiles['2026-07'].dailyData = generateJulyDailyData(34, 201500);
  monthProfiles['2026-08'].dailyData = generateAugustDailyData(28, 2450000);

  // Global Interactive State
  const state = {
    selectedMonthKey: '2026-08',
    drawerTargetMonthKey: '2026-08',
    syncAllRates: true,
    currentTableFilter: '2026-08',
    invoiceView: '3month',
    expandedMetricKey: null,
    costCardExpanded: false
  };

  // Calculation Engine: Computes detailed metrics and cost for any month
  function computeMonthMetrics(monthKey) {
    const profile = monthProfiles[monthKey];
    if (!profile) return { totalCost: 0, invocations: {}, firestore: {}, writes: {}, reads: {}, deletes: {}, hosting: {}, hostingStorage: {}, hostingDownloads: {}, storage: {} };

    const activeRates = state.syncAllRates ? globalRates : profile.rates;

    // 1. Invocations
    const invocationsCostRaw = Math.max(0, profile.invocations - quotas.invocations) / 1000000 * activeRates.rateInvocations;
    const invocationsPercent = ((profile.invocations / quotas.invocations) * 100).toFixed(1);

    // 2. Writes
    const excessWritesDaily = Math.max(0, profile.writesPerDay - quotas.writesPerDay);
    const writesCostRaw = (excessWritesDaily * 30) / 100000 * activeRates.rateWrites;
    const writesPercent = ((profile.writesPerDay / quotas.writesPerDay) * 100).toFixed(1);

    // 3. Reads
    const excessReadsDaily = Math.max(0, profile.readsPerDay - quotas.readsPerDay);
    const readsCostRaw = (excessReadsDaily * 30) / 100000 * activeRates.rateReads;
    const readsPercent = ((profile.readsPerDay / quotas.readsPerDay) * 100).toFixed(1);

    // 4. Deletes
    const excessDeletesDaily = Math.max(0, profile.deletesPerDay - quotas.deletesPerDay);
    const deletesCostRaw = (excessDeletesDaily * 30) / 100000 * activeRates.rateDeletes;
    const deletesPercent = ((profile.deletesPerDay / quotas.deletesPerDay) * 100).toFixed(1);

    const firestoreCostRaw = writesCostRaw + readsCostRaw + deletesCostRaw;

    // 5. Hosting Storage
    const excessHostingStorage = Math.max(0, profile.hostingStorageGB - quotas.hostingStorageGB);
    const hostingStorageCostRaw = excessHostingStorage * activeRates.rateHostingStorage;
    const hostingStoragePercent = ((profile.hostingStorageGB / quotas.hostingStorageGB) * 100).toFixed(1);

    // 6. Hosting Downloads
    const monthlyDownloadsGB = (profile.hostingDownloadsMBPerDay * 30) / 1024;
    const freeMonthlyDownloadsGB = (quotas.hostingDownloadsMBPerDay * 30) / 1024;
    const excessDownloadsGB = Math.max(0, monthlyDownloadsGB - freeMonthlyDownloadsGB);
    const hostingDownloadsCostRaw = excessDownloadsGB * activeRates.rateHostingDownloads;
    const hostingDownloadsPercent = ((profile.hostingDownloadsMBPerDay / quotas.hostingDownloadsMBPerDay) * 100).toFixed(1);

    const hostingCostRaw = hostingStorageCostRaw + hostingDownloadsCostRaw;
    const storageCostRaw = 0.00;

    // Total Cost
    let totalCost = invocationsCostRaw + firestoreCostRaw + hostingCostRaw + storageCostRaw;
    
    // Baseline minimum cost if there is measurable traffic
    if (totalCost === 0 && profile.invocations > 0) {
      totalCost = 0.01;
    }

    profile.calculatedCost = parseFloat(totalCost.toFixed(2));

    // Recompute daily data costs with weekday weighting and exact sum reconciliation
    if (profile.dailyData && profile.dailyData.length > 0) {
      let rawSum = 0;
      const activeDays = profile.dailyData.filter(d => d.day <= profile.currentDay);

      activeDays.forEach(d => {
        const dayInvCost = (d.invocations / profile.daysInMonth) / 1000000 * activeRates.rateInvocations;
        const excessReads = Math.max(0, d.reads - quotas.readsPerDay);
        const dayReadCost = (excessReads / 100000) * activeRates.rateReads;
        const excessWrites = Math.max(0, d.writes - quotas.writesPerDay);
        const dayWriteCost = (excessWrites / 100000) * activeRates.rateWrites;
        const excessDlGB = Math.max(0, (d.downloadsMB - quotas.hostingDownloadsMBPerDay) / 1024);
        const dayDlCost = excessDlGB * activeRates.rateHostingDownloads;
        
        // Proportional score combining weekday weight, invocations, and storage excess
        d.rawScore = (d.weight || 1.0) * (1 + (dayInvCost + dayReadCost + dayWriteCost + dayDlCost) * 10);
        rawSum += d.rawScore;
      });

      if (totalCost > 0 && rawSum > 0) {
        // Enforce constraint: August 11 must NOT exceed $6.00 (e.g. capped at ~$5.80 max)
        const aug11Day = activeDays.find(d => d.monthKey === '2026-08' && d.day === 11);
        let aug11CappedCost = null;
        if (aug11Day) {
          const rawAug11 = (aug11Day.rawScore / rawSum) * totalCost;
          if (rawAug11 > 5.80) {
            aug11CappedCost = Math.min(5.80, totalCost * 0.20);
          }
        }

        if (aug11CappedCost !== null && aug11Day) {
          const remainingCost = totalCost - aug11CappedCost;
          const otherDays = activeDays.filter(d => !(d.monthKey === '2026-08' && d.day === 11));
          const otherRawSum = otherDays.reduce((acc, d) => acc + d.rawScore, 0);

          aug11Day.cost = parseFloat(aug11CappedCost.toFixed(2));
          let runningSum = aug11Day.cost;

          otherDays.forEach((d, idx) => {
            if (idx === otherDays.length - 1) {
              d.cost = Math.max(0.01, parseFloat((totalCost - runningSum).toFixed(2)));
            } else {
              const calculated = parseFloat(((d.rawScore / otherRawSum) * remainingCost).toFixed(2));
              d.cost = Math.max(0.01, calculated);
              runningSum += d.cost;
            }
          });
        } else {
          let runningSum = 0;
          activeDays.forEach((d, idx) => {
            if (idx === activeDays.length - 1) {
              d.cost = Math.max(0.01, parseFloat((totalCost - runningSum).toFixed(2)));
            } else {
              const calculated = parseFloat(((d.rawScore / rawSum) * totalCost).toFixed(2));
              d.cost = Math.max(0.01, calculated);
              runningSum += d.cost;
            }
          });
        }
      } else {
        activeDays.forEach(d => { d.cost = 0; });
      }

      // Inactive future days
      profile.dailyData.filter(d => d.day > profile.currentDay).forEach(d => {
        d.cost = 0;
      });
    }

    return {
      invocations: { cost: invocationsCostRaw, percent: invocationsPercent, val: profile.invocations },
      firestore: { cost: firestoreCostRaw },
      writes: { cost: writesCostRaw, percent: writesPercent, val: profile.writesPerDay },
      reads: { cost: readsCostRaw, percent: readsPercent, val: profile.readsPerDay },
      deletes: { cost: deletesCostRaw, percent: deletesPercent, val: profile.deletesPerDay },
      hosting: { cost: hostingCostRaw },
      hostingStorage: { cost: hostingStorageCostRaw, percent: hostingStoragePercent, val: profile.hostingStorageGB },
      hostingDownloads: { cost: hostingDownloadsCostRaw, percent: hostingDownloadsPercent, val: profile.hostingDownloadsMBPerDay },
      storage: { cost: storageCostRaw },
      totalCost: totalCost
    };
  }

  // Recalculate all months and update whole dashboard
  function recalculateAll() {
    ['2026-06', '2026-07', '2026-08'].forEach(key => {
      computeMonthMetrics(key);
    });

    const juneCost = monthProfiles['2026-06'].calculatedCost;
    const julyCost = monthProfiles['2026-07'].calculatedCost;
    const augustCost = monthProfiles['2026-08'].calculatedCost;
    const threeMonthTotal = juneCost + julyCost + augustCost;

    // Update 3-Month Banner values
    const cardCostJune = document.getElementById('card-cost-june');
    const cardCostJuly = document.getElementById('card-cost-july');
    const cardCostAugust = document.getElementById('card-cost-august');
    const combinedCostElem = document.getElementById('three-month-combined-cost');

    if (cardCostJune) cardCostJune.textContent = formatCurrency(juneCost);
    if (cardCostJuly) cardCostJuly.textContent = formatCurrency(julyCost);
    if (cardCostAugust) cardCostAugust.textContent = formatCurrency(augustCost);
    if (combinedCostElem) combinedCostElem.textContent = formatCurrency(threeMonthTotal);

    // Update Drawer live preview
    const drawerPreviewMonthLabel = document.getElementById('drawer-preview-month-label');
    const drawerPreviewMonthVal = document.getElementById('drawer-preview-month-val');
    const drawerPreview3mVal = document.getElementById('drawer-preview-3m-val');

    const drawerProf = monthProfiles[state.drawerTargetMonthKey] || monthProfiles['2026-08'];
    if (drawerPreviewMonthLabel) drawerPreviewMonthLabel.textContent = `${drawerProf.name} Cost:`;
    if (drawerPreviewMonthVal) drawerPreviewMonthVal.textContent = formatCurrency(drawerProf.calculatedCost);
    if (drawerPreview3mVal) drawerPreview3mVal.textContent = formatCurrency(threeMonthTotal);

    // Render Daily Breakdown table
    renderDailyBreakdownTable();

    // Render UI for active dashboard month
    updateUI();

    // If invoice modal is open, update invoice content
    if (invoiceModal.classList.contains('active')) {
      renderInvoiceModalContent();
    }
  }

  // DOM Element References
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const displayTotalCost = document.getElementById('display-total-cost');
  const drawerModal = document.getElementById('drawer-modal');
  const btnOpenDrawer = document.getElementById('btn-open-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerResetBtn = document.getElementById('drawer-reset-btn');
  const drawerApplyBtn = document.getElementById('drawer-apply-btn');

  const drawerBtnAug = document.getElementById('drawer-btn-aug');
  const drawerBtnJul = document.getElementById('drawer-btn-jul');
  const drawerBtnJun = document.getElementById('drawer-btn-jun');
  const chkSyncAllRates = document.getElementById('chk-sync-all-rates');
  const inputUsers = document.getElementById('input-users');
  const sliderUsersVal = document.getElementById('slider-users-val');

  const invoiceModal = document.getElementById('invoice-modal');
  const btnPrintStatement = document.getElementById('btn-print-statement');
  const btnQuickExport = document.getElementById('btn-quick-export');
  const invoiceCloseBtn = document.getElementById('invoice-close-btn');
  const invoiceTriggerPrint = document.getElementById('invoice-trigger-print');
  const invoiceExportCsv = document.getElementById('invoice-export-csv');
  const invoiceDynamicContainer = document.getElementById('invoice-dynamic-container');

  const btnView3Month = document.getElementById('btn-view-3month');
  const btnViewSingle = document.getElementById('btn-view-single');
  const btnViewDaily = document.getElementById('btn-view-daily');

  const costSummaryCard = document.getElementById('cost-summary-card');
  const costHeaderRow = document.getElementById('cost-header-row');
  const costExpandedTotal = document.getElementById('cost-expanded-total');
  const costSvgGraph = document.getElementById('cost-svg-graph');
  const costHoverTooltip = document.getElementById('cost-hover-tooltip');

  const legendCostFunctions = document.getElementById('legend-cost-functions');
  const legendCostFirestore = document.getElementById('legend-cost-firestore');
  const legendCostHosting = document.getElementById('legend-cost-hosting');
  const legendCostStorage = document.getElementById('legend-cost-storage');

  const chkFunctions = document.getElementById('chk-functions');
  const chkFirestore = document.getElementById('chk-firestore');
  const chkHosting = document.getElementById('chk-hosting');
  const chkStorage = document.getElementById('chk-storage');

  const inputInvocations = document.getElementById('input-invocations');
  const sliderInvocationsVal = document.getElementById('slider-invocations-val');
  const rateInvocationsInput = document.getElementById('rate-invocations');

  const inputWrites = document.getElementById('input-writes');
  const sliderWritesVal = document.getElementById('slider-writes-val');
  const rateWritesInput = document.getElementById('rate-writes');

  const inputReads = document.getElementById('input-reads');
  const sliderReadsVal = document.getElementById('slider-reads-val');
  const rateReadsInput = document.getElementById('rate-reads');

  const inputDeletes = document.getElementById('input-deletes');
  const sliderDeletesVal = document.getElementById('slider-deletes-val');
  const rateDeletesInput = document.getElementById('rate-deletes');

  const inputHostingStorage = document.getElementById('input-hosting-storage');
  const sliderHostingStorageVal = document.getElementById('slider-hosting-storage-val');
  const rateHostingStorageInput = document.getElementById('rate-hosting-storage');

  const inputHostingDownloads = document.getElementById('input-hosting-downloads');
  const sliderHostingDownloadsVal = document.getElementById('slider-hosting-downloads-val');
  const rateHostingDownloadsInput = document.getElementById('rate-hosting-downloads');

  const presetChips = document.querySelectorAll('.preset-chip');

  const dailyTableBody = document.getElementById('daily-table-body');
  const filterAugBtn = document.getElementById('filter-aug');
  const filterJulBtn = document.getElementById('filter-jul');
  const filterJunBtn = document.getElementById('filter-jun');
  const filterAllBtn = document.getElementById('filter-all');
  const btnExportCsv = document.getElementById('btn-export-csv');

  // Shared Inline Accordion Panel
  const inlinePanel = document.createElement('div');
  inlinePanel.className = 'inline-accordion-panel';
  inlinePanel.innerHTML = `
    <div class="inline-panel-inner">
      <div class="graph-modal-header">
        <h3 class="graph-modal-title" id="accordion-product-title">Cloud Firestore</h3>
        <button class="graph-modal-close" id="accordion-close-btn">&times;</button>
      </div>

      <div class="graph-stats-row">
        <div class="graph-stat-item">
          <div class="graph-stat-label">
            <span class="stat-legend-pill"></span>
            <span id="accordion-metric-name">Reads (today)</span>
          </div>
          <div class="graph-stat-value" id="accordion-today-val">14K</div>
        </div>

        <div class="graph-stat-item">
          <div class="graph-stat-label">
            <span style="color: var(--text-muted);" id="accordion-accumulated-label">Reads (month total)</span>
          </div>
          <div class="graph-stat-value" id="accordion-accumulated-val" style="font-size: 22px; color: var(--text-secondary);">168K</div>
        </div>

        <div class="graph-quota-right">
          <div class="graph-quota-label">No-cost quota</div>
          <div class="graph-quota-val" id="accordion-quota-val">50K / day</div>
        </div>
      </div>

      <div class="graph-chart-wrapper">
        <div class="graph-grid-lines">
          <div class="grid-line"><span class="grid-y-tick" id="acc-y-max">40k</span></div>
          <div class="grid-line"><span class="grid-y-tick" id="acc-y-mid2">30k</span></div>
          <div class="grid-line"><span class="grid-y-tick" id="acc-y-mid1">20k</span></div>
          <div class="grid-line"><span class="grid-y-tick" id="acc-y-min">10k</span></div>
          <div class="grid-line"><span class="grid-y-tick">0</span></div>
        </div>

        <div class="graph-bars-area" id="accordion-bars-area"></div>
        <div class="graph-x-labels" id="accordion-x-labels"></div>
      </div>

      <div class="graph-modal-footer">
        <div class="legend-checkbox">
          <input type="checkbox" checked disabled id="acc-legend-check">
          <label for="acc-legend-check" id="accordion-legend-label">Reads (no-cost tier)</label>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline" style="padding: 6px 14px; font-size: 12px;">See pricing ↗</button>
          <button class="btn btn-primary" id="btn-acc-daily-view" style="padding: 6px 14px; font-size: 12px;">View Daily Table</button>
        </div>
      </div>
    </div>
  `;

  inlinePanel.querySelector('#accordion-close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    collapseAccordion();
  });

  inlinePanel.querySelector('#btn-acc-daily-view').addEventListener('click', () => {
    switchTab('tab-daily');
  });

  // Switch Dashboard Month
  function selectMonth(monthKey) {
    state.selectedMonthKey = monthKey;
    const profile = monthProfiles[state.selectedMonthKey] || monthProfiles['2026-08'];

    // Sync banner active card highlight
    document.querySelectorAll('.month-stat-card').forEach(c => c.classList.remove('active-card'));
    if (monthKey === '2026-06') document.getElementById('card-month-june')?.classList.add('active-card');
    if (monthKey === '2026-07') document.getElementById('card-month-july')?.classList.add('active-card');
    if (monthKey === '2026-08') document.getElementById('card-month-august')?.classList.add('active-card');

    // Update Dropdown label
    const selectedMonthLabel = document.getElementById('selected-month-label');
    if (selectedMonthLabel) {
      selectedMonthLabel.textContent = `${profile.name} (${profile.users} Users)`;
    }

    // Set daily table filter
    state.currentTableFilter = monthKey;
    
    // Sync drawer target month if drawer is opened
    setDrawerMonth(monthKey);

    recalculateAll();
  }

  // Set Month Target inside Customize Drawer
  function setDrawerMonth(monthKey) {
    state.drawerTargetMonthKey = monthKey;
    const profile = monthProfiles[monthKey] || monthProfiles['2026-08'];
    const activeRates = state.syncAllRates ? globalRates : profile.rates;

    // Sync Drawer Buttons
    [drawerBtnAug, drawerBtnJul, drawerBtnJun].forEach(b => b?.classList.remove('active'));
    if (monthKey === '2026-08') drawerBtnAug?.classList.add('active');
    if (monthKey === '2026-07') drawerBtnJul?.classList.add('active');
    if (monthKey === '2026-06') drawerBtnJun?.classList.add('active');

    // Load Inputs
    if (inputUsers) { inputUsers.value = profile.users; sliderUsersVal.textContent = `${profile.users} Users`; }
    if (inputInvocations) { inputInvocations.value = profile.invocations; sliderInvocationsVal.textContent = profile.invocations.toLocaleString(); }
    if (inputWrites) { inputWrites.value = profile.writesPerDay; sliderWritesVal.textContent = profile.writesPerDay.toLocaleString(); }
    if (inputReads) { inputReads.value = profile.readsPerDay; sliderReadsVal.textContent = formatNumber(profile.readsPerDay); }
    if (inputDeletes) { inputDeletes.value = profile.deletesPerDay; sliderDeletesVal.textContent = profile.deletesPerDay.toLocaleString(); }
    if (inputHostingStorage) { inputHostingStorage.value = profile.hostingStorageGB; sliderHostingStorageVal.textContent = `${profile.hostingStorageGB} GB`; }
    if (inputHostingDownloads) { inputHostingDownloads.value = profile.hostingDownloadsMBPerDay; sliderHostingDownloadsVal.textContent = `${profile.hostingDownloadsMBPerDay} MB`; }

    // Load Rates
    if (rateInvocationsInput) rateInvocationsInput.value = activeRates.rateInvocations.toFixed(2);
    if (rateWritesInput) rateWritesInput.value = activeRates.rateWrites.toFixed(2);
    if (rateReadsInput) rateReadsInput.value = activeRates.rateReads.toFixed(2);
    if (rateDeletesInput) rateDeletesInput.value = activeRates.rateDeletes.toFixed(2);
    if (rateHostingStorageInput) rateHostingStorageInput.value = activeRates.rateHostingStorage.toFixed(3);
    if (rateHostingDownloadsInput) rateHostingDownloadsInput.value = activeRates.rateHostingDownloads.toFixed(2);

    recalculateAll();
  }

  drawerBtnAug?.addEventListener('click', () => setDrawerMonth('2026-08'));
  drawerBtnJul?.addEventListener('click', () => setDrawerMonth('2026-07'));
  drawerBtnJun?.addEventListener('click', () => setDrawerMonth('2026-06'));

  chkSyncAllRates?.addEventListener('change', (e) => {
    state.syncAllRates = e.target.checked;
    recalculateAll();
  });

  // Render Daily Breakdown Table
  function renderDailyBreakdownTable() {
    if (!dailyTableBody) return;
    dailyTableBody.innerHTML = '';

    let rowsToDisplay = [];
    if (state.currentTableFilter === 'all') {
      rowsToDisplay = [
        ...monthProfiles['2026-06'].dailyData,
        ...monthProfiles['2026-07'].dailyData,
        ...monthProfiles['2026-08'].dailyData
      ];
    } else {
      const prof = monthProfiles[state.currentTableFilter] || monthProfiles['2026-08'];
      rowsToDisplay = prof.dailyData || [];
    }

    [filterAugBtn, filterJulBtn, filterJunBtn, filterAllBtn].forEach(b => b?.classList.remove('active'));
    if (state.currentTableFilter === '2026-08') filterAugBtn?.classList.add('active');
    if (state.currentTableFilter === '2026-07') filterJulBtn?.classList.add('active');
    if (state.currentTableFilter === '2026-06') filterJunBtn?.classList.add('active');
    if (state.currentTableFilter === 'all') filterAllBtn?.classList.add('active');

    rowsToDisplay.forEach(item => {
      const tr = document.createElement('tr');
      if (item.highlight && item.highlight.includes('Spike')) tr.className = 'spike-row';
      if (item.isToday) tr.className = 'today-row';

      let statusHtml = '<span style="color: var(--text-muted);">Standard</span>';
      if (item.highlight) {
        if (item.highlight.includes('Spike')) {
          statusHtml = `<span class="pill-tag spike">${item.highlight}</span>`;
        } else if (item.highlight.includes('Current')) {
          statusHtml = `<span class="pill-tag current">${item.highlight}</span>`;
        } else if (item.highlight.includes('Peak User')) {
          statusHtml = `<span class="pill-tag users">${item.highlight}</span>`;
        }
      }

      tr.innerHTML = `
        <td><strong>${item.dateFormatted}</strong></td>
        <td>${statusHtml}</td>
        <td><span class="user-count-badge">${item.activeUsers > 0 ? item.activeUsers + ' users' : '–'}</span></td>
        <td>${item.invocations > 0 ? item.invocations.toLocaleString() : '–'}</td>
        <td>${item.reads > 0 ? item.reads.toLocaleString() : '–'}</td>
        <td>${item.writes > 0 ? item.writes.toLocaleString() : '–'}</td>
        <td>${item.downloadsMB > 0 ? item.downloadsMB.toFixed(1) + ' MB' : '–'}</td>
        <td style="text-align: right; font-weight: 600; color: ${item.cost > 5 ? '#ff8a65' : '#81c995'};">${formatCurrency(item.cost)}</td>
      `;
      dailyTableBody.appendChild(tr);
    });
  }

  // Filter button event listeners
  filterAugBtn?.addEventListener('click', () => { state.currentTableFilter = '2026-08'; renderDailyBreakdownTable(); });
  filterJulBtn?.addEventListener('click', () => { state.currentTableFilter = '2026-07'; renderDailyBreakdownTable(); });
  filterJunBtn?.addEventListener('click', () => { state.currentTableFilter = '2026-06'; renderDailyBreakdownTable(); });
  filterAllBtn?.addEventListener('click', () => { state.currentTableFilter = 'all'; renderDailyBreakdownTable(); });

  // Banner Stat Cards Click Events
  document.getElementById('card-month-june')?.addEventListener('click', () => selectMonth('2026-06'));
  document.getElementById('card-month-july')?.addEventListener('click', () => selectMonth('2026-07'));
  document.getElementById('card-month-august')?.addEventListener('click', () => selectMonth('2026-08'));

  // CSV Generator & Downloader
  function exportDailyCsv() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Month,Date,Status,Active_Users,Invocations,Firestore_Reads,Firestore_Writes,Firestore_Deletes,Hosting_Bandwidth_MB,Estimated_Daily_Cost_USD\n';

    const allData = [
      ...monthProfiles['2026-06'].dailyData,
      ...monthProfiles['2026-07'].dailyData,
      ...monthProfiles['2026-08'].dailyData
    ];

    allData.forEach(d => {
      const statusClean = (d.highlight || 'Normal').replace(/,/g, '');
      csvContent += `${d.monthName},${d.dateFormatted},${statusClean},${d.activeUsers},${d.invocations},${d.reads},${d.writes},${d.deletes},${d.downloadsMB},${d.cost}\n`;
    });

    const juneCost = monthProfiles['2026-06'].calculatedCost;
    const julyCost = monthProfiles['2026-07'].calculatedCost;
    const augustCost = monthProfiles['2026-08'].calculatedCost;
    const total3M = (juneCost + julyCost + augustCost).toFixed(2);

    csvContent += `\nSUMMARY TOTALS,June 2026 (${monthProfiles['2026-06'].users} Users),,,,,,,,${juneCost}\n`;
    csvContent += `SUMMARY TOTALS,July 2026 (${monthProfiles['2026-07'].users} Users),,,,,,,,${julyCost}\n`;
    csvContent += `SUMMARY TOTALS,August 2026 (${monthProfiles['2026-08'].users} Users - High Usage Aug 11 Spike),,,,,,,,${augustCost}\n`;
    csvContent += `3-MONTH COMBINED TOTAL (June + July + August),,,,,,,,${total3M}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Firebase_3Month_Usage_Billing_Report_Jun_Jul_Aug_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  btnExportCsv?.addEventListener('click', exportDailyCsv);
  invoiceExportCsv?.addEventListener('click', exportDailyCsv);

  // Switch tabs
  function switchTab(targetTabId) {
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${targetTabId}"]`);
    if (activeTabBtn) activeTabBtn.classList.add('active');
    const targetContent = document.getElementById(targetTabId);
    if (targetContent) targetContent.classList.add('active');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // Cumulative Cost Line Graph
  function renderCumulativeCostGraph() {
    const profile = monthProfiles[state.selectedMonthKey] || monthProfiles['2026-08'];
    const activeTotalCost = profile.calculatedCost || 28.60;
    const dailyItems = profile.dailyData && profile.dailyData.length > 0 ? profile.dailyData : monthProfiles['2026-08'].dailyData;

    if (legendCostFunctions) legendCostFunctions.textContent = formatCurrency(activeTotalCost * 0.45);
    if (legendCostFirestore) legendCostFirestore.textContent = formatCurrency(activeTotalCost * 0.35);
    if (legendCostHosting) legendCostHosting.textContent = formatCurrency(activeTotalCost * 0.20);
    if (legendCostStorage) legendCostStorage.textContent = '$0.00';

    if (costExpandedTotal) costExpandedTotal.textContent = formatCurrency(activeTotalCost);

    let maxYVal = Math.max(5.0, activeTotalCost * 1.25);
    document.getElementById('cost-y-max').textContent = formatCurrency(maxYVal);
    document.getElementById('cost-y-mid3').textContent = formatCurrency(maxYVal * 0.8);
    document.getElementById('cost-y-mid2').textContent = formatCurrency(maxYVal * 0.6);
    document.getElementById('cost-y-mid1').textContent = formatCurrency(maxYVal * 0.4);
    document.getElementById('cost-y-low').textContent = formatCurrency(maxYVal * 0.2);

    const width = 600;
    const height = 180;
    const padding = 12;
    const numDays = profile.daysInMonth;
    const currentDay = profile.currentDay;

    const dataPoints = [];
    let runningSum = 0;

    for (let day = 1; day <= numDays; day++) {
      const dayRecord = dailyItems[day - 1];
      if (day <= currentDay && dayRecord) {
        runningSum += (dayRecord.cost || 0);
      }
      const clampedSum = Math.min(activeTotalCost, runningSum);
      const x = padding + ((day - 1) / (numDays - 1)) * (width - 2 * padding);
      const y = (height - padding) - (clampedSum / maxYVal) * (height - 2 * padding);
      dataPoints.push({ day, x, y, accum: day <= currentDay ? clampedSum : 0, record: dayRecord });
    }

    let pathD = '';
    const activePoints = dataPoints.slice(0, currentDay);
    activePoints.forEach((pt, i) => {
      pathD += (i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`);
    });

    let svgHTML = `<path class="cost-line-path" d="${pathD}" />`;
    activePoints.forEach((pt, i) => {
      const isAug11 = (profile.shortName === 'Aug' && pt.day === 11);
      svgHTML += `<circle class="cost-data-dot ${isAug11 ? 'spike-dot' : ''}" cx="${pt.x}" cy="${pt.y}" r="${isAug11 ? '7' : '4.5'}" data-index="${i}" fill="${isAug11 ? '#ff7043' : '#8ab4f8'}" />`;
    });

    costSvgGraph.innerHTML = svgHTML;

    // Dot hover tooltip
    costSvgGraph.querySelectorAll('.cost-data-dot').forEach(dot => {
      dot.addEventListener('mouseenter', () => {
        const idx = parseInt(dot.getAttribute('data-index'));
        const pt = activePoints[idx];
        const rec = pt.record;

        document.getElementById('cost-tt-date').textContent = `${rec ? rec.dateFormatted : profile.shortName + ' ' + pt.day} ${rec?.highlight ? '(' + rec.highlight + ')' : ''}`;
        document.getElementById('cost-tt-service-val').textContent = formatCurrency(rec ? rec.cost : 0.50);
        document.getElementById('cost-tt-total-val').textContent = formatCurrency(pt.accum);

        const percentX = (pt.x / width) * 100;
        costHoverTooltip.style.left = `calc(${percentX}% - 110px)`;
        costHoverTooltip.classList.add('active');
      });

      dot.addEventListener('mouseleave', () => {
        costHoverTooltip.classList.remove('active');
      });
    });

    // X Axis Labels
    const xAxisContainer = document.getElementById('cost-x-axis');
    if (xAxisContainer) {
      xAxisContainer.innerHTML = `
        <span>${profile.shortName} 1</span>
        <span>${profile.shortName} 4</span>
        <span>${profile.shortName} 7</span>
        <span>${profile.shortName} 10</span>
        <span>${profile.shortName} 13</span>
        <span>${profile.shortName} 16</span>
        <span>${profile.shortName} 19</span>
        <span>${profile.shortName} 22</span>
        <span>${profile.shortName} 25</span>
        <span>${profile.shortName} 28</span>
        <span>${profile.shortName} ${profile.daysInMonth}</span>
      `;
    }
  }

  // Render Accordion Bars
  function renderAccordionContent(metricKey) {
    const profile = monthProfiles[state.selectedMonthKey] || monthProfiles['2026-08'];
    const dailyItems = profile.dailyData && profile.dailyData.length > 0 ? profile.dailyData : monthProfiles['2026-08'].dailyData;

    let title = 'Cloud Firestore';
    let metricName = 'Reads (daily)';
    let accumLabel = 'Reads (month total)';
    let legendLabel = 'Reads (50K free/day)';
    let quotaText = '50K / day';
    let unitSuffix = '';

    if (metricKey === 'reads') {
      title = 'Cloud Firestore';
      metricName = 'Reads (daily)';
      accumLabel = 'Reads (month total)';
      legendLabel = 'Reads (50K free/day)';
      quotaText = '50K / day';
    } else if (metricKey === 'writes') {
      title = 'Cloud Firestore';
      metricName = 'Writes (daily)';
      accumLabel = 'Writes (month total)';
      legendLabel = 'Writes (20K free/day)';
      quotaText = '20K / day';
    } else if (metricKey === 'deletes') {
      title = 'Cloud Firestore';
      metricName = 'Deletes (daily)';
      accumLabel = 'Deletes (month total)';
      legendLabel = 'Deletes (20K free/day)';
      quotaText = '20K / day';
    } else if (metricKey === 'invocations') {
      title = 'Cloud Functions';
      metricName = 'Invocations (daily)';
      accumLabel = 'Invocations (accumulated)';
      legendLabel = 'Invocations (2M free/mo)';
      quotaText = '2M / month';
    } else if (metricKey === 'hostingStorage') {
      title = 'Firebase Hosting';
      metricName = 'Storage (current)';
      accumLabel = 'Storage (allocated)';
      legendLabel = 'Hosting Storage (10GB free)';
      quotaText = '10 GB total';
      unitSuffix = ' GB';
    } else if (metricKey === 'hostingDownloads') {
      title = 'Firebase Hosting';
      metricName = 'Downloads (daily)';
      accumLabel = 'Bandwidth (accumulated)';
      legendLabel = 'Downloads (360MB free/day)';
      quotaText = '360 MB / day';
      unitSuffix = ' MB';
    }

    inlinePanel.querySelector('#accordion-product-title').textContent = title;
    inlinePanel.querySelector('#accordion-metric-name').textContent = metricName;
    inlinePanel.querySelector('#accordion-accumulated-label').textContent = accumLabel;
    inlinePanel.querySelector('#accordion-legend-label').textContent = legendLabel;
    inlinePanel.querySelector('#accordion-quota-val').textContent = quotaText;

    const dailyValues = [];
    for (let day = 1; day <= profile.daysInMonth; day++) {
      const rec = dailyItems[day - 1];
      if (day <= profile.currentDay && rec) {
        if (metricKey === 'reads') dailyValues.push(rec.reads);
        else if (metricKey === 'writes') dailyValues.push(rec.writes);
        else if (metricKey === 'deletes') dailyValues.push(rec.deletes);
        else if (metricKey === 'invocations') dailyValues.push(rec.invocations);
        else if (metricKey === 'hostingStorage') dailyValues.push(rec.storageGB);
        else if (metricKey === 'hostingDownloads') dailyValues.push(rec.downloadsMB);
        else dailyValues.push(rec.reads);
      } else {
        dailyValues.push(0);
      }
    }

    const todayAmount = dailyValues[profile.currentDay - 1] || 0;
    const monthAccumulated = dailyValues.reduce((a, b) => a + b, 0);

    inlinePanel.querySelector('#accordion-today-val').textContent = (unitSuffix ? todayAmount.toFixed(1) + unitSuffix : formatNumber(todayAmount));
    inlinePanel.querySelector('#accordion-accumulated-val').textContent = (unitSuffix ? monthAccumulated.toFixed(1) + unitSuffix : formatNumber(monthAccumulated));

    let maxValInChart = Math.max(...dailyValues, 100);
    inlinePanel.querySelector('#acc-y-max').textContent = unitSuffix ? (maxValInChart).toFixed(0) + unitSuffix : formatNumber(maxValInChart);
    inlinePanel.querySelector('#acc-y-mid2').textContent = unitSuffix ? (maxValInChart * 0.75).toFixed(0) + unitSuffix : formatNumber(maxValInChart * 0.75);
    inlinePanel.querySelector('#acc-y-mid1').textContent = unitSuffix ? (maxValInChart * 0.5).toFixed(0) + unitSuffix : formatNumber(maxValInChart * 0.5);
    inlinePanel.querySelector('#acc-y-min').textContent = unitSuffix ? (maxValInChart * 0.25).toFixed(0) + unitSuffix : formatNumber(maxValInChart * 0.25);

    const barsArea = inlinePanel.querySelector('#accordion-bars-area');
    barsArea.innerHTML = '';
    for (let day = 1; day <= profile.daysInMonth; day++) {
      const amt = dailyValues[day - 1];
      const percentHeight = Math.min(100, (amt / maxValInChart) * 100);
      const isAug11 = (profile.shortName === 'Aug' && day === 11);
      const isToday = profile.isCurrent && (day === profile.currentDay);

      const col = document.createElement('div');
      col.className = 'graph-bar-col' + (isToday ? ' today' : '') + (isAug11 ? ' spike' : '');

      const formattedVal = unitSuffix ? amt.toFixed(1) + unitSuffix : formatNumber(amt);
      col.innerHTML = `
        <div class="bar-tooltip">${profile.shortName} ${day}: ${formattedVal} ${isAug11 ? '🔥 Spike' : ''}</div>
        <div class="graph-bar-fill" style="height: ${percentHeight.toFixed(1)}%; background-color: ${isAug11 ? '#ff7043' : ''};"></div>
      `;
      barsArea.appendChild(col);
    }

    const xLabelsContainer = inlinePanel.querySelector('#accordion-x-labels');
    xLabelsContainer.innerHTML = `
      <span>${profile.shortName} 1</span>
      <span>${profile.shortName} 5</span>
      <span>${profile.shortName} 9</span>
      <span>${profile.shortName} 13</span>
      <span>${profile.shortName} 17</span>
      <span>${profile.shortName} 21</span>
      <span>${profile.shortName} 25</span>
      <span>${profile.shortName} ${profile.daysInMonth}</span>
    `;
  }

  function collapseAccordion() {
    inlinePanel.classList.remove('expanded');
    document.querySelectorAll('.metric-row').forEach(r => r.classList.remove('expanded-row'));
    state.expandedMetricKey = null;
    setTimeout(() => {
      if (!state.expandedMetricKey && inlinePanel.parentNode) {
        inlinePanel.parentNode.removeChild(inlinePanel);
      }
    }, 350);
  }

  function toggleAccordion(row, metricKey) {
    if (state.expandedMetricKey === metricKey) {
      collapseAccordion();
      return;
    }

    document.querySelectorAll('.metric-row').forEach(r => r.classList.remove('expanded-row'));
    row.parentNode.insertBefore(inlinePanel, row.nextSibling);
    row.classList.add('expanded-row');

    renderAccordionContent(metricKey);
    state.expandedMetricKey = metricKey;

    requestAnimationFrame(() => {
      inlinePanel.classList.add('expanded');
    });
  }

  function setupAccordionRows() {
    const rowMap = [
      { id: 'row-storage-bytes-desc', key: 'storageBytes' },
      { id: 'row-storage-bandwidth-desc', key: 'storageBandwidth' },
      { id: 'invocations-val-text', key: 'invocations' },
      { id: 'firestore-writes-val', key: 'writes' },
      { id: 'firestore-reads-val', key: 'reads' },
      { id: 'firestore-deletes-val', key: 'deletes' },
      { id: 'hosting-storage-val', key: 'hostingStorage' },
      { id: 'hosting-downloads-val', key: 'hostingDownloads' }
    ];

    rowMap.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        const row = el.closest('.metric-row');
        if (row) {
          row.classList.add('clickable');
          if (!row.querySelector('.row-chevron')) {
            const chevron = document.createElement('span');
            chevron.className = 'row-chevron';
            chevron.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17 16.59 8.59 18 10l-6 6-6-6z"/></svg>';
            row.appendChild(chevron);
          }
          row.addEventListener('click', () => toggleAccordion(row, item.key));
        }
      }
    });
  }

  function toggleCostCard() {
    state.costCardExpanded = !state.costCardExpanded;
    if (state.costCardExpanded) {
      costSummaryCard.classList.add('expanded');
      renderCumulativeCostGraph();
    } else {
      costSummaryCard.classList.remove('expanded');
    }
  }

  costHeaderRow?.addEventListener('click', toggleCostCard);

  [chkFunctions, chkFirestore, chkHosting, chkStorage].forEach(chk => {
    chk?.addEventListener('change', () => {
      if (state.costCardExpanded) renderCumulativeCostGraph();
    });
  });

  // Custom Month Dropdown in Header
  const monthDropdownContainer = document.getElementById('month-dropdown-container');
  const monthDropdownBtn = document.getElementById('month-dropdown-btn');
  const dropdownItems = document.querySelectorAll('#month-dropdown-menu .dropdown-item');

  monthDropdownBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    monthDropdownContainer.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (monthDropdownContainer && !monthDropdownContainer.contains(e.target)) {
      monthDropdownContainer.classList.remove('open');
    }
  });

  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      dropdownItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const val = item.getAttribute('data-value');
      monthDropdownContainer.classList.remove('open');
      selectMonth(val);
    });
  });

  // Invoice Modal Multi-View Render Logic
  function renderInvoiceModalContent() {
    const juneCost = monthProfiles['2026-06'].calculatedCost;
    const julyCost = monthProfiles['2026-07'].calculatedCost;
    const augustCost = monthProfiles['2026-08'].calculatedCost;
    const threeMonthTotal = juneCost + julyCost + augustCost;
    const activeRates = state.syncAllRates ? globalRates : monthProfiles['2026-08'].rates;

    const metaBox = document.getElementById('invoice-meta-box');
    const mainTitle = document.getElementById('invoice-main-title');

    [btnView3Month, btnViewSingle, btnViewDaily].forEach(b => b?.classList.remove('active'));
    if (state.invoiceView === '3month') btnView3Month?.classList.add('active');
    if (state.invoiceView === 'single') btnViewSingle?.classList.add('active');
    if (state.invoiceView === 'daily') btnViewDaily?.classList.add('active');

    if (state.invoiceView === '3month') {
      mainTitle.textContent = 'Google Cloud / Firebase 3-Month Consolidated Statement';
      metaBox.innerHTML = `
        <div><strong>Statement Date:</strong> August 27, 2026</div>
        <div><strong>Billing Period:</strong> June 1, 2026 – August 27, 2026 (3 Months)</div>
        <div><strong>Statement number:</strong> STMT-2026-Q3-3M-5652490836</div>
      `;

      invoiceDynamicContainer.innerHTML = `
        <h4 style="font-size: 13px; font-weight: 700; color: #202124; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">1. Month-by-Month Usage & Fee Summary</h4>
        <table class="invoice-table">
          <thead>
            <tr>
              <th style="width: 18%;">Billing Month</th>
              <th style="width: 25%;">Period Scope</th>
              <th style="width: 27%;">Activity & Highlights</th>
              <th style="width: 16%;">Monthly Invocations</th>
              <th style="width: 14%; text-align: right;">Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>June 2026</strong></td>
              <td>Jun 1, 2026 – Jun 30, 2026 (30 Days)</td>
              <td>Baseline traffic & standard operations</td>
              <td>${monthProfiles['2026-06'].invocations.toLocaleString()}</td>
              <td style="text-align: right; font-weight: 600; color: #202124;">${formatCurrency(juneCost)}</td>
            </tr>
            <tr>
              <td><strong>July 2026</strong></td>
              <td>Jul 1, 2026 – Jul 31, 2026 (31 Days)</td>
              <td>High throughput & elevated Firestore reads</td>
              <td>${monthProfiles['2026-07'].invocations.toLocaleString()}</td>
              <td style="text-align: right; font-weight: 600; color: #202124;">${formatCurrency(julyCost)}</td>
            </tr>
            <tr>
              <td><strong>August 2026 (Current)</strong></td>
              <td>Aug 1, 2026 – Aug 27, 2026 (Current Date)</td>
              <td>Peak usage surge (Aug 11 peak event)</td>
              <td>${monthProfiles['2026-08'].invocations.toLocaleString()}</td>
              <td style="text-align: right; font-weight: 600; color: #202124;">${formatCurrency(augustCost)}</td>
            </tr>
          </tbody>
        </table>

        <h4 style="font-size: 13px; font-weight: 700; color: #202124; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 16px; margin-bottom: 8px;">2. Cumulative Product Breakdown & Active Rates</h4>
        <table class="invoice-table">
          <thead>
            <tr>
              <th style="width: 28%;">Product / Service Component</th>
              <th style="width: 24%;">3-Month Total Volume</th>
              <th style="width: 20%;">Included Quota Threshold</th>
              <th style="width: 14%;">Unit Rate</th>
              <th style="width: 14%; text-align: right;">Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Cloud Functions (Invocations)</strong></td>
              <td>${(monthProfiles['2026-06'].invocations + monthProfiles['2026-07'].invocations + monthProfiles['2026-08'].invocations).toLocaleString()} Total Invocations</td>
              <td>2,000,000 / mo included</td>
              <td>$${activeRates.rateInvocations.toFixed(2)} / 1M</td>
              <td style="text-align: right; font-weight: 500; color: #202124;">${formatCurrency(threeMonthTotal * 0.35)}</td>
            </tr>
            <tr>
              <td><strong>Cloud Firestore (Reads & Writes)</strong></td>
              <td>Aggregated daily reads & writes</td>
              <td>50K reads / 20K writes daily</td>
              <td>$${activeRates.rateReads.toFixed(2)} / 100K reads · $${activeRates.rateWrites.toFixed(2)} / 100K writes</td>
              <td style="text-align: right; font-weight: 500; color: #202124;">${formatCurrency(threeMonthTotal * 0.45)}</td>
            </tr>
            <tr>
              <td><strong>Firebase Hosting (Storage & Bandwidth)</strong></td>
              <td>${monthProfiles['2026-08'].hostingStorageGB} GB storage · Daily bandwidth</td>
              <td>10 GB storage · 360 MB/day</td>
              <td>$${activeRates.rateHostingStorage.toFixed(3)}/GB · $${activeRates.rateHostingDownloads.toFixed(2)}/GB</td>
              <td style="text-align: right; font-weight: 500; color: #202124;">${formatCurrency(threeMonthTotal * 0.20)}</td>
            </tr>
          </tbody>
        </table>

        <div class="invoice-summary-box">
          <div class="summary-line">
            <span>June 2026:</span>
            <span>${formatCurrency(juneCost)}</span>
          </div>
          <div class="summary-line">
            <span>July 2026:</span>
            <span>${formatCurrency(julyCost)}</span>
          </div>
          <div class="summary-line">
            <span>August 2026:</span>
            <span>${formatCurrency(augustCost)}</span>
          </div>
          <div class="summary-line" style="border-top: 1px solid #dadce0; margin-top: 6px; padding-top: 6px;">
            <span>Subtotal in USD:</span>
            <span>${formatCurrency(threeMonthTotal)}</span>
          </div>
          <div class="summary-line">
            <span>VAT (0%):</span>
            <span>$0.00</span>
          </div>
          <div class="summary-line total">
            <span>Total in USD:</span>
            <span style="color: #202124;">${formatCurrency(threeMonthTotal)}</span>
          </div>
        </div>
      `;
    } else if (state.invoiceView === 'single') {
      const profile = monthProfiles[state.selectedMonthKey] || monthProfiles['2026-08'];
      mainTitle.textContent = `Google Cloud / Firebase Statement – ${profile.name}`;
      metaBox.innerHTML = `
        <div><strong>Statement Date:</strong> ${profile.statementDate}</div>
        <div><strong>Billing Period:</strong> ${profile.billingPeriod}</div>
        <div><strong>Invoice number:</strong> ${profile.invoiceId}</div>
      `;

      invoiceDynamicContainer.innerHTML = `
        <table class="invoice-table">
          <thead>
            <tr>
              <th style="width: 28%;">Description / Product Item</th>
              <th style="width: 22%;">Monthly Usage Volume</th>
              <th style="width: 18%;">Included Free Tier</th>
              <th style="width: 14%;">Billable Excess</th>
              <th style="width: 8%;">Unit Rate</th>
              <th style="width: 10%; text-align: right;">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Cloud Functions - Invocations</strong></td>
              <td>${profile.invocations.toLocaleString()} invocations</td>
              <td>2,000,000 / mo</td>
              <td>${Math.max(0, profile.invocations - quotas.invocations).toLocaleString()}</td>
              <td>$${activeRates.rateInvocations.toFixed(2)} / 1M</td>
              <td style="text-align: right; font-weight: 500; color: #202124;">${formatCurrency(Math.max(0, profile.invocations - quotas.invocations) / 1000000 * activeRates.rateInvocations)}</td>
            </tr>
            <tr>
              <td><strong>Cloud Firestore - Reads & Writes</strong></td>
              <td>${profile.readsPerDay.toLocaleString()} reads/day · ${profile.writesPerDay.toLocaleString()} writes/day</td>
              <td>50K reads / 20K writes daily</td>
              <td>Billed per day excess</td>
              <td>$${activeRates.rateReads.toFixed(2)} - $${activeRates.rateWrites.toFixed(2)} / 100K</td>
              <td style="text-align: right; font-weight: 500; color: #202124;">${formatCurrency(profile.calculatedCost * 0.65)}</td>
            </tr>
            <tr>
              <td><strong>Firebase Hosting - Storage & Bandwidth</strong></td>
              <td>${profile.hostingStorageGB} GB storage · ${profile.hostingDownloadsMBPerDay} MB/day</td>
              <td>10 GB storage · 360 MB/day</td>
              <td>Calculated bandwidth</td>
              <td>$${activeRates.rateHostingStorage.toFixed(3)}/GB · $${activeRates.rateHostingDownloads.toFixed(2)}/GB</td>
              <td style="text-align: right; font-weight: 500; color: #202124;">${formatCurrency(profile.calculatedCost * 0.35)}</td>
            </tr>
          </tbody>
        </table>

        <div class="invoice-summary-box">
          <div class="summary-line">
            <span>Subtotal in USD (${profile.shortName}):</span>
            <span>${formatCurrency(profile.calculatedCost)}</span>
          </div>
          <div class="summary-line">
            <span>VAT (0%):</span>
            <span>$0.00</span>
          </div>
          <div class="summary-line total">
            <span>Total in USD:</span>
            <span style="color: #202124;">${formatCurrency(profile.calculatedCost)}</span>
          </div>
        </div>
      `;
    } else if (state.invoiceView === 'daily') {
      mainTitle.textContent = 'Google Cloud / Firebase Itemized Daily Log';
      metaBox.innerHTML = `
        <div><strong>Statement Date:</strong> August 27, 2026</div>
        <div><strong>Granularity:</strong> 88 Days Total (June 1 – August 27, 2026)</div>
        <div><strong>Account ID:</strong> 01AFA5-71AD90-715FE0</div>
      `;

      let dailyRowsHtml = '';
      const allData = [
        ...monthProfiles['2026-06'].dailyData,
        ...monthProfiles['2026-07'].dailyData,
        ...monthProfiles['2026-08'].dailyData
      ];

      allData.forEach(d => {
        let cleanHighlight = 'Standard';
        if (d.highlight) {
          if (d.highlight.includes('Spike')) cleanHighlight = 'Peak Surge';
          else if (d.highlight.includes('Current')) cleanHighlight = 'Current Date';
          else if (d.highlight.includes('Peak User')) cleanHighlight = 'Elevated Volume';
          else cleanHighlight = d.highlight;
        }

        dailyRowsHtml += `
          <tr>
            <td><strong>${d.dateFormatted}</strong></td>
            <td>${cleanHighlight}</td>
            <td>${d.invocations > 0 ? d.invocations.toLocaleString() : '–'}</td>
            <td>${d.reads > 0 ? d.reads.toLocaleString() : '–'}</td>
            <td>${d.writes > 0 ? d.writes.toLocaleString() : '–'}</td>
            <td>${d.downloadsMB > 0 ? d.downloadsMB.toFixed(1) + ' MB' : '–'}</td>
            <td style="text-align: right; font-weight: 600; color: #202124;">${formatCurrency(d.cost)}</td>
          </tr>
        `;
      });

      invoiceDynamicContainer.innerHTML = `
        <div style="border: 1px solid #dadce0; border-radius: 6px; margin-bottom: 16px;">
          <table class="invoice-table" style="margin-bottom: 0;">
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity Status</th>
                <th>Invocations</th>
                <th>Firestore Reads</th>
                <th>Firestore Writes</th>
                <th>Downloads</th>
                <th style="text-align: right;">Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              ${dailyRowsHtml}
            </tbody>
          </table>
        </div>
        </div>
      `;
    }
  }

  btnView3Month?.addEventListener('click', () => { state.invoiceView = '3month'; renderInvoiceModalContent(); });
  btnViewSingle?.addEventListener('click', () => { state.invoiceView = 'single'; renderInvoiceModalContent(); });
  btnViewDaily?.addEventListener('click', () => { state.invoiceView = 'daily'; renderInvoiceModalContent(); });

  function openInvoiceModal(defaultView = '3month') {
    state.invoiceView = defaultView;
    renderInvoiceModalContent();
    invoiceModal.classList.add('active');
  }

  btnPrintStatement?.addEventListener('click', () => openInvoiceModal('3month'));
  btnQuickExport?.addEventListener('click', () => openInvoiceModal('3month'));
  invoiceCloseBtn?.addEventListener('click', () => invoiceModal.classList.remove('active'));
  invoiceModal?.addEventListener('click', (e) => {
    if (e.target === invoiceModal) invoiceModal.classList.remove('active');
  });

  invoiceTriggerPrint?.addEventListener('click', () => {
    window.print();
  });

  btnOpenDrawer?.addEventListener('click', () => {
    setDrawerMonth(state.selectedMonthKey);
    drawerModal.classList.add('active');
  });
  drawerCloseBtn?.addEventListener('click', () => drawerModal.classList.remove('active'));
  drawerModal?.addEventListener('click', (e) => {
    if (e.target === drawerModal) drawerModal.classList.remove('active');
  });

  // Update UI Elements for Selected Month
  function updateUI() {
    const profile = monthProfiles[state.selectedMonthKey] || monthProfiles['2026-08'];
    const metrics = computeMonthMetrics(state.selectedMonthKey);

    // Project Total Cost Banner
    if (displayTotalCost) {
      displayTotalCost.textContent = formatCurrency(profile.calculatedCost);
      displayTotalCost.classList.add('updated');
      setTimeout(() => displayTotalCost.classList.remove('updated'), 400);
    }

    // Invocations UI
    document.getElementById('invocations-percent-text').textContent = metrics.invocations.percent + '%';
    document.getElementById('invocations-val-text').textContent = profile.invocations.toLocaleString();
    document.getElementById('invocations-cost-text').textContent = formatCurrency(metrics.invocations.cost);
    updateProgressBar('invocations-bar-fill', metrics.invocations.percent);

    // Writes UI
    document.getElementById('firestore-writes-percent').textContent = metrics.writes.percent + '%';
    document.getElementById('firestore-writes-val').textContent = profile.writesPerDay.toLocaleString();
    document.getElementById('firestore-writes-cost').textContent = formatCurrency(metrics.writes.cost);
    updateProgressBar('firestore-writes-bar-fill', metrics.writes.percent);

    // Reads UI
    document.getElementById('firestore-reads-percent').textContent = metrics.reads.percent + '%';
    document.getElementById('firestore-reads-val').textContent = formatNumber(profile.readsPerDay);
    document.getElementById('firestore-reads-cost').textContent = formatCurrency(metrics.reads.cost);
    updateProgressBar('firestore-reads-bar-fill', metrics.reads.percent);

    // Deletes UI
    document.getElementById('firestore-deletes-percent').textContent = metrics.deletes.percent + '%';
    document.getElementById('firestore-deletes-val').textContent = profile.deletesPerDay.toLocaleString();
    document.getElementById('firestore-deletes-cost').textContent = formatCurrency(metrics.deletes.cost);
    updateProgressBar('firestore-deletes-bar-fill', metrics.deletes.percent);

    // Hosting Storage UI
    document.getElementById('hosting-storage-percent').textContent = metrics.hostingStorage.percent + '%';
    document.getElementById('hosting-storage-val').textContent = profile.hostingStorageGB + ' GB';
    document.getElementById('hosting-storage-cost').textContent = formatCurrency(metrics.hostingStorage.cost);
    updateProgressBar('hosting-storage-bar-fill', metrics.hostingStorage.percent);

    // Hosting Downloads UI
    document.getElementById('hosting-downloads-percent').textContent = metrics.hostingDownloads.percent + '%';
    document.getElementById('hosting-downloads-val').textContent = profile.hostingDownloadsMBPerDay + ' MB';
    document.getElementById('hosting-downloads-cost').textContent = formatCurrency(metrics.hostingDownloads.cost);
    updateProgressBar('hosting-downloads-bar-fill', metrics.hostingDownloads.percent);

    // Cumulative graph
    if (state.costCardExpanded) {
      renderCumulativeCostGraph();
    }

    // Accordion panel
    if (state.expandedMetricKey && inlinePanel.classList.contains('expanded')) {
      renderAccordionContent(state.expandedMetricKey);
    }
  }

  function updateProgressBar(elementId, percentVal) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const clampedPercent = Math.min(100, Math.max(0.1, parseFloat(percentVal)));
    el.style.width = clampedPercent + '%';

    el.classList.remove('warning', 'exceeded');
    if (clampedPercent >= 100) {
      el.classList.add('exceeded');
    } else if (clampedPercent >= 75) {
      el.classList.add('warning');
    }
  }

  // Interactive Drawer Event Listeners for Live Editing
  inputUsers?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) || 1;
    sliderUsersVal.textContent = `${val} Users`;
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) {
      targetProf.users = val;
      if (state.drawerTargetMonthKey === '2026-06') targetProf.dailyData = generateJuneDailyData(val, targetProf.invocations);
      if (state.drawerTargetMonthKey === '2026-07') targetProf.dailyData = generateJulyDailyData(val, targetProf.invocations);
      if (state.drawerTargetMonthKey === '2026-08') targetProf.dailyData = generateAugustDailyData(val, targetProf.invocations);
      recalculateAll();
    }
  });

  inputInvocations?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) || 0;
    sliderInvocationsVal.textContent = val.toLocaleString();
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) {
      targetProf.invocations = val;
      recalculateAll();
    }
  });

  inputWrites?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) || 0;
    sliderWritesVal.textContent = val.toLocaleString();
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) {
      targetProf.writesPerDay = val;
      recalculateAll();
    }
  });

  inputReads?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) || 0;
    sliderReadsVal.textContent = formatNumber(val);
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) {
      targetProf.readsPerDay = val;
      recalculateAll();
    }
  });

  inputDeletes?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) || 0;
    sliderDeletesVal.textContent = val.toLocaleString();
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) {
      targetProf.deletesPerDay = val;
      recalculateAll();
    }
  });

  inputHostingStorage?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) || 0;
    sliderHostingStorageVal.textContent = `${val} GB`;
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) {
      targetProf.hostingStorageGB = val;
      recalculateAll();
    }
  });

  inputHostingDownloads?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) || 0;
    sliderHostingDownloadsVal.textContent = `${val} MB`;
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) {
      targetProf.hostingDownloadsMBPerDay = val;
      recalculateAll();
    }
  });

  // Rates Listeners (Global & Per-Month reactive updates)
  rateInvocationsInput?.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value) || 0.40;
    globalRates.rateInvocations = rate;
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) targetProf.rates.rateInvocations = rate;
    recalculateAll();
  });

  rateWritesInput?.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value) || 0.18;
    globalRates.rateWrites = rate;
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) targetProf.rates.rateWrites = rate;
    recalculateAll();
  });

  rateReadsInput?.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value) || 0.06;
    globalRates.rateReads = rate;
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) targetProf.rates.rateReads = rate;
    recalculateAll();
  });

  rateDeletesInput?.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value) || 0.02;
    globalRates.rateDeletes = rate;
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) targetProf.rates.rateDeletes = rate;
    recalculateAll();
  });

  rateHostingStorageInput?.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value) || 0.026;
    globalRates.rateHostingStorage = rate;
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) targetProf.rates.rateHostingStorage = rate;
    recalculateAll();
  });

  rateHostingDownloadsInput?.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value) || 0.15;
    globalRates.rateHostingDownloads = rate;
    const targetProf = monthProfiles[state.drawerTargetMonthKey];
    if (targetProf) targetProf.rates.rateHostingDownloads = rate;
    recalculateAll();
  });

  // Presets
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const preset = chip.getAttribute('data-preset');
      const targetProf = monthProfiles[state.drawerTargetMonthKey];
      if (!targetProf) return;

      if (preset === 'baseline') {
        targetProf.invocations = 85000;
        targetProf.writesPerDay = 3100;
        targetProf.readsPerDay = 12400;
        targetProf.deletesPerDay = 150;
        targetProf.hostingStorageGB = 4.5;
        targetProf.hostingDownloadsMBPerDay = 14.2;
      } else if (preset === 'moderate') {
        targetProf.invocations = 201500;
        targetProf.writesPerDay = 4200;
        targetProf.readsPerDay = 18500;
        targetProf.deletesPerDay = 210;
        targetProf.hostingStorageGB = 5.8;
        targetProf.hostingDownloadsMBPerDay = 18.4;
      } else if (preset === 'high') {
        targetProf.invocations = 2450000;
        targetProf.writesPerDay = 22500;
        targetProf.readsPerDay = 68000;
        targetProf.deletesPerDay = 450;
        targetProf.hostingStorageGB = 6.2;
        targetProf.hostingDownloadsMBPerDay = 380.0;
      } else if (preset === 'heavy') {
        targetProf.invocations = 7500000;
        targetProf.writesPerDay = 95000;
        targetProf.readsPerDay = 450000;
        targetProf.deletesPerDay = 25000;
        targetProf.hostingStorageGB = 45.0;
        targetProf.hostingDownloadsMBPerDay = 2400.0;
      }

      setDrawerMonth(state.drawerTargetMonthKey);
    });
  });

  drawerResetBtn?.addEventListener('click', () => {
    globalRates.rateInvocations = 0.40;
    globalRates.rateWrites = 0.18;
    globalRates.rateReads = 0.06;
    globalRates.rateDeletes = 0.02;
    globalRates.rateHostingStorage = 0.026;
    globalRates.rateHostingDownloads = 0.15;

    monthProfiles['2026-06'].invocations = 85000;
    monthProfiles['2026-06'].users = 21;
    monthProfiles['2026-07'].invocations = 201500;
    monthProfiles['2026-07'].users = 34;
    monthProfiles['2026-08'].invocations = 2450000;
    monthProfiles['2026-08'].users = 28;

    setDrawerMonth(state.drawerTargetMonthKey);
  });

  drawerApplyBtn?.addEventListener('click', () => {
    recalculateAll();
    drawerModal.classList.remove('active');
  });

  // Initialize System
  setupAccordionRows();
  selectMonth('2026-08');
});
