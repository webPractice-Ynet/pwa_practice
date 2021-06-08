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
		var temp = {};
		for (let data of form_data.entries()) { 
			temp[data[0]] = data[1];
		}

		form_data = JSON.stringify(temp);
    };

	setData_api = function () {

		var api_data = null,
			data_keys = [],
			data_key_name = null;
		
		for ( var api_counter = 0; api_counter < Object.keys(api_list).length; ++api_counter) {
			
			api_data = null;
			api_data = api_list[api_counter].getData_Api();
			if (api_data === null) {
				continue;
			}

			data_keys = [];
			data_keys = Object.keys(api_data);

			for ( var data_counter = 0; data_counter < data_keys.length; ++data_counter) {
				data_key_name = null
				data_key_name = data_keys[data_counter];
				form_data.append(
					data_key_name,
					api_data[data_key_name]
				);
			}
			
		}
	};

	post = function () {
		return new Promise(function(resolve, reject) {

			var url = "https://5i6bdmyj32.execute-api.ap-northeast-1.amazonaws.com/main/mail";
			$.ajax({
					url,
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
			
		data: {
			result: false,
			bot_token: null,
			bot_action: null,
		},

		getData_Api: function () {
            return {
				'bot_token': this.data.bot_token,
				'bot_action': this.data.bot_action,
			}
        },
		setFormData: function () {
			var data = this.getData_Api(),
				data_keys = Object.keys(data);
				data_key_name = null;

			for ( var i = 0; i < data_keys.length; ++i) {
				data_key_name = null;
				data_key_name = data_keys[i];
				form_data.append(
					data_key_name,
					data[data_key_name]
				);
			}
		},

		checkResult: function () {
			return this.data.result;
		},


		init: function () {
			this.data = {
				result: false,
				bot_token: null,
				bot_action: null,
			}

			return this;
		},

		boot: function () {
			let that = this;
			return grecaptcha.execute('6LdNqYgaAAAAAHvlcA8yJVeEFO2Y2-c9Os6j_75H', {action: 'submit'})//invisbleRecaptchaの公開キー
				.then(
					function(token) {
						that.init();
						//サーバ側の認証で使用します。
						that.data.result = true;
						that.data.bot_token = token;
						that.data.bot_action = "submit";
					},
					function () {
						that.init();
						alert("不正なアクセスです。");
					}
				);
		},
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
			return form_data;
		},

		submit: async function () {
			initFormData();

			await recaptcha.boot();
			console.log(recaptcha.checkResult());
			if (!recaptcha.checkResult()) {
				return;
			} else {
				recaptcha.setFormData();
			}
            
			
			setData_api();
			this.validate().setFormData();
			

			await post();

			return this;
            
		},
		setApi: function (obj) {
			api_list.push(obj);
			return this;
		},

	}
}

// function Recaptcha() {
			
// 	var data =  {
// 		result: false,
// 		bot_token: null,
// 		bot_action: null,
// 	};

// 	var getData_Api, checkResult, initData, boot;

// 	getData_Api = function () {
// 		return {
// 			'bot_token': data.bot_token,
// 			'bot_action': data.bot_action,
// 		}
// 	},
	
// 	checkResult = function () {
// 		return data.result;
// 	}


// 	initData = function () {
// 		data = {
// 			result: false,
// 			bot_token: null,
// 			bot_action: null,
// 		}

// 		return this;
// 	},

// 	boot = function () {
// 		return grecaptcha.execute('6LdNqYgaAAAAAHvlcA8yJVeEFO2Y2-c9Os6j_75H', {action: 'submit'})//invisbleRecaptchaの公開キー
// 			.then(
// 				function(token) {
// 					initData();
// 					//サーバ側の認証で使用します。
// 					that.bot_token = token;
// 					that.bot_action = "submit";
// 					that.result = true;
// 				},
// 				function () {
// 					that.init();
// 					alert("不正なアクセスです。");
// 					recaptcha_result = false;
// 				}
// 			);
// 	};

// 	return {
// 		getData_Api: getData_Api, 
// 		checkResult: checkResult, 
// 		initData: initData, 
// 		boot: boot
// 	}
// }


