let inputFields = document.getElementById("feedbackForm");
let projectFeedback = document.getElementById("projectfeedback");

function sendMail(contactForm) {
    emailjs.send("service_ek6rze1", "template_b6jn9i1", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "project_feedback": contactForm.projectfeedback.value
    })
        .then(
            function (response) {
                successMessage();
                console.log("SUCCESS", response);
            },
            function (error) {
                inputFields.reset();
                console.log("FAILED", error);
            });
    return false;
};

function successMessage () {
    console.log("it's doing something");
    $("#feedbackContainer").html('<h1>Thanks For the feedback!!</h1><a href="index.html" class="main-link">Back to Main</a>');
}
