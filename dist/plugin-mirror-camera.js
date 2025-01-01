var jsPsychMirrorCamera = (function (jspsych) {
  'use strict';

  var version = "2.0.0";

  const info = {
    name: "mirror-camera",
    version,
    parameters: {
      /** HTML-formatted content to display below the camera feed. */
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      /** The label of the button to advance to the next trial. */
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      },
      /** The height of the video playback element. If left `null` then it will match the size of the recording. */
      height: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      /** The width of the video playback element. If left `null` then it will match the size of the recording. */
      width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      /**  Whether to mirror the video image. */
      mirror_camera: {
        type: jspsych.ParameterType.BOOL,
        default: true
      }
    },
    data: {
      /** The length of time the participant viewed the video playback. */
      rt: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class MirrorCameraPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static {
      this.info = info;
    }
    trial(display_element, trial) {
      this.stream = this.jsPsych.pluginAPI.getCameraStream();
      display_element.innerHTML = `
      <video autoplay playsinline id="jspsych-mirror-camera-video" width="${trial.width ? trial.width : "auto"}" height="${trial.height ? trial.height : "auto"}" ${trial.mirror_camera ? 'style="transform: rotateY(180deg);"' : ""}></video>
      ${trial.prompt ? `<div id="jspsych-mirror-camera-prompt">${trial.prompt}</div>` : ""}
      <p><button class="jspsych-btn" id="btn-continue">${trial.button_label}</button></p>
    `;
      display_element.querySelector("#jspsych-mirror-camera-video").srcObject = this.stream;
      display_element.querySelector("#btn-continue").addEventListener("click", () => {
        this.finish(display_element);
      });
      this.start_time = performance.now();
    }
    finish(display_element) {
      this.jsPsych.finishTrial({
        rt: performance.now() - this.start_time
      });
    }
  }

  return MirrorCameraPlugin;

})(jsPsychModule);
