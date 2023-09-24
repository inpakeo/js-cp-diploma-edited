const selectedSeance = JSON.parse(localStorage.selectedSeance);

const ticketTitleElement = document.querySelector(".ticket__title");
const ticketChairsElement = document.querySelector(".ticket__chairs");
const ticketHallElement = document.querySelector(".ticket__hall");
const ticketStartElement = document.querySelector(".ticket__start");
const ticketCostElement = document.querySelector(".ticket__cost");
const acceptinButton = document.querySelector(".acceptin-button");

const places = selectedSeance.salesPlaces.map(({ row, place }) => `${row}/${place}`).join(", ");

const price = selectedSeance.salesPlaces.reduce((total, { type }) => {
    return total + (type === "standart" ? Number(selectedSeance.priceStandart) : Number(selectedSeance.priceVip));
}, 0);

ticketTitleElement.textContent = selectedSeance.filmName;
ticketChairsElement.textContent = places;
ticketHallElement.textContent = selectedSeance.hallName;
ticketStartElement.textContent = selectedSeance.seanceTime;
ticketCostElement.textContent = price;

const newHallConfig = selectedSeance.hallConfig.replace(/selected/g, "taken");

acceptinButton.addEventListener("click", async (event) => {
    event.preventDefault();
    
    try {
        const response = await fetch("https://jscp-diplom.netoserver.ru/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `event=sale_add&timestamp=${selectedSeance.seanceTimeStamp}&hallId=${selectedSeance.hallId}&seanceId=${selectedSeance.seanceId}&hallConfiguration=${newHallConfig}`,
        });

        if (response.ok) {
            console.log("Билет успешно куплен!");
        } else {
            console.error("Произошла ошибка при покупке билета.");
        }
    } catch (error) {
        console.error("Произошла ошибка при выполнении запроса:", error);
    }
});
