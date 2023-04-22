const addNotificationButton = document.querySelector('.notification__form button');
const clearNotificationButton = document.querySelector('.notification__list > button');
const notificationContainer = document.querySelector('.notification__list');
const notificationList = document.querySelector('.notification__list div');
const timeInput = document.querySelector('.notification__form input');
const messageArea = document.querySelector('.notification__form textarea');
const info = document.querySelector('.notification__info');

addNotificationButton.addEventListener('click', () => {
    const time = timeInput.value;
    const message = messageArea.value;

    if (!time || !message) {
        info.textContent = 'Укажите время и сообщение!';
        info.style.opacity = 1;
        setTimeout(() => {
            info.style.opacity = 0;
        }, 2000);
        setTimeout(() => {
            info.textContent = '';
        }, 2000);

        return;
    }

    localStorage.setItem(time, message);
    update();
});

clearNotificationButton.addEventListener('click', () => {
    if (localStorage.length && confirm('Очистить список уведомлений?')) {
        localStorage.clear();
        notificationContainer.hidden = true;
        update();
    } else if (!localStorage.length) {
        alert('Уведомлений нет!')
    }
});

notificationContainer.addEventListener('click', (evt) => {
    const time = evt.target.dataset.time;
    if (!time) {
        return;
    }
    
    localStorage.removeItem(time);
    update();
})

setInterval(() => {    
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    let currentMinutes = currentDate.getMinutes();
    if (currentHour < 10) {
        currentHour = '0' + currentHour;
    }
    if (currentMinutes < 10) {
        currentMinutes = '0' + currentMinutes;
    }

    const currentTime = `${ currentHour }:${ currentMinutes }`;

    for (const key of Object.keys(localStorage)) {
        const [ keyHour, keyMinutes ] = key.split(':');
        if (key === currentTime || 
            (parseInt(keyHour) < currentHour) || 
            (parseInt(keyHour) === currentHour && parseInt(keyMinutes) <= currentMinutes)) {

            document.querySelector(`button[data-time="${ key }"]`)
                .closest('.notification__item')
                .classList.add('notification_warning');

            const audioAlert = document.querySelector('.audio');
            if (!audioAlert) {
                document.body.insertAdjacentHTML('afterbegin', `
                    <audio loop class="audio">
                        <source src="../audio/alert.mp3" type="audio/mp3">
                    </audio>
                `);
                
                try { 
                    document.querySelector('.audio').play();
                } catch (e) {}
            }
        }
    }
}, 1000);

function update() {    
    notificationContainer.hidden = !localStorage.length;
    notificationList.innerHTML = '';
    info.textContent = '';

    for (const key of Object.keys(localStorage)) {
        notificationList.insertAdjacentHTML('beforeend', `
            <div class="notification__item">
                <p>${ key } - ${ localStorage.getItem(key) }</p>
                <button data-time="${ key }">&times;</button>   
            </div>
        `);
    }

    timeInput.value = '';
    messageArea.value = '';
    const audioAlert = document.querySelector('.audio');
    if (audioAlert) {
        audioAlert.remove();
    }
}

update();