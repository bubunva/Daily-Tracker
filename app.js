// ==========================================================================
// SYSTEM PARAMETERS & POOL STRUCTURES
// ==========================================================================
const DEFAULT_TASK_POOL = {
    "Vitals & Energy": [
        { label: "High-Volume Hydration Intake (1L Base)", xp: 12 },
        { label: "Optimal Nutrient Meal Prep Intake", xp: 15 },
        { label: "Extended Breathwork & Cold Exposure Session", xp: 10 }
    ],
    "Focus & Production": [
        { label: "Deep Focus Session (90-min Block)", xp: 25 },
        { label: "Priority Backlog Queue Cleared", xp: 20 },
        { label: "Strategic Review & Tomorrow Sync", xp: 12 }
    ],
    "Movement & Core": [
        { label: "Structured Lift / Training Protocol", xp: 25 },
        { label: "Zone 2 Endurance Session (45 Mins)", xp: 20 },
        { label: "System Recovery & Stretching Routine", xp: 10 }
    ]
};

const DEFAULT_MILESTONES = [
    { level: 5, rewardName: "Custom Accent Color Profile Unlocked", details: "Gain access to edit system accent variables manually inside settings." },
    { level: 10, rewardName: "Elite Badge Custom Design Tool", details: "Create customized badges with customized hex codes and custom icons." },
    { level: 15, rewardName: "Data Analytics Cloud Automation Pipeline", details: "Sync your analytics telemetry automatically directly to cloud buckets." },
    { level: 20, rewardName: "Custom Font & Premium System Sound Pack", details: "Unlock custom premium system sound packages and custom dashboard fonts." }
];

const DEFAULT_ACHIEVEMENTS = [
    { id: "first_led", label: "First Ledger", details: "Successfully commit a new system operational ledger to memory storage.", xp: 50, unlocked: false },
    { id: "level_five", label: "Clearance Level 5", details: "Surpass current operating parameters to clear authentication for Rank Level 5.", xp: 150, unlocked: false },
    { id: "custom_inj", label: "Hardware Custom Injection", details: "Design and successfully inject a custom tracking block node.", xp: 50, unlocked: false },
    { id: "completionist", label: "Execution Master", details: "Successfully execute and verify every component on any operational ledger.", xp: 200, unlocked: false }
];

// ROMANTIC LOVE LETTER DATA MATRIX
const SECRET_LETTER_TEXT = `Hey,

I know it started eight months ago. But during those eight months, you have become someone irreplaceable in my life. I cannot replace you even if I wanted to. I love you a lot. 

I just want to tell you that the letter I wrote is not AI, and it was never AI. I wrote it, but if you think it's AI, I wanna say everything I want to with my words. Like, I'm speaking this out, but, you know, the Google keyboard is typing it. 

If you don't feel like you're not loved, I just want you to remember that everything I do is for you. For you to feel better. And no, I don't want to replace you. I don't want to look for someone else because I love you. I want to be with you, forever. And it's my choice to be with you. I have chosen you for life. I hope you have done the same. 

I don't know how your mind is working right now, but I'm trying to imprint myself as much as I can. And yeah, I will keep trying. And I, I don't know that you know that I care a lot for you. Because I really do try a lot. And yeah. 

I'm sorry for not being the streamer, especially, but I'll try my best, okay? 

I love you. Bye-bye.

Happy eight months, baby. ❤️`;

// Local state engines
let activeUser = null;
let currentXp = 0;
let currentLvl = 1;
let currentWorkspaceQueue = [];
let databaseRoutines = [];
let localCustomTaskPool = JSON.parse(localStorage.getItem('customTaskPool')) || {};
let claimedRewards = JSON.parse(localStorage.getItem('claimedRewards')) || [];

// ==========================================================================
// CORE SYSTEM STORAGE SYNCS
// ==========================================================================
function saveLocalState() {
    localStorage.setItem('xp_progress', currentXp);
    localStorage.setItem('xp_level', currentLvl);
    localStorage.setItem('local_routines', JSON.stringify(databaseRoutines));
    localStorage.setItem('claimedRewards', JSON.stringify(claimedRewards));
}

