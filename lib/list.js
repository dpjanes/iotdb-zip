/**
 *  lib/list.js
 *
 *  David Janes
 *  IOTDB
 *  2021-04-21
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

/**
 */
const list = _.promise(self => {
    _.promise.validate(self, list)

    self.paths = []
    self.zip.forEach(path => self.paths.push(path))
})

list.method = "list"
list.requires = {
    zip: _.is.Object,
}
list.produces = {
    paths: _.is.Array.of.String,
}
list.params = {
}
list.p = _.p(list)

/**
 *  API
 */
exports.list = list
