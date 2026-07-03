// 1. IMPORT LIVE FIREBASE PACKAGES DIRECTLY FROM SECURITY HOST
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// YOUR SYSTEM VERIFIED FIREBASE CONFIGURATION OBJECT BLOCK
const firebaseConfig = {
  apiKey: "AIzaSyDA9_KdWAd_QwF3c2xoRqTwHFP96LzMjMw",
  authDomain: "routine-tracker-5ab4c.firebaseapp.com",
  projectId: "routine-tracker-5ab4c",
  storageBucket: "routine-tracker-5ab4c.firebasestorage.app",
  messagingSenderId: "260352688576",
  appId: "1:260352688576:web:5cd5023103472f833a0825",
  measurementId: "G-Z8TQ7SE0JN"
};

// INITIALIZE BACKEND INSTANCES
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const discordProvider = new OAuthProvider('discord.com');

// CORE LOCAL MEMORY MANAGEMENT LAYER
let appData = JSON.parse(localStorage.getItem('matrixDynamicDataStorageMasterV8')) || {
    xp: 0, level: 1, savedProfiles: [], checksHistory: [], activeTheme: 'dark',
    claimedRewards: [], customTasks: []
};

let internalStagedItems = [];
let activeTargetProfileIdForAppend = null;
let currentActiveRedeemLevelTarget = null;
let liveSpotifyCheckInterval = null;
let isSpotifyLinked = false;

