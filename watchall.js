// ==UserScript==
// @name         All vids playlist
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Create all videos playlist, accessible from channel page
// @author       7KMANN
// @match        https://www.youtube.com/*
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgMTBIMTRWMTJIM1YxME0zIDZIMTRWOEgzVjZNMyAxNEgxMFYxNkgzVjE0TTE2IDEzVjIxTDIyIDE3TDE2IDEzWiIgLz48L3N2Zz4=
// @grant        none
// ==/UserScript==

let buttonexists = false;
let pattern = /^https:\/\/www\.youtube\.com\/.*\/videos$/;

function checkURL() {
    let url = window.location.href;
    if (pattern.test(url) && buttonexists == false) {
        //console.log("Good url")
        observer.disconnect();
        //console.log("Observer 1 disconnected")
        observer2.observe(document, config);
        //console.log("Observer 2 observing")
    } else if (buttonexists == true && pattern.test(url)) {
        //console.log("Good URL but button exists... doing nothing")
    } else {
        //console.log("Bad url removing mybutton")
        let mybuttons = document.querySelectorAll("#mybutton");
        for (let i = 0; i < mybuttons.length; i++) {
            mybuttons[i].remove();
        }
        buttonexists = false
    }
    
}

function waitsforbutton(){
    let realchipselement = document.querySelector('#chips yt-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"]')
    let mybutton = document.getElementById("mybutton");
    if (realchipselement && !mybutton){
        observer2.disconnect();
        //console.log("Observer 2 disconnected")
        addplusbutton();
        observer.observe(document, config);
        //console.log("Observer 1 observing")
    }
}

function playallclicked(){
    //console.log("Play all button clicked!")
    let linkElement = document.querySelector("link[rel='canonical']");
    let hrefValue = linkElement.getAttribute('href');
    let lastPart = hrefValue.split('/').pop();
    let newLastPart = replaceAt(1, 'U', lastPart);
    let newUrl = 'https://www.youtube.com/playlist?list=' + newLastPart;
    window.location.href = newUrl;

}

function replaceAt(index, replacement, string) {
    return string.substr(0, index) + replacement + string.substr(index + replacement.length);
}

function addplusbutton(){
    //console.log("Function Started")
    let chipsElement = document.querySelector('#chips yt-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"]').parentNode;
    //console.log(chipsElement)
    for (let i = 0; i < chipsElement.length; i++) {
        // Check the 'chip-style' attribute of the first child
        //console.log(chipsElement[i])
        if (chipsElement[i].firstElementChild.getAttribute('chip-style') === 'STYLE_DEFAULT') {
            chipsElement = chipsElement[i];
            //console.log("IF WORKED:",chipsElement.firstElementChild.getAttribute('chip-style'))
        } else {
            //console.log("WRONG ATTRIBUTE:",chipsElement[i].firstElementChild.getAttribute('chip-style'))
        }
    }
    //console.log(chipsElement)
    let childElements = chipsElement.children;
    for (let i = 0; i < childElements.length; i++) {
        if (!childElements[i].classList.contains('iron-selected')) {
            //console.log(childElements[i])
            buttonOriginal = childElements[i]
        }
    }
   
    let clonedButton = buttonOriginal.cloneNode(true);
    chipsElement.appendChild(clonedButton);
    clonedButton.removeAttribute('is-empty');
    clonedButton.setAttribute('title', 'Play every videos in channel');
    clonedButton.setAttribute('id', 'mybutton');
    clonedButton.innerHTML = "Play all";
    clonedButton.style.color = 'red';
    clonedButton.style.fontWeight = 'bolder';
    clonedButton.addEventListener('click', playallclicked);
    //console.log("Button added")
    //console.log(clonedButton)

    buttonexists = true;
    observer2.disconnect();
    //console.log("Observer 2 disconnected because button added")  
    //console.log("Observer state: ", observer.takeRecords().length == 0 ? "not observing" : "observing");
    //console.log("Observer2 state: ", observer2.takeRecords().length == 0 ? "not observing" : "observing");

}


let observer2 = new MutationObserver(waitsforbutton);
let observer = new MutationObserver(checkURL);
let config = { attributes: true, childList: true, characterData: true, subtree: true };

observer.observe(document, config);



