// Load OpenCV (if required)
let cv;
const Module = {
    onRuntimeInitialized: () => {
        cv = Module;
        console.log('OpenCV Module Loaded successfully.');
    }
};

function snackbar(message) {
    var x = document.getElementById("snackbar");
    x.textContent = message;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

// Check if the DOM is fully loaded
// Function to open file picker
function selectImage(cardId) {
    var fileInput = document.getElementById(`fileInput${cardId}`);
    if (fileInput) {
        fileInput.click();
    }
}

// Function to display selected image on the image view
function displaySelectedImage(inputId, cardId) {
    var input = document.getElementById(inputId);
    var card = document.getElementById(cardId);
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            card.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Add event listeners to the image views
document.getElementById('Card1').addEventListener('click', function () {
    selectImage('Card1');
});

document.getElementById('Card2').addEventListener('click', function () {
    selectImage('Card2');
});

document.getElementById('Print').addEventListener('click', function () {
    var card1Src = document.getElementById('Card1').src;
    var card2Src = document.getElementById('Card2').src;

    // Check if both cards have images
    if ((card1Src && card1Src !== 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') &&
        (card2Src && card2Src !== 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')) {
        snackbar("Both images selected. Printing...");
        // Implement your printing logic here
    } else if (!card1Src || card1Src === 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
        snackbar("Card 1 image is missing.");
    } else if (!card2Src || card2Src === 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
        snackbar("Card 2 image is missing.");
    } else {
        snackbar("No images selected.");
    }
});

// OpenCv Operations
// Roate the overlay images 
// Overlay the picked images on a print template file