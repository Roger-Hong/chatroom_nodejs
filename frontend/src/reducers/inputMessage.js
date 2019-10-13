import { actionTypeNames } from '../actions'

const inputMessage = (state = {}, action) => {
	if (action.type != actionTypeNames.INPUT_MESSAGE) {
		return state;
	}
	if (!state.hasOwnProperty(action.friendName)) {
		return state;
	}
	const newState = Object.assign(
		{}, state, {currentDialogName: action.friendName});
	newState[action.friendName]["unsentMessage"] = action.text;
	newState[action.friendName]["lastUpdateTimestamp"] = action.timestamp;
	return newState;
};

export default inputMessage;