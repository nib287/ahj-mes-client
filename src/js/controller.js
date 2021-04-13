export default class Controller {
    constructor(url) {
        this.formMessage = document.getElementsByClassName('form-message').item(0);
        this.containerMessages = document.getElementsByClassName('container').item(0);
        this.formLogin = document.getElementsByClassName('form-login').item(0);
        this.loginWrapper = document.getElementsByClassName('login').item(0);
        this.containerUsers = document.getElementsByClassName('logins').item(0);
        this.formLoginHeader = document.getElementsByClassName('form-login__header').item(0);
        this.user = null;
        this.url = url;
    }

    init() {
        const ws = new WebSocket(this.url);
        
        ws.addEventListener('message', (evt) => {
            const data = JSON.parse(evt.data);
            const {type} = data;

            switch(type) {
                case 'text':
                    const userStyle = this.getUserStyle(data.name);
                    this.createMessegeElement(data.value, userStyle.name, data.date, userStyle.color, userStyle.side); 
                    if(this.containerMessages.childNodes.length) {
                        this.containerMessages.lastElementChild.scrollIntoView(true);
                    }
                    break;

                case 'login':
                    if(this.user == data.name) this.loginWrapper.classList.add('hidden'); 
                    if(this.user != data.name) this.createUserElement(data.name);
                    break;                   
                
                case 'redraw':
                    if(this.user) {
                        data.messages.forEach(message => {
                            this.createMessegeElement(message.value, message.name, message.date);
                        });
                        this.containerUsers.innerHTML = '';
                        data.logins.forEach(login => {
                            const userLogin = this.getUserStyle(login);
                            this.createUserElement(userLogin.name, userLogin.color);
                        });
                        
                        if(this.containerMessages.childNodes.length) {
                            this.containerMessages.lastElementChild.scrollIntoView(true);
                        }
                    }
                    break;  
                   
                case 'delete':
                    const deleteLogin = document.getElementById(data.name)
                    if(deleteLogin) deleteLogin.remove();
                    break;  

                case 'error':
                    this.user = null;
                    this.formLoginHeader.innerText = data.message;
                    this.formLoginHeader.classList.add('color_red');
                    break;      
            }
        }); 
        
        this.formMessage.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = e.target.elements.message.value;
            if(message) {
                const messageObj = this.createRequestObject(e.target.elements.message.value, 'text', this.user)
                ws.send(messageObj);
                e.target.elements.message.value = '';
            }
        });
        
        this.formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            
            this.user = e.target.elements.login.value;
            const loginObj = this.createRequestObject(null, 'login', this.user);
            const redrawObj = this.createRequestObject(null, 'redraw', this.user);
            ws.send(loginObj);
            ws.send(redrawObj);
            
            e.target.elements.login.value = '';
        }); 
    }

    getUserStyle(name) {
        if(name == this.user) {
            return {
                name: 'Вы',
                color: 'color_orange',
                side: 'side_right'
            };
        } else {
            return {
                name: name
            };
        }
    }
    
    createRequestObject(value, type, name) {
        const requestObj = {};
        requestObj.value = value;
        requestObj.type = type;
        requestObj.name = name;
        requestObj.date = this.getDate();

        return JSON.stringify(requestObj);
    }

    getDate() {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
        };
        
        return  new Date().toLocaleString("ru", options);
    }

    createMessegeElement(textMessage, name, date, color = '', side = '') {
        this.containerMessages.insertAdjacentHTML('beforeend', `
            <li class="container__item">
                <div class="container__wrapper ${side}">
                    <div>
                        <span class="container__name ${color}">${name}</span>
                        <span class="container__time ${color}">${date}</span>
                    </div>
                    <p class="container__message">${textMessage}</p>
                </div>
            </li>
        `);
    }

    createUserElement(login, color = '') {
        this.containerUsers.insertAdjacentHTML('beforeend', `
            <li class="user__item" id="${login}">
                <span class="user__login ${color}">${login}</span>
            </li>
        `);
    }
}



