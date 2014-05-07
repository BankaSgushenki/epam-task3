var tilesNumber = 0;
var firstTileNumber = 0;
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
        var parent = document.getElementById("content");
        parent.removeChild(parent.lastChild);
        window.lastElementNumber --;
        window.tilesNumber--;
    }
    updateTooltip();
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
    container.innerHTML = '<div id = "' + rawYouTubeData.indexNumber + '" class="' + className + '"> \
    <div class= "title" >' + rawYouTubeData.title + ' </div> \
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
    <input class = "scrollSetup" type = "text" placeholder="Scroll speed" id = "scrollSetup"></input> \
    <input type = "text" placeholder="Youtube search" onkeyup  = "searchEvent(event)" class = "searchBox" id = "searchBox"></input> \
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
        indexNumber: i,
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
    window.firstTileNumber = 0;
    window.selectedTile = 0;
    window.mouseX = 0;
    window.lastElementNumber = 0;

    window.tilesNumber = (self.innerWidth - self.innerWidth % 300) / 300 - 1;
    yotubeCollection = convertYouTubeResponseToClipList(data);
    for(index = 0; index < window.tilesNumber; index++) {
        addElement(index, yotubeCollection[index], 300);             
    }
    createElementsMap();
    lastElementNumber = window.tilesNumber;
    updateTooltip();
}

function createRequestURL() {
    var url = "http://gdata.youtube.com/feeds/api/videos/?callback=myJsonPCallback&v=2&alt=json&max-results=15&start-index=1&q=";
    var request = document.getElementById("searchBox").value;
    url += request;
    return (url);
}

function removeContainer(container) {
    var parent = document.getElementById("content");
    parent.removeChild(container);
}

function clearAll() {
    var index;
    if(window.tilesNumber!=0) {
        var parent = document.getElementById("content");
        var elements = parent.children;
        for(index = 0; index < window.tilesNumber; index++) {
            parent.removeChild(parent.lastChild);
        }
        var tooltip = document.getElementById("tooltip");
        elements = tooltip.children;
        var length = elements.length;
        for(index = 0; index < length; index++) {
            console.log(elements.length);
            tooltip.removeChild(tooltip.lastChild);
        }
    }
}

function selectingItem(item) {
    var parent = document.getElementById("content");
    var elements = parent.children;
    for(var index = 0; index < elements.length; index++) {
        elements[index].style.height = "500px";
    }
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
    var scrollSpeed;
    var setupFild = document.getElementById("scrollSetup");
    if(setupFild.value == '')
        scrollSpeed = 1;
    else
        scrollSpeed = setupFild.value;
    if ((window.mouseX - event.pageX > 200) && (lastElementNumber < yotubeCollection.length)) {
       scrollForward(scrollSpeed);
    }
    
    if ((event.pageX - window.mouseX > 200) && (firstTileNumber > 0)){
       scrollBack(scrollSpeed);
    }
        
}

function scrollForward(distance) {
    var content = document.getElementById("content");
    var index;
    for(index = 0; index < distance; index++) {
        content.removeChild(content.firstChild);
        addElement(tilesNumber, yotubeCollection[lastElementNumber], 300); 
        window.lastElementNumber ++;
        window.firstTileNumber ++;
    }
    var elements = content.children;
    for(index = 0; index < tilesNumber; index++) {
        setPosition( elements[index], (300 + 40) * index);
    }
    updateTooltip();
}

function scrollBack(distance) {
     var index;
     for(index = 0; index < distance; index++) {
        var content = document.getElementById("content");
        console.log(index);
        content.removeChild(content.lastChild);
        window.lastElementNumber --;
        window.firstTileNumber --;
    var elements = content.children;
    var container = createComponent('container', yotubeCollection[lastElementNumber - tilesNumber], 0);
    setPosition(container, (300 + 40) * 0);
    content.insertBefore(container, content.firstChild);
     }
     for(index = 0; index < tilesNumber; index++) {
        setPosition( elements[index], (300 + 40) * (index));
    }
    updateTooltip();
}


var mouseClickEvent = function(event) {
    selectingItem(event.target.parentNode);
    window.selectedTile = event.target.parentNode.getAttribute("id");
}

var onTooltipClickEvent = function(event) {
    window.selectedTile = event.target.getAttribute("id");  
    
    if (( selectedTile < lastElementNumber)&&(selectedTile >= firstTileNumber)) {
        var parent = document.getElementById("tooltip");
        var elements = parent.children;
        updateTooltip();
        event.target.style.background = "#6aaad1";
        var item = document.getElementById(window.selectedTile);
        selectingItem(item);
    }
    else if (selectedTile >= lastElementNumber){
        scrollForward(selectedTile - lastElementNumber + 1);
        var parent = document.getElementById("tooltip");
        var elements = parent.children;
        updateTooltip();
        event.target.style.background = "#6aaad1";
        var item = document.getElementById(window.selectedTile);
        selectingItem(item);
    }
    else if (selectedTile < firstTileNumber){
        scrollBack(firstTileNumber - selectedTile);
        var parent = document.getElementById("tooltip");
        var elements = parent.children;
        updateTooltip();
        event.target.style.background = "#6aaad1";
        var item = document.getElementById(window.selectedTile);
        selectingItem(item);
    }
}

function addToToolltip(index) {
    var tooltip = document.getElementById("tooltip");
    var prototype = document.createElement('div');
    prototype.innerHTML = '<div id = "' + index + '" class="tileLink"></div>'
    setPosition(prototype.firstChild, (200 + index* 50));
    prototype.firstChild.onclick  = onTooltipClickEvent;
    tooltip.appendChild(prototype.firstChild);
}

function removeFromToolTip() {
    var tooltip = document.getElementById("tooltip");
    tooltip.removeChild(tooltip.lastChild);
}

function createElementsMap() {
    var index;
    var tooltip = document.getElementById("tooltip");
    for(index = 0; index < yotubeCollection.length; index ++) {
        addToToolltip(index);
    }    
}

function updateTooltip() {
    var index;
    var tooltip = document.getElementById("tooltip");
    var links = tooltip.children;
    for(index = 0; index < links.length; index ++) {
        if (index < firstTileNumber)
            links[index].style.background = "#fff";
        if ((index >= firstTileNumber) && (index < lastElementNumber))
            links[index].style.background = "#c8e1ef";
        else
            links[index].style.background = "#fff";
    }    
}

// **************** Functions declarations *********************************//
var header = createHeader('header');
document.body.appendChild(header);

var content = createMainContent('content');
document.body.appendChild(content);

var tooltip = createToolTip('tooltip');
document.body.appendChild(tooltip);
