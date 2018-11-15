/**
 *  write.js
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

const path = require("path")
const assert = require("assert")

const logger = require("../logger")(__filename)

/**
 *  Requires: self.path, self.document
 *  Accepts: self.document_encoding
 *  Produces: nothing
 *
 *  This will write the document, ensuring always
 *  that the parent folders exist first
 */
const write = _.promise(self => {
    logger.trace({
        method: write.method,
        path: self.path,
    }, "called")

    assert.ok(_.is.String(self.document_encoding) || _.is.Buffer(self.document), 
        `${write.method}: self.document_encoding must be a String or self.document must be a Buffer`);

    _.promise.validate(self, write)
    
    if (_.is.String(self.document)) {
        self.zip.file(self.path, Buffer.from(self.document, self.document_encoding), {
            createFolders: false,
            binary: true,
        })
    } else {
        self.zip.file(self.path, self.document, {
            createFolders: false,
            binary: true,
        })
    }
})

write.method = "lib.write";
write.requires = {
    zip: _.is.Object,
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
}

write.accepts = {
    document_encoding: _.is.String,
}

/**
 *  Requires: self.path, self.document
 *  Produces: nothing
 */
const write_utf8 = _.promise((self, done) => {
    logger.trace({
        method: write_utf8.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(write_utf8)
        .add("document_encoding", "utf-8")
        .then(exports.write)
        .end(done, self)
})

write_utf8.method = "lib.write.utf8";
write_utf8.requires = {
    zip: _.is.Object,
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
}

/**
 *  Requires: self.path, self.document
 *  Produces: nothing
 */
const write_buffer = _.promise((self, done) => {
    logger.trace({
        method: write_buffer.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(write_buffer)
        .add("document_encoding", "binary")
        .then(exports.write)
        .end(done, self)
})

write_buffer.method = "lib.write.buffer";
write_buffer.requires = {
    zip: _.is.Object,
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
}

/**
 *  Accepts: self.path, self.json
 *  Produces: nothing
 */
const write_json = _.promise((self, done) => {
    logger.trace({
        method: write_json.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(write_json)
        .add("document", JSON.stringify(self.json, null, 2))
        .then(exports.write.utf8)
        .end(done, self)
})

write_json.method = "lib.write.utf8";
write_json.requires = {
    zip: _.is.Object,
    path: _.is.String,
    json: _.is.JSON,
}

/**
 *  API
 */
exports.write = write
exports.write.utf8 = write_utf8
exports.write.buffer = write_buffer
exports.write.json = write_json
