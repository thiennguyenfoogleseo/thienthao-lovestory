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
        P2_DEFAULT_AVATAR_SRC: "img/phuongthao.jpg",
        DEFAULT_BACKGROUND_SRC: "img/thienthao.jpg"
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
        if (file && file.type.startsWith('image/')) {
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
    function applyAppBackground(userUrl, defaultUrl) {
        let imageUrlToApply = null;

        if (userUrl) { // User has provided a URL
            imageUrlToApply = userUrl;
        } else if (defaultUrl) { // No user URL, try default
            imageUrlToApply = defaultUrl;
        }

        if (imageUrlToApply) {
            appContainer.style.backgroundImage = `url('${imageUrlToApply}')`;
            appContainer.classList.add('custom-background-active');
            // Test if image loaded (optional, good for debugging)
            const imgTest = new Image();
            imgTest.src = imageUrlToApply;
            imgTest.onload = () => console.log("Background image loaded successfully:", imageUrlToApply);
            imgTest.onerror = () => console.error("Failed to load background image:", imageUrlToApply);

        } else { // No user URL and no default, or both failed (rely on CSS base color)
            appContainer.style.backgroundImage = 'none';
            appContainer.classList.remove('custom-background-active');
        }
    }
    removeBackgroundButton.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.BACKGROUND_IMAGE);
        backgroundImageUrlInput.value = '';
        // When user removes their custom background, revert to the default background
        applyAppBackground(null, DEFAULTS.DEFAULT_BACKGROUND_SRC);
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
        const storedBackgroundUrl = localStorage.getItem(STORAGE_KEYS.BACKGROUND_IMAGE);
        applyAppBackground(storedBackgroundUrl, DEFAULTS.DEFAULT_BACKGROUND_SRC);

        updateDaysAndMilestones();
    }

