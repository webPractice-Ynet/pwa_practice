function Form (mark) {
	var form_mark, $form, form_data;
	var initFormData, setFormData;
    
    initFormData = function () {
        $form = document.getElementById(form_mark);
        form_data = new FormData($form);
    };
    setFormData = function () {

    };
	return {
		init: function () {
            form_mark = mark;
			return this;
		},
		validate: function () {
			return this;
		},
		setData: function () {
            setFormData();
			return this;
		},
		submit: function () {
            initFormData();
            this.validate();

			return this;
            
		},
	}
}