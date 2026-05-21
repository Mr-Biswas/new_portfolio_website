/* =========================
   MOBILE MENU TOGGLE
========================= */

const hamburger =
document.querySelector(".hamburger");

const navLinks =
document.querySelector(".nav-links");

/* Toggle Menu */

hamburger.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});

/* =========================
   GOOGLE APPS SCRIPT API
========================= */

const apiURL =
"https://script.google.com/macros/s/AKfycbzK7k-sIoL8LyNOAz_hyg1u9kbTRyrLhcizWZxs8mPwgvLVFNr7n8GMzP86WmR-oa_H/exec";

/* =========================
   STORE LEARNING DATA
========================= */

let learningItems = [];

/* =========================
   RENDER LEARNING CARDS
========================= */

function renderLearningCards(data){

    const learningGrid =
    document.getElementById("learningGrid");

    // Clear Existing Cards
    learningGrid.innerHTML = "";

    // Loop Through Data
    data.forEach(item => {

        const card = `

            <div class="learning-card">

                <div class="learning-icon">
                    ${item.icon}
                </div>

                <h3>
                    ${item.title}
                </h3>

                <p>
                    ${item.description}
                </p>

            </div>

        `;

        // Add Card
        learningGrid.innerHTML += card;

    });

}

/* =========================
   FETCH LEARNING DATA
========================= */

async function fetchLearningData(){

    try{

        const response =
        await fetch(
            apiURL + "?sheet=learning_data"
        );

        const data =
        await response.json();

        // Store Data
        learningItems = data;

        // Render Cards
        renderLearningCards(learningItems);

    }

    catch(error){

        console.log(
            "Error Fetching Data:",
            error
        );

    }

}

/* =========================
   SEARCH FUNCTIONALITY
========================= */

const searchInput =
document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    const searchText =
    searchInput.value.toLowerCase();

    // Filter Data
    const filteredData =
    learningItems.filter(item => {

        return (

            item.title
            .toLowerCase()
            .includes(searchText)

            ||

            item.description
            .toLowerCase()
            .includes(searchText)

        );

    });

    // Render Filtered Cards
    renderLearningCards(filteredData);

});

/* =========================
   LOAD LEARNING DATA
========================= */

fetchLearningData();

/* =========================
   CONTACT FORM SUBMISSION
========================= */

const contactForm =
document.getElementById("contactForm");

/* Submit Form */

contactForm.addEventListener("submit",

async function(e){

    // Prevent Refresh
    e.preventDefault();

    // Get Values
    const name =
    document.getElementById("name").value;

    const email =
    document.getElementById("email").value;

    const message =
    document.getElementById("message").value;

    // Create Form Data
    const formData = new FormData();
    formData.append(
        "type",
        "contact"
    );

    formData.append("name", name);

    formData.append("email", email);

    formData.append("message", message);

    try{

        // Send Data
        await fetch(apiURL, {

            method: "POST",

            body: formData,

            mode: "no-cors"

        });

        // Success Message
        alert(
            "Thank you for reaching out!\n\nPlease wait till the end of the day for a response."
        );

        // Reset Form
        contactForm.reset();

    }

    catch(error){

        console.log(
            "Submission Error:",
            error
        );

        alert(
            "Something went wrong!"
        );

    }

    });
/* =========================
   CHATBOT TOGGLE
========================= */

const chatbotToggle =
document.getElementById("chatbotToggle");

const chatbox =
document.getElementById("chatbox");

const closeChat =
document.getElementById("closeChat");

/* Open Chat */

chatbotToggle.addEventListener("click", () => {

    chatbox.classList.add("active");

});

/* Close Chat */

closeChat.addEventListener("click", () => {

    chatbox.classList.remove("active");

});

/* =========================
   CHATBOT LOGIC
========================= */

const chatInput =
document.getElementById("chatInput");

const sendBtn =
document.getElementById("sendBtn");

const chatMessages =
document.getElementById("chatMessages");

/* Chatbot API */

const chatbotAPI =
apiURL + "?sheet=chatbot_data";

/* Store Responses */

let chatbotResponses = [];
let chatbotLoaded = false;

/* =========================
   FETCH CHATBOT DATA
========================= */

async function fetchChatbotData(){

    try{

        const response =
        await fetch(chatbotAPI);

        const data =
        await response.json();

        chatbotResponses = data;
        chatbotLoaded = true;

        console.log(
            "Chatbot Loaded:",
            chatbotResponses
        );

    }

    catch(error){

        console.log(
            "Chatbot Fetch Error:",
            error
        );

    }

}

