'use strict'

const fs = require('fs')
const Promise = require('bluebird')
const Joi = Promise.promisifyAll(require('joi'))
const Busboy = require('busboy')
const AWS = require('aws-sdk')
const render = require('../common/render')
const ERROR_CODE = require('../common/error')

const config = require('../../config')

function uploadFile (req) {
  const busboy = new Busboy({ headers: req.headers })

  return new Promise((resolve, reject) => {
    let uploaded = false
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      if(fieldname != 'file') {
        return file.resume();
      }
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype)

      const s3Stream = require('s3-upload-stream')(new AWS.S3({
        signatureVersion: config.aws.signatureVersion,
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
      }))

      const upload = s3Stream.upload({
        Bucket: config.aws.Bucket,
        Key: filename,
        ACL: 'public-read',
        StorageClass: 'REDUCED_REDUNDANCY',
        ContentType: 'binary/octet-stream'
      })

      upload.on('part', function (details) {
        console.log(details);
      });

      upload.on('uploaded', function (details) {
        console.log(details)
        resolve(details)
      })

      file.pipe(upload).on('error', reject)

      file.on('data', function (data) {
        // console.log('File [' + fieldname + '] got ' + data.length + ' bytes')
      })
      file.on('end', function () {
        // console.log('File [' + fieldname + '] Finished')
      })
    })
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log(fieldname);
      console.log(val);

      // console.log('Field [' + fieldname + ']: value: ' + inspect(val))
    })
    busboy.on('finish', function () {
      console.log('Done parsing form!')
    })

    req.pipe(busboy).on('error', reject)
  })
}

exports.create = function *() {
  if (!this.is('multipart')) {
    this.status = 400
    return render.call(this, {
      error: ERROR_CODE.bodyParse,
      message: 'Content type should be multipart'
    })
  }
  const result = yield uploadFile(this.req)

  if (result.error) {
    this.status = 400
    return render.call(this, result)
  }

  this.status = 200
  render.call(this, {
    success: true,
    detail: result
  })
}
