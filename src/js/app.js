import '../css/style.css';
import Controller from './controller.js';

const controller = new Controller('ws://https://ahj-messenger.herokuapp.com');
controller.init();