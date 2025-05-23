const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplayContainer = document.querySelector("[data-list-display-container]");
const listTitle = document.querySelector("[data-list-title]");
const listCount = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButton = document.querySelector("[data-clear-complete-task]");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "li") {
        selectedListId = event.target.dataset.listId;
        saveAndRender();
    }
});

tasksContainer.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "input") {
        const selectedList = lists.find((list) => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find((task) => task.id === event.target.id);
        selectedTask.complete = event.target.checked;
        save();
        renderTaskCount(selectedList);
    }
});

clearCompleteTasksButton.addEventListener("click", () => {
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
    saveAndRender();
});

deleteListButton.addEventListener("click", () => {
    lists = lists.filter((list) => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
});

newListForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const listName = newListInput.value.trim();
    if (listName == null || listName === "") return;
    const list = createList(listName);
    newListInput.value = "";
    lists.push(list);
    saveAndRender();
});

newTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskName = newTaskInput.value.trim();
    if (taskName == null || taskName === "") return;
    const task = createTask(taskName);
    newTaskInput.value = "";
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
});

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false };
}

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find((list) => list.id === selectedListId);

    if (selectedListId == null) {
        listDisplayContainer.style.display = "none";
    } else {
        listDisplayContainer.style.display = "";
        listTitle.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach((task) => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector("input");
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    });
}

function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter((task) => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    listCount.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
    lists.forEach((list) => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        if (list.id === selectedListId) {
            listElement.classList.add("active-list");
        }
        listsContainer.appendChild(listElement);
    });
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();
