// Fetch notifications and background themes on page load
window.onload = async function () {
    await loadNotifications();
    await loadBackgrounds();
    await loadCurrentSettings();

    // Attach Save Button Listener
    document.querySelector('#save-timer-settings').addEventListener('click', saveTimerSettings);
};

// Load Notifications
async function loadNotifications() {
    try {
        const response = await fetch('http://localhost:5000/api/notifications');
        const notifications = await response.json();

        // Populate notification table
        const tableBody = document.querySelector('#notification-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        notifications.forEach(notification => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${notification.name}</td>
                <td>${notification.pointsToUnlock}</td>
                <td>
                    <button class="play-btn">Play</button>
                    <button class="stop-btn" disabled>Stop</button>
                    <button class="select-btn">Select</button>
                </td>
            `;

            // Event listeners
            const playBtn = row.querySelector('.play-btn');
            const stopBtn = row.querySelector('.stop-btn');
            const selectBtn = row.querySelector('.select-btn');

            playBtn.addEventListener('click', () => playSound(notification.soundFile, stopBtn));
            stopBtn.addEventListener('click', stopSound);
            selectBtn.addEventListener('click', () => selectNotification(notification.name, selectBtn));

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Load Background Themes
async function loadBackgrounds() {
    try {
        const response = await fetch('http://localhost:5000/api/backgrounds');
        const themes = await response.json();

        // Populate background themes table
        const tableBody = document.querySelector('#background-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        themes.forEach(theme => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${theme.name}</td>
                <td>${theme.pointsToUnlock}</td>
                <td>
                    <button class="view-btn">View</button>
                    <button class="save-btn">Save</button>
                </td>
            `;

            // Event listeners
            // Attach View Button Handler
            const viewBtn = row.querySelector('.view-btn');
            viewBtn.addEventListener('click', () => previewTheme(theme));

            const saveBtn = row.querySelector('.save-btn');
            saveBtn.addEventListener('click', () => saveTheme(theme.name));

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading backgrounds:', error);
    }
}

// Load Current Settings
// Load Current Settings
async function loadCurrentSettings() {
    try {
        const response = await fetch('http://localhost:5000/api/currentsettings');
        const settings = await response.json();

        if (settings) {
            // Match the schema's property names
            document.querySelector('#task-timer').value = settings.timers.workTimer || 25;
            document.querySelector('#short-break-timer').value = settings.timers.breakTimer || 5;
            document.querySelector('#long-break-timer').value = settings.timers.longBreakTimer || 15;

            // Update selected notification
            document.querySelector('#notification-table .select-btn.selected')?.classList.remove('selected');
            document.querySelectorAll('.select-btn').forEach(button => {
                if (button.closest('tr').querySelector('td:first-child').textContent === settings.notification) {
                    button.classList.add('selected');
                    button.textContent = 'Selected';
                }
            });
        }
    } catch (error) {
        console.error('Error loading current settings:', error);
    }
}

// Save Timer Settings
async function saveTimerSettings() {
    const workTimer = document.querySelector('#task-timer').value;
    const breakTimer = document.querySelector('#short-break-timer').value;
    const longBreakTimer = document.querySelector('#long-break-timer').value;

    try {
        await fetch('http://localhost:5000/api/currentsettings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timers: { workTimer, breakTimer, longBreakTimer }
            }),
        });
        alert('Timer settings saved successfully!');
        await loadCurrentSettings(); // Reload updated settings to the UI
    } catch (error) {
        console.error('Error saving timer settings:', error);
    }
}


// Select Notification
async function selectNotification(notification, selectBtn) {
    try {
        await fetch('http://localhost:5000/api/currentsettings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notification })
        });
        alert(`Notification "${notification}" selected.`);

        // Update button styles dynamically
        document.querySelectorAll('.select-btn').forEach(btn => {
            btn.textContent = 'Select';
            btn.classList.remove('selected');
        });
        selectBtn.textContent = 'Selected';
        selectBtn.classList.add('selected');
    } catch (error) {
        console.error('Error selecting notification:', error);
    }
}

// Save Theme
async function saveTheme(theme) {
    try {
        await fetch('http://localhost:5000/api/currentsettings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme })
        });
        alert(`Theme "${theme}" saved.`);
    } catch (error) {
        console.error('Error saving theme:', error);
    }
}

// Preview Theme
function previewTheme(theme) {
    // Target elements in the preview section
    const container = document.querySelector('.preview-container');
    const clockContainer = document.querySelector('.clock-container');
    const previewTitle = container.querySelector('h2');
    const timerClock = container.querySelector('h3');
    const clockTime = document.querySelector('#clock-time');

    // Save the original styles
    const originalStyles = {
        containerBackground: container.style.backgroundImage, // Store backgroundImage for gradient
        clockContainerBackground: clockContainer.style.backgroundColor,
        previewTitleColor: previewTitle.style.color,
        timerClockColor: timerClock.style.color,
        clockTimeColor: clockTime.style.color,
    };

    // Apply the theme styles
    container.style.backgroundImage = theme.backgroundColor; // Gradient for container background
    clockContainer.style.backgroundColor = theme.timerContainerColor; // Color for clock container
    previewTitle.style.color = theme.previewColor; // Title color for preview
    timerClock.style.color = theme.textColor; // Timer text color
    clockTime.style.color = theme.taskTimerCountColor; // Countdown text color

    // Timer countdown for preview
    let timeRemaining = 5; // 5 seconds
    //clockTime.textContent = `Preview ends in: ${timeRemaining}s`;

    const countdown = setInterval(() => {
        timeRemaining -= 1;
       // clockTime.textContent = `Preview ends in: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            // Restore original styles after 5 seconds
            container.style.backgroundImage = originalStyles.containerBackground;
            clockContainer.style.backgroundColor = originalStyles.clockContainerBackground;
            previewTitle.style.color = originalStyles.previewTitleColor;
            timerClock.style.color = originalStyles.timerClockColor;
            clockTime.style.color = originalStyles.clockTimeColor;

            // Clear countdown
            clearInterval(countdown);
            clockTime.textContent = '';
        }
    }, 1000);
}



// Play and Stop sound handlers
let currentAudio = null;

function playSound(soundFile, stopButton) {
    if (currentAudio) currentAudio.pause();
    currentAudio = new Audio(soundFile);
    currentAudio.play();
    stopButton.disabled = false;
}

function stopSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}
