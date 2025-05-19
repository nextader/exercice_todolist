document.addEventListener('DOMContentLoaded', function () { init(); });

if (localStorage.length == 0) {
    console.log("aucune tâche");
    localStorage.setItem("index", "-1");
    afficherTaches();
}

let indexTask = localStorage.getItem("index").split(',');

console.log(indexTask);
let tasks = getTasks();


console.log(tasks);

function addTask(e) {
    let index = 0;
    index = parseInt(indexTask[indexTask.length - 1]) + 1;
    let name = "task" + index;
    let value = e.target.title.value;
    e.target.title.value = "";
    let done = "no";
    let task = { name: name, value: value, done: done };
    tasks.push(task);
    indexTask.push(index);
    localStorage.setItem(name, value);
    localStorage.setItem(name + "Done", done);
    localStorage.setItem("index", indexTask);
    refreshList();
}


function getTasks() {
    let result = [];
    if (localStorage.getItem("index")[0] == "none")
        return result;
    for (let i = 0; i < indexTask.length; i++) {
        let x = indexTask[i];
        let name = "task" + x;
        let value = localStorage.getItem(name);
        let done = localStorage.getItem(name + "Done");
        // let done = localStorage.getItem(name + "Done") == "yes" ? true : false;
        let task = { name: name, value: value, done: done };
        result.push(task);
    }

    return result;
}


function fillList(filter) {
    let target = document.getElementById("todoList");
    let listFiltered = getValues(filter)
    listFiltered.forEach((e, i) => {
        addToList(e, target);
    });
}


function getValues(filter) {
    let result = [];
    tasks.forEach(element => {
        if ((filter == "all" || element.done == filter) && element.value != null) {
            result.push(element);
        }
    });
    return result;
}

function chkClick(e, checked) {
    tasks.forEach((element, index) => {
        element.done = checked ? "yes" : "no";
    });
    localStorage.setItem(e.name + "Done", e.done);
}

function addToList(e, target) {
    let li = document.createElement("li");
    li.id = e.name;
    li.className = "todo list-group-item d-flex align-items-center justify-content-between";
    let chk = document.createElement("input");
    chk.className = "form-check-input";
    chk.type = "checkbox";
    chk.id = "chk" + e.name;
    chk.checked = e.done == "yes" ? true : false;
    chk.addEventListener("change", function (event) {

        tasks.forEach((element, index) => {
            if (element.name == e.name) {
                element.done = event.target.checked ? "yes" : "no";
            }
        });
        localStorage.setItem(e.name + "Done", e.done);


        // chkClick(e,event.target.checked);
        // refreshList();
        if (getFilter() != "all")
            document.getElementById(e.name).remove();
    });

    let div = document.createElement("div");
    div.className = "form-check";
    div.appendChild(chk);
    let label = document.createElement("label");
    label.className = "form-check-label ms-2";
    label.setAttribute("for", "chk" + e.name);
    label.innerHTML = e.value;
    div.appendChild(label);
    li.appendChild(div);

    let btn = document.createElement("button");
    btn.className = "btn btn-danger btn-sm";
    btn.setAttribute("aria-label", "Supprimer");
    btn.innerHTML = `<i class="bi-trash"></i>`;
    btn.addEventListener("click", function () {
        console.log("delete" + e.name + " \n - " + e.value);
        removeTask(e);
    });
    li.appendChild(btn);
    target.appendChild(li);
}

function init() {
    document.getElementById("addTaskForm").addEventListener("submit", function (event) {
        event.preventDefault();
        addTask(event);
    });
    fillList("all");
}

function removeTask(e) {
    tasks.forEach((element, index) => {
        if (element == e) {
            tasks.splice(index, 1);
            localStorage.removeItem(e.name);
            localStorage.removeItem(e.name + "Done");
            console.log("remove" + e.name + " \n - " + e.value);
        }
    });
    indexTask.forEach((element, index) => {
        if (element == e.name.substring("task".length)) {
            indexTask.splice(index, 1);
            localStorage.setItem("index", indexTask);
        }
    });
    document.getElementById(e.name).remove();
}


function getFilter() {
    let butonFilter = document.querySelectorAll(".active")[0];
    return butonFilter.getAttribute("data-filter") == "all" ? "all"
        : butonFilter.getAttribute("data-filter") == "done" ? "yes" : "no";
}

function refreshList() {
    let target = document.getElementById("todoList");
    target.innerHTML = "";
    fillList(getFilter());
}

document.querySelectorAll(".filterBtn").forEach((x) => {
    x.addEventListener("click", function (event) {
        let target = document.querySelectorAll(".active")[0];
        target.classList.remove("active");
        x.classList.add("active");
        refreshList();
    });
});


async function afficherTaches() {
    try {
        const response = await fetch('../data.json');
        
        if (!response.ok == true) {
            throw new Error("Erreur fichier json");
        }
        
        const data = await response.json();
        console.log(data);
        let newTasksValid = false;


        for (const task of data) {
            if (!localStorage.getItem("task" + task.id)) {
                let index = 0;
                index = parseInt(indexTask[indexTask.length - 1]) + 1;
                const newTask = {name: "task" + task.id, value: task.title, done: task.done ? "yes" : "no"};
                
                tasks.push(newTask);
                indexTask.push(index);
                localStorage.setItem("task" + task.id, task.title);
                localStorage.setItem("task" + task.id + "Done", task.done ? "yes" : "no");
                newTasksValid = true;
            } else {
                console.log("La tâche existe déjà:");
            }
        }
        if (newTasksValid) {
            localStorage.setItem("index", indexTask);
            refreshList();
        }
    } catch (error) {
        console.error(error);
    }
}

// localStorage.clear();