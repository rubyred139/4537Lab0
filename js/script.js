const BUTTON_WIDTH = 10;
const BUTTON_HEIGHT = 5;
const BUTTON_MARGIN = 10;
const MAX_MOVE = 3;
const EM_TO_PX = 16;

class Button {
	constructor(id) {
		this.id = id;
		this.button = document.createElement("button");

		this.button.style.backgroundColor = this.getRandomColor();
		this.button.style.width = `${BUTTON_WIDTH}em`;
		this.button.style.height = `${BUTTON_HEIGHT}em`;
		this.button.style.margin = `${BUTTON_MARGIN}px`;
		this.button.style.position = "absolute";

		this.setText();
	}
	// this getRandomColor function is provided by chatGPT
	getRandomColor() {
		const letters = "0123456789ABCDEF";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	setPosition(left, top) {
		this.button.style.left = left;
		this.button.style.top = top;
	}

	setText() {
		this.button.textContent = this.id;
	}
	hideText() {
		this.button.textContent = "";
	}
}

class Game {
	constructor(buttonCount) {
		this.arrayButtons = [];
		this.buttonCount = buttonCount;
		this.buttonContainer = document.getElementById("buttonContainer");
		this.moveCount = 0;
		this.userOrder = [];
	}
	startGame() {
		if (this.buttonCount < 3 || this.buttonCount > 7) {
			alert(MESSAGES.INVALIDBUTTONINPUT);
		} else {
			this.resetGame();
			this.generateButtons();
			this.layoutButtons();
			this.scrambler = new Scrambler(this.arrayButtons);
			setTimeout(() => {}, this.buttonCount * 1000);
			this.scrambler.startScrambling();
			//hide text after scrambling buttons
			setTimeout(() => {
				this.arrayButtons.forEach((button) => {
					button.hideText();
					button.button.addEventListener("click", () => {
						this.userOrder.push(button.id);
						this.checkUserOrder();
					});
				});
			}, 2000 * MAX_MOVE + 1000);
		}
	}

	resetGame() {
		this.buttonContainer.innerHTML = "";
	}

	generateButtons() {
		for (let i = 0; i < this.buttonCount; i++) {
			const button = new Button(i + 1);
			this.arrayButtons.push(button);
		}
	}

	layoutButtons() {
		let offsetX = 0;
		let offsetY = 0;
		const windowWidth = window.innerWidth;
		const buttonWidth = BUTTON_WIDTH * 16 + BUTTON_MARGIN * 2;
		const buttonHeight = BUTTON_HEIGHT * 16 + BUTTON_MARGIN * 2;
		this.arrayButtons.forEach((arrayButton) => {
			if (offsetX > windowWidth - buttonWidth) {
				offsetX = 0;
				offsetY += buttonHeight;
			}
			arrayButton.setPosition(offsetX, offsetY);

			this.buttonContainer.append(arrayButton.button);
			offsetX += buttonWidth;
		});
	}

	checkUserOrder() {
		if (this.userOrder.length <= this.buttonCount) {
			for (let i = 0; i < this.userOrder.length; i++) {
				if (this.userOrder[i] != i + 1) {
					this.gameFail();
					break;
				} else {
					this.arrayButtons[i].setText();
				}
			}
		}
		if (this.userOrder.length == this.buttonCount) {
			alert(MESSAGES.SUCCESS);
			this.gameEnds();
		}
	}

	revealCorrectOrder() {
		this.arrayButtons.forEach((button) => {
			button.setText();
		});
	}
	gameFail() {
		alert(MESSAGES.FAIL);
		this.revealCorrectOrder();
		this.gameEnds();
	}
	gameEnds() {
		this.arrayButtons.forEach((button) => {
			button.button.disabled = true;
		});
	}
}

class Scrambler {
	constructor(buttons) {
		this.buttons = buttons;
		this.moveCount = 0;
	}
	scrambleButtons() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const inputBox = document.querySelector(".input-box");
		const inputBoxHeight = inputBox ? inputBox.offsetHeight : 0;

		this.buttons.forEach((button) => {
			const maxLeft =
				(windowWidth - BUTTON_WIDTH * EM_TO_PX - BUTTON_MARGIN * 2) / 1;
			const maxHeight =
				(windowHeight -
					BUTTON_HEIGHT * EM_TO_PX -
					BUTTON_MARGIN * 2 -
					inputBoxHeight) /
				1;

			const randomLeft = Math.random() * maxLeft;
			const randomTop = Math.random() * maxHeight;

			button.setPosition(randomLeft, randomTop);
		});
		this.moveCount += 1;

		if (this.moveCount == MAX_MOVE) {
			clearInterval(this.intervalId);
		}
	}
	startScrambling() {
		this.intervalId = setInterval(this.scrambleButtons.bind(this), 2000);
	}
}

const goButton = document.getElementById("goButton");
goButton.addEventListener("click", () => {
	const buttonCount = document.getElementById("buttonCountInput").value;
	const game = new Game(buttonCount);
	game.startGame();
});
