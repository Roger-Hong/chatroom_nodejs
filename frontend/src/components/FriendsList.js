import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from './Avatar';

const FriendsList = ({sortedFriendsList, checkDialog}) => {
	return (
		<List>
			{sortedFriendsList.map(friend => (
				<ListItem button key={friend.name} onClick={checkDialog(friend.name)}>
					<ListItemAvatar>
						<Avatar {...friend} isBig="true" />
					</ListItemAvatar>
					<ListItemText primary={friend.name} />
				</ListItem>
			))}
		</List>
	);
};

FriendsList.propTypes = {
	sortedFriendsList: PropTypes.arrayOf(
		PropTypes.shape({
			nanme: PropTypes.string.isRequired,
			color: PropTypes.string.isRequired,
			unreadNum: PropTypes.number.isRequired
		}).isRequired
	).isRequired,
	checkDialog: PropTypes.func.isRequired
};

export default FriendsList;