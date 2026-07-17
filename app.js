/**
 * ==========================================================================
 * NAVANCHI'S ATELIER — COMPREHENSIVE PRODUCTION STATE ENGINE (app.js)
 * Curated Core Ecosystem for Tab Pipelines, Database Ledgers & Chronometrics
 * ==========================================================================
 */

(function () {
    "use strict";

    // --- 1. CORE DATA DICTIONARIES & WORKSPACE PARAMS ---
    const TEMPLATE_TASK_POOL = {
        "Creative & Architectural Focus": [
            { label: "Deep Focus Workspace Block (90 Mins)", xp: 25 },
            { label: "Atelier Curated Content Wireframing", xp: 15 },
            { label: "Technical Optimization Auditing", xp: 20 }
        ],
        "Vitals, Energy & Alignment": [
            { label: "High-Volume Hydration Intake (1.5L Base)", xp: 10 },
            { label: "Somatic Breathwork & Grounding Cycle", xp: 12 },
            { label: "Nutrient-Dense Architectural Meal Sync", xp: 15 }
        ],
        "Movement, Flow & Recovery": [
            { label: "Structured Dynamic Strength Protocol", xp: 25 },
            { label: "Low-Intensity Steady State Endurance Run", xp: 20 },
            { label: "System Posture Realignment & Stretching", xp: 10 }
        ]
    };

    // --- 2. THE RUNTIME ENGINE GLOBAL STATE MATRIX ---
    let runtimeState = {
        identity: {
            signatureName: "Navanshi",
            age: 23,
            avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
        },
        telemetry: {
            totalXp: 0,
            currentLevel: 1
        },
        activeWorkspaceQueue: [],
        databaseLedgers: [],
        customInjectedNodes: {},
        biologicalAnchorDate: ""
    };

    // --- 3. SYSTEM LAUNCH & INITIALIZATION BOOTSTRAP ---
    document.addEventListener("DOMContentLoaded", () => {
        initializeClockService();
        loadSystemPersistedData();
        renderAtelierTaskPool();
        renderActiveStagedQueue();
        renderOperationalDatabaseLedgers();
        evaluateBiologicalChronometrics();
        synchronizeIdentityVisuals();
    });

    // --- 4. PERSISTENT SYSTEM CACHING MANAGEMENT ---
    function saveSystemStateToStorage() {
        try {
            localStorage.setItem("atelier_runtime_matrix", JSON.stringify(runtimeState));
        } catch (error) {
            dispatchSystemToast("Database Cache Write Interrupted", "error");
        }
    }

    function loadSystemPersistedData() {
        const structuralData = localStorage.getItem("atelier_runtime_matrix");
        if (structuralData) {
            try {
                const parsed = JSON.parse(structuralData);
                runtimeState = { ...runtimeState, ...parsed };
            } catch (e) {
                dispatchSystemToast("Cache Sync Failed. Re-initializing Workspace.", "warning");
            }
        }
    }

    // --- 5. THE CINEMATIC ENTRY PORTAL DRIVER ---
    window.triggerElegantEntry = function () {
        const portal = document.getElementById("intro-screen");
        const canvas = document.getElementById("app-canvas");
        const audioContextClass = window.AudioContext || window.webkitAudioContext;

        if (audioContextClass) {
            // Optional spatial chime trigger code safely executes here if configured
        }

        if (portal && canvas) {
            portal.classList.add("portal-dismissed");
            canvas.classList.add("atelier-canvas-active");
            
            setTimeout(() => {
                portal.style.display = "none";
                dispatchSystemToast(`Welcome back, ${runtimeState.identity.signatureName}`, "success");
            }, 1200);
        }
    };

    // --- 6. ASYNCHRONOUS DECK ROUTING NAVIGATION ---
    window.switchTab = function (panelId) {
        const activePanels = document.querySelectorAll(".workspace-panel");
        const navigationElements = document.querySelectorAll(".nav-control-element");
        const breadcrumb = document.getElementById("activeBreadcrumb");

        activePanels.forEach(panel => panel.classList.remove("active"));
        navigationElements.forEach(btn => btn.classList.remove("active"));

        const targetPanel = document.getElementById(`tab-${panelId}`);
        const targetBtn = document.querySelector(`[data-target="${panelId}"]`);

        if (targetPanel && targetBtn) {
            targetPanel.classList.add("active");
            targetBtn.classList.add("active");
        }

        if (breadcrumb) {
            const labelMaps = {
                deck: "Control Deck",
                ledger: "Ledger Workspace",
                analytics: "Cycle Analytics",
                settings: "Atelier Settings"
            };
            breadcrumb.textContent = labelMaps[panelId] || "Workspace";
        }
    };

    // --- 7. WORKSPACE POOL BUILDERS & QUANTUM CONTRAPTONS ---
    function renderAtelierTaskPool() {
        const targetContainer = document.getElementById("taskPoolTarget");
        if (!targetContainer) return;
        targetContainer.innerHTML = "";

        const unifiedPools = { ...TEMPLATE_TASK_POOL };
        Object.keys(runtimeState.customInjectedNodes).forEach(category => {
            if (!unifiedPools[category]) unifiedPools[category] = [];
            unifiedPools[category] = [...unifiedPools[category], ...runtimeState.customInjectedNodes[category]];
        });

        Object.entries(unifiedPools).forEach(([categoryName, nodes]) => {
            const groupWrap = document.createElement("div");
            groupWrap.className = "task-category-group";
            groupWrap.innerHTML = `<h5 class="category-group-headline">${categoryName}</h5>`;

            nodes.forEach(node => {
                const row = document.createElement("div");
                row.className = "atelier-dynamic-row";

                const currentCount = runtimeState.activeWorkspaceQueue.filter(item => item.label === node.label).length;

                row.innerHTML = `
                    <div class="row-label-block">
                        <span class="row-label-text">${node.label}</span>
                        <span class="row-xp-amount">+${node.xp} XP Vector</span>
                    </div>
                    <div class="atelier-incremental-controls">
                        <button class="incremental-btn" onclick="adjustQueueVector('${encodeURIComponent(node.label)}', ${node.xp}, -1)">−</button>
                        <span class="incremental-count-indicator">${currentCount}</span>
                        <button class="incremental-btn" onclick="adjustQueueVector('${encodeURIComponent(node.label)}', ${node.xp}, 1)">+</button>
                    </div>
                `;
                groupWrap.appendChild(row);
            });

            targetContainer.appendChild(groupWrap);
        });
    }

    window.adjustQueueVector = function (encodedLabel, xpWeight, delta) {
        const targetLabel = decodeURIComponent(encodedLabel);

        if (delta > 0) {
            runtimeState.activeWorkspaceQueue.push({ label: targetLabel, xp: xpWeight });
        } else {
            const matchedIndex = runtimeState.activeWorkspaceQueue.findIndex(item => item.label === targetLabel);
            if (matchedIndex !== -1) {
                runtimeState.activeWorkspaceQueue.splice(matchedIndex, 1);
            }
        }

        renderAtelierTaskPool();
        renderActiveStagedQueue();
    };

    function renderActiveStagedQueue() {
        const listFrame = document.getElementById("stagedQueueTarget");
        if (!listFrame) return;
        listFrame.innerHTML = "";

        if (runtimeState.activeWorkspaceQueue.length === 0) {
            listFrame.innerHTML = `<div class="queue-empty-statement">Atelier Deployment Queue Empty. Select nodes to stage.</div>`;
            return;
        }

        const consolidated = {};
        runtimeState.activeWorkspaceQueue.forEach(item => {
            consolidated[item.label] = (consolidated[item.label] || 0) + 1;
        });

        Object.entries(consolidated).forEach(([lbl, count]) => {
            const stagedRow = document.createElement("div");
            stagedRow.className = "queue-staged-row";
            stagedRow.innerHTML = `
                <span>${lbl}</span>
                <span class="queue-row-multiplier">×${count}</span>
            `;
            listFrame.appendChild(stagedRow);
        });
    }

    window.injectCustomNodeToAtelier = function () {
        const nameField = document.getElementById("customNodeLabel");
        const xpField = document.getElementById("customNodeXpValue");

        const targetName = nameField ? nameField.value.trim() : "";
        const targetXp = xpField ? parseInt(xpField.value, 10) : 10;

        if (!targetName) {
            dispatchSystemToast("Node Identifier Missing", "warning");
            return;
        }

        const cappedXp = Math.max(5, Math.min(50, targetXp));
        const customCategory = "User Dynamic Injections";

        if (!runtimeState.customInjectedNodes[customCategory]) {
            runtimeState.customInjectedNodes[customCategory] = [];
        }

        runtimeState.customInjectedNodes[customCategory].push({ label: targetName, xp: cappedXp });
        saveSystemStateToStorage();
        renderAtelierTaskPool();

        if (nameField) nameField.value = "";
        if (xpField) xpField.value = "";
        dispatchSystemToast("Dynamic Node Parameter Injected", "success");
    };

    // --- 8. DATABASE STORAGE & LEDGER DEPLOYMENT PIPELINE ---
    window.commitStagedQueue = function () {
        const inputTitleField = document.getElementById("ledgerTitleNameInput");
        const structuralName = inputTitleField ? inputTitleField.value.trim() : "";
        const dynamicIdentifier = structuralName || `Operational Ledger Node #${runtimeState.databaseLedgers.length + 1}`;

        if (runtimeState.activeWorkspaceQueue.length === 0) {
            dispatchSystemToast("Unable to deploy empty pipeline queue.", "warning");
            return;
        }

        const builtLedgerNode = {
            id: "ledger_node_" + Date.now() + Math.random().toString(36).substr(2, 5),
            title: dynamicIdentifier,
            timestamp: new Date().toISOString(),
            elements: runtimeState.activeWorkspaceQueue.map(item => ({ ...item, achieved: false }))
        };

        runtimeState.databaseLedgers.unshift(builtLedgerNode);
        runtimeState.activeWorkspaceQueue = [];
        
        saveSystemStateToStorage();
        renderAtelierTaskPool();
        renderActiveStagedQueue();
        renderOperationalDatabaseLedgers();

        if (inputTitleField) inputTitleField.value = "";
        dispatchSystemToast("Ledger Deployed to Environment", "success");
        window.switchTab("ledger");
    };

    function renderOperationalDatabaseLedgers() {
        const targetGrid = document.getElementById("ledgersDatabaseTarget");
        if (!targetGrid) return;
        targetGrid.innerHTML = "";

        if (runtimeState.databaseLedgers.length === 0) {
            targetGrid.innerHTML = `
                <div class="ateliar-glass-card" style="text-align:center; padding: 48px;">
                    <p style="color:var(--text-muted); font-style:italic;">No operational ledgers discovered in local database allocation.</p>
                </div>
            `;
            return;
        }

        runtimeState.databaseLedgers.forEach(ledger => {
            const envelope = document.createElement("div");
            envelope.className = "luxury-ledger-envelope";
            envelope.id = `envelope_${ledger.id}`;

            const total = ledger.elements.length;
            const verified = ledger.elements.filter(e => e.achieved).length;
            const operationalRatio = total > 0 ? Math.round((verified / total) * 100) : 0;

            const localizedDate = new Date(ledger.timestamp).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short"
            });

            envelope.innerHTML = `
                <div class="ledger-envelope-header" onclick="toggleLedgerAccordion('${ledger.id}')">
                    <div class="ledger-meta-group">
                        <span class="ledger-meta-title">${ledger.title}</span>
                        <span class="ledger-meta-timestamp">Initialization Vector: ${localizedDate}</span>
                    </div>
                    <div class="ledger-right-interface">
                        <span class="ledger-progress-status">${operationalRatio}% Complete</span>
                        <button class="ledger-purge-trigger" onclick="purgeTargetLedger('${ledger.id}', event)">🗑️</button>
                    </div>
                </div>
                <div class="ledger-envelope-body">
                    <div class="ledger-tasks-grid-list">
                        ${ledger.elements.map((elem, idx) => `
                            <div class="ledger-interactive-row ${elem.achieved ? "row-checked" : ""}" onclick="toggleElementVerification('${ledger.id}', ${idx})">
                                <div class="ledger-checkbox-wrapper">
                                    <input type="checkbox" class="atelier-native-checkbox" ${elem.achieved ? "checked" : ""} onclick="event.stopPropagation(); toggleElementVerification('${ledger.id}', ${idx});">
                                    <span>${elem.label}</span>
                                </div>
                                <span class="ledger-row-xp-badge">+${elem.xp} XP</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;

            targetGrid.appendChild(envelope);
        });
    }

    window.toggleLedgerAccordion = function (id) {
        const targetEnvelope = document.getElementById(`envelope_${id}`);
        if (targetEnvelope) {
            targetEnvelope.classList.toggle("open-envelope");
        }
    };

    window.toggleElementVerification = function (ledgerId, itemIdx) {
        const targetLedger = runtimeState.databaseLedgers.find(l => l.id === ledgerId);
        if (!targetLedger) return;

        const structuralElement = targetLedger.elements[itemIdx];
        structuralElement.achieved = !structuralElement.achieved;

        if (structuralElement.achieved) {
            processIncomingXpVectors(structuralElement.xp);
        } else {
            processIncomingXpVectors(-structuralElement.xp);
        }

        saveSystemStateToStorage();
        renderOperationalDatabaseLedgers();

        const verifiedCount = targetLedger.elements.filter(e => e.achieved).length;
        if (verifiedCount === targetLedger.elements.length) {
            dispatchSystemToast("Ledger Component Matrix Fully Executed", "success");
        }
    };

    window.purgeTargetLedger = function (ledgerId, event) {
        event.stopPropagation();
        runtimeState.databaseLedgers = runtimeState.databaseLedgers.filter(l => l.id !== ledgerId);
        saveSystemStateToStorage();
        renderOperationalDatabaseLedgers();
        dispatchSystemToast("Ledger Cleared From Database", "warning");
    };

    // --- 9. XP ALGORITHMIC ARCHIVE ENGINE ---
    function processIncomingXpVectors(amount) {
        runtimeState.telemetry.totalXp += amount;
        if (runtimeState.telemetry.totalXp < 0) runtimeState.telemetry.totalXp = 0;

        const structuralPreviousLevel = runtimeState.telemetry.currentLevel;
        
        let algorithmicLevel = 1;
        let runningTarget = 100;
        let residualXp = runtimeState.telemetry.totalXp;

        while (residualXp >= runningTarget) {
            residualXp -= runningTarget;
            algorithmicLevel++;
            runningTarget = Math.floor(100 * Math.pow(1.18, algorithmicLevel - 1));
        }

        runtimeState.telemetry.currentLevel = algorithmicLevel;
        updateVisualTelemetryComponents(residualXp, runningTarget);

        if (runtimeState.telemetry.currentLevel > structuralPreviousLevel) {
            triggerLevelCelebrationOverlay(runtimeState.telemetry.currentLevel);
        }
    }

    function updateVisualTelemetryComponents(currentRemainderXp, targetThreshold) {
        const fillBar = document.getElementById("xpProgressFillBar");
        const textLabel = document.getElementById("levelOutput");

        const computationalPercentage = (currentRemainderXp / targetThreshold) * 100;

        if (fillBar) fillBar.style.width = `${computationalPercentage}%`;
        if (textLabel) textLabel.textContent = runtimeState.telemetry.currentLevel;
    }

    // --- 10. BIOLOGICAL CHRONOMETRICS CALCULATOR ---
    window.executeCycleChronometrics = function () {
        const inputField = document.getElementById("cycleAnchorField");
        if (!inputField) return;

        const selectedDateString = inputField.value;
        if (!selectedDateString) {
            dispatchSystemToast("Please select reference structural date anchor.", "warning");
            return;
        }

        runtimeState.biologicalAnchorDate = selectedDateString;
        saveSystemStateToStorage();
        evaluateBiologicalChronometrics();
        dispatchSystemToast("Hormonal Rhythms Computed", "success");
    };

    function evaluateBiologicalChronometrics() {
        const gridContainer = document.getElementById("cycleChronologyGrid");
        const internalField = document.getElementById("cycleAnchorField");
        
        if (!gridContainer) return;

        if (internalField && runtimeState.biologicalAnchorDate) {
            internalField.value = runtimeState.biologicalAnchorDate;
        }

        if (!runtimeState.biologicalAnchorDate) {
            gridContainer.innerHTML = `
                <div class="ateliar-glass-card" style="grid-column: 1 / -1; text-align:center;">
                    <p style="color:var(--text-muted); font-style: italic;">Provide an anchor initialization metric to calibrate tracking engines.</p>
                </div>
            `;
            return;
        }

        const calculatedAnchor = new Date(runtimeState.biologicalAnchorDate);
        const presentDay = new Date();
        const durationDelta = presentDay - calculatedAnchor;
        
        const daysVariance = Math.floor(durationDelta / (1000 * 60 * 60 * 24));
        const systemCycleLoopLength = 28;
        const currentCalibratedDay = ((daysVariance % systemCycleLoopLength) + systemCycleLoopLength) % systemCycleLoopLength || systemCycleLoopLength;

        gridContainer.innerHTML = "";

        const architecturalPhases = [
            { label: "Menstrual Renewal Phase (Day 1-5)", range: [1, 5], text: "Prioritize systemic restoration, soft restorative workloads, and low somatic nervous physical output vectors." },
            { label: "Follicular Amplification Phase (Day 6-12)", range: [6, 12], text: "Optimized threshold window for core workspace generation, intense focus projects, and strategic layout design integrations." },
            { label: "Ovulatory Peak Production (Day 13-17)", range: [13, 17], text: "Peak physical stamina parameters achieved. Maximize interpersonal project networking, team reviews, and heavy load blocks." },
            { label: "Luteal Stabilization Phase (Day 18-28)", range: [18, 28] , text: "Aerobic capacity transition window. Focus on completing open loops, documentation cleanups, and stabilization routines." }
        ];

        architecturalPhases.forEach(phase => {
            const isTargetActive = currentCalibratedDay >= phase.range[0] && currentCalibratedDay <= phase.range[1];
            const plate = document.createElement("div");
            plate.className = `biological-phase-plate ${isTargetActive ? "active-biological-phase" : ""}`;

            plate.innerHTML = `
                <h5 class="phase-plate-title">${phase.label}</h5>
                <p class="phase-plate-description">${phase.text}</p>
                <span class="phase-plate-telemetry">${isTargetActive ? "● System Core Rhythms Calibrated Here" : "Standby Array"}</span>
            `;

            gridContainer.appendChild(plate);
        });
    }

    // --- 11. ATELIER PROFILE IDENTITY INTEGRATION CONTROLLER ---
    window.commitAtelierIdentity = function (event) {
        event.preventDefault();
        
        const sigField = document.getElementById("settingSignatureName");
        const ageField = document.getElementById("settingUserAge");
        const urlField = document.getElementById("settingAvatarUrl");

        if (sigField) runtimeState.identity.signatureName = sigField.value.trim() || runtimeState.identity.signatureName;
        if (ageField) runtimeState.identity.age = parseInt(ageField.value, 10) || runtimeState.identity.age;
        if (urlField) runtimeState.identity.avatarUrl = urlField.value.trim() || runtimeState.identity.avatarUrl;

        saveSystemStateToStorage();
        synchronizeIdentityVisuals();
        dispatchSystemToast("Identity Constants Updated", "success");
    };

    function synchronizeIdentityVisuals() {
        const textTarget = document.getElementById("sidebarUserName");
        const avatarTarget = document.getElementById("userAvatarFrame");

        const setupInpSig = document.getElementById("settingSignatureName");
        const setupInpAge = document.getElementById("settingUserAge");
        const setupInpUrl = document.getElementById("settingAvatarUrl");

        if (textTarget) textTarget.textContent = runtimeState.identity.signatureName;
        if (avatarTarget) avatarTarget.src = runtimeState.identity.avatarUrl;

        if (setupInpSig) setupInpSig.value = runtimeState.identity.signatureName;
        if (setupInpAge) setupInpAge.value = runtimeState.identity.age;
        if (setupInpUrl) setupInpUrl.value = runtimeState.identity.avatarUrl;
    }

    // --- 12. FLOATING ASYNCHRONOUS TOAST TOKEN ENGINE ---
    function dispatchSystemToast(statement, validationType = "info") {
        const systemHolder = document.getElementById("atelierToastSystem");
        if (!systemHolder) return;

        const token = document.createElement("div");
        token.className = "toast-token";
        
        let dynamicEmblem = "💡";
        if (validationType === "success") dynamicEmblem = "🌸";
        if (validationType === "warning") dynamicEmblem = "⚡";
        if (validationType === "error") dynamicEmblem = "🚨";

        token.innerHTML = `<span>${dynamicEmblem}</span><span>${statement}</span>`;
        systemHolder.appendChild(token);

        setTimeout(() => {
            token.classList.add("fade-out");
            setTimeout(() => {
                token.remove();
            }, 500);
        }, 3500);
    }

    // --- 13. GLASS CELEBRATION MODAL CONTROLLER ---
    function triggerLevelCelebrationOverlay(lvl) {
        const overlay = document.getElementById("levelUpOverlayContainer");
        const labelText = document.getElementById("rewardLvlIndicator");

        if (labelText) labelText.textContent = lvl;
        if (overlay) overlay.classList.add("modal-active");
    }

    window.dismissLevelUpOverlay = function () {
        const overlay = document.getElementById("levelUpOverlayContainer");
        if (overlay) overlay.classList.remove("modal-active");
        dispatchSystemToast("System Telemetry Recalibrated", "info");
    };

    // --- 14. DYNAMIC SYSTEM TICK TIME COMPONENT ---
    function initializeClockService() {
        const display = document.getElementById("systemClock");
        if (!display) return;

        setInterval(() => {
            const date = new Date();
            display.textContent = date.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }, 1000);
    }

})();
