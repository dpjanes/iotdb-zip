/*
 *  test/read.js
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
const zip = require("..")
const fs = require("iotdb-fs")

const assert = require("assert");
const path = require("path");

describe("read", function() {
    const zipfile = path.join(__dirname, "./data/sample.zip");
    const filenames = [
        "contents/a.json",
        "contents/icon.png",
        "contents/unicode.txt"
    ];
    let documents = {}

    before(function(done) {
        _.promise({
            paths: filenames.map(filename => path.join(__dirname, "data", filename)),
        })
            .then(fs.all(fs.read.buffer))
            .then(sd => {
                sd.outputs.forEach(output => {
                    documents["contents/" + path.basename(output.path)] = output.document;
                })
            })
            .end(done, {})
    })

    describe("read", function() {
        it("read BINARY - works", function(done) {
            const filename = "contents/icon.png";

            _.promise()
                .then(zip.initialize.open.p(zipfile))
                .then(sd => _.d.add(sd, "path", filename))
                .then(zip.read)
                .make(sd => {
                    assert.ok(_.is.Buffer(sd.document))
                    assert.ok(sd.exists)
                    assert.deepEqual(sd.document, documents[filename]);
                })
                .end(done, {})
        })
        it("read unicode - works", function(done) {
            const filename = "contents/unicode.txt";

            _.promise()
                .then(zip.initialize.open.p(zipfile))
                .then(sd => _.d.add(sd, "path", filename))
                .then(zip.read)
                .make(sd => {
                    assert.ok(_.is.Buffer(sd.document))
                    assert.ok(sd.exists)
                    assert.deepEqual(sd.document, documents[filename]);
                })
                .end(done, {})
        })
    })
    describe("read.buffer", function() {
        it("read BINARY - works", function(done) {
            const filename = "contents/icon.png";

            _.promise()
                .then(zip.initialize.open.p(zipfile))
                .then(sd => _.d.add(sd, "path", filename))
                .then(zip.read.buffer)
                .make(sd => {
                    assert.ok(_.is.Buffer(sd.document))
                    assert.ok(sd.exists)
                    assert.deepEqual(sd.document, documents[filename]);
                })
                .end(done, {})
        })
        it("read utf8 text file as buffer - works", function(done) {
            const filename = "contents/unicode.txt";

            _.promise()
                .then(zip.initialize.open.p(zipfile))
                .then(sd => _.d.add(sd, "path", filename))
                .then(zip.read.buffer)
                .make(sd => {
                    assert.ok(_.is.Buffer(sd.document))
                    assert.ok(sd.exists)
                    assert.deepEqual(sd.document, documents[filename])
                })
                .end(done, {})
        })
    })
    describe("read.utf8", function() {
        it("read utf8 text file - works", function(done) {
            const filename = "contents/unicode.txt";

            _.promise()
                .then(zip.initialize.open.p(zipfile))
                .then(sd => _.d.add(sd, "path", filename))
                .then(zip.read.utf8)
                .make(sd => {
                    assert.ok(_.is.String(sd.document))
                    assert.ok(sd.exists)
                    assert.deepEqual(sd.document, documents[filename].toString("utf-8"))
                })
                .end(done, {})
        })
        /*
        it("read utf8 text file - works with otherwise", function(done) {
            const filename = "contents/DOESNOTEXIST";
            const contents = "Hello World";

            _.promise()
                .then(zip.initialize.open.p(zipfile))
                .then(sd => _.d.add(sd, "path", filename))
                .then(sd => _.d.add(sd, "otherwise", contents))
                .then(zip.read.utf8)
                .make(sd => {
                    assert.ok(_.is.String(sd.document))
                    assert.ok(!sd.exists)
                    assert.deepEqual(sd.document, contents)
                })
                .end(done, {})
        })
        */
        it("read BINARY text as utf8 - works, half-assedly", function(done) {
            const filename = "contents/icon.png";

            _.promise()
                .then(zip.initialize.open.p(zipfile))
                .then(sd => _.d.add(sd, "path", filename))
                .then(zip.read.utf8)
                .make(sd => {
                    assert.ok(_.is.String(sd.document))
                    assert.ok(sd.exists)
                    assert.deepEqual(sd.document, documents[filename].toString("utf-8"))
                })
                .end(done, {})
        })
    })
    describe("read.json", function() {
        it("read JSON text file", function(done) {
            const filename = "contents/a.json";

            _.promise()
                .then(zip.initialize.open.p(zipfile))
                .then(sd => _.d.add(sd, "path", filename))
                .then(zip.read.json)
                .make(sd => {
                    assert.ok(_.is.JSON(sd.json))
                    assert.ok(sd.exists)
                    assert.deepEqual(sd.json, JSON.parse(documents[filename].toString("utf-8")))
                })
                .end(done, {})
        })
    })
})
