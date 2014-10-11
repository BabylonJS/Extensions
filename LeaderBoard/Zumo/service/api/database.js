var tablesDef = require("./tables");
var _ = require("./common.js");

// Iterate on multiple sql statements

var _getCallback = function (callback) {
    var success = function (r) { console.log('x : ' + r) };
    var error = function (err) { console.error('x : ' + err) };

    if (!callback || callback == undefined) {
        callback = {
            success: function (r) { success(r); },
            error: function (err) { error(err); }
        }
        return callback;
    }

    if (!callback.success) {
        callback.success = success;
    }
    if (!callback.error) {
        callback.error = error;
    }

    return callback;
}

var _internalIterate = function (mssql, arr, index, callback) {
    callback = _getCallback(callback);

    if (!mssql) {
        callback.error('mssql is not defined');
        return;
    }

    var query = arr[index].query;
    var params = arr[index].params;

    if (params == null)
        params = [];

    mssql.query(query, params, {
        success: function (results) {
            index = index + 1;

            if (index >= arr.length) {
                callback.success('done');
            } else {
                _internalIterate(mssql, arr, index, callback);
            }

        },
        error: function (err) {
            callback.error('error on script : ' + arr[index].query + ' error : ' + err);
        }
    });
}

// iterate through severals sql scripts
exports.iterateSql = function (request, arr, callback) {
    var mssql = request.service.mssql;

    _internalIterate(mssql, arr, 0, callback);
}

// Get the rows count from a table for a particular gameId
exports.getTableRowsCount = function (request, tableName, gameId, callback) {
    callback = _getCallback(callback);

    var mssql = request.service.mssql;

    var sql = "Select count(*) as Count from " + tableName + " where GameId = ? ";

    mssql.query(sql, [gameId], {
        success: function (r) {
            var results = r.length ? r : [{ Count: 0 }];
            callback.success(r);
        },
        error: function (err) {
            callback.error(err);
        }

    });
}

exports.deleteRow = function (request, tableName, id, callback) {
    callback = _getCallback(callback);

    var tables = request.service.tables;
    var tableToDel = tables.getTable(tableName);

    tableToDel.del(id, {
        success: function () {
            var s = { result: 'row deleted' };
            callback.success([s]);
        },
        error: function (err) {
            callback.error('delete table : ' + err);
        }
    });
}

// Merge a game in database
exports.mergeTable = function (request, tableName, table, callback) {
    callback = _getCallback(callback);

    var mssql = request.service.mssql;
    var columns = [];
    var params = [];

    if (!table.id) {
        table.id = null;
    }

    for (var prop in table) {
        if (table.hasOwnProperty(prop)) {
            if (prop.toLowerCase() === 'id') {
                columns.push('id');
                params.push(table.id === undefined ? null : table.id);
                continue;
            }
            if (prop.toLowerCase() === 'createddate' || prop.toLowerCase() === 'updateddate') {
                continue;
            }
            if (prop == 'f') {
                columns.push('f');
                params.push(table['f'] === undefined ? null : JSON.stringify(table['f']))
                continue;
            }

            columns.push(prop);
            params.push(table[prop] === undefined ? null : table[prop]);
        }
    }

    if (params.length === 0) {
        callback.error('game properies are empty, you must provide at least an id when updating or a name when creating.');
        return;
    }

    var sqlRecord = 'MERGE ' + tableName + ' AS target ' +
    'USING ( Select ';
    for (var i = 0; i < columns.length; i++) {
        sqlRecord += ' ? as [' + columns[i] + ']';
        if (i < columns.length - 1)
            sqlRecord += ', ';
    }
    sqlRecord += ' ) as source ' +
               'on target.id = source.id ' +
               'When Matched then ' +
               'Update set ';
    for (var j = 0; j < columns.length; j++) {
        if (columns[j] != 'id')
            sqlRecord += columns[j] + ' = source.' + columns[j] + ', ';
    }
    sqlRecord += 'UpdatedDate = getdate() ' +
               'When Not Matched then ' +
               'Insert (';
    for (var k = 0; k < columns.length; k++) {
        if (columns[k] != 'id')
            sqlRecord += columns[k] + ', ';
    }
    sqlRecord += 'CreatedDate, UpdatedDate) Values (';
    for (var l = 0; l < columns.length; l++) {
        if (columns[l] != 'id')
            sqlRecord += 'source.' + columns[l] + ', ';
    }
    sqlRecord += 'getdate(), getdate()) OUTPUT ';

    for (var i = 0; i < columns.length; i++) {
        sqlRecord += 'inserted.' + columns[i];
        if (i < columns.length - 1)
            sqlRecord += ', ';
    }
    sqlRecord += ';';


    mssql.query(sqlRecord, params, {
        success: function (results) {
            callback.success(results);
        },
        error: function (err) {
            callback.error('merge table : ' + err);
        }
    });
};

