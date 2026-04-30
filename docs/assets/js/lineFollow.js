// Function to get accurate mouse coordinates within the SVG's viewBox
function getMousePositionInSVG(event) {

  const rect = svg.getBoundingClientRect();
  
  const clientX = event.clientX - rect.left;
  const clientY = event.clientY - rect.top;
  
  const rectToViewBox_width = svg.viewBox.baseVal.width / rect.width;
  const rectToViewBox_height = svg.viewBox.baseVal.height / rect.height;

  return {
    x: clientX * rectToViewBox_width, 
    y: clientY * rectToViewBox_height
  };
}

// Function to return theta between 2 points (tan2)
function getTheta(center, position){
    return Math.atan2(position.y - center.y, position.x - center.x) * (180 / Math.PI);
}

// Debounce for svg updates
function debounce(func, wait) {
  let timeout; 

  return function(...args) {
    const context = this; 
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args); 
    }, wait);
  };
}

// Create SVG
function updateSVG() {
    // Namespace
    const svgNS = "http://www.w3.org/2000/svg";

    // Clear all elements
    svg.innerHTML = '';

    // svg.setAttribute('viewBox', `0, 0, 1200, ${1200 * svg.getBoundingClientRect().height / svg.getBoundingClientRect().width}`);
    svg.setAttribute('viewBox', `0, 0, ${1200 * svg.getBoundingClientRect().width / svg.getBoundingClientRect().height}, 1200`);

    const lineLength = 50;
    const lineSpacing = 20;
    const lineTotal = lineLength + lineSpacing;
    const nX = Math.floor((svg.viewBox.baseVal.width - lineSpacing) / lineTotal);
    const nY = Math.floor((svg.viewBox.baseVal.height - lineSpacing) / lineTotal);
    const start = { 
        x: (svg.viewBox.baseVal.width - nX * lineTotal)/2, 
        y: (svg.viewBox.baseVal.height - nY * lineTotal + lineLength)/2
    };

    for (let i = 0; i < nX; i++){
        for (let j = 0; j < nY; j++){
            let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            newLine.setAttribute('x1', `${start.x + i * lineTotal}`);
            newLine.setAttribute('x2', `${start.x + i * lineTotal + lineLength}`);
            newLine.setAttribute('y1', `${start.y + j * lineTotal}`);
            newLine.setAttribute('y2', `${start.y + j * lineTotal}`);
            newLine.classList.add('background_lines');
            svg.appendChild(newLine);
        }
    }

    // 
    lines = document.getElementsByClassName('background_lines');
    linesCenter = [];
    for (const line of lines) {
        linesCenter.push(
            {
                x: (line.x2.baseVal.value + line.x1.baseVal.value) / 2, 
                y: (line.y2.baseVal.value + line.y1.baseVal.value) / 2
            }
        );
    };

    rotateDeg = angles[Math.floor(Math.random() * angles.length)];
    rotateLines({ x: svg.viewBox.baseVal.width / 2, y: svg.viewBox.baseVal.height / 2});
}

function rotateLines(position) {
    for (let i = 0; i < lines.length; i++) {
        const theta = getTheta(linesCenter[i], position);
        lines[i].setAttribute("transform", `rotate(${theta + rotateDeg}, ${linesCenter[i].x}, ${linesCenter[i].y})`);
    };
}

// Main <svg> element
const activeContainer = document.getElementById('landing_container');
const svg = document.getElementById('landing_svg');
let lines = [];
let linesCenter = [];
const angles = [0, 45, 90];
let rotateDeg = 45;

// Inital drawing
window.addEventListener('resize', debounce(updateSVG, 250));
// window.addEventListener('load', updateSVG(svg)); // Initial update after page has loaded
document.addEventListener('DOMContentLoaded', updateSVG(svg));
// updateSVG(svg);

// Event listener for mouse movement over the SVG
activeContainer.addEventListener('mousemove', (event) => {
    const position = getMousePositionInSVG(event);

    rotateLines(position);
});
