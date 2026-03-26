/* wbskt-sidebar.js — inject sidebar (for ROOT-level pages: reference.html, workflow.html) */
(function() {
    const SIDEBAR_HTML = `
<nav class="sidebar">
    <a href="index.html" class="sidebar-logo">WBSKT</a>
    <div class="sidebar-section">Core</div>
    <a href="reference.html" class="sidebar-link" data-page="reference">Reference Index</a>
    <a href="workflow.html" class="sidebar-link" data-page="workflow">Workflow Definitions</a>
    <div class="sidebar-section">Trigger Nodes</div>
    <a href="trigger-http.html" class="sidebar-link" data-page="trigger-http">HTTP Webhook</a>
    <a href="trigger-scheduled.html" class="sidebar-link" data-page="trigger-scheduled">Scheduled</a>
    <a href="trigger-polling.html" class="sidebar-link" data-page="trigger-polling">Polling / Watcher</a>
    <a href="trigger-manual.html" class="sidebar-link" data-page="trigger-manual">Manual Event</a>
    <a href="trigger-mqtt.html" class="sidebar-link" data-page="trigger-mqtt">MQTT Telemetry</a>
    <div class="sidebar-section">Logic &amp; Control</div>
    <a href="loop-static-for.html" class="sidebar-link" data-page="loop-static-for">Static For-Loop</a>
    <a href="#" class="sidebar-link coming-soon">Logic Gate <span class="cs-tooltip-wrap"><span class="cs-badge">Soon</span></span></a>
    <a href="#" class="sidebar-link coming-soon">Fan-In Gate <span class="cs-tooltip-wrap"><span class="cs-badge">Soon</span></span></a>
    <div class="sidebar-section">Action Nodes</div>
    <a href="#" class="sidebar-link coming-soon">Send Command <span class="cs-tooltip-wrap"><span class="cs-badge">Soon</span></span></a>
    <a href="#" class="sidebar-link coming-soon">HTTP Request <span class="cs-tooltip-wrap"><span class="cs-badge">Soon</span></span></a>
    <a href="#" class="sidebar-link coming-soon">Slack / Email <span class="cs-tooltip-wrap"><span class="cs-badge">Soon</span></span></a>
</nav>`;
    const activePage = document.body.dataset.page || '';
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.insertAdjacentHTML('afterbegin', SIDEBAR_HTML);
        document.querySelectorAll('.sidebar-link[data-page]').forEach(l => {
            if (l.dataset.page === activePage) l.classList.add('active');
        });
    }
})();
