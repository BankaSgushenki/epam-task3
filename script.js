
function createComponent(className, rawYouTubeData) {
    'use strict';
    var container = document.createElement('div');
    container.innerHTML = '<div class="' + className + '"> \
    <div class="title">' + rawYouTubeData.title + ' </div> \
    <iframe src="' + rawYouTubeData.youtubeLink + '" allowfullscreen="" frameborder="0"></iframe> \
    <p> ' + rawYouTubeData.description + '</p> \
  </div>';
return container.firstChild;
}

function createMainContent(className) {
    'use strict';
    var container = document.createElement('div');
    container.innerHTML = '<div id = "cont" class="' + className + '"> \
    <input type = "text" class = "searchBox"></input> \
    <input type = "button" onclick = "test()" class = "searchButton"></input> \
  </div>';
return container.firstChild;
}

function setPosition(container, horizontalMargin) {
    container.style.left = horizontalMargin + 'px';
}

function addElement(number, someContent , elementWidth) {
    'use strict';
    var parent = document.getElementById("cont");
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

function httpGet(theUrl) {
    var script = document.createElement("script");
    script.src = theUrl;
    document.body.appendChild(script);
}

function myJsonPCallback(data) {
    var yotubeCollection = convertYouTubeResponseToClipList(data);

    for(index = 0; index < yotubeCollection.length; index++) {
        addElement(index, yotubeCollection[index], 300);             
}
}

function createRequestURL() {
    var url = "http://gdata.youtube.com/feeds/api/videos/?callback=myJsonPCallback&v=2&alt=json&max-results=15&start-index=1&q=";
    var request = document.querySelector('input[type="text"]').value;
    url += request;
    return (url);
}

 var test = function() {
         httpGet(createRequestURL());   
    }


// **************** Functions declarations *********************************//

var content = createMainContent('content');
document.body.appendChild(content);
