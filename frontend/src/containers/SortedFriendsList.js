import { connect } from 'react-redux'
import { checkDialog } from '../actions'
import FriendsList from '../components/FriendsList'

const getSortedFriendsList = state => {
	const friendsList = [];
	for (let name of Object.keys(state)) {
		if (typeof state[name] === "object" && state[name].hasOwnProperty("messages")) {
			friendsList.push({
				name,
				color: state[name]["avatarColor"],
				unreadNum: state[name]["unreadNum"],
				lastUpdateTimestamp: state[name]["lastUpdateTimestamp"]
			});
		}
	}
	return friendsList.sort((f1, f2) => f2.lastUpdateTimestamp - f1.lastUpdateTimestamp);
};

const mapStateToProps = state => ({
  sortedFriendsList: getSortedFriendsList(state)
});

const mapDispatchToProps = dispatch => ({
  checkDialog: name => dispatch(checkDialog(name, Date.now()))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FriendsList)