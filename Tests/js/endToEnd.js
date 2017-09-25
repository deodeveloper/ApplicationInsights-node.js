const assert = require('assert');

// Special embedded test cases for testing if app can close
if (process.argv.indexOf('embeddedTestCase-AppTerminates1') > -1) {
    var appInsights = require('../..');
    appInsights.setup("iKey").start();
    return;
} else if (process.argv.indexOf('embeddedTestCase-AppTerminates2') > -1) {
    var appInsights = require('../..');
    appInsights.setup("iKey").start();
    appInsights.defaultClient.trackEvent({name: 'testEvent'});
    appInsights.defaultClient.flush();
    return;
}

describe('module', function () {
    describe('#require', function () {
        it('loads the applicationinsights module', function (done) {
            assert.doesNotThrow(function() { return require('../..') });
            done();
        });
    });
    describe('applicationinsights', function() {
        it('does not prevent the app from terminating if started', function (done) {
            this.timeout(15000);
            var testCase = require('child_process').fork(__filename, ['embeddedTestCase-AppTerminates1']);
            var timer = setTimeout(function(){
                assert(false, "App failed to terminate!");
                testCase.kill();
                done();
            }, 15000);
            testCase.on("close", function() {
                clearTimeout(timer);
                done();
            });
            
        });
        it('does not prevent the app from terminating if started and called track and flush', function (done) {
            this.timeout(15000);
            var testCase = require('child_process').fork(__filename, ['embeddedTestCase-AppTerminates2']);
            var timer = setTimeout(function(){
                assert(false, "App failed to terminate!");
                testCase.kill();
                done();
            }, 15000);
            testCase.on("close", function() {
                clearTimeout(timer);
                done();
            });
        });
    });
});
