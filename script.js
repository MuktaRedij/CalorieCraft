/* script.js */

// Global State
let appState = {
    user: { weight: null, height: null, age: null, gender: 'male', goal: 'maintain', targetCalories: 2000, bmi: 0 },
    meals: [],
    consumedCalories: 0,
    theme: 'light'
};

// Database for Smart Image-Based Recommendations Engine
const mealDatabase = [
    { name: "Oats with Berries", calories: 250, type: "breakfast", goal: "lose", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", reason: "High fiber keeps you full, and berries are rich in antioxidants with minimal calories." },
    { name: "Egg White Spinach Omelette", calories: 200, type: "breakfast", goal: "lose", image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80", reason: "High protein, low calorie start to jumpstart your metabolism." },
    { name: "Avocado Toast with Egg", calories: 350, type: "breakfast", goal: "maintain", image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&q=80", reason: "A perfect balance of healthy fats, carbs, and protein for sustained energy." },
    { name: "Peanut Butter & Banana Oatmeal", calories: 550, type: "breakfast", goal: "gain", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80", reason: "Calorie-dense, high in carbs and protein for muscle building." },
    { name: "Grilled Chicken Salad", calories: 300, type: "lunch", goal: "lose", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", reason: "Lean protein and voluminous greens to keep you satisfied on a deficit." },
    { name: "Zucchini Noodles with Tofu", calories: 250, type: "lunch", goal: "lose", image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80", reason: "Low carb alternative that provides great volume and nutrition." },
    { name: "Turkey and Cheese Wrap", calories: 450, type: "lunch", goal: "maintain", image: "https://images.unsplash.com/photo-1626804475297-41609ea005eb?w=800&q=80", reason: "A quick, balanced meal providing steady energy for your afternoon." },
    { name: "Chicken and Rice Bowl", calories: 700, type: "lunch", goal: "gain", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80", reason: "Heavy in complex carbs and protein to support growth." },
    { name: "Baked Cod with Asparagus", calories: 280, type: "dinner", goal: "lose", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80", reason: "Very lean protein and light veggies, perfect before bed." },
    { name: "Chicken Stir-fry", calories: 500, type: "dinner", goal: "maintain", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80", reason: "Nutrient dense and balanced to replenish your daily needs." },
    { name: "Salmon and Sweet Potato", calories: 650, type: "dinner", goal: "gain", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80", reason: "Rich in omega-3s and complex carbs for overnight recovery." },
    { name: "Greek Yogurt with Honey", calories: 150, type: "snack", goal: "lose", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80", reason: "High protein snack to curb sweet cravings." },
    { name: "Mixed Nuts", calories: 250, type: "snack", goal: "maintain", image: "https://images.unsplash.com/photo-1536591375315-db87310af14e?w=800&q=80", reason: "Healthy fats and crunch to bridge the gap between meals." },
    { name: "Protein Smoothie", calories: 400, type: "snack", goal: "gain", image: "https://images.unsplash.com/photo-1553530666-ba11a90c0f28?w=800&q=80", reason: "Easy to digest liquid calories to boost your daily intake." }
];

const getMealImagePlaceholder = (type) => {
    const list = mealDatabase.filter(m => m.type === type).map(m => m.image);
    if(list.length > 0) return list[Math.floor(Math.random() * list.length)];
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
}

// DOM Refs
const DOM = {
    // Auth Views
    authWrapper: document.getElementById('auth-wrapper'),
    appWrapper: document.getElementById('app-wrapper'),
    loginView: document.getElementById('login-view'),
    signupView: document.getElementById('signup-view'),
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),

    // App Nav
    navTabs: document.querySelectorAll('.nav-item'),
    sections: document.querySelectorAll('.tab-content'),
    sidebar: document.getElementById('sidebar'),
    openSidebar: document.getElementById('open-sidebar'),
    closeSidebar: document.getElementById('close-sidebar'),
    toastBin: document.getElementById('toast-container'),
    themeToggle: document.getElementById('theme-toggle-top'),
    themeCheck: document.getElementById('theme-switch-checkbox'),
    
    // Inputs
    profileForm: document.getElementById('profile-form'),
    mealForm: document.getElementById('meal-form'),
    
    // Dash
    dashWelcome: document.getElementById('dash-welcome-title'),
    dashConsumed: document.getElementById('dash-consumed'),
    dashTarget: document.getElementById('dash-target'),
    dashRem: document.getElementById('dash-remaining'),
    dashBmi: document.getElementById('dash-bmi'),
    calRing: document.getElementById('calorie-ring'),
    
    // Profile
    profBmi: document.getElementById('profile-bmi'),
    profTarget: document.getElementById('profile-target'),
    profBmr: document.getElementById('profile-bmr'),
    
    // Meals
    mealGrid: document.getElementById('meals-grid'),
    mealEmpty: document.getElementById('meals-empty'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // Rec
    recBtn: document.getElementById('regenerate-rec'),
    recSkeleton: document.getElementById('rec-skeleton'),
    recActual: document.getElementById('rec-actual')
};

/* ======================================================== */
/* 1. AUTHENTICATION ENGINE                                 */
/* ======================================================== */

function initAuth() {
    if (localStorage.getItem("isLoggedIn") === "true") {
        mountAppSession();
    } else {
        DOM.authWrapper.classList.remove('hidden');
        DOM.appWrapper.classList.add('hidden');
    }
}

function mountAppSession() {
    DOM.authWrapper.classList.add('hidden');
    DOM.appWrapper.classList.remove('hidden');
    
    // Personalize dashboard
    const userEmail = localStorage.getItem('currentUserEmail');
    const users = JSON.parse(localStorage.getItem('calcraft_users') || '{}');
    if(users[userEmail]) {
        DOM.dashWelcome.innerText = `Welcome back, ${users[userEmail].name} 👋`;
    }

    // Isolate state logically if desired, here we just load
    // the single appState from localStorage for demo purposes
    loadState();
    updateUI();
    renderChart();
    generateRecommendation(true);
}

// Global scope toggle for password inputs inline HTML
window.togglePassword = function(id, btn) {
    const el = document.getElementById(id);
    if (el.type === "password") {
        el.type = "text";
        btn.innerHTML = '<ion-icon name="eye-off"></ion-icon>';
    } else {
        el.type = "password";
        btn.innerHTML = '<ion-icon name="eye"></ion-icon>';
    }
}

// Switch between Auth Modes
document.getElementById('go-to-signup').addEventListener('click', (e) => {
    e.preventDefault();
    DOM.loginView.classList.add('hidden');
    DOM.signupView.classList.remove('hidden');
});

document.getElementById('go-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    DOM.signupView.classList.add('hidden');
    DOM.loginView.classList.remove('hidden');
});

// Signup Logic
DOM.signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pwd = document.getElementById('reg-pwd').value;
    const cpwd = document.getElementById('reg-cpwd').value;

    if (pwd !== cpwd) return toast('Passwords do not match ❌', 'error');

    const users = JSON.parse(localStorage.getItem('calcraft_users') || '{}');
    if (users[email]) return toast('Email already registered ❌', 'error');

    // Save to Database DB
    users[email] = { name, email, password: pwd };
    localStorage.setItem('calcraft_users', JSON.stringify(users));

    toast('Account created successfully! Please log in ✅');
    DOM.signupForm.reset();
    document.getElementById('go-to-login').click();
});

// Login Logic
DOM.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pwd = document.getElementById('login-pwd').value;

    const btn = document.getElementById('btn-login-submit');
    const originalText = btn.innerHTML;
    
    // Simulate API Delay + Loading
    btn.innerHTML = '<ion-icon name="sync" class="spin"></ion-icon> Authenticating...';
    btn.disabled = true;

    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('calcraft_users') || '{}');
        if (users[email] && users[email].password === pwd) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUserEmail', email);

            toast('Login successful! Welcome ✅');
            DOM.loginForm.reset();
            mountAppSession(); // Connect to dashboard
        } else {
            toast('Incorrect email or password ❌', 'error');
        }
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1200);
});

// Logout Logic
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    DOM.authWrapper.classList.remove('hidden');
    DOM.appWrapper.classList.add('hidden');
    toast('Logged out securely.', 'success');
});


/* ======================================================== */
/* 2. APP LOGIC (Dashboard, Profile, Engine)                */
/* ======================================================== */

function loadState() {
    const s = localStorage.getItem('calorieCraftStateObj');
    if (s) {
        appState = JSON.parse(s);
        if(appState.user.weight) {
            document.getElementById('weight').value = appState.user.weight;
            document.getElementById('height').value = appState.user.height;
            document.getElementById('age').value = appState.user.age;
            document.getElementById('gender').value = appState.user.gender;
            document.getElementById('goal').value = appState.user.goal;
        }
    }
}
function saveState() {
    localStorage.setItem('calorieCraftStateObj', JSON.stringify(appState));
}

function setupRouting() {
    DOM.navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.dataset.tab;
            DOM.navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            DOM.sections.forEach(s => s.classList.remove('active'));
            document.getElementById(`tab-${target}`).classList.add('active');
            
            if(window.innerWidth <= 768) DOM.sidebar.classList.remove('open');
            if (target === 'analytics') renderChart();
        });
    });
}

