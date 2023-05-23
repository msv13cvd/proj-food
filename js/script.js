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
    // ---- open modal 
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


    // ---- Menu Card

    class MenuCard {
        constructor(src, alter, title, descr, price, parentSelector, ...classes) {
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

        changeToRuB() {
            this.price = this.price * this.currency;
        }

        creatingMenuCard() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
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

    const postMenuCard = async (url) =>{
        const res = await fetch(url)

        if(!res.ok){
            throw new Error(`Данные не получены с url ${url}, статус ошибки ${res.statusText}`);
        }
        return await res.json();
    };
    
    postMenuCard('http://localhost:3000/menu')
    .then(data =>{
        data.forEach(({img, altimg, title, descr, price}) =>{
            new MenuCard(img, altimg, title, descr, price, '.menu .container').creatingMenuCard();
        })
    });

   

    // ---- Forms 

    const forms = document.querySelectorAll('form');

    const message = {
        loader: 'img/form/spinner.svg',
        saccess: 'Спасибо! Скоро мы с вами свяжемся',
        error: 'что то пошло не так',
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) =>{
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data, 
        });
        return await res.json();
    };

    function bindPostData(form) {

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageForm = document.createElement('img');
            messageForm.src = message.loader;
            messageForm.style.cssText = `
            display: block;
            margin: 0 auto;
            `
            form.insertAdjacentElement('afterend', messageForm);


            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.saccess);
                    messageForm.remove();
                })
                .catch(() => {
                    showThanksModal(message.error);
                })
                .finally(() => {
                    form.reset();
                })

        });
    };


    function showThanksModal(message) {
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
        setTimeout(() => {
            thianksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal2();
        }, 4000);
    }

    // ----- Slide
    const slidesImg = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          current = document.querySelector('#current'),
          total = document.querySelector('#total'),
          sliderWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(sliderWrapper).width; // 650 px
          let whidthImg = Math.round(parseFloat(width)) + 'px';
    let index = 1; 
    let offset = 0;
    

    if(slidesImg.length < 10){
        total.textContent = `0${slidesImg.length}`;
        current.textContent = `0${index}`;
    }else{
        total.textContent = slidesImg.length;
        current.textContent = index;
    }

    function calcWhidth(w){
        return +w.replace(/\D/g, '');
    };

    slidesImg.forEach(slide =>{
        slide.style.width = whidthImg;
    });
    slider.style.position = 'relative';
    let indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for(let i = 0; i < slidesImg.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i +1);
        dot.classList.add('dot');
        
        if(i == 0){
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }
    

    slidesField.style.transition = '.5s all'
    slidesField.style.display = 'flex';
    slidesField.style.width = slidesImg.length * 100 + '%';
    sliderWrapper.style.overflow = 'hidden';

    function plusNext(){
        if(index == slidesImg.length){
            index = 1;
        }else{
            index++;
        };
        if(slidesImg.length < 10){
            current.textContent = `0${index}`;
        }else{
            index;
        }
    };

    function minusPrev(){
        if(index == 1){
            index = slidesImg.length;
        }else{
            index--;
        }
        if(slidesImg.length < 10){
            current.textContent = `0${index}`;
        }else{
            index;
        }
    };

    
    
    next.addEventListener('click', ()=>{
        if(offset == calcWhidth(whidthImg) * (slidesImg.length - 1)){
            offset = 0;
        }else{
            offset += calcWhidth(whidthImg);
        };
        slidesField.style.transform = `translateX(-${offset}px)`;
        plusNext();

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[index - 1].style.opacity = 1;
         });

    prev.addEventListener('click', ()=>{
        if(offset == 0){
            offset = calcWhidth(whidthImg) * (slidesImg.length - 1);
        }else{
            offset -= calcWhidth(whidthImg);
        };

        slidesField.style.transform = `translateX(-${offset}px)`;
        minusPrev();
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[index - 1].style.opacity = 1;
    });
    dots.forEach( dot =>{

        dot.addEventListener('click', (e)=>{
            const slideTo = e.target.getAttribute('data-slide-to');
            index = slideTo;
            offset = calcWhidth(whidthImg) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;
            dots.forEach(dot => dot.style.opacity = '.5');
            if(slidesImg.length < 10){
                current.textContent = `0${index}`;
            }else{
                index;
            }
        dots[index - 1].style.opacity = 1;
        });
    });

    // ----Сalc Сalories---
    const result = document.querySelector('.calculating__result span');

    let  sex, height, weight, age, ratio;
    if(localStorage.getItem('sex')){
        sex = localStorage.getItem('sex');
    }else{
        sex = 'female';
        localStorage.setItem('sex', 'female');
    };
    if(localStorage.getItem('ratio')){
        ratio = localStorage.getItem('ratio');
    }else{
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    };

    function initActivClass(selector, activeClass){
        const element = document.querySelectorAll(selector);

        element.forEach(elem =>{
            elem.classList.remove(activeClass);

            if(elem.getAttribute('id') == localStorage.getItem('sex')){
                elem.classList.add(activeClass);
            }
            if(elem.getAttribute('data-ratio') == localStorage.getItem('ratio')){
                elem.classList.add(activeClass);
            }
        });
    }
    initActivClass('#gender div', 'calculating__choose-item_active');
    initActivClass('.calculating__choose_big div', 'calculating__choose-item_active');


    function calcCalories(){
        if(!sex || !height || !weight || !age || !ratio){
            result.textContent = 0;
            return;
        };

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }else{
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        };
    };
    calcCalories();


    function getStaticInfo(selector, activeClass){
        const elements = document.querySelectorAll(selector);

        elements.forEach(element =>{
            element.addEventListener('click', (event)=>{

                if(event.target.getAttribute('data-ratio')){
                    ratio = +event.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +event.target.getAttribute('data-ratio'));
                }else{
                    sex = event.target.getAttribute('id');
                    localStorage.setItem('sex', event.target.getAttribute('id'));
                }

                elements.forEach(elem =>{
                    elem.classList.remove(activeClass);
                });

                event.target.classList.add(activeClass);
                calcCalories();
            });
        });
    };
    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');


    function getDinamicInfo(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input', ()=>{

            if(input.value.match(/\D/)){
                input.style.border = '1px red solid';
            }else{
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')){
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            };
            calcCalories();
        });
    };
    getDinamicInfo('#height');
    getDinamicInfo('#weight');
    getDinamicInfo('#age');
});