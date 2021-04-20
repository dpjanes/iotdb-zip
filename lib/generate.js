/**
 *  lib/generate.js
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

/**
 */
const generate = _.promise((self, done) => {
    _.promise.validate(self, generate)

    self.zip
        .generateAsync({
            type: 'nodebuffer',
            streamFiles: true,
        })  
        .then(buffer => {
            self.document = buffer
            self.document_media_type = "application/zip"
            self.document_encoding = null

            done(null, self)
        })          
        .catch(done)
})

generate.method = "generate"
generate.description = `Generate a ZIP file`
generate.requires = {
    zip: _.is.Object,
}
generate.produces = {
    document: _.is.Buffer,
    document_media_type: _.is.String,
    document_encoding: _.is.Null,
}

/**
 */
const generate_save = _.promise((self, done) => {
    _.promise(self)
        .validate(generate_save)
        .then(generate)
        .then(fs.write.buffer)
        .end(done, self, generate_save)
})

generate_save.method = "lib.generate.save"
generate_save.description = `Save the ZIP to a file`
generate_save.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
generate_save.produces = {
}
generate_save.params = {
    path: _.p.normal,
}
generate_save.p = _.p(generate_save)

/**
 *  API
 */
exports.generate = generate
exports.generate.save = generate_save