function loadLocalState() {
    currentXp = parseInt(localStorage.getItem('xp_progress')) || 0;
    currentLvl = parseInt(localStorage.getItem('xp_level')) || 1;
    databaseRoutines = JSON.parse(localStorage.getItem('local_routines')) || [];
    renderSystemHudTelemetry();
}

// ==========================================================================
// APP NAVIGATION SYSTEM
// ==========================================================================
window.navigate = function(panelId) {
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mobile-dock-item').forEach(btn => btn.classList.remove('active'));

    const targetPanel = document.getElementById(`panel-${panelId}`);
    if (targetPanel) targetPanel.classList.add('active');

    const desktopBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => {
        const attr = btn.getAttribute('onclick');
        return attr && attr.includes(panelId);
    });
    if (desktopBtn) desktopBtn.classList.add('active');

    const mobileBtn = Array.from(document.querySelectorAll('.mobile-dock-item')).find(btn => {
        const attr = btn.getAttribute('onclick');
        return attr && attr.includes(panelId);
    });
    if (mobileBtn) mobileBtn.classList.add('active');
};

// ==========================================================================
// THEME CORE ENGINE
// ==========================================================================
window.toggleThemeSystem = function() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
};

// ==========================================================================
// AMBIENT PARTICLE BACKGROUND
// ==========================================================================
function initAmbientBackground() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    const particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
    }));

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });

    function loop() {
        ctx.clearRect(0, 0, w, h);
        
        // If secret pink mode is active, make the particles soft floating hearts/pink bubbles
        if (document.body.classList.contains('cherry-theme')) {
            ctx.fillStyle = '#ff8fa3';
        } else {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-glow').trim() || '#ff6b8b';
        }
        
        ctx.globalAlpha = 0.2;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1.0;
        requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================================================
// PROGRESS & LEVEL CALCULATIONS
// ==========================================================================
function addSystemXp(amount) {
    currentXp += amount;
    const oldLevel = currentLvl;
    
    let calculatedLevel = 1;
    let xpTarget = 100;
    let tempXp = currentXp;

    while (tempXp >= xpTarget) {
        tempXp -= xpTarget;
        calculatedLevel++;
        xpTarget = Math.floor(100 * Math.pow(1.15, calculatedLevel - 1));
    }

    currentLvl = calculatedLevel;
    saveLocalState();
    renderSystemHudTelemetry();

    if (currentLvl > oldLevel) {
        triggerMilestoneModal(currentLvl);
    }
}

function renderSystemHudTelemetry() {
    let xpTarget = 100;
    let tempXp = currentXp;
    let calculatedLevel = 1;

    while (tempXp >= xpTarget) {
        tempXp -= xpTarget;
        calculatedLevel++;
        xpTarget = Math.floor(100 * Math.pow(1.15, calculatedLevel - 1));
    }

    const percentage = (tempXp / xpTarget) * 100;
    
    const lvlElement = document.getElementById('lvlOut');
    const barElement = document.getElementById('barOut');
    if (lvlElement) lvlElement.textContent = currentLvl;
    if (barElement) barElement.style.width = `${percentage}%`;
    
    renderMilestonesDashboard();
    updateAchievementsMatrix();
}

// ==========================================================================
// WORKSPACE CONTROL DECK
// ==========================================================================
function renderTaskMatrixPool() {
    const container = document.getElementById('categorizedMatrixContainer');
    if (!container) return;
    container.innerHTML = '';

    const combinedPool = { ...DEFAULT_TASK_POOL };
    Object.keys(localCustomTaskPool).forEach(cat => {
        if (!combinedPool[cat]) combinedPool[cat] = [];
        combinedPool[cat] = [...combinedPool[cat], ...localCustomTaskPool[cat]];
    });

    Object.entries(combinedPool).forEach(([categoryName, tasks]) => {
        const wrap = document.createElement('div');
        wrap.className = 'category-group-wrapper';
        wrap.innerHTML = `<div class="category-header-title">${categoryName}</div>`;

        tasks.forEach(task => {
            const row = document.createElement('div');
            row.className = 'matrix-interactive-row';
            
            const currentQueueCount = currentWorkspaceQueue.filter(t => t.label === task.label).length;

            row.innerHTML = `
                <div class="row-meta-info">${task.label} <span>+${task.xp} XP</span></div>
                <div class="counter-pill">
                    <button class="counter-btn" onclick="window.adjustQueueAmount('${encodeURIComponent(task.label)}', ${task.xp}, -1)">-</button>
                    <div class="counter-lbl">${currentQueueCount}</div>
                    <button class="counter-btn" onclick="window.adjustQueueAmount('${encodeURIComponent(task.label)}', ${task.xp}, 1)">+</button>
                </div>
            `;
            wrap.appendChild(row);
        });

        container.appendChild(wrap);
    });
}

window.adjustQueueAmount = function(taskLabelEncoded, xpVal, delta) {
    const label = decodeURIComponent(taskLabelEncoded);
    if (delta > 0) {
        currentWorkspaceQueue.push({ label, xp: xpVal });
    } else {
        const idx = currentWorkspaceQueue.findIndex(item => item.label === label);
        if (idx !== -1) currentWorkspaceQueue.splice(idx, 1);
    }
    renderTaskMatrixPool();
    renderQueueReviewList();
};

function renderQueueReviewList() {
    const container = document.getElementById('stagedReview');
    if (!container) return;
    container.innerHTML = '';

    if (currentWorkspaceQueue.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 24px; color:var(--text-secondary); font-size:0.95rem;">Queue is empty. Select modules.</div>`;
        return;
    }

    const grouped = {};
    currentWorkspaceQueue.forEach(item => {
        grouped[item.label] = (grouped[item.label] || 0) + 1;
    });

    Object.entries(grouped).forEach(([lbl, count]) => {
        const div = document.createElement('div');
        div.className = 'queue-item-strip';
        div.textContent = `x${count} — ${lbl}`;
        container.appendChild(div);
    });
}

window.commitRoutineString = function() {
    const titleInput = document.getElementById('registryTitle');
    const title = titleInput.value.trim() || `Operational Ledger #${databaseRoutines.length + 1}`;

    if (currentWorkspaceQueue.length === 0) {
        alert("Select at least one workspace element first.");
        return;
    }

    const newLedger = {
        id: 'ledger_' + Date.now(),
        title: title,
        timestamp: new Date().toISOString(),
        tasks: currentWorkspaceQueue.map(item => ({ ...item, done: false }))
    };

    databaseRoutines.unshift(newLedger);
    saveLocalState();
    
    currentWorkspaceQueue = [];
    titleInput.value = '';
    
    renderTaskMatrixPool();
    renderQueueReviewList();
    renderSavedLedgerPanels();
    
    window.navigate('saved');
    triggerAchievementUnlock("first_led");
};

window.addNewCustomTaskToPool = function() {
    const nameInp = document.getElementById('customTaskName');
    const xpInp = document.getElementById('customTaskXp');
    
    const name = nameInp.value.trim();
    const xp = Math.min(30, parseInt(xpInp.value) || 10);

    if (!name) return;

    if (!localCustomTaskPool["User Custom Modules"]) {
        localCustomTaskPool["User Custom Modules"] = [];
    }

    localCustomTaskPool["User Custom Modules"].push({ label: name, xp: xp });
    localStorage.setItem('customTaskPool', JSON.stringify(localCustomTaskPool));

    nameInp.value = '';
    xpInp.value = '';

    renderTaskMatrixPool();
    triggerAchievementUnlock("custom_inj");
};

// ==========================================================================
// OPERATIONAL LEDGER RENDER ENGINE
// ==========================================================================
function renderSavedLedgerPanels() {
    const container = document.getElementById('savedContainer');
    if (!container) return;
    container.innerHTML = '';

    if (databaseRoutines.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 48px; color:var(--text-secondary); font-weight:700;">No active operational ledgers found. Design one in the Control Deck.</div>`;
        return;
    }

    databaseRoutines.forEach(ledger => {
        const wrapper = document.createElement('div');
        wrapper.className = 'timeline-card-wrapper';

        const totalTasks = ledger.tasks.length;
        const doneTasks = ledger.tasks.filter(t => t.done).length;
        const completePercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

        const header = document.createElement('div');
        header.className = 'timeline-card-header';
        header.innerHTML = `
            <div>
                <span style="font-size:1.15rem; display:block; font-weight:800;">${ledger.title}</span>
                <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:500;">Deployed: ${new Date(ledger.timestamp).toLocaleString()}</span>
            </div>
            <div style="display:flex; align-items:center; gap:16px;">
                <span style="color:var(--accent-glow); font-size:1.1rem; font-weight:900;">${completePercent}%</span>
                <button onclick="window.purgeOperationalLedger('${ledger.id}', event)" style="background:none; border:none; cursor:pointer; font-size:1.3rem;">🗑️</button>
            </div>
        `;

        const body = document.createElement('div');
        body.className = 'timeline-card-body-accordion';

        header.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            body.classList.toggle('open');
        });

        const listWrap = document.createElement('div');
        listWrap.className = 'sub-timeline-section';

        ledger.tasks.forEach((task, index) => {
            const row = document.createElement('div');
            row.className = `interactive-task-row ${task.done ? 'checked' : ''}`;
            row.innerHTML = `
                <div class="premium-checkbox-wrapper">
                    <input type="checkbox" ${task.done ? 'checked' : ''} onchange="window.toggleTaskItemStatus('${ledger.id}', ${index})">
                    <span>${task.label}</span>
                </div>
                <div style="font-weight:900; font-size:0.95rem; color:var(--accent-glow);">+${task.xp} XP</div>
            `;
            listWrap.appendChild(row);
        });

        body.appendChild(listWrap);
        wrapper.appendChild(header);
        wrapper.appendChild(body);
        container.appendChild(wrapper);
    });
}

