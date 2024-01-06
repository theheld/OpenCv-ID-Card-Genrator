let frontLabelGenerated = false; // Flag to track front label generation
let backLabelGenerated = false; // Flag to track back label generation

// Load OpenCV
let cv;
const Module = {
    onRuntimeInitialized: () => {
        cv = Module;
        console.log('OpenCV Module Loaded successfully.');
        // Unhide the download button when OpenCV is loaded
        document.getElementById('Print').style.display = 'inline';
    }
};

// allows to toast messages 
function snackbar(message) {
    var x = document.getElementById("snackbar");
    x.textContent = message;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function saveCanvasAsImage(canvas, fileName) {
    // Convert canvas to data URL
    const dataURL = canvas.toDataURL('image/jpeg');
    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = fileName;
    // Trigger the download
    link.click();
    snackbar("ID Card Genrated");
}

// Pick image
function selectImage() {
    document.getElementById('fileInput').click();
}

// Display image
function displaySelectedImage(event) {
    const selectedFile = event.target.files[0];
    const imageElement = document.querySelector('.Pick_Image');
    if (selectedFile && selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageElement.src = e.target.result;
            imageElement.style.width = '45px'; // Set a fixed width (change as needed)
            imageElement.style.height = '45px'; // Set a fixed height (change as needed)
            imageElement.style.objectFit = 'cover'; // Maintain aspect ratio and cover the container
        };
        reader.readAsDataURL(selectedFile);
    } else {
        snackbar('Please select an image file.');
    }
}

// open CV Front ID Card
function addTextAndOverlayToFrontImage(name, empCode, overlaySrc) {
    const overlayY = 240; // Y-coordinate for overlay image
    const overlayWidth = 280; // Width of overlay image container
    const overlayHeight = 320; // Height of overlay image container
    const frontImg = new Image();
    frontImg.crossOrigin = "Anonymous"; // Enable CORS for the image
    frontImg.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = frontImg.width;
        canvas.height = frontImg.height;
        // Draw the front image onto the canvas
        ctx.drawImage(frontImg, 0, 0);
        // Load the overlay image
        const overlayImg = new Image();
        overlayImg.crossOrigin = "Anonymous"; // Enable CORS for the image
        overlayImg.onload = () => {
            const aspectRatio = overlayImg.width / overlayImg.height;
            let overlayWidthActual = overlayWidth;
            let overlayHeightActual = overlayWidthActual / aspectRatio;
            if (overlayHeightActual > overlayHeight) {
                overlayHeightActual = overlayHeight;
                overlayWidthActual = overlayHeightActual * aspectRatio;
            }
            const overlayX = (canvas.width - overlayWidthActual) / 2;
            const overlayYActual = overlayY + (overlayHeight - overlayHeightActual) / 2;
            ctx.drawImage(overlayImg, overlayX, overlayYActual, overlayWidthActual, overlayHeightActual);
            // Add text (name and employee code) to the front image
            ctx.font = '35.2px Arial'; // Set font size and style
            ctx.fillStyle = 'black'; // Set text color
            ctx.fontWeight = 'normal';
            // Position and add name text
            // Get the width of the text
            const nameTextWidth = ctx.measureText(`Name: ${name}`).width;
            const empCodeTextWidth = ctx.measureText(`Employee Code: ${empCode}`).width;
            // Calculate horizontal position for center alignment
            const centerX = (canvas.width - Math.max(nameTextWidth, empCodeTextWidth)) / 2;
            // Position and add name text
            ctx.fillText(`Name: ${name}`, centerX, 600);
            // Position and add employee code text
            ctx.fillText(`Employee Code: ${empCode}`, centerX, 640);
            // Check if front label hasn't been generated yet
            if (!frontLabelGenerated) {
                frontLabelGenerated = true; // Set flag to true to avoid repeated downloads
                // Save the canvas as an image with front label
                saveCanvasAsImage(canvas, 'front_label.jpg');
            }
        };
        overlayImg.src = overlaySrc; // Pass the overlay image source dynamically
    };
    frontImg.src = '/templates/Front.jpeg'; // Replace with your front image path
}

// OpenCv Back ID Card
function addTextToBackImage(emergencyContact, bloodGroup) {
    const backImg = new Image();
    backImg.crossOrigin = "Anonymous"; // Enable CORS for the image
    backImg.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = backImg.width;
        canvas.height = backImg.height;
        // Draw the back image onto the canvas
        ctx.drawImage(backImg, 0, 0);
        // Add text (emergency contact and blood group) to the back image
        ctx.font = '35.2px Arial'; // Set font size and style
        ctx.fillStyle = 'black'; // Set text color
        ctx.fontWeight = 'normal';
        // Position and add emergency contact text
        ctx.fillText(emergencyContact, 360, 90);
        // Position and add blood group text
        ctx.fillText(bloodGroup, 360, 135);
        // You can further process or export this canvas as needed.
        if (!backLabelGenerated) {
            backLabelGenerated = true; // Set flag to true to avoid repeated downloads
            saveCanvasAsImage(canvas, 'Back_ID.jpg');
        }
    };
    backImg.src = '/templates/back.jpeg'; // Replace with your back image path
}


