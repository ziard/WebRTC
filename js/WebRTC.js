/*
 *  Project: WebRTC
 *  Description: Easy use WebRTC
 *  Author: ed108804(EDAH)
 *  License: MIT
 *  Version: 2.0
 */

(function (window) {
	'use strict';

	/**
	 * Extend Object helper function.
	 */
	function extend(a, b) {
		var key;
		for (key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/**
	 * Each helper function.
	 */
	function each(collection, callback) {
		var i;
		var item;
		for (i = 0; i < collection.length; i++) {
			item = collection[i];
			callback(item);
		}
	}

	const resolutionData = {
		QVGA: {
			width: {
				exact: 320
			},
			height: {
				exact: 240
			}
		},
		VGA: {
			width: {
				exact: 640
			},
			height: {
				exact: 480
			}
		},
		HD: {
			width: {
				exact: 1280
			},
			height: {
				exact: 720
			}
		},
		FullHD: {
			width: {
				exact: 1920
			},
			height: {
				exact: 1080
			}
		},
		fourK: {
			width: {
				exact: 4096
			},
			height: {
				exact: 2160
			}
		},
		eightK: {
			width: {
				exact: 7680
			},
			height: {
				exact: 4320
			}
		}
	}

	const viewTemplate = '<video id="video" autoplay playsinline></video>';
	const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	const errorCallback = function (error) {
		console.error('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
	}

	const successCallback = function (stream) {
		const video = document.querySelector('video');
		window.stream = stream;
		if (navigator.mediaDevices) {
			video.srcObject = stream;
		} else {
			if (window.webkitURL) {
				video.src = window.webkitURL.createObjectURL(stream);
			} else if (video.mozSrcObject !== undefined) {
				video.mozSrcObject = stream;
			} else {
				video.src = stream;
			}
		}
	}

	function WebRTC(element, options) {
		this.element = document.querySelector(element);
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}

	WebRTC.prototype.options = {
		resolution: null,
		fixWidth: null,
		front: false,
		audio: false,
	};

	WebRTC.prototype._init = function () {
		this.element.innerHTML = viewTemplate;
		if (this.options.fixWidth) {
			this.element.style.width = this.options.fixWidth + "px";
			each(this.element.querySelectorAll("video"), function (video) {
				video.style.setProperty('width', '100%', 'important');
			});
		}
	};

	WebRTC.prototype.start = function () {
		const $this = this;
		const constraints = {
			video: {
				facingMode: ($this.options.front ? "user" : "environment")
			},
			audio: $this.options.audio
		}
		if ($this.options.resolution) {
			constraints.video.width = resolutionData[$this.options.resolution].width;
			constraints.video.height = resolutionData[$this.options.resolution].height;
		}

		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.enumerateDevices().then(function (devices) {
				devices = devices.filter(function (devices) {
					return devices.kind === 'videoinput';
				});

				var videoinput_id = '';
				devices.forEach(function (device) {
					if (device.label.toLowerCase().search($this.options.front ? "front" : "back") > -1) {
						videoinput_id = device.deviceId;
					}
				});
				if (videoinput_id != '') {
					constraints.video.deviceId = {
						'exact': videoinput_id
					};
					navigator.mediaDevices.getUserMedia(constraints).then(successCallback);
				} else {
					navigator.mediaDevices.getUserMedia(constraints).then(successCallback);
				}
			});
			return true;
		} else {
			if (getUserMedia) {
				navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
				return true;
			} else {
				return false;
			}
		}
	}

	WebRTC.prototype.stop = function () {
		if (window.stream) {
			window.stream.getTracks().forEach(function (track) {
				track.stop();
			});
		}
	}

	WebRTC.prototype.switch = function () {
		this.stop();
		this.options.front = !this.options.front;
		this.start();
	}

	WebRTC.prototype.pause = function () {
		each(this.element.querySelectorAll("video"), function (video) {
			video.pause();
		});
	}

	WebRTC.prototype.resume = function () {
		each(this.element.querySelectorAll("video"), function (video) {
			video.play();
		});
	}

	WebRTC.prototype.capture = function (selector, options) {
		const canvas = document.querySelectorAll(selector);
		const video = this.element.querySelector('video');
		each(canvas, function (canvas) {
			canvas.width = options.width ? options.width : video.videoWidth;
			canvas.height = options.height ? options.height : video.videoHeight;
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		});
	}

	WebRTC.prototype.zoom = function (zoomRate) {
		if (window.stream) {
			const track = window.stream.getTracks()[0];
			const capabilities = track.getCapabilities();
			if (!('zoom' in capabilities)) {
				return Promise.reject('Zoom is not supported by ' + track.label);
			}
			track.applyConstraints({
				advanced: [{
					zoom: zoomRate
				}]
			});
		}
	}

	window.WebRTC = WebRTC;

})(window);