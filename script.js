"use strict";

const MINIMUM_NO_OF_WORDS = 110;

const activeQuotes = [];

async function fetchQuotes() {
	try {
		const response = await fetch("https://type.fit/api/quotes");
		if (!response?.ok) throw new Error("unable to fetch data.");
		const data = await response.json();

		const noOfQuotes = data.length;
		const noOfWords = 0;
		while (noOfWords < MINIMUM_NO_OF_WORDS) {
			const rand = Math.floor(Math.random() * noOfQuotes) + 1;
		}
	} catch (e) {
		throw e;
	}
}

function init() {
	fetchQuotes().catch((e) => console.log(e));
}

//START

init();
