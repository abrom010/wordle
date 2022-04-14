let guessCount = 0;
let letterCount = 0;
let winner = getMyRandomWord();
let won = false;

document.addEventListener("keydown", function (event) {
	handleKeyPress(event.key);
});

function handleKeyPress(key) {
	if (won || guessCount > 5) return;
	// console.log("Letter count: " + letterCount);
	if (key == 'Enter') {
		if (letterCount == 5) {
			if (checkIfWord()) {
				let row = getRow();
				let tiles = row.children;
				let greenLetters = ["", "", "", "", ""];


				let theWord = "";
				// iterate word, check for green or gray letters
				htmlForEach(tiles, function (tile) {
					let tileParagraph = tile.children[0];
					let letterIndex = Array.prototype.indexOf.call(tile.parentNode.children, tile);
					let letter = tileParagraph.textContent.toLowerCase();
					theWord += letter;

					if (letter == winner[letterIndex]) {
						tileParagraph.style.color = "rgb(120, 255, 80)";
						greenLetters[letterIndex] = letter;
					} else {
						tileParagraph.style.color = "gray";
					}
				});

				if (theWord == winner) {
					document.getElementById("myModal").style.display = "block";
					document.getElementById("insert-win-message").textContent = "U done it! Happee Borthday!";
					document.getElementById("modal-image").src = "images/" + winner + ".png";
					document.getElementById("insert-word-here").textContent = winner;
					won = true;
				}

				// iterate again, checking for yellow letters
				let yellowLetterAmount = 0;
				htmlForEach(tiles, function (tile) {
					let tileParagraph = tile.children[0];
					let letterIndex = Array.prototype.indexOf.call(tile.parentNode.children, tile);
					let letter = tileParagraph.textContent.toLowerCase();

					if (winner.includes(letter)) {
						let letterAmount = 0;
						for (let i = 0; i < 5; i++) {
							if (winner[i] == letter) {
								letterAmount++;
							}
						}
						let greenLetterAmount = 0;
						for (let i = 0; i < 5; i++) {
							if (greenLetters[i] == letter) {
								greenLetterAmount++;
							}
						}

						if (greenLetterAmount < letterAmount && yellowLetterAmount < letterAmount && greenLetters[letterIndex] == "") {
							tileParagraph.style.color = "rgb(255,255,102)";
							yellowLetterAmount++;
						}
					}
				});
				guessCount++;
				if (guessCount > 5) {
					document.getElementById("myModal").style.display = "block";
					document.getElementById("insert-win-message").textContent = "U no done it :( it ok. Happee Borthday!";
					document.getElementById("modal-image").src = "images/" + winner + ".png";
					document.getElementById("insert-word-here").textContent = winner;
					won = true;
				}
				letterCount = 0;
			} else {
				let row = getRow();
				let tiles = row.children;
				htmlForEach(tiles, function (tile) {
					let tileParagraph = tile.children[0];
					tileParagraph.style.color = "red";
				});
				setTimeout(function () {
					let row = getRow();
					let tiles = row.children;
					htmlForEach(tiles, function (tile) {
						let tileParagraph = tile.children[0];
						tileParagraph.style.color = "white";
					});
				}, 600);
			}
		}
	} else if (key == 'Backspace') {
		if (letterCount > 0) {
			removeLetter();
			letterCount--;
		}
	} else if (isLetter(key)) {
		if (letterCount < 5) {
			addLetter(key);
			letterCount++;
		}
	}
}

function getMyRandomWord() {
	let index = Math.floor(Math.random() * myWords.length);
	let out = myWords[index];
	console.log(out);
	return out;
}

function htmlForEach(collection, procedure) {
	Array.from(collection).forEach(element => {
		procedure(element);
	});
}

function addLetter(letter) {
	let row = getRow();
	let tiles = row.children;
	let tile = tiles[letterCount];
	let tileParagraph = tile.children[0];

	tileParagraph.textContent = letter.toUpperCase();
}

function removeLetter() {
	let row = getRow();
	let tiles = row.children;
	let tile = tiles[letterCount - 1];
	let tileParagraph = tile.children[0];

	tileParagraph.textContent = '';
}

function isLetter(str) {
	return str.length === 1 && str.match(/[a-z]/i);
}

function checkIfWord() {
	let row = getRow();
	let word = getWord(row);

	let out = false;

	let isMyWord = myWords.includes(word.toLowerCase());
	let isEnglishWord = englishWords.includes(word);

	if (isMyWord || isEnglishWord) out = true;

	return out;
}

function getRow() {
	return document.querySelector("#row-" + (guessCount + 1));
}

function getWord(row) {
	let str = "";
	htmlForEach(row.children, function (tile) {
		let tileParagraph = tile.children[0];
		str += tileParagraph.textContent;
	});
	return str;
}

var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
	document.getElementById("myModal").style.display = "none";
}