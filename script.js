const N = 4;
const M = 4;

let turn = "R";
let selectedLines =[]
// {
// 	// red: [],
// 	// blue:[]
// };
let score = {
	blue: 0,
	red: 0
}

const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };

const playersTurnText = (turn) =>
	`It's ${turn === "R" ? "Red" : "Blue"}'s turn`;

const isLineSelected = (line) =>
	line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
	const gameGridContainer = document.getElementsByClassName(
		"game-grid-container"
	)[0];

	const rows = Array(N)
		.fill(0)
		.map((_, i) => i);
	const cols = Array(M)
		.fill(0)
		.map((_, i) => i);

	rows.forEach((row) => {
		cols.forEach((col) => {
			const dot = document.createElement("div");
			dot.setAttribute("class", "dot");

			const hLine = document.createElement("div");
			hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
			hLine.setAttribute("id", `h-${row}-${col}`);
			hLine.addEventListener("click", handleLineClick);

			gameGridContainer.appendChild(dot);
			if (col < M - 1) gameGridContainer.appendChild(hLine);
		});

		if (row < N - 1) {
			cols.forEach((col) => {
				const vLine = document.createElement("div");
				vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
				vLine.setAttribute("id", `v-${row}-${col}`);
				vLine.addEventListener("click", handleLineClick);

				const box = document.createElement("div");
				box.setAttribute("class", "box");
				box.setAttribute("id", `box-${row}-${col}`);

				gameGridContainer.appendChild(vLine);
				if (col < M - 1) gameGridContainer.appendChild(box);
			});
		}
	});

	document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const changeTurn = () => {
	const nextTurn = turn === "R" ? "B" : "R";
	document.getElementById("game-status").innerHTML = playersTurnText(nextTurn);

	const lines = document.querySelectorAll(".line-vertical, .line-horizontal");

	lines.forEach((l) => {
		//if line was not already selected, change it's hover color according to the next turn
		if (!isLineSelected(l)) {
			l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
		}
	});
	turn = nextTurn;
};

const handleLineClick = (e) => {
	const lineId = e.target.id;
	// const box = document.querySelectorAll('.box')
	const selectedLine = document.getElementById(lineId);
	let boxComplete = false;

	if (isLineSelected(selectedLine)) {
		// console.log(lineId);
		//if line was already selected, return
		return;
	}
	// turn=='R' ? selectedLines['red'] = [...selectedLines['red'], lineId] : selectedLines['blue'] = [...selectedLines['blue'], lineId]
	selectedLines = [...selectedLines, lineId];
	console.log(lineId);

	colorLine(selectedLine);
	if (lineId.startsWith('h')) {

		const arr = lineId.split('-');

		const row = parseInt(arr[1]);
		const col = parseInt(arr[2]);

		//boxex with hLine start
		const boxAbove = [`h-${row}-${col}`, `v-${row - 1}-${col}`, `h-${row - 1}-${col}`, `v-${row - 1}-${col + 1}`];
		const boxBelow = [`h-${row}-${col}`, `h-${row + 1}-${col}`, `v-${row}-${col}`, `v-${row}-${col + 1}`];


		const isBoxCompleted = (box) => box.every(r => selectedLines.includes(r));
		//hline
		if (isBoxCompleted(boxBelow)) {
			const gameGridContainer = document.getElementsByClassName("game-grid-container")[0];
			let boxId = gameGridContainer.querySelector(`#box-${row}-${col}`);
			boxId.classList.add(bgClasses[turn]);
			boxComplete = true;
			//score 
			const scoreer = bgClasses[turn] === "bg-red" ? score.red += 1 : score.blue += 1;

		};
		if (isBoxCompleted(boxAbove)) {
			const gameGridContainer = document.getElementsByClassName("game-grid-container")[0];
			const boxId = gameGridContainer.querySelector(`#box-${row - 1}-${col}`);
			boxId.classList.add(bgClasses[turn]);
			boxComplete = true;
			const scoreer = bgClasses[turn] === "bg-red" ? score.red += 1 : score.blue += 1;

			// console.log(scoreer);//0
			// console.log(score.blue);//1
		};
		isBoxCompleted(boxBelow);
		isBoxCompleted(boxAbove);
	}

	if (lineId.startsWith('v')) {
		const arr = lineId.split('-');

		const row = +arr[1]
		const col = +arr[2]

		const boxLeft = [`v-${row}-${col}`, `v-${row}-${col - 1}`, `h-${row}-${col - 1}`, `h-${row + 1}-${col - 1}`];
		const boxRight = [`v-${row}-${col}`, `v-${row}-${col + 1}`, `h-${row}-${col}`, `h-${row + 1}-${col}`];

		const isBoxCompleted = (box) => box.every(r => selectedLines.includes(r));

		if (isBoxCompleted(boxLeft)) {
			boxComplete = true;
			const gameGrid = document.querySelector("game-grid-container");
			const boxId = gameGrid.querySelector(`#box-${row}-${col - 1}`);
			boxId.classList.add(bgClasses[turn]);
			bgClasses[turn] == "bg-red" ? score.red++ : score.blue++;
		
		};

		if (isBoxCompleted(boxRight)) {
			boxComplete = true;
			const gameGrid = document.querySelector(".game-grid-container");
			const boxId = gameGrid.querySelector(`#box-${row}-${col}`);
			boxId.classList.add(bgClasses[turn]);
			bgClasses[turn] == "bg-red" ? score.red += 1 : score.blue += 1;

		};

		isBoxCompleted(boxLeft);
		isBoxCompleted(boxRight);
	}
	
	if (boxComplete == false) {
		changeTurn()
	};

	if (selectedLines.length === 24) {
		const winner = score.red > score.blue ? "Red is Winner" : "blue is Winner";
		document.getElementById("game-status").innerHTML = `${winner}`;
	}
};

const colorLine = (selectedLine) => {
	selectedLine.classList.remove(hoverClasses[turn]);
	selectedLine.classList.add(bgClasses[turn]);
};

createGameGrid();