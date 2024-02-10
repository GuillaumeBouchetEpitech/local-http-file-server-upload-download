
# local-http-file-server-upload-download

Share files from a browser app

Useful over LAN connected machines when too lazy to use a USB devices...

## Description

### Features
* simple http file server,
  * once launched, load the webpage from a browser, then
    * upload files (multiple uploads supported)
    * download listed files
    * navigate to different folders (if any)
* files are stored on the host machine of the server

# Missing

* there is no config about the file limit (current limit is 1To...)
* there is no auto refresh of the webpage if a file/folder is newly available
* there is no way to create a folder from the webpage
* there is no way to delete a file/folder from the webpage
* there is no indication that a file is fully uploaded,
  * the file is instantly listed
  * people can start downloading as soon as it's visible after a page refresh
* there is no tests... (the scope was tiny to begin with)

## How To Use

```bash
npm install
npm run build

# this will use the ./config/default.json values
# -> host/port/folderPathname
npm run start

# will then print a list of the ipv4 LAN IP detected
# -> other machine can load the page in a browser and start uploading/downloaing files LAN IP allow other LAN machines to find it


# example:

# Listening for requests... (0.0.0.0:11000)
#        ->  wlp8s0     IPv4       http://192.168.7.51:11000/
#        ->  lo         IPv4       http://127.0.0.1:11000/


```

# Thanks for watching !
