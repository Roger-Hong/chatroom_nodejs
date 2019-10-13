/**
 * The format of redux state:
 *     {
 *         @current@: String, 
 *         friendName1: {
 *             messages: [{
 *                 text: String,
 *                 isMine: Boolean,
 *                 timestamp: Number,
 *             }],
 *             unreadNum: Number,
 *             unsentMessage: String,
 *             lastUpdateTimestamp: Number,
 *         },
 *     }
 */

export const currentDialogName = "@current@";

export const actionTypeNames = {
	CHECK_DIALOG: "CHECK_DIALOG",
	INPUT_MESSAGE: "INPUT_MESSAGE",
	SEND_MESSAGE: "SEND_MESSAGE",
};

export const checkDialog = (friendName, timestamp) => ({
	type: "CHECK_DIALOG",
	friendName,
	timestamp
});

export const inputMessage = (friendName, text, timestamp) => ({
	type: "INPUT_MESSAGE",
	friendName,
	text,
	timestamp
});

export const sendMessage = (friendName, timestamp) => ({
	type: "SEND_MESSAGE",
	friendName,
	timestamp
});