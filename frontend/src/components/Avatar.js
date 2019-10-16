import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(color =>({
	avatar: {
		margin: 10,
		color: '#fff',
		backgroundColor: color
	},
	bigAvatar: {
		margin: 10,
		width: 60,
		height: 60,
		color: '#fff',
		backgroundColor: color
	},
}));

const Avator = ({name, color, isBig}) => {
	const classes = useStyles(color);

	let initial = "?";
	for (let char of name) {
		if (char !== ' ') {
			initial = char;
			break;
		}
	}

	if (isBig) {
		return (<Avatar className={classes.bigAvatar}>{initial}</Avatar>);
	}
	return (<Avatar className={classes.avatar}>{initial}</Avatar>);
}

 Avator.propTypes = {
 	name: PropTypes.string.isRequired,
 	color: PropTypes.string,
 	isBig: PropTypes.bool.isRequired
 }

 export default Avator;