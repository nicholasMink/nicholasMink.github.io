let aContext = null,
    analyser = null,
    mediaSrc = null,
    srcNode = null,
    isPlaying = false,
    af = null,
    buf = new Float32Array( 512 );

const noteClose = document.querySelector('.noteCloseTo');
const setLED = document.getElementById('tuned');

const setFlatest = document.getElementById('flatest'),
	setFlat1 = document.getElementById('flat1'),
	setFlat2 = document.getElementById('flat2'),
	setFlat3 = document.getElementById('flat3'),
	setFlat4 = document.getElementById('flat4'),
	setFlat5 = document.getElementById('flat5'),
	setFlat6 = document.getElementById('flat6'),
	setFlat7 = document.getElementById('flat7');

const setSharpest = document.getElementById('sharpest'),
	setSharp1 = document.getElementById('sharp1'),
	setSharp2 = document.getElementById('sharp2'),
	setSharp3 = document.getElementById('sharp3'),
	setSharp4 = document.getElementById('sharp4'),
	setSharp5 = document.getElementById('sharp5'),
	setSharp6 = document.getElementById('sharp6'),
	setSharp7 = document.getElementById('sharp7');

let resetTunerLED = ( ) => {
	setLED.style.fill = '#cccccc';
	setFlatest.style.fill = '#cccccc';
	setFlat1.style.fill = '#cccccc';
	setFlat2.style.fill = '#cccccc';
	setFlat3.style.fill = '#cccccc';
	setFlat4.style.fill = '#cccccc';
	setFlat5.style.fill = '#cccccc';
	setFlat6.style.fill = '#cccccc';
	setFlat7.style.fill = '#cccccc';
	setSharpest.style.fill = '#cccccc';
	setSharp1.style.fill = '#cccccc';
	setSharp2.style.fill = '#cccccc';
	setSharp3.style.fill = '#cccccc';
	setSharp4.style.fill = '#cccccc';
	setSharp5.style.fill = '#cccccc';
	setSharp6.style.fill = '#cccccc';
	setSharp7.style.fill = '#cccccc';
}

window.onload = () => {
	aContext = new AudioContext();
  console.log(aContext.sampleRate);
  MAX_SIZE = Math.max(4, Math.floor(aContext.sampleRate / 5000));
}

const constraints = { audio: true };
navigator.mediaDevices.getUserMedia(constraints)
.then( startStream = stream => {
  mediaSrc = aContext.createMediaStreamSource(stream);
  analyser = aContext.createAnalyser();
  analyser.fftSize = 1024;
  mediaSrc.connect( analyser );
  getPitch();
})
.catch(err => { console.log(err.name + ": " + err.message); });

let toggleLiveInput = () => {
  if (isPlaying) {
      srcNode.stop( 0 );
      srcNode = null;
      analyser = null;
      isPlaying = false;
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
    }
    window.cancelAnimationFrame( af );
  }
  getUserMedia({
    "audio": {
        "mandatory": {
            "echoCancellation": "false"
        },
        "optional": []
    },
  }, startStream);
}

let getPitch = () => {
	analyser.getFloatTimeDomainData( buf );
	let ac = autoCorrelate( buf, aContext.sampleRate );
	af = window.requestAnimationFrame( getPitch );
}

let autoCorrelate = ( buf, sampleRate ) => {
  let avgDev = 0,
	    offsetUpdate = -1,
	    correlationUpdate = 0,
	    maxSamples = Math.floor(buf.length / 2),
	    correlations = new Array(maxSamples),
	    goodCorrelation = false;

	for (let i = 0; i < buf.length; i++) {
		avgDev += Math.pow(buf[i], 2);
	}
  
  avgDev = Math.sqrt(avgDev / buf.length);
  
  if (avgDev < 0.03) {
		return false;
  }

  let lastCorrelation = 1;
  
	for (let offset = 80; offset < maxSamples; offset++) {
		let correlation = 0;

		for (let i = 0; i < maxSamples; i++) {
			correlation += Math.abs(buf[i] - buf[i + offset]);
		}
		correlation = 1 - (correlation / maxSamples);
		correlations[offset] = correlation;
		if (correlation > 0.95 && correlation > lastCorrelation) {
			goodCorrelation = true;
			if (correlation > correlationUpdate) {
				correlationUpdate = correlation;
				offsetUpdate = offset;
				console.log(sampleRate / offsetUpdate + "Hz");
				let currentFreq = sampleRate / offsetUpdate;
				if(currentFreq > 302 && currentFreq < 360) {
					noteClose.innerText = 'E (Bottom String)';
					if(currentFreq > 356) {
						resetTunerLED();
						setSharpest.style.fill = '#fff';
					} else if (currentFreq >= 353){
						resetTunerLED();
						setSharp7.style.fill = '#fff';
					} else if (currentFreq >= 350){
						resetTunerLED();
						setSharp6.style.fill = '#fff';
					} else if (currentFreq >= 347){
						resetTunerLED();
						setSharp5.style.fill = '#fff';
					} else if (currentFreq >= 344){
						resetTunerLED();
						setSharp4.style.fill = '#fff';
					} else if (currentFreq >= 341){
						resetTunerLED();
						setSharp3.style.fill = '#fff';
					} else if (currentFreq >= 338){
						resetTunerLED();
						setSharp2.style.fill = '#fff';
					} else if (currentFreq > 335){
						resetTunerLED();
						setSharp1.style.fill = '#fff';
					} else if (currentFreq <= 335 && currentFreq >= 323){ // 329.6
						resetTunerLED();
						setLED.style.fill = '#fff';
					} else if (currentFreq > 320){
						resetTunerLED();
						setFlat1.style.fill = '#fff';
					} else if (currentFreq > 317){
						resetTunerLED();
						setFlat2.style.fill = '#fff';
					} else if (currentFreq > 314){
						resetTunerLED();
						setFlat3.style.fill = '#fff';
					} else if (currentFreq > 311){
						resetTunerLED();
						setFlat4.style.fill = '#fff';
					} else if (currentFreq > 308){
						resetTunerLED();
						setFlat5.style.fill = '#fff';
					} else if (currentFreq > 305){
						resetTunerLED();
						setFlat6.style.fill = '#fff';
					} else if (currentFreq > 302){
						resetTunerLED();
						setFlatest.style.fill = '#fff';
					}
				}
				else {
					resetTunerLED();
				}
			}
		} else if (goodCorrelation) {
			let shift = (correlations[offsetUpdate + 1] - correlations[offsetUpdate - 1]) / correlations[offsetUpdate];  
			return sampleRate / (offsetUpdate + (8 * shift));
		}
		lastCorrelation = correlation;
	}
	if (correlationUpdate > 0.01) {
		return sampleRate / offsetUpdate;
	}
	return false;
}