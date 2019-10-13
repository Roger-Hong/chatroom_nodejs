import { combineReducers } from 'redux'
import checkDialog from './checkDialog'
import inputMessage from './inputMessage'
import sendMessage from './sendMessage'

export default combineReducers({
  checkDialog,
  inputMessage,
  sendMessage
})