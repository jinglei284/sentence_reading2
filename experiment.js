// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: () => {
        const csvData = jsPsych.data.get().csv();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "participant_data.csv";
        a.click();
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
    "Fresh eggs are as hard as rocks",
    "Do lions make very good pets",
    "We know that there are whales on the moon",
    "People wear shoes on their hands when they walk about",
    "Pigs can fly high in the sky",
    "Sharks tend to fear herds of sheep",
    "The milk we drink comes from ducks",
    "Bears like to sit and watch films",
    "All the swans in the world are black",
    "A crab has two legs to walk on",
    "Owls have pink and blue stripes on their head",
    "We can see five moons at night",
    "Snakes hear very well because they have long ears",
    "You can find ants in the clouds",
    "The stars up above are real bright at lunch time",
    "Boys use their hands to walk and their feet to eat",
    "Bees swarm around the fields because they like to eat grass",
    "Where does the sun rise and set In the north and the east",
    "To make a house look nice you should use brooms to paint the walls",
    "Fire trucks are small quiet black vehicles that stop at all stop signs in the road",
    "Cats can catch mice if they are fast enough",
    "Rest is very good for your health",
    "The sun gives us light and heat",
    "We can get wet in the rain when we have no umbrella",
    "We need to breathe air in order to live",
    "Are grapes and pears and plums all fruits",
    "You can buy food from a shop",
    "A plane can take you up and down in the air",
    "We can tell what time of day it is from a watch",
    "Most dogs and cats walk on four legs",
    "You can pour water with a jug",
    "Frogs like to swim in a pond",
    "Can you drink milk through a straw",
    "Some people eat pie with a fork",
    "You do not need gas to ride a bike",
    "It would never ever snow on the Sun",
    "At the shop we can buy fruit and meat and cheese",
    "A full moon looks like a bright round plate",
    "We can find a lot of books at school",
    "We need to wear more clothes when it is cold",
    "A baby may cry when it is hungry",
    "Do you need wind to fly a kite",
    "Goats like to eat hay which is dry grass",
    "We can cross the street when the green light is on",
    "The earth is a round sphere",
    "The earth goes round the sun",
    "You learn how to read and write and add in school",
    "There is a lot of sand at a beach",
    "A table and a cow each have four legs",
    "Just like other sea creatures fish need food to live",
    "You should stay at home when you are sick",
    "Many kinds of fish live in the sea",
    "You should look both ways before you cross a street",
    "Your hair will grow too long if you do not cut it",
    "A baby should not try to play with fire",
    "You need to peel the skin before you eat a kiwi",
    "When snow falls from the sky it is white and very cold",
    "A hot day is a good day to swim in the pool",
    "Cats and dogs and mice all have five legs",
    "Cooks are the ones who work in the banks",
    "There are one hundred hours in day",
    "Can a fish live without water",
    "A train goes on the road like a car or truck",
    "Is there much water in the desert",
    "The bread we eat falls from the trees",
    "A fox might be chased by mice",
    "May is the last day of the week",
    "Can you find a phone number with a map",
    "People sit on their hands while they eat snacks",
    "Will your nose grow long if you tell a lie",
    "A key can be used to comb your hair each day",
    "Can you drive a car with a flat tire very far",
    "Is it good for your teeth to eat a lot of sweets",
];

// Shuffle test sentences
const shuffledTestSentences = jsPsych.randomization.shuffle(testSentences);

// Instructions
const instructionsTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: [
        `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-family: Arial, sans-serif; color: #f8f9fa; background-color: #1e1e2f;">
            <div style="max-width: 700px; text-align: center; padding: 20px; background-color: #2b3e50; border-radius: 15px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.6);">
                <h2 style="color: #00d1b2;">Welcome to the Experiment</h2>
                <p style="font-size: 18px; line-height: 1.6;">
                    In this task, you will read sentences presented <strong>one word at a time</strong>. <br><br>
                    <span style="color: #ffd700;">Press the <strong>SPACEBAR</strong></span> to move to the next word. <br><br>
                    After reading the full sentence, you will be asked to judge whether the sentence is true or false. <br><br>
                    <strong style="color: #00d1b2;">Press 'J' for Yes</strong> and <strong style="color: #e63946;">Press 'F' for No</strong>. <br><br>
                    <span style="color: #ffd700; font-weight: bold;">Press SPACEBAR to the next page.</span>
                </p>
            </div>
        </div>`
    ],
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
            stimulus: `<p style="font-size: 28px; text-align: center;">Is this sentence/ question TRUE or FALSE?</p>`,
            choices: ['j', 'f'],
            prompt: "Press 'J' for TRUE or 'F' for FALSE.",
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
