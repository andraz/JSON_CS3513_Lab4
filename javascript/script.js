var allBooks;
var selectedBooks;
var allTags = {};
var onlyValid = false;
selectStylesheet = function(styleId){
    var links = $( ".style-css" );
    $(links).each(function( index ) {
        this.disabled = true;
    });
    $(links).get(styleId).disabled = false;
}


validateJSON = function(data){
    isValid = true;
    $.each(data,function(key, val){
        if(val.title == undefined || typeof val.title != "string"){
            isValid = false;
            return false;
        }
        if(val.abstract == undefined ||  typeof val.abstract != "string"){
            isValid = false;
            return false;
        }
        if(val.url == undefined || typeof val.url != "string"){
            isValid = false;
            return false;
        }
        if(val.rating == undefined || typeof val.rating != "number"){
            isValid = false;
            return false;
        }
        if(val.valid == undefined || typeof val.valid != "boolean"){
            isValid = false;
            return false;
        }
        if(val.author == undefined){
            isValid = false;
            return false;
        }
        else{
            if(typeof val.author != "object"){
                isValid = false;
                return false;
            }
            $.each(val.author,function(k,v){
                if(v.firstName == undefined || typeof v.firstName != "string"){
                    isValid = false;
                    return false;
                }
                if(v.lastName == undefined || typeof v.lastName != "string"){
                    isValid = false;
                    return false;
                }
            });
        }
        if(val.tags == undefined){
            isValid = false;
            return false;
        }
        else{
            if(typeof val.tags != "object"){
                isValid = false;
                return false;
            }
            $.each(val.tags,function(k,v){
                if(typeof v != "string"){
                    isValid = false;
                    return false;
                }
            });
        }

    });
    return isValid;
}

intersect = function intersection_destructive(a, b)
{
    var result = new Array();
    while( a.length > 0 && b.length > 0 )
    {
        if      (a[0] < b[0] ){ a.shift(); }
        else if (a[0] > b[0] ){ b.shift(); }
        else /* they're equal */
        {
            result.push(a.shift());
            b.shift();
        }
    }

    return result;
}

fillTags = function(){
    content = "";
    $.each(allTags, function(key,val){
        content += '<button type="button" class="btn btn-primary btn-xs tagButton">'+key+'</button>';
    });
    $('#tagsDiv').html(content);
    $('.tagButton').click(function(){
        if($(this).hasClass( "btn-primary" )){
            $(this).removeClass("btn-primary");
            $(this).addClass("btn-default");
        }
        else{
            $(this).removeClass("btn-default");
            $(this).addClass("btn-primary");
        }

    });
}

updateContent = function(){
    content = "";
    $.each( selectedBooks, function( key, val ) {
        tagsString = "";
        $.each(val.tags, function(k,v){
            allTags[v] = true;
            if(k == 0){
                tagsString += v;
            }
            else{
                tagsString += ', '+v;
            }
        });
        if(onlyValid && !val.valid){
            return true;
        }
        content += '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">';
        content += val.title;
        content += '</h3></div><div class="panel-body">';
        bookContent = ""
        bookContent += '<dl class="dl-horizontal">';
        bookContent += '<dt>Author</dt><dd>';
        $.each(val.author,function(k,v){
            if(k==0){
                bookContent +=' '+ v.firstName + ' '+ v.lastName;
            }
            else{
                bookContent += ', '+v.firstName + ' '+ v.lastName;
            }
        })
        bookContent += '</dd>';
        bookContent += '<dt>Rating</dt><dd>'
        for(i=0; i<5; i++){
            if(i< val.rating){
                bookContent += '<span class="glyphicon glyphicon-star" />';
            }
            else{
                bookContent += '<span class="glyphicon glyphicon-star-empty" />';
            }
        }
        bookContent +='</dd>';

        bookContent += '<dt>Url</dt><dd><a href="'+ val.url+'" target="_blank">'+val.url+'</a></dd>';
        bookContent += '<dt>Valid</dt><dd>'+ val.valid+'</dd>';
        bookContent += '<dt>Tags</dt><dd>'+ tagsString+'</dd>';
        bookContent += '<h5>Abstract</h5>';
        bookContent += '<p class="abstract">'+val.abstract+'</p>';
        content += bookContent;

        content
        content += '</div></div></div></div>';
    });
    $("#content").html(content);
    $('.abstract').readmore({maxHeight: 25});
    fillTags();

}

loadContent = function(file){
    var previousText = $("#content").html();
    $("#content").html("<img src='../css/ajax-loader.gif' alt='ajax_loader' class='ajaxLoader' />");
    $("#toggleButton").hide();
    var status = $("#statusLine");
    $.getJSON( file, function(data) {
        if(validateJSON(data)){
            allBooks = data;
            selectedBooks = data;
            status.removeClass("label-danger");
            status.addClass("label-success");
            status.text("Successful loading page!");
            updateContent();
        }
        else {
            $("#content").html(previousText);
            status.removeClass("label-success");
            status.addClass("label-danger");
            status.text("Not valid json file!");
        }
    })
    .fail(function() {
        $("#content").html(previousText);
        status.removeClass("label-success");
        status.addClass("label-danger");
        status.text("Fail loading page!");
    });
}

sortSelectedBooks = function(){
    selectedBooks.sort(function(a,b){return b.rating- a.rating});
}

$( document ).ready(function() {
    //at the beginning we disable all links, because of firefox(disabled=true doesn't work)
    selectStylesheet(0);

    //loadContent("books.json");
    loadContent("books.json");

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


    $('#reloadButton').click(function(){
        onlyValid = false;
        loadContent('books.json');
    });

    $('#sortButton').click(function(){
        sortSelectedBooks();
        updateContent();
    });

    $('#showAll').click(function(evt){
        evt.preventDefault();
        onlyValid = false;
        updateContent();
    });

    $('#showValid').click(function(evt){
        evt.preventDefault();
        onlyValid = true;
        updateContent();
    });

});

