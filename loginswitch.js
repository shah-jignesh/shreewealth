$('#loginswitch').change(function(){

            if($(this).prop('checked')==true)
            {
                $('#loginform').attr('action','https://dataaccurate.in/FincorpOnline-CFP/login.asp');
                $('#flag').html('ADMIN LOGIN');
            }
            else
            {
              $('#loginform').attr('action','https://dataaccurate.in/clientnew/clogin.asp');
              $('#flag').html('CLIENT LOGIN');
            }
        });
