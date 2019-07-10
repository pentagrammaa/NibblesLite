/* jshint esversion:7 */
/* esversion:7 */

let level;
let score;
let food;
let foodx;
let foody;
let foodOkay;
let snakeOnFoodFlag;
let newFoodx;
let newFoody;
let gameBoard;
let currNode;
let newNode;
let Snake = new LinkedList();
let direction;
let directionStack;

startGame();

// set up major run function

setInterval(runGame, 200);

// major game function (the main function)

function startGame() {
  // set up score board and game board

  level = 1;
  score = 0;
  document.getElementById('level').innerHTML = 'Level: ' + level;
  document.getElementById('score').innerHTML = 'Score: ' + score;

  gameBoard = document.createElement('div');
  gameBoard.classList.add('game_board');
  document.body.append(gameBoard);

  // set up first food

  foodx = 260;
  foody = 260;
  food = document.createElement('div');
  food.classList.add('newFood');
  food.style.left = foodx + 'px';
  food.style.top = foody + 'px';
  gameBoard.append(food);

  // create and draw snake length five (four show, one to clean up)

  direction = 'east';

  let j = 20;
  for (let counter = 0; counter < 5; counter++) {
    addNode(120 - 20 * counter, j);
  }

  directionStack = ['east', 'east', 'east', 'east', 'east'];  // 0 is head
  drawSnake();
}

function runGame() {
  updateSnake();
  checkCollision();
}

function updateSnake() {
  currNode = Snake.head;
  for (let i = 0; i < directionStack.length; i++) {
    switch (directionStack[i]) {
      case 'east':
        currNode.x += 20;
        break;
      case 'west':
        currNode.x -= 20;
        break;
      case 'up':
        currNode.y -= 20;
        break;
      case 'down':
        currNode.y += 20;
        break;
    }
    currNode = currNode.next;
  }

  directionStack.unshift(direction);
  directionStack.pop();
  drawSnake();
}

// collision checks

function checkCollision() {
  checkCollisionSelf();
  checkCollisionFood();
  checkCollisionWall();
}

function checkCollisionFood() {
  if ((Snake.head.x == foodx) & (Snake.head.y == foody)) {
    score++;
    document.getElementById('score').innerHTML = 'Score: ' + score;
    growSnake();
    generateNewFood();
  }
}

function checkCollisionSelf() {
  currNode = Snake.head;
  currNode = currNode.next;
  for (i = 0; i < Snake.length - 2; i++) {
    if ((Snake.head.x == currNode.x) && (Snake.head.y == currNode.y)) {
      alert('you crashed into yourself!');
      clearSnake();
      startGame();
    }

    currNode = currNode.next;
  }
}

function checkCollisionWall() {
  if ((Snake.head.x > 580) || (Snake.head.x <
    0) || (Snake.head.y > 580) || (Snake.head.y < 0)) {
    alert('You crashed into the wall!');
    clearSnake();
    startGame();
  }
}

// singly-linked list definitions and functions for our snake

function LinkedList() {
  this.head = null;
  this.length = 0;
}

function Node(x, y) {
  this.x = x;
  this.y = y;
  this.next = null;
}

function addNode(x, y) {
  newNode = new Node(x, y);
  currNode = Snake.head;

  if (Snake.head == null) {
    Snake.head = newNode;
    Snake.length = 1;
  } else {
    for (m = 1; m < Snake.length; m++) {
      currNode = currNode.next;
    }

    currNode.next = newNode;
    Snake.length++;
  }
}

function clearSnake() {
  currNode = Snake.head;
  for (i = 0; i < Snake.length; i++) {
    currNode.x = 20;
    currNode.y = 20;
    currNode = currNode.next;
  }

  Snake.head = null;
  Snake.length = 0;
}

function drawSnake() {
  currNode = Snake.head;
  for (let m = 0; m < Snake.length; m++) {
    if (currNode.next == null) {
      let snakeElement = document.createElement('div');
      snakeElement.classList.add('newSnakeElement');
      snakeElement.style.left = currNode.x + 'px';
      snakeElement.style.top = currNode.y + 'px';
      snakeElement.style.backgroundColor = 'lightblue';
      gameBoard.append(snakeElement);
    } else {
      let snakeElement = document.createElement('div');
      snakeElement.classList.add('newSnakeElement');
      snakeElement.style.left = currNode.x + 'px';
      snakeElement.style.top = currNode.y + 'px';
      gameBoard.append(snakeElement);
      currNode = currNode.next;
    }
  }
}

// make new food function

function generateNewFood() {
  foodOkay = 'false';

  while (foodOkay == 'false') {
    snakeOnFoodFlag = 'no';
    newFoodx = 20 * Math.floor(Math.random() * 25) + 20;  // step by 20
    newFoody = 20 * Math.floor(Math.random() * 25) + 20;
    currNode = Snake.head;
    for (i = 1; i < Snake.length; i++) {
      if ((newFoodx == currNode.x) && (newFoody == currNode.y)) {
        snakeOnFoodFlag = 'yes';
        break;
      } else {
        currNode = currNode.next;
      }
    }

    if (snakeOnFoodFlag == 'no') {
      if (((((newFoodx - foodx) ** 2) + ((newFoody - foody) ** 2))**0.5) > 200) {
        foodOkay = 'true';
      }
    }
  }

  foodx = newFoodx;
  foody = newFoody;
  food = document.createElement('div');
  food.classList.add('newFood');
  food.style.left = foodx + 'px';
  food.style.top = foody + 'px';
  gameBoard.append(food);
}

function growSnake() {
  currNode = Snake.head;
  for (let m = 1; m < Snake.length; m++) {
    currNode = currNode.next;
  }

  x = currNode.x;
  y = currNode.y;

  switch (directionStack[directionStack.length - 1]) {
    case 'east':
      x -= 20;
      break;
    case 'west':
      x += 20;
      break;
    case 'up':
      y += 20;
      break;
    case 'down':
      y -= 20;
      break;
  }
  directionStack.push(directionStack[directionStack.length - 1]);
  addNode(x, y);
}

// keycode function

document.onkeydown = function (event) {
  switch (event.keyCode) {
    case 32:
      pauseOrStart();
      break;
    case 37:
      if (direction !== 'east') {
        direction = 'west';
      }

      break;
    case 38:
      if (direction !== 'down') {
        direction = 'up';
      }

      break;
    case 39:
      if (direction !== 'west') {
        direction = 'east';
      }

      break;
    case 40:
      if (direction !== 'up') {
        direction = 'down';
      }

      break;
  }
};
