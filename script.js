var tilesNumber = 0;
var selectedTile = 0;
var mouseX = 0;
var lastElementNumber = 0;

var yotubeCollection;


window.onresize =  function () {
    if ((freePlaceExists()) && (tilesNumber > 0)) {
        addElement(tilesNumber, yotubeCollection[tilesNumber], 300);
        window.tilesNumber++;
        window.lastElementNumber ++;
    }

    if (((tilesNumber + 1) * 300 - self.innerWidth > 300) && (tilesNumber >1)) {
        window.tilesNumber--;
        var parent = document.getElementById("content");
        parent.removeChild(parent.lastChild);
        removeFromToolTip();
    }
}

function freePlaceExists() {
    if (self.innerWidth - window.tilesNumber * 300 > 500) {
        return true;      
   }
    else {
        return false;    
    }
}

function createComponent(className, rawYouTubeData, number) {
    'use strict';
    var container = document.createElement('div');
    container.innerHTML = '<div id = "' + number + '" class="' + className + '"> \
    <div class= "title">' + rawYouTubeData.title + ' </div> \
    <iframe src= "' + rawYouTubeData.youtubeLink + '" allowfullscreen="" frameborder="0"></iframe> \
    <div class = "description"> ' + rawYouTubeData.description + '</div> \
    <div class= "author">' + rawYouTubeData.author + '</div> \
    <div class= "data">' + rawYouTubeData.publishDate + '</div> \
    <div class= "views">' + rawYouTubeData.viewCount + '</div> \
    </div>';
    container.firstChild.onclick  = mouseClickEvent;
    return container.firstChild;
}

function createMainContent(className) {
    'use strict';
    var container = document.createElement('div');
    container.innerHTML = '<div id = "content" class="' + className + '"></div>';
    container.firstChild.onmousedown = mouseDownEvent;
    container.firstChild.onmouseup = mouseUpEvent;
    return container.firstChild;
}

function createToolTip(className) {
    'use strict';
    var container = document.createElement('div');
    container.innerHTML = '<div id = "tooltip" class="' + className + '"> \
    </div>';
    return container.firstChild;
}

function createHeader(className) {
    'use strict';
    var container = document.createElement('div');
    container.innerHTML = '<div id = "header" class="' + className + '"> \
    <input type = "text" placeholder="Youtube search" onkeyup  = "searchEvent(event)" class = "searchBox"></input> \
    </div>';
    return container.firstChild;
}

function setPosition(container, horizontalMargin) {
    container.style.left = 50 + horizontalMargin + 'px';
}

function addElement(number, someContent , elementWidth) {
    'use strict';
    var parent = document.getElementById("content");
    var container = createComponent('container', someContent, number);
    setPosition(container, (elementWidth + 40) * number);
    parent.appendChild(container);
    addToToolltip(number);
}

function convertYouTubeResponseToClipList(rawYouTubeData) {
    var clipList = [];
    var entries = rawYouTubeData.feed.entry;
    if (entries) {
        for (var i = 0, l = entries.length; i < l; i++){
        var entry = entries[i];
        var date = new Date(Date.parse(entry.updated.$t));
        var shortId = entry.id.$t.match(/video:.*/).toString().split(":")[1];
        clipList.push({
        id: shortId,
        youtubeLink: "http://www.youtube.com/embed/" + shortId,
        title: entry.title.$t,
        thumbnail: entry.media$group.media$thumbnail[1].url,
        description: entry.media$group.media$description.$t,
        author: entry.author[0].name.$t,
        publishDate: date.toUTCString(),
        viewCount: entry.yt$statistics.viewCount
                    });
                }
        }
    return clipList;
}

function httpGet(Url) {
    var script = document.createElement("script");
    script.src = Url;
    document.body.appendChild(script);
}

