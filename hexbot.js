let canvas;
let ctx;
let appWidth;
let appHeight;

let colors;

function start_app() {
	sizeCanvas();

	let drawSpeed = 30;
	let colorSpeed = 200;
	let ticker = NOOPBOT_TICK_SETUP(draw, drawSpeed);
	let colorTicker = NOOPBOT_TICK_SETUP(addColor, colorSpeed);

	colors = [];

	addColor();
}

function addColor() {
	NOOPBOT_FETCH({
		API: 'hexbot',
		count: 1,
		width: appWidth,
		height: appHeight,
	}, addColorResponse);
}

function addColorResponse(responseJson) {
	const color = responseJson.colors[0];
	color.size = NOOPBOT_RANDOM(1, 7);
	colors.push(responseJson.colors[0])
}

function draw() {
	colors.forEach((point, index, arr) => {
		drawPoint(ctx, point);
		point.coordinates.y = point.coordinates.y + point.size;
		if (point.coordinates.y > appHeight) {
			point.coordinates.y = 0;
		}
		point.value = reduceValue(point.value);
		if (point.value === '#ffffff') {
			arr.splice(index, 1);
			return;
		}
	});
}

function drawPoint(ctx, point) {
	ctx.beginPath();
	ctx.fillStyle = point.value;
	const x = point.coordinates.x;
	const y = point.coordinates.y;

	ctx.rect(x, y, point.size, point.size);
	ctx.fill();
	ctx.closePath();
}

function sizeCanvas() {
	appWidth = window.innerWidth;
	appHeight = window.innerHeight;
	canvas = document.getElementById('canvas');
	ctx = NOOPBOT_SETUP_CANVAS( { canvas: canvas, bgColor:'#000000' });
}

function reduceValue(value) {
	let rgb = hexToRgb(value);

	rgb.forEach((int, index, arr) => {
		let newInt = int + 1;
		if (newInt > 255) {
			newInt = 255;
		}
		arr[index] = newInt;
	});

	return rgbToHex(rgb);
}

function hexToRgb(hex) {
	const int = parseInt(hex.slice(1), 16);
	const r = (int >> 16) & 255;
	const g = (int >> 8) & 255;
	const b = int & 255;
	return [r, g, b];
}

function rgbToHex(rgb) {
	let hex = '#';
	rgb.forEach(value => {
		let newValue = (value).toString(16);
		if (newValue.length < 2) {
			newValue = '0' + newValue;
		}		
		hex += newValue;
	});
	return hex;
}

window.onresize = function(event) {
	sizeCanvas();
	draw();
}