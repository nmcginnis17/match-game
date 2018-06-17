// Array with all of the cards
let cardsList = [
  "fa-paper-plane-o",
  "fa-diamond",
  "fa-bicycle",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-leaf",
  "fa-bomb"
];
cardsList = cardsList.concat(cardsList);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
let totalSec = 0;
let min = document.querySelector(".min");
let sec = document.querySelector(".sec");

// Timer code from Stackoverflow with some changes: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function startTimer(){
	function setTime() {
		++totalSec;
		sec.innerHTML = pad(totalSec % 60);
		min.innerHTML = pad(parseInt(totalSec / 60));
	}

	function pad(val) {
		let valString = val + "";
		return valString.length < 2 ? `0${valString}` : valString
	}
	timer = setInterval(setTime, 1000)

}

// Function to stop timer
function stopTimer() {
	clearInterval(timer);
}

// Count moves
const moves = document.querySelector(".moves");
let moveCounter = 0;
function movesCount() {
	moveCounter += 1;
	moves.innerHTML = moveCounter
}

// Add cards into the HTML
function displayCards(card) {
	return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`
}

// Removes all stars currently being used and replaced with default stars.
function resetStars() {
	document.querySelector(".star-1").remove();
	document.querySelector(".star-2").remove();
	document.querySelector(".star-3").remove();
	$(".stars").append('<li class="star-1"><i class="fas fa-star"></i></li>');
	$(".stars").append('<li class="star-2"><i class="fas fa-star"></i></li>');
	$(".stars").append('<li class="star-3"><i class="fas fa-star"></i></li>');
}

// Flip cards facedown function
function resetCards() {
	const deck = document.querySelector(".deck");
	allCards.forEach(function(card) {
		card.classList.remove("match", "show", "open", "noClick");
		selectedCards = [];
		matchedCards = [];
	});
}

// Display Modal
function endGame() {
	const modal = document.querySelector(".modal");
	const modalContent = document.querySelector(".modal-content");
	const messagePara = document.querySelector(".winning-message");
	const messageContainer = document.createElement("p");
	const closeModal = document.querySelector(".close");
	const newGame = document.querySelector(".new-game");
	let totalStars = document.querySelector(".stars").innerHTML;
	let scoreMessage = document.createElement("span");
	let timeMessage = document.createElement("p");

	stopTimer();
	modal.classList.add("modal-open");

	// Modal message
	messageContainer.textContent = "You scored"
	messagePara.append(messageContainer);
	scoreMessage.innerHTML = totalStars;
	messageContainer.append(scoreMessage);
	timeMessage.innerText = "With a time of  " + min.innerHTML + ":" + sec.innerHTML+ "!"
	messagePara.append(timeMessage);

	// Refreshes page on "New Game" click
	newGame.addEventListener("click", function() {
		location.reload();
	});
}

// Start game function
function gameStart() {
	const deck = document.querySelector(".deck");
	let deckHTML = shuffle(cardsList).map(function(card) {
		return displayCards(card);
	});
	deck.innerHTML = deckHTML.join("");
}

gameStart();

const allCards = document.querySelectorAll(".card");
const stars = document.querySelector(".stars");
const reset = document.querySelector(".fa-repeat");
let selectedCards = [];
let matchedCards = [];

// Reset everything
reset.addEventListener("click", resetBtn);
	function resetBtn() {
		moves.innerHTML = 0;
		moveCounter = 0;
		totalSec = 0;
		sec.innerText = "00";
		min.innerText = "00";
		stopTimer();
		resetStars();
		resetCards();
	}

// Game functionality
allCards.forEach(function(card) {
	card.addEventListener('click', function(e) {

		if (moveCounter == 0 && selectedCards.length === 0) {
			startTimer();
		}

		// add cards to array and prevents double-click
		if (!card.classList.contains("open") && !card.classList.contains("show") && !card.classList.contains("match")) {
			card.classList.add('open', 'show');
			selectedCards.push(card);
		}

			// Flips cards facedown when they do not match or 1 second whichever comes first
			if (selectedCards.length === 2) {
					allCards.forEach(function(card) {
						card.classList.add("noClick");
					});
					setTimeout(function() {
						allCards.forEach(function(card) {
							card.classList.remove("open", "show", "noClick");
						});
						selectedCards = [];
          }, 1000);
				}

			// Starts moves counter
			if (selectedCards.length === 2 || matchedCards === 2) {
				movesCount();
			}

			// Deducts one star once player reaches 14 moves
			if (moves.innerText == 14) {
				document.querySelector(".star-3").remove();
				$(".stars").append('<li class="star-3"><i class="far fa-star"></i></li>');
			}

			// Deducts second star once player reaches 18 moves
			else if (moves.innerText == 18) {
				document.querySelector(".star-2").remove();
				$(".stars").append('<li class="star-2"><i class="far fa-star"></i></li>');
			}

			// Determines if cards are same
			if (selectedCards[0].dataset.card === selectedCards[1].dataset.card) {
				selectedCards.forEach(function(card) {
					card.classList.add("match");
				});

					// Adds matched cards to an array
					if (card.classList.contains("match")) {
					matchedCards.push(card);
					}

					// When player reaches 8 matches added to the array, player receives victory screen
					if (matchedCards.length === 8) {
						setTimeout(function () {
							endGame();
						}, 1000);
					}
			}

	});
});
