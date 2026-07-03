import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDA9_KdWAd_QwF3c2xoRqTwHFP96LzMjMw",
  authDomain: "routine-tracker-5ab4c.firebaseapp.com",
  projectId: "routine-tracker-5ab4c",
  storageBucket: "routine-tracker-5ab4c.firebasestorage.app",
  messagingSenderId: "260352688576",
  appId: "1:260352688576:web:5cd5023103472f833a0825",
  measurementId: "G-Z8TQ7SE0JN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let isRegisterMode = false;

let appData = JSON.parse(localStorage.getItem('matrixDynamicDataStorageMasterV8')) || {
    xp: 0, level: 1, savedProfiles: [], checksHistory: [], activeTheme: 'dark',
    claimedRewards: [], customTasks: [],
    userProfile: { name: "", username: "", age: "", date: "", weight: "", avatar: "" }
};

let internalStagedItems = [];
let activeTargetProfileIdForAppend = null;
let currentActiveRedeemLevelTarget = null;
let liveSpotifyCheckInterval = null;
let isSpotifyLinked = false;

// SYSTEM EARNABLE UNIQUE CUSTOM SYSTEM ACHIEVEMENTS DEFINITIONS MATRIX POOL
const systemicAchievementsPool = [
    { id: 'ach_welcome', title: 'System Initialization', desc: 'Successfully build or link a database account profile container.', icon: '🛡️', requirement: (data) => true },
    { id: 'ach_level_5', title: 'Power Ascending', desc: 'Cross beyond level metric milestone threshold level 5.', icon: '🌟', requirement: (data) => data.level >= 5 },
    { id: 'ach_level_20', title: 'Matrix Overlord', desc: 'Cross beyond intense tracker operational milestone status level 20.', icon: '👑', requirement: (data) => data.level >= 20 },
    { id: 'ach_profiles_3', title: 'Multi-Timeline Architect', desc: 'Commit and preserve 3 or more distinct custom tracking matrices structures.', icon: '📚', requirement: (data) => data.savedProfiles.length >= 3 }
];

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
        { id: 'fc1', name: 'Focus connection segment block one', base: 15, order: 6 },
        { id: 'fc2', name: 'Focus connection segment block three', base: 25, order: 6 },
        { id: 'fc4', name: 'Focus connection segment block four', base: 30, order: 6 },
        { id: 'fc7', name: 'Focus connection segment block seven', base: 20, order: 6 },
        { id: 'fc9', name: 'Focus connection segment block nine', base: 25, order: 6 },
        { id: 'fc10', name: 'Focus connection segment block ten', base: 28, order: 6 }
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
    custom: []
};

function saveStateToLocal() {
    localStorage.setItem('matrixDynamicDataStorageMasterV8', JSON.stringify(appData));
}

// AMBIENT BACKGROUND PARTICLES LOGIC ENGINE
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class LiquidSpark {
    constructor() { this.reset(); this.y = Math.random() * canvas.height; }
    reset() { this.x = Math.random() * canvas.width; this.y = canvas.height + 20; this.size = Math.random() * 2.5 + 1; this.speedY = Math.random() * 0.6 + 0.2; this.alpha = Math.random() * 0.3 + 0.1; }
    update() { this.y -= this.speedY; if (this.y < -20) this.reset(); }
    draw() { ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = '#ff85a2'; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
}
for (let i = 0; i < 30; i++) particles.push(new LiquidSpark());
function runParticleEngine() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(runParticleEngine); }
runParticleEngine();

window.triggerNetflixZoom = function() {
    const intro = document.getElementById('intro-screen');
    intro.classList.add('hidden');
    document.getElementById('app-container').classList.add('visible');
};

// DIRECT CUSTOM AUTH ACTION HANDLERS
window.toggleAuthMode = function() {
    isRegisterMode = !isRegisterMode;
    document.getElementById('authFormTitle').innerText = isRegisterMode ? "Create Account" : "Account Sign In";
    document.getElementById('authSubmitBtn').innerText = isRegisterMode ? "Sign Up" : "Login";
    document.getElementById('authToggleText').innerText = isRegisterMode ? "Already registered? Login" : "Need an account? Sign Up";
    document.getElementById('registerExtraFields').classList.toggle('hidden', !isRegisterMode);
};