// === MUSIC ELEMENTS AND LOGIC ===
const musicPlayer = document.getElementById('backgroundMusicPlayer');
// THAY ĐỔI ID Ở ĐÂY
const musicToggleButtonMain = document.getElementById('musicToggleButtonHeader'); // Sử dụng ID mới
const musicIconSpan = musicToggleButtonMain ? musicToggleButtonMain.querySelector('.music-icon') : null;
    // Kiểm tra các element nhạc cơ bản
    if (!musicPlayer) {
        console.error("Music player element (#backgroundMusicPlayer) not found! Music will not work.");
        // Không return ở đây nếu các phần khác của app vẫn cần chạy
    }
    if (!musicToggleButtonMain) {
        console.error("Main music toggle button (#musicToggleButtonMain) not found!");
    }
    if (musicToggleButtonMain && !musicIconSpan) {
        console.error("Music icon span (.music-icon) inside button not found!");
    }

    const MUSIC_STORAGE_PREFIX = 'loveDaysApp_Music_v2_'; // Thay đổi prefix để reset state nếu cần
    const MUSIC_STORAGE_KEYS = {
        IS_PLAYING: `${MUSIC_STORAGE_PREFIX}isPlaying`, // Sẽ lưu 'true' hoặc 'false'
        VOLUME: `${MUSIC_STORAGE_PREFIX}volume`
    };

    // Hàm cập nhật giao diện nút nhạc (icon và class)
    function updateMusicButtonUI() {
        if (!musicPlayer || !musicToggleButtonMain || !musicIconSpan) return;

        if (musicPlayer.paused) {
            musicToggleButtonMain.classList.remove('playing');
            musicIconSpan.innerHTML = '🎵'; // Hoặc '▶️' nếu bạn muốn icon play
        } else {
            musicToggleButtonMain.classList.add('playing');
            musicIconSpan.innerHTML = '🎶'; // Hoặc '⏸️' nếu bạn muốn icon pause
        }
    }

    // Hàm cố gắng phát nhạc
    async function attemptToPlayMusic() {
        if (!musicPlayer) return;

        if (musicPlayer.paused) {
            try {
                await musicPlayer.play(); // play() trả về một Promise
                console.log("Music playback started or resumed.");
                localStorage.setItem(MUSIC_STORAGE_KEYS.IS_PLAYING, 'true');
            } catch (error) {
                console.warn("Music play was prevented or failed:", error);
                // Trình duyệt có thể chặn tự động phát nếu không có tương tác người dùng
                // hoặc nếu đây là lần đầu tải trang.
                localStorage.setItem(MUSIC_STORAGE_KEYS.IS_PLAYING, 'false');
            }
        }
        updateMusicButtonUI(); // Luôn cập nhật UI sau khi cố gắng play/pause
    }

    // Hàm tạm dừng nhạc
    function pauseMusic() {
        if (!musicPlayer) return;

        musicPlayer.pause();
        console.log("Music playback paused.");
        localStorage.setItem(MUSIC_STORAGE_KEYS.IS_PLAYING, 'false');
        updateMusicButtonUI();
    }

    // Gán sự kiện click cho nút nhạc chính
    if (musicToggleButtonMain) {
        musicToggleButtonMain.addEventListener('click', () => {
            if (!musicPlayer) {
                alert("Lỗi: Không tìm thấy trình phát nhạc.");
                return;
            }
            if (musicPlayer.paused) {
                attemptToPlayMusic();
            } else {
                pauseMusic();
            }
        });
    }

    // Load cài đặt nhạc (âm lượng, trạng thái phát trước đó)
    function loadMusicSettings() {
        if (!musicPlayer) return;

        const savedVolume = localStorage.getItem(MUSIC_STORAGE_KEYS.VOLUME);
        if (savedVolume !== null) {
            musicPlayer.volume = parseFloat(savedVolume);
        } else {
            musicPlayer.volume = 0.5; // Âm lượng mặc định
        }
        // Chúng ta không cố gắng tự động phát nhạc khi tải trang.
        // Người dùng phải tự nhấn nút.
        // Chỉ cập nhật UI của nút dựa trên trạng thái `paused` mặc định của player.
        updateMusicButtonUI();
    }

    // --- Cài đặt nhạc trong Settings Panel (NẾU BẠN VẪN CÓ) ---
    const toggleMusicButtonSettings = document.getElementById('toggleMusicButton'); // Nút trong settings
    const volumeControl = document.getElementById('volumeControl');

    if (toggleMusicButtonSettings) {
        toggleMusicButtonSettings.addEventListener('click', () => {
            if (!musicPlayer) return;
            if (musicPlayer.paused) {
                attemptToPlayMusic();
            } else {
                pauseMusic();
            }
            // Đồng bộ text của nút trong settings (nếu nó khác icon)
            toggleMusicButtonSettings.textContent = musicPlayer.paused ? 'Play Music' : 'Pause Music';
        });
    }

    if (volumeControl) {
        // Load và set giá trị ban đầu cho volumeControl từ localStorage hoặc default
        if (musicPlayer) volumeControl.value = musicPlayer.volume;

        volumeControl.addEventListener('input', () => {
            if (musicPlayer) {
                musicPlayer.volume = volumeControl.value;
                localStorage.setItem(MUSIC_STORAGE_KEYS.VOLUME, volumeControl.value);
            }
        });
    }
    // --- HẾT PHẦN CÀI ĐẶT NHẠC TRONG SETTINGS PANEL ---

    // === KẾT THÚC MUSIC LOGIC ===

    function saveAllSettingsFromInputs() {
        localStorage.setItem(STORAGE_KEYS.P1_NAME, partner1NameInput.value.trim() || DEFAULTS.P1_NAME);
        localStorage.setItem(STORAGE_KEYS.P2_NAME, partner2NameInput.value.trim() || DEFAULTS.P2_NAME);
        localStorage.setItem(STORAGE_KEYS.ANNIVERSARY_DATE, anniversaryDateInput.value);
        localStorage.setItem(STORAGE_KEYS.APP_TITLE, appTitleInput.value.trim() || DEFAULTS.APP_TITLE);
        localStorage.setItem(STORAGE_KEYS.DAYS_STATUS, daysStatusInput.value.trim() || DEFAULTS.DAYS_STATUS);
        localStorage.setItem(STORAGE_KEYS.DAYS_UNIT, daysUnitInput.value.trim() || DEFAULTS.DAYS_UNIT);
        localStorage.setItem(STORAGE_KEYS.BACKGROUND_IMAGE, backgroundImageUrlInput.value.trim());
        // Avatars are saved on file change, no need to re-save here unless you want to clear if input is empty
        const userBgUrl = backgroundImageUrlInput.value.trim();
        if (userBgUrl) {
            localStorage.setItem(STORAGE_KEYS.BACKGROUND_IMAGE, userBgUrl);
            applyAppBackground(userBgUrl, DEFAULTS.DEFAULT_BACKGROUND_SRC); // Apply user's choice
        } else {
            // If user clears the input, it implies they want to remove custom BG
            // and revert to default or no BG if default is also not set.
            localStorage.removeItem(STORAGE_KEYS.BACKGROUND_IMAGE);
            applyAppBackground(null, DEFAULTS.DEFAULT_BACKGROUND_SRC);
        }
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