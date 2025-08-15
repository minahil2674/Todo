const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');
const filterAllBtn = document.getElementById('filterAllBtn');
const filterActiveBtn = document.getElementById('filterActiveBtn');
const filterCompletedBtn = document.getElementById('filterCompletedBtn');

// Array to store tasks
// Each task is an object: { text: "Task description", completed: false, id: uniqueId }
let tasks = [];
let currentFilter = 'all'; // 'all', 'active', 'completed'

// Function to generate a unique ID for tasks
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Function to save tasks to local storage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Function to load tasks from local storage
const loadTasks = () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks(); // Render tasks after loading
    }
};

// Function to render tasks based on the current filter
const renderTasks = () => {
    taskList.innerHTML = ''; // Clear existing tasks

    // Update active filter button styling
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active-filter');
    });
    if (currentFilter === 'all') {
        filterAllBtn.classList.add('active-filter');
    } else if (currentFilter === 'active') {
        filterActiveBtn.classList.add('active-filter');
    } else if (currentFilter === 'completed') {
        filterCompletedBtn.classList.add('active-filter');
    }


    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') {
            return !task.completed;
        } else if (currentFilter === 'completed') {
            return task.completed;
        }
        return true; // 'all' filter
    });

    if (filteredTasks.length === 0 && tasks.length > 0) {
        // If no tasks match the current filter, display a message
        const noTasksMessage = document.createElement('li');
        noTasksMessage.className = 'task-item text-center-message'; // Custom class for messages
        noTasksMessage.textContent = `No ${currentFilter} tasks found.`;
        taskList.appendChild(noTasksMessage);
        return;
    } else if (tasks.length === 0) {
        const emptyListMessage = document.createElement('li');
        emptyListMessage.className = 'task-item text-center-message'; // Custom class for messages
        emptyListMessage.textContent = 'Your To-Do list is empty. Add some tasks!';
        taskList.appendChild(emptyListMessage);
        return;
    }


    filteredTasks.forEach(task => {
        // Create list item (li) for each task
        const listItem = document.createElement('li');
        listItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        listItem.dataset.id = task.id; // Store task ID for easy reference

        // Task text span
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.className = 'task-text';
        // Clicking the text itself will also toggle completion
        taskText.addEventListener('click', () => toggleTaskComplete(task.id));

        // Action buttons container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        // Tick/Check button
        const tickBtn = document.createElement('button');
        tickBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-tick">
                <path d="M20 6 9 17l-5-5"/>
            </svg>
        `;
        tickBtn.className = 'task-action-btn';
        tickBtn.addEventListener('click', () => toggleTaskComplete(task.id)); // Click tick icon to toggle completion


        // Edit button
        const editBtn = document.createElement('button');
        editBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-edit">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="M15 5l4 4"/>
            </svg>
        `;
        editBtn.className = 'task-action-btn';
        editBtn.addEventListener('click', () => editTask(task.id, taskText));


        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-delete">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                <line x1="10" x2="10" y1="11" y2="17"/>
                <line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
        `;
        deleteBtn.className = 'task-action-btn';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // Append elements
        actionsDiv.appendChild(tickBtn); // Add tick button first
        actionsDiv.appendChild(editBtn); // Add edit button
        actionsDiv.appendChild(deleteBtn);
        listItem.appendChild(taskText);
        listItem.appendChild(actionsDiv);
        taskList.appendChild(listItem);
    });
};

// Function to add a new task
const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        tasks.push({
            text: taskText,
            completed: false,
            id: generateUniqueId()
        });
        taskInput.value = ''; // Clear input field
        saveTasks();
        renderTasks(); // Re-render tasks
        // Scroll to the bottom to show the newly added task
        taskList.scrollTop = taskList.scrollHeight;
    }
};

// Function to toggle task completion status
const toggleTaskComplete = (id) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks(); // Re-render tasks to apply strikethrough
    }
};

// Function to edit a task
const editTask = (id, taskTextElement) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return; // Task not found

    const currentText = tasks[taskIndex].text;

    // Create an input field for editing
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;
    editInput.className = 'edit-task-input'; // Apply a class for styling
    editInput.style.minWidth = '150px'; // Ensure input is wide enough

    // Replace the task text span with the input field
    taskTextElement.replaceWith(editInput);
    editInput.focus(); // Focus on the input field

    const saveChanges = () => {
        const newText = editInput.value.trim();
        if (newText !== '' && newText !== currentText) {
            tasks[taskIndex].text = newText;
            saveTasks();
        }
        renderTasks(); // Re-render to show updated text or revert if empty
    };

    // Save on Enter key press
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveChanges();
        }
    });

    // Save on blur (clicking outside)
    editInput.addEventListener('blur', saveChanges);
};


// Function to delete a task
const deleteTask = (id) => {
    // Show a confirmation dialog
    const confirmDelete = document.createElement('div');
    confirmDelete.className = 'modal-overlay';
    confirmDelete.innerHTML = `
        <div class="modal-content">
            <p>Are you sure you want to delete this task?</p>
            <div class="modal-buttons">
                <button id="confirmDeleteBtn" class="btn btn-confirm">Delete</button>
                <button id="cancelDeleteBtn" class="btn btn-cancel">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmDelete);
    confirmDelete.classList.add('show'); // Make the modal visible

    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        confirmDelete.remove(); // Close the modal
    });

    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        confirmDelete.remove(); // Close the modal
    });
};


// Function to clear all tasks
const clearAllTasks = () => {
    if (tasks.length === 0) {
        // If task list is empty, show a different message
        const emptyListModal = document.createElement('div');
        emptyListModal.className = 'modal-overlay';
        emptyListModal.innerHTML = `
            <div class="modal-content">
                <p>Your task list is already empty!</p>
                <div class="modal-buttons">
                    <button id="closeEmptyModalBtn" class="btn btn-cancel">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(emptyListModal);
        emptyListModal.classList.add('show'); // Make the modal visible

        document.getElementById('closeEmptyModalBtn').addEventListener('click', () => {
            emptyListModal.remove(); // Close the modal
        });
    } else {
        // Show a confirmation dialog to clear all tasks
        const confirmClear = document.createElement('div');
        confirmClear.className = 'modal-overlay';
        confirmClear.innerHTML = `
            <div class="modal-content">
                <p>Are you sure you want to clear all tasks?</p>
                <div class="modal-buttons">
                    <button id="confirmClearBtn" class="btn btn-confirm">Clear All</button>
                    <button id="cancelClearBtn" class="btn btn-cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmClear);
        confirmClear.classList.add('show'); // Make the modal visible

        document.getElementById('confirmClearBtn').addEventListener('click', () => {
            tasks = []; // Empty the tasks array
            saveTasks();
            renderTasks();
            confirmClear.remove(); // Close the modal
        });

        document.getElementById('cancelClearBtn').addEventListener('click', () => {
            confirmClear.remove(); // Close the modal
        });
    }
};

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
clearAllBtn.addEventListener('click', clearAllTasks);

// Filter buttons event listeners
filterAllBtn.addEventListener('click', () => {
    currentFilter = 'all';
    renderTasks();
});
filterActiveBtn.addEventListener('click', () => {
    currentFilter = 'active';
    renderTasks();
});
filterCompletedBtn.addEventListener('click', () => {
    currentFilter = 'completed';
    renderTasks();
});

// Load tasks when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);
