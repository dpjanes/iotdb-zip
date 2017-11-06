/*
 *  test/initialize.js
 *
 *  David Janes
 *  IOTDB.org
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

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")
const zip = require("..")

const assert = require("assert");

describe("initialize", function() {
    const zipfile = "./data/sample.zip";
    const filenames = [
        "contents/a.json",
        "contents/icon.png",
        "contents/unicode.txt"
    ];

    describe("initialize", function() {
        it("no parameters - works", function(done) {
            _.promise.make()
                .then(zip.initialize)
                .then(_.promise.block(sd => {
                    assert.ok(sd.zip)
                    assert.deepEqual(sd.zip.files, {})
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })
    describe("initialize.load", function() {
        it("document parameter - works", function(done) {
            _.promise.make({
                path: zipfile,
            })
                .then(fs.read.buffer)
                .then(zip.initialize.load)
                .then(_.promise.block(sd => {
                    assert.ok(sd.zip)
                    assert.deepEqual(_.keys(sd.zip.files).sort(), filenames)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })
    describe("initialize.open", function() {
        it("path parameter - works", function(done) {
            _.promise.make({
                path: zipfile,
            })
                .then(zip.initialize.open)
                .then(_.promise.block(sd => {
                    assert.ok(sd.zip)
                    assert.deepEqual(_.keys(sd.zip.files).sort(), filenames)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })
    describe("initialize.open.p", function() {
        it("path parameter - works", function(done) {
            _.promise.make()
                .then(zip.initialize.open.p(zipfile))
                .then(_.promise.block(sd => {
                    assert.ok(sd.zip)
                    assert.deepEqual(_.keys(sd.zip.files).sort(), filenames)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })
})
