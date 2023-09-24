let selectedSeance = JSON.parse(localStorage.selectedSeance);

let request = `event=get_hallConfig&timestamp=${selectedSeance.seanceTimeStamp}&hallId=${selectedSeance.hallId}&seanceId=${selectedSeance.seanceId}`;

document.addEventListener("DOMContentLoaded", () => {
	let acceptinButton = document.querySelector(".acceptin-button");
	let buyingTitle = document.querySelector(".buying__info-title");
	let buyingStart = document.querySelector(".buying__info-start");
	let buyingHall = document.querySelector(".buying__info-hall");
	let priceStandart = document.querySelector(".price-standart");
	let confStepWrapper = document.querySelector(".conf-step__wrapper");

	buyingTitle.innerHTML = selectedSeance.filmName;
	buyingStart.innerHTML = `Начало сеанса ${selectedSeance.seanceTime}`;
	buyingHall.innerHTML = selectedSeance.hallName;
	priceStandart.innerHTML = selectedSeance.priceStandart;

	getRequest(request, (response) => {
		console.log(response)
		if (response) {
			selectedSeance.hallConfig = response;
		} else {
			console.log('Нет купленных билетов');
		}
		confStepWrapper.innerHTML = selectedSeance.hallConfig;

		let chairs = Array.from(document.querySelectorAll(".conf-step__row .conf-step__chair"));
		acceptinButton.setAttribute("disabled", true);

		chairs.forEach((chair) => {
			chair.addEventListener("click", (event) => {
				if (event.target.classList.contains("conf-step__chair_taken")) {
					return;
				};
				event.target.classList.toggle("conf-step__chair_selected");
				let chairsSelected = Array.from(document.querySelectorAll(".conf-step__row .conf-step__chair_selected"));

				if (chairsSelected.length > 0) {
					acceptinButton.removeAttribute("disabled");
				} else {
					acceptinButton.setAttribute("disabled", true);
				};
			});
		});
	});

	window.addEventListener("popstate", function () {
		localStorage.clear();
	});

	acceptinButton.addEventListener("click", (event) => {
	event.preventDefault();

	const selectedPlaces = [];
	const rows = document.querySelectorAll(".conf-step__row");

	rows.forEach((row, rowIndex) => {
		const chairs = row.querySelectorAll(".conf-step__chair");

		chairs.forEach((chair, chairIndex) => {
		if (chair.classList.contains("conf-step__chair_selected")) {
			const typePlace = chair.classList.contains("conf-step__chair_standart") ? "standart" : "vip";

			selectedPlaces.push({
			"row": rowIndex + 1,
			"place": chairIndex + 1,
			"type": typePlace,
			});
		}
		});
	});

	const configurationHall = document.querySelector(".conf-step__wrapper").innerHTML;

	selectedSeance.hallConfig = configurationHall;
	selectedSeance.salesPlaces = selectedPlaces;

	localStorage.setItem("selectedSeance", JSON.stringify(selectedSeance));

	window.location.href = "payment.html";
	});
});