function setupSidebar() {
    DOM.openSidebar.addEventListener('click', () => DOM.sidebar.classList.add('open'));
    DOM.closeSidebar.addEventListener('click', () => DOM.sidebar.classList.remove('open'));
}

function init() {
    setupRouting();
    setupTheme();
    setupSidebar();
    attachRipple();
    initAuth();
}

function toast(msg, type='success') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icon = type === 'success' ? 'checkmark-circle' : 'alert-circle';
    t.innerHTML = `<ion-icon name="${icon}"></ion-icon> ${msg}`;
    DOM.toastBin.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

function attachRipple() {
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            this.classList.remove('active');
            void this.offsetWidth;
            const rect = this.getBoundingClientRect();
            this.style.setProperty('--x', (e.clientX - rect.left) + 'px');
            this.style.setProperty('--y', (e.clientY - rect.top) + 'px');
            this.classList.add('active');
        });
    });
}

function updateRing(consumed, target) {
    const r = 76;
    const circumference = r * 2 * Math.PI;
    DOM.calRing.style.strokeDasharray = `${circumference} ${circumference}`;
    
    let percent = target > 0 ? (consumed / target) * 100 : 0;
    if (percent > 100) percent = 100;
    
    const offset = circumference - percent / 100 * circumference;
    DOM.calRing.style.strokeDashoffset = offset;
    
    if (percent >= 100) {
        DOM.calRing.style.stroke = 'var(--danger)';
    } else {
        DOM.calRing.style.stroke = 'var(--primary)';
    }
}

