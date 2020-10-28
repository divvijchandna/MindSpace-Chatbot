const { ActivityHandler, MessageFactory } = require('botbuilder');
const { QnAMaker } = require('botbuilder-ai');
const { ActionTypes } = require('botframework-schema');
const { UserProfile } = require('./userProfile');
const { NumberPrompt, TextPrompt } = require('botbuilder-dialogs');

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

        var user = new UserProfile();
        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');

            const cardActions = [
                {
                    type: ActionTypes.PostBack,
                    title: '0 - Not at all',
                    value: '0',
                },
                {
                    type: ActionTypes.PostBack,
                    title: '1 - Several days',
                    value: '1',
                },
                {
                    type: ActionTypes.PostBack,
                    title: '2 - More than half the days.',
                    value: '2',
                },
                {
                    type: ActionTypes.PostBack,
                    title: '3 - Nearly every day',
                    value: '3',
                }
            ];

            const text2 = "So let's start our little chat. Firstly, I want to ask you a few questions just to see how you're doing. Would you like to get started?";
            const cardActions2 = [
                {
                    type: ActionTypes.PostBack,
                    title: 'Alright',
                    value: '1',
                },
            ];

            switch(value) {
                case 0:
                    user.score = 0;
                    await context.sendActivity(MessageFactory.suggestedActions(cardActions2, text2));
                    value += 1;
                    break;
                case 1:
                    await context.sendActivity(`What is your name?`);
                    value += 1;
                    break;
                case 2:
                    user.name = context.activity.text;
                    await context.sendActivity(`${ context.activity.text }. That's a really nice name!`);
                    await context.sendActivity(`To get started, please answer the following questions by selecting one of the given options. Over the last two weeks, how often have you been bothered by any of the following problems?`);
                    await context.sendActivity(MessageFactory.suggestedActions(cardActions, 'Little interest or pleasure in doing things.'));
                    value += 1;
                    break;
                case 3:
                    user.score += parseInt(context.activity.text);
                    await context.sendActivity(MessageFactory.suggestedActions(cardActions, 'Feeling down, depressed, or hopeless.'));
                    value += 1;
                    break;
                case 4:
                    user.score += parseInt(context.activity.text);
                    await context.sendActivity(MessageFactory.suggestedActions(cardActions, 'Trouble falling or staying asleep, or sleeping too much.'));
                    value += 1;
                    break;
                case 5:
                    user.score += parseInt(context.activity.text);
                    await context.sendActivity(MessageFactory.suggestedActions(cardActions, 'Feeling tired or having little energy.'));
                    value += 1;
                    break;
                case 6:
                    user.score += parseInt(context.activity.text);
                    await context.sendActivity(MessageFactory.suggestedActions(cardActions, 'Poor appetite or overeating.'));
                    value += 1;
                    break;
                case 7:
                    user.score += parseInt(context.activity.text);
                    if (user.score > 10) {
                        await context.sendActivity(`I'm sorry to hear that you've been going through such a tough time. Hopefully I can help you feel better. You can talk to me regarding the problems you're having or try using some other features on MindSpace to improve your mood.`);
                    }
                    else if (user.score > 5) {
                        await context.sendActivity(`It looks like you had a few rough days over the last few weeks. You can always check in to MindSpace when you're feeling down and talk to me or use the other features on MindSpace. You can continue talking to me right now and hopefully I can help you out with any problems you are facing.`)
                    }
                    else {
                        await context.sendActivity(`Happy to hear that you've been doing well over the last two weeks ${ user.name }! Now you can ask me some questions or just talk to me about how you're doing. You can also check out some other features on Mindspace.`)
                    }
                    // await context.sendActivity(`Thanks for answering these questions ${ user.name }! Now you can ask me some questions or just talk to me about how you're doing.`);
                    value += 1;
                    break;
                default:
                    await this.dialog.run(context, this.dialogState);
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = "Hi there! Welcome to MindSpace - an AI Chatbot to help you be a better version of yourself. MindSpace promotes better mental health through mindful practices. Please be reminded that MindSpace cannot be replaced for a human counsellor.";
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                    global.value = 0;
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