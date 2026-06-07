
const svg = document.getElementById('networkCanvas');
const nodes = [];
const maxNodes = 60;
const maxDistance = 150;
const svgNS = "http://www.w3.org/2000/svg";
const nodeClass = "node";

// Create node
function createNode() {
    return {
        x: Math.random() * svg.viewBox.baseVal.width,
        y: Math.random() * svg.viewBox.baseVal.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 3 + 2,
        element: document.createElementNS(svgNS, 'circle')
    };
}

// Initialize Nodes
for (let i = 0; i < maxNodes; i++) {
    const node = createNode();
    node.element.classList.add(nodeClass);
    node.element.setAttribute('r', node.radius);
    svg.appendChild(node.element);
    nodes.push(node);
}

// Animation Loop
function animate() {
    // Clear or update paths
    svg.innerHTML = '';

    const canvasWidth = svg.viewBox.baseVal.width;
    const canvasHeight = svg.viewBox.baseVal.height;
    
    // Re-append nodes so lines draw behind them
    nodes.forEach(node => {
        svg.appendChild(node.element);
    });

    // Update Node Positions
    nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvasWidth) node.vx *= -1;
        if (node.y < 0 || node.y > canvasHeight) node.vy *= -1;

        // Update DOM element position
        node.element.setAttribute('cx', node.x);
        node.element.setAttribute('cy', node.y);
    });

    // Draw Network Lines
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const line = document.createElementNS(svgNS, 'line');
                line.setAttribute('x1', nodes[i].x);
                line.setAttribute('y1', nodes[i].y);
                line.setAttribute('x2', nodes[j].x);
                line.setAttribute('y2', nodes[j].y);
                line.classList.add(nodeClass);
                line.setAttribute('stroke-width', (1 - distance / maxDistance) * 1.5);
                line.setAttribute('stroke-opacity', (1 - distance / maxDistance) * 0.6);
                
                // Insert lines before the circles
                svg.insertBefore(line, svg.firstChild);
            }
        }
    }

    requestAnimationFrame(animate);
}

// Start Animation
animate();