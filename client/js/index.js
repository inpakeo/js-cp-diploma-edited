let Request = "event=update";

document.addEventListener("DOMContentLoaded", () => {
	const dayNumberElements = document.querySelectorAll(".page-nav__day-number");
	const dayWeekElements = document.querySelectorAll(".page-nav__day-week");
	const dayWeekCatalog = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
	const today = new Date();
	today.setHours(0, 0, 0);

	dayNumberElements.forEach((dayNumber, i) => {
	const day = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
	const markTime = Math.trunc(day / 1000);

	dayNumber.innerHTML = `${day.getDate()},`;
	dayWeekElements[i].innerHTML = dayWeekCatalog[day.getDay()];

	const dayLink = dayNumber.parentNode;

	dayLink.dataset.markTime = markTime;

	if (dayWeekElements[i].innerHTML === "Вс" || dayWeekElements[i].innerHTML === "Сб") {
		dayLink.classList.add("page-nav__day_weekend");
	} else {
		dayLink.classList.remove("page-nav__day_weekend");
	}
	});


	getRequest(Request, (response) => {
		const subject = {
		  seances: response.seances.result,
		  films: response.films.result,
		  halls: response.halls.result.filter((hall) => hall.hall_open == 1),
		};
	  
		const main = document.querySelector("main");
	  
		subject.films.forEach((film) => {
		  const filmSeances = subject.seances.filter(
			(seance) => seance.seance_filmid === film.film_id
		  );
	  
		  if (filmSeances.length > 0) {
			const seancesHTML = subject.halls
			  .map((hall) => {
				const hallSeances = filmSeances.filter(
				  (seance) => seance.seance_hallid === hall.hall_id
				);
	  
				if (hallSeances.length > 0) {
				  const seanceListHTML = hallSeances
					.map(
					  (seance) => `
					  <li class="movie-seances__time-block">
						<a class="movie-seances__time" href="hall.html"
						  data-film-name="${film.film_name}"
						  data-film-id="${film.film_id}"
						  data-hall-id="${hall.hall_id}"
						  data-hall-name="${hall.hall_name}"
						  data-price-vip="${hall.hall_price_vip}"
						  data-price-standart="${hall.hall_price_standart}"
						  data-seance-id="${seance.seance_id}"
						  data-seance-start="${seance.seance_start}"
						  data-seance-time="${seance.seance_time}">
						  ${seance.seance_time}
						</a>
					  </li>`
					)
					.join("");
	  
				  return `
					<div class="movie-seances__hall">
					  <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
					  <ul class="movie-seances__list">${seanceListHTML}</ul>
					</div>`;
				}
	  
				return "";
			  })
			  .join("");
	  
			if (seancesHTML) {
			  const movieHTML = `
				<section class="movie">
				  <div class="movie__info">
					<div class="movie__poster">
					  <img class="movie__poster-image" alt="Постер фильма ${film.film_name}" src="${film.film_poster}">
					</div>
					<div class="movie__description">
					  <h2 class="movie__title">${film.film_name}</h2>
					  <p class="movie__synopsis">${film.film_description}</p>
					  <p class="movie__data">
						<span class="movie__data-duration">${film.film_duration} мин.</span>
						<span class="movie__data-origin">${film.film_origin}</span>
					  </p>
					</div>
				  </div>
				  ${seancesHTML}
				</section>`;
	  
			  main.innerHTML += movieHTML;
			}
		  }
		});
	  
		const dayLinks = Array.from(document.querySelectorAll(".page-nav__day"));
		const movieSeances = Array.from(document.querySelectorAll(".movie-seances__time"));
	  
		dayLinks.forEach((dayLink) => {
		  dayLink.addEventListener("click", (event) => {
			event.preventDefault();
	  
			const chosenDayLink = document.querySelector(".page-nav__day_chosen");
			chosenDayLink.classList.remove("page-nav__day_chosen");
	  
			dayLink.classList.add("page-nav__day_chosen");
	  
			let markTimeDay = Number(dayLink.dataset.markTime);
	  
			if (isNaN(markTimeDay)) {
			  markTimeDay = Number(dayLink.closest(".page-nav__day").dataset.markTime);
			}
			movieSeances.forEach((movieSeance) => {
			  const markTimeSeanceDay = Number(movieSeance.dataset.seanceStart) * 60;
			  const markTimeSeance = markTimeDay + markTimeSeanceDay;
			  const markTimeNow = Math.trunc(+new Date() / 1000);
	  
			  movieSeance.dataset.seanceTimeStamp = markTimeSeance;
	  
			  if (markTimeSeance - markTimeNow > 0) {
				movieSeance.classList.remove("acceptin-button-disabled");
			  } else {
				movieSeance.classList.add("acceptin-button-disabled");
			  }
			});
		  });
		});
	  
		dayLinks[0].click();
	  
		movieSeances.forEach((movieSeance) => {
		  movieSeance.addEventListener("click", (event) => {
			const selectedSeance = event.target.dataset;
			selectedSeance.hallConfig = subject.halls.find(
			  (hall) => hall.hall_id == selectedSeance.hallId
			).hall_config;
			localStorage.setItem("selectedSeance", JSON.stringify(selectedSeance));
		  });
		});
	  });
	  
});