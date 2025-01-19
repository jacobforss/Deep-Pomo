const timerDisplay = document.getElementById("timer-display");
const startButtons = document.getElementById("start-buttons");
const runningButtons = document.getElementById("running-buttons");
const pausedButtons = document.getElementById("paused-buttons");
const focusTimeInput = document.getElementById("focus-time");
const restTimeInput = document.getElementById("rest-time");

function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function switchVisibility(visibleGroup) {
    startButtons.classList.toggle("hidden", visibleGroup !== startButtons);
    runningButtons.classList.toggle("hidden", visibleGroup !== runningButtons);
    pausedButtons.classList.toggle("hidden", visibleGroup !== pausedButtons);
}

function fetchTimerState() {
    chrome.runtime.sendMessage({ action: "getTimerState" }, (response) => {
        if (response) {
            updateDisplay(response.timer);

            if (response.isRunning) {
                switchVisibility(runningButtons);
            } else if (response.isPaused) {
                switchVisibility(pausedButtons);
            } else {
                switchVisibility(startButtons);
            }
        }
    });
}


document.getElementById("start-focus").addEventListener("click", () => {
    const duration = Number(focusTimeInput.value);
    chrome.runtime.sendMessage({ action: "start", duration, isRestMode: false });
    switchVisibility(runningButtons);
});

document.getElementById("start-rest").addEventListener("click", () => {
    const duration = Number(restTimeInput.value);
    chrome.runtime.sendMessage({ action: "start", duration, isRestMode: true });
    switchVisibility(runningButtons);
});

document.getElementById("pause").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "pause" });
    switchVisibility(pausedButtons);
});
document.getElementById("reset").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "reset" });
    updateDisplay(0);
    switchVisibility(startButtons);
});

document.getElementById("resume").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "resume" });
    switchVisibility(runningButtons);
});


document.getElementById("save-settings").addEventListener("click", () => {
    chrome.storage.local.set({
        focusTime: focusTimeInput.value,
        restTime: restTimeInput.value
    });
    const settings = document.getElementById("settings");
    const container = document.getElementById("container"); 
    const settingsBtn = document.getElementById("settings-btn");
    settings.style.display = "none";
    container.style.display = "flex";
    settingsBtn.style.display = "flex";
});

chrome.storage.local.get(["focusTime", "restTime"], (data) => {
    if (data.focusTime) focusTimeInput.value = data.focusTime;
    if (data.restTime) restTimeInput.value = data.restTime;
});

// Poll the timer state every second to keep the popup updated
setInterval(fetchTimerState, 1000);

// Fetch initial state
fetchTimerState();

document.getElementById("settings-btn").addEventListener("click", () => {
    const settings = document.getElementById("settings");
    const container = document.getElementById("container"); 
    const settingsBtn = document.getElementById("settings-btn");
    settings.style.display = "flex";
    container.style.display = "none";
    settingsBtn.style.display = "none";
});