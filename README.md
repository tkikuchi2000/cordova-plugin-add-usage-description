# cordova-plugin-add-usage-description
Add usage description to Info.plist


## How to Use

    
Install the plugin by fetching the dependencies

    $ cordova plugin add https://github.com/tkikuchi2000/cordova-plugin-add-usage-description.git#1.1.2

Modify your project root to have the following structure:

```
Cordova Project Root
  |
  |__ usage-description
       |
       |__  usage-description.json
```

A JSON file may look like this.

```
{
  "descriptions" : [
    "NSCameraUsageDescription",
    "NSLocationWhenInUseUsageDescription",
    "NSLocationAlwaysUsageDescription"
  ]
}
```


Install iOS or Android platform

    cordova platform add ios
    cordova platform add android
    
Run the code

    cordova prepare ios 



Info.plist is modified like this:

```
    ...
    <key>NSCameraUseUsageDescription</key>
    <string>usage description is here</string>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>usage description is here</string>
    <key>NSLocationAlwaysUsageDescription</key>
    <string>usage description is here</string>
    ...
```

Describe usage in InfoPlist.strings
( use plugin: [cordova-plugin-localization-string](https://github.com/kelvinhokk/cordova-plugin-localization-strings#readme) ).

