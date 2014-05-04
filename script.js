var tilesNumber = 0;

var yotubeCollection;

window.onresize =  function () {
    if (freePlaceExists()) {
        addElement(tilesNumber, yotubeCollection[tilesNumber], 300);
        window.tilesNumber++;
    }

    if (((tilesNumber + 1) * 300 - self.innerWidth > 300) && (tilesNumber !=1)) {
        window.tilesNumber--;
        var parent = document.getElementById("content");
        parent.removeChild(parent.lastChild);
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

function createComponent(className, rawYouTubeData) {
    'use strict';
    var container = document.createElement('div');
    container.innerHTML = '<div class="' + className + '"> \
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
    container.innerHTML = '<div id = "content" class="' + className + '"> \
    <input type = "text" placeholder="Youtube search" onkeyup  = "searchEvent(event)" class = "searchBox"></input> \
    </div>';
return container.firstChild;
}

function createToolTip(className) {
    'use strict';
    var container = document.createElement('div');
    container.innerHTML = '<div class="' + className + '"> \
    </div>';
return container.firstChild;
}

function setPosition(container, horizontalMargin) {
    container.style.left = horizontalMargin + 'px';
}

function addElement(number, someContent , elementWidth) {
    'use strict';
    var parent = document.getElementById("content");
    var container = createComponent('container', someContent);
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
    yotubeCollection = convertYouTubeResponseToClipList(data);
    for(index = 0; index < window.tilesNumber; index++) {
        addElement(index, yotubeCollection[index], 300);             
    }
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
    var parent = document.getElementById("content");
    var elements = parent.children;
    for(var index = 1; index < elements.length; index++) {
        elements[index].parentNode.removeChild(elements[index]);
        parent.removeChild(elements[index]);
        console.log(index);
    }
}

var searchEvent = function(event) {
    if((event.keyCode==13)||(event.keyCode==32)) {
    clearAll();
    httpGet(createRequestURL()); 
    }
}

var test = function() {
    clearAll();
}

var mouseClickEvent = function(event) {
    var parent = document.getElementById("content");
    var elements = parent.children;
    for(var index = 1; index < elements.length; index++) {
        elements[index].style.border = "solid #6c6c6c 2px";
        elements[index].style.height = "500px";
    }
    event.target.parentNode.style.border = "solid grey 5px";
    event.target.parentNode.style.height = "560px";
}

// **************** Functions declarations *********************************//
window.tilesNumber = (self.innerWidth - self.innerWidth % 300) / 300;

var content = createMainContent('content');
document.body.appendChild(content);

var tooltip = createToolTip('tooltip');
document.body.appendChild(tooltip);
