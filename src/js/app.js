import '../css/style.css';
import Controller from './controller.js';

const controller = new Controller('ws://localhost:7070/ws');
controller.init();