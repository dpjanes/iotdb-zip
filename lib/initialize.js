/**
 *  lib/initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-11-06
 *      
 *  Copyright (2013-2021) David P. Janes
 *      
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *      
 *     http://www.apache.org/licenses/LICENSE-2.0 
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const jszip = require("jszip")

/**
 */
const initialize = _.promise(self => {
    self.zip = new jszip()
})
initialize.method = "initialize"
initialize.description = `Create a new blank zip document`
initialize.requires = {
}
initialize.accepts = {
    zip$cfg: _.is.Dictionary, // used in iotdb-szip
}
initialize.produces = {
    zip: _.is.Object,
}

/**
 */
const initialize_load = _.promise((self, done) => {
    _.promise.validate(self, initialize_load)

    jszip
        .loadAsync(self.document)
        .then(zip => {
            self.zip = zip

            done(null, self)
        })
        .catch(done)
})
initialize_load.method = "initialize.load"
initialize_load.description = `
    Similar to initialize_open, except that it reads
    from self.document in case it's already in memory`
initialize_load.requires = {
    document: [ _.is.String, _.is.Buffer ],
}
initialize_load.produces = {
    zip: _.is.Object,
}
initialize_load.params = {
    document: _.is.Buffer,
}
initialize_load.p = _.p(initialize_load)

/**
 */
const initialize_open = _.promise((self, done) => {
    _.promise(self)
        .validate(initialize_open)
        .then(fs.read.buffer)
        .then(initialize_load)
        .end(done, self, initialize_open)
})
initialize_open.method = "initialize.open"
initialize_open.description = `Reads a ZIP document, by pathname`
initialize_open.requires = {
    path: _.is.String,
}
initialize_open.produces = {
    zip: _.is.Object,
}
initialize_open.params = {
    path: _.p.normal,
}
initialize_open.p = _.p(initialize_open)

/**
 *  API
 */
exports.initialize = initialize
exports.initialize.load = initialize_load
exports.initialize.open = initialize_open
