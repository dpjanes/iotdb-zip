/**
 *  read.js
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

const _ = require("iotdb-helpers");
const fs = require("iotdb-fs");

const path = require("path"); 
const assert = require("assert"); 

const mime = require("mime");

/**
 *  Requires: self.path
 *  Accepts: self.otherwise, self.document_encoding
 *  Produces: self.document, self.document_media_type, self.document_encoding, self.exists
 *
 *  If 'self.otherwise' is defined and the document does not exist,
 *  this will be returned as the document. In all other cases, 
 *  the error will be returned
 */
const read = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.read.json";

    assert.ok(self.zip, `${method}: self.zip is required`);
    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);
    assert.ok(_.is.Function(done), `${method}: done must be a function`);

    self.exists = false

    if (self.zip.files[self.path]) {
        self.zip
            .file(self.path)
            .async("string")
            .then(document => {
                self.exists = true

                self.document = document;
                self.document_encoding = null;
                self.document_media_type = mime.getType(self.path)
                self.document_name = path.basename(self.path)

                done(null, self)
            })
            .catch(done)
    } else if (self.otherwise) {
        self.document = document;
        done(null, self)
    } else {
        done(new errors.NotFound("not found: " + self.path))
    }
}

/**
 */
const read_utf8 = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.read.utf8";

    _.promise.make(self)
        .then(sd => _.d.add(sd, "document_encoding", "utf-8"))
        .then(exports.read)
        .then(_.promise.done(done))
        .catch(done)
}


/**
 *  Accepts: self.path
 *  Requires: self.otherwise
 *  Produces: self.json, self.exists
 *
 *  If 'self.otherwise' is defined and the document does not exist,
 *  this will be returned as the document. In all other cases, 
 *  the error will be returned
 */
const read_json = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.read.json";

    assert.ok(self.zip, `${method}: self.zip is required`);
    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);

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
        self.document = document;
        done(null, self)
    } else {
        done(new errors.NotFound("not found: " + self.path))
    }
}

/**
 *  API
 */
exports.read = _.promise.denodeify(read);
exports.read.utf8 = _.promise.denodeify(read_utf8);
exports.read.json = _.promise.denodeify(read_json);