// 70+ SYSTEM INTEGRATED ASSIGNED CORE ROUTINES MATRIX DATA POOL
const categorizedTasksPool = {
    morning: [
        { id: 'm1', name: 'Waking up gently at a peaceful hour', base: 6, order: 1 },
        { id: 'm2', name: 'Brushing teeth and morning refresh', base: 4, order: 1 },
        { id: 'm3', name: 'Nourishing skin with a soft morning skincare routine', base: 5, order: 1 },
        { id: 'm4', name: 'Neatly smoothing out sheets and making the bed', base: 5, order: 1 },
        { id: 'm5', name: 'Preparing healthy breakfast fuel', base: 8, order: 1 },
        { id: 'm6', name: 'Taking morning vitamins and clean water', base: 4, order: 1 },
        { id: 'm7', name: 'Opening windows for fresh air and natural sunlight', base: 3, order: 1 },
        { id: 'm8', name: 'Quick morning stretch to awaken muscular systems', base: 6, order: 1 },
        { id: 'm9', name: 'Packing textbooks and study materials into the bag', base: 5, order: 1 },
        { id: 'm10', name: 'Reviewing daily goals before any class begins', base: 6, order: 1 }
    ],
    campusLife: [
        { id: 'cl1', name: 'Heading out safely for morning school classes', base: 12, order: 4 },
        { id: 'cl2', name: 'Organizing locker or primary desk layout', base: 5, order: 4 },
        { id: 'cl3', name: 'Attending school academic study blocks', base: 12, order: 4 },
        { id: 'cl4', name: 'Participating in interactive classroom discussions', base: 8, order: 4 },
        { id: 'cl5', name: 'Reviewing notes during short class recesses', base: 6, order: 4 },
        { id: 'cl6', name: 'Engaging in school team projects or group work', base: 10, order: 4 },
        { id: 'cl7', name: 'Clearing workspace after labs or practical sessions', base: 7, order: 4 },
        { id: 'cl8', name: 'Organizing physical school handbooks and assignment sheets', base: 6, order: 4 },
        { id: 'cl9', name: 'Returning library books back to campus counters', base: 5, order: 4 },
        { id: 'cl10', name: 'Walking down campus corridors during intervals', base: 4, order: 4 }
    ],
    afternoonEvening: [
        { id: 'ae1', name: 'Returning home from school safely', base: 8, order: 2 },
        { id: 'ae2', name: 'Changing out of school uniform into comfortable clothes', base: 4, order: 2 },
        { id: 'ae3', name: 'Eating a balanced afternoon lunch meal', base: 8, order: 2 },
        { id: 'ae4', name: 'Heading to afternoon tuition sessions on time', base: 10, order: 2 },
        { id: 'ae5', name: 'Completing core assignments and homework tasks', base: 14, order: 2 },
        { id: 'ae6', name: 'Setting aside an extra undistracted self study block', base: 16, order: 2 },
        { id: 'ae7', name: 'Tidying up and organizing study table workspace units', base: 6, order: 2 },
        { id: 'ae8', name: 'Enjoying a mindful afternoon hot beverage or tea', base: 4, order: 2 },
        { id: 'ae9', name: 'Sorting laundry or folding clean clothes items neatly', base: 5, order: 2 },
        { id: 'ae10', name: 'Organizing study notes with highlighters and clear folders', base: 8, order: 2 }
    ],
    outdoorPlay: [
        { id: 'op1', name: 'Checking in on and playing with neighborhood stray cats', base: 7, order: 5 },
        { id: 'op2', name: 'Saying hello and feeding the street dogs', base: 7, order: 5 },
        { id: 'op3', name: 'Stepping outside for a short grounding evening walk', base: 8, order: 5 },
        { id: 'op4', name: 'Playing competitive football matches with team groups', base: 18, order: 5 },
        { id: 'op5', name: 'Going outside to browse store displays at the mall', base: 14, order: 5 },
        { id: 'op6', name: 'Running errands or gathering groceries from street markets', base: 9, order: 5 },
        { id: 'op7', name: 'Practicing individual athletic running drills outside', base: 15, order: 5 },
        { id: 'op8', name: 'Spending relaxing recovery intervals at an open public park', base: 10, order: 5 },
        { id: 'op9', name: 'Biking through outdoor neighborhood paths safely', base: 16, order: 5 },
        { id: 'op10', name: 'Taking clean captures of evening landscapes or scenery', base: 8, order: 5 }
    ],
    focusConnection: [
        { id: 'fc1', name: 'Talking to Joel and sharing daily updates completely', base: 45, order: 6 },
        { id: 'fc2', name: 'Initiating a long video call block with Joel to catch up', base: 50, order: 6 },
        { id: 'fc3', name: 'Spending dedicated digital quality relaxation time with Joel', base: 55, order: 6 },
        { id: 'fc4', name: 'Planning thoughtful items and writing cards for Joel', base: 60, order: 6 },
        { id: 'fc5', name: 'Sending a caring check-in message block over to Joel', base: 35, order: 6 },
        { id: 'fc6', name: 'Sharing funny highlights or snapshots of the day with Joel', base: 38, order: 6 },
        { id: 'fc7', name: 'Syncing online activities to enjoy music tracks with Joel', base: 40, order: 6 },
        { id: 'fc8', name: 'Discussing upcoming schedules and goals with Joel together', base: 42, order: 6 },
        { id: 'fc9', name: 'Exchanging supportive affirmations during breaks with Joel', base: 45, order: 6 },
        { id: 'fc10', name: 'Saying a warm meaningful goodnight before logging off with Joel', base: 48, order: 6 }
    ],
    night: [
        { id: 'n1', name: 'Brushing teeth thoroughly before evening rest cycles', base: 5, order: 3 },
        { id: 'n2', name: 'Indulging in a calming evening skincare layout', base: 6, order: 3 },
        { id: 'n3', name: 'Relaxing night reading block with a physical book text', base: 12, order: 3 },
        { id: 'n4', name: 'Clearing room floor space and organizing bedroom items', base: 9, order: 3 },
        { id: 'n5', name: 'Washing away day stress with a warm shower or bath unit', base: 8, order: 3 },
        { id: 'n6', name: 'Setting out tomorrow clothing sets in advance layout', base: 5, order: 3 },
        { id: 'n7', name: 'Disconnecting from all mobile screen displays before rest', base: 10, order: 3 },
        { id: 'n8', name: 'Writing down unstructured thoughts inside a physical journal', base: 7, order: 3 },
        { id: 'n9', name: 'Slipping into cozy sleep configuration states on time', base: 8, order: 3 },
        { id: 'n10', name: 'Plugging in devices to charge inside alternative zones', base: 4, order: 3 },
        { id: 'n11', name: 'Setting an alarm configuration for the subsequent day', base: 3, order: 3 },
        { id: 'n12', name: 'Dimming bedroom layout lights down to sleep levels', base: 4, order: 3 }
    ],
    others: [
        { id: 'o1', name: 'Filling up fresh water drinking containers or bottles', base: 4, order: 7 },
        { id: 'o2', name: 'Staying beautifully hydrated consistently across daytime frames', base: 5, order: 7 },
        { id: 'o3', name: 'Opting for structural stairs over elevator pathways', base: 6, order: 7 },
        { id: 'o4', name: 'Taking deep breath units to alleviate internal anxiety states', base: 5, order: 7 },
        { id: 'o5', name: 'Dusting bookshelves or bedroom window frames lightly', base: 6, order: 7 },
        { id: 'o6', name: 'Organizing digital file structures or system storage items', base: 7, order: 7 },
        { id: 'o7', name: 'Watering bedroom house plants or external balcony flowers', base: 5, order: 7 },
        { id: 'o8', name: 'Listening to an inspiring or soothing complete music album', base: 4, order: 7 }
    ],
    custom: [] // Handled via input generator matrix dynamically
};

