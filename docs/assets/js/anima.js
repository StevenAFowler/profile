// Function to get accurate mouse coordinates within the SVG's viewBox
function getMousePositionInSVG(event, svgName) {

  const rect = svgName.getBoundingClientRect();
  
  const clientX = event.clientX - rect.left;
  const clientY = event.clientY - rect.top;
  
  const rectToViewBox_width = svgName.viewBox.baseVal.width / rect.width;
  const rectToViewBox_height = svgName.viewBox.baseVal.height / rect.height;

  return {
    x: clientX * rectToViewBox_width, 
    y: clientY * rectToViewBox_height
  };
}

// Function to return theta between 2 points (tan2)
function getTheta(center, position){
    return Math.atan2(position.y - center.y, position.x - center.x) * (180 / Math.PI);
}

// Create SVG
function updateSVG(svgName, lines, linesCenter, lineClsName, deg) {
    // console.log("running updateSVG");
    // console.log(svgName)
    // console.log(lines)
    // console.log(linesCenter)
    // console.log(lineClsName)
    // Namespace
    const svgNS = "http://www.w3.org/2000/svg";

    // Clear all elements
    svgName.innerHTML = '';

    
    svgName.setAttribute('viewBox', `0, 0, ${1200 * svgName.getBoundingClientRect().width / svgName.getBoundingClientRect().height}, 1200`);

    const lineLength = 50;
    const lineSpacing = 20;
    const lineTotal = lineLength + lineSpacing;
    const nX = Math.floor((svgName.viewBox.baseVal.width - lineSpacing) / lineTotal);
    const nY = Math.floor((svgName.viewBox.baseVal.height - lineSpacing) / lineTotal);
    const start = { 
        x: (svgName.viewBox.baseVal.width - nX * lineTotal)/2, 
        y: (svgName.viewBox.baseVal.height - nY * lineTotal + lineLength)/2
    };

    for (let i = 0; i < nX; i++){
        for (let j = 0; j < nY; j++){
            let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            newLine.setAttribute('x1', `${start.x + i * lineTotal}`);
            newLine.setAttribute('x2', `${start.x + i * lineTotal + lineLength}`);
            newLine.setAttribute('y1', `${start.y + j * lineTotal}`);
            newLine.setAttribute('y2', `${start.y + j * lineTotal}`);
            newLine.classList.add(lineClsName);
            svgName.appendChild(newLine);
        }
    }

    // 
    lines = document.getElementsByClassName(lineClsName);
    linesCenter = [];
    for (const line of lines) {
        linesCenter.push(
            {
                x: (line.x2.baseVal.value + line.x1.baseVal.value) / 2, 
                y: (line.y2.baseVal.value + line.y1.baseVal.value) / 2
            }
        );
    };

    rotateLines({ x: svgName.viewBox.baseVal.width / 2, y: svgName.viewBox.baseVal.height / 2},
        lines, linesCenter, deg
    );

    return [lines, linesCenter];
}

function rotateLines(position, lines, linesCenter, deg) {
    // console.log("updating rotatelines");

    for (let i = 0; i < lines.length; i++) {
        const theta = getTheta(linesCenter[i], position);
        lines[i].setAttribute("transform", `rotate(${theta + deg}, ${linesCenter[i].x}, ${linesCenter[i].y})`);
    };
}

// Main <svg> element
// console.log("Using anima.js");
const activeContainer1 = document.getElementById('followContainer1');
const svg1 = document.getElementById('followSVG1');
let lines1 = [];
let linesCenter1 = [];
const lineClassName1 = 'lines_01'

const activeContainer2 = document.getElementById('followContainer2');
const svg2 = document.getElementById('followSVG2');
let lines2 = [];
let linesCenter2 = [];
const lineClassName2 = 'lines_02'

const activeContainer3 = document.getElementById('followContainer3');
const svg3 = document.getElementById('followSVG3');
let lines3 = [];
let linesCenter3 = [];
const lineClassName3 = 'lines_03'

// Inital drawing
const rtn1 = updateSVG(svg1, lines1, linesCenter1, lineClassName1, 0)
lines1 = rtn1[0];
linesCenter1 = rtn1[1];

const rtn2 = updateSVG(svg2, lines2, linesCenter2, lineClassName2, 45)
lines2 = rtn2[0];
linesCenter2 = rtn2[1];

const rtn3 = updateSVG(svg3, lines2, linesCenter3, lineClassName3, 90)
lines3 = rtn3[0];
linesCenter3 = rtn3[1];

// Event listener for mouse movement over the SVG
activeContainer1.addEventListener('mousemove', (event) => {
    const position = getMousePositionInSVG(event, svg1);
    // console.log(position);
    rotateLines(position, lines1, linesCenter1, 0);
});
activeContainer2.addEventListener('mousemove', (event) => {
    const position = getMousePositionInSVG(event, svg2);
    // console.log(position);
    rotateLines(position, lines2, linesCenter2, 45);
});
activeContainer3.addEventListener('mousemove', (event) => {
    const position = getMousePositionInSVG(event, svg3);
    // console.log(position);
    rotateLines(position, lines3, linesCenter3, 90);
});

// Set animations stroke lengths
const path_objects = {dog: '.svg_dog', 
                      cir: '.svg_cir', 
                      dow: '.svg_dow',
                      l11: '.svg_l11',
                      l12: '.svg_l12',
                      l21: '.svg_l21',
                      l22: '.svg_l22'}
Object.values(path_objects).forEach(obj => {
    var path = document.querySelector(obj);
    var length = path.getTotalLength();
    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;
    // console.log(obj, ' - ', length);
});

function reset_dog_animation() {
    Object.values(path_objects).forEach(obj => {
        var svg_obj = document.querySelector(obj);
        
        // https://www.kirupa.com/animations/restarting_css_animations.htm
        
        svg_obj.style.animationName = "none";

        requestAnimationFrame(() => {
            setTimeout(() => {
                svg_obj.style.animationName = ""
            }, 0);
        });
    });
}