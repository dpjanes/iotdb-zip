/**
 *  exists.js
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

const assert = require('assert')

/**
 *  Produces: self.exists
 */
const exists = _.promise(self => {
    _.promise.validate(exists)

    self.exists = self.zip.files[self.path] ? true : false
})

exists.method = "lib.exists";
exists.requires = {
    zip: _.is.Object,
    path: _.is.String,
}

/**
 *  API
 */
exports.exists = exists;
