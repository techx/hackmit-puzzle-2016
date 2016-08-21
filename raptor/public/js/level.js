/* Level
 * @author Pat
 * @version 1.0.2
 * @date 2016/07/12
 * @edit 2016/07/12
 */

 var Level = (function() {
   'use strict';

   var exports = {};

   function LevelObject(config) {
     this.start = config.start;
     this.finish = config.finish;
     this.limits = config.limits;
     this.dimensions = config.dimensions;
     this.frames = config.frames;
     this.rate = config.rate;
   }

   exports.loadLevel = function(name, callback) {
     Http.get('/levels/' + name + '.json', function(data) {
       callback(new LevelObject(data));
     });
   };

   return exports;
 })();