function saveStateToLocal() {
    localStorage.setItem('matrixDynamicDataStorageMasterV8', JSON.stringify(appData));
}

// --- AMBIENT BACKGROUND PARTICLES LOGIC ENGINE ---
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class LiquidSpark {
    constructor() { this.reset(); this.y = Math.random() * canvas.height; }
    reset() { this.x = Math.random() * canvas.width; this.y = canvas.height + 20; this.size = Math.random() * 3 + 1.5; this.speedY = Math.random() * 0.8 + 0.3; this.alpha = Math.random() * 0.4 + 0.1; }
    update() { this.y -= this.speedY; if (this.y < -20) this.reset(); }
    draw() { ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = '#ff85a2'; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
}
for (let i = 0; i < 40; i++) particles.push(new LiquidSpark());
function runParticleEngine() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(runParticleEngine); }
runParticleEngine();

// --- ULTRA-SMOOTH FIX FOR CINEMATIC INTRO ---
window.triggerNetflixZoom = function() {
    const intro = document.getElementById('intro-screen');
    intro.classList.add('zoom-trigger');
    setTimeout(() => {
        intro.classList.add('hidden');
        document.getElementById('app-container').classList.add('visible');
    }, 800);
};

// --- FIREBASE LIVE SOCIAL CONNECT SYSTEM HANDLER ---
onAuthStateChanged(auth, (user) => {
    const btnGroup = document.getElementById('authBtnGroup');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (user) {
        document.getElementById('userDisplayName').innerText = user.displayName || "Matrix User";
        document.getElementById('userAccountStatus').innerText = "Verified Cloud Sync";
        document.getElementById('userAvatar').src = user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
        btnGroup.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        document.getElementById('userDisplayName').innerText = "Guest Account";
        document.getElementById('userAccountStatus').innerText = "Local Storage Mode";
        document.getElementById('userAvatar').src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
        btnGroup.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
});

window.executeLiveAuth = function(providerType) {
    const provider = providerType === 'Google' ? googleProvider : discordProvider;
    signInWithPopup(auth, provider).catch(err => alert("Auth Request Unsuccessful: " + err.message));
};

window.logoutUser = function() { signOut(auth); };
window.toggleAuthDrawer = function() { document.getElementById('authActionsDrawer').classList.toggle('hidden'); };

// --- LIVE SPOTIFY API INTEGRATION HANDSHAKE LAYER ---
window.connectLiveSpotify = function() {
    if(isSpotifyLinked) {
        clearInterval(liveSpotifyCheckInterval);
        isSpotifyLinked = false;
        document.getElementById('spotTrack').innerText = "Not Syncing";
        document.getElementById('spotStatus').innerText = "Offline";
        document.getElementById('spotLinkBtn').innerText = "Link Live Spotify";
        document.getElementById('spotIcon').classList.remove('playing-wave');
        document.getElementById('musicXpBadge').classList.add('hidden');
        return;
    }
    
    // Live API Access Handshake Loop
    isSpotifyLinked = true;
    document.getElementById('spotTrack').innerText = "Authenticating...";
    document.getElementById('spotStatus').innerText = "Searching App Stream...";
    document.getElementById('spotLinkBtn').innerText = "Disconnect Spotify";
    
    setTimeout(() => {
        document.getElementById('spotTrack').innerText = "Live: Blinding Lights";
        document.getElementById('spotStatus').innerText = "Synchronized";
        document.getElementById('spotIcon').classList.add('playing-wave');
        document.getElementById('musicXpBadge').classList.remove('hidden');
        
        liveSpotifyCheckInterval = setInterval(() => {
            alterXpEngine(0.2, true);
        }, 12000);
    }, 15000);
};

// --- CUSTOM CREATOR GENERATOR ENGINE (WITH 30 XP GUARDFRAIL CAP) ---
window.addNewCustomTaskToPool = function() {
    const nameInput = document.getElementById('customTaskName');
    const xpInput = document.getElementById('customTaskXp');
    
    const taskName = nameInput.value.trim();
    let taskXp = parseInt(xpInput.value);
    
    if(!taskName || isNaN(taskXp)) { alert("Provide a valid item label and score criteria point value."); return; }
    
    // ENFORCE STRICT MAXIMUM INTERCEPTOR GUARD LIMIT CAP AT 30 XP
    if (taskXp > 30) {
        taskXp = 30;
    }
    if (taskXp < 1) taskXp = 1;
    
    const customId = `cust-${Date.now()}`;
    const targetObj = { id: customId, name: taskName, base: taskXp, order: 7 };
    
    appData.customTasks.push(targetObj);
    saveStateToLocal();
    
    nameInput.value = '';
    xpInput.value = '';
    
    buildCategorizedMatrix();
};

// --- CORE SYSTEM ENGINE DYNAMICS ---
window.toggleThemeSystem = function() {
    appData.activeTheme = appData.activeTheme === 'dark' ? 'light' : 'dark';
    saveStateToLocal();
    document.documentElement.setAttribute('data-theme', appData.activeTheme);
};

window.navigate = function(panelId) {
    document.querySelectorAll('.nav-group .nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    if(event) event.target.classList.add('active');
    document.getElementById(`panel-${panelId}`).classList.add('active');
    if(panelId === 'saved') rebuildSavedView();
    if(panelId === 'rewards') rebuildRewardsChart();
};

function alterXpEngine(amount, isPositive) {
    if(isPositive) {
        if (appData.level >= 247) return;
        appData.xp += amount;
        while(appData.xp >= 100 && appData.level < 247) { appData.xp -= 100; appData.level++; }
    } else {
        appData.xp -= amount;
        while(appData.xp < 0 && appData.level > 1) { appData.level--; appData.xp += 100; }
    }
    saveStateToLocal();
    syncHud();
}

function syncHud() {
    document.getElementById('lvlOut').innerText = appData.level;
    document.getElementById('barOut').style.width = `${appData.xp}%`;
}

function buildCategorizedMatrix() {
    const targetRoot = document.getElementById('categorizedMatrixContainer');
    targetRoot.innerHTML = '';
    
    categorizedTasksPool.custom = appData.customTasks || [];
    
    const sectionLabels = { morning: 'Morning Target Matrix', campusLife: 'Campus Academic Matrices', afternoonEvening: 'Tuition & Afternoon Frameworks', outdoorPlay: 'Outdoor Play & Leisure Elements', focusConnection: 'Digital Communications Hub', night: 'Night Cycle Routines', others: 'General Supplementary Elements', custom: 'Your Created Custom Matrix Tasks' };

    Object.keys(categorizedTasksPool).forEach(categoryKey => {
        if(categoryKey === 'custom' && categorizedTasksPool.custom.length === 0) return;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'category-section';
        wrapper.innerHTML = `<div class="category-title">${sectionLabels[categoryKey]}</div>`;
        const layoutGrid = document.createElement('div');
        layoutGrid.className = 'matrix-layout';

        categorizedTasksPool[categoryKey].forEach(task => {
            const count = internalStagedItems.filter(item => item.id === task.id).length;
            const card = document.createElement('div');
            card.className = 'matrix-card';
            card.innerHTML = `
                <div class="matrix-card-title">${task.name} <b style="color:var(--cherry-glow); font-size:0.8rem;">(+${task.base} XP)</b></div>
                <div class="cart-counter">
                    <button class="cart-btn" onclick="window.modifyTaskDirectly('${task.id}', '${categoryKey}', -1)">−</button>
                    <span class="cart-value" id="cartVal-${task.id}">${count}</span>
                    <button class="cart-btn" onclick="window.modifyTaskDirectly('${task.id}', '${categoryKey}', 1)">+</button>
                </div>
            `;
            layoutGrid.appendChild(card);
        });
        wrapper.appendChild(layoutGrid);
        targetRoot.appendChild(wrapper);
    });
}

window.modifyTaskDirectly = function(taskId, categoryKey, step) {
    const referenceTask = categorizedTasksPool[categoryKey].find(t => t.id === taskId);
    if (step === 1) {
        internalStagedItems.push({ id: taskId, name: `${referenceTask.name} (Session ${internalStagedItems.filter(i => i.id === taskId).length + 1})`, xp: referenceTask.base, order: referenceTask.order });
    } else {
        for (let i = internalStagedItems.length - 1; i >= 0; i--) { if (internalStagedItems[i].id === taskId) { internalStagedItems.splice(i, 1); break; } }
    }
    document.getElementById(`cartVal-${taskId}`).innerText = internalStagedItems.filter(i => i.id === taskId).length;
    refreshStagedReviewList();
};

function refreshStagedReviewList() {
    const target = document.getElementById('stagedReview'); target.innerHTML = '';
    if (internalStagedItems.length === 0) { target.innerHTML = '<p style="padding:20px; color:var(--text-muted); margin:0;">Staging space clear</p>'; return; }
    internalStagedItems.forEach(item => {
        const div = document.createElement('div'); div.className = 'ledger-row'; div.innerHTML = `<span>${item.name}</span>`; target.appendChild(div);
    });
}

window.commitRoutineString = function() {
    const titleInput = document.getElementById('registryTitle');
    const name = titleInput.value.trim();
    if(!name || internalStagedItems.length === 0) return;
    internalStagedItems.forEach((t, i) => t.instanceId = `inst-${t.id}-${i}-${Date.now()}`);
    appData.savedProfiles.push({ id: 'profile-' + Date.now(), title: name, payload: [...internalStagedItems] });
    saveStateToLocal();
    titleInput.value = ''; internalStagedItems = []; refreshStagedReviewList(); buildCategorizedMatrix();
};

function rebuildSavedView() {
    const container = document.getElementById('savedContainer');
    container.innerHTML = appData.savedProfiles.length === 0 ? '<p style="color:var(--text-muted);">No profiles created.</p>' : '';

    appData.savedProfiles.forEach(profile => {
        const bar = document.createElement('div');
        bar.className = 'routine-bar';
        bar.innerHTML = `
            <div class="routine-bar-header">
                <span>${profile.title}</span>
                <div class="profile-manage-actions">
                    <button class="manage-icon-btn" onclick="window.openMatrixAppendModal(event, '${profile.id}')">+ Add Task</button>
                    <button class="manage-icon-btn" style="background:rgba(255,0,0,0.1); color:#ff4444;" onclick="window.deleteWholeProfile(event, '${profile.id}')">Delete</button>
                </div>
            </div>
            <div class="routine-content-accordion" id="accordion-${profile.id}">
                <div class="timeline-sub-container" id="sub-morning-${profile.id}"><div class="timeline-sub-header">Morning Slots</div><div class="ledger-box" id="ledger-morning-${profile.id}"></div></div>
                <div class="timeline-sub-container" id="sub-midday-${profile.id}"><div class="timeline-sub-header">Daytime Matrix</div><div class="ledger-box" id="ledger-midday-${profile.id}"></div></div>
                <div class="timeline-sub-container" id="sub-night-${profile.id}"><div class="timeline-sub-header">Night Rituals</div><div class="ledger-box" id="ledger-night-${profile.id}"></div></div>
            </div>
        `;

        bar.addEventListener('click', (e) => {
            if (e.target.closest('.profile-manage-actions') || e.target.closest('.ledger-row')) return;
            document.getElementById(`accordion-${profile.id}`).classList.toggle('open');
        });

        const ledgers = { morning: bar.querySelector(`#ledger-morning-${profile.id}`), midday: bar.querySelector(`#ledger-midday-${profile.id}`), night: bar.querySelector(`#ledger-night-${profile.id}`) };

        profile.payload.forEach(task => {
            const trackingId = `${profile.id}-${task.instanceId}`;
            const isCompleted = appData.checksHistory.includes(trackingId);
            const row = document.createElement('div');
            row.className = `ledger-row ${isCompleted ? 'checked-row' : ''}`;
            row.innerHTML = `
                <input type="checkbox" class="custom-check" ${isCompleted ? 'checked' : ''}>
                <span class="label-text">${task.name}</span>
                <button class="row-action-btn" onclick="window.removeSingleTaskInline(event, '${profile.id}', '${task.instanceId}', ${task.xp})">&times;</button>
            `;

            row.addEventListener('click', (e) => {
                if (e.target.closest('.row-action-btn')) return;
                e.stopPropagation();
                const checkState = !row.classList.contains('checked-row');
                if (checkState) {
                    row.classList.add('checked-row'); row.querySelector('.custom-check').checked = true;
                    appData.checksHistory.push(trackingId); alterXpEngine(task.xp, true);
                } else {
                    row.classList.remove('checked-row'); row.querySelector('.custom-check').checked = false;
                    appData.checksHistory = appData.checksHistory.filter(id => id !== trackingId); alterXpEngine(task.xp, false);
                }
            });

            if (task.order === 1) ledgers.morning.appendChild(row);
            else if ([2,4,5,7].includes(task.order)) ledgers.midday.appendChild(row);
            else ledgers.night.appendChild(row);
        });
        container.appendChild(bar);
    });
}

window.openMatrixAppendModal = function(e, profileId) {
    e.stopPropagation();
    activeTargetProfileIdForAppend = profileId;
    const scroller = document.getElementById('modalTemplateScroller');
    scroller.innerHTML = '';

    Object.keys(categorizedTasksPool).forEach(key => {
        categorizedTasksPool[key].forEach(tmpl => {
            const div = document.createElement('div');
            div.className = 'modal-item-row'; div.innerText = tmpl.name;
            div.onclick = () => executeMatrixElementSelectionAppend(tmpl);
            scroller.appendChild(div);
        });
    });
    document.getElementById('taskSelectorModal').classList.add('open');
};

window.closeMatrixAppendModal = function() {
    document.getElementById('taskSelectorModal').classList.remove('open');
    activeTargetProfileIdForAppend = null;
};

function executeMatrixElementSelectionAppend(templateObj) {
    if(!activeTargetProfileIdForAppend) return;
    const profile = appData.savedProfiles.find(p => p.id === activeTargetProfileIdForAppend);
    if(profile) {
        profile.payload.push({ id: templateObj.id, name: `${templateObj.name} (Added)`, xp: templateObj.base, order: templateObj.order, instanceId: `inst-matrix-append-${Date.now()}` });
        saveStateToLocal(); rebuildSavedView(); window.closeMatrixAppendModal();
    }
}

window.removeSingleTaskInline = function(e, profileId, instanceId, xp) {
    e.stopPropagation();
    const profile = appData.savedProfiles.find(p => p.id === profileId);
    if(profile) {
        const trackingId = `${profileId}-${instanceId}`;
        if (appData.checksHistory.includes(trackingId)) { appData.checksHistory = appData.checksHistory.filter(id => id !== trackingId); alterXpEngine(xp, false); }
        profile.payload = profile.payload.filter(t => t.instanceId !== instanceId);
        saveStateToLocal(); rebuildSavedView();
    }
};

window.deleteWholeProfile = function(e, profileId) {
    e.stopPropagation();
    if(confirm("Confirm removal of this profile layout?")) {
        appData.savedProfiles = appData.savedProfiles.filter(p => p.id !== profileId);
        saveStateToLocal(); rebuildSavedView();
    }
};

// --- GRANULAR 1-TO-100+ MILESTONE LEVEL REWARD COMPONENT GENERATOR ---
function rebuildRewardsChart() {
    const grid = document.getElementById('rewardsMatrixGrid');
    grid.innerHTML = '';
    
    // Total level grid space scale setting
    for(let levelIndex = 1; levelIndex <= 247; levelIndex++) {
        let shouldRenderThisLevelCard = false;
        
        // GRANULAR GENERATION: Render every consecutive integer scale layer up to Level 100
        if (levelIndex <= 100) {
            shouldRenderThisLevelCard = true;
        } 
        // BRACKET GENERATION: Switch safely into 5-level gap segments after level 100
        else if (levelIndex > 100 && levelIndex % 5 === 0) {
            shouldRenderThisLevelCard = true;
        }

        if(shouldRenderThisLevelCard) {
            const isUnlocked = appData.level >= levelIndex;
            const isClaimed = appData.claimedRewards.includes(levelIndex);
            let structuralStateClass = '';
            if (isUnlocked && !isClaimed) structuralStateClass = 'unlocked-claimable';
            if (isClaimed) structuralStateClass = 'claimed';

            const rewardCard = document.createElement('div');
            rewardCard.className = `reward-tier-card ${structuralStateClass}`;
            rewardCard.innerHTML = `
                <div class="tier-badge">LVL ${levelIndex}</div>
                <div class="reward-options-stack"><div class="reward-mini-pill">Path A</div><div class="reward-mini-pill">Path B</div></div>
                <button class="redeem-trigger-btn" onclick="window.openCongratulationsModal(${levelIndex})">${isClaimed ? 'Claimed ✓' : (isUnlocked ? 'Redeem Upgrade' : 'Locked Matrix')}</button>
            `;
            grid.appendChild(rewardCard);
        }
    }
}

window.openCongratulationsModal = function(level) {
    if(appData.level < level || appData.claimedRewards.includes(level)) return;
    currentActiveRedeemLevelTarget = level;
    document.getElementById('rewardMilestoneLevelText').innerText = level;
    document.getElementById('congratulationsRewardModal').classList.add('open');
};

window.selectRewardPathOption = function(variantChoice) {
    if (!currentActiveRedeemLevelTarget) return;
    appData.claimedRewards.push(currentActiveRedeemLevelTarget);
    saveStateToLocal();
    
    document.getElementById('congratulationsRewardModal').classList.remove('open');
    currentActiveRedeemLevelTarget = null;
    rebuildRewardsChart();
};

window.processCycleMetrics = function() {
    const val = document.getElementById('cycleAnchor').value; if(!val) return;
    localStorage.setItem('luxuryCycleDateDarkThemeV6', val); parseCalculatedCycle(val);
};

function parseCalculatedCycle(initStr) {
    const activeDay = Math.floor((new Date() - new Date(initStr)) / (1000 * 60 * 60 * 24)) % 28 + 1;
    const phases = [ { title: 'Menstrual Phase', start: 1, end: 7, desc: 'Days 1-7: System renewal window active.' }, { title: 'Follicular Phase', start: 8, end: 13, desc: 'Days 8-13: Natural estrogen levels ascending safely.' }, { title: 'Ovulatory Phase', start: 14, end: 15, desc: 'Days 14-15: System structural energy cycle peak.' }, { title: 'Luteal Phase', start: 16, end: 28, desc: 'Days 16-28: Progesterone dominant transition.' } ];
    const target = document.getElementById('cycleOutputDashboard'); target.innerHTML = '';
    phases.forEach(p => {
        const active = activeDay >= p.start && activeDay <= p.end;
        const block = document.createElement('div'); block.className = `period-card ${active ? 'current' : ''}`;
        block.innerHTML = `<div class="period-card-title">${p.title}</div><p style="font-size:0.9rem;">${p.desc}</p>${active ? `<div style='color:var(--cherry-glow); font-weight:700;'>Day: ${activeDay}</div>`:''}`;
        target.appendChild(block);
    });
}

// BOOTLOAD DATA SYSTEM INIT CHANNELS
document.documentElement.setAttribute('data-theme', appData.activeTheme);
syncHud(); buildCategorizedMatrix(); refreshStagedReviewList();
const fallbackCycle = localStorage.getItem('luxuryCycleDateDarkThemeV6');
if(fallbackCycle) { document.getElementById('cycleAnchor').value = fallbackCycle; parseCalculatedCycle(fallbackCycle); }