function updateUI() {
    const u = appState.user;
    DOM.dashConsumed.innerText = appState.consumedCalories;
    DOM.dashTarget.innerText = u.targetCalories;
    DOM.dashRem.innerText = Math.max(0, u.targetCalories - appState.consumedCalories);
    DOM.dashBmi.innerText = u.bmi || '0.0';
    
    if (u.targetCalories - appState.consumedCalories < 0) {
        DOM.dashRem.classList.replace('highlight-orange', 'text-danger');
        DOM.dashRem.style.color = "var(--danger)";
    } else {
        DOM.dashRem.style.color = "var(--secondary)";
    }

    DOM.profBmi.innerText = u.bmi || '--';
    DOM.profTarget.innerText = u.targetCalories ? `${u.targetCalories} kcal` : '--';
    DOM.profBmr.innerText = u.targetCalories ? `${Math.round(u.targetCalories * 0.8)} kcal` : '--';
    
    updateRing(appState.consumedCalories, u.targetCalories);
    renderMeals();
}

let currentFilter = 'all';
DOM.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        DOM.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderMeals();
    });
});

function renderMeals() {
    DOM.mealGrid.innerHTML = '';
    let filtered = appState.meals;
    if (currentFilter !== 'all') {
        filtered = appState.meals.filter(m => m.type === currentFilter);
    }
    
    if (filtered.length === 0) {
        DOM.mealEmpty.style.display = 'flex';
    } else {
        DOM.mealEmpty.style.display = 'none';
        [...filtered].reverse().forEach(m => {
            const div = document.createElement('div');
            div.className = 'meal-box';
            div.innerHTML = `
                <button class="meal-delete-btn" onclick="window.delMeal('${m.id}', this)"><ion-icon name="trash"></ion-icon></button>
                <img src="${m.img}" alt="${m.name}" class="meal-box-img" loading="lazy">
                <div class="meal-box-body">
                    <div class="meal-box-title">${m.name}</div>
                    <div class="meal-box-meta">
                        <span class="meal-box-cals">${m.calories} kcal</span>
                        <span class="meal-type-badge">${m.type}</span>
                    </div>
                </div>
            `;
            DOM.mealGrid.appendChild(div);
        });
    }
}

