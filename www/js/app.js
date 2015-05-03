function write_nav_to_ui(limit,skip, page, count){
    $('.nav').append('Records '+ (skip) + ' to '+ (skip + limit) + ' of '+ count + '<br>');
    if(page>1){
        $('.nav').append('<a href="?p='+ (page-1) + '">Newer</a> | ');
    }
    if((page+1)*limit<count){
        $('.nav').append('<a href="?p='+ (page+1) + '">Older</a>');
    }
}


function write_to_ui(rows){
    _.each(rows,function(row){
        $('.data').append("<tr class='table-striped'>");
        $('.data').append("<td>"+ row.id+"</td>");
        $('.data').append("<td>"+ row.id+"</td>");
        $('.data').append("<td>"+ row.doc.title+"</td>");
        $('.data').append("</tr>");
        console.log(row);
    });
}


function showrecords(limit,skip, page) {
    db.allDocs({
        include_docs: true,
        descending: true,
        limit:limit,
        skip:skip
    }, function(err, doc) {
        if (typeof doc === "undefined") {
            console.log('no records')
        } else {
            write_to_ui(doc.rows);
            write_nav_to_ui(limit,skip, page, doc.total_rows);
        }
    });
}


$.urlParam = function(name){
    //   extract parameters from url:
    //   http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

// There was some form or error syncing
function syncError() {
    syncDom.setAttribute('data-sync-state', 'error');
}

function sync() {
//            syncDom.setAttribute('data-sync-state', 'syncing');
    var opts = {live: true};
    db.replicate.to(db, opts, syncError);
    db.replicate.from(db, opts, syncError);
}

function add_new_record(event){
    //   FYI  throws an 'expected' error about 404..
    // normal..just detecting blob URL support.
    var id = new Date().toISOString();
    var new_record = {
        _id: id,
        title: _.sample(
                [ '1 let it be',
                    '2 sgt peppers',
                    '3 white album',
                    '4 abbey rd',
                    '5 magical mystery tour',
                    '6 best of the beatles']),
        completed: false
    };
    db.put(new_record, function callback(err, result) {
        if (!err) {
            console.log('Successfully posted a new_record!');
        }
    });
    sync();
    Cookies.set('id', id);
    window.location.href = "admin.html";
    event.preventDefault();
}
