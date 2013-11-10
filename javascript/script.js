selectStylesheet = function(styleId){
    var links = $( ".style-css" );
    links.each(function( index ) {
        this.disabled = true;
    });
    links.get(styleId).disabled = false;
}


menuClickAjax = function(element){
    $(".menuLink").removeClass("active");
    $(element).parent().addClass("active");
}

loadContent = function(file){
    var previousText = $("#content").html();
    $("#content").html("<img src='../css/ajax-loader.gif' alt='ajax_loader' class='ajaxLoader' />");
    $("#toggleButton").hide();
    var status = $("#statusLine");
        $.get( "content/php_content/"+file, function(data) {
        $("#content").html(data);
        status.removeClass("alert-danger");
        status.addClass("alert-success");
        status.text("Successful loading page!")
        $( "#detailedDescription" ).hide();
        $("#toggleButton").show();
    })
    .fail(function() {
        status.removeClass("alert-success");
        status.addClass("alert-danger");
        status.text("Fail loading page!");
        $("#content").html(previousText);
    })
}

$( document ).ready(function() {
    //at the beginning we disable all links, because of firefox(disabled=true doesn't work)
    selectStylesheet(0);
    $("#toggleButton").hide();
    loadContent("home.php");

    $( ".styleButton" ).click(function(){
        if(this.id == "style2"){
            selectStylesheet(1);
        }
        else if(this.id == "style3"){
            selectStylesheet(2);
        }
        else{
            selectStylesheet(0)
        }
    });

    $("#toggleButton").click(function(){
        var description = $( "#detailedDescription" );
        var button = $("#toggleButton");
        description.toggle( "blind",1000,function(){
            if(description.is(":visible")){
                button.text("Close");
            }
            else{
                button.text("Read more...");
            }
        })
    });


});

