document.write('<div class="feedback-container">' +
    '<h1>Feedback</h1><p><a href="index.html">Back to Main</a></p>' +
    '<form id="feedbackForm" class="feedback-form" onsubmit="return sendMail(this);">' +
    '<input type="text" name="name" id="fullname" class="form-control" placeholder="Name" required />' +
    '<input type="email" name="emailaddress" id="emailaddress" class="form-control" placeholder="Email" required />' +
    '<textarea style="width: 100%;" rows="5" name="projectfeedback" id="projectfeedback"' +
    'placeholder="Project Feedback" required></textarea>' +
    '<button type="submit" class="btn btn-secondary">Send Project Request</button>' +
    '</form>' +
    '</div>');

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
                console.log("SUCCESS", response);
                inputFields.reset();
                projectFeedback.html("Thanks for your feedback!!");
            },
            function (error) {
                console.log("FAILED", error);
            });
    return false;
};