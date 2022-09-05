"use strict";

const MINIMUM_NO_OF_WORDS = 110;
const COPY_TEXT = "The typing speed of an average person is 38 WPM. Are you faster than your friends? Settle the debate in just 30 seconds!";
const API_URL = "https://type.fit/api/quotes";
const CURSOR_HTML = `<span class="cursor">|</span>`;

const copy = document.querySelector(".copy");
const firstScreen = document.querySelector(".first-screen");
const startBtn = document.querySelector(".first-screen .button");
const mainScreen = document.querySelector(".test-screen");
const quotesBox = document.querySelector(".quotes-box");
const inputField = document.querySelector(".hidden-input input");
const spinner = document.querySelector(".test-screen .loading-spinner");
const countdownTimer = document.querySelector(".countdown");
const speedDisplay = document.querySelector(".speed");
const accuracyDisplay = document.querySelector(".accuracy");
const test = document.querySelector(".test");
const results = document.querySelector(".test-result");
const restartBtn = document.querySelector(".restart");

let data;

let activeQuotes = [];
let quoteText = "";
let timer;
let time = 30;
let countdownStarted = false;
let typingAnimationCounter = 0;

async function fetchQuotes() {
	try {
		const response = await fetch(API_URL);
		if (!response?.ok) throw new Error("unable to fetch data.");
		data = await response.json();

		setActiveQuotes(data);
	} catch (e) {
		throw e;
	}
}

function setActiveQuotes(data) {
	let noOfQuotes = data.length;
	let noOfWords = 0;
	while (noOfWords < MINIMUM_NO_OF_WORDS) {
		const random = Math.floor(Math.random() * noOfQuotes) + 1;
		const quote = data[random].text;

		if (activeQuotes.includes(quote)) continue;

		activeQuotes.push(quote);
		noOfWords += quote.split(" ").length;
		noOfQuotes--;
	}
	displayQuotes();
}

function typingAnimation() {
	if (typingAnimationCounter < COPY_TEXT.length) {
		copy.innerHTML += COPY_TEXT.charAt(typingAnimationCounter);
		typingAnimationCounter++;
		setTimeout(typingAnimation, 20);
	}
}

function triggerInputField() {
	inputField.focus();
	inputField.click();
	spinner.classList.add("hidden");
}

function displayQuotes() {
	let finalHTML = "";
	activeQuotes.forEach((quote) => {
		let quoteHTML = "";
		quote.split(" ").forEach((word) => {
			let wordHTML = "";
			[...word].forEach((letter) => {
				wordHTML += `<span class="letter">${letter}</span>`;
			});
			wordHTML += `<span class="letter">&nbsp;</span>`;
			quoteHTML += `<span class="word">${wordHTML}</span>`;
		});
		quoteText += quote + " ";
		finalHTML += quoteHTML;
	});
	quotesBox.insertAdjacentHTML("beforeend", finalHTML);
}

function restart() {
	inputField.value = "";
	inputField.focus();
	activeQuotes = [];
	quoteText = "";
	countdownStarted = false;
	time = 30;
	spinner.classList.add("hidden");
	clearInterval(timer);
	countdownTimer.textContent = "30";
	countdownTimer.classList.remove("started");
	quotesBox.innerHTML = `<span class="letter"><span class="cursor">|</span></span>`;
	setActiveQuotes(data);

	firstScreen.classList.add("hidden");
	mainScreen.classList.remove("hidden");
	results.classList.add("hidden");
	test.classList.remove("hidden");
	quotesBox.scrollTop = 0;
}

function checkForScroll(cursor) {
	const cursorCoords = cursor.getBoundingClientRect();
	const quotesCoords = quotesBox.getBoundingClientRect();
	if (cursorCoords.y > quotesCoords.y + quotesCoords.height / 2) quotesBox.scrollTop += quotesCoords.height / 4;
}

function displayScores(speed, accuracy) {
	speedDisplay.firstChild.nodeValue = speed;
	accuracyDisplay.firstChild.nodeValue = accuracy;
	test.classList.add("hidden");
	results.classList.remove("hidden");
}

function calculateFinalSpeed() {
	const input = inputField.value;
	const expected = quoteText;
	let correct = 0;
	let total = input.length;

	[...input].forEach((v, i) => v === expected[i] && correct++);
	const speed = ((correct / 5) * 2).toFixed(0);
	const accuracy = ((correct / total) * 100).toFixed(0);

	displayScores(speed, accuracy);
}

function countdown() {
	countdownTimer.classList.add("started");
	timer = setInterval(function () {
		if (time <= 0) {
			calculateFinalSpeed();
			clearInterval(timer);
			return;
		}

		time--;
		countdownTimer.textContent = time.toString();
	}, 1000);

	countdownStarted = true;
}

function validateInput(e) {
	if (!countdownStarted) countdown();

	let i = 0;
	quoteText.split(" ").forEach((word, wordIndex) => {
		const input = e.target.value;

		if (!input) document.querySelector(`.quotes-box :nth-child(1)`).classList.remove("hidden");
		else document.querySelector(`.quotes-box :nth-child(1)`).classList.add("hidden");

		[...word, " "].forEach((letter, letterIndex) => {
			const letterElement = document.querySelector(`.quotes-box :nth-child(${wordIndex + 2}) .letter:nth-of-type(${letterIndex + 1})`);

			if (letterElement?.innerHTML.endsWith(CURSOR_HTML)) {
				letterElement.innerHTML = letterElement.firstChild.nodeValue;
			}
			if (i === input.length - 1) {
				letterElement.insertAdjacentHTML("beforeend", CURSOR_HTML);
				checkForScroll(document.querySelectorAll(".cursor")[1]);
			}

			if (!input[i] && letterElement) {
				letterElement.className = "letter";
			} else if (letter === input[i] && letterElement) {
				letterElement.className = "letter correct";
			} else {
				if (letterElement) letterElement.className = "letter wrong";
			}

			i++;
		});
	});
}

function init() {
	typingAnimation();
	fetchQuotes().catch((e) => console.log(e));
}

//EVENT LISTENERS
startBtn.addEventListener("click", function () {
	firstScreen.classList.add("hidden");
	mainScreen.classList.remove("hidden");
	triggerInputField();
});

quotesBox.addEventListener("click", triggerInputField);

inputField.addEventListener("input", validateInput);
inputField.addEventListener("blur", () => document.querySelectorAll(".cursor").forEach((v) => v.classList.add("hidden")));
inputField.addEventListener("focus", () => document.querySelectorAll(".cursor").forEach((v) => v.classList.remove("hidden")));
inputField.addEventListener("keydown", (e) => e.key.startsWith("Arrow") && e.preventDefault());

restartBtn.addEventListener("click", restart);

//START

init();
