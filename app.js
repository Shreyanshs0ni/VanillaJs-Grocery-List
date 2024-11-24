// ****** SELECT ITEMS **********
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");
const container = document.querySelector(".grocery-container");
const grocery = document.getElementById("grocery");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");

// edit option
let editElement;
let editFlag = false;
let editId = "";
// ****** EVENT LISTENERS **********
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", removeItems);
window.addEventListener("DOMContentLoaded", setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  let value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItems(id, value);
    displayAlert("item added", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}

//display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 3000);
}
function removeItems() {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("items cleared", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
}
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  deleteFromLocalStorage(id);
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.textContent = "edit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
}
function deleteFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
// ****** SETUP ITEMS **********
function setupItems() {
  const items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItems(item.id, item.value);
    });
  }
}
function createListItems(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = ` <p class="title">
        ${value}
        </p>
        <div class = "btn-container">
        <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
        </button>
        </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
}
