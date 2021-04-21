/*
 *  test/list.js
 *
 *  David Janes
 *  IOTDB.org
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

"use strict";

const _ = require("iotdb-helpers")
const zip = require("..")
const fs = require("iotdb-fs")

const assert = require("assert");
const path = require("path");

describe("list", function() {
    const zipfile = path.join(__dirname, "./data/sample.zip");
    const FILENAMES = [
        "contents/a.json",
        "contents/icon.png",
        "contents/unicode.txt"
    ];

    it("works", function(done) {
        _.promise()
            .then(zip.initialize.open.p(zipfile))
            .then(zip.list)
            .make(sd => {
                const got = sd.paths
                got.sort()

                const want = FILENAMES
                want.sort()

                assert.deepEqual(got, want)
            })
            .end(done, {})
    })
})
