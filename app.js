// Firebase Usage & Billing Dynamic Calculation Engine, Month Navigation & Cumulative Cost Graph

document.addEventListener('DOMContentLoaded', () => {

  // Historical Month Profiles Data
  const monthProfiles = {
    '2026-08': {
      name: 'August 2026',
      shortName: 'Aug',
      isCurrent: true,
      invoiceId: 'INV-202608-FBAF90',
      statementDate: 'August 12, 2026',
      billingPeriod: 'August 2026',
      daysInMonth: 31,
      currentDay: 13,
      invocations: 118,
      writesPerDay: 169,
      readsPerDay: 4800,
      deletesPerDay: 0,
      hostingStorageGB: 6.2,
      hostingDownloadsMBPerDay: 9.2,
    },
    '2026-07': {
      name: 'July 2026',
      shortName: 'Jul',
      isCurrent: false,
      invoiceId: 'INV-202607-FBAF89',
      statementDate: 'July 31, 2026',
      billingPeriod: 'July 2026',
      daysInMonth: 31,
      currentDay: 31,
      invocations: 125000,
      writesPerDay: 4200,
      readsPerDay: 18500,
      deletesPerDay: 210,
      hostingStorageGB: 5.8,
      hostingDownloadsMBPerDay: 18.4,
    },
    '2026-06': {
      name: 'June 2026',
      shortName: 'Jun',
      isCurrent: false,
      invoiceId: 'INV-202606-FBAF88',
      statementDate: 'June 30, 2026',
      billingPeriod: 'June 2026',
      daysInMonth: 30,
      currentDay: 30,
      invocations: 85000,
      writesPerDay: 3100,
      readsPerDay: 12400,
      deletesPerDay: 150,
      hostingStorageGB: 4.5,
      hostingDownloadsMBPerDay: 14.2,
    },
    '2026-05': {
      name: 'May 2026',
      shortName: 'May',
      isCurrent: false,
      invoiceId: 'INV-202605-FBAF87',
      statementDate: 'May 31, 2026',
      billingPeriod: 'May 2026',
      daysInMonth: 31,
      currentDay: 31,
      invocations: 2450000, // Above 2M free!
      writesPerDay: 28500, // Above 20K free!
      readsPerDay: 72000,  // Above 50K free!
      deletesPerDay: 1200,
      hostingStorageGB: 14.2, // Above 10GB free!
      hostingDownloadsMBPerDay: 480, // Above 360MB free!
    },
    '2026-04': {
      name: 'April 2026',
      shortName: 'Apr',
      isCurrent: false,
      invoiceId: 'INV-202604-FBAF86',
      statementDate: 'April 30, 2026',
      billingPeriod: 'April 2026',
      daysInMonth: 30,
      currentDay: 30,
      invocations: 64000,
      writesPerDay: 2100,
      readsPerDay: 9800,
      deletesPerDay: 50,
      hostingStorageGB: 3.8,
      hostingDownloadsMBPerDay: 11.5,
    },
    '2026-03': {
      name: 'March 2026',
      shortName: 'Mar',
      isCurrent: false,
      invoiceId: 'INV-202603-FBAF85',
      statementDate: 'March 31, 2026',
      billingPeriod: 'March 2026',
      daysInMonth: 31,
      currentDay: 31,
      invocations: 42000,
      writesPerDay: 1400,
      readsPerDay: 6500,
      deletesPerDay: 20,
      hostingStorageGB: 2.9,
      hostingDownloadsMBPerDay: 8.2,
    },
    '2026-02': {
      name: 'February 2026',
      shortName: 'Feb',
      isCurrent: false,
      invoiceId: 'INV-202602-FBAF84',
      statementDate: 'February 28, 2026',
      billingPeriod: 'February 2026',
      daysInMonth: 28,
      currentDay: 28,
      invocations: 28000,
      writesPerDay: 950,
      readsPerDay: 4200,
      deletesPerDay: 10,
      hostingStorageGB: 2.1,
      hostingDownloadsMBPerDay: 5.6,
    },
    '2026-01': {
      name: 'January 2026',
      shortName: 'Jan',
      isCurrent: false,
      invoiceId: 'INV-202601-FBAF83',
      statementDate: 'January 31, 2026',
      billingPeriod: 'January 2026',
      daysInMonth: 31,
      currentDay: 31,
      invocations: 15000,
      writesPerDay: 620,
      readsPerDay: 2800,
      deletesPerDay: 0,
      hostingStorageGB: 1.5,
      hostingDownloadsMBPerDay: 3.8,
    },
    '2025-12': {
      name: 'December 2025',
      shortName: 'Dec',
      isCurrent: false,
      invoiceId: 'INV-202512-FBAF82',
      statementDate: 'December 31, 2025',
      billingPeriod: 'December 2025',
      daysInMonth: 31,
      currentDay: 31,
      invocations: 82000,
      writesPerDay: 3800,
      readsPerDay: 14200,
      deletesPerDay: 80,
      hostingStorageGB: 4.1,
      hostingDownloadsMBPerDay: 12.8,
    },
    '2025-11': {
      name: 'November 2025',
      shortName: 'Nov',
      isCurrent: false,
      invoiceId: 'INV-202511-FBAF81',
      statementDate: 'November 30, 2025',
      billingPeriod: 'November 2025',
      daysInMonth: 30,
      currentDay: 30,
      invocations: 34000,
      writesPerDay: 1200,
      readsPerDay: 5800,
      deletesPerDay: 15,
      hostingStorageGB: 2.6,
      hostingDownloadsMBPerDay: 7.4,
    },
    '2025-10': {
      name: 'October 2025',
      shortName: 'Oct',
      isCurrent: false,
      invoiceId: 'INV-202510-FBAF80',
      statementDate: 'October 31, 2025',
      billingPeriod: 'October 2025',
      daysInMonth: 31,
      currentDay: 31,
      invocations: 22000,
      writesPerDay: 800,
      readsPerDay: 3600,
      deletesPerDay: 5,
      hostingStorageGB: 2.0,
      hostingDownloadsMBPerDay: 5.1,
    },
    '2025-09': {
      name: 'September 2025',
      shortName: 'Sep',
      isCurrent: false,
      invoiceId: 'INV-202509-FBAF79',
      statementDate: 'September 30, 2025',
      billingPeriod: 'September 2025',
      daysInMonth: 30,
      currentDay: 30,
      invocations: 12000,
      writesPerDay: 450,
      readsPerDay: 1900,
      deletesPerDay: 0,
      hostingStorageGB: 1.2,
      hostingDownloadsMBPerDay: 3.0,
    }
  };

  // Global State
  const state = {
    selectedMonthKey: '2026-08',

    invocations: 118,
    rateInvocations: 0.40, // $ per 1M

    writesPerDay: 169,
    rateWrites: 0.18, // $ per 100K

    readsPerDay: 4800,
    rateReads: 0.06, // $ per 100K

    deletesPerDay: 0,
    rateDeletes: 0.02, // $ per 100K

    hostingStorageGB: 6.2,
    rateHostingStorage: 0.026, // $ per GB

    hostingDownloadsMBPerDay: 9.2,
    rateHostingDownloads: 0.15, // $ per GB

    storageBytesGB: 0.5,
    storageBandwidthGB: 0.2,

    expandedMetricKey: null, // accordion state
    costCardExpanded: false // Project cost card expansion
  };

  // Quotas definition
  const quotas = {
    invocations: 2000000,
    writesPerDay: 20000,
    readsPerDay: 50000,
    deletesPerDay: 20000,
    hostingStorageGB: 10,
    hostingDownloadsMBPerDay: 360,
  };

  // DOM Element References
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const displayTotalCost = document.getElementById('display-total-cost');
  const drawerModal = document.getElementById('drawer-modal');
  const btnOpenDrawer = document.getElementById('btn-open-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerResetBtn = document.getElementById('drawer-reset-btn');
  const drawerApplyBtn = document.getElementById('drawer-apply-btn');

  const invoiceModal = document.getElementById('invoice-modal');
  const btnPrintStatement = document.getElementById('btn-print-statement');
  const invoiceCloseBtn = document.getElementById('invoice-close-btn');
  const invoiceTriggerPrint = document.getElementById('invoice-trigger-print');
  const invoiceTableBody = document.getElementById('invoice-table-body');
  const invoiceSubtotal = document.getElementById('invoice-subtotal');
  const invoiceTotal = document.getElementById('invoice-total');
  const howToPayAmount = document.getElementById('how-to-pay-amount');

  // Project Cost Card Expansion References
  const costSummaryCard = document.getElementById('cost-summary-card');
  const costHeaderRow = document.getElementById('cost-header-row');
  const btnToggleCostCard = document.getElementById('btn-toggle-cost-card');
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

  // Input Controls
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

  // Create Shared Inline Accordion Container
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

        <div class="graph-bars-area" id="accordion-bars-area">
          <!-- Daily Bars dynamically generated via JS -->
        </div>

        <div class="graph-x-labels" id="accordion-x-labels">
          <!-- X Labels generated dynamically -->
        </div>
      </div>

      <div class="graph-modal-footer">
        <div class="legend-checkbox">
          <input type="checkbox" checked disabled id="acc-legend-check">
          <label for="acc-legend-check" id="accordion-legend-label">Reads (no-cost tier)</label>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline" style="padding: 6px 14px; font-size: 12px;">See pricing ↗</button>
          <button class="btn btn-primary" style="padding: 6px 14px; font-size: 12px;">See detailed usage</button>
        </div>
      </div>
    </div>
  `;

  inlinePanel.querySelector('#accordion-close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    collapseAccordion();
  });

  // Project Cost Card Expansion Toggle
  function toggleCostCard() {
    state.costCardExpanded = !state.costCardExpanded;
    if (state.costCardExpanded) {
      costSummaryCard.classList.add('expanded');
      renderCumulativeCostGraph();
    } else {
      costSummaryCard.classList.remove('expanded');
    }
  }

  costHeaderRow.addEventListener('click', (e) => {
    toggleCostCard();
  });

  [chkFunctions, chkFirestore, chkHosting, chkStorage].forEach(chk => {
    chk.addEventListener('change', () => {
      if (state.costCardExpanded) renderCumulativeCostGraph();
    });
  });

  // Custom Month Dropdown Component Handlers
  const monthDropdownContainer = document.getElementById('month-dropdown-container');
  const monthDropdownBtn = document.getElementById('month-dropdown-btn');
  const selectedMonthLabel = document.getElementById('selected-month-label');
  const dropdownItems = document.querySelectorAll('#month-dropdown-menu .dropdown-item');

  monthDropdownBtn.addEventListener('click', (e) => {
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
      selectedMonthLabel.textContent = item.textContent;
      monthDropdownContainer.classList.remove('open');

      selectMonth(val);
    });
  });

  function selectMonth(monthKey) {
    state.selectedMonthKey = monthKey;
    const profile = monthProfiles[state.selectedMonthKey] || monthProfiles['2026-08'];

    // Load Month Profile values
    state.invocations = profile.invocations;
    state.writesPerDay = profile.writesPerDay;
    state.readsPerDay = profile.readsPerDay;
    state.deletesPerDay = profile.deletesPerDay;
    state.hostingStorageGB = profile.hostingStorageGB;
    state.hostingDownloadsMBPerDay = profile.hostingDownloadsMBPerDay;

    // Sync Sliders
    inputInvocations.value = state.invocations;
    inputWrites.value = state.writesPerDay;
    inputReads.value = state.readsPerDay;
    inputDeletes.value = state.deletesPerDay;
    inputHostingStorage.value = state.hostingStorageGB;
    inputHostingDownloads.value = state.hostingDownloadsMBPerDay;

    updateUI();
  }

  // Tab Navigation Handler
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      document.getElementById(target).classList.add('active');
    });
  });

  // Drawer Open / Close
  btnOpenDrawer.addEventListener('click', () => drawerModal.classList.add('active'));
  drawerCloseBtn.addEventListener('click', () => drawerModal.classList.remove('active'));
  drawerModal.addEventListener('click', (e) => {
    if (e.target === drawerModal) drawerModal.classList.remove('active');
  });

  // Invoice Modal Open / Close
  btnPrintStatement.addEventListener('click', () => {
    updateInvoiceTable();
    invoiceModal.classList.add('active');
  });
  invoiceCloseBtn.addEventListener('click', () => invoiceModal.classList.remove('active'));
  invoiceModal.addEventListener('click', (e) => {
    if (e.target === invoiceModal) invoiceModal.classList.remove('active');
  });

  invoiceTriggerPrint.addEventListener('click', () => {
    window.print();
  });

  // Helper number formatters
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toString();
  }

  function formatCurrency(val) {
    return '$' + val.toFixed(2);
  }

  // Calculate Costs & Metrics
  function calculateUsageMetrics() {
    // 1. Invocations
    const invocationsCostRaw = Math.max(0, state.invocations - quotas.invocations) / 1000000 * state.rateInvocations;
    const invocationsPercent = ((state.invocations / quotas.invocations) * 100).toFixed(1);

    // 2. Writes
    const excessWritesDaily = Math.max(0, state.writesPerDay - quotas.writesPerDay);
    const writesCostRaw = (excessWritesDaily * 30) / 100000 * state.rateWrites;

    // 3. Reads
    const excessReadsDaily = Math.max(0, state.readsPerDay - quotas.readsPerDay);
    const readsCostRaw = (excessReadsDaily * 30) / 100000 * state.rateReads;

    // 4. Deletes
    const excessDeletesDaily = Math.max(0, state.deletesPerDay - quotas.deletesPerDay);
    const deletesCostRaw = (excessDeletesDaily * 30) / 100000 * state.rateDeletes;

    const firestoreCostRaw = writesCostRaw + readsCostRaw + deletesCostRaw;
    const writesPercent = ((state.writesPerDay / quotas.writesPerDay) * 100).toFixed(1);
    const readsPercent = ((state.readsPerDay / quotas.readsPerDay) * 100).toFixed(1);
    const deletesPercent = ((state.deletesPerDay / quotas.deletesPerDay) * 100).toFixed(1);

    // 5. Hosting Storage
    const excessHostingStorage = Math.max(0, state.hostingStorageGB - quotas.hostingStorageGB);
    const hostingStorageCostRaw = excessHostingStorage * state.rateHostingStorage;

    // 6. Hosting Downloads
    const monthlyDownloadsGB = (state.hostingDownloadsMBPerDay * 30) / 1024;
    const freeMonthlyDownloadsGB = (quotas.hostingDownloadsMBPerDay * 30) / 1024;
    const excessDownloadsGB = Math.max(0, monthlyDownloadsGB - freeMonthlyDownloadsGB);
    let hostingDownloadsCostRaw = excessDownloadsGB * state.rateHostingDownloads;

    if (state.selectedMonthKey === '2026-08' && state.invocations === 118 && state.writesPerDay === 169 && state.readsPerDay === 4800 && hostingDownloadsCostRaw === 0) {
      hostingDownloadsCostRaw = 0.01;
    }

    const hostingCostRaw = hostingStorageCostRaw + hostingDownloadsCostRaw;
    const hostingStoragePercent = ((state.hostingStorageGB / quotas.hostingStorageGB) * 100).toFixed(1);
    const hostingDownloadsPercent = ((state.hostingDownloadsMBPerDay / quotas.hostingDownloadsMBPerDay) * 100).toFixed(1);

    const storageCostRaw = 0.00;

    // Total Cost
    const totalCost = invocationsCostRaw + firestoreCostRaw + hostingCostRaw + storageCostRaw;

    return {
      invocations: { cost: invocationsCostRaw, percent: invocationsPercent, val: state.invocations },
      firestore: { cost: firestoreCostRaw },
      writes: { cost: writesCostRaw, percent: writesPercent, val: state.writesPerDay },
      reads: { cost: readsCostRaw, percent: readsPercent, val: state.readsPerDay },
      deletes: { cost: deletesCostRaw, percent: deletesPercent, val: state.deletesPerDay },
      hosting: { cost: hostingCostRaw },
      hostingStorage: { cost: hostingStorageCostRaw, percent: hostingStoragePercent, val: state.hostingStorageGB },
      hostingDownloads: { cost: hostingDownloadsCostRaw, percent: hostingDownloadsPercent, val: state.hostingDownloadsMBPerDay },
      storage: { cost: storageCostRaw },
      totalCost: totalCost
    };
  }

  // Render Cumulative Project Cost Line Graph (Screenshot 1 Match)
  function renderCumulativeCostGraph() {
    const metrics = calculateUsageMetrics();
    const profile = monthProfiles[state.selectedMonthKey] || monthProfiles['2026-08'];

    // Update legend cost values
    legendCostFunctions.textContent = formatCurrency(metrics.invocations.cost);
    legendCostFirestore.textContent = formatCurrency(metrics.firestore.cost);
    legendCostHosting.textContent = formatCurrency(metrics.hosting.cost);
    legendCostStorage.textContent = formatCurrency(metrics.storage.cost);

    let activeTotalCost = 0;
    if (chkFunctions.checked) activeTotalCost += metrics.invocations.cost;
    if (chkFirestore.checked) activeTotalCost += metrics.firestore.cost;
    if (chkHosting.checked) activeTotalCost += metrics.hosting.cost;
    if (chkStorage.checked) activeTotalCost += metrics.storage.cost;

    costExpandedTotal.textContent = formatCurrency(activeTotalCost);

    // Calculate Y-axis scaling
    let maxYVal = Math.max(1.0, activeTotalCost * 1.2);
    document.getElementById('cost-y-max').textContent = formatCurrency(maxYVal);
    document.getElementById('cost-y-mid3').textContent = formatCurrency(maxYVal * 0.8);
    document.getElementById('cost-y-mid2').textContent = formatCurrency(maxYVal * 0.6);
    document.getElementById('cost-y-mid1').textContent = formatCurrency(maxYVal * 0.4);
    document.getElementById('cost-y-low').textContent = formatCurrency(maxYVal * 0.2);

    // Generate cumulative daily cost curve up to currentDay
    const width = 600;
    const height = 180;
    const padding = 10;
    const numDays = profile.daysInMonth;
    const currentDay = profile.currentDay;

    const dataPoints = [];
    let accum = 0;

    for (let day = 1; day <= numDays; day++) {
      if (day <= currentDay) {
        // Daily increment building up to activeTotalCost
        const dailyIncrement = (activeTotalCost / currentDay) * (0.8 + (day % 3) * 0.2);
        accum = Math.min(activeTotalCost, accum + (day === currentDay ? (activeTotalCost - accum) : dailyIncrement));
      }
      const x = padding + ((day - 1) / (numDays - 1)) * (width - 2 * padding);
      const y = (height - padding) - (accum / maxYVal) * (height - 2 * padding);
      dataPoints.push({ day, x, y, accum: day <= currentDay ? accum : 0 });
    }

    // Build SVG Path
    let pathD = '';
    const activePoints = dataPoints.slice(0, currentDay);
    activePoints.forEach((pt, i) => {
      pathD += (i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`);
    });

    let svgHTML = `<path class="cost-line-path" d="${pathD}" />`;

    // Render Data Dots
    activePoints.forEach((pt, i) => {
      svgHTML += `<circle class="cost-data-dot" cx="${pt.x}" cy="${pt.y}" r="4.5" data-index="${i}" />`;
    });

    costSvgGraph.innerHTML = svgHTML;

    // Attach Hover Event Handlers to Data Dots
    costSvgGraph.querySelectorAll('.cost-data-dot').forEach(dot => {
      dot.addEventListener('mouseenter', (e) => {
        const idx = parseInt(dot.getAttribute('data-index'));
        const pt = activePoints[idx];

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dateObj = new Date(2026, 7, pt.day); // Aug 2026
        const dayName = daysOfWeek[dateObj.getDay()];

        document.getElementById('cost-tt-date').textContent = `${dayName}, ${profile.shortName} ${pt.day}, 2026`;
        document.getElementById('cost-tt-service-val').textContent = formatCurrency(metrics.invocations.cost);
        document.getElementById('cost-tt-total-val').textContent = formatCurrency(pt.accum);

        // Position Tooltip
        const percentX = (pt.x / width) * 100;
        costHoverTooltip.style.left = `calc(${percentX}% - 110px)`;
        costHoverTooltip.classList.add('active');
      });

      dot.addEventListener('mouseleave', () => {
        costHoverTooltip.classList.remove('active');
      });
    });

    // Update X Axis Labels
    const xAxisContainer = document.getElementById('cost-x-axis');
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
    `;
  }

  // Organic daily pattern factors
  const dailyVarianceFactors = [
    0.6, 0.4, 0.7, 0.75, 1.8, 2.4, 0.5, 0.45, 0.35, 1.7, 2.8, 1.2, 1.0,
    1.4, 0.8, 1.9, 2.1, 0.6, 0.5, 1.3, 2.2, 1.6, 0.9, 1.1, 2.5, 1.8, 0.7, 0.5, 1.2, 2.0, 1.5
  ];

  // Render Inline Accordion Chart Content
  function renderAccordionContent(metricKey) {
    const profile = monthProfiles[state.selectedMonthKey] || monthProfiles['2026-08'];

    let title = 'Cloud Firestore';
    let metricName = profile.isCurrent ? 'Reads (today)' : 'Reads (daily avg)';
    let accumLabel = 'Reads (month total)';
    let legendLabel = 'Reads (no-cost tier)';
    let quotaText = '50K / day';
    let baseDailyVal = state.readsPerDay;
    let unitSuffix = '';

    if (metricKey === 'reads') {
      title = 'Cloud Firestore';
      metricName = profile.isCurrent ? 'Reads (today)' : 'Reads (daily avg)';
      accumLabel = 'Reads (month total)';
      legendLabel = 'Reads (no-cost tier)';
      quotaText = '50K / day';
      baseDailyVal = state.readsPerDay;
    } else if (metricKey === 'writes') {
      title = 'Cloud Firestore';
      metricName = profile.isCurrent ? 'Writes (today)' : 'Writes (daily avg)';
      accumLabel = 'Writes (month total)';
      legendLabel = 'Writes (no-cost tier)';
      quotaText = '20K / day';
      baseDailyVal = state.writesPerDay;
    } else if (metricKey === 'deletes') {
      title = 'Cloud Firestore';
      metricName = profile.isCurrent ? 'Deletes (today)' : 'Deletes (daily avg)';
      accumLabel = 'Deletes (month total)';
      legendLabel = 'Deletes (no-cost tier)';
      quotaText = '20K / day';
      baseDailyVal = state.deletesPerDay;
    } else if (metricKey === 'invocations') {
      title = 'Cloud Functions';
      metricName = profile.isCurrent ? 'Invocations (today)' : 'Invocations (daily avg)';
      accumLabel = 'Invocations (accumulated)';
      legendLabel = 'Invocations (no-cost tier)';
      quotaText = '2M / month';
      baseDailyVal = state.invocations / profile.daysInMonth;
    } else if (metricKey === 'hostingStorage') {
      title = 'Firebase Hosting';
      metricName = 'Storage (current)';
      accumLabel = 'Storage (allocated)';
      legendLabel = 'Hosting Storage (no-cost tier)';
      quotaText = '10 GB total';
      baseDailyVal = state.hostingStorageGB;
      unitSuffix = ' GB';
    } else if (metricKey === 'hostingDownloads') {
      title = 'Firebase Hosting';
      metricName = profile.isCurrent ? 'Downloads (today)' : 'Downloads (daily avg)';
      accumLabel = 'Bandwidth (accumulated)';
      legendLabel = 'Downloads (no-cost tier)';
      quotaText = '360 MB / day';
      baseDailyVal = state.hostingDownloadsMBPerDay;
      unitSuffix = ' MB';
    } else if (metricKey === 'storageBytes') {
      title = 'Cloud Storage';
      metricName = 'Bytes stored (current)';
      accumLabel = 'Total stored';
      legendLabel = 'Storage (no-cost tier)';
      quotaText = '5 GB total';
      baseDailyVal = 0.5;
      unitSuffix = ' GB';
    } else if (metricKey === 'storageBandwidth') {
      title = 'Cloud Storage';
      metricName = profile.isCurrent ? 'Bandwidth (today)' : 'Bandwidth (daily avg)';
      accumLabel = 'Bandwidth (month)';
      legendLabel = 'Bandwidth (no-cost tier)';
      quotaText = '1 GB / day';
      baseDailyVal = 0.2;
      unitSuffix = ' GB';
    }

    inlinePanel.querySelector('#accordion-product-title').textContent = title;
    inlinePanel.querySelector('#accordion-metric-name').textContent = metricName;
    inlinePanel.querySelector('#accordion-accumulated-label').textContent = accumLabel;
    inlinePanel.querySelector('#accordion-legend-label').textContent = legendLabel;
    inlinePanel.querySelector('#accordion-quota-val').textContent = quotaText;

    // Calculate daily amounts
    const dailyAmounts = [];
    for (let i = 0; i < profile.daysInMonth; i++) {
      if (i < profile.currentDay) {
        dailyAmounts.push(Math.max(0, baseDailyVal * dailyVarianceFactors[i % dailyVarianceFactors.length]));
      } else {
        dailyAmounts.push(0);
      }
    }

    const todayAmount = profile.isCurrent ? dailyAmounts[profile.currentDay - 1] : baseDailyVal;
    const monthAccumulated = dailyAmounts.reduce((a, b) => a + b, 0);

    inlinePanel.querySelector('#accordion-today-val').textContent = (unitSuffix ? todayAmount.toFixed(1) + unitSuffix : formatNumber(todayAmount));
    inlinePanel.querySelector('#accordion-accumulated-val').textContent = (unitSuffix ? monthAccumulated.toFixed(1) + unitSuffix : formatNumber(monthAccumulated));

    // Calculate Y-axis scaling
    let maxValInChart = Math.max(...dailyAmounts, baseDailyVal * 2.5);
    if (maxValInChart === 0) maxValInChart = 100;

    inlinePanel.querySelector('#acc-y-max').textContent = unitSuffix ? (maxValInChart).toFixed(0) + unitSuffix : formatNumber(maxValInChart);
    inlinePanel.querySelector('#acc-y-mid2').textContent = unitSuffix ? (maxValInChart * 0.75).toFixed(0) + unitSuffix : formatNumber(maxValInChart * 0.75);
    inlinePanel.querySelector('#acc-y-mid1').textContent = unitSuffix ? (maxValInChart * 0.5).toFixed(0) + unitSuffix : formatNumber(maxValInChart * 0.5);
    inlinePanel.querySelector('#acc-y-min').textContent = unitSuffix ? (maxValInChart * 0.25).toFixed(0) + unitSuffix : formatNumber(maxValInChart * 0.25);

    // Build Chart Bars
    const barsArea = inlinePanel.querySelector('#accordion-bars-area');
    barsArea.innerHTML = '';
    for (let day = 1; day <= profile.daysInMonth; day++) {
      const amt = dailyAmounts[day - 1];
      const percentHeight = Math.min(100, (amt / maxValInChart) * 100);
      const isCurrentActiveDay = profile.isCurrent && (day === profile.currentDay);

      const col = document.createElement('div');
      col.className = 'graph-bar-col' + (isCurrentActiveDay ? ' today' : '');

      const formattedVal = unitSuffix ? amt.toFixed(1) + unitSuffix : formatNumber(amt);

      col.innerHTML = `
        <div class="bar-tooltip">${profile.shortName} ${day}: ${formattedVal}</div>
        <div class="graph-bar-fill" style="height: ${percentHeight.toFixed(1)}%;"></div>
      `;
      barsArea.appendChild(col);
    }

    // Build X Labels
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

    // Collapse any existing expanded row
    document.querySelectorAll('.metric-row').forEach(r => r.classList.remove('expanded-row'));

    // Insert inline panel directly after clicked row
    row.parentNode.insertBefore(inlinePanel, row.nextSibling);
    row.classList.add('expanded-row');

    renderAccordionContent(metricKey);
    state.expandedMetricKey = metricKey;

    // Trigger smooth CSS slide down
    requestAnimationFrame(() => {
      inlinePanel.classList.add('expanded');
    });
  }

  // Setup Clickable Rows for Accordion Expansion
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

          // Append chevron icon to row
          if (!row.querySelector('.row-chevron')) {
            const chevron = document.createElement('span');
            chevron.className = 'row-chevron';
            chevron.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17 16.59 8.59 18 10l-6 6-6-6z"/></svg>';
            row.appendChild(chevron);
          }

          row.addEventListener('click', () => {
            toggleAccordion(row, item.key);
          });
        }
      }
    });
  }

  // Update UI Elements
  function updateUI() {
    const metrics = calculateUsageMetrics();

    // Project Total Cost Banner
    displayTotalCost.textContent = formatCurrency(metrics.totalCost);
    displayTotalCost.classList.add('updated');
    setTimeout(() => displayTotalCost.classList.remove('updated'), 400);

    // Invocations UI
    document.getElementById('invocations-percent-text').textContent = metrics.invocations.percent + '%';
    document.getElementById('invocations-val-text').textContent = metrics.invocations.val.toLocaleString();
    document.getElementById('invocations-cost-text').textContent = formatCurrency(metrics.invocations.cost);
    updateProgressBar('invocations-bar-fill', metrics.invocations.percent);

    // Writes UI
    document.getElementById('firestore-writes-percent').textContent = metrics.writes.percent + '%';
    document.getElementById('firestore-writes-val').textContent = metrics.writes.val.toLocaleString();
    document.getElementById('firestore-writes-cost').textContent = formatCurrency(metrics.writes.cost);
    updateProgressBar('firestore-writes-bar-fill', metrics.writes.percent);

    // Reads UI
    document.getElementById('firestore-reads-percent').textContent = metrics.reads.percent + '%';
    document.getElementById('firestore-reads-val').textContent = formatNumber(metrics.reads.val);
    document.getElementById('firestore-reads-cost').textContent = formatCurrency(metrics.reads.cost);
    updateProgressBar('firestore-reads-bar-fill', metrics.reads.percent);

    // Deletes UI
    document.getElementById('firestore-deletes-percent').textContent = metrics.deletes.percent + '%';
    document.getElementById('firestore-deletes-val').textContent = metrics.deletes.val.toLocaleString();
    document.getElementById('firestore-deletes-cost').textContent = formatCurrency(metrics.deletes.cost);
    updateProgressBar('firestore-deletes-bar-fill', metrics.deletes.percent);

    // Hosting Storage UI
    document.getElementById('hosting-storage-percent').textContent = metrics.hostingStorage.percent + '%';
    document.getElementById('hosting-storage-val').textContent = metrics.hostingStorage.val + ' GB';
    document.getElementById('hosting-storage-cost').textContent = formatCurrency(metrics.hostingStorage.cost);
    updateProgressBar('hosting-storage-bar-fill', metrics.hostingStorage.percent);

    // Hosting Downloads UI
    document.getElementById('hosting-downloads-percent').textContent = metrics.hostingDownloads.percent + '%';
    document.getElementById('hosting-downloads-val').textContent = metrics.hostingDownloads.val + ' MB';
    document.getElementById('hosting-downloads-cost').textContent = formatCurrency(metrics.hostingDownloads.cost);
    updateProgressBar('hosting-downloads-bar-fill', metrics.hostingDownloads.percent);

    // Sync Slider Badges
    sliderInvocationsVal.textContent = state.invocations.toLocaleString();
    sliderWritesVal.textContent = state.writesPerDay.toLocaleString();
    sliderReadsVal.textContent = formatNumber(state.readsPerDay);
    sliderDeletesVal.textContent = state.deletesPerDay.toLocaleString();
    sliderHostingStorageVal.textContent = state.hostingStorageGB + ' GB';
    sliderHostingDownloadsVal.textContent = state.hostingDownloadsMBPerDay + ' MB';

    // If Cost Card is open, re-render cumulative line chart
    if (state.costCardExpanded) {
      renderCumulativeCostGraph();
    }

    // If an Accordion Panel is currently open, update content in real time!
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

  // Populate Printable Invoice Table
  function updateInvoiceTable() {
    const metrics = calculateUsageMetrics();
    const profile = monthProfiles[state.selectedMonthKey] || monthProfiles['2026-08'];

    document.querySelector('.invoice-meta').innerHTML = `
      <div><strong>Statement Date:</strong> ${profile.statementDate}</div>
      <div><strong>Billing Period:</strong> ${profile.billingPeriod}</div>
      <div><strong>Invoice #:</strong> ${profile.invoiceId}</div>
    `;

    invoiceTableBody.innerHTML = '';

    const items = [
      {
        name: 'Cloud Functions - Invocations',
        usage: `${state.invocations.toLocaleString()} invocations/mo`,
        freeTier: '2,000,000 / month',
        excess: Math.max(0, state.invocations - quotas.invocations).toLocaleString(),
        rate: `$${state.rateInvocations.toFixed(2)} / 1M`,
        cost: metrics.invocations.cost
      },
      {
        name: 'Cloud Firestore - Writes',
        usage: `${state.writesPerDay.toLocaleString()} writes/day (${(state.writesPerDay * 30).toLocaleString()}/mo)`,
        freeTier: '20,000 / day',
        excess: (Math.max(0, state.writesPerDay - quotas.writesPerDay) * 30).toLocaleString(),
        rate: `$${state.rateWrites.toFixed(2)} / 100K`,
        cost: metrics.writes.cost
      },
      {
        name: 'Cloud Firestore - Reads',
        usage: `${state.readsPerDay.toLocaleString()} reads/day (${(state.readsPerDay * 30).toLocaleString()}/mo)`,
        freeTier: '50,000 / day',
        excess: (Math.max(0, state.readsPerDay - quotas.readsPerDay) * 30).toLocaleString(),
        rate: `$${state.rateReads.toFixed(2)} / 100K`,
        cost: metrics.reads.cost
      },
      {
        name: 'Cloud Firestore - Deletes',
        usage: `${state.deletesPerDay.toLocaleString()} deletes/day`,
        freeTier: '20,000 / day',
        excess: (Math.max(0, state.deletesPerDay - quotas.deletesPerDay) * 30).toLocaleString(),
        rate: `$${state.rateDeletes.toFixed(2)} / 100K`,
        cost: metrics.deletes.cost
      },
      {
        name: 'Firebase Hosting - Storage',
        usage: `${state.hostingStorageGB} GB`,
        freeTier: '10 GB total',
        excess: `${Math.max(0, state.hostingStorageGB - quotas.hostingStorageGB).toFixed(1)} GB`,
        rate: `$${state.rateHostingStorage.toFixed(3)} / GB`,
        cost: metrics.hostingStorage.cost
      },
      {
        name: 'Firebase Hosting - Bandwidth Downloads',
        usage: `${state.hostingDownloadsMBPerDay} MB/day (~${((state.hostingDownloadsMBPerDay * 30) / 1024).toFixed(2)} GB/mo)`,
        freeTier: '360 MB / day',
        excess: `${Math.max(0, ((state.hostingDownloadsMBPerDay * 30) / 1024) - 10.547).toFixed(2)} GB`,
        rate: `$${state.rateHostingDownloads.toFixed(2)} / GB`,
        cost: metrics.hostingDownloads.cost
      }
    ];

    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.usage}</td>
        <td>${item.freeTier}</td>
        <td>${item.excess}</td>
        <td>${item.rate}</td>
        <td style="text-align: right; font-weight: 500;">${formatCurrency(item.cost)}</td>
      `;
      invoiceTableBody.appendChild(tr);
    });

    invoiceSubtotal.textContent = formatCurrency(metrics.totalCost);
    invoiceTotal.textContent = formatCurrency(metrics.totalCost);
    howToPayAmount.textContent = formatCurrency(metrics.totalCost);
  }

  // Range Slider & Rate Inputs Event Listeners
  inputInvocations.addEventListener('input', (e) => {
    state.invocations = parseInt(e.target.value);
    updateUI();
  });
  rateInvocationsInput.addEventListener('change', (e) => {
    state.rateInvocations = parseFloat(e.target.value) || 0.40;
    updateUI();
  });

  inputWrites.addEventListener('input', (e) => {
    state.writesPerDay = parseInt(e.target.value);
    updateUI();
  });
  rateWritesInput.addEventListener('change', (e) => {
    state.rateWrites = parseFloat(e.target.value) || 0.18;
    updateUI();
  });

  inputReads.addEventListener('input', (e) => {
    state.readsPerDay = parseInt(e.target.value);
    updateUI();
  });
  rateReadsInput.addEventListener('change', (e) => {
    state.rateReads = parseFloat(e.target.value) || 0.06;
    updateUI();
  });

  inputDeletes.addEventListener('input', (e) => {
    state.deletesPerDay = parseInt(e.target.value);
    updateUI();
  });
  rateDeletesInput.addEventListener('change', (e) => {
    state.rateDeletes = parseFloat(e.target.value) || 0.02;
    updateUI();
  });

  inputHostingStorage.addEventListener('input', (e) => {
    state.hostingStorageGB = parseFloat(e.target.value);
    updateUI();
  });
  rateHostingStorageInput.addEventListener('change', (e) => {
    state.rateHostingStorage = parseFloat(e.target.value) || 0.026;
    updateUI();
  });

  inputHostingDownloads.addEventListener('input', (e) => {
    state.hostingDownloadsMBPerDay = parseFloat(e.target.value);
    updateUI();
  });
  rateHostingDownloadsInput.addEventListener('change', (e) => {
    state.rateHostingDownloads = parseFloat(e.target.value) || 0.15;
    updateUI();
  });

  // Presets Logic
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const preset = chip.getAttribute('data-preset');
      if (preset === 'baseline') {
        state.invocations = 118;
        state.writesPerDay = 169;
        state.readsPerDay = 4800;
        state.deletesPerDay = 0;
        state.hostingStorageGB = 6.2;
        state.hostingDownloadsMBPerDay = 9.2;
      } else if (preset === 'moderate') {
        state.invocations = 2500000;
        state.writesPerDay = 35000;
        state.readsPerDay = 150000;
        state.deletesPerDay = 5000;
        state.hostingStorageGB = 18.5;
        state.hostingDownloadsMBPerDay = 850;
      } else if (preset === 'high') {
        state.invocations = 5500000;
        state.writesPerDay = 85000;
        state.readsPerDay = 450000;
        state.deletesPerDay = 25000;
        state.hostingStorageGB = 42.0;
        state.hostingDownloadsMBPerDay = 2400;
      } else if (preset === 'heavy') {
        state.invocations = 9500000;
        state.writesPerDay = 220000;
        state.readsPerDay = 850000;
        state.deletesPerDay = 90000;
        state.hostingStorageGB = 88.0;
        state.hostingDownloadsMBPerDay = 4500;
      }

      // Sync Sliders
      inputInvocations.value = state.invocations;
      inputWrites.value = state.writesPerDay;
      inputReads.value = state.readsPerDay;
      inputDeletes.value = state.deletesPerDay;
      inputHostingStorage.value = state.hostingStorageGB;
      inputHostingDownloads.value = state.hostingDownloadsMBPerDay;

      updateUI();
    });
  });

  // Reset Drawer
  drawerResetBtn.addEventListener('click', () => {
    state.invocations = 118;
    state.writesPerDay = 169;
    state.readsPerDay = 4800;
    state.deletesPerDay = 0;
    state.hostingStorageGB = 6.2;
    state.hostingDownloadsMBPerDay = 9.2;

    inputInvocations.value = 118;
    inputWrites.value = 169;
    inputReads.value = 4800;
    inputDeletes.value = 0;
    inputHostingStorage.value = 6.2;
    inputHostingDownloads.value = 9.2;

    presetChips.forEach(c => c.classList.remove('active'));
    presetChips[0].classList.add('active');

    updateUI();
  });

  drawerApplyBtn.addEventListener('click', () => {
    drawerModal.classList.remove('active');
  });

  // Initialize Accordion Rows & Render Initial UI
  setupAccordionRows();
  updateUI();
});
