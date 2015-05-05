//    sync to : https://cloudant.com/ ?
//    var db = new PouchDB('http://localhost:5984/my_database');
var db = new PouchDB('http://localhost:5984/my_database');
var syncDom = document.getElementById('sync-wrapper');

function write_nav_to_ui(limit,skip, page, count){
    // used only on index.html
    $('.nav').append('Records '+ (skip) + ' to '+ (skip + limit) + ' of '+ count + '<br>');
    if(page>1){
        $('.nav').append('<a href="?p='+ (page-1) + '">Newer</a> | ');
    }
    if((page+1)*limit<count){
        $('.nav').append('<a href="?p='+ (page+1) + '">Older</a>');
    }
}


function write_to_ui(rows){
    // used only on index.html
    _.each(rows,function(row){
        $('.data').append("<tr class='table-striped'>");
        //columns:date
        $('.data').append("<td>"+ row.id+"</td>");
        //columns: number
        $('.data').append("<td>"+ row.id+"</td>");
        //columns: name
        $('.data').append("<td>"+ row.doc.patientName+"</td>");
        $('.data').append("</tr>");
        console.log(row);
    });
}


function showrecords(limit,skip, page) {
    // used only on index.html
    db.allDocs({
        include_docs: true,
        descending: true,
        limit:limit,
        skip:skip
    }, function(err, doc) {
        if ((typeof doc === "undefined") || (doc.total_rows == 0)) {
            console.log('no records');
        //    todo write 'no records to dom'
        } else {
            if (err==null){
                write_to_ui(doc.rows);
                write_nav_to_ui(limit,skip, page, doc.total_rows);
            } else{
                db_error(err);
            }
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


function syncError() {
    // There was some form or error syncing
    //todo write to DOM
    console.log('omg sync fail')
}

function sync() {
    // todo: write: syncing to DOM
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
        } else {
            db_error(err);
        }
    });
    sync();
    // we use ID to JOIN all other records to this master record.
    // gets passed from page to page in the ID cookie.
    Cookies.set('id', id);
    window.location.href = "admin.html";
    event.preventDefault();
}

function db_error(err){
    //todo : write to DOM
    console.log(err);
}

function save_on_page_change(event){
    // each form is a new document (key by save datetime.
    // todo: allow the key instead; FYI: must update all fields,
    // partial updates not possible
    var id = new Date().toISOString();
    // update with var id = Cookies.get('id');
    var data = $( "form" ).serializeArray();
    var data_dict = {};
    _.each(data,function(ele){
        data_dict[ele.name] = ele.value
    })
    console.log(data);
    console.log(data_dict);
    var id = new Date().toISOString();
    data_dict['_id']= data_dict['formName'] +'::'+ id;
    data_dict['master_id']= Cookies.get('id');
    var destination_url = event.currentTarget.href;
    db.put(data_dict, function callback(err, result) {
        if (!err) {
            console.log('Successfully posted a new_record!');
        } else {
            db_error(err);
        }
    });

    //db.put(data_dict, function callback(err, result) {
    //    if (!err) {
    //        console.log('Successfully posted a new_record!');
    //    } else {
    //        db_error(err);
    //    }
    //    console.log(err);
    //    console.log(result);
    //});


    sync();
    //db.get(id).then(function(doc) {
    //    data_dict._id=id;
    //    data_dict._rev=doc._rev;
    //    console.log(data_dict);
    //    return db.put(data_dict);
    //}).then(function(response) {
    //  // handle response
    //}).catch(function (err) {
    //    db_error(err);
    //  console.log(err);
    //});

    window.location.href = destination_url;
    event.preventDefault();

}


/* IONIC */
angular.module('dricase', ['ionic'])
    .controller('SideController', function($scope, $ionicSideMenuDelegate){
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();};
    }).controller('SocialCtrl', function($scope){
        $scope.maritalStatusList = [
            {text: "Married"},
            {text: "Divorced"},
            {text: "Widowed"},
            {text: "Never Married"},
            {text: "Unknown"}
        ];

        $scope.educationStatusList = [
            {text: "None"},
            {text: "Primary School"},
            {text: "Secondary School"},
            {text: "Higher Education"},
            {text: "Unknown"}
        ];

        $scope.socialStatusList = [
            {text: "Living with husband"},
            {text: "Living with family"},
            {text: "Living with alone"},
            {text: "Unkown"}
        ]
    }).controller('MedicalCtrl', function($scope){
        $scope.medicalConditionsList = [
            {text: "Tuberculosis"},
            {text: "HIV/AIDS"},
            {text: "High Blood Pressure"},
            {text: "Diabetes"},
            {text: "Epilepsy"},
            {text: "Hepatitis"},
            {text: "Other"}
        ];

        $scope.yearsOfPeriodList = [
            {text: "Yes"},
            {text: "No"},
            {text: "Unknown"}
        ];

        $scope.causeOfFistulaList = [
            {text: "Obstetric"},
            {text: "Caesarean-related"},
            {text: "Post-gynecological operation"},
            {text: "Unknown"},
            {text: "Other"}
        ];

        $scope.placeOfDeliveryList = [
            {text: "Home"},
            {text: "Health Center"},
            {text: "Hospital"},
            {text: "Unknown"},
            {text: "Other"}
        ];

        $scope.deliveryTypeList = [
            {text: "Spontaneous Vaginal Delivery"},
            {text: "Instrumental"},
            {text: "Caesarean"},
            {text: "Caesarean Hysterectomy"},
            {text: "Destructive Craniotomy"},
            {text: "Unknown"},
            {text: "Other"}
        ];

        $scope.deliveryOutcomeList = [
            {text: "Livebirth"},
            {text: "Stillbirth"},
            {text: "Early Neonatal Death"},
            {text: "Unknown"}
        ];

        $scope.genderList = [
            {text: "Male"},
            {text: "Female"},
            {text: "Unkown"}
        ]
    }).controller('StatusCtrl', function($scope){
        $scope.urinalScoreList = [
            {text: "No urinary incontinence", value: 1},
            {text: "Patient leaks urine when coughing, laughing, straining", value: 2},
            {text: "Patient leaks urine when walking", value: 3},
            {text: "Patient leaks urine when standing, sitting, or lying. Patient still able to void", value: 4},
            {text: "Patient leaks urine at any moment and is unable to void", value: 5},
            {text: "Unknown", value: 0}
        ];

        $scope.fecalScoreList = [
            {text: "Patient controls stool completely", value: 1},
            {text: "Patient cannot control flatus", value: 2},
            {text: "Patient cannot control flatus, liquid stool", value: 3},
            {text: "Patient cannot control flatus, liquid stool, or solid stool", value: 4},
            {text: "Unkown", value: 0}
        ]
    }).controller('ClinicalCtrl', function($scope){
        $scope.yesNoList = [
            {text: "Yes", value: 1},
            {text: "No", value: 0},
            {text: "Unknown", value: 2}
        ];

        $scope.dyeTestList = [
            {text: "Positive", value: 1},
            {text: "Negative", value: 2},
            {text: "Not Done", value: 3},
            {text: "Unknown", value: 0}
        ];

        $scope.dermatitisList = [
            {text: "None", value: 1},
            {text: "Moderate", value: 2},
            {text: "Severe", value: 3},
            {text: "Unknown", value: 0}

        ];
    }).controller('ExamCtrl', function($scope){
        $scope.meatusShapeList = [
            {text: "Normal", value: 1},
            {text: "Narrowed", value: 2},
            {text: "Gaping", value: 3},
            {text: "Unknown", value: 0}
        ];

        $scope.meatusPositionList = [
            {text: "Normal", value: 1},
            {text: "Anteriorly displaced", value: 2},
            {text: "Posteriorly displaced", value: 3},
            {text: "Unknown", value: 0}
        ];
    });