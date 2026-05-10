(function(){
var id = '1bk0suSSDMsWnlxiAss5xoSnFl-nfoqq-a3g6vdaVzbU';
var gid = '1932469646';
var url = 'https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json&tq&gid='+gid;
fetch(url)
  .then(response => response.text())
  .then(data => document.getElementById("json").innerHTML=myItems(data.substring(47).slice(0, -2))  
  );
function myItems(jsonString){
  var json = JSON.parse(jsonString);
  var table = '<table><thead><tr>'
  json.table.cols.forEach(column => table += '<th>' + column.label + '</th>')
  table += '</tr></thead><tbody>'
  json.table.rows.forEach(line => {
    table += '<tr>'
    line.c.forEach(cell => {
        try{var value = cell.f ? cell.f : cell.v}
        catch(e){var value = ''}
        table += '<td>' + value + '</td>'
      }
    )
    table += '</tr>'
    }
  )
  table += '</tbody></table>'
  return table
}
})();           