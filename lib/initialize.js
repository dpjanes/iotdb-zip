/**
 *  initialize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-11-06
 */

const _ = require("iotdb-helpers");

const assert = require('assert'); 

const jszip = require("jszip");

/**
 *  Produces: self.zip
 *
 *  Create a new zip document
 */
const zip_create = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.initialize";

    self.zip = new jszip();

    done(null, self);
}

/**
 *  Requires: self.document
 *  Produces: self.zip
 *
 *  Similar to zip_open, except that it reads
 *  from self.document in case it's already in memory
 */
const zip_load = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.initialize.load";

    assert.ok(self.document, `${method}: self.document must exist`);

    jszip
        .loadAsync(self.document)
        .then(zip => {
            self.zip = zip;

            done(null, self);
        });
}

/**
 *  Requires: self.path
 *  Produces: self.zip
 *
 *  Reads a ZIP document, by pathname.
 */
const zip_open = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.initialize.open";

    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`)

    console.log("-", "loading zipfile:", self.path);
    _.promise.make(self)
        .then(fs.read.p(self.path, "binary"))
        .then(_.promise.denodeify(zip_load))
        .then(_.promise.done(done, self, "zip"))
        .catch(done)
}

/**
 *  Parameterized version
 */
const zip_open_p = path => (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.initialize.open.p";

    const zip_path = _path || self.path;
    assert.ok(_.is.String(zip_path), `${method}: path is required`)

    _.promise.make(self)
        .then(sd => _.d.add(sd, "path", zip_path))
        .then(_.promise.denodeify(zip_load))
        .then(_.promise.done(done, self, "zip"))
        .catch(done)
}

/**
 *  API
 */
exports.initialize = _.promise.denodeify(zip_create);
exports.initialize.load = _.promise.denodeify(zip_load);
exports.initialize.open = _.promise.denodeify(zip_open);
exports.initialize.open.p = zip_open_p;
