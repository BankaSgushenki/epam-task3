var currentWindowWidth = 0;

var yotubeCollection;

window.onresize =  function()
{
    if (self.innerWidth - currentWindowWidth > 300) {
        currentWindowWidth = self.innerWidth;
        var index = (currentWindowWidth - currentWindowWidth % 300)/300 - 1;
        addElement(index, window.yotubeCollection[index], 300); 
    }

    if (currentWindowWidth - self.innerWidth > 300){
        currentWindowWidth = self.innerWidth;
        var parent = document.getElementById("content");
        parent.removeChild(parent.lastChild); 
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
    container.firstChild.onmousemove  = mouseMoveEvent;
    container.firstChild.onmouseout  = mouseOutEvent;
return container.firstChild;
}

function createMainContent(className) {
    'use strict';
    var container = document.createElement('div');
    container.innerHTML = '<div id = "content" class="' + className + '"> \
    <input type = "text" class = "searchBox"></input> \
    <input type = "button" value = "Search" onclick = "test()" class = "searchButton"></input> \
    <div class= "tooltip"></div> \
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
    setPosition(container, (elementWidth + 10) * number);
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
    yotubeCollection = convertYouTubeResponseToClipList(data);

    for(index = 0; index < window.currentWindowWidth/300 - 1; index++) {
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
    var elements = parent.getElementsByTagName('div');
    for(var index = 0; index < elements.length; index++) {
       elements[index].parentNode.removeChild(elements[index]);
       console.log(index);
    }
}

var test = function() {
    clearAll();
    httpGet(createRequestURL());   
}

var mouseMoveEvent = function(event) {
    //event.target.parentNode.style.height = "550px";
    //console.log("sd");
}

var mouseOutEvent = function(event) {
    //event.target.parentNode.style.height = "500px";
    //console.log("sd");
}
// **************** Functions declarations *********************************//
currentWindowWidth = self.innerWidth;
old = self.innerWidth;
var content = createMainContent('content');
document.body.appendChild(content);
