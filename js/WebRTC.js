/*
 *  Project: WebRTC
 *  Description: Easy use WebRTC
 *  Author: ed108804(EDAH)
 *  License: MIT
 *  Version: 1.0
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function ($, window, document, undefined) {
	'use strict';
	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window is passed through as local variable rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).
	const pluginName = "WebRTC",
		// the name of using in .data()
		dataPlugin = "plugin_" + pluginName;
	// default options
	const defaults = {
		resolution: null,
		fixWidth: null,
		front: false,
		audio: false,
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
		const video = document.getElementById('video');
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

	// The actual plugin constructor
	var Plugin = function (element) {
		/*
		 * Plugin instantiation
		 */
		this.options = $.extend({}, defaults);
	}

	Plugin.prototype = {
		init: function (options) {
			$.extend(this.options, options);
			/*
			 * Place initialization logic here
			 */
			this.element.html(viewTemplate);
			if (options.fixWidth) {
				this.element.css('width', options.fixWidth);
				this.element.find('video').each(function () {
					this.style.setProperty('width', '100%', 'important');
				});
			}
		},
		start: function () {
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
		},
		stop: function () {
			if (window.stream) {
				window.stream.getTracks().forEach(function (track) {
					track.stop();
				});
			}
		},
		switch: function () {
			this.stop();
			this.options.front = !this.options.front;
			this.start();
		},
		pause: function () {
			this.element.find('video').get(0).pause();
		},
		resume: function () {
			this.element.find('video').get(0).play();
		},
		capture: function (canvas, width, height) {
			const video = this.element.find('video').get(0);
			canvas.width = width ? width : video.videoWidth;
			canvas.height = height ? height : video.videoHeight;
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		},
		zoom: function (zoomRate) {
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
		},
		zoomBar: function () {

		},
	}

	/*
	 * Plugin wrapper, preventing against multiple instantiations and
	 * allowing any public function to be called via the jQuery plugin,
	 * e.g. $(element).pluginName('functionName', arg1, arg2, ...)
	 */
	$.fn[pluginName] = function (arg) {
		var args, instance;

		// only allow the plugin to be instantiated once
		if (!(this.data(dataPlugin) instanceof Plugin)) {

			// if no instance, create one
			this.data(dataPlugin, new Plugin(this));
		}

		instance = this.data(dataPlugin);

		instance.element = this;

		// Is the first parameter an object (arg), or was omitted,
		// call Plugin.init( arg )
		if (typeof arg === 'undefined' || typeof arg === 'object') {
			if (typeof instance['init'] === 'function') {
				instance.init(arg);
				return this;
			}
			// checks that the requested public method exists
		} else if ((typeof arg === 'string' && !arg.startsWith('_')) && typeof instance[arg] === 'function') {
			// copy arguments & remove function name
			args = Array.prototype.slice.call(arguments, 1);

			// call the method
			return instance[arg].apply(instance, args);
		} else {
			$.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);
		}
	}
}(jQuery, window, document));