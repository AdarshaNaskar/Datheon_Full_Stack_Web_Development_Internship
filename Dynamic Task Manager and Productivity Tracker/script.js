let tasks = [];
let currentFilter = "all";
let editingTaskId = null;

const STORAGE_KEY = "taskflow_tasks";

let currentSort = "manual";
let draggedTaskId = null;

/* 
  DOM ELEMENTS
 */

const greeting = document.getElementById("greeting");
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskCategory = document.getElementById("task-category");
const taskDate = document.getElementById("task-date");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");

const searchInput = document.getElementById("task-search");
const sortButton = document.getElementById("sort-tasks");

const totalTasks = document.getElementById("total-tasks");
const activeTasks = document.getElementById("active-tasks");
const completedTasks = document.getElementById("completed-tasks");
const productivityRate = document.getElementById("productivity-rate");
const productivityProgress = document.getElementById("productivity-progress");

const filterButtons = document.querySelectorAll(".filter-btn");

// Edit modal elements
const editModal = document.getElementById("edit-modal");
const editTaskForm = document.getElementById("edit-task-form");
const editTaskTitle = document.getElementById("edit-task-title");
const editTaskCategory = document.getElementById("edit-task-category");
const editTaskDate = document.getElementById("edit-task-date");
const closeEditModal = document.getElementById("close-edit-modal");
const cancelEdit = document.getElementById("cancel-edit");

function greetings() {
  if (!greeting) return;

  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    greeting.textContent = "morning";
  } else if (hour >= 12 && hour < 17) {
    greeting.textContent = "afternoon";
  } else {
    greeting.textContent = "evening";
  }
}

/* 
  LOCALSTORAGE FUNCTIONS
 */

// Save tasks to browser storage
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Unable to save tasks:", error);
  }
}

// Load tasks from browser storage
function loadFromLocalStorage() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      tasks = [];
      return;
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      tasks = [];
      return;
    }

    // Keep only tasks with valid data
    tasks = parsedTasks
      .filter(function (task) {
        return (
          task &&
          typeof task.id === "string" &&
          typeof task.title === "string" &&
          typeof task.category === "string" &&
          typeof task.completed === "boolean"
        );
      })
      .map(function (task) {
        return {
          id: task.id,
          title: task.title,
          category: ["Work", "Personal", "Study"].includes(task.category)
            ? task.category
            : "Work",
          dueDate: typeof task.dueDate === "string" ? task.dueDate : "",
          completed: task.completed,
          createdAt:
            typeof task.createdAt === "string"
              ? task.createdAt
              : new Date().toISOString(),
        };
      });
  } catch (error) {
    console.error("Unable to load saved tasks:", error);
    tasks = [];
  }
}

/* 
   4. INITIALIZE APPLICATION
 */

function initializeApp() {
  greetings();

  loadFromLocalStorage();

  updateCurrentDate();
  setMinimumDate();
  updateSortButton();

  renderTasks();
  updateDashboard();
}

/* 
  CURRENT DATE
 */

function updateCurrentDate() {
  const dateElement = document.getElementById("current-date");
  const today = new Date();

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  dateElement.textContent = today.toLocaleDateString("en-US", options);
}

/* 
  GET TODAY'S DATE
 */

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* 
  SET MINIMUM DATE
 */

function setMinimumDate() {
  const today = getTodayDate();

  taskDate.min = today;
  editTaskDate.min = today;
}

/* 
  GENERATE TASK ID
 */

function generateTaskId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/* 
  CREATE NEW TASK
 */

function addTask(title, category, dueDate) {
  const newTask = {
    id: generateTaskId(),
    title: title,
    category: category,
    dueDate: dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  // New tasks appear at the top
  tasks.unshift(newTask);

  // Return to manual order when adding a task
  currentSort = "manual";
  updateSortButton();

  saveToLocalStorage();
  renderTasks();
  updateDashboard();
}

/* 
  HANDLE ADD TASK FORM
 */

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskTitle.value.trim();
  const category = taskCategory.value;
  const dueDate = taskDate.value;

  if (!title) {
    alert("Please enter a task name.");
    taskTitle.focus();
    return;
  }

  if (dueDate && dueDate < getTodayDate()) {
    alert("Due date cannot be in the past.");
    taskDate.focus();
    return;
  }

  addTask(title, category, dueDate);

  taskForm.reset();
  taskTitle.focus();
});

/* 
  ESCAPE HTML
 */