exports.getRaw = function (request, sql, params, callback) {
    callback = _getCallback(callback);

    var mssql = request.service.mssql;


    mssql.query(sql, params, {
        success: function (results) {
            callback.success(results);
        },
        error: function (err) {
            callback.error(err);
        }
    });
}

exports.getRows = function (request, tableName, where, fields, order, callback) {

    // Absent optional arguments
    if (_.isNull(callback) && (typeof order === 'object' && order.success != undefined)) {
        callback = order;
        order = null;
    }
    if (_.isNull(callback) && (typeof fields === 'object' && fields.success != undefined)) {
        callback = fields;
        order = null;
        fields = null;
    }

    if (_.isNull(callback) && (typeof where === 'object' && where.success != undefined)) {
        callback = where;
        order = null;
        fields = null;
        where = null;
    }

    // check callback function
    callback = _getCallback(callback);

    var mssql = request.service.mssql;
    var tables = request.service.tables;
    var hasfColumns = false;

    var tbl = tables.getTable(tableName);
    var query;
    var fColumns = [];

    if (!_.isNull(fields)) {
        var selectColumns = '';
        var columns = tablesDef.getTable(tableName);

        fields = fields.split(',');

        for (var i in fields) {
            var columnName = fields[i];
            if (columns.hasOwnProperty(columnName)) {
                selectColumns += columnName + ',';
            } else {
                hasfColumns = true;
                fColumns.push(columnName);
            }
        }

        if (hasfColumns)
            selectColumns += 'f';
        else
            selectColumns = selectColumns.substring(0, selectColumns.length - 1);


        query = tbl.select(selectColumns)
    } else {
        // it's a * columns, so we need to include f fields
        hasfColumns = true;
        query = tbl;
    }

    if (!_.isNull(order)) {
        if (!_.isNull(order.order) && !_.isNull(order.orderBy)) {
            if (order.order == 'asc') {
                query = query.orderBy(order.orderBy)
            } else if (order.order == 'desc') {
                query = query.orderByDescending(order.orderBy)
            }
        }
    }
    if (!_.isNull(order) && !_.isNull(order.page) && !_.isNull(order.count)) {
        var skip = (order.page - 1) * order.count;
        query = query.skip(skip).take(order.count);
    }

    if (!_.isNull(where)) {
        query = query.where(where);
    }

    query.read({
        success: function (results) {
            if (hasfColumns && !_.isNullOrEmpty(results)) {
                for (var i in results) {
                    var r = results[i];

                    r = tablesDef.parseFromDb(tableName, r, fColumns);
                }
            }

            callback.success(results);
        },
        error: function (err) {
            callback.error(err);
        }
    });

}


// get rows from a table with fields specified (or *) and a where object
exports.getRows2 = function (request, tableName, fields, where, orderBy, page, count, callback) {
    callback = _getCallback(callback);

    var mssql = request.service.mssql;

    var query = "";

    if (fields === "*" || fields == undefined) {
        query += "* ";
    } else {
        for (var i = 0; i < fields.length; i++) {
            query += fields[i];
            if (i < fields.length - 1)
                query += ", ";
        }
    }

    var sql = "select " + query + " from " + tableName;
    var params = [];
    if (where != undefined) {
        sql += " where 1=1 "
        for (var prop in where) {
            if (where.hasOwnProperty(prop)) {
                if (where[prop] != undefined) {
                    sql += "and " + prop + " = ? ";
                    params.push(where[prop]);
                }
            }
        }
    }

    if (orderBy != undefined) {
        sql += ' order by ' + orderBy + ' ';
    } else {
        sql += ' order by id ';
    }


    if (page != undefined || count != undefined) {
        sql += ' Offset ? Rows Fetch next ? Rows only';

        if (page == undefined) {
            page = 1;
        }

        if (count == undefined) {
            count = 100;
        }

        var index = (page - 1) * count;

        params.push(index);
        params.push(count);
    }


    mssql.query(sql, params, {
        success: function (results) {

            if (results != null && results.length > 0) {
                for (var i in results) {
                    var r = results[i];

                    if (r.hasOwnProperty('f') && r.f != null) {
                        var fieldsAdded = JSON.parse(r.f);
                        for (var fa in fieldsAdded) {
                            r[fa] = fieldsAdded[fa];
                        }
                        delete r['f'];
                    }

                }
            }

            callback.success(results);
        },
        error: function (err) {
            callback.error(err);
        }
    });
};

// Get the columns name from a table
exports.getTableColumns = function (request, tableName, callback) {
    callback = _getCallback(callback);

    var mssql = request.service.mssql;

    var queryTable = "Select C.Name from sys.columns C " +
                     "Inner Join sys.tables T on T.object_id = C.object_id " +
                     "where T.name = '" + tableName + "' ";

    var columns = [];

    mssql.query(queryTable, {
        success: function (results) {
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    columns.push(results[i].Name);
                }
            }
            callback.success(columns);
        }
    })
}

