function NativeCamera (camera_height, camera_width) {

    //props
    var video,canvas,ctx,w,h ,img;
    var camera_height = camera_height,
        camera_width = camera_width;
        
    // functions
    var open, setCanvas, submit;

    var r = 0.9;
    setCanvas = function () {
        video = document.getElementById('js-Camera__video');
        w = video.offsetWidth * r;
        h = video.clientHeight * r;

        canvas = document.getElementById('js-Canvas');
        canvas.setAttribute('width', w);
        canvas.setAttribute('height', h);

        img = document.getElementById('js-Camera__image');
        img.setAttribute('width', w);
        img.setAttribute('height', h);
        
        ctx = canvas.getContext('2d');
    };

    open = function () {
    
        navigator.mediaDevices = navigator.mediaDevices
        || ((navigator.mozGetUserMedia 
        || navigator.webkitGetUserMedia) ? {
            getUserMedia: function(c) {
                return new Promise(function(y, n) {
                    (navigator.mozGetUserMedia ||
                    navigator.webkitGetUserMedia).call(navigator, c, y, n);
                });
            }
        } : null);
        var constraints = { 
            video: { facingMode: 'environment', 
                // width: camera_height, height: camera_width 
            },
            audio: false,
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                video.srcObject = stream;
    
                video.onloadedmetadata = function(e) {
                    video.play();
                }
                
            })
            .catch(function(err) {
                console.log(err);
            });
    };
    
    submit = function (mark) {
       
        ctx.drawImage(video, 0, 0, w, h);
        canvas.toBlob(function(blob) {
          img = document.getElementById('js-Camera__image');
          img.src = window.URL.createObjectURL(blob);
        }, 'image/jpeg', 0.95);

        // stream.getTracks()[0].stop();
      
    };

    save = function (id) {

    };

    return {
        init: function(mark) {

            this.setCanvas();
            this.setSubmitEvent(mark);
            return this;
        },
        setCanvas: function () {
            setCanvas();
            return this;
        },
        setSubmitEvent: function (mark) {
            var that = this;
            $(mark).on('click', function () {
                that.setCanvas();

                submit(mark);
            });
            return this;
        },
        open: function () {
            open();
            return this;
        },
        
    };
}

function CameraManger () {

    // props
    var camera,
        saved_iamge_list = {},
        count,
        $saved_img_wrapped;
    
        // functions
    var saveImage;

    return {
        init: function (target_camera, camera_height, camera_width) {
            this.setCamera(target_camera, camera_height, camera_width)
                .setSaveEvent();
            return this;
        },
        setCamera: function (target_camera, camera_height, camera_width) {
            camera = NativeCamera (camera_height, camera_width);
            camera.init(target_camera).open();
            return this;
        },

        setSaveEvent: function () {
            var that = this;
            $('.a-Btn--save').on('click', function(e){
                var image_src = $("#js-Camera__image").attr("src");
                that.setImage(image_src);
                that.showSavedImages();
            });
            return that;
        },

        setImage: function (image_src) {
            saved_iamge_list = [];
            saved_iamge_list.push($('<p class="a-Img"><img src="' + image_src + '"></p>'));
        },

        showSavedImages: function () {
            $saved_img = $('#js-Camera__saved > .a-Img');
            $saved_img.remove();

            $saved_img_wrapped = $('#js-Camera__saved');
            for ( var i = 0; i < this.getSavedCount(); ++i ) {
                $saved_img_wrapped.append(saved_iamge_list[i]);
            }
        },
   
        getSavedCount: function () {
            count = Object.keys(saved_iamge_list).length;
            return count;
        },
        
    };
}