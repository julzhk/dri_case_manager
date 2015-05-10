# dri_case_manager
Ipad optimised phonegap project to capture form entered data. 
Auto-sync to web app when ipad returns online
 
# install & run couchdb   
brew couchdb
couchdb

test goto : http://127.0.0.1:5984/_utils/index.html

Then open another terminal & set the CORS to the local couchdb:
see: http://pouchdb.com/errors.html

$ npm install -g add-cors-to-couchdb
$ add-cors-to-couchdb

add camera: http://docs.phonegap.com/en/edge/cordova_camera_camera.md.html

$ cordova plugin add org.apache.cordova.camera
    $ cordova plugin ls
    [ 'org.apache.cordova.camera' ]
    

