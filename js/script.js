'use strict';

document.addEventListener('DOMContentLoaded', ()=>{

    const tabContent = document.querySelectorAll('.tabcontent'),
    tabParent = document.querySelector('.tabheader__items'),
    tabItems = tabParent.querySelectorAll('.tabheader__item');


    function HiddenContent() {
        tabContent.forEach( item =>{
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabItems.forEach((item)=>{
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

tabParent.addEventListener('click', (event)=>{
    const target = event.target;

    if(target && target.classList.contains('tabheader__item')){
       tabItems.forEach((item, i)=>{
        if(target == item){
        HiddenContent();
        showContent(i);
        }
       });
    }
});


});