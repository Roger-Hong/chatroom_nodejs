# Chatroom backend v2

### Better than Chatroom backend v1

* Using Promise instead of callback function, to avoid callback function hell.
* Strictly apply MVC framework for user, friendship, and message. 
* Apply authorization check in middleware.

### APIs

| Api | Request.Body <br> (...token) | Response | Model dependency |
| --- | --- | --- | --- |
| Register() | username <br> password <br> email <br> phone | {token, uuid} | User(create) <br> Token(create) |
| Login() | username <br> password | {token, uuid} | User(get) <br> Token(create) |
| SearchFriend() | name/email/phone | {friendName, frindUuid} | User(get) |
| ListMyFriends() | userUuid | [{ friendName, friendUuid, lastUpdateTimestamp }] | Friend(list) <br> Msg(get) |
| Invite() | userUuid <br> friendUuid | - | Friend(create) |
| Accept() | userUuid <br> friendUuid | - | Friend(update) |
| RemoveFriend() | userUuid <br> friendUuid | - | Friend(delete) |
| CheckUpdates() | userUuid | [{ friendName, unread#/newStatus, lastUpdateTimestamp }] | Msg cache (get) |
| ReadDialog() | userUuid <br> friendUuid | [message] | Msg (get) |
| SendMsg() | userUuid <br> friendUuid <br> text | - | Msg (update) |

### Storage Schema

##### User

```
const UserSchema = new Schema({
	uuid: String,
	name: String,
	password: String,
	email: String,
	phone: String,
});
```

##### AccessToken (cache)

```
Map: userUuid => {
	token: String,
	expireTimestamp: Number
}
```

##### Friendship (including Message)

```
const MessageSchema = new Schema({
	text: String,
	timestamp: Number,
	isRead: Boolean,
});
const FriendshipStatus = {
	PENDING: "pending",
	ACCEPTED: "accepted",
	DELETED: "deleted",
}
const FriendSchema = new Schema({
	inviterId: string,
	inviteeId: string,
	status: String,
	timestamp: Number,
	messages: [MessageSchema],
});
```

##### UnreadMessage cache

```
Map: userUuid => friendUuid => {
	unreadNum: Number,
	lastUpdateTimestamp: Number,
}
```

##### FriendshipChange

```
Map: userUuid => friendUuid => {
	newStatus: String,
	lastUpdateTimestamp: Number,
}
```