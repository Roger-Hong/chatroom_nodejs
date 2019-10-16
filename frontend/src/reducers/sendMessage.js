import { actionTypeNames } from '../actions'

const sendMessage = (state = {}, action) => {
	if (action.type !== actionTypeNames.SEND_MESSAGE) {
		return state;
	}
	if (!state.hasOwnProperty(action.friendName)) {
		return state;
	}
	const newState = Object.assign(
		{}, state, {CURRENT_FRIEND: action.friendName});
	newState[action.friendName]["messages"].push(
		newState[action.friendName]["unsentMessage"]);
	newState[action.friendName]["unsentMessage"] = "";
	newState[action.friendName]["lastUpdateTimestamp"] = action.timestamp;
	return newState;
};

export default sendMessage;