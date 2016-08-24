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

  * Model for handling users
  

* Login page
  
  * Javascript username validation
  * Authentication
  

* Chat improvements

  * Make links hyperlinks
  * Emoji
  * Embedded images

* Channels

  * ~~Clickable channel list~~
  * Switchable channels (e.g. Slack)


* Chrome desktop notifications
