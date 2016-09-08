# Binary trees: Simple Binary, AVL, Red-Black

## npm scripts

`watch` - starts file watcher

`lint` - runs eslint on `/src`

`test` - runs tests and formats piped TAP output with [tap-spec](https://github.com/scottcorgan/tap-spec).

`ci` - Travis CI integration + zuul multi-framework & browser tests

`cover` - generates code coverage text-summary report in terminal

`report` - generates code coverage html report and opens it in browser

`coveralls` - runs code coverage and sends report to coveralls

`zuul` - runs browser tests via zuul at `http://localhost:9966/__zuul`

## Travis CI / Sauce Connect Configuration

[**Sauce Connect**](https://docs.saucelabs.com/reference/sauce-connect/) -  Used to create tunnel allowing [Travis CI](https://travis-ci.org/) to utilize [Sauce Labs](https://saucelabs.com), a browser and mobile testing platform.

If you plan to use Sauce Connect in your new module, be sure to [sign up](https://saucelabs.com/signup) with Sauce Labs if you haven’t already (it’s free for Open Source projects), and get your access key from your account page.

Then you'll want to replace the secured access key in `.travis.yml` with your own. See the [Getting Started](https://docs.saucelabs.com/ci-integrations/travis-ci/) guide on Travis for more info on setting this up.

Best bet if you're a new Travis and/or Sauce Labs user is to follow their steps to create a new `.travis.yml` file.

## Publishing
When you are ready to publish a new version of your module, the following steps can be used:
  1. add and commit your changes via git
  2. `npm version patch -m "Ugrade message..."`
  3. `npm publish`

If publish is a success, the `postpublish` npm script will run `git push origin master --follow-tags`, pushing up and tagging your code properly.

If you run `npm version patch` before committing your changes, you'll get a message like `npm ERR! Git working directory not clean.`. Commit and retry.
