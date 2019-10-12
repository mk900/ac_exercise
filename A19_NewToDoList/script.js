const list = document.querySelector('#my-todo')
const todos = ['Hit the gym', 'Read a book', 'Buy eggs', 'Organize office', 'Pay bills']

for (let todo of todos) {
  addItem(todo)
}

function addItem(text) {
  let newItem = document.createElement('li')
  newItem.innerHTML = writeItem(text)
  list.appendChild(newItem)
  newItem.children[0].classList.add('bg-info')
}

function writeItem(textContent) {
  let content = `
    <label for="item">${textContent}</label>
    <i class="delete fa fa-trash"></i>
  `
  return content
}

// Create todo items
const addButton = document.querySelector('#addBtn')
const input = document.querySelector('#newTodo')

addButton.addEventListener('click', addTodo)

function addTodo() {
  let newInput = input.value
  if (newInput !== '') { //if input is null then Add disable
    addItem(newInput)
    input.value = '' // input clean its value
  }
}

// press "Enter" key instead of Add button
input.addEventListener('keypress', function (event) {
  if (event.keyCode === 13) {
    addTodo()
  }
}
)

/// click trash icon to delte it
const done = document.querySelector('#done-item')

list.addEventListener('click', deleteItem)
done.addEventListener('click', deleteItem)

function deleteItem(event) {
  if (event.target.classList.contains('delete')) {
    event.target.parentElement.remove()
  }
}

// move-to-Done
list.addEventListener('click', moveToDone)

function moveToDone(event) {
  if (event.target.tagName === 'LABEL') {
    event.target.parentElement.remove()
    let text = event.target.textContent
    let doneItem = document.createElement('li')
    doneItem.innerHTML = writeItem(text)
    done.appendChild(doneItem)
    doneItem.children[0].classList.add('checked', 'bg-secondary')
  }
}

// move-back-to-Todo
done.addEventListener('click', moveBackTodo)
function moveBackTodo(event) {
  if (event.target.tagName === 'LABEL') {
    let text = event.target.textContent
    addItem(text)
    event.target.parentElement.remove()
  }
}