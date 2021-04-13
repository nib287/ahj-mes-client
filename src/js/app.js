import '../css/style.css';
import Controller from './controller.js';

const controller = new Controller('wss://ahj-messenger.herokuapp.com/wss');
controller.init();