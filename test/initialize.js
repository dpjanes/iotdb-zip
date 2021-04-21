/*
 *  test/initialize.js
 *
 *  David Janes
 *  IOTDB.org
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

"use strict";

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")
const zip = require("..")

const assert = require("assert");
const path = require("path");

describe("initialize", function() {
    const zipfile = path.join(__dirname, "./data/sample.zip");
    const filenames = [
        "contents/a.json",
        "contents/icon.png",
        "contents/unicode.txt"
    ];

    describe("initialize", function() {
        it("no parameters - works", function(done) {
            _.promise()
                .then(zip.initialize)
                .make(sd => {
                    assert.ok(sd.zip)
                    assert.deepEqual(sd.zip.files, {})
                })
                .end(done, {})
        })
    })
    describe("initialize.load", function() {
        it("document parameter - works", function(done) {
            _.promise({
                path: zipfile,
            })
                .then(fs.read.buffer)
                .then(zip.initialize.load)
                .make(sd => {
                    assert.ok(sd.zip)
                    assert.deepEqual(_.keys(sd.zip.files).sort(), filenames)
                })
                .end(done, {})
        })
    })
    describe("initialize.open", function() {
        it("path parameter - works", function(done) {
            _.promise({
                path: zipfile,
            })
                .then(zip.initialize.open)
                .make(sd => {
                    assert.ok(sd.zip)
                    assert.deepEqual(_.keys(sd.zip.files).sort(), filenames)
                })
                .end(done, {})
        })
    })
    describe("initialize.open.p", function() {
        it("path parameter - works", function(done) {
            _.promise()
                .then(zip.initialize.open.p(zipfile))
                .make(sd => {
                    assert.ok(sd.zip)
                    assert.deepEqual(_.keys(sd.zip.files).sort(), filenames)
                })
                .end(done, {})
        })
    })
})