DOM.profileForm.addEventListener('submit', e => {
    e.preventDefault();
    appState.user.weight = parseFloat(document.getElementById('weight').value);
    appState.user.height = parseFloat(document.getElementById('height').value);
    appState.user.age = parseInt(document.getElementById('age').value);
    appState.user.gender = document.getElementById('gender').value;
    appState.user.goal = document.getElementById('goal').value;

    const h = appState.user.height / 100;
    appState.user.bmi = (appState.user.weight / (h * h)).toFixed(1);
    let bmr = 10 * appState.user.weight + 6.25 * appState.user.height - 5 * appState.user.age + (appState.user.gender==='male'?5:-161);
    let tdee = bmr * 1.375;
    if(appState.user.goal === 'lose') tdee -= 500;
    if(appState.user.goal === 'gain') tdee += 500;
    appState.user.targetCalories = Math.round(tdee);

    saveState();
    updateUI();
    toast("Profile saved. Dashboards synchronized. 🚀");
});

DOM.mealForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('meal-name').value.trim();
    const cals = parseInt(document.getElementById('meal-calories').value);
    const type = document.querySelector('input[name="meal-type"]:checked').value;
    
    if (!name || cals <= 0) return toast("Invalid input", "error");

    const imgUrl = getMealImagePlaceholder(type);
    appState.meals.push({ id: Date.now().toString(), name, calories: cals, type, img: imgUrl });
    appState.consumedCalories += cals;
    
    saveState();
    updateUI();
    e.target.reset();
    document.getElementById('type-breakfast').checked = true;
    toast("Meal tracked securely! 🍽️");
});

window.delMeal = function(id, btnNode) {
    const box = btnNode.closest('.meal-box');
    box.classList.add('removing');
    setTimeout(() => {
        const idx = appState.meals.findIndex(m => m.id === id);
        if (idx > -1) {
            appState.consumedCalories -= appState.meals[idx].calories;
            appState.meals.splice(idx, 1);
            saveState();
            updateUI();
            toast("Meal record eradicated.");
        }
    }, 300);
}

