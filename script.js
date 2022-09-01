"use strict";

const MINIMUM_NO_OF_WORDS = 110;
const COPY_TEXT = "The typing speed of an average person is 38 WPM. Are you faster than your friends? Settle the debate in just 30 seconds!";
const API_URL = "https://type.fit/api/quotes";

const copy = document.querySelector(".copy");
const firstScreen = document.querySelector(".first-screen");
const startBtn = document.querySelector(".first-screen .button");
const mainScreen = document.querySelector(".test-screen");
const quotesBox = document.querySelector(".quotes-box");
const inputField = document.querySelector(".hidden-input input");
const spinner1 = document.querySelector(".test-screen .loading-spinner");

const activeQuotes = [];

let quoteText =
	"We see things not as they are, but as we are. Our perception is shaped by our previous experiences. To dream of the person you would like to be is to waste the person you are. Learn all you can from the mistakes of others. You won't have time to make them all yourself. We must become the change we want to";
let typingAnimationCounter = 0;

async function fetchQuotes() {
	try {
		const response = await fetch(API_URL);
		if (!response?.ok) throw new Error("unable to fetch data.");
		const data = await response.json();

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
	} catch (e) {
		throw e;
	} finally {
		spinner1.classList.add("hidden");
	}
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
}

function displayQuotes() {
	let finalHTML = "";
	activeQuotes.forEach((quote) => {
		let quoteHTML = "";
		[...quote].forEach((letter) => {
			quoteHTML += `<span class="letter">${letter}</span>`;
		});
		quoteText += quote + " ";
		finalHTML += `${quoteHTML}<span class="letter"> </span>`;
	});
	quotesBox.insertAdjacentHTML("afterbegin", finalHTML);
}

function validateInput(e) {
	// [...(e.target.value + "      ")].forEach((v, i) => {
	// 	const letterElement = document.querySelector(`.quotes-box :nth-child(${i + 1})`);
	// 	if (v === quoteText[i]) {
	// 		letterElement.className = "letter correct";
	// 	} else {
	// 		letterElement.className = "letter wrong";
	// 	}
	// });
	[...quoteText].forEach((v, i) => {
		const letterElement = document.querySelector(`.quotes-box :nth-child(${i + 1})`);
		if (!e.target.value[i]) {
			letterElement.className = "letter";
		} else if (v === e.target.value[i]) {
			letterElement.className = "letter correct";
		} else {
			letterElement.className = "letter wrong";
		}
	});

	// if (quoteText.startsWith(e.target.value)) console.log("yes");
	// else console.log("no");
}

typingAnimation();
triggerInputField();

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

//START

// init();
