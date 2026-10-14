// ---------- Data (saved in the browser so it survives page refresh) ----------
const storageKey = "hospitalData";
let hospitalData = loadData();

function loadData() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved) return saved;
    } catch (error) {
        // Ignore broken or blocked storage and start fresh
    }
    return { patients: [], doctors: [], appointments: [] };
}

function saveData() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(hospitalData));
    } catch (error) {
        // Storage unavailable: app still works for this session
    }
}

// ---------- Navigation ----------
const navButtons = document.querySelectorAll(".nav-btn");

function showView(viewId) {
    document.querySelectorAll(".view").forEach(function (view) {
        view.classList.toggle("active", view.id === viewId);
    });
    navButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.view === viewId);
    });
}

navButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        showView(button.dataset.view);
    });
});

// ---------- Toast message ----------
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message, isError) {
    toast.textContent = message;
    toast.classList.toggle("error", Boolean(isError));
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2800);
}

// ---------- Avatar with initials ----------
function makePerson(fullName) {
    const wrapper = document.createElement("div");
    wrapper.className = "person";

    const initials = fullName.replace("Dr. ", "").split(" ")
        .slice(0, 2).map(function (word) { return word.charAt(0); }).join("").toUpperCase();

    const avatar = document.createElement("span");
    avatar.className = "avatar c" + ((fullName.length % 5) + 1);
    avatar.textContent = initials;

    const nameText = document.createElement("span");
    nameText.textContent = fullName;

    wrapper.appendChild(avatar);
    wrapper.appendChild(nameText);
    return wrapper;
}

// ---------- Table helper ----------
// Fills a table body. Pass collectionName to add a delete button to each row.
function fillTable(bodyId, items, fields, columnCount, collectionName) {
    const tableBody = document.getElementById(bodyId);
    tableBody.innerHTML = "";

    if (items.length === 0) {
        const emptyRow = tableBody.insertRow();
        const emptyCell = emptyRow.insertCell(0);
        emptyCell.colSpan = columnCount;
        emptyCell.className = "empty";
        emptyCell.textContent = "Nothing here yet.";
        return;
    }

    items.forEach(function (item) {
        const newRow = tableBody.insertRow();

        fields.forEach(function (field, index) {
            const cell = newRow.insertCell(index);
            if (field === "name" || field === "patient") {
                cell.appendChild(makePerson(item[field]));
            } else if (field === "gender" || field === "specialization") {
                const badge = document.createElement("span");
                badge.className = "badge " + (field === "gender" ? item[field] : "s" + ((item[field].length % 4) + 1));
                badge.textContent = item[field];
                cell.appendChild(badge);
            } else {
                cell.textContent = item[field];
            }
        });

        if (collectionName) {
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-btn";
            deleteButton.innerHTML = '<svg class="i"><use href="#i-trash"/></svg>';
            deleteButton.setAttribute("aria-label", "Delete");
            deleteButton.addEventListener("click", function () {
                const position = hospitalData[collectionName].indexOf(item);
                hospitalData[collectionName].splice(position, 1);
                saveData();
                renderAll();
                showToast("Deleted.");
            });
            newRow.insertCell(fields.length).appendChild(deleteButton);
        }
    });
}

function filterItems(items, searchText) {
    const search = searchText.trim().toLowerCase();
    return items.filter(function (item) {
        return Object.values(item).join(" ").toLowerCase().includes(search);
    });
}

// ---------- Rendering ----------
function renderPatients() {
    const searchText = document.getElementById("patientSearch").value;
    fillTable("patientTableBody", filterItems(hospitalData.patients, searchText),
        ["name", "age", "gender", "contact"], 5, "patients");
}

function renderDoctors() {
    const searchText = document.getElementById("doctorSearch").value;
    fillTable("doctorTableBody", filterItems(hospitalData.doctors, searchText),
        ["name", "specialization", "contact"], 4, "doctors");
}

function sortedAppointments() {
    return hospitalData.appointments.slice().sort(function (a, b) {
        return (a.date + a.time).localeCompare(b.date + b.time);
    });
}

function renderAppointments() {
    fillTable("appointmentTableBody", sortedAppointments(),
        ["patient", "doctor", "date", "time"], 5, "appointments");

    const today = new Date().toISOString().slice(0, 10);
    const upcoming = sortedAppointments()
        .filter(function (appointment) { return appointment.date >= today; })
        .slice(0, 5);
    fillTable("upcomingTableBody", upcoming, ["patient", "doctor", "date", "time"], 4);
}

