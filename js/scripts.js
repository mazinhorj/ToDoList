console.log('MazinhoBigDaddy chegou!')

//seletores
const todoForm = document.querySelector('#todo_form');
const todoInput = document.querySelector('#todo_input');
const todoList = document.querySelector('#todo_list');
const editForm = document.querySelector('#edit_form');
const editInput = document.querySelector('#edit_input');
const searchInput = document.querySelector('#search_input');
const eraseBtn = document.querySelector("#erase_btn");
const filterSelect = document.querySelector("#filter_select");
const cancelEditBtn = document.querySelector('#cancel_edit_btn');


let oldInputValue;


const inicio = document.querySelector('#inicio')

//funções

const start = () => {
    inicio.classList.toggle("hide")
};

const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish_todo");
    doneBtn.innerHTML = '<i class="bi bi-check2-circle"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit_todo");
    editBtn.innerHTML = '<i class="bi bi-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete_todo");
    deleteBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
    todo.appendChild(deleteBtn);

    //pegando dados da local Storage

    if(done) {
        todo.classList.add("done");
    };

    if(save) {
        saveTodoLocalStorage({text: text, done: 0})
    };

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();

    start();
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");
        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
            updateTodoLocalStorage(oldInputValue, text)
        };
    });
};

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
        const normalizedSearch = search.toLowerCase();
        todo.style.display = "flex";
        if (!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none";
        };
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
    switch (filterValue) {
        case "all":
            todos.forEach((todo) => todo.style.display = "flex");
            break;

        case "done":
            todos.forEach((todo) => todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));
            break;

        case "todo":
            todos.forEach((todo) => !todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));
            break;

        default:
            break;
    };
};

//eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = todoInput.value;
    if (inputValue) {
        saveTodo(inputValue);
    }
})

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    };

    if (targetEl.classList.contains("finish_todo")) {
        console.log("cilcado para finalizar");
        parentEl.classList.toggle("done");
        updateTodoStatusLocalStorage(todoTitle);
    };

    if (targetEl.classList.contains("delete_todo")) {
        console.log("cilcado para deletar");
        parentEl.remove();
        removeTodoLocalStorage(todoTitle);
    };

    if (targetEl.classList.contains("edit_todo")) {
        console.log("editar");
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    };
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
    todoInput.focus();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editInputValue = editInput.value;
    if (editInputValue) {
        updateTodo(editInputValue);
    };
    toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    getSearchTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
    searchInput.focus();
});

filterSelect.addEventListener("change", (e) => {
    const filterValue = e.target.value;
    console.log((filterValue));
    filterTodos(filterValue);
});

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    return todos;
};

const loadTodos = () => {
    const todos = getTodosLocalStorage();
    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
};

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
    const filteredTodos = todos.filter((todo) => todo.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
    todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null);
    localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
    todos.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText) : null);
    localStorage.setItem("todos", JSON.stringify(todos));
};


loadTodos();