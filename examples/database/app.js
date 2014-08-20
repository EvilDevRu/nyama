/**
 * @author Dmitriy Yurchenko <evildev@evildev.ru>
 * @link http://nyama.evildev.ru/
 * @copyright Copyright (c) Dmitriy Yurchenko <evildev@evildev.ru>, 2014
 * @license http://nyama.evildev.ru/license/
 */

/**
 * NOTE: Use for run `node app.js index --city=your_city_name`
 */

require(__dirname + '/../../framework');

var config = require(__dirname + '/config/dev.js');

Nyama.createApplication(config).run();

