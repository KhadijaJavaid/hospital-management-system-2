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