# WebRTC
An easy way to use device camera.

[demo](https://ziard.github.io/WebRTC/index.html)

## Usage
Create a div container
```html
<div id="WebRTC"></div>
```

### JavaScript

#### basic
```javascript
// init
<script src="js/WebRTC.js"></script>
var WebRTC = new WebRTC('#WebRTC');
```
#### options
```javascript
var WebRTC = new WebRTC('#WebRTC',{
	resolution: "HD",
	//camera resolution
	//if device not support high resolution will throw excaption
	//QVGA:320,240
	//VGA:640,480
	//HD:1280,720
	//FullHD:1920,1080
	//fourK:4096,2160
	//eightK:7680,4320

	fixWidth: 300,
	//set div width to value
	//camera width changed too, but resolution will be keeped

	front: true,
	//default:false
	//if false,uses rear camera. vice versa. 

	audio: true
	//default:false
	//open with audio
});
```
#### method
```javascript
WebRTC.WebRTC('start');
//open camera

WebRTC.WebRTC('stop');
//stop camera

WebRTC.WebRTC('switch');
//switch resource between rear and front

WebRTC.WebRTC('pause');
//pause camera

WebRTC.WebRTC('resume');
//resume camera

WebRTC.WebRTC('capture', '#canvas',{
	width:800,
	height:600
});
//capture picture to canvas element
//<canvas id="canvas"></canvas>

WebRTC.WebRTC('zoom', 2);
//zoom camera
//device must support

// WebRTC.WebRTC('zoomBar');
//comming soon
```


### jQuery

#### basic
```javascript
//jquery version 1.12.4 or later
<script src='https://code.jquery.com/jquery-1.12.4.min.js'></script>
<script src="js/jquery.WebRTC.js"></script>
var WebRTC = $('#WebRTC').WebRTC();
```

#### options
```javascript
var WebRTC = $('#WebRTC').WebRTC({
      resolution: "HD",
      fixWidth: 300,
      front: true,
      audio: true
    });
```
#### method
```javascript
WebRTC.start();
//open camera

WebRTC.stop();
//stop camera

WebRTC.switch();
//switch resource between rear and front

WebRTC.pause();
//pause camera

WebRTC.resume();
//resume camera

WebRTC.capture('#canvas',{
	width:800,
	height:600
});
//capture picture to canvas element
//<canvas id="canvas"></canvas>

WebRTC.zoom(2);
//zoom camera
//device must support

// WebRTC.zoomBar();
//comming soon
```

## Browsers support

|| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /></br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" /></br>IE / Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /></br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /></br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" /></br>iOS Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /></br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Basic| 47| Edge| 33| 11| 11| 30
| Zoom| 66| Edge 12| No| No| No| 53

## License
[MIT](https://choosealicense.com/licenses/mit/)