function escapeHTML(value) {
  const characters = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return String(value).replace(
    /[&<>"']/g,
    (character) => characters[character],
  );
}

/* 
  FORMAT DUE DATE
 */

function formatDueDate(dateString) {
  if (!dateString) {
    return "No deadline";
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (dueDate.getTime() < today.getTime()) {
    return `Overdue · ${dueDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    })}`;
  }

  if (dueDate.getTime() === today.getTime()) {
    return "Today";
  }

  if (dueDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }

  return dueDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

/* 
  SEARCH TASKS
 */

function getSearchResults(taskArray) {
  if (!searchInput) {
    return taskArray;
  }

  const searchText = searchInput.value.trim().toLowerCase();

  if (!searchText) {
    return taskArray;
  }

  return taskArray.filter(function (task) {
    return task.title.toLowerCase().includes(searchText);
  });
}

// Search tasks whenever the user types
if (searchInput) {
  searchInput.addEventListener("input", function () {
    renderTasks();
  });
}

/* 
  SORT TASKS
 */

function getSortedTasks(taskArray) {
  const sortedTasks = [...taskArray];

  if (currentSort === "newest") {
    sortedTasks.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } else if (currentSort === "oldest") {
    sortedTasks.sort(function (a, b) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  } else if (currentSort === "dueDate") {
    sortedTasks.sort(function (a, b) {
      // Tasks without due dates appear last
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.localeCompare(b.dueDate);
    });
  }

  return sortedTasks;
}

// Update the sort button label
function updateSortButton() {
  if (!sortButton) return;

  const sortLabels = {
    manual: "↕ Manual order",
    dueDate: "↕ Due date",
    newest: "↕ Newest first",
    oldest: "↕ Oldest first",
  };

  sortButton.textContent = sortLabels[currentSort];
}

// Cycle through the available sorting options
if (sortButton) {
  sortButton.addEventListener("click", function () {
    const sortOptions = ["manual", "dueDate", "newest", "oldest"];

    const currentIndex = sortOptions.indexOf(currentSort);
    const nextIndex = (currentIndex + 1) % sortOptions.length;

    currentSort = sortOptions[nextIndex];

    updateSortButton();
    renderTasks();
  });
}

/* 
  RENDER TASKS
 */

function renderTasks() {
  const navCount = document.querySelector(".nav-count");

  if (navCount) {
    navCount.textContent = tasks.length;
  }

  taskList.innerHTML = "";

  // First apply the selected status filter
  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (currentFilter === "upcoming") {
    filteredTasks = tasks.filter(
      (task) =>
        !task.completed && task.dueDate && task.dueDate >= getTodayDate(),
    );
  }

  // Then apply the search
  filteredTasks = getSearchResults(filteredTasks);

  // Finally apply sorting
  filteredTasks = getSortedTasks(filteredTasks);

  // Dragging is allowed only in manual order
  const canDrag =
    currentFilter === "all" &&
    (!searchInput || searchInput.value.trim() === "") &&
    currentSort === "manual";

  // Show empty state when there are no matching tasks
  if (filteredTasks.length === 0) {
    emptyState.hidden = false;

    if (tasks.length === 0) {
      emptyState.querySelector("h3").textContent = "No tasks yet";
      emptyState.querySelector("p").textContent =
        "Start by adding your first task.";
    } else if (searchInput && searchInput.value.trim() !== "") {
      emptyState.querySelector("h3").textContent = "No matching tasks";
      emptyState.querySelector("p").textContent = "Try another search term.";
    } else {
      emptyState.querySelector("h3").textContent = "No tasks found";
      emptyState.querySelector("p").textContent =
        "There are no tasks in this category.";
    }

    updateFilterCounts();
    return;
  }

  emptyState.hidden = true;

  // Generate task cards
  filteredTasks.forEach(function (task) {
    const taskCard = document.createElement("article");

    taskCard.className = task.completed
      ? "task-card completed-card"
      : "task-card";

    taskCard.dataset.status = task.completed ? "completed" : "active";
    taskCard.dataset.id = task.id;

    // Enable dragging only in manual order
    taskCard.draggable = canDrag;

    const categoryClasses = {
      Work: "work-tag",
      Personal: "personal-tag",
      Study: "study-tag",
    };

    const tagClass = categoryClasses[task.category] || "work-tag";
    const checkboxId = `task-${task.id}`;

    const safeTitle = escapeHTML(task.title);
    const safeCategory = escapeHTML(task.category);

    const dueLabel = task.completed
      ? "✓ Completed"
      : `◷ ${escapeHTML(formatDueDate(task.dueDate))}`;

    taskCard.innerHTML = `
            <div class="task-check">
                <input
                  type="checkbox"
                  id="${checkboxId}"
                  aria-label="${task.completed ? "Mark" : "Mark"} ${safeTitle} as ${task.completed ? "active" : "completed"}"
                  ${task.completed ? "checked" : ""}
                >

                <label for="${checkboxId}"></label>
            </div>

            <div class="task-details">
                <h3>${safeTitle}</h3>

                <p>
                    ${
                      task.completed
                        ? "This task has been completed."
                        : "Task added to your workspace."
                    }
                </p>

                <div class="task-meta">
                    <span class="task-category ${tagClass}">
                        ${safeCategory}
                    </span>

                    <span class="task-due">
                        ${dueLabel}
                    </span>
                </div>
            </div>

            <div class="task-actions">
                <button
                    type="button"
                    data-action="edit"
                    aria-label="Edit task"
                    title="Edit task"
                ><img src="assets/pencil.svg" alt="edit-task-pencil" /></button>

                <button
                    type="button"
                    data-action="delete"
                    aria-label="Delete task"
                    title="Delete task"
                ><img src="assets/trash.svg" alt="delete-task" /></button>

                <span
                    class="drag-handle"
                    title="${canDrag ? "Drag to reorder" : "Switch to Manual order to rearrange tasks"}"
                >⠿</span>
            </div>
        `;

    taskList.appendChild(taskCard);
  });

  updateFilterCounts();
}

/* 
  COMPLETE / UNDO TASK
 */

taskList.addEventListener("change", function (event) {
  if (!event.target.matches('.task-check input[type="checkbox"]')) {
    return;
  }

  const taskCard = event.target.closest(".task-card");
  const taskId = taskCard.dataset.id;

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  task.completed = event.target.checked;

  saveToLocalStorage();
  renderTasks();
  updateDashboard();
});

/* 
  EDIT AND DELETE BUTTONS
 */

taskList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const taskCard = button.closest(".task-card");
  const taskId = taskCard.dataset.id;
  const action = button.dataset.action;

  if (action === "edit") {
    openEditModal(taskId);
  }

  if (action === "delete") {
    deleteTask(taskId, taskCard);
  }
});

/* 
  DRAG AND DROP
 */

// Start dragging a task
taskList.addEventListener("dragstart", function (event) {
  const taskCard = event.target.closest(".task-card");

  if (!taskCard || !taskCard.draggable) {
    event.preventDefault();
    return;
  }

  draggedTaskId = taskCard.dataset.id;

  taskCard.classList.add("dragging");

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedTaskId);
});

// Allow dropping over another task
taskList.addEventListener("dragover", function (event) {
  event.preventDefault();

  const targetCard = event.target.closest(".task-card");

  if (!targetCard || !draggedTaskId) {
    return;
  }

  if (targetCard.dataset.id === draggedTaskId) {
    return;
  }

  document.querySelectorAll(".task-card.drag-over").forEach(function (card) {
    card.classList.remove("drag-over");
  });

  targetCard.classList.add("drag-over");

  const draggedCard = taskList.querySelector(
    `[data-id="${CSS.escape(draggedTaskId)}"]`,
  );

  if (!draggedCard) return;

  const rectangle = targetCard.getBoundingClientRect();
  const mousePosition = event.clientY - rectangle.top;
  const shouldPlaceAfter = mousePosition > rectangle.height / 2;

  if (shouldPlaceAfter) {
    targetCard.after(draggedCard);
  } else {
    targetCard.before(draggedCard);
  }
});

// Save the new order after dropping
taskList.addEventListener("drop", function (event) {
  event.preventDefault();

  if (!draggedTaskId) return;

  const taskCards = taskList.querySelectorAll(".task-card");
  const newOrder = Array.from(taskCards).map(function (card) {
    return card.dataset.id;
  });

  // Reorder the original tasks array
  tasks.sort(function (a, b) {
    return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);
  });

  saveToLocalStorage();

  draggedTaskId = null;

  renderTasks();
});

