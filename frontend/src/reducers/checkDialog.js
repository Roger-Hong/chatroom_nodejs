import { currentDialogName, actionTypeNames } from '../actions'

const checkDialog = (state = {}, action) => {
	if (action.type !== actionTypeNames.CHECK_DIALOG) {
		return state;
	}
	if (action.friendName === currentDialogName) {
		return state;
	}
	if (!state.hasOwnProperty(action.friendName)) {
		return state;
	}
	const newState = Object.assign(
		{}, state, {CURRENT_FRIEND: action.friendName});
	newState[action.friendName]["unreadNum"] = 0;
	newState[action.friendName]["lastUpdateTimestamp"] = action.timestamp;
	return newState;
}

export default checkDialog;