/**
 *  read.js
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
const errors = require("iotdb-errors")

const path = require("path")
const assert = require("assert")

const mime = require("mime")
mime.getType = mime.getType || mime.lookup; // 2.0.3 vs 1.6.0 

/**
 */
const read = _.promise((self, done) => {
    _.promise.validate(self, read)
    
    self.exists = false
    
    let type
    switch (self.document_encoding || "binary") {
    case "binary":
        type = "nodebuffer"
        break
    case "utf-8": 
    case "utf8": 
        type = "string"
        break
    default:
        assert.ok(false, `${read.method}: unknown self.document_encoding="${self.document_encoding}"`)
    }

    self.document_encoding = null
    self.document_media_type = null
    self.document_name = path.basename(self.path)
    self.exists = false

    if (self.zip.files[self.path]) {
        self.zip
            .file(self.path)
            .async(type)
            .then(document => {
                self.exists = true

                self.document = document
                self.document_encoding = null
                self.document_media_type = mime.getType(self.path)

                done(null, self)
            })
            .catch(done)
    } else {
        done(new errors.NotFound("not found: " + self.path))
    }
})

read.method = "read"
read.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
read.accepts = {
    document_encoding: _.is.String,
}
read.produces = {
    document: [ _.is.Buffer, _.is.String ],
    document_encoding: _.is.String,
    document_media_type: _.is.String,
    document_name: _.is.String,
    exists: _.is.Boolean,
}
read.params = {
    path: _.p.normal,
}
read.p = _.p(read)

/**
 */
const read_buffer = _.promise((self, done) => {
    _.promise(self)
        .validate(read_buffer)
        .add("document_encoding", "binary")
        .then(exports.read)
        .end(done, self, read_buffer)
})

read_buffer.method = "read.buffer"
read_buffer.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
read_buffer.produces = {
    document: _.is.Buffer,
    document_encoding: _.is.String,
    document_media_type: _.is.String,
    document_name: _.is.String,
    exists: _.is.Boolean,
}
read_buffer.params = {
    path: _.p.normal,
}
read_buffer.p = _.p(read_buffer)

/**
 */
const read_utf8 = _.promise((self, done) => {
    _.promise(self)
        .validate(read_utf8)
        .add("document_encoding", "utf-8")
        .then(exports.read)
        .end(done, self, read_utf8)
})

read_utf8.method = "read.utf8"
read_utf8.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
read_utf8.produces = {
    document: _.is.String,
    document_encoding: _.is.String,
    document_media_type: _.is.String,
    document_name: _.is.String,
    exists: _.is.Boolean,
}
read_utf8.params = {
    path: _.p.normal,
}
read_utf8.p = _.p(read_utf8)

/**
 */
const read_json = _.promise((self, done) => {
    _.promise.validate(self, read_json)

    self.exists = false

    if (self.zip.files[self.path]) {
        self.zip
            .file(self.path)
            .async("string")
            .then(document => {
                self.exists = true
                self.json = JSON.parse(document)
                done(null, self)
            })
            .catch(done)
    } else {
        done(new errors.NotFound("not found: " + self.path))
    }
})

read_json.method = "read.json"
read_json.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
read_json.produces = {
    exists: _.is.Boolean,
    json: _.is.JSON,
}
read_json.params = {
    path: _.p.normal,
}
read_json.p = _.p(read_json)

/**
 *  API
 */
exports.read = read
exports.read.buffer = read_buffer
exports.read.utf8 = read_utf8
exports.read.json = read_json
