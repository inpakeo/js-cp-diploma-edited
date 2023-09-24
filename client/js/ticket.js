function generateTicket() {
    const selectedSeance = JSON.parse(localStorage.getItem("selectedSeance"));

    const selectedPlaces = [];
    let totalPrice = 0;

    for (const salePlace of selectedSeance.salesPlaces) {
        const { row, place, type } = salePlace;
        const seatInfo = `${row}/${place}`;
        selectedPlaces.push(seatInfo);
        totalPrice += type === "standart" ? Number(selectedSeance.priceStandart) : Number(selectedSeance.priceVip);
    }

    const ticketTitle = document.querySelector(".ticket__title");
    const ticketChairs = document.querySelector(".ticket__chairs");
    const ticketHall = document.querySelector(".ticket__hall");
    const ticketStart = document.querySelector(".ticket__start");

    ticketTitle.textContent = selectedSeance.filmName;
    ticketChairs.textContent = selectedPlaces.join(", ");
    ticketHall.textContent = selectedSeance.hallName;
    ticketStart.textContent = selectedSeance.seanceTime;

    const date = new Date(Number(selectedSeance.seanceTimeStamp * 1000));
    const dateStr = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

    const seanceInfo = `Фильм: ${selectedSeance.filmName}
    Зал: ${selectedSeance.hallName}
    Ряд/Место: ${selectedPlaces.join(", ")}
    Дата: ${dateStr}
    Начало сеанса: ${selectedSeance.seanceTime}`;

    const qrCode = QRCreator(seanceInfo, { image: "SVG" });

    const ticketInfoQR = document.querySelector(".ticket__info-qr");
    ticketInfoQR.innerHTML = ''; 
    ticketInfoQR.appendChild(qrCode.result);

    qrCode.download();
}

document.addEventListener("DOMContentLoaded", generateTicket);
