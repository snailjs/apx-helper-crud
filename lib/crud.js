var util = require('util')
  , async = require('async')

/**
 * Find rows based on criteria
 * @param Model
 * @param data
 * @param fn
 */
exports.find = function(Model,data,fn){
  Model.find(data,fn)
}

/**
 * Find single row by criteria
 * @param Model
 * @param data
 * @param fn
 */
exports.findOne = function(Model,data,fn){
  Model.findOne(data,fn)
}

/**
 * List rows and control filtering
 * @param Model
 * @param data
 * @param fn
 */
exports.list = function(Model,data,fn){
  var search = {}
  search.start = data.start || 0
  search.limit = data.limit || 10
  search.find = data.search || null
  search.sort = data.sort || ''
  Model.list(search,fn)
}

/**
 * Save one or many rows and return the updated model
 * @param Model
 * @param data
 * @param fn
 */
exports.save = function(Model,data,fn){
  var response = []
  if(!util.isArray(data) && 'object' === typeof data)
    data = [data]
  async.each(
    data,
    function(v,next){
      Model.findById(v._id,function(err,row){
        if(err)
          next(err)
        else {
          if(null === row){
            row = new Model(v)
          } else {
            row.merge(v)
          }
          row.save(function(err,result){
            if(err)
              next(err)
            else {
              response.push(result)
              next()
            }
          })
        }
      })
    },
    function(err){
      if(err) fn(err)
      else {
        if(1 === response.length) response = response[0]
        fn(null,response)
      }
    }
  )
}

/**
 * Remove one or many rows
 * @param Model
 * @param data
 * @param fn
 */
exports.remove = function(Model,data,fn){
  if('string' === typeof data || !util.isArray(data) && 'object' === typeof data)
    data = [data]
  async.each(
    data,
    function(v,next){
      Model.findByIdAndRemove(v,function(err){
        next(err)
      })
    },
    fn
  )
}