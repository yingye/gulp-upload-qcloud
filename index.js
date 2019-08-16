var fs = require('fs')
var path = require('path')
var gutil = require('gulp-util')
var through2 = require('through2')
var assign = require('object-assign')
var Q = require('q')
var COS = require('cos-nodejs-sdk-v5')

var log = gutil.log
var colors = gutil.colors

module.exports = function (config) {
  config = config || {}
  config = assign({
    AppId: '',
    SecretId: '',
    SecretKey: '',
    Bucket: '',
    Region: '',
    Prefix: '',
    OverWrite: false,
    Headers: false
  }, config)

  if (config.Bucket.indexOf('-') === -1) {
    config.Bucket += '-' + config.AppId
  }

  var existFiles = 0
  var uploadedFiles = 0
  var uploadedFail = 0
  var tasks = []

  var cos = new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey
  })

  return through2.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb()
    }

    var filePath = file.path
    var fileKey = path.join(config.Prefix, path.relative(file.base, file.path))

    var handler = function () {
      var defer = Q.defer()
      upload()

      function check (callback) {
        var defer = Q.defer()
        cos.headObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: fileKey
        }, function (err, data) {
          if (err) {
            callback(false)
          } else {
            log('Exist ' + fileKey)
            callback(200 == data.statusCode)
          }
        })
        return defer.promise
      }

      function putFile () {
        let obj = assign(config.Headers || {}, {
          Bucket: config.Bucket,
          Region: config.Region,
          Key: fileKey,
          ContentLength: fs.statSync(filePath).size,
          Body: fs.createReadStream(filePath),
          onProgress (progressData) {
            // console.log(progressData)
          }
        })
        cos.putObject(obj, function (err, data) {
            if (err) {
              uploadedFail++
              log('err-putObject', err)
              defer.reject()
            } else {
              uploadedFiles++
              log(colors.green('Upload ' + fileKey + ' Success'))
              defer.resolve()
            }
          })
      }

      function upload () {
        var uploadFlag = true
        if (!config.OverWrite) {
          check(function (status) {
            if (status) {
              existFiles++
              defer.resolve()
            } else {
              putFile()
            }
          })
        } else {
          putFile()
        }
      }
      return defer.promise
    }
    tasks.push(handler())

    cb()
  }, function () {
    Q.allSettled(tasks)
      .then(function (fulfilled) {
        log('Upload to qcloud: Total:', colors.green(fulfilled.length),
          'Skip:', colors.gray(existFiles),
          'Upload:', colors.green(uploadedFiles),
          'Failed:', colors.red(uploadedFail))
      }, function (err) {
        log('Failed upload files:', err)
      })
  })
}
