document.addEventListener("DOMContentLoaded", function () {
    const calendarView = document.getElementById("calendar-view");
    const currentDateRange = document.getElementById("current-date-range");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const todayBtn = document.getElementById("today-btn");

    let currentDate = new Date();

    function generateCalendarGrid(date) {
        calendarView.innerHTML = "";
        const year = date.getFullYear();
        const month = date.getMonth();

        currentDateRange.textContent = `${date.toLocaleString("default", { month: "long" })} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let calendarGrid = document.createElement("div");
        calendarGrid.classList.add("calendar-grid");

        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        daysOfWeek.forEach(day => {
            let dayHeader = document.createElement("div");
            dayHeader.classList.add("day-header");
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        for (let i = 0; i < firstDay; i++) {
            let emptyCell = document.createElement("div");
            emptyCell.classList.add("empty-cell");
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            let dayCell = document.createElement("div");
            dayCell.classList.add("day-cell");
            dayCell.textContent = day;
            dayCell.dataset.date = `${year}-${month + 1}-${day}`;
            calendarGrid.appendChild(dayCell);
        }

        calendarView.appendChild(calendarGrid);
    }

    prevBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendarGrid(currentDate);
    });

    nextBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendarGrid(currentDate);
    });

    todayBtn.addEventListener("click", function () {
        currentDate = new Date();
        generateCalendarGrid(currentDate);
    });

    generateCalendarGrid(currentDate);
});
