$(function () {

  var $ids = $('div.identifier-fields');
  var $id_0 = $('#accession_id_0_');
  var $id_2 = $('#accession_id_2_');

  $('#accession_id_3_').hide();



  var init = function () {

    var disable = function($field) {
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

    $ids.removeClass('required');
    disable($id_0);
    disable($id_2);


    if (! $id_2.val().length) {
      $id_2.val('XXXX');
    }

    var date = $('#accession_accession_date_').val();
    if (date.length) update_fiscal_year(date);

    $.ajax({
      url: APP_PATH + "plugins/yale_accessions/department_codes",
      data: {},
      dataType: 'json',
      type: "GET",
      success: function(department_list) {
        var codes = department_list.codes;
        var current_code = $('#accession_id_1_').val();

        // Deprecated department codes
        if (current_code.length && $.inArray(current_code, codes) < 0) {
          codes.push(false);
          codes.push(current_code);
        }

        if (codes.length > 1) {
          var html = "<select id=\"accession_id_1_\" name=\"accession[id_1]\">";
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
          $('#accession_id_1_').replaceWith(html);
        } else if (codes.length == 1) {
          $('#accession_id_1_').val(codes[0]);
        } else {
          $('#accession_id_1_').attr('disabled', 'disabled');
        }
        
      },
    });
  }


  var update_fiscal_year = function (date_string) {
    var year = parseInt(date_string.substr(0, 4))
    var month = parseInt(date_string.substr(5, 2))

    var fyear = (month > 6 && year + 1) || year;

    $id_0.val(fyear);
  }


  init();

  // Whenever the accession date changes, update id_0 with the fiscal year
 
  var $fld = $('input#accession_accession_date_');

  $fld.change( function(event) {
    update_fiscal_year($fld.val());
  });

  var $btn = $fld.next('button');

  $btn.datepicker().on("changeDate", function() {
    update_fiscal_year($fld.val());
  });


})

