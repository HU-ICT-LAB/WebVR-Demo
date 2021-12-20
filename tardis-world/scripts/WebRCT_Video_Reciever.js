// make sure to include         <script src="https://cdn.jsdelivr.net/npm/ovenplayer/dist/ovenplayer.js"></script>

var WebRCT_StreamSources = []
var WebRCT_StreamAssets = []


AFRAME.registerComponent('webrct_stream', {
    schema: {
        source_link: {default: ""},
        width: {default: 16},
        height: {default: 9}
    },

    init: function(){
        var scene = document.querySelector("a-scene")
        var avideo = document.createElement("a-video")
        avideo.setAttribute("width", this.data.width)
        avideo.setAttribute("height", this.data.height)



        var player;
        if(WebRCT_StreamSources.includes(this.data.source_link)){

            var source_id = WebRCT_StreamAssets[WebRCT_StreamSources.indexOf(this.data.source_link)]
            setTimeout(function(){
                avideo.setAttribute("src", source_id)
                this.el.appendChild(avideo)
            }.bind(this, avideo), 150);

        }else{

            var assets = document.querySelector("a-assets")
            var vid_div = document.createElement("div")

            let len = WebRCT_StreamAssets.length

            vid_div.setAttribute("id", "div_source_" + len)
            assets.appendChild(vid_div)

            WebRCT_StreamSources.push(this.data.source_link)
            WebRCT_StreamAssets.push("#source_" + len)

            player = OvenPlayer.create("div_source_" + len, {
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

            setTimeout(function(){
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
 * A wrapper around the teleporter component so you can use it as a entity.
 */
AFRAME.registerPrimitive('a-webrct-stream', {
    // Attaches the `button` component by default..
    defaultComponents: {
      webrct_stream: {}
    },
  
    // Maps HTML attributes to the `teleporter` component properties
    mappings: {
      src: 'webrct_stream.source_link',
      width: 'webrct_stream.width',
      height: 'webrct_stream.height'
    }
});
//'ws://192.168.2.13:3333/app/stream'