window.processEmailAuth = function() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value.trim();

    if(!email || !password) { alert("Please complete form parameters."); return; }

    if(isRegisterMode) {
        const username = document.getElementById('authUsername').value.trim();
        const avatar = document.getElementById('authAvatarUrl').value.trim();
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((credential) => {
                appData.userProfile = { name: "Navanshi", username: username || "Navanshi_User", age: "", date: "", weight: "", avatar: avatar || "" };
                saveStateToLocal();
                alert("Database Registration Successful!");
                window.toggleAuthDrawer();
            }).catch(err => alert(err.message));
    } else {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Login successful!");
                window.toggleAuthDrawer();
            }).catch(err => alert(err.message));
    }
};

onAuthStateChanged(auth, (user) => {
    const formFields = document.getElementById('authFormFields');
    const logoutBtn = document.getElementById('logoutBtn');
    const customizerNavBtn = document.getElementById('navBtnCustomizer');
    const mobileCustomizerBtn = document.getElementById('mobileNavCustomizerBtn');
    
    if (user) {
        if(formFields) formFields.classList.add('hidden');
        if(logoutBtn) logoutBtn.classList.remove('hidden');
        if(customizerNavBtn) customizerNavBtn.classList.remove('hidden');
        if(mobileCustomizerBtn) mobileCustomizerBtn.classList.remove('hidden');
        updateUiWithProfileData(user);
    } else {
        document.getElementById('userDisplayName').innerText = "Guest Vault";
        document.getElementById('userAccountStatus').innerText = "Local Data Cache Only";
        document.getElementById('userAvatar').src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
        if(formFields) formFields.classList.remove('hidden');
        if(logoutBtn) logoutBtn.classList.add('hidden');
        if(customizerNavBtn) customizerNavBtn.classList.add('hidden');
        if(mobileCustomizerBtn) mobileCustomizerBtn.classList.add('hidden');
    }
    rebuildAchievementsChart();
});

function updateUiWithProfileData(userInstance = null) {
    const savedProf = appData.userProfile || {};
    const fallbackName = "Navanshi";
    const fallbackAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

    document.getElementById('userDisplayName').innerText = savedProf.name || fallbackName;
    document.getElementById('userAccountStatus').innerText = savedProf.username ? `@${savedProf.username} • Cloud Synced` : "Cloud Synced";
    document.getElementById('userAvatar').src = savedProf.avatar || fallbackAvatar;

    if (document.getElementById('editProfName')) {
        document.getElementById('editProfName').value = savedProf.name || fallbackName;
        document.getElementById('editProfUsername').value = savedProf.username || "";
        document.getElementById('editProfAge').value = savedProf.age || "";
        document.getElementById('editProfDate').value = savedProf.date || "";
        document.getElementById('editProfWeight').value = savedProf.weight || "";
        document.getElementById('editProfAvatarPreview').src = savedProf.avatar || fallbackAvatar;
    }
}

window.saveCustomUserProfileData = function(e) {
    if (e) e.preventDefault();
    appData.userProfile = {
        name: document.getElementById('editProfName').value.trim() || "Navanshi",
        username: document.getElementById('editProfUsername').value.trim(),
        age: document.getElementById('editProfAge').value.trim(),
        date: document.getElementById('editProfDate').value.trim(),
        weight: document.getElementById('editProfWeight').value.trim(),
        avatar: document.getElementById('editProfAvatarUrl').value.trim()
    };
    saveStateToLocal();
    updateUiWithProfileData(auth.currentUser);
    alert("Profile Updated Successfully!");
};

window.logoutUser = function() { signOut(auth); };
window.toggleAuthDrawer = function() { document.getElementById('authActionsDrawer').classList.toggle('hidden'); };

window.connectLiveSpotify = function() {
    if(isSpotifyLinked) {
        clearInterval(liveSpotifyCheckInterval);
        isSpotifyLinked = false;
        document.getElementById('spotTrack').innerText = "Not Syncing";
        document.getElementById('spotStatus').innerText = "Offline";
        document.getElementById('spotIcon').classList.remove('playing-wave');
        document.getElementById('musicXpBadge').classList.add('hidden');
        return;
    }
    isSpotifyLinked = true;
    document.getElementById('spotTrack').innerText = "Authenticating...";
    document.getElementById('spotStatus').innerText = "Searching App Stream...";
    
    setTimeout(() => {
        document.getElementById('spotTrack').innerText = "Live: Calm Focus Stream";
        document.getElementById('spotStatus').innerText = "Synchronized";
        document.getElementById('spotIcon').classList.add('playing-wave');
        document.getElementById('musicXpBadge').classList.remove('hidden');
        liveSpotifyCheckInterval = setInterval(() => { alterXpEngine(0.2, true); }, 12000);
    }, 2000);
};

