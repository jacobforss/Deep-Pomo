let timer = 0;
let isRunning = false;
let isRestMode = false;

chrome.alarms.create("pomodoroTimer", {
    periodInMinutes: 1 / 60,
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "pomodoroActions",
        title: "Deep Pomo",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "focusTimer",
        parentId: "pomodoroActions",
        title: "Focus Timer",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "restTimer",
        parentId: "pomodoroActions",
        title: "Rest Timer",
        contexts: ["all"]
    });
});

// Listen for context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "focusTimer") {
        startPomodoroTimer();
    } else if (info.menuItemId === "restTimer") {
        startRestTimer();
    }
});

function startPomodoroTimer() {
    timer = 1 * 10;
    isRestMode = false;
    isRunning = true;

    chrome.notifications.create({
        type: "basic",
        iconUrl: "./img/poke-ball.png",
        title: "Pomodoro Started",
        message: "Your Pomodoro session has started!",
    });

    timer();
}

function startRestTimer() {
    timer = 1 * 5;
    isRestMode = true;
    isRunning = true;

    chrome.notifications.create({
        type: "basic",
        iconUrl: "./img/poke-ball.png",
        title: "Rest Period",
        message: "It's time to take a rest!",
    });

    timer();
}

function timer() {
    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === "pomodoroTimer" && isRunning) {
            if (timer > 0) {
                timer--; // Decrement timer
                chrome.storage.local.set({ timer });
            } else {
                // Timer finished
                isRunning = false;
                chrome.storage.local.set({ isRunning });
    
                if (isRestMode) {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: "./img/poke-ball.png", // Update with your icon
                        title: "Rest Time Over",
                        message: "Your rest period is over! Time to get back to work!",
                    });
                } else {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: "./img/poke-ball.png", // Update with your icon
                        title: "Pomodoro Complete",
                        message: "Your Pomodoro session is complete! Time to take a break!",
                    });
                }
            }
        }
    });
}

self.addEventListener('install', (event) => {
    console.log('Service Worker Installed');
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker Activated');
  });