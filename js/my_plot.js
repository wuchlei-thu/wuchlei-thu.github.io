// setInterval(function(){
// $('#currentTime').html($('#video_container').find('video').get(0).currentTime);
// $('#totalTime').html($('#video_container').find('video').get(0).duration);
// },50);

$(function() {
    var angle = 0;
    var lines = [];
    var index = 0;
    var max_index;
    var pre_line;
    var colors = randomColor({luminosity: 'light',count: 50});
    var points = {};
    var pre_index;

    function processData(allText) {
        var allTextLines = allText.split(/\r\n|\n/);
        for (var i=0; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            var tarr = [];
            if (data.length <= 10) {
                continue;
            }
            for (var j=1; j<data.length; j++) {
                tarr.push(data[j]);
            }
            points[parseInt(data[0]*10)] = tarr;
            tarr = [data[0]].concat(tarr);
            lines.push(tarr);

            if (i == 0) {
                pre_index = parseInt(data[0]*10);
            }
        }
        max_index = lines.length;
        pre_line = lines[0]
    }

	var	htmlCanvas = document.getElementById('plot_canvas'),
	  	context = htmlCanvas.getContext('2d'),
        parent = htmlCanvas.parentNode,
        styles = getComputedStyle(parent);

    var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;


	function initialize() {
		// Register an event listener to
		// call the resizeCanvas() function each time
		// the window is resized.
		window.addEventListener('resize', resizeCanvas, false);
		// Draw canvas border for the first time.
		resizeCanvas();
	};

    function drawGrid() {
        var canvasWidth = htmlCanvas.width,
            canvasHeight = htmlCanvas.height;

        var num = 12,
            step = canvasWidth/num;

        for (var i = 0; i < num; i++) {
            context.beginPath();
            context.moveTo(i*step, 0);
            context.lineTo(i*step, canvasHeight);
            // context.moveTo(0, 0);
            // context.lineTo(255, 255);
            context.lineWidth = 1;
            context.strokeStyle = '#ECECEA';
            context.stroke();
            context.closePath();
        }
    };

    function drawCircle() {
        var canvasWidth = htmlCanvas.width,
            canvasHeight = htmlCanvas.height;
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        // drawGrid();

        var radius = 4;
        // var radius = 3 + 2 * Math.abs(Math.cos(angle));
        angle += Math.PI / 64;

        var video_ct = $('#video_container').find('video').get(0).currentTime;
        var tmp_index = parseInt(video_ct*10);
        if (tmp_index in points) {
            pre_index = tmp_index;
        }
        var datas = points[pre_index];
        for (var i = 0; i < datas.length; i+=2) {
        // draw the circle
            context.beginPath();
            context.arc(canvasWidth*(datas[i+1]/2), canvasHeight*(Math.abs(datas[i]-0.5)), radius, 0, Math.PI * 2, false);
            context.closePath();

            // color in the circle
            context.fillStyle = colors[parseInt(i/2)];
            context.fill();
        }
        $('#dataTime').html(pre_index/10);

        requestAnimationFrame(drawCircle);
    }

    function resizeCanvas() {
        var w = parseInt(styles.getPropertyValue("width"), 10),
            h = parseInt(styles.getPropertyValue("height"), 10);
		htmlCanvas.width = w;
		htmlCanvas.height = h;
	}

    $.get("video/video_3.csv", function(data, status){
    // $.get("video/basketball-data.csv", function(data, status){
            // alert("Status: " + status);
            processData(data);
        	initialize();
            var vid = $('#video_container').find('video').get(0)
            vid.load()
            vid.play()
            if (vid.getAttribute('controls') !== 'true') {
                vid.setAttribute('controls', 'true');
            }
            vid.removeAttribute('controls');
            // $('#video_container').find('video').get(0).load()
            // $('#video_container').find('video').get(0).play()
            // $('#currentTime').html($('#video_container').find('video').get(0).load());
            // $('#currentTime').html($('#video_container').find('video').get(0).play());
            drawCircle();
        });

});
