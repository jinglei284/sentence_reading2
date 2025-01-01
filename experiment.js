// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: () => {
        // Save the data as a CSV file
        jsPsych.data.get().localSave('csv', 'participant_data.csv');
        // Display the data in the console (optional for debugging)
        console.log(jsPsych.data.get().csv());
    },
});

// Define sentences
const practiceSentences = [
    "The sky is blue",
    "Ice is hot",
    "A kangaroo is an animal",
    "A wheel is square",
];

const testSentences = [
    "Baby dogs are called men some of the time",
    "You can see that the sun is square in shape",
    "Bees can make cheese from dry dust",
    "Is it good for your teeth to eat a lot of sweets",
];

// Shuffle test sentences
const shuffledTestSentences = jsPsych.randomization.shuffle(testSentences);

// Instructions
const instructionsTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-family: Arial, sans-serif; color: #f8f9fa; background-color: #1e1e2f;">
            <div style="max-width: 700px; text-align: center; padding: 20px; background-color: #2b3e50; border-radius: 15px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.6);">
                <h2 style="color: #00d1b2;">Welcome to the Experiment</h2>
                <p style="font-size: 18px; line-height: 1.6;">
                    In this task, you will read sentences presented <strong>one word at a time</strong>. <br><br>
                    <span style="color: #ffd700;">Press the <strong>SPACEBAR</strong></span> to move to the next word. <br><br>
                    After reading the full sentence, you will be asked to judge whether the sentence is true or false. <br><br>
                    <strong style="color: #00d1b2;">Press 'F' for Yes</strong> and <strong style="color: #e63946;">Press 'J' for No</strong>. <br><br>
                    <span style="color: #ffd700; font-weight: bold;">Press SPACEBAR to start practice.</span>
                </p>
            </div>
        </div>`,
    choices: [' '],
};

// Helper function to create trials for each sentence
const createSentenceTrials = (sentences) => {
    const trials = [];
    sentences.forEach((sentence, sentenceIndex) => {
        const words = sentence.split(" ");
        words.forEach((word, wordIndex) => {
            trials.push({
                type: jsPsychHtmlKeyboardResponse,
                stimulus: `<p style="font-size: 28px; text-align: center;">${word}</p>`,
                choices: [" "],
                response_ends_trial: true,
                data: {
                    sentence_index: sentenceIndex,
                    word_index: wordIndex,
                    word: word,
                },
            });
        });

        trials.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<p style="font-size: 28px; text-align: center;">Is the sentence true?</p>`,
            choices: ['f', 'j'],
            prompt: "Press 'F' for Yes or 'J' for No.",
            data: {
                sentence_index: sentenceIndex,
                sentence: sentence,
            },
            on_finish: (data) => {
                data.judgment = data.response === 0 ? "Yes" : "No";
            },
        });
    });

    return trials;
};

// Create practice and test trials
const practiceTrials = createSentenceTrials(practiceSentences);
const testTrials = createSentenceTrials(shuffledTestSentences);

// Full timeline
const timeline = [
    instructionsTrial,
    {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div style="font-family: Arial, sans-serif; font-size: 28px; color: black; text-align: center;">
            Now we begin practice. <br><br> <span>Press SPACEBAR to begin.</span>
        </div>`,
        choices: [' '],
    },
    ...practiceTrials,
    {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div style="font-family: Arial, sans-serif; font-size: 28px; color: black; text-align: center;">
            Now we begin the experiment. <br><br> <span>Press SPACEBAR to begin.</span>
        </div>`,
        choices: [' '],
    },
    ...testTrials,
    {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div style="font-family: Arial, sans-serif; font-size: 28px; color: black; text-align: center;">
            Thank you for participating! <br><br> <span>Press SPACEBAR to finish.</span>
        </div>`,
        choices: [' '],
    },
];

// Run the experiment
jsPsych.run(timeline);
