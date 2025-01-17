class ResourceIdentifiers {
    constructor(new_record) {
        this.ids = $('div.identifier-fields');
        this.id_0 = $('#resource_id_0_');
        this.id_1 = $('#resource_id_1_');
        this.id_2 = $('#resource_id_2_');
        this.id_3 = $('#resource_id_3_');

        this.new_record = new_record;
    }


    disable($field) {
        $field.attr('readonly', 'readonly');
        $field.attr('tabindex', '-1');
        $field.on("focus", function(e) {
            $(this).blur();
            e.stopPropagation();
        });

        $field.on("change", function(e) {
            e.stopPropagation();
        });
    }


    init() {
        const self = this;

        if (self.new_record) {
            self.ids.removeClass('required');
            self.disable(self.id_0);
            self.disable(self.id_1);

            if (!self.id_0.val().length) {
            self.id_0.removeAttr('disabled');
            self.id_0.val('XXXX');
            }

        }


        self.load_department_codes();
    }


    load_department_codes() {
        $.ajax({
            url: APP_PATH + "plugins/aspace_identifiers/department_codes",
            data: {},
            dataType: 'json',
            type: "GET",
            success: function(department_list) {
                const codes = department_list.codes;
                const current_code = $('#resource_id_1_').val();

                // Deprecated department codes
                if (current_code.length && $.inArray(current_code, codes) < 0) {
                    codes.push(false);
                    codes.push(current_code);
                }

                if (codes.length > 1) {
                    let html = "<select id=\"resource_id_1_\" name=\"resource[id_1]\">";
                    $.each(codes, function(i, code) {
                        if (code == current_code) {
                            html += "<option value=\"" + code + "\" selected=\"selected\">" + code + "</option>";
                        } else if (code == false) {
                            html += "<option disabled>&#9472;</option>";
                        } else {
                            html += "<option value=\"" + code + "\">" + code + "</option>";
                        }

                    });

                    html += "</select>"
                    $('#resource_id_1_').replaceWith(html);
                    $('#resource_id_2_').removeAttr('disabled');
                } else if (codes.length == 1) {
                    $('#resource_id_1_').val(codes[0]);
                    $('#resource_id_1_').removeAttr('disabled');
                    self.disable($('#resource_id_2_'));
                    $('#resource_id_2_').removeAttr('disabled');
                } else {
                    $('#resource_id_1_').attr('disabled', 'disabled');
                }
            },
        });
    }
}
