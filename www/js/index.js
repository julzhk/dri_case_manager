/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        var display = document.getElementById('pouchdb-display');
        
        var db = new PouchDB('pouch');
        var idb = new PouchDB('idbpouch', {adapter: 'idb'});
        var websql = new PouchDB('websqlpouch', {adapter: 'websql'});
        
        display.innerHTML += (db.adapter ? '&#10003; PouchDB is working.<br/>' : '&#10007; PouchDB is not working.<br/>');
        display.innerHTML += (idb.adapter ? '&#10003; IndexedDB is supported.<br/>' : '&#10007; IndexedDB is not supported.<br/>');
        display.innerHTML += (websql.adapter ? '&#10003; WebSQL is supported.<br/>' : '&#10007; WebSQL is not supported.<br/>');
    //    test write to db
        display.innerHTML += 'start add';
        function addTodo(text) {
          var todo = {
            _id: new Date().toISOString(),
            title: text,
            completed: false
          };
          db.put(todo, function callback(err, result) {
            if (!err) {
              display.innerHTML += 'Successfully posted a todo!';
            } else  {
              display.innerHTML += 'cannot post a todo!';
            }
          });
        }
        addTodo('first post');

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();