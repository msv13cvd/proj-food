'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const tabContent = document.querySelectorAll('.tabcontent'),
        tabParent = document.querySelector('.tabheader__items'),
        tabItems = tabParent.querySelectorAll('.tabheader__item');


    function HiddenContent() {
        tabContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabItems.forEach((item) => {
            item.classList.remove('tabheader__item_active');
        });
    }



    function showContent(i = 0) {
        tabContent[i].classList.add('show', 'fade');
        tabContent[i].classList.remove('hide');

        tabItems[i].classList.add('tabheader__item_active');
    };

    HiddenContent();
    showContent();

    tabParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabItems.forEach((item, i) => {
                if (target == item) {
                    HiddenContent();
                    showContent(i);
                }
            });
        }
    });

    // ----- TIMER---

    let endTime = '2023-02-27';

    function timerCalculation(time) {
        let days, hours, minutes, seconds;
        let t = Date.parse(time) - Date.parse(new Date());
        if (t <= 0) {
            days = 0,
                hours = 0,
                minutes = 0,
                seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60) % 24));
            minutes = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            t: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        };
    };

    function getZero(num) {
        if (num <= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    };

    function setClock(time, parent) {
        const timer = document.querySelector(parent),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            setTimer = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            let ti = timerCalculation(time);
            days.innerHTML = getZero(ti.days);
            hours.innerHTML = getZero(ti.hours);
            minutes.innerHTML = getZero(ti.minutes);
            seconds.innerHTML = getZero(ti.seconds);

            if (ti.t == 0) {
                clearInterval(setTimer);
            }

        }
    }

    setClock(endTime, '.timer');

    // ----MODAL----------

    const btnModal = document.querySelectorAll('[data-modal]'),
        moladWindows = document.querySelector('.modal');


    function openModal() {
        moladWindows.classList.add('show');
        moladWindows.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        // clearTimeout(addModalTimer);
    }

    function closeModal2() {
        moladWindows.classList.add('hide');
        moladWindows.classList.remove('show');
        document.body.style.overflow = '';
    }
    // open modal 
    const addModalTimer = setTimeout(openModal, 60_000);


    btnModal.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight
            >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // close modal

    moladWindows.addEventListener('click', (event) => {
        if (event.target == moladWindows || event.target.getAttribute('data-close') == '') {
            closeModal2();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code == 'Escape' && moladWindows.classList.contains('show')) {
            closeModal2();
        }
    });


    // Menu Card

    class MenuCard{
        constructor(src, alter, title, descr, price, parentSelector, ...classes){
            this.src = src;
            this.alter = alter;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.currency = 75;
            this.changeToRuB();

        }

        changeToRuB(){
            this.price = this.price * this.currency;
        }

        creatingMenuCard(){
            const element = document.createElement('div');

            if(this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
            }else{
                this.classes.forEach(className => element.classList.add(className)); 
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alter}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
            `;       
            this.parent.append(element);
        }
    };

    new MenuCard(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        4,
        '.menu .container',  
    ).creatingMenuCard();

    new MenuCard(
        'img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        8,
        '.menu .container',
    ).creatingMenuCard();

    new MenuCard(
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        6,
        '.menu .container',
    ).creatingMenuCard();

    // Forms 
    
    const forms = document.querySelectorAll('form');

    const message = {
        loader: 'img/form/spinner.svg',
        saccess: 'Спасибо! Скоро мы с вами свяжемся',
        error: 'что то пошло не так',
    };

    forms.forEach(item =>{
        postData(item);
    });

    function postData(form) {

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageForm = document.createElement('img');
            messageForm.src = message.loader;
            messageForm.style.cssText = `
            display: block;
            margin: 0 auto;
            `
            form.insertAdjacentElement('afterend', messageForm)

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);
            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            const json = JSON.stringify(object);
            request.send(json);

            request.addEventListener('load', ()=>{
                if(request.status == 200){
                    console.log(request.response);
                    showThanksModal(message.saccess);
                    form.reset();
                    messageForm.remove();
                }else{
                    showThanksModal(message.error);
                    form.reset();
                }
            });

        });
    };


   function showThanksModal(message){
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thianksModal = document.createElement('div');
    thianksModal.classList.add('modal__dialog');
    thianksModal.innerHTML = `
    <div class="modal__content">
    <div class="modal__close" data-close>×</div>
    <div class="modal__title">${message}</div>
    </div>
    `

    document.querySelector('.modal').append(thianksModal);
    setTimeout(() =>{
        thianksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal2();
    }, 4000);
   }
});