// Keep the appointment dropdowns in sync with registered patients and doctors
function fillSelect(selectId, names, placeholder) {
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    select.add(new Option(names.length ? placeholder : "None registered yet", ""));
    names.forEach(function (name) {
        select.add(new Option(name, name));
    });
}

function renderDropdowns() {
    fillSelect("appointmentPatient", hospitalData.patients.map(function (p) { return p.name; }), "Select patient");
    fillSelect("appointmentDoctor", hospitalData.doctors.map(function (d) { return d.name; }), "Select doctor");
}

function renderStats() {
    document.getElementById("patientCount").textContent = hospitalData.patients.length;
    document.getElementById("doctorCount").textContent = hospitalData.doctors.length;
    document.getElementById("appointmentCount").textContent = hospitalData.appointments.length;

    const today = new Date().toISOString().slice(0, 10);
    document.getElementById("todayCount").textContent = hospitalData.appointments.filter(function (appointment) {
        return appointment.date === today;
    }).length;
}

function renderAll() {
    renderPatients();
    renderDoctors();
    renderAppointments();
    renderDropdowns();
    renderStats();
}

// ---------- Patient form ----------
document.getElementById("patientForm").addEventListener("submit", function (event) {
    event.preventDefault();

    hospitalData.patients.push({
        name: document.getElementById("patientName").value.trim(),
        age: document.getElementById("patientAge").value,
        gender: document.getElementById("patientGender").value,
        contact: document.getElementById("patientContact").value.trim()
    });

    saveData();
    renderAll();
    event.target.reset();
    showToast("Patient registered.");
});

// ---------- Doctor form ----------
document.getElementById("doctorForm").addEventListener("submit", function (event) {
    event.preventDefault();

    hospitalData.doctors.push({
        name: document.getElementById("doctorName").value.trim(),
        specialization: document.getElementById("doctorSpecialization").value.trim(),
        contact: document.getElementById("doctorContact").value.trim()
    });

    saveData();
    renderAll();
    event.target.reset();
    showToast("Doctor added.");
});

// ---------- Appointment form ----------
document.getElementById("appointmentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const newAppointment = {
        patient: document.getElementById("appointmentPatient").value,
        doctor: document.getElementById("appointmentDoctor").value,
        date: document.getElementById("appointmentDate").value,
        time: document.getElementById("appointmentTime").value
    };

    // Stop double booking: one doctor, one slot
    const isTaken = hospitalData.appointments.some(function (appointment) {
        return appointment.doctor === newAppointment.doctor &&
            appointment.date === newAppointment.date &&
            appointment.time === newAppointment.time;
    });

    if (isTaken) {
        showToast("This doctor already has an appointment at that time.", true);
        return;
    }

    hospitalData.appointments.push(newAppointment);
    saveData();
    renderAll();
    event.target.reset();
    showToast("Appointment booked.");
});

// ---------- Search boxes ----------
document.getElementById("patientSearch").addEventListener("input", renderPatients);
document.getElementById("doctorSearch").addEventListener("input", renderDoctors);

// ---------- Welcome banner and sample data ----------
document.getElementById("todayText").textContent = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
});

document.getElementById("sampleBtn").addEventListener("click", function () {
    const today = new Date().toISOString().slice(0, 10);
    hospitalData.patients.push(
        { name: "Ayesha Khan", age: "29", gender: "Female", contact: "0300 1234567" },
        { name: "Ali Raza", age: "41", gender: "Male", contact: "0321 7654321" },
        { name: "Fatima Noor", age: "8", gender: "Female", contact: "0333 9876543" }
    );
    hospitalData.doctors.push(
        { name: "Dr. Sara Malik", specialization: "Cardiology", contact: "0345 1112233" },
        { name: "Dr. Hamza Tariq", specialization: "Pediatrics", contact: "0312 4445566" }
    );
    hospitalData.appointments.push(
        { patient: "Ayesha Khan", doctor: "Dr. Sara Malik", date: today, time: "10:30" },
        { patient: "Fatima Noor", doctor: "Dr. Hamza Tariq", date: today, time: "12:00" }
    );
    saveData();
    renderAll();
    showToast("Sample data loaded.");
});

// ---------- Start ----------
renderAll();