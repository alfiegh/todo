//TODO: DRY REFACTORING.

const inputText = document.querySelector('.item');
const addBtn = document.getElementById('add');
const fullCircle = '<i class="fa fa-check-circle"></i>';
const normalCheck = '<i class="fa fa-check"></i>';
const clearCompletedBtn = document.querySelector('.btn_clear_completed');
const listCompleted = document.getElementById('completed');
const clearAllBtn = document.querySelector('.btn_clear_everything');
const listTodo = document.getElementById('todo');

//Add on plus click
addBtn.addEventListener('click', function () {
  let value = inputText.value;
  if (value) addItem(value);
  inputText.value = '';
});

//Add on enter key
inputText.addEventListener('keydown', function (e) {
  let value = inputText.value;
  if (value && e.key === 'Enter') addItem(value);
  if (e.key === 'Enter') inputText.value = '';
});

function addItem(value) {
  addItemToDOM(value);

  data.todo.push(value);
  dataLocalStorage();
}

//Set Local Storage
function dataLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(data));
}

//Define localStorage values
let data = localStorage.getItem('todoList')
  ? JSON.parse(localStorage.getItem('todoList'))
  : { todo: [], completed: [] };

//Search stored items and pass to fn
function renderStoredItems() {
  for (var i = 0; i < data.todo.length; i++) {
    var value = data.todo[i];
    addItemToDOM(value);
  }

  for (var j = 0; j < data.completed.length; j++) {
    var value = data.completed[j];
    addItemToDOM(value, true);
  }
}
renderStoredItems();

function removeLiItem() {
  //this-> btn, parentNode->btnCont, parentNode->li
  let item = this.parentNode.parentNode;
  //item.parentNode-> lu
  let parent = item.parentNode;
  //parent.id -> #todo or #completed
  let id = parent.id;
  let value = item.innerText;

  id === 'todo'
    ? data.todo.splice(data.todo.indexOf(value), 1)
    : data.completed.splice(data.completed.indexOf(value), 1);

  dataLocalStorage();

  parent.removeChild(item);
}

function completeItem() {
  let item = this.parentNode.parentNode;
  let parent = item.parentNode;
  let id = parent.id;
  let value = item.innerText;

  if (id === 'todo') {
    data.todo.splice(data.todo.indexOf(value), 1);
    data.completed.push(value);
    item.childNodes[1].childNodes[0].lastChild.outerHTML = fullCircle;
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
    data.todo.push(value);
    item.childNodes[1].childNodes[0].lastChild.outerHTML = normalCheck;
  }

  dataLocalStorage();

  let target =
    id === 'todo'
      ? document.getElementById('completed')
      : document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[-1]);
}

//Render new li line
function addItemToDOM(text, completed) {
  let list = completed
    ? document.getElementById('completed')
    : document.getElementById('todo');

  const listItem = document.createElement('li');
  listItem.innerText = text;

  const btnsDiv = document.createElement('div');
  btnsDiv.classList.add('btnsCont');

  const checkBtn = document.createElement('button');
  checkBtn.classList.add('checkBtn');

  const removeBtn = document.createElement('button');
  removeBtn.classList.add('trashBtn');

  const checkIcon = document.createElement('i');
  checkIcon.classList.add('fa');
  checkIcon.classList.add('fa-check');

  const trashIcon = document.createElement('i');
  trashIcon.classList.add('fa');
  trashIcon.classList.add('fa-trash');

  const completedIcon = document.createElement('i');
  completedIcon.classList.add('fa');
  completedIcon.classList.add('fa-check-circle');
  //   completedIcon.innerHTML = fullCircle;

  checkBtn.appendChild(checkIcon);
  removeBtn.appendChild(trashIcon);
  btnsDiv.appendChild(checkBtn);
  btnsDiv.appendChild(removeBtn);
  listItem.appendChild(btnsDiv);

  //complete on checkBtn click
  checkBtn.addEventListener('click', completeItem);

  //remove on trashBtn click
  removeBtn.addEventListener('click', removeLiItem);

  //childNodes index set order [0]-> item 5,4,3,2,1 or [-1] -> 1,2,3,4,5
  list.insertBefore(listItem, list.childNodes[-1]);

  //If item is already in completed, swap icons
  if (completed) {
    checkBtn.removeChild(checkIcon);
    checkBtn.appendChild(completedIcon);
  }
}

function removeCompleted() {
  //ul
  let item = listCompleted;
  //inner nodes
  let child = item.childNodes;
  //ul id
  let id = item.id;

  if (id === 'completed') data.completed = [];
  item.innerHTML = '';
  dataLocalStorage();
}
clearCompletedBtn.addEventListener('click', removeCompleted);

clearAllBtn.addEventListener('click', function () {
  let item = listTodo;
  //inner nodes
  let child = item.childNodes;
  //ul id
  let id = item.id;

  if (id === 'todo') {
    data.todo = [];
    item.innerHTML = '';
    removeCompleted();
  }

  dataLocalStorage();
});
