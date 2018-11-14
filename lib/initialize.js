/**
 *  initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-11-06
 *      
 *  Copyright [2013-2018] [David P. Janes]
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

const assert = require('assert')

const jszip = require("jszip")

/**
 *  Produces: self.zip
 *
 *  Create a new zip document
 */
const initialize = _.promise(self => {
    self.zip = new jszip()
})
initialize.method = "lib.initialize"
initialize.requires = {
}

/**
 *  Requires: self.document
 *  Produces: self.zip
 *
 *  Similar to initialize_open, except that it reads
 *  from self.document in case it's already in memory
 */
const initialize_load = _.promise((self, done) => {
    _.promise.validate(initialize_load)

    jszip
        .loadAsync(self.document)
        .then(zip => {
            self.zip = zip;

            done(null, self);
        })
        .catch(done)
})
initialize_load.method = "lib.initialize.load"
initialize_load.requires = {
    document: _.is.Buffer,
}

/**
 *  Requires: self.path
 *  Produces: self.zip
 *
 *  Reads a ZIP document, by pathname.
 */
const initialize_open = _.promise((self, done) => {
    _.promise.validate(initialize_open)

    if (self.verbose) {
        console.log("-", method, "loading zipfile:", self.path);
    }

    _.promise(self)
        .validate(initialize_open)
        .then(fs.read.p(self.path, "binary"))
        .then(initialize_load)
        .end(done, self, "zip")
})
initialize_open.method = "lib.initialize.open"
initialize_open.requires = {
    path: _.is.String,
}

/**
 *  Parameterized version
 */
const initialize_open_p = _path => _.promise((self, done) => {
    _.promise(self)
        .add("path", _path)
        .validate(initialize_open_p)
        .then(initialize_open)
        .end(done, self, "zip")
})
initialize_open_p.method = "lib.initialize.open.p"
initialize_open_p.requires = {
    path: _.is.String,
}

/**
 *  API
 */
exports.initialize = initialize
exports.initialize.load = initialize_load
exports.initialize.open = initialize_open
exports.initialize.open.p = initialize_open_p
