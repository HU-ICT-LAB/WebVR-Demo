<script>
            AFRAME.registerComponent('hls_stream', {
                init: function(){
                    var video = document.getElementById('webcam_stream');
                    if(Hls.isSupported()) {
                        var hls = new Hls();
                        hls.loadSource('../video_stream_2/out.m3u8');
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED,function() {
                            video.play();
                        });
                        this.el.sceneEl.addEventListener('enter-vr', function(){
                            var video = document.getElementById('webcam_stream');
                            video.play()
                        })
                    }
                // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
                // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
                // This is using the built-in support of the plain video element, without using hls.js.
                // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
                // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
                    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = '../video_stream_2/out.m3u8';
                    video.addEventListener('loadedmetadata',function() {
                        video.play();
                    });
                    }
                }
            })
          </script>
          <script>
            var player
            AFRAME.registerComponent('ldash_stream', {
                init: function(){        
                    if (player) {
                        player.reset();
                    }

                    var video;
                    var url = "https://145.89.163.179:8080/app/stream/manifest_ll.mpd"

                    video = document.querySelector('#webcam_stream');
                    player = dashjs.MediaPlayer().create();
                    player.updateSettings({ 'streaming': { 'lowLatencyEnabled': true } });
                    player.initialize(video, url, true);
                    player.updateSettings({
                        streaming: {
                            delay: {
                                liveDelay: 1
                            },
                            liveCatchup: {
                                minDrift: 0.02,
                                playbackRate: 0.5,
                                latencyThreshold: 60,
                            }
                        }
                    });
                }
            })
          </script>