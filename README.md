# React Chat

This is a simple chat app built using React, using websockets for real-time
communication, and a Redis data store.

To start redis, just run:

```bash
$ redis-server
```

To start the javascript and css build script, run:

```bash
$ npm run watch
```

Finally to start the web server, run:

```bash
$ ./watch.sh
```

## TODO

* ~~Working multi-user chat app~~

* Backend stuff

  * ~~Model for handling users~~

  * ~~Move users and messages from API into separate models~~
  

* Login page
  
  * Javascript username validation
  * Authentication
  

* Chat improvements

  * Make links hyperlinks
  * Emoji
  * Embedded images

* Channels

  * ~~Clickable channel list~~
  * ~~Switchable channels (e.g. Slack)~~
  * Ability to add/remove new channels
  * Have navigation to `/#channel` switch to `#channel`


* Chrome desktop notifications
