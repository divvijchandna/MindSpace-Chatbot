const { ComponentDialog, NumberPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { UserProfile } = require('../userProfile');
const { MessageFactory } = require('botbuilder');

const TOP_LEVEL_DIALOG = 'TOP_LEVEL_DIALOG';

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';

class TopLevelDialog extends ComponentDialog {
    constructor() {
        super(TOP_LEVEL_DIALOG);
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.q1Step.bind(this),
            this.q2Step.bind(this),
            this.q3Step.bind(this),
            this.q4Step.bind(this),
            this.q5Step.bind(this),
            this.q6Step.bind(this),
            this.q7Step.bind(this),
            this.q8Step.bind(this),
            this.q9Step.bind(this),
            this.acknowledgementStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async nameStep(stepContext) {
        // Create an object in which to collect the user's information within the dialog.
        stepContext.values.userInfo = new UserProfile();

        const promptOptions = { prompt: "What's your name?" };

        // Ask the user to enter their name.
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    }

    async q1Step(stepContext) {
        
        stepContext.values.userInfo.name = stepContext.result;

        await stepContext.context.sendActivity(`${ stepContext.result }. That's a really nice name!`);
        await stepContext.context.sendActivity(`To get started, Please answer the following questions by typing the corresponding number for each of the options. Over the last two weeks, how often have you been bothered by any of the following problems?`);
        await stepContext.context.sendActivity(`Little interest or pleasure in doing things.`);
        const promptOptions = { prompt: "0 - Not at all. 1 - Several days. 2 - More than half the days. 3 - Nearly every day" };

        
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async q2Step(stepContext) {
        
        stepContext.values.userInfo.score += stepContext.result;

        await stepContext.context.sendActivity(`Feeling down, depressed, or hopeless.`);
        const promptOptions = { prompt: "0 - Not at all. 1 - Several days. 2 - More than half the days. 3 - Nearly every day" };

        
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async q3Step(stepContext) {
        
        stepContext.values.userInfo.score += stepContext.result;

        await stepContext.context.sendActivity(`Trouble falling or staying asleep, or sleeping too much.`);
        const promptOptions = { prompt: "0 - Not at all. 1 - Several days. 2 - More than half the days. 3 - Nearly every day" };

        
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async q4Step(stepContext) {
        
        stepContext.values.userInfo.score += stepContext.result;

        await stepContext.context.sendActivity(`Feeling tired or having little energy.`);
        const promptOptions = { prompt: "0 - Not at all. 1 - Several days. 2 - More than half the days. 3 - Nearly every day" };

        
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async q5Step(stepContext) {
        
        stepContext.values.userInfo.score += stepContext.result;

        await stepContext.context.sendActivity(`Poor appetite or overeating.`);
        const promptOptions = { prompt: "0 - Not at all. 1 - Several days. 2 - More than half the days. 3 - Nearly every day" };

        
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async q6Step(stepContext) {
        
        stepContext.values.userInfo.score += stepContext.result;

        await stepContext.context.sendActivity(`Feeling bad about yourself—or that you are a failure or have let yourself or your family down.`);
        const promptOptions = { prompt: "0 - Not at all. 1 - Several days. 2 - More than half the days. 3 - Nearly every day" };

        
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async q7Step(stepContext) {
        
        stepContext.values.userInfo.score += stepContext.result;

        await stepContext.context.sendActivity(`Trouble concentrating on things such as reading the newspaper or watching television.`);
        const promptOptions = { prompt: "0 - Not at all. 1 - Several days. 2 - More than half the days. 3 - Nearly every day" };

        
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async q8Step(stepContext) {
        
        stepContext.values.userInfo.score += stepContext.result;

        await stepContext.context.sendActivity(`Moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving around a lot more than usual.`);
        const promptOptions = { prompt: "0 - Not at all. 1 - Several days. 2 - More than half the days. 3 - Nearly every day" };

        
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async q9Step(stepContext) {
        
        stepContext.values.userInfo.score += stepContext.result;

        await stepContext.context.sendActivity(`Thoughts that you would be better off dead or of hurting yourself in some way.`);
        const promptOptions = { prompt: "0 - Not at all. 1 - Several days. 2 - More than half the days. 3 - Nearly every day" };

        
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async acknowledgementStep(stepContext) {
        // Set the user's company selection to what they entered in the review-selection dialog.
        const userProfile = stepContext.values.userInfo;
        userProfile.companiesToReview = stepContext.result || [];

        await stepContext.context.sendActivity(`Thanks for answering these questions ${ userProfile.name }! Now you can ask me some questions or just talk to me about how you're feeling.`);

        // Exit the dialog, returning the collected user information.
        return await stepContext.endDialog(userProfile);
    }
}

module.exports.TopLevelDialog = TopLevelDialog;
module.exports.TOP_LEVEL_DIALOG = TOP_LEVEL_DIALOG;