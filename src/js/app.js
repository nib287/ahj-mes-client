import '../css/style.css';
import Controller from './controller.js';

const controller = new Controller('ws://ahj-messenger.herokuapp.com/ws');
controller.init();