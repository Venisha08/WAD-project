// Default timer values
const defaultTimes = {
  task: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
};

let currentTime = defaultTimes.task;
let timerInterval = null;
let isRunning = false;
let currentTaskId = null; // Track the current task's ID
const API_URL = "http://localhost:5000/api";

// DOM Elements
const timerDisplay = document.querySelector(".timer-box h2");
const startButton = document.querySelector(".start-btn");
const resetButton = document.querySelector(".reset-btn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  try {
    loadState();
    await requestNotificationPermission();
    await loadCurrentSettings();
    updateTimerDisplay();
    await loadTasks();
    document
      .querySelector("#save-timer-settings")
      ?.addEventListener("click", saveTimerSettings);
  } catch (error) {
    console.error("Error initializing app:", error);
  }
});

// Save the timer state to localStorage
function saveState() {
  const state = {
    currentTime,
    isRunning,
    currentTaskId, // Save current task ID
  };
  localStorage.setItem("timerState", JSON.stringify(state));
}

// Load the timer state from localStorage
function loadState() {
  const state = JSON.parse(localStorage.getItem("timerState"));
  if (state) {
    currentTime = state.currentTime || defaultTimes.task;
    isRunning = state.isRunning || false;
    currentTaskId = state.currentTaskId || null;
    updateTimerDisplay();

    if (isRunning) {
      startButton.textContent = "Stop";
      startTimer();
    }
  }
}

// Request Notification Permission
async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
}

// Load timer settings from the backend
async function loadCurrentSettings() {
  try {
    const response = await fetch(`${API_URL}/currentsettings`);
    if (!response.ok) throw new Error("Failed to fetch settings");

    const settings = await response.json();
    if (settings) {
      defaultTimes.task = settings.timers.workTimer * 60;
      defaultTimes.shortBreak = settings.timers.breakTimer * 60;
      defaultTimes.longBreak = settings.timers.longBreakTimer * 60;
    }
  } catch (error) {
    console.error("Error loading current settings:", error);
  }
}

// Update Timer Display
function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(currentTime);
}

// Format time as MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Timer Button Handlers
document.querySelector(".timer-buttons").addEventListener("click", async (event) => {
  if (event.target.classList.contains("timer-btn")) {
    const buttonText = event.target.textContent.toLowerCase();
    await loadCurrentSettings();

    if (buttonText === "task") {
      currentTime = defaultTimes.task;
    } else if (buttonText === "short") {
      currentTime = defaultTimes.shortBreak;
    } else if (buttonText === "long") {
      currentTime = defaultTimes.longBreak;
    }

    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    startButton.textContent = "Start";
    updateTimerDisplay();
  }
});

// Start/Stop Timer
startButton.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = "Start";
  } else {
    isRunning = true;
    startButton.textContent = "Stop";
    timerInterval = setInterval(() => {
      if (currentTime > 0) {
        currentTime--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        window.alert("Time's up! Task completed.");
        showBrowserNotification("Time's up! Task completed.");
        markTaskCompleted(currentTaskId); // Mark the task as completed in the UI and DB
        resetTimer();
      }
    }, 1000);
  }
});

// Reset Timer
resetButton.addEventListener("click", resetTimer);

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  currentTime = defaultTimes.task;
  startButton.textContent = "Start";
  updateTimerDisplay();
}

// Show Browser Notification with Sound
function showBrowserNotification(message) {
  if (Notification.permission === "granted") {
    // Show the notification
    const notification = new Notification(message);

    // Add a notification event listener for any actions like clicks
    notification.onclick = function () {
      // Optionally, handle user interaction with the notification
      console.log("Notification clicked");
    };

    // Play the sound if required
    playNotification();
  } else {
    console.warn("Notification permission not granted.");
  }
}


// Play Notification Sound
function playNotification() {
  const audio = new Audio("assets/sounds/chime.mp3");
  audio.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });
}

// Add Task
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

async function addTask() {
  const task = taskInput.value.trim();
  if (task === "") {
    alert("Please enter a task!");
    return;
  }

  try {
    const newTask = await addTaskToDB(task);
    renderTask(newTask);
  } catch (error) {
    alert("Failed to add task: " + error.message);
  }

  taskInput.value = "";
}

async function addTaskToDB(taskText) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: taskText }),
  });

  if (!response.ok) throw new Error("Failed to add task");
  const task = await response.json();
  currentTaskId = task._id; // Store task ID for marking completion
  return task;
}

function renderTask(task) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = task._id;

  const taskText = document.createElement("span");
  taskText.textContent = task.text;
  taskItem.appendChild(taskText);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-btn");
  editButton.addEventListener("click", () => {
    const newTask = prompt("Edit your task:", taskText.textContent);
    if (newTask) taskText.textContent = newTask;
  });
  taskItem.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
  deleteButton.addEventListener("click", async () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete the task: "${taskText.textContent}"?`
    );
    if (confirmDelete) {
      try {
        await deleteTaskFromDB(task._id);
        taskList.removeChild(taskItem);
      } catch (error) {
        alert("Failed to delete task: " + error.message);
      }
    }
  });
  taskItem.appendChild(deleteButton);

  taskList.appendChild(taskItem);
}

async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error("Failed to fetch tasks");

    const tasks = await response.json();
    tasks.forEach((task) => renderTask(task));
  } catch (error) {
    console.error("Failed to load tasks: ", error);
  }
}

async function deleteTaskFromDB(taskId) {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete task");
}

async function markTaskCompleted(taskId) {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to mark task as completed");

    // Update the task's status in the UI
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskItem) {
      const tickMark = document.createElement("span");
      tickMark.textContent = "✔️";
      taskItem.appendChild(tickMark);
      taskItem.classList.add("completed");

      // Hide the Edit and Delete buttons
      const editButton = taskItem.querySelector(".edit-btn");
      if (editButton) editButton.style.display = "none";
    }
  } catch (error) {
    console.error("Error marking task as completed:", error);
  }
}

