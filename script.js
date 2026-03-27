const inquiryForm = document.querySelector("#inquiry-form");

// ✅ Fixed WhatsApp number
const whatsappNumber = "919688879994";

if (inquiryForm) {
  inquiryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values
    let name = document.getElementById("traveller-name").value || "Customer";
    let country = document.getElementById("country").value;
    let service = document.getElementById("service-type").value;
    let custom = document.getElementById("custom-service").value || "";

    // Message format
    let message = `Hi Noor Travels,
Name: ${name}
Destination: ${country}
Service: ${service}
Other: ${custom}`;

    // Open WhatsApp
    let url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  });
}
