// make sure to include         <script src="https://cdn.jsdelivr.net/npm/ovenplayer/dist/ovenplayer.js"></script>

var WebRCT_StreamSources = []
var WebRCT_StreamAssets = []


/**
 * A component for webrct streams. It creates an a-video and sets it source.
 * It makes use of the OvenPlayer video player to recieve the WebRCT stream and attach it to a video component.
 * 
 * This OvenPlayer is added to the a-assets section, and we add an ID to the video entity it contains.
 * This video entity can then be used as a source for our a-video entity.
 */
AFRAME.registerComponent('webrct_stream', {
    /**
     * source_link: the ws or wss WebRCT source link
     * width: the desired width of the entity
     * height: the desired height of the entity
     */
    schema: {
        source_link: {default: ""},
        width: {default: 16},
        height: {default: 9}
    },

    /**
     * Initialisation function of the component,
     * Creates the a-video entity, adds sources to the a-assets and sets the source to the entity.
     */
    init: function(){
        var avideo = document.createElement("a-video") //create the a-video component
        avideo.setAttribute("width", this.data.width)
        avideo.setAttribute("height", this.data.height)



        var player;
        if(WebRCT_StreamSources.includes(this.data.source_link)){ //check if we already have a source div to this link

            var source_id = WebRCT_StreamAssets[WebRCT_StreamSources.indexOf(this.data.source_link)] //get the source id that coresponds with the link
            setTimeout(function(){ //we delay it to make sure the div is ready
                avideo.setAttribute("src", source_id)
                this.el.appendChild(avideo)
            }.bind(this, avideo), 150);

        }else{

            var assets = document.querySelector("a-assets")
            var vid_div = document.createElement("div")

            let len = WebRCT_StreamAssets.length

            vid_div.setAttribute("id", "div_source_" + len)
            assets.appendChild(vid_div)

            WebRCT_StreamSources.push(this.data.source_link) //add the link to the link list
            WebRCT_StreamAssets.push("#source_" + len) //add the name to the asset list

            player = OvenPlayer.create("div_source_" + len, { //create the player object
                sources: [
                    {
                        label: 'label_for_webrtc',
                        // Set the type to 'webrtc'
                        type: 'webrtc',
                        // Set the file to WebRTC Signaling URL with OvenMediaEngine 
                        file: this.data.source_link
                    }
                ]
            });

            setTimeout(function(){ //we delay it to make sure the player has been initialised before we continue
                var vid = player.getMediaElement()
                vid.setAttribute("id", "source_" + len)
                avideo.setAttribute("src", "#source_" + len)
                player.play()
                this.el.appendChild(avideo)
    
            }.bind(this, player, avideo, len), 100);
        }
    }
})


/**
 * A wrapper around the webrct_stream component so you can use it as a entity.
 */
AFRAME.registerPrimitive('a-webrct-stream', {
    // Attaches the `webrct_stream` component by default..
    defaultComponents: {
      webrct_stream: {}
    },
  
    // Maps HTML attributes to the `webrct_stream` component properties
    mappings: {
      src: 'webrct_stream.source_link',
      width: 'webrct_stream.width',
      height: 'webrct_stream.height'
    }
});

//'ws://192.168.2.13:3333/app/stream'