/* =========================
   ADD MESSAGE
========================= */

function addMessage(message, className){

    const messageDiv =
    document.createElement("div");

    messageDiv.classList.add(className);

    messageDiv.innerHTML = message;

    chatMessages.appendChild(messageDiv);

    // Auto Scroll
    chatMessages.scrollTop =
    chatMessages.scrollHeight;

}


/* =========================
   GENERATE BOT REPLY
========================= */

function generateBotReply(userText){

    const text =
    userText.toLowerCase().trim();

    // Loop Responses
    for(let i = 0; i < chatbotResponses.length; i++){

        const keyword =
        chatbotResponses[i]
        .keyword
        .toLowerCase()
        .trim();

        // Match Keyword
        if(text.includes(keyword)){

            return chatbotResponses[i]
            .response;

        }

    }

    // If No Keyword Matches
    return "UNKNOWN_REQUEST";

}

/* =========================
   STORE CHATBOT LOGS
========================= */

async function storeChatbotLog(
    userMessage,
    botReply
){

    const formData =
    new FormData();

    formData.append(
        "type",
        "chatbot"
    );

    formData.append(
        "user_message",
        userMessage
    );

    formData.append(
        "bot_reply",
        botReply
    );

    try{

        await fetch(apiURL, {

            method: "POST",

            body: formData,

            mode: "no-cors"

        });

        console.log(
            "Chatbot Log Stored"
        );

    }

    catch(error){

        console.log(
            "Chatbot Log Error:",
            error
        );

    }

}

/* =========================
   SEND MESSAGE
========================= */

function sendMessage(){

    const userText =
    chatInput.value.trim();

    // Empty Check
    if(userText === "") return;

    // Chatbot Loading Check
    if(!chatbotLoaded){

        addMessage(
            "Please wait a moment... Assistant is loading.",
            "bot-message"
        );

        return;

    }

    // Add User Message
    addMessage(
        userText,
        "user-message"
    );

    // Generate Reply
    const botReply =
    generateBotReply(userText);

    // Clear Input
    chatInput.value = "";

    // If Unknown Question
    if(botReply === "UNKNOWN_REQUEST"){

        addMessage(
            "Let me check that for you...",
            "bot-message"
        );

        setTimeout(() => {

            const finalReply =
            `
            I am really sorry I am unable to process your request,
            kindly fill the contact form to know more.<br><br>

            You can also try asking about:
            <br>
            • skills
            <br>
            • automation
            <br>
            • projects
            <br>
            • experience
            <br>
            • python
            `;

            addMessage(
                finalReply,
                "bot-message"
            );

            storeChatbotLog(
                userText,
                finalReply
            );

        }, 10000);

    }

    // If Known Question
    else{

        setTimeout(() => {

            addMessage(
                botReply,
                "bot-message"
            );

            storeChatbotLog(
                userText,
                botReply
            );

        }, 600);

    }

}

    // Clear Input
    chatInput.value = "";


/* =========================
   BUTTON CLICK
========================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);

/* =========================
   ENTER KEY SUPPORT
========================= */

chatInput.addEventListener(
    "keypress",
    function(e){

        if(e.key === "Enter"){

            sendMessage();

        }

    }
);

/* =========================
   LOAD CHATBOT DATA
========================= */

fetchChatbotData();

/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
document.querySelectorAll(".reveal");

/* Reveal Function */

function revealOnScroll(){

    revealElements.forEach(element => {

        const windowHeight =
        window.innerHeight;

        const revealTop =
        element.getBoundingClientRect().top;

        const revealPoint = 120;

        // Add Active Class
        if(revealTop < windowHeight - revealPoint){

            element.classList.add("active");

        }

    });

}

/* Scroll Event */

window.addEventListener(
    "scroll",
    revealOnScroll
);

/* Initial Load */

revealOnScroll();

/* =========================
   STORE CHATBOT LOGS
========================= */

async function storeChatbotLog(
    userMessage,
    botReply
){

    // Create Form Data
    const formData =
    new FormData();

    formData.append(
        "type",
        "chatbot"
    );

    formData.append(
        "user_message",
        userMessage
    );

    formData.append(
        "bot_reply",
        botReply
    );

    try{

        // Send To Backend
        await fetch(apiURL, {

            method: "POST",

            body: formData,

            mode: "no-cors"

        });

        console.log(
            "Chatbot Log Stored"
        );

    }

    catch(error){

        console.log(
            "Chatbot Log Error:",
            error
        );

    }

}