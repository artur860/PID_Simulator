let animationFrame;
let pvHistory = [];
let setpoint;
let kp, ki, kd;

function startSimulation() {
    kp = parseFloat(document.getElementById('kp').value);
    ki = parseFloat(document.getElementById('ki').value);
    kd = parseFloat(document.getElementById('kd').value);
    setpoint = parseFloat(document.getElementById('setpoint').value);

    pvHistory = [];
    cancelAnimationFrame(animationFrame);
    simulatePID();
}

function updateSetpointValue() {
    setpoint = parseFloat(document.getElementById('setpoint').value);
    document.getElementById('setpoint-value').textContent = setpoint;
}

function simulatePID() {
    const canvas = document.getElementById('pid-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const width = canvas.width;
    const height = canvas.height;

    const timeStep = 0.1;
    const maxSteps = width;

    let pv = 0;
    let integral = 0;
    let previousError = setpoint - pv;
    let step = 0;

    function draw() {
        const error = setpoint - pv;
        integral += error * timeStep;
        const derivative = (error - previousError) / timeStep;

        const output = kp * error + ki * integral + kd * derivative;

        pv += output * timeStep;
        if (pvHistory.length >= maxSteps) {
            pvHistory.shift();
        }
        pvHistory.push(pv);

        previousError = error;

        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.moveTo(0, height / 2 - pvHistory[0]);

        for (let i = 1; i < pvHistory.length; i++) {
            ctx.lineTo(i, height / 2 - pvHistory[i]);
        }

        ctx.strokeStyle = 'blue';
        ctx.stroke();

        // Draw setpoint line
        ctx.beginPath();
        ctx.moveTo(0, height / 2 - setpoint);
        ctx.lineTo(width, height / 2 - setpoint);
        ctx.strokeStyle = 'red';
        ctx.stroke();

        // Draw current value
        ctx.fillStyle = 'black';
        ctx.fillText(`Current PV: ${pv.toFixed(2)}`, 10, 20);
        ctx.fillText(`Setpoint: ${setpoint}`, 10, 40);

        step++;
        animationFrame = requestAnimationFrame(draw);
    }

    draw();
}

window.addEventListener('resize', () => {
    const canvas = document.getElementById('pid-canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});