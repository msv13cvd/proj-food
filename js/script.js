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
        moladWindows = document.querySelector('.modal'),
        closeModal = moladWindows.querySelector('.modal__close');


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
    closeModal.addEventListener('click', closeModal2);

    moladWindows.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('modal')) {
            closeModal2();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code == 'Escape' && moladWindows.classList.contains('show')) {
            closeModal2();
        }
    });



});