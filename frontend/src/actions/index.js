/**
 * The format of redux state:
 *     {
 *         MY_NAME: String,
 *         CURRENT_FRIEND: String, 
 *         friendName1: {
 *             avatarColor: String,
 *             messages: [{
 *                 text: String,
 *                 isMine: Boolean,
 *                 timestamp: Number,
 *             }],
 *             unreadNum: Number,
 *             unsentMessage: String,
 *             lastUpdateTimestamp: Number,
 *         },
 *         usedColors: [String],
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