$('li a').click(function(e) {
        e.preventDefault();
        $('a').removeClass('active');
        $(this).addClass('active');
    });
