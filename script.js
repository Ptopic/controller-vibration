let controllers = {};
let haveEvents = 'GamepadEvent' in window;
let isConnected = false;
let isGo = false;

const nonConnectedContainer = document.querySelector('.nonConnected');
const connectedContainer = document.querySelector('.connected');
const controllerName = document.querySelector('.controller');

const heading = document.querySelector('.heading');

const input = document.querySelector('.slider');

// Check every 200 ms to start vibrating again
let interval = window.setInterval(function () {
	if (isGo) {
		let val = input.value;
		vibrate(val);
	}
}, 100);

$(function () {
	$('.slider').on('input change', function () {
		$(this).next($('.text')).html(this.value);
		if (this.value === '0') {
			console.log('stop');
			isGo = !isGo;
			window.clearInterval(interval);
		}
	});
});

// Btn click
function clicked() {
	isGo = !isGo;
	// Check every 200 ms to start vibrating again
	interval = window.setInterval(function () {
		if (isGo) {
			let val = input.value;
			vibrate(val);
		}
	}, 100);

	console.log(isGo);
}

// Btn click1
function clicked1() {
	const activeGamepad = navigator.getGamepads()[0];
	activeGamepad.vibrationActuator.playEffect('dual-rumble', {
		//        5000 je max
		duration: 5000,
		weakMagnitude: 0.2,
		strongMagnitude: 0.2,
	});

	activeGamepad.vibrationActuator.playEffect('dual-rumble', {
		//        5000 je max
		duration: 5000,
		weakMagnitude: 0.5,
		strongMagnitude: 0.5,
	});
}

// // Btn click2
// function clicked2() {
// 	isGo = !isGo;
// 	// Check every 200 ms to start vibrating again
// 	interval = window.setInterval(function () {
// 		if (isGo) {
// 			let val = input.value;
// 			vibrate(val);
// 		}
// 	}, 100);

// 	console.log(isGo);
// }

function vibrate(value) {
	const activeGamepad = navigator.getGamepads()[0];
	activeGamepad.vibrationActuator.playEffect('dual-rumble', {
		//        5000 je max
		duration: 300,
		weakMagnitude: value / 100,
		strongMagnitude: value / 100,
	});
}

function connecthandler(e) {
	// Connect function
	connectController(e.gamepad);
}

function connectController(gamepad) {
	console.log(gamepad);
	controllers[gamepad.index] = gamepad;
	isConnected = !isConnected;

	// Remove styling to show controller vibr controls
	// nonConnectedContainer.classList.toggle('disabled');
	connectedContainer.classList.toggle('disabled');

	// CHange text to controller name
	heading.textContent = gamepad.id;
	// Test for connected
	console.log(isConnected);
}

function disconnecthandler(e) {
	// Disconnect function
	disconnectController(e.gamepad);
}

function disconnectController(gamepad) {
	console.log('Disocnnected');
	delete controllers[gamepad.index];
	// Change is connected to false
	isConnected = !isConnected;
}

function scangamepads() {
	var gamepads = navigator.getGamepads
		? navigator.getGamepads()
		: navigator.webkitGetGamepads
		? navigator.webkitGetGamepads()
		: [];
	for (let i = 0; i < gamepads.length; i++) {
		if (gamepads[i] && gamepads[i].index in controllers) {
			controllers[gamepads[i].index] = gamepads[i];
		}
	}
}

if (haveEvents) {
	window.addEventListener('gamepadconnected', connecthandler);
	window.addEventListener('gamepaddisconnected', disconnecthandler);
} else if (haveWebkitEvents) {
	window.addEventListener('webkitgamepadconnected', connecthandler);
	window.addEventListener('webkitgamepaddisconnected', disconnecthandler);
} else {
	setInterval(scangamepads, 500);
}
