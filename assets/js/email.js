console.log("Hello visitors");

function sendMail(contactForm) {
    emailjs.send("service_586avpl", "template_6mnw53q", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "project_feedback": contactForm.projectfeedback.value
    })
        .then(
            function (response) {
                console.log("SUCCESS", response);
            },
            function (error) {
                console.log("FAILED", error);
            });
    return false;
};