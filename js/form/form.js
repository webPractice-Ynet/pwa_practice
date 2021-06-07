function Form () {
	// props
	var form_mark, form_data, recaptcha;
	var api_list = [];

	// funcs
	var initFormData, setFormData, setData_api, post;
    
    initFormData = function () {
    
		var $form = document.getElementById(form_mark);
		form_data = null;
        form_data = new FormData($form);
		// form_data = new FormData;
    };
    setFormData = function () {
		// form_data.append(
		// 	"data", 
		// 	// new Blob( [data], {type:"application/octet-stream"} )
		// );
    };

	setData_api = function () {

		var api_data = null;
		for ( var i = 0; i < Object.keys(api_list).length; ++i) {
			api_data = api_list[i].getData_Api();
			console.log(api_data);
			if (api_data !== null) {
				form_data.append(
					api_data.name, 
					api_data.data
				);
			}

			api_data = null;
		}
	};

	post = function () {
		return new Promise(function(resolve, reject) {
			var url = "https://1dtpncdx3c.execute-api.ap-northeast-1.amazonaws.com/main/test";
			$.ajax(url,
                {
					type: 'post',
					processData: false,
					contentType: false,
					data: form_data,
					dataType: "json",
					success: function(data) {
						alert( "SUCCESS" );
						// alert( data.message );
						console.log(data);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						alert( "ERROR" );
						console.log( textStatus );
						console.log( errorThrown );
					}
            });
		});
	};

	recaptcha = {
			
		result: false,
		bot_token: null,
		bot_action: null,

		init: function () {
			this.result = false;
			this.bot_token = null;
			this.bot_action = null;
		},

		boot: function () {
			let that = this;
			return grecaptcha.execute('6LdNqYgaAAAAAHvlcA8yJVeEFO2Y2-c9Os6j_75H', {action: 'submit'})//invisbleRecaptchaの公開キー
				.then(
					function(token) {
						that.init();
						//サーバ側の認証で使用します。
						that.bot_token = token;
						that.bot_action = "submit";
						that.result = true;
					},
					function () {
						that.init();
						alert("不正なアクセスです。");
						recaptcha_result = false;
					}
				);
		}
	}
	return {
		init: function (mark) {
			var that = this;

            form_mark = mark;
			document.getElementById(form_mark+"__submit").addEventListener('click', function(){
				that.submit();
			});
			return this;
		},
		validate: function () {
			return this;
		},
		setFormData: function () {
            setFormData();

			return this;
		},
		getFormData: function () {
			console.log(form_data);
			return form_data;
		},

		submit: async function () {
			await recaptcha.boot();
			if (!recaptcha.result) {
				return;
			}

            initFormData();
            
			this.validate().setFormData();
			
			setData_api();
			await post();

			return this;
            
		},
		setApi: function (obj) {
			api_list.push(obj);
			return this;
		},

	}
}
