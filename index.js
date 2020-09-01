/**
 * create an ssb-db instance and add a message to it.
 */
var pull = require('pull-stream')

//create a secret-stack instance and add ssb-db, for persistence.
var createApp = require('secret-stack')({})
  .use(require('ssb-db'))


// create the db instance.
// Only one instance may be created at a time due to os locks on port and
// database files.
var conf = require('ssb-config')
conf.path = conf.path + '-testing'
console.log('conf', conf)
var app = createApp(conf)

//your public key, the default key of this instance.
// app.id

//or, called remotely

app.whoami(function (err, data) {
  console.log('my id', data.id) //your id
})

// publish a message to default identity
//  - feed.add appends a message to your key's chain.
//  - the `type` attribute is required.

app.publish({ type: 'post', text: 'My First Post!' }, function (err, msg) {
  if (err) throw err

  // the message as it appears in the database:
  console.log('msg: ', msg)

  // and its hash:
  console.log('key: ', msg.key)

  arr()
})

// collect all the messages into an array, calls back, and then ends
// https://github.com/pull-stream/pull-stream/blob/master/docs/sinks/collect.md
function arr () {
  pull(
    app.createLogStream(),
    pull.collect(function (err, messagesArray) {
      console.log('arrrr', messagesArray)
    })
  )
}

// collect all messages for a particular keypair into an array, calls back,
// and then ends
// https://github.com/pull-stream/pull-stream/blob/master/docs/sinks/collect.md
pull(
  app.createHistoryStream({id: app.id}),
  pull.collect(function (err, messagesArray) {
    console.log('history arrr', messagesArray)
  })
)
