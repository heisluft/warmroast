"use-strict";
var json = {};
let overlay = document.querySelector("#overlay");

const xhttp = new XMLHttpRequest();
xhttp.onload = function() {
    const loadDiv = document.getElementsByClassName("loading")[0];
    if(this.status >= 400) {
        loadDiv.innerHTML = "Error " + this.status + " encountered from backend!";
        return;
    }
    const stackDiv = document.getElementsByClassName("stack")[0];
    json = JSON.parse(this.responseText);
    processJson(stackDiv);
    stackDiv.style.display = "block";
    loadDiv.style.display = "none";
}
xhttp.open("GET", "/data", true);
xhttp.send();

let slideUp = (target, duration=500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout( () => {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
    }, duration);
}

let slideDown = (target, duration=500) => {

    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none') display = 'block';
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout( () => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
    }, duration);
}

function nameClicked(e) {
    let parent = this.parentElement;
    let childList = parent.getElementsByTagName("ul")[0];
    if (parent.classList.contains("collapsed")) {
        parent.classList.remove("collapsed");
        if(!childList.classList.contains("loaded")) { // Load children dynamically so we can be faster than the old servlet
            var o = parent, keys = [];
            while (!o.classList.contains("stack")) {
                if(o.classList.contains("node")) keys.push(o.firstElementChild.id);
                o = o.parentElement;
            }
            var subArray = json[keys.pop()];
            while (keys.length > 0) subArray = subArray["children"][keys.pop()];
            for (const [key, value] of Object.entries(subArray.children)) processNode(key, value, childList, 2, true);
            childList.classList.add("loaded");
        }
        slideDown(childList, 50);
    } else {
        parent.classList.add("collapsed");
        slideUp(childList, 50);
    }
}

function processNode(name, node, parent, depth = 2, wrap = false) {
    let div = document.createElement("div"), nameDiv = document.createElement("div"), childList = document.createElement("ul");
    div.className = 'node collapsed';
    nameDiv.className = 'name';
    nameDiv.id = name;
    nameDiv.innerHTML = name + "<span class='percent'>" + node.percent + "%</span><span class='time'>" + node.timeMs + " ms</span><span class='bar'><span class='bar-inner' style='width: " + node.percent + "%'></span></span>";
    div.appendChild(nameDiv);
    nameDiv.addEventListener("click", nameClicked);
    nameDiv.addEventListener("mouseenter", nameMouseEnter);
    childList.className = 'children';
    if(depth > 0) {
        for (const [key, value] of Object.entries(node.children)) processNode(key, value, childList, depth - 1, true);
        childList.classList.add("loaded");
    }
    div.appendChild(childList);
    if(wrap) {
        let li = document.createElement("li");
        li.appendChild(div);
        parent.appendChild(li);
    } else parent.appendChild(div);
}

function processJson(rootDiv) {
    for (const [key, value] of Object.entries(json)) processNode(key, value, rootDiv);
}


function extractTime(el) {
    var text = el.querySelector(":scope > .name").querySelector(":scope > .time").innerText.replace(/[^0-9]/, "");
    return parseInt(text);
}


function nameMouseEnter(event) {
    var thisTime = null;
    overlay.innerHTML = '';
    var parent = this.parentElement;
    while (!parent.classList.contains("stack")) {
        if(parent.classList.contains("node")) {
            var time = extractTime(parent);
            if (thisTime == null) {
                thisTime = time;
            } else {
                let el = document.createElement("span");
                el.innerText = ((thisTime / time) * 100).toFixed(2) + "%";
                el.style.top = parent.offsetTop + "px";
                overlay.append(el);
            }
        }
        parent = parent.parentElement;
    }
}