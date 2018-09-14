var plist = require('plist');
var fs = require('fs');
var _ = require('lodash');

var iosProjName;    // iOSプロジェクト名
var iosProjFolder;  // iOSプロジェクトフォルダのパス

// 文字列(config.xml)から任意のディレクティブの値を取得
var getValue = function(config, name) {
    var value = config.match(new RegExp('<' + name + '>(.*?)</' + name + '>', "i"));
    if(value && value[1]) {
        return value[1]
    } else {
        return null
    }
};

// プロジェクトフォルダのパスをセット
function initIosDir(){
    if (!iosProjFolder) {
        // config.xmlのnameディレクティブから、プロジェクト名を取得
        var config = fs.readFileSync("config.xml").toString();
        var name = getValue(config, "name");

        iosProjName = name;
        iosProjFolder =  "platforms/ios/" + name;
    }
}

// proejct名を取得
function getTargetIosProjName() {
    initIosDir();
    return iosProjName;
}

// proejct.pbxprojのパスを取得
function getTargetIosDir() {
    initIosDir();
    return iosProjFolder;
}

// plist更新
function updatePlist(targetFilePath, descKeys) {
    // Info.plist読込
    var infoPlist = plist.parse(fs.readFileSync(targetFilePath, 'utf-8')),
        tempInfoPlist;

    descKeys.forEach(function (key) {
        infoPlist[key] = "usage description is here";
    });

    tempInfoPlist = plist.build(infoPlist);
    tempInfoPlist = tempInfoPlist.replace(/<string>[\s\r\n]*<\/string>/g,'<string></string>');
    // 書込
    fs.writeFileSync(targetFilePath, tempInfoPlist, 'utf-8');
}

// 設定ファイルを取得
function getUsageDescriptions(context) {
  var targetFileArr = [];
  var deferred = context.requireCordovaModule('q').defer();
  var path = context.requireCordovaModule('path');
  var glob = context.requireCordovaModule('glob');

  glob("usage-description/*.json", function(err, files) {
    if (err) {
      deferred.reject(err);
    } else {
      files.forEach(function(file) {
        var matches = file.match(/usage-description\/(.*).json/);
        if (matches) {
          targetFileArr.push({
            name: matches[1],
            path: path.join(context.opts.projectRoot, file)
          });
        }
      });

      deferred.resolve(targetFileArr);
    }
  });
  return deferred.promise;
}


module.exports = function(context) {
  var path = context.requireCordovaModule('path');
  var deferred = context.requireCordovaModule('q').defer();

  // 設定ファイルを取得
  getUsageDescriptions(context).then(function(targetFiles) {
    targetFiles.forEach(function(target) {
      // JSONファイル読込
      var descJson = require(target.path);

      // descriptionsプロパティ
      if (_.has(descJson, "descriptions") && descJson.descriptions.length >= 0) {
        // Info.plist へ書込み
        var plistName =  getTargetIosProjName() + '-Info.plist';
        var plistFilePath = path.join(getTargetIosDir(), plistName);
        updatePlist(plistFilePath, descJson.descriptions);
      }
    });
  }).catch(function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
};