function myJsonPCallback(data) {
    var index;
    clearAll();
    window.tilesNumber = (self.innerWidth - self.innerWidth % 300) / 300 - 1;
    yotubeCollection = convertYouTubeResponseToClipList(data);
    for(index = 0; index < window.tilesNumber; index++) {
        addElement(index, yotubeCollection[index], 300);             
    }
    lastElementNumber = window.tilesNumber;
}

function createRequestURL() {
    var url = "http://gdata.youtube.com/feeds/api/videos/?callback=myJsonPCallback&v=2&alt=json&max-results=15&start-index=1&q=";
    var request = document.querySelector('input[type="text"]').value;
    url += request;
    return (url);
}

function removeContainer(container) {
    var parent = document.getElementById("content");
    parent.removeChild(container);
}

function clearAll() {
    if(window.tilesNumber!=0) {
        var parent = document.getElementById("content");
        var elements = parent.children;
        for(var index = 0; index < window.tilesNumber; index++) {
            parent.removeChild(parent.lastChild);
        }
    }
}

function selectingItem(item) {
    var parent = document.getElementById("content");
    var elements = parent.children;
    for(var index = 1; index < elements.length; index++) {
        elements[index].style.border = "solid #6c6c6c 2px";
        elements[index].style.height = "500px";
    }
    item.style.border = "solid grey 5px";
    item.style.height = "560px";
}

var searchEvent = function(event) {
    if((event.keyCode==13)||(event.keyCode==32)) { 
        httpGet(createRequestURL()); 
    }
}

var mouseDownEvent = function(event) {
    window.mouseX = event.pageX;
}

var mouseUpEvent = function(event) {
    if (window.mouseX - event.pageX > 200) {
        var content = document.getElementById("content");
        content.removeChild(content.firstChild);     
        var elements = content.children;
        addElement(tilesNumber, yotubeCollection[lastElementNumber], 300);  
        for(var index = 0; index < tilesNumber; index++) {
            setPosition( elements[index], (300 + 40) * index);
        }
        window.lastElementNumber ++;
    }
    
    if (event.pageX - window.mouseX > 200) {
        var content = document.getElementById("content");
        content.removeChild(content.lastChild);
        window.lastElementNumber --;
        var elements = content.children;
        
         for(var index = 0; index < tilesNumber - 1; index++) {
            setPosition( elements[index], (300 + 40) * (index + 1));
        }     
      
        var container = createComponent('container', yotubeCollection[lastElementNumber - tilesNumber], 0);
        setPosition(container, (300 + 40) * 0);
        content.insertBefore(container, content.firstChild);
        addToToolltip(number);
           
        
    }
        
}

var mouseClickEvent = function(event) {
    selectingItem(event.target.parentNode);
    window.selectedTile = event.target.parentNode.getAttribute("id");
}

var onTooltipClickEvent = function(event) {
    window.selectedTile = event.target.getAttribute("id");
    
    var parent = document.getElementById("tooltip");
    var elements = parent.children;
    for(var index = 0; index < elements.length; index++) {
        elements[index].style.background = "#eaeaea";
    }
    event.target.style.background = "black";
    var item = document.getElementById(window.selectedTile);
    selectingItem(item);
}


function addToToolltip(tilesNumber) {
    var tooltip = document.getElementById("tooltip");
    var prototype = document.createElement('div');
    prototype.innerHTML = '<div id = "' + tilesNumber + '" class="tileLink"></div>'
    setPosition(prototype.firstChild, (500 + tilesNumber* 50));
    prototype.firstChild.onclick  = onTooltipClickEvent;
    tooltip.appendChild(prototype.firstChild);
}

function removeFromToolTip() {
    var tooltip = document.getElementById("tooltip");
    tooltip.removeChild(tooltip.lastChild);
}

// **************** Functions declarations *********************************//
var header = createHeader('header');
document.body.appendChild(header);

var content = createMainContent('content');
document.body.appendChild(content);

var tooltip = createToolTip('tooltip');
document.body.appendChild(tooltip);
