const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const { TopLevelDialog, TOP_LEVEL_DIALOG } = require('./topLevelDialog');
const {
    QnAMakerBaseDialog
} = require('./qnamakerBaseDialog');

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const USER_PROFILE_PROPERTY = 'USER_PROFILE_PROPERTY';
const QNAMAKER_BASE_DIALOG = 'qnamaker-base-dialog';


class MainDialog extends ComponentDialog {
    /**
     * Root dialog for this bot.
     * @param {QnAMaker} qnaService A QnAMaker service object.
     */
    constructor(knowledgebaseId, authkey, host, userState) {
        super(MAIN_DIALOG);
        this.userState = userState;
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

        this.addDialog(new TopLevelDialog());
        this.addDialog(new QnAMakerBaseDialog(knowledgebaseId, authkey, host));
        this.initialDialogId = QNAMAKER_BASE_DIALOG
        // this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
        //     this.initialStep.bind(this),
        //     this.intermediateStep.bind(this),
        //     this.finalStep.bind(this)
        // ]));
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async initialStep(stepContext) {
        return await stepContext.beginDialog(TOP_LEVEL_DIALOG);
    }

    async intermediateStep(stepContext) {
        return await stepContext.beginDialog(QNAMAKER_BASE_DIALOG);
    }

    async finalStep(stepContext) {
        const userInfo = stepContext.result;

        await this.userProfileAccessor.set(stepContext.context, userInfo);
        return await stepContext.endDialog();
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;