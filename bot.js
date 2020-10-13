const { ActivityHandler, MessageFactory } = require('botbuilder');
const { QnAMaker } = require('botbuilder-ai');
const { ActionTypes } = require('botframework-schema');

class MyBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState, userState, dialog, configuration, qnaOptions) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');
        if (!configuration) throw new Error('[QnaMakerBot]: Missing parameter. configuration is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');
        this.qnaMaker = new QnAMaker(configuration, qnaOptions);

        var value = 1;
        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');
            if (value == 12) {
                // send user input to QnA Maker.
                const qnaResults = await this.qnaMaker.getAnswers(context);

                // If an answer was received from QnA Maker, send the answer back to the user.
                if (qnaResults[0]) {
                    await context.sendActivity(`${ qnaResults[0].answer}`);
                }
                else {
                    // If no answers were returned from QnA Maker, reply with help.
                    await context.sendActivity("Sorry, I couldn't understand you there.");
                }
            }
            else {
                // Run the Dialog with the new message Activity.
                await this.dialog.run(context, this.dialogState);
                value += 1;
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = "Hi there! Welcome to MindSpace - an AI Chatbot to help you be a better version of yourself. MindSpace promotes better mental health through mindful practices. Please be reminded that MindSpace cannot be replaced for a human counsellor.";
            const text2 = "So let's start our little chat. Firstly, I want to ask you a few questions just to see how you're doing. Would you like to get started?";
            const cardActions = [
                {
                    type: ActionTypes.PostBack,
                    title: 'Alright',
                    value: '1',
                },
            ];
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                    await context.sendActivity(MessageFactory.suggestedActions(cardActions, text2));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}

module.exports.MyBot = MyBot;