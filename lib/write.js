/**
 *  write.js
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

"use strict";

const _ = require("iotdb-helpers");
const fs = require("iotdb-fs");

const path = require("path"); 
const assert = require("assert"); 

/**
 *  Requires: self.path, self.document
 *  Accepts: self.document_encoding
 *  Produces: nothing
 *
 *  This will write the document, ensuring always
 *  that the parent folders exist first
 */
const write = _.promise((self, done) => {
    assert.ok(self.zip, `${method}: self.zip is required`);
    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);
    assert.ok(_.is.String(self.document) || _.is.Buffer(self.document), `${method}: self.document must be a String or Buffer`);
    assert.ok(_.is.String(self.document_encoding) || _.is.Buffer(self.document), 
        `${method}: self.document_encoding must be a String or self.document must be a Buffer`);
    
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

    done(null, self);
})
write.method = "lib.write";

/**
 *  Requires: self.path, self.document
 *  Produces: nothing
 */
const write_utf8 = _.promise((self, done) => {
    assert.ok(self.zip, `${method}: self.zip is required`);
    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);
    assert.ok(_.is.String(self.document) || _.is.Buffer(self.document), `${method}: self.document must be a String or Buffer`);

    _.promise.make(self)
        .then(sd => _.d.add(sd, "document_encoding", "utf-8"))
        .then(exports.write)
        .then(_.promise.done(done, self))
        .catch(done)
})
write_utf8.method = "lib.write.utf8";


/**
 *  Requires: self.path, self.document
 *  Produces: nothing
 */
const write_buffer = _.promise((self, done) => {
    assert.ok(self.zip, `${method}: self.zip is required`);
    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);
    assert.ok(_.is.String(self.document) || _.is.Buffer(self.document), `${method}: self.document must be a String or Buffer`);

    _.promise.make(self)
        .then(sd => _.d.add(sd, "document_encoding", "binary"))
        .then(exports.write)
        .then(_.promise.done(done, self))
        .catch(done)
})
write_buffer.method = "lib.write.buffer";

/**
 *  Accepts: self.path, self.json
 *  Produces: nothing
 */
const write_json = _.promise((self, done) => {
    assert.ok(self.zip, `${method}: self.zip is required`);
    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSON-encodable object`);

    _.promise.make(self)
        .then(sd => _.d.add(sd, "document", JSON.stringify(self.json, null, 2)))
        .then(exports.write.utf8)
        .then(_.promise.done(done, self))
        .catch(done)
})
write_json.method = "lib.write.utf8";

/**
 *  API
 */
exports.write = write
exports.write.utf8 = write_utf8
exports.write.buffer = write_buffer
exports.write.json = write_json
