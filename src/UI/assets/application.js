/*
 * javascript for dictionary
 */

/* 
   call submit_search function when the text box is not empty
*/
$(document).ready(function(){
    $("#phrase").keypress(function(e){
	if(e.keyCode == 13)
	    if($("#phrase").val() != '')
		submit_search($("#phrase").val());
	});
});

/*
  record the query in Webkit's Web SQL Database
*/
function record_query(phrase)
{
    var data = [phrase, new Date()];

    yadadb.transaction(
	function(transaction)
	{
	    transaction.executeSql("INSERT INTO history VALUES(?, ?);", data);
	}
    );
    
    display_top_ten();  // refresh the list containing phrases from search history
}

function display_top_ten()
{
    yadadb.transaction(function(tx){tx.executeSql("SELECT * FROM history ORDER BY added_on DESC LIMIT 10", [], function(tx, results)
					 {
					     if(results.rows.length > 0) // refresh only if records exist
					     {
						 var length = results.rows.length, i;

						 var text = "<h4>Recent Searches</h4>"
						 
						 for(i=0; i<length; i++)
						 {
						     text = text + '<a href="#" onclick="javascript:submit_search(\'' + results.rows.item(i).phrase + '\');">' + results.rows.item(i).phrase.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;') + '</a><br />';
						 }
						 
						 text = text + '<p style="margin-top:10px;"><a style="color:#696969;" href="#" onclick="javascript:remove_history();">Clear History</a></p>'

						 $('#history_items').html(text);
					     }
					 })});
}

function submit_search(phrase)
{
    var url;

    record_query(phrase);

    url = "search://" + phrase;

    location.href = url; // this request gets tapped by the python host program
}

function render_definitions(definition_list)
{    
    var definitions = eval(definition_list); // make json object of the python dict

    var size = definitions.length;
    var text = "";

    if(size==0)
    {
	$("#definitions").html("Phrase not found.");
	return;
    }
    else 
    {
	def = " definition"
	
	if(size > 1)  // pluralize
	    def = def + "s"

	text = size + def + " found.";
    }

    for(i=0; i<size; i++)
    {
	// put in highlighted pieces of text for indicating the part of speech
	var tmp = '<article><h3>' + definitions[i].word + '</h3><span class="label label-info">' + definitions[i].part_of_speech + '</span><p>' + definitions[i].definition + '</p></article>';
	text += tmp;
    }

    $("#definitions").html(text);

    display_top_ten(); // refresh the list containing phrases from search history
}

function init_db()
{
    try
    {
	if(!window.openDatabase)
	{
	    // stop the app from running if Web SQL is not supported by Webkit
	    $('body').html('<h3>The application is not compatible with the Webkit component.</h3>')
	}
	else
	{
	    var db_name = "yadadb";
	    var display_name = "Local Datastore for YADA";
	    var version = "1.0";
	    var maxSize = 2*1024*1024;

	    yadadb = openDatabase(db_name, version, display_name, maxSize); // create database
	    create_table(); // create table
	    display_top_ten(); // refresh the list containing phrases from search history
	}
    }
    catch(e)
    {
	if(e==2)
	{
	    console.log("Invalid database version.");
	}
	else
	{
	    console.log("Unknown error "+e+".");
	}
	return;
    }
}

function create_table()
{
    yadadb.transaction(
	function(transaction)
	{
	    // create table if it doesn't exist
	    transaction.executeSql("CREATE TABLE IF NOT EXISTS history(phrase TEXT PRIMARY KEY, added_on DATETIME);", []);
	}
    );
}

function remove_history()
{
    $('#history_items').html('');

    yadadb.transaction(
	function(transaction)
	{
	    // clears history by dropping the table
	    transaction.executeSql("DROP TABLE history;", []);
	}
    );

    init_db(); // reinitialize database
}