window.toggleTaskItemStatus = function(ledgerId, taskIndex) {
    const ledger = databaseRoutines.find(l => l.id === ledgerId);
    if (!ledger) return;

    const task = ledger.tasks[taskIndex];
    task.done = !task.done;

    if (task.done) {
        addSystemXp(task.xp);
    } else {
        addSystemXp(-task.xp);
    }

    saveLocalState();
    renderSavedLedgerPanels();

    const isAllComplete = ledger.tasks.every(t => t.done);
    if (isAllComplete) {
        triggerAchievementUnlock("completionist");
    }
};

window.purgeOperationalLedger = function(ledgerId, event) {
    event.stopPropagation();
    if (!confirm("Confirm complete ledger database removal?")) return;
    
    databaseRoutines = databaseRoutines.filter(l => l.id !== ledgerId);
    saveLocalState();
    renderSavedLedgerPanels();
};

// ==========================================================================
// REWARDS & ACHIEVEMENTS TRACKING
// ==========================================================================
function renderMilestonesDashboard() {
    const grid = document.getElementById('rewardsMatrixGrid');
    if (!grid) return;
    grid.innerHTML = '';

    DEFAULT_MILESTONES.forEach(m => {
        const isLevelMet = currentLvl >= m.level;
        const isClaimed = claimedRewards.includes(m.level);
        
        const card = document.createElement('div');
        card.className = `reward-node-card ${isLevelMet && !isClaimed ? 'claimable' : ''} ${isClaimed ? 'claimed' : ''}`;

        let actionBtnText = "Locked Node";
        if (isClaimed) {
            actionBtnText = "Node Claimed";
        } else if (isLevelMet) {
            actionBtnText = "Claim Clearance";
        }

        card.innerHTML = `
            <div class="node-tier-title">LEVEL ${m.level}</div>
            <div style="font-weight:700; font-size:1.15rem;">${m.rewardName}</div>
            <p style="margin:0; font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">${m.details}</p>
            <button class="node-trigger-btn" ${!isLevelMet || isClaimed ? 'disabled' : ''} onclick="window.claimPlatformRewardNode(${m.level})">${actionBtnText}</button>
        `;
        grid.appendChild(card);
    });
}

