"use strict";

const MINIMUM_NO_OF_WORDS = 110;
const COPY_TEXT = "The typing speed of an average person is 38 WPM. Are you faster than your friends? Settle the debate in just 30 seconds!";
const API_URL = "https://type.fit/api/quotes";

const copy = document.querySelector(".copy");
const firstScreen = document.querySelector(".first-screen");
const startBtn = document.querySelector(".first-screen .button");

const activeQuotes = [];

let typingAnimationCounter = 0;

async function fetchQuotes() {
	try {
		const response = await fetch(API_URL);
		if (!response?.ok) throw new Error("unable to fetch data.");
		const data = await response.json();

		let noOfQuotes = data.length;
		let noOfWords = 0;
		while (noOfWords < MINIMUM_NO_OF_WORDS) {
			const quote = data[Math.floor(Math.random() * noOfQuotes) + 1].text;

			if (activeQuotes.includes(quote)) continue;

			activeQuotes.push(quote);
			noOfWords += quote.split(" ").length;
			noOfQuotes--;
		}
		console.log(activeQuotes);
	} catch (e) {
		throw e;
	}
}

function typingAnimation() {
	if (typingAnimationCounter < COPY_TEXT.length) {
		copy.innerHTML += COPY_TEXT.charAt(typingAnimationCounter);
		typingAnimationCounter++;
		setTimeout(typingAnimation, 20);
	}
}

typingAnimation();

function init() {
	fetchQuotes().catch((e) => console.log(e));
}

//EVENT LISTENERS
startBtn.addEventListener("click", function () {
	firstScreen.classList.add("hidden");
});

//START

// init();
