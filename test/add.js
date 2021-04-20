/*
 *  test/add.js
 *
 *  David Janes
 *  IOTDB.org
 *  20201-04-20
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

describe("all", function() {
    const FILENAMES = [
        "contents/a.json",
        "contents/icon.png",
        "contents/unicode.txt"
    ]

    it("add works", function(done) {
        _.promise()
            .then(zip.initialize)
            .add("zip$root", path.join(__dirname, "data"))
            .add("path", FILENAMES[0])
            .then(zip.add)
            .make(sd => {
                const got = _.keys(sd.zip.files)
                const want = [ FILENAMES[0], ]

                got.sort()
                want.sort()

                assert.deepEqual(got, want)
            })

            .end(done, {})
    })
    it("add.all works", function(done) {
        _.promise()
            .then(zip.initialize)
            .add("zip$root", path.join(__dirname, "data"))
            .add("paths", FILENAMES)
            .then(zip.add.all)
            .make(sd => {
                const got = _.keys(sd.zip.files)
                const want = FILENAMES

                got.sort()
                want.sort()

                assert.deepEqual(got, want)
            })

            .end(done, {})
    })
    it("add.all works with fs", function(done) {
        _.promise()
            .add("path", path.join(__dirname, "data", "contents"))
            .then(fs.list)

            .add("zip$root", path.join(__dirname, "data"))
            .then(zip.initialize)
            .then(zip.add.all)

            .make(sd => {
                const got = _.keys(sd.zip.files)
                const want = FILENAMES

                got.sort()
                want.sort()

                assert.deepEqual(got, want)
            })

            .end(done, {})
    })
})
