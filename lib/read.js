/**
 *  read.js
 *
 *  David Janes
 *  IOTDB
 *  2017-11-06
 *      
 *  Copyright (2013-2019) [David P. Janes]
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

const logger = require("../logger")(__filename)

/**
 *  Accepts: self.otherwise, self.document_encoding
 *  Produces: self.document, self.document_media_type, self.document_encoding, self.exists
 *
 *  If 'self.otherwise' is defined and the document does not exist,
 *  this will be returned as the document. In all other cases, 
 *  the error will be returned
 */
const read = _.promise((self, done) => {
    _.promise.validate(self, read)
    
    logger.trace({
        method: read.method,
        path: self.path,
    }, "called")

    self.exists = false
    
    let type;
    switch (self.document_encoding || "binary") {
    case "binary":
        type = "nodebuffer";
        break;
    case "utf-8": 
    case "utf8": 
        type = "string";
        break;
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

                self.document = document;
                self.document_encoding = null;
                self.document_media_type = mime.getType(self.path)

                done(null, self)
            })
            .catch(done)
    } else if (self.otherwise) {
        self.document = self.otherwise;
        done(null, self)
    } else {
        done(new errors.NotFound("not found: " + self.path))
    }
})

read.method = "lib.read.json"
read.requires = {
    zip: _.is.Object,
    path: _.is.String,
}

/**
 */
const read_buffer = _.promise((self, done) => {
    logger.trace({
        method: read_buffer.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(read_buffer)
        .add("document_encoding", "binary")
        .then(exports.read)
        .end(done, self, "document,document_encoding,document_media_type,exists")
})

read_buffer.method = "lib.read.buffer"
read_buffer.requires = {
    zip: _.is.Object,
    path: _.is.String,
}

/**
 */
const read_utf8 = _.promise((self, done) => {
    logger.trace({
        method: read_utf8.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(read_utf8)
        .add("document_encoding", "utf-8")
        .then(exports.read)
        .end(done, self, "document,document_encoding,document_media_type,exists")
})

read_utf8.method = "lib.read.utf8"
read_utf8.requires = {
    zip: _.is.Object,
    path: _.is.String,
}

/**
 *  Accepts: self.path
 *  Produces: self.json, self.exists
 *
 *  If 'self.otherwise' is defined and the document does not exist,
 *  this will be returned as the document. In all other cases, 
 *  the error will be returned
 */
const read_json = _.promise((self, done) => {
    _.promise.validate(self, read_json)

    logger.trace({
        method: read_json.method,
        path: self.path,
    }, "called")

    self.exists = false

    if (self.zip.files[self.path]) {
        self.zip
            .file(self.path)
            .async("string")
            .then(document => {
                self.exists = true;
                self.json = JSON.parse(document);
                done(null, self)
            })
            .catch(done)
    } else if (self.otherwise) {
        self.json = self.otherwise;
        done(null, self)
    } else {
        done(new errors.NotFound("not found: " + self.path))
    }
})

read_json.method = "lib.read.json";
read_json.requires = {
    zip: _.is.Object,
    path: _.is.String,
}

/**
 */
const read_json_p = path => _.promise((self, done) => {
    logger.trace({
        method: read_json_p.method,
        path: path,
    }, "called")

    _.promise(self)
        .add("path", path)
        .validate(read_json_p)
        .then(exports.read.json)
        .catch(done)
})

read_json_p.method = "lib.read.json.p";
read_json_p.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
/**
 *  API
 */
exports.read = read
exports.read.buffer = read_buffer
exports.read.utf8 = read_utf8
exports.read.json = read_json
exports.read.json.p = read_json_p
