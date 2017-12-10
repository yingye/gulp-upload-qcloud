# gulp-upload-qcloud

腾讯云上传 gulp 插件

## Install

```
npm install --save-dev gulp-upload-qcloud
```

## Usage

```js
const gulp = require('gulp');
const uploadQcloud = require('gulp-upload-qcloud');

gulp.task('upload', () => {
  return gulp.src(['test/**/*.*'])
    .pipe(uploadQcloud({
      AppId: 'STRING_VALUE',
      SecretId: 'STRING_VALUE',
      SecretKey: 'STRING_VALUE',
      Bucket: 'STRING_VALUE',
      Region: 'STRING_VALUE',
      Perfix: 'demo/sub'
      OverWrite: false
    }));
});
```

## API

### uploadQcloud([options])

#### options

Type: Object

There are 7 options:

* `AppId`(string): 注册或登录 [腾讯云](https://cloud.tencent.com/login) 获取您的AppId。
* `SecretId`(string): 到 [腾讯云控制台密钥管理](https://console.cloud.tencent.com/capi) 获取您的项目 SecretId 和 SecretKey。
* `SecretKey`(string): 同 SecretId。
* `Bucket`(string): 到 [COS 对象存储控制台](https://console.cloud.tencent.com/cos4) 创建存储桶，得到 Bucket（存储桶名称） 和 Region（地域名称）。
* `Region`(string): Bucket 所在区域。枚举值请见：[Bucket 地域信息](https://cloud.tencent.com/document/product/436/6224)。
* `Perfix`(string): 自定义文件前缀，例如本地文件路径 img.png ，设置了 `Perfix: 'demo/sub'`，最终腾讯云路径为 `demo/sub/img.png`。
* `OverWrite`(string): 是否覆盖同名文件，默认 false。

## TIPS

该插件基于 [腾讯云 COS Nodejs SDK V5](https://github.com/tencentyun/cos-nodejs-sdk-v5) 构建，可参考腾讯云官方文档 [Node.js SDK](https://cloud.tencent.com/document/product/436/8629)。
