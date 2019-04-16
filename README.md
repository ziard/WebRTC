# WebRTC
An easy way to use device camera.

## Usage
```html
<div id="WebRTC"></div>
```

### Options
```javascript
var WebRTC = $('#WebRTC').WebRTC({
      resolution: "HD",
      //default:null
      //camera resolution
      //if device not support high resolution will throw excaption
      //QVGA:320,240
      //VGA:640,480
      //HD:1280,720
      //FullHD:1920,1080
      //fourK:4096,2160
      //eightK:7680,4320

      fixWidth: 300,
      //default:null
      //set div width to value
      //camera width changed too, but resolution will be keeped

      front: true,
      //default:false
      //if false,uses rear camera
      // and vice versa. 

      audio: true,
      //default:false
      //open with audio
    });
```

### Method
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

WebRTC.WebRTC('capture', canvas);
//capture picture to canvas element
//var canvas = $('#canvas').get(0);
//or
//var canvas = document.getElementById('canvas');

WebRTC.WebRTC('zoom', 2);
//zoom camera
//device must support

// WebRTC.WebRTC('zoomBar');
//comming soon

```

## License
[MIT](https://choosealicense.com/licenses/mit/)
