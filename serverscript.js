// DATABASE PERSISTENCE EXAMPLE

// Retreive data from the database
function getData() {
    var queryResult = db.Execute('SELECT * FROM sampleTable ORDER BY timePosted DESC');
    var rows = JSON.parse(queryResult);
    if (rows.length > 0 && typeof rows[0].Error != 'undefined') {
        return '{"status":"noTable"}';
    }
    return queryResult;
}

// Create talbe
function createTable() {
    var result = {};

    var queryResult = db.Execute('SELECT TOP 1 * FROM sampleTable');
    var row = JSON.parse(queryResult);

    if (row.length > 0 && typeof row[0].Error != 'undefined') {
        db.Execute('CREATE TABLE sampleTable(id INTEGER PRIMARY KEY IDENTITY(1,1), userId nvarchar(50), value nvarchar(50), likes INTEGER, timePosted datetime NOT NULL DEFAULT GETDATE());');
        result = '{"status":"tableCreated"}';
    } else
        result = '{"status":"tableExist"}';

    return JSON.stringify(result);
}

// Insert into the database
function insert() {
    console.log ("Insert into table");
    if (args.Get("value").length > 50)
        return '{"result":"error"}';
    else {
        db.Execute('INSERT INTO sampleTable(userId, value, likes) VALUES(@currentUser,@value, 0)');
        return getData();
    }
}


//Update likes
function addLike() {
    console.log ("server Add likes");
	var userId = args.Get("userId");
    console.log ("userId : " + userId);
    db.Execute ('UPDATE sampleTable SET likes = likes + 1 WHERE id = @userId');
    return getData();
}
