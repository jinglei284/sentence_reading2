var jsPsychExtensionRecordVideo = (function (jspsych) {
	'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	// Gets all non-builtin properties up the prototype chain
	const getAllProperties = object => {
		const properties = new Set();

		do {
			for (const key of Reflect.ownKeys(object)) {
				properties.add([object, key]);
			}
		} while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

		return properties;
	};

	var autoBind = (self, {include, exclude} = {}) => {
		const filter = key => {
			const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);

			if (include) {
				return include.some(match);
			}

			if (exclude) {
				return !exclude.some(match);
			}

			return true;
		};

		for (const [object, key] of getAllProperties(self.constructor.prototype)) {
			if (key === 'constructor' || !filter(key)) {
				continue;
			}

			const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
			if (descriptor && typeof descriptor.value === 'function') {
				self[key] = self[key].bind(self);
			}
		}

		return self;
	};

	var autoBind$1 = /*@__PURE__*/getDefaultExportFromCjs(autoBind);

	var version = "1.1.0";

	class RecordVideoExtension {
	  constructor(jsPsych) {
	    this.jsPsych = jsPsych;
	    this.recordedChunks = [];
	    this.recorder = null;
	    this.currentTrialData = null;
	    this.trialComplete = false;
	    this.onUpdateCallback = null;
	    // todo: add option to stream data to server with timeslice?
	    this.initialize = async () => {
	    };
	    this.on_start = () => {
	      this.recorder = this.jsPsych.pluginAPI.getCameraRecorder();
	      this.recordedChunks = [];
	      this.trialComplete = false;
	      this.currentTrialData = {};
	      if (!this.recorder) {
	        console.warn(
	          "The record-video extension is trying to start but the camera is not initialized. Do you need to run the initialize-camera plugin?"
	        );
	        return;
	      }
	      this.recorder.addEventListener("dataavailable", this.handleOnDataAvailable);
	    };
	    this.on_load = () => {
	      this.recorder.start();
	    };
	    this.on_finish = () => {
	      return new Promise((resolve) => {
	        this.trialComplete = true;
	        this.recorder.stop();
	        if (!this.currentTrialData.record_video_data) {
	          this.onUpdateCallback = () => {
	            resolve(this.currentTrialData);
	          };
	        } else {
	          resolve(this.currentTrialData);
	        }
	      });
	    };
	    autoBind$1(this);
	  }
	  static {
	    this.info = {
	      name: "record-video",
	      version,
	      data: {
	        /** [Base 64 encoded](https://developer.mozilla.org/en-US/docs/Glossary/Base64) representation of the video data. */
	        record_video_data: {
	          type: jspsych.ParameterType.STRING
	        }
	      }
	    };
	  }
	  handleOnDataAvailable(event) {
	    if (event.data.size > 0) {
	      console.log("chunks added");
	      this.recordedChunks.push(event.data);
	      if (this.trialComplete) {
	        this.updateData();
	      }
	    }
	  }
	  updateData() {
	    const data = new Blob(this.recordedChunks, {
	      type: this.recorder.mimeType
	    });
	    const reader = new FileReader();
	    reader.addEventListener("load", () => {
	      const base64 = reader.result.split(",")[1];
	      this.currentTrialData.record_video_data = base64;
	      if (this.onUpdateCallback) {
	        this.onUpdateCallback();
	      }
	    });
	    reader.readAsDataURL(data);
	  }
	}

	return RecordVideoExtension;

})(jsPsychModule);
