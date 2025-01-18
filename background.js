let timer = 0;
let isRunning = false;
let isRestMode = false;

const startPhrases = [
    "You’ve got this!",
    "Make it happen!",
    "Push yourself, you’re closer than you think.",
    "Every step counts.",
    "Stay focused, stay positive!",
    "Make today count!",
    "Success begins with action!",
    "You are your only limit.",
    "Progress, not perfection!",
    "The best time to start is now.",
    "Take the first step, the rest will follow.",
    "Go the extra mile!",
    "Don’t wait for opportunity, create it.",
    "Take action, make it happen!"
];
const endPhrases = [
    "Success in motion!",
    "You’re leveling up!",
    "One step closer!",
    "You’re on your way!",
    "Momentum is building!",
    "Progress feels good!",
    "Steps become strides!",
    "Keep the pace up!",
    "Closer than ever!",
    "This is progress!"
];
const breakPhrases = [
    "Pause, then push past it.",
    "Take a breather!",
    "Pause, breathe, reset!",
    "Get ready for one more.",
    "Take five and refocus."
];
const breakEndPhrases = [
    "Action starts now!",
    "Pick up the pace!",
    "Momentum starts here!",
    "All in, let’s go!",
    "Make it happen now!",
    "Keep the energy up!",
    "Let’s hit the next level!"
];

const startText = startPhrases[Math.floor(Math.random() * startPhrases.length)];
const endText = endPhrases[Math.floor(Math.random() * endPhrases.length)];
const breakText = breakPhrases[Math.floor(Math.random() * breakPhrases.length)];
const breakEndText = breakEndPhrases[Math.floor(Math.random() * breakEndPhrases.length)];



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
        iconUrl: "./img/uncomplete-128.png",
        title: "",
        message: startText,
    });

    countdownPomodoroTimer();
}

function startRestTimer() {
    timer = 1 * 5;
    isRestMode = true;
    isRunning = true;

    chrome.notifications.create({
        type: "basic",
        iconUrl: "./img/uncomplete-128.png",
        title: "",
        message: breakText,
    });

    countdownPomodoroTimer();
}

function countdownPomodoroTimer() {
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
                        iconUrl: "./img/uncomplete-128.png", // Update with your icon
                        title: "",
                        message: breakEndText,
                    });
                } else {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: "./img/uncomplete-128.png", // Update with your icon
                        title: "",
                        message: endText,
                    });
                }
            }
        }
    });
}