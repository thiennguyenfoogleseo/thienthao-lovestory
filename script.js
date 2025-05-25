document.addEventListener('DOMContentLoaded', () => {
    // --- Main Display Elements ---
    const appTitleDisplay = document.getElementById('appTitle');
    const partner1NameDisplay = document.getElementById('partner1NameDisplay');
    const partner2NameDisplay = document.getElementById('partner2NameDisplay');
    const loveStatusDisplay = document.getElementById('loveStatus');
    const daysCountNumberDisplay = document.getElementById('daysCountNumber');
    const daysLabelDisplay = document.getElementById('daysLabel');
    const milestonesList = document.getElementById('milestonesList');

    // --- Settings Panel Elements ---
    const menuIconToggle = document.getElementById('menuIconToggle');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettingsButton = document.getElementById('closeSettingsButton');

    // --- Input Elements ---
    const partner1NameInput = document.getElementById('partner1NameInput');
    const partner2NameInput = document.getElementById('partner2NameInput');
    const anniversaryDateInput = document.getElementById('anniversaryDateInput');
    const saveDataButton = document.getElementById('saveDataButton');

    // --- Customization Input Elements ---
    const appTitleInput = document.getElementById('appTitleInput');
    const loveStatusTextInput = document.getElementById('loveStatusTextInput');
    const daysLabelTextInput = document.getElementById('daysLabelTextInput');
    const backgroundImageUrlInput = document.getElementById('backgroundImageUrlInput');
    const applyCustomizationButton = document.getElementById('applyCustomizationButton');
    const removeBackgroundButton = document.getElementById('removeBackgroundButton');

    const STORAGE_KEYS = {
        PARTNER1_NAME: 'loveApp_P1Name_v2',
        PARTNER2_NAME: 'loveApp_P2Name_v2',
        ANNIVERSARY_DATE: 'loveApp_Anniversary_v2',
        APP_TITLE: 'loveApp_AppTitle_v2',
        LOVE_STATUS_TEXT: 'loveApp_LoveStatus_v2',
        DAYS_LABEL_TEXT: 'loveApp_DaysLabel_v2',
        BACKGROUND_IMAGE: 'loveApp_BGImage_v2'
    };

    const DEFAULTS = {
        APP_TITLE: "Been Love Memory",
        LOVE_STATUS_TEXT: "Đang yêu",
        DAYS_LABEL_TEXT: "Ngày",
        PARTNER1_NAME: "You",
        PARTNER2_NAME: "Love"
    };

    // --- Settings Panel Toggle ---
    menuIconToggle.addEventListener('click', () => settingsPanel.classList.toggle('open'));
    closeSettingsButton.addEventListener('click', () => settingsPanel.classList.remove('open'));


    // --- Load and Save Data ---
    function loadSavedData() {
        // Load main data
        partner1NameInput.value = localStorage.getItem(STORAGE_KEYS.PARTNER1_NAME) || '';
        partner2NameInput.value = localStorage.getItem(STORAGE_KEYS.PARTNER2_NAME) || '';
        anniversaryDateInput.value = localStorage.getItem(STORAGE_KEYS.ANNIVERSARY_DATE) || '';

        // Load customization data
        appTitleInput.value = localStorage.getItem(STORAGE_KEYS.APP_TITLE) || DEFAULTS.APP_TITLE;
        loveStatusTextInput.value = localStorage.getItem(STORAGE_KEYS.LOVE_STATUS_TEXT) || DEFAULTS.LOVE_STATUS_TEXT;
        daysLabelTextInput.value = localStorage.getItem(STORAGE_KEYS.DAYS_LABEL_TEXT) || DEFAULTS.DAYS_LABEL_TEXT;
        backgroundImageUrlInput.value = localStorage.getItem(STORAGE_KEYS.BACKGROUND_IMAGE) || '';

        applyAllCustomizations(); // This will also trigger updateDisplay
    }

    function saveCoreData() {
        localStorage.setItem(STORAGE_KEYS.PARTNER1_NAME, partner1NameInput.value.trim());
        localStorage.setItem(STORAGE_KEYS.PARTNER2_NAME, partner2NameInput.value.trim());
        localStorage.setItem(STORAGE_KEYS.ANNIVERSARY_DATE, anniversaryDateInput.value);
        updateDisplay(); // Update immediately
        // Optionally close settings panel after saving
        // settingsPanel.classList.remove('open');
    }

    function applyAllCustomizations() {
        // App Title
        const appTitle = appTitleInput.value.trim() || DEFAULTS.APP_TITLE;
        appTitleDisplay.textContent = appTitle;
        localStorage.setItem(STORAGE_KEYS.APP_TITLE, appTitle);

        // Love Status Text
        const loveStatusText = loveStatusTextInput.value.trim() || DEFAULTS.LOVE_STATUS_TEXT;
        loveStatusDisplay.textContent = loveStatusText;
        localStorage.setItem(STORAGE_KEYS.LOVE_STATUS_TEXT, loveStatusText);

        // Days Label Text
        const daysLabelText = daysLabelTextInput.value.trim() || DEFAULTS.DAYS_LABEL_TEXT;
        daysLabelDisplay.textContent = daysLabelText;
        localStorage.setItem(STORAGE_KEYS.DAYS_LABEL_TEXT, daysLabelText);

        // Background Image
        const bgImageUrl = backgroundImageUrlInput.value.trim();
        if (bgImageUrl) {
            document.body.style.backgroundImage = `url('${bgImageUrl}')`;
            localStorage.setItem(STORAGE_KEYS.BACKGROUND_IMAGE, bgImageUrl);
        } else if (localStorage.getItem(STORAGE_KEYS.BACKGROUND_IMAGE)) {
            // If input is cleared but a BG was set, keep it unless explicitly removed
            document.body.style.backgroundImage = `url('${localStorage.getItem(STORAGE_KEYS.BACKGROUND_IMAGE)}')`;
        } else {
             document.body.style.backgroundImage = 'none'; // Or a default gradient
             document.body.style.backgroundColor = '#fdecf2'; // fallback color
        }
        updateDisplay(); // Update the main display after customizations
    }

    function removeBackground() {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#fdecf2'; // Reset to default
        localStorage.removeItem(STORAGE_KEYS.BACKGROUND_IMAGE);
        backgroundImageUrlInput.value = "";
    }

    // --- Update Main Display ---
    function updateDisplay() {
        const p1Name = localStorage.getItem(STORAGE_KEYS.PARTNER1_NAME) || DEFAULTS.PARTNER1_NAME;
        const p2Name = localStorage.getItem(STORAGE_KEYS.PARTNER2_NAME) || DEFAULTS.PARTNER2_NAME;
        partner1NameDisplay.textContent = p1Name;
        partner2NameDisplay.textContent = p2Name;

        const anniversaryDateString = localStorage.getItem(STORAGE_KEYS.ANNIVERSARY_DATE);

        if (!anniversaryDateString) {
            daysCountNumberDisplay.textContent = "0";
            milestonesList.innerHTML = "<li>Set your special date in settings!</li>";
            return;
        }

        const anniversaryDate = new Date(anniversaryDateString);
        anniversaryDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (anniversaryDate > today) {
            daysCountNumberDisplay.textContent = "Future!";
            milestonesList.innerHTML = "<li>Your special date is in the future.</li>";
            return;
        }

        const diffTime = Math.abs(today - anniversaryDate);
        // The +1 makes it so the anniversary day itself is "Day 1"
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + (anniversaryDate.getTime() === today.getTime() ? 0 : 1);
        // If it's the anniversary day itself, make it Day 1, not Day 0 if you add 1 generally.
        // More accurate: if date is same, it's 1 day. If it's one day after, it's 2 days.
        // So, it's actually `Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;`

        let finalDiffDays = 0;
        if (diffTime === 0 && anniversaryDate.getTime() === today.getTime()) { // Same day
            finalDiffDays = 1;
        } else {
            finalDiffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) +1;
        }


        daysCountNumberDisplay.textContent = finalDiffDays;
        calculateMilestones(anniversaryDate, finalDiffDays);
    }

    function calculateMilestones(startDate, currentDays) {
        let milestonesHTML = "";
        const milestones = [
            { days: 30, label: "1 Month" }, { days: 60, label: "2 Months" },
            { days: 100, label: "100 Days" }, { days: 182, label: "6 Months" },
            { days: 365, label: "1 Year" }, { days: 500, label: "500 Days" },
            { days: 730, label: "2 Years" }, { days: 1000, label: "1000 Days" },
            { days: 1095, label: "3 Years" }, { days: 1825, label: "5 Years" },
            { days: 3650, label: "10 Years" }
        ];

        let upcomingMilestonesCount = 0;
        for (const milestone of milestones) {
            if (milestone.days >= currentDays && upcomingMilestonesCount < 5) { // Show next 5
                const milestoneDate = new Date(startDate);
                milestoneDate.setDate(startDate.getDate() + milestone.days -1); // -1 because currentDays is inclusive
                
                const daysAway = milestone.days - currentDays;

                if (daysAway === 0) {
                     milestonesHTML += `<li>🎉 Today is ${milestone.label}! 🎉</li>`;
                } else {
                     milestonesHTML += `<li>${milestone.label}: ${milestoneDate.toLocaleDateString()} (${daysAway} ${daysAway === 1 ? 'day' : 'days'} away)</li>`;
                }
                upcomingMilestonesCount++;
            }
        }
        if (upcomingMilestonesCount === 0 && currentDays > 0) {
            milestonesHTML = "<li>Looking forward to more milestones!</li>";
        } else if (currentDays === 0) {
             milestonesHTML = "<li>Set your date to see milestones.</li>";
        }
        milestonesList.innerHTML = milestonesHTML;
    }

    // --- Event Listeners ---
    saveDataButton.addEventListener('click', saveCoreData);
    applyCustomizationButton.addEventListener('click', applyAllCustomizations);
    removeBackgroundButton.addEventListener('click', removeBackground);

    // --- Initial Load & Interval Update ---
    loadSavedData(); // This calls applyAllCustomizations which calls updateDisplay
    setInterval(updateDisplay, 60000); // Update every minute
});