window.claimPlatformRewardNode = function(lvl) {
    if (claimedRewards.includes(lvl)) return;
    claimedRewards.push(lvl);
    saveLocalState();
    renderMilestonesDashboard();
    alert("Clearance successfully claimed! Check active status inside profile customizer settings.");
};

function updateAchievementsMatrix() {
    const grid = document.getElementById('achievementsMatrixGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const localUnlockedStatus = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];

    DEFAULT_ACHIEVEMENTS.forEach(ach => {
        const isUnlocked = localUnlockedStatus.includes(ach.id);
        const card = document.createElement('div');
        card.className = `achievement-node-card ${isUnlocked ? 'unlocked' : ''}`;
        
        card.innerHTML = `
            <div class="badge-avatar-icon">💎</div>
            <div style="font-weight:900; font-size:1.25rem;">${ach.label}</div>
            <p style="margin:0; font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">${ach.details}</p>
            <div style="font-size:0.8rem; font-weight:800; color:var(--accent-glow); text-transform:uppercase;">Reward: +${ach.xp} XP</div>
        `;
        grid.appendChild(card);
    });
}

function triggerAchievementUnlock(achId) {
    const localUnlockedStatus = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
    if (localUnlockedStatus.includes(achId)) return;

    localUnlockedStatus.push(achId);
    localStorage.setItem('unlockedAchievements', JSON.stringify(localUnlockedStatus));

    const match = DEFAULT_ACHIEVEMENTS.find(a => a.id === achId);
    if (match) {
        addSystemXp(match.xp);
        alert(`🏆 Achievement Unlocked: ${match.label}\n+${match.xp} XP Awarded!`);
    }
    updateAchievementsMatrix();
}

// ==========================================================================
// CYCLE ANALYTICS ENGINE
// ==========================================================================
window.processCycleMetrics = function() {
    const anchorInput = document.getElementById('cycleAnchor');
    const outputGrid = document.getElementById('cycleOutputDashboard');
    if (!anchorInput || !outputGrid) return;
    
    const anchorStr = anchorInput.value;
    if (!anchorStr) {
        alert("Please set an Anchor Matrix Date target.");
        return;
    }

    localStorage.setItem('cycle_anchor_date', anchorStr);

    const anchorDate = new Date(anchorStr);
    const today = new Date();
    
    const timeDiff = today - anchorDate;
    const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    const cycleLength = 28;
    const currentDay = ((diffDays % cycleLength) + cycleLength) % cycleLength || 28;

    outputGrid.innerHTML = '';

    const phaseConfig = [
        { title: "Menstrual Phase (Day 1-5)", desc: "Priority: Recovery, restorative work, low intensity load models.", range: [1, 5] },
        { title: "Follicular Phase (Day 6-12)", desc: "Priority: High-volume output, new workspace structural implementation.", range: [6, 12] },
        { title: "Ovulatory Phase (Day 13-17)", desc: "Priority: Peak strength parameters, maximum focus blocks.", range: [13, 17] },
        { title: "Luteal Phase (Day 18-28)", desc: "Priority: Aerobic capacity adaptation, endurance progression grids.", range: [18, 28] }
    ];

    phaseConfig.forEach(p => {
        const isActive = currentDay >= p.range[0] && currentDay <= p.range[1];
        const card = document.createElement('div');
        card.className = `cycle-data-card ${isActive ? 'active-phase' : ''}`;
        card.innerHTML = `
            <div style="font-weight:900; font-size:1.25rem; margin-bottom:8px;">${p.title}</div>
            <p style="margin:0 0 16px 0; font-size:0.9rem; color:var(--text-secondary); line-height:1.4;">${p.desc}</p>
            <div style="font-weight:800; font-size:0.8rem; color:${isActive ? 'var(--accent-glow)' : 'var(--text-secondary)'}; text-transform:uppercase;">
                ${isActive ? '🔴 ACTIVE INTERNAL HORMONAL BIOMETRIC STATE' : 'STANDBY PHASE STATUS'}
            </div>
        `;
        outputGrid.appendChild(card);
    });
};

// ==========================================================================
// CINEMATIC NETFLIX ZOOM LOADING ANIMATION
// ==========================================================================
window.triggerNetflixZoom = function() {
    const screen = document.getElementById('intro-screen');
    const brand = document.getElementById('introBrandText');
    const container = document.getElementById('app-container');

    brand.style.transition = "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.8s ease";
    brand.style.transform = "scale(8)";
    brand.style.opacity = "0";

    setTimeout(() => {
        screen.classList.add('hidden');
        container.classList.add('visible');
        
        // If they unlocked the letter, start rendering it line-by-line right after intro ends!
        if (screen.classList.contains('cherry-intro')) {
            startTypewriterLetterAnimation();
        }
    }, 850);
};

// ==========================================================================
// THE SECRET 8-MONTH ANNIVERSARY SURPRISE ENGINE
// ==========================================================================
window.triggerSecretLetter = function() {
    const introScreen = document.getElementById('intro-screen');
    const brandText = document.getElementById('introBrandText');
    const actionBtn = document.getElementById('introActionBtn');

    // 1. Trigger beautiful pastel pink layout transformation
    document.body.classList.add('cherry-theme');
    
    // 2. Hide dashboard container temporarily
    document.getElementById('app-container').classList.remove('visible');
    
    // 3. Reset and custom style the intro screen for her
    introScreen.className = 'cherry-intro'; 
    brandText.innerHTML = "HAPPY 8 MONTHS";
    brandText.style.transform = "scale(1)";
    brandText.style.opacity = "1";
    actionBtn.textContent = "Open Surprise";
    
    // Switch navigation panel to the secret pane
    window.navigate('secret');
    
    // Clear display container content first to start fresh
    document.getElementById('letterTextDisplay').innerHTML = '';

    // Bring the gorgeous intro card back to life
    introScreen.classList.remove('hidden');
};

function startTypewriterLetterAnimation() {
    const container = document.getElementById('letterTextDisplay');
    container.innerHTML = ''; // Fresh clean slate
    
    // Break letter content into blocks/paragraphs
    const lines = SECRET_LETTER_TEXT.split('\n');
    
    lines.forEach((lineText, index) => {
        const lineElement = document.createElement('div');
        lineElement.className = 'letter-line';
        lineElement.textContent = lineText;
        
        // If line is empty, represent it nicely as a spacing block
        if (lineText.trim() === '') {
            lineElement.style.height = '1.5rem';
        }
        
        container.appendChild(lineElement);
        
        // Stagger line reveal speeds beautifully
        setTimeout(() => {
            lineElement.classList.add('fade-in');
        }, index * 1800); 
    });
}

// ==========================================================================
// MILESTONE AWARD REEEM MODAL
// ==========================================================================
function triggerMilestoneModal(level) {
    const modal = document.getElementById('congratulationsRewardModal');
    const lvlText = document.getElementById('rewardMilestoneLevelText');
    
    if (lvlText) lvlText.textContent = level;
    if (modal) modal.classList.add('open');

    if (level >= 5) {
        triggerAchievementUnlock("level_five");
    }
}

window.selectRewardPathOption = function() {
    document.getElementById('congratulationsRewardModal').classList.remove('open');
    window.navigate('rewards');
};

// ==========================================================================
// AUTHENTICATION & DISPATCH DRAWERS
// ==========================================================================
window.toggleAuthDrawer = function() {
    document.getElementById('authActionsDrawer').classList.toggle('hidden');
};

// ==========================================================================
// LOCAL HOST SYSTEM INTIALIZATION ENTRYPOINT
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initAmbientBackground();
    loadLocalState();
    
    renderTaskMatrixPool();
    renderQueueReviewList();
    renderSavedLedgerPanels();

    const storedDate = localStorage.getItem('cycle_anchor_date');
    if (storedDate) {
        const anchorField = document.getElementById('cycleAnchor');
        if (anchorField) anchorField.value = storedDate;
        window.processCycleMetrics();
    }
});
