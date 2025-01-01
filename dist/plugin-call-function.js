var jsPsychCallFunction = (function (jspsych) {
  'use strict';

  var version = "2.0.0";

  const info = {
    name: "call-function",
    version,
    parameters: {
      /** The function to call. */
      func: {
        type: jspsych.ParameterType.FUNCTION,
        default: void 0
      },
      /** Set to true if `func` is an asynchoronous function. If this is true, then the first argument passed to `func`
       * will be a callback that you should call when the async operation is complete. You can pass data to the callback.
       * See example below.
       */
      async: {
        type: jspsych.ParameterType.BOOL,
        default: false
      }
    },
    data: {
      /** The return value of the called function. */
      value: {
        type: jspsych.ParameterType.COMPLEX,
        default: void 0
      }
    }
  };
  class CallFunctionPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static {
      this.info = info;
    }
    trial(display_element, trial) {
      let return_val;
      const end_trial = () => {
        const trial_data = {
          value: return_val
        };
        this.jsPsych.finishTrial(trial_data);
      };
      if (trial.async) {
        const done = (data) => {
          return_val = data;
          end_trial();
        };
        trial.func(done);
      } else {
        return_val = trial.func();
        end_trial();
      }
    }
    // no explicit simulate() mode for this plugin because it would just do
    // the same thing as the regular plugin
  }

  return CallFunctionPlugin;

})(jsPsychModule);