function validateFields() {
    const nameInput = document.getElementById('name').value.trim();
    const empCodeInput = document.getElementById('emp_code').value.trim();
    const emergencyContactInput = document.getElementById('emergency_contact').value.trim();
    const bloodGroupInput = document.getElementById('blood_group').value;
    const selectedImage = document.getElementById('fileInput').files[0]; // Get selected image file

    // Define error messages
    const errorMessages = {
        name: 'Please enter a name using only alphabetic characters and spaces.',
        empCode: 'EMP Code should be exactly 6 digits.',
        emergencyContact: 'Emergency Contact should be exactly 10 digits.',
        bloodGroup: 'Please select a blood group.',
        image: 'Please select an image file.',
        allFieldsEmpty: 'All fields are empty. Please fill in the details.'
    };

    // Check for errors
    const errors = [];
    if (nameInput === '') errors.push(errorMessages.name);
    if (empCodeInput.length !== 6) errors.push(errorMessages.empCode);
    if (emergencyContactInput.length !== 10) errors.push(errorMessages.emergencyContact);
    if (bloodGroupInput === '') errors.push(errorMessages.bloodGroup);
    if (!selectedImage) errors.push(errorMessages.image); // Validate if an image is selected

    // Check if all fields are empty
    const allFieldsEmpty = [nameInput, empCodeInput, emergencyContactInput, bloodGroupInput].every(field => field === '');
    if (allFieldsEmpty) {
        snackbar(errorMessages.allFieldsEmpty);
        return false;
    }

    // Display errors using snackbar
    if (errors.length > 0) {
        snackbar(errors.join(' '));
        return false;
    }
    return true;
}

// Function to clear all form fields and display "Cleared" message
function clearFields() {
    document.getElementById('name').value = ''; // Clear name field
    document.getElementById('emp_code').value = ''; // Clear EMP code field
    document.getElementById('emergency_contact').value = ''; // Clear emergency contact field
    document.getElementById('blood_group').value = ''; // Reset blood group selection to default
    document.querySelector('.Pick_Image').src = '/icons/square-fill.svg'; // Reset image source to default
    // Display "Cleared" snackbar message
    frontLabelGenerated = false;
    backLabelGenerated = false;
    snackbar('Cleared');
}

async function makingIdCard(name, empCode, emergencyContact, bloodGroup, imagePath) {
    console.log("Name:", name);
    console.log("Employee Code:", empCode);
    console.log("Emergency Contact:", emergencyContact);
    console.log("Blood Group:", bloodGroup);
    console.log("Selected Image Path:", imagePath);
    console.log(imagePath);
    addTextAndOverlayToFrontImage(name, empCode, imagePath);
    addTextToBackImage(emergencyContact, bloodGroup);
}

// test function 
function getImageDimensions(selectedImage) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgElement = document.createElement('img');
            imgElement.onload = function () {
                const mat = cv.imread(imgElement);
                if (!mat.empty()) {
                    const dimensions = { width: mat.cols, height: mat.rows };
                    mat.delete(); // Release memory
                    resolve(dimensions);
                } else {
                    reject(new Error('Failed to read the image'));
                }
            };
            imgElement.src = e.target.result;
        };
        reader.readAsDataURL(selectedImage);
    });
}

document.getElementById("Print").addEventListener("click", function () {
    console.log("Print Page");
    window.location.href = "print.html";
});

// Get references to the input fields
const empCodeInput = document.getElementById('emp_code');
const emergencyContactInput = document.getElementById('emergency_contact');

// Allow only numbers for EMP Code input
empCodeInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 6); // Allow only numbers and limit to 6 characters
});

// Allow only numbers for Emergency Contact input and limit to 10 characters
emergencyContactInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 10); // Allow only numbers and limit to 10 characters
});

// Allow only alphabetic characters in the input field and limit to 120 charcters 
var inputField = document.getElementById("name");
// Regex pattern to match only alphabetic characters and space
var pattern = /^[A-Za-z\s]+$/;
inputField.addEventListener("input", function (event) {
    var inputValue = event.data || inputField.value;
    if (!pattern.test(inputValue)) {
        inputField.value = inputField.value.replace(/[^A-Za-z\s]/g, '');
    }
});

// Event listener for the preview button click
document.getElementById('previewButton').addEventListener('click', async function () {
    // Validate fields before generating the preview
    const isValid = validateFields();
    if (isValid) {
        // Assuming you have references to the form fields and the selected image
        const name = document.getElementById('name').value.trim();
        const empCode = document.getElementById('emp_code').value.trim();
        const emergencyContact = document.getElementById('emergency_contact').value.trim();
        const bloodGroup = document.getElementById('blood_group').value;
        const selectedImage = document.getElementById('fileInput').files[0];
        const imagePath = URL.createObjectURL(selectedImage); // Get the image path
        try {
            const imageDimensions = await getImageDimensions(selectedImage);
            console.log("Image Dimensions:", imageDimensions);
            // Call the makingIdCard function and pass the collected data and image path
            makingIdCard(name, empCode, emergencyContact, bloodGroup, imagePath);
        } catch (error) {
            console.error("Error obtaining image dimensions:", error);
            snackbar("Error obtaining image dimensions");
            // Handle errors while obtaining image dimensions
        }
    }
});

// Event listener for the reset button click
document.getElementById('resetButton').addEventListener('click', function () {
    clearFields(); // Call the function to clear fields and display message
});