function generateRecommendation(silent = false) {
    if(!silent) {
        DOM.recActual.classList.add('hidden');
        DOM.recSkeleton.style.display = 'block';
    }

    setTimeout(() => {
        const hour = new Date().getHours();
        const rem = appState.user.targetCalories - appState.consumedCalories;
        const userGoal = appState.user.goal;

        let currentMealTime = 'snack';
        if (hour >= 6 && hour < 11) currentMealTime = 'breakfast';
        else if (hour >= 11 && hour < 16) currentMealTime = 'lunch';
        else if (hour >= 16 && hour < 22) currentMealTime = 'dinner';

        let filteredMeals = mealDatabase.filter(meal => meal.type === currentMealTime && meal.goal === userGoal && meal.calories <= (rem < 0 ? 9999 : rem));
        if (filteredMeals.length === 0) filteredMeals = mealDatabase.filter(meal => meal.type === currentMealTime && meal.calories <= Math.max(rem, 300));
        if (filteredMeals.length === 0) filteredMeals = mealDatabase.filter(meal => meal.calories <= Math.max(rem, 400));
        if (filteredMeals.length === 0) {
            filteredMeals = [{
                name: "Herbal Tea & Hydration", calories: 0, type: "snack", goal: "lose", image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&q=80", reason: "You've exceeded your daily limit! Hydration helps manage remaining cravings."
            }];
        }

        const recommendation = filteredMeals[Math.floor(Math.random() * filteredMeals.length)];

        document.getElementById('rec-title').innerText = recommendation.name;
        document.getElementById('rec-cals').innerText = recommendation.calories;
        document.getElementById('rec-desc').innerText = recommendation.reason;
        document.getElementById('rec-time-badge').innerText = currentMealTime.charAt(0).toUpperCase() + currentMealTime.slice(1);
        
        const recImg = document.getElementById('rec-img');
        recImg.style.opacity = '0';
        recImg.onload = () => {
            recImg.style.transition = 'opacity 0.5s ease-in-out, transform 0.6s ease';
            recImg.style.opacity = '1';
        };
        recImg.src = recommendation.image;

        DOM.recSkeleton.style.display = 'none';
        DOM.recActual.classList.remove('hidden');
        if(!silent) toast("AI recommendation evaluated! 🤖");
    }, silent ? 0 : 1000);
}

DOM.recBtn.addEventListener('click', () => generateRecommendation(false));

function setupTheme() {
    const isDark = appState.theme === 'dark';
    DOM.themeCheck.checked = isDark;
    applyThemeDOM(isDark);
    
    DOM.themeCheck.addEventListener('change', (e) => {
        appState.theme = e.target.checked ? 'dark' : 'light';
        applyThemeDOM(e.target.checked);
        saveState();
    });
    
    DOM.themeToggle.addEventListener('click', () => {
        appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
        DOM.themeCheck.checked = appState.theme === 'dark';
        applyThemeDOM(appState.theme === 'dark');
        saveState();
    });
}

function applyThemeDOM(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    DOM.themeToggle.innerHTML = isDark ? '<ion-icon name="sunny"></ion-icon>' : '<ion-icon name="moon"></ion-icon>';
}

document.getElementById('reset-data-btn').addEventListener('click', () => {
    if(confirm("Are you sure? This erases all SaaS tracking points!")) {
        localStorage.removeItem('calorieCraftStateObj');
        location.reload();
    }
});

function renderChart() {
    const container = document.getElementById('weekly-chart');
    container.innerHTML = '';
    const target = appState.user.targetCalories || 2000;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    days.forEach((day, i) => {
        let val = target * (0.8 + Math.random() * 0.4);
        if (i === 6) val = appState.consumedCalories;
        if (val > target * 1.5) val = target * 1.5;
        
        let percent = (val / (target * 1.5)) * 100;
        
        const col = document.createElement('div');
        col.className = 'bar-col';
        col.innerHTML = `
            <div class="bar-fill" style="height: 0%;" data-val="${Math.round(val)}"></div>
            <div class="bar-label">${day}</div>
        `;
        container.appendChild(col);
        
        setTimeout(() => {
            col.querySelector('.bar-fill').style.height = `${percent}%`;
            if (val > target) col.querySelector('.bar-fill').style.backgroundColor = 'var(--danger)';
        }, 100 + (i * 100));
    });
}

document.addEventListener('DOMContentLoaded', init);