// Clean up drag styling
taskList.addEventListener("dragend", function () {
  draggedTaskId = null;

  document.querySelectorAll(".task-card").forEach(function (card) {
    card.classList.remove("dragging", "drag-over");
  });
});

/*
  OPEN EDIT MODAL
*/

function openEditModal(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  editingTaskId = taskId;

  // Keep the edit date restriction up to date
  editTaskDate.min = getTodayDate();

  editTaskTitle.value = task.title;
  editTaskCategory.value = task.category;
  editTaskDate.value = task.dueDate;

  editModal.showModal();
  editTaskTitle.focus();
}

/*
  SAVE EDITED TASK
*/

editTaskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const task = tasks.find((item) => item.id === editingTaskId);

  if (!task) {
    return;
  }

  const updatedTitle = editTaskTitle.value.trim();
  const updatedCategory = editTaskCategory.value;
  const updatedDate = editTaskDate.value;

  if (!updatedTitle) {
    alert("Task name cannot be empty.");
    editTaskTitle.focus();
    return;
  }

  // Prevent users from assigning a past due date
  if (updatedDate && updatedDate < getTodayDate()) {
    alert("Due date cannot be in the past.");
    editTaskDate.focus();
    return;
  }

  task.title = updatedTitle;
  task.category = updatedCategory;
  task.dueDate = updatedDate;

  saveToLocalStorage();

  closeModal();

  renderTasks();
  updateDashboard();
});

