document.addEventListener('DOMContentLoaded', () => {
    // --- Main Display Elements ---
    const appContainer = document.getElementById('appContainer');
    const appTitleDisplay = document.getElementById('appTitleDisplay');
    const partner1NameDisplay = document.getElementById('partner1NameDisplay');
    const partner2NameDisplay = document.getElementById('partner2NameDisplay');
    const avatar1Image = document.getElementById('avatar1Image');
    const avatar2Image = document.getElementById('avatar2Image');
    const avatar1DisplayContainer = document.getElementById('avatar1DisplayContainer');
    const avatar2DisplayContainer = document.getElementById('avatar2DisplayContainer');
    const daysStatusDisplay = document.getElementById('daysStatusDisplay');
    const daysCountDisplay = document.getElementById('daysCountDisplay');
    const daysUnitDisplay = document.getElementById('daysUnitDisplay');
    const milestonesList = document.getElementById('milestonesList');

    // --- Settings Panel Elements ---
    const menuIconToggle = document.getElementById('menuIconToggle');
    const settingsPanelOverlay = document.getElementById('settingsPanelOverlay');
    const closeSettingsButton = document.getElementById('closeSettingsButton');

    // --- Input Elements ---
    const partner1NameInput = document.getElementById('partner1NameInput');
    const partner2NameInput = document.getElementById('partner2NameInput');
    const partner1AvatarInput = document.getElementById('partner1AvatarInput');
    const partner2AvatarInput = document.getElementById('partner2AvatarInput');
    const anniversaryDateInput = document.getElementById('anniversaryDateInput');
    const appTitleInput = document.getElementById('appTitleInput');
    const daysStatusInput = document.getElementById('daysStatusInput');
    const daysUnitInput = document.getElementById('daysUnitInput');
    const backgroundImageUrlInput = document.getElementById('backgroundImageUrlInput');
    const removeBackgroundButton = document.getElementById('removeBackgroundButton');
    const saveAllSettingsButton = document.getElementById('saveAllSettingsButton');
    const removeAvatarButtons = document.querySelectorAll('.remove-avatar-btn');

    const STORAGE_PREFIX = 'loveDaysApp_final_';
    const STORAGE_KEYS = {
        P1_NAME: `${STORAGE_PREFIX}p1Name`,
        P2_NAME: `${STORAGE_PREFIX}p2Name`,
        P1_AVATAR: `${STORAGE_PREFIX}p1AvatarDataUrl`,
        P2_AVATAR: `${STORAGE_PREFIX}p2AvatarDataUrl`,
        ANNIVERSARY_DATE: `${STORAGE_PREFIX}anniversaryDate`,
        APP_TITLE: `${STORAGE_PREFIX}appTitle`,
        DAYS_STATUS: `${STORAGE_PREFIX}daysStatus`,
        DAYS_UNIT: `${STORAGE_PREFIX}daysUnit`,
        BACKGROUND_IMAGE: `${STORAGE_PREFIX}bgImage`
    };

    const DEFAULTS = {
        APP_TITLE: "Been Love Memory",
        P1_NAME: "Nguyễn Thi Thiên",
        P2_NAME: "Nguyễn Thị Phương Thảo",
        DAYS_STATUS: "Đang yêu",
        DAYS_UNIT: "Ngày",
        P1_DEFAULT_AVATAR_SRC: "img/thiennguyen.jpg",
        P2_DEFAULT_AVATAR_SRC: "img/phuongthao.jpg"
    };

    // --- Settings Panel Toggle ---
    menuIconToggle.addEventListener('click', () => settingsPanelOverlay.classList.add('open'));
    closeSettingsButton.addEventListener('click', () => settingsPanelOverlay.classList.remove('open'));
    settingsPanelOverlay.addEventListener('click', (e) => {
        if (e.target === settingsPanelOverlay) {
            settingsPanelOverlay.classList.remove('open');
        }
    });

    // --- Avatar Handling ---
    function displayAvatar(imgElement, containerElement, dataUrl, defaultImagePath) {
        if (dataUrl) { // User has selected an avatar (DataURL)
            imgElement.src = dataUrl;
            imgElement.style.display = 'block';
            containerElement.style.backgroundImage = 'none'; // Hide SVG background
            imgElement.onerror = () => { // Fallback if DataURL somehow fails (rare)
                imgElement.style.display = 'none';
                containerElement.style.backgroundImage = ''; // Re-enable CSS default SVG
            };
        } else if (defaultImagePath) { // No user avatar, try default image path
            imgElement.src = defaultImagePath;
            imgElement.style.display = 'block';
            containerElement.style.backgroundImage = 'none'; // Hide SVG background
            imgElement.onerror = () => { // Fallback if default image path is wrong or file missing
                console.error("Default avatar image not found:", defaultImagePath);
                imgElement.style.display = 'none';
                containerElement.style.backgroundImage = ''; // Re-enable CSS default SVG
            };
        } else { // No user avatar AND no default image path specified, use CSS SVG
            imgElement.src = '';
            imgElement.style.display = 'none';
            containerElement.style.backgroundImage = ''; // Re-enable CSS default SVG
        }
    }

    function handleAvatarFileInput(event, storageKey, imgEl, containerEl) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('img/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                displayAvatar(imgEl, containerEl, dataUrl);
                localStorage.setItem(storageKey, dataUrl); // Save immediately on selection
            };
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please select a valid image file (e.g., JPG, PNG).");
            event.target.value = null; // Clear the invalid file selection
        }
    }

    partner1AvatarInput.addEventListener('change', (e) => handleAvatarFileInput(e, STORAGE_KEYS.P1_AVATAR, avatar1Image, avatar1DisplayContainer));
    partner2AvatarInput.addEventListener('change', (e) => handleAvatarFileInput(e, STORAGE_KEYS.P2_AVATAR, avatar2Image, avatar2DisplayContainer));

    removeAvatarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const partnerNum = button.dataset.partner;
            if (partnerNum === "1") {
                localStorage.removeItem(STORAGE_KEYS.P1_AVATAR);
                displayAvatar(avatar1Image, avatar1DisplayContainer, null);
                partner1AvatarInput.value = null;
            } else if (partnerNum === "2") {
                localStorage.removeItem(STORAGE_KEYS.P2_AVATAR);
                displayAvatar(avatar2Image, avatar2DisplayContainer, null);
                partner2AvatarInput.value = null;
            }
        });
    });

    // --- Background Image ---
    function applyAppBackground(url) {
        if (url) {
            appContainer.style.backgroundImage = `url('${url}')`;
            appContainer.classList.add('custom-background-active');
        } else {
            appContainer.style.backgroundImage = 'none';
            appContainer.classList.remove('custom-background-active');
        }
    }
    removeBackgroundButton.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.BACKGROUND_IMAGE);
        backgroundImageUrlInput.value = '';
        applyAppBackground(null);
    });

    // --- Load, Save, Update ---
    function loadSettingsToInputs() {
        partner1NameInput.value = localStorage.getItem(STORAGE_KEYS.P1_NAME) || DEFAULTS.P1_NAME;
        partner2NameInput.value = localStorage.getItem(STORAGE_KEYS.P2_NAME) || DEFAULTS.P2_NAME;
        anniversaryDateInput.value = localStorage.getItem(STORAGE_KEYS.ANNIVERSARY_DATE) || '';
        appTitleInput.value = localStorage.getItem(STORAGE_KEYS.APP_TITLE) || DEFAULTS.APP_TITLE;
        daysStatusInput.value = localStorage.getItem(STORAGE_KEYS.DAYS_STATUS) || DEFAULTS.DAYS_STATUS;
        daysUnitInput.value = localStorage.getItem(STORAGE_KEYS.DAYS_UNIT) || DEFAULTS.DAYS_UNIT;
        backgroundImageUrlInput.value = localStorage.getItem(STORAGE_KEYS.BACKGROUND_IMAGE) || '';
    }

    function applySettingsFromStorageToDisplay() {
        appTitleDisplay.textContent = localStorage.getItem(STORAGE_KEYS.APP_TITLE) || DEFAULTS.APP_TITLE;
        partner1NameDisplay.textContent = localStorage.getItem(STORAGE_KEYS.P1_NAME) || DEFAULTS.P1_NAME;
        partner2NameDisplay.textContent = localStorage.getItem(STORAGE_KEYS.P2_NAME) || DEFAULTS.P2_NAME;
        daysStatusDisplay.textContent = localStorage.getItem(STORAGE_KEYS.DAYS_STATUS) || DEFAULTS.DAYS_STATUS;
        daysUnitDisplay.textContent = localStorage.getItem(STORAGE_KEYS.DAYS_UNIT) || DEFAULTS.DAYS_UNIT;

        const p1StoredAvatar = localStorage.getItem(STORAGE_KEYS.P1_AVATAR);
        // This line is crucial:
        displayAvatar(avatar1Image, avatar1DisplayContainer, p1StoredAvatar, DEFAULTS.P1_DEFAULT_AVATAR_SRC);

        const p2StoredAvatar = localStorage.getItem(STORAGE_KEYS.P2_AVATAR);
        // And this line:
        displayAvatar(avatar2Image, avatar2DisplayContainer, p2StoredAvatar, DEFAULTS.P2_DEFAULT_AVATAR_SRC);
        applyAppBackground(localStorage.getItem(STORAGE_KEYS.BACKGROUND_IMAGE));

        updateDaysAndMilestones();
    }


    function saveAllSettingsFromInputs() {
        localStorage.setItem(STORAGE_KEYS.P1_NAME, partner1NameInput.value.trim() || DEFAULTS.P1_NAME);
        localStorage.setItem(STORAGE_KEYS.P2_NAME, partner2NameInput.value.trim() || DEFAULTS.P2_NAME);
        localStorage.setItem(STORAGE_KEYS.ANNIVERSARY_DATE, anniversaryDateInput.value);
        localStorage.setItem(STORAGE_KEYS.APP_TITLE, appTitleInput.value.trim() || DEFAULTS.APP_TITLE);
        localStorage.setItem(STORAGE_KEYS.DAYS_STATUS, daysStatusInput.value.trim() || DEFAULTS.DAYS_STATUS);
        localStorage.setItem(STORAGE_KEYS.DAYS_UNIT, daysUnitInput.value.trim() || DEFAULTS.DAYS_UNIT);
        localStorage.setItem(STORAGE_KEYS.BACKGROUND_IMAGE, backgroundImageUrlInput.value.trim());
        // Avatars are saved on file change, no need to re-save here unless you want to clear if input is empty

        applySettingsFromStorageToDisplay(); // Refresh display with newly saved settings
        alert("Settings Saved!");
    }
    saveAllSettingsButton.addEventListener('click', saveAllSettingsFromInputs);

    function updateDaysAndMilestones() {
        const anniversaryDateString = localStorage.getItem(STORAGE_KEYS.ANNIVERSARY_DATE);
        if (!anniversaryDateString) {
            daysCountDisplay.textContent = "0";
            milestonesList.innerHTML = "<li>Set your special date in settings!</li>";
            return;
        }

        const anniversaryDate = new Date(anniversaryDateString);
        anniversaryDate.setHours(0, 0, 0, 0); // Normalize to start of day
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        if (anniversaryDate.getTime() > today.getTime()) {
            daysCountDisplay.textContent = "Future";
            milestonesList.innerHTML = "<li>Your special date is in the future.</li>";
            return;
        }

        const diffTime = Math.abs(today.getTime() - anniversaryDate.getTime());
        let finalDiffDays = 0;
        if (anniversaryDate.getTime() === today.getTime()) {
            finalDiffDays = 1; // Day 1 on the anniversary day itself
        } else {
            finalDiffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
        daysCountDisplay.textContent = finalDiffDays;
        calculateMilestones(anniversaryDate, finalDiffDays);
    }

    function calculateMilestones(startDate, currentDays) {
        let milestonesHTML = "";
        const milestonesData = [
            { days: 30, label: "1 Month" }, { days: 100, label: "100 Days" },
            { days: 182, label: "6 Months" }, { days: 365, label: "1 Year" },
            { days: 500, label: "500 Days" }, { days: 730, label: "2 Years" },
            { days: 1000, label: "1000 Days" }, { days: 1825, label: "5 Years" }
        ];

        let upcomingCount = 0;
        for (const ms of milestonesData) {
            if (ms.days >= currentDays && upcomingCount < 4) {
                const milestoneDate = new Date(startDate);
                milestoneDate.setDate(startDate.getDate() + ms.days - 1); // -1 because currentDays is inclusive
                const daysAway = ms.days - currentDays;

                if (daysAway === 0) {
                    milestonesHTML += `<li>🎉 Today is ${ms.label}! 🎉</li>`;
                } else {
                    milestonesHTML += `<li>${ms.label}: ${milestoneDate.toLocaleDateString()} (${daysAway} ${daysAway === 1 ? 'day' : 'days'} away)</li>`;
                }
                upcomingCount++;
            }
        }
        if (currentDays > 0 && upcomingCount === 0 && localStorage.getItem(STORAGE_KEYS.ANNIVERSARY_DATE)) {
            milestonesHTML = "<li>Many great milestones passed!</li>";
        } else if (!localStorage.getItem(STORAGE_KEYS.ANNIVERSARY_DATE)) {
            milestonesHTML = "<li>Set date to see milestones.</li>";
        }
        milestonesList.innerHTML = milestonesHTML;
    }

    // --- Initial Load & Interval Update ---
    loadSettingsToInputs(); // Populate settings panel inputs
    applySettingsFromStorageToDisplay(); // Apply stored settings to main display
    setInterval(updateDaysAndMilestones, 60000); // Update days count every minute
});