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
const write = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.write";

    assert.ok(self.zip, `${method}: self.zip is required`);
    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);
    assert.ok(_.is.String(self.document) || _.is.Buffer(self.document), `${method}: self.document must be a String or Buffer`);
    assert.ok(_.is.String(self.document_encoding) || _.is.Buffer(self.document), 
        `${method}: self.document_encoding must be a String or self.document must be a Buffer`);
    
    // XXX - probably could do encoding work here
    self.zip.file(self.path, self.document);

    done(null, self);
}

/**
 *  Requires: self.path, self.document
 *  Produces: nothing
 */
const write_utf8 = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.write.utf8";

    assert.ok(self.zip, `${method}: self.zip is required`);
    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);
    assert.ok(_.is.String(self.document) || _.is.Buffer(self.document), `${method}: self.document must be a String or Buffer`);

    _.promise.make(self)
        .then(sd => _.d.add(sd, "document_encoding", "utf-8"))
        .then(exports.write)
        .then(_.promise.done(done, self))
        .catch(done)
}

/**
 *  Accepts: self.path, self.json
 *  Produces: nothing
 */
const write_json = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.write.utf8";

    assert.ok(self.zip, `${method}: self.zip is required`);
    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);
    assert.ok(_.is.JSON(self.json), `${method}: self.json must be a JSON-encodable object`);

    _.promise.make(self)
        .then(sd => _.d.add(sd, "document", JSON.stringify(self.json, null, 2)))
        .then(exports.write.utf8)
        .then(_.promise.done(done, self))
        .catch(done)
}

/**
 *  API
 */
exports.write = _.promise.denodeify(write);
exports.write.utf8 = _.promise.denodeify(write_utf8);
exports.write.json = _.promise.denodeify(write_json);
