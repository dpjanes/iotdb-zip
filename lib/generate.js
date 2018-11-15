/**
 *  save.js
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

const path = require("path")

const logger = require("../logger")(__filename)

/**
 *  Accepts: self.zip
 *  Produces: self.document, self.document_media_type
 *
 *  Note that although we set the media type to
 *  application/zip, it will likely be replaced
 *  with "application/consensas.ledger"
 */
const generate = _.promise((self, done) => {
    _.promise.validate(generate)

    logger.trace({
        method: generate.method,
    }, "called")

    self.zip
        .generateAsync({
            type: 'nodebuffer',
            streamFiles: true,
        })  
        .then(buffer => {
            self.document = buffer;
            self.document_media_type = "application/zip";
            self.document_encoding = null;

            done(null, self);
        })          
        .catch(done)
})

generate.method = "lib.generate";
generate.requires = {
    zip: _.is.Object,
}

/**
 *  Accepts: self.path, self.zip
 *  Produces: N/A
 *
 *  Actually save the ZIP to a file
 */
const generate_save = _.promise((self, done) => {
    logger.trace({
        method: generate_save.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(generate_save)
        .then(exports.generate)
        .then(fs.write.p(self.path))
        .end(done, self)
})

generate_save.method = "lib.generate.save";
generate_save.requires = {
    zip: _.is.Object,
    path: _.is.String,
}

/**
 *  API
 */
exports.generate = generate;
exports.generate.save = generate_save
