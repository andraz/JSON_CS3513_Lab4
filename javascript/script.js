var allBooks;
var selectedBooks;

selectStylesheet = function(styleId){
    var links = $( ".style-css" );
    $(links).each(function( index ) {
        this.disabled = true;
    });
    $(links).get(styleId).disabled = false;
}


menuClickAjax = function(element){
    $(".menuLink").removeClass("active");
    $(element).parent().addClass("active");
}

updateContent = function(){
    content = "";
    $.each( allBooks, function( key, val ) {
        content += '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">';
        content += val.title;
        content += '</h3></div><div class="panel-body">';
        content += 'Panel content';
        content += '</div></div></div></div>';
    });
    $("#content").html(content);

}

loadContent = function(file){
    var previousText = $("#content").html();
    $("#content").html("<img src='../css/ajax-loader.gif' alt='ajax_loader' class='ajaxLoader' />");
    $("#toggleButton").hide();
    var status = $("#statusLine");
    $.getJSON( file, function(data) {
        allBooks = data;
        status.removeClass("label-danger");
        status.addClass("label-success");
        status.text("Successful loading page!");
        updateContent();
    })
    .fail(function() {
        $("#content").html(previousText);
        status.removeClass("label-success");
        status.addClass("label-danger");
        status.text("Fail loading page!");
    });
}

$( document ).ready(function() {
    //at the beginning we disable all links, because of firefox(disabled=true doesn't work)
    selectStylesheet(0);

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
    loadContent("books.json")



});

