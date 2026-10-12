const patientForm = document.getElementById("patientForm");
const registrationMessage = document.getElementById("registrationMessage");

patientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const patientName = document.getElementById("patientName").value;
    const patientAge = document.getElementById("patientAge").value;
    const patientGender = document.getElementById("patientGender").value;
    const patientContact = document.getElementById("patientContact").value;

    if (
        patientName === "" ||
        patientAge === "" ||
        patientGender === "" ||
        patientContact === ""
    ) {
        registrationMessage.textContent = "Please fill in all fields.";
        return;
    }

   registrationMessage.textContent =
    "Patient registered successfully!";

const tableBody = document.getElementById("patientTableBody");
const newRow = tableBody.insertRow();

newRow.insertCell(0).textContent = patientName;
newRow.insertCell(1).textContent = patientAge;
newRow.insertCell(2).textContent = patientGender;
newRow.insertCell(3).textContent = patientContact;

patientForm.reset();
});
const doctorForm = document.getElementById("doctorForm");
const doctorMessage = document.getElementById("doctorMessage");

doctorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const doctorName = document.getElementById("doctorName").value;
    const doctorSpecialization =
        document.getElementById("doctorSpecialization").value;
    const doctorContact =
        document.getElementById("doctorContact").value;

    if (
        doctorName === "" ||
        doctorSpecialization === "" ||
        doctorContact === ""
    ) {
        doctorMessage.textContent = "Please fill in all doctor fields.";
        return;
    }

    doctorMessage.textContent =
        "Doctor added successfully!";

    doctorForm.reset();
});
const appointmentForm = document.getElementById("appointmentForm");
const appointmentMessage = document.getElementById("appointmentMessage");

appointmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const patientName =
        document.getElementById("appointmentPatient").value;

    const doctorName =
        document.getElementById("appointmentDoctor").value;

    const appointmentDate =
        document.getElementById("appointmentDate").value;

    const appointmentTime =
        document.getElementById("appointmentTime").value;

    if (
        patientName === "" ||
        doctorName === "" ||
        appointmentDate === "" ||
        appointmentTime === ""
    ) {
        appointmentMessage.textContent =
            "Please fill in all appointment fields.";
        return;
    }

    const tableBody =
        document.getElementById("appointmentTableBody");

    const newRow = tableBody.insertRow();

    newRow.insertCell(0).textContent = patientName;
    newRow.insertCell(1).textContent = doctorName;
    newRow.insertCell(2).textContent = appointmentDate;
    newRow.insertCell(3).textContent = appointmentTime;

    appointmentMessage.textContent =
        "Appointment added successfully!";

    appointmentForm.reset();
});