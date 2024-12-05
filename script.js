// Get references to DOM elements
const colorPicker = document.getElementById('colorPicker');
const addColorButton = document.getElementById('addColorButton');
const palette = document.getElementById('palette');

// Event listener for adding colors
addColorButton.addEventListener('click', addColorToPalette);

// Load palette from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadPalette);

// Function to add selected color to the palette
function addColorToPalette() {
    const colorValue = colorPicker.value;
    createColorDiv(colorValue);
    savePalette();
}

// Function to create a color div
function createColorDiv(color) {
    // Create a container for the color div and the RGB label
    const colorContainer = document.createElement('div');
    colorContainer.classList.add('color-container');

    // Create the color div
    const colorDiv = document.createElement('div');
    colorDiv.classList.add('palette-color');
    colorDiv.style.backgroundColor = color;

    // Store the hex color as a data attribute
    colorDiv.dataset.hexColor = color;

    // Create the hex label and append it inside the color div
    const hexLabel = document.createElement('span');
    hexLabel.classList.add('hex-label');
    hexLabel.innerText = color.toUpperCase();
    colorDiv.appendChild(hexLabel);

    // **Create a delete button**
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '&times;'; // Using the × symbol
    colorDiv.appendChild(deleteButton);

    // Append the color div to the container
    colorContainer.appendChild(colorDiv);

    // Convert hex color to RGB
    const rgbColor = hexToRGB(color);

    // Create and append the RGB label below the color div
    const rgbLabel = document.createElement('span');
    rgbLabel.classList.add('rgb-label');
    rgbLabel.innerText = rgbColor;
    colorContainer.appendChild(rgbLabel);

    // Event listener for copying color code (on colorDiv)
    colorDiv.addEventListener('click', (e) => {
        // Prevent copying if delete button was clicked
        if (e.target !== deleteButton) {
            navigator.clipboard.writeText(color).then(() => {
                alert(`Copied ${color} to clipboard`);
            });
        }
    });

    // **Event listener for deleting the color**
    deleteButton.addEventListener('click', (e) => {
        // Prevent the event from bubbling up to the colorDiv
        e.stopPropagation();
        palette.removeChild(colorContainer);
        savePalette(); // Update localStorage after deletion
    });

    // Append the container to the palette
    palette.appendChild(colorContainer);
}
// Function to convert hex color to RGB
function hexToRGB(hex) {
    // Remove '#' if present
    hex = hex.replace('#', '');

    // Parse r, g, b values
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `RGB(${r}, ${g}, ${b})`;
}

// Function to save the palette to localStorage
function savePalette() {
    const colors = Array.from(palette.children).map(container => {
        const colorDiv = container.querySelector('.palette-color');
        return colorDiv.dataset.hexColor;
    });
    localStorage.setItem('paletteColors', JSON.stringify(colors));
}

// Function to load the palette from localStorage
function loadPalette() {
    const colors = JSON.parse(localStorage.getItem('paletteColors')) || [];
    colors.forEach(color => createColorDiv(color));
}

deleteButton.setAttribute('aria-label', 'Delete Color');
deleteButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this color?')) {
        palette.removeChild(colorContainer);
        savePalette();
    }
});