/*
  CLOSE EDIT MODAL
*/

function closeModal() {
  editModal.close();

  editingTaskId = null;
  editTaskForm.reset();
}

closeEditModal.addEventListener("click", closeModal);
cancelEdit.addEventListener("click", closeModal);

// Close modal when clicking outside the dialog
editModal.addEventListener("click", function (event) {
  if (event.target === editModal) {
    closeModal();
  }
});

/*
  DELETE TASK
*/

function deleteTask(taskId, taskCard) {
  const shouldDelete = confirm("Are you sure you want to delete this task?");

  if (!shouldDelete) {
    return;
  }

  taskCard.classList.add("removing");

  // Remove task after animation finishes.
  // The timeout is a fallback if animationend does not fire.
  let deletionFinished = false;

  function finishDeletion() {
    if (deletionFinished) {
      return;
    }

    deletionFinished = true;

    tasks = tasks.filter((task) => task.id !== taskId);

    saveToLocalStorage();
    renderTasks();
    updateDashboard();
  }

  taskCard.addEventListener("animationend", finishDeletion, {
    once: true,
  });

  setTimeout(finishDeletion, 350);
}

/*
  UPDATE DASHBOARD STATISTICS
*/

function updateDashboard() {
  const total = tasks.length;

  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalTasks.textContent = total;
  activeTasks.textContent = active;
  completedTasks.textContent = completed;

  productivityRate.textContent = `${percentage}%`;
  productivityProgress.style.width = `${percentage}%`;

  updateCategoryCounts();
}

/*
  UPDATE CATEGORY COUNTS
 */

function updateCategoryCounts() {
  const categoryCounts = {
    Work: 0,
    Personal: 0,
    Study: 0,
  };

  tasks.forEach(function (task) {
    if (categoryCounts[task.category] !== undefined) {
      categoryCounts[task.category]++;
    }
  });

  const categoryElements = document.querySelectorAll(".category-item");

  categoryElements.forEach(function (element) {
    const categoryName = element
      .querySelector("span:nth-child(2)")
      .textContent.trim();

    const countElement = element.querySelector(".category-number");

    if (categoryCounts[categoryName] !== undefined) {
      countElement.textContent = categoryCounts[categoryName];
    }
  });
}

/*
  UPDATE FILTER COUNTS
*/

function updateFilterCounts() {
  const allButton = document.querySelector('.filter-btn[data-filter="all"]');

  if (allButton) {
    const count = allButton.querySelector("span");

    if (count) {
      count.textContent = tasks.length;
    }
  }
}

/*
  TASK FILTERS
*/

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });
});

/*
  ADD TASK BUTTON
*/

const addTaskTopButton = document.getElementById("add-task-top");

addTaskTopButton.addEventListener("click", function () {
  document.getElementById("create-task-section").scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  taskTitle.focus();
});

/*
  SIDEBAR NAVIGATION & MOBILE SIDEBAR
*/

const mobileMenuButton = document.getElementById("mobile-menu-btn");
const sidebar = document.getElementById("sidebar");
const navItems = document.querySelectorAll(".nav-item");

function updateNavigationActiveState(activeNav) {
  navItems.forEach(function (link) {
    link.classList.toggle("active", link.dataset.nav === activeNav);
  });
}

// Sidebar navigation
navItems.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    const target = link.dataset.nav;

    if (target === "dashboard") {
      currentFilter = "all";

      filterButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.filter === "all");
      });

      updateNavigationActiveState("dashboard");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      currentFilter = target;

      filterButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.filter === target);
      });

      updateNavigationActiveState(target);

      renderTasks();

      document.getElementById("tasks-section").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    sidebar.classList.remove("open");
  });
});

// Mobile sidebar toggle
mobileMenuButton.addEventListener("click", function () {
  sidebar.classList.toggle("open");
});

// Keep sidebar navigation synchronized with task filter buttons
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const target = button.dataset.filter;

    updateNavigationActiveState(target === "all" ? "all" : target);
  });
});

// Footer

document.getElementById("footer").textContent = new Date().getFullYear();

/* 
  START APPLICATION
*/

initializeApp();