window.addNewCustomTaskToPool = function() {
    const nameInput = document.getElementById('customTaskName');
    const xpInput = document.getElementById('customTaskXp');
    const taskName = nameInput.value.trim();
    let taskXp = parseInt(xpInput.value);
    
    if(!taskName || isNaN(taskXp)) { alert("Provide a valid item label."); return; }
    taskXp = Math.max(1, Math.min(30, taskXp));
    
    appData.customTasks.push({ id: `cust-${Date.now()}`, name: taskName, base: taskXp, order: 7 });
    saveStateToLocal();
    nameInput.value = ''; xpInput.value = '';
    buildCategorizedMatrix();
};

window.toggleThemeSystem = function() {
    appData.activeTheme = appData.activeTheme === 'dark' ? 'light' : 'dark';
    saveStateToLocal();
    document.documentElement.setAttribute('data-theme', appData.activeTheme);
};

window.navigate = function(panelId) {
    document.querySelectorAll('.nav-btn, .mobile-nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    
    const desktopBtn = document.querySelector(`aside [onclick="window.navigate('${panelId}')"]`);
    const mobileBtn = document.querySelector(`.mobile-nav-bar [onclick="window.navigate('${panelId}')"]`);
    
    if(desktopBtn) desktopBtn.classList.add('active');
    if(mobileBtn) mobileBtn.classList.add('active');
    
    document.getElementById(`panel-${panelId}`).classList.add('active');
    if(panelId === 'saved') rebuildSavedView();
    if(panelId === 'rewards') rebuildRewardsChart();
    if(panelId === 'achievements') rebuildAchievementsChart();
    if(panelId === 'customizer') updateUiWithProfileData(auth.currentUser);
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
    rebuildAchievementsChart();
}

function syncHud() {
    document.getElementById('lvlOut').innerText = appData.level;
    document.getElementById('barOut').style.width = `${appData.xp}%`;
}

function buildCategorizedMatrix() {
    const targetRoot = document.getElementById('categorizedMatrixContainer');
    if(!targetRoot) return;
    targetRoot.innerHTML = '';
    categorizedTasksPool.custom = appData.customTasks || [];
    
    const sectionLabels = { morning: 'Morning Target Matrix', campusLife: 'Campus Academic Matrices', afternoonEvening: 'Tuition & Afternoon Frameworks', outdoorPlay: 'Outdoor Play & Leisure Elements', focusConnection: 'Focus Connection Matrix', night: 'Night Cycle Routines', others: 'Supplementary Elements', custom: 'Custom Created Tasks' };

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
                <div class="matrix-card-title">${task.name} <b style="color:var(--cherry-glow);">(+${task.base} XP)</b></div>
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
    const target = document.getElementById('stagedReview'); if(!target) return;
    target.innerHTML = '';
    if (internalStagedItems.length === 0) { target.innerHTML = '<p style="padding:20px; color:var(--text-muted); margin:0;">Staging space empty</p>'; return; }
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
    rebuildAchievementsChart();
};

function rebuildSavedView() {
    const container = document.getElementById('savedContainer'); if(!container) return;
    container.innerHTML = appData.savedProfiles.length === 0 ? '<p style="color:var(--text-muted);">No layout profiles created yet.</p>' : '';

    appData.savedProfiles.forEach(profile => {
        const bar = document.createElement('div');
        bar.className = 'routine-bar';
        bar.innerHTML = `
            <div class="routine-bar-header">
                <span>${profile.title}</span>
                <div class="profile-manage-actions">
                    <button class="manage-icon-btn" onclick="window.openMatrixAppendModal(event, '${profile.id}')">+ Add</button>
                    <button class="manage-icon-btn" style="color:#ff4444;" onclick="window.deleteWholeProfile(event, '${profile.id}')">Delete</button>
                </div>
            </div>
            <div class="routine-content-accordion" id="accordion-${profile.id}">
                <div class="timeline-sub-container"><div class="timeline-sub-header">Morning Slots</div><div class="ledger-box" id="ledger-morning-${profile.id}"></div></div>
                <div class="timeline-sub-container"><div class="timeline-sub-header">Daytime Matrix</div><div class="ledger-box" id="ledger-midday-${profile.id}"></div></div>
                <div class="timeline-sub-container"><div class="timeline-sub-header">Night Rituals</div><div class="ledger-box" id="ledger-night-${profile.id}"></div></div>
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
                <div style="display:flex; align-items:center;"><input type="checkbox" class="custom-check" ${isCompleted ? 'checked' : ''}><span>${task.name}</span></div>
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
    e.stopPropagation(); activeTargetProfileIdForAppend = profileId;
    const scroller = document.getElementById('modalTemplateScroller'); if(!scroller) return;
    scroller.innerHTML = '';
    Object.keys(categorizedTasksPool).forEach(key => {
        categorizedTasksPool[key].forEach(tmpl => {
            const div = document.createElement('div'); div.className = 'modal-item-row'; div.innerText = tmpl.name;
            div.onclick = () => executeMatrixElementSelectionAppend(tmpl);
            scroller.appendChild(div);
        });
    });
    document.getElementById('taskSelectorModal').classList.add('open');
};

window.closeMatrixAppendModal = function() { document.getElementById('taskSelectorModal').classList.remove('open'); };

function executeMatrixElementSelectionAppend(templateObj) {
    const profile = appData.savedProfiles.find(p => p.id === activeTargetProfileIdForAppend);
    if(profile) {
        profile.payload.push({ id: templateObj.id, name: `${templateObj.name} (Added)`, xp: templateObj.base, order: templateObj.order, instanceId: `inst-append-${Date.now()}` });
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
    if(confirm("Confirm removal of profile?")) {
        appData.savedProfiles = appData.savedProfiles.filter(p => p.id !== profileId);
        saveStateToLocal(); rebuildSavedView();
        rebuildAchievementsChart();
    }
};

function rebuildRewardsChart() {
    const grid = document.getElementById('rewardsMatrixGrid'); if(!grid) return;
    grid.innerHTML = '';
    for(let i = 1; i <= 50; i++) {
        const isUnlocked = appData.level >= i;
        const isClaimed = appData.claimedRewards.includes(i);
        const card = document.createElement('div');
        card.className = `reward-tier-card ${isUnlocked && !isClaimed ? 'unlocked-claimable' : ''}`;
        card.innerHTML = `<div class="tier-badge">LVL ${i}</div><button class="redeem-trigger-btn" onclick="window.openCongratulationsModal(${i})">${isClaimed ? 'Claimed ✓' : 'Reward Node'}</button>`;
        grid.appendChild(card);
    }
}

function rebuildAchievementsChart() {
    const grid = document.getElementById('achievementsMatrixGrid'); if(!grid) return;
    grid.innerHTML = '';
    systemicAchievementsPool.forEach(ach => {
        const hasUnlocked = ach.requirement(appData);
        const card = document.createElement('div');
        card.className = `achievement-card ${hasUnlocked ? 'unlocked' : ''}`;
        card.innerHTML = `<div class="ach-icon">${ach.icon}</div><div style="font-weight:700; font-size:0.95rem;">${ach.title}</div><p style="margin:4px 0 0; font-size:0.75rem; color:var(--text-muted);">${ach.desc}</p>`;
        grid.appendChild(card);
    });
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
    rebuildRewardsChart();
};

window.processCycleMetrics = function() {
    const val = document.getElementById('cycleAnchor').value; if(!val) return;
    localStorage.setItem('luxuryCycleDateDarkThemeV6', val); parseCalculatedCycle(val);
};

function parseCalculatedCycle(initStr) {
    const activeDay = Math.floor((new Date() - new Date(initStr)) / (1000 * 60 * 60 * 24)) % 28 + 1;
    const phases = [ { title: 'Menstrual Phase', start: 1, end: 7, desc: 'Days 1-7: System renewal active.' }, { title: 'Follicular Phase', start: 8, end: 13, desc: 'Days 8-13: Estrogen levels ascending.' }, { title: 'Ovulatory Phase', start: 14, end: 15, desc: 'Days 14-15: Structural energy peak.' }, { title: 'Luteal Phase', start: 16, end: 28, desc: 'Days 16-28: Progesterone transition.' } ];
    const target = document.getElementById('cycleOutputDashboard'); if(!target) return;
    target.innerHTML = '';
    phases.forEach(p => {
        const active = activeDay >= p.start && activeDay <= p.end;
        const block = document.createElement('div'); block.className = `period-card ${active ? 'current' : ''}`;
        block.innerHTML = `<div class="period-card-title">${p.title}</div><p style="font-size:0.8rem; margin:4px 0;">${p.desc}</p>${active ? `<b style='color:var(--cherry-glow); font-size:0.85rem;'>Day: ${activeDay}</b>`:''}`;
        target.appendChild(block);
    });
}

document.documentElement.setAttribute('data-theme', appData.activeTheme);
syncHud(); buildCategorizedMatrix(); refreshStagedReviewList();
const fallbackCycle = localStorage.getItem('luxuryCycleDateDarkThemeV6');
if(fallbackCycle) { document.getElementById('cycleAnchor').value = fallbackCycle; parseCalculatedCycle(fallbackCycle); }
