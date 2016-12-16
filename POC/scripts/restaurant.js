// arrays
var tables=[];
var employees=[];
$(document).ready(function(){
  console.log("JQ");
getTables();
getEmployees();
});
var createEmployee = function(){
  console.log( 'in createEmployee' );
  // get user input
  var employeeFirstName = document.getElementById( 'employeeFirstNameIn' ).value;
  var employeeLastName = document.getElementById( 'employeeLastNameIn' ).value;
  // create object for employee
  var newEmployee= {
    firstName : employeeFirstName,
    lastName : employeeLastName
  }; // end object
  // push into employees array
  sendEmployee( newEmployee );
  getEmployees();
  // update display
  listEmployees();
}; // end createEmployee

var createTable = function(){
  console.log( 'in createTable' );
  // get user input
  var tableName = document.getElementById('nameIn').value;
  var tableCapacity = document.getElementById('capacityIn').value;
  // table object for new table
  var newTable = {
    'name': tableName,
    'capacity': tableCapacity,
    'server': -1,
    'status': 'empty'
  };
  // push new obejct into tables array
  sendTable( newTable );
  console.log( 'added table: ' + newTable.name );
  getTables();
  // update output
}; // end createTable

var cycleStatus = function( index ){
  console.log( 'in cycleStatus: ' + index );
  // move table status to next status
  switch( tables[index].status ){
    case  'empty':
        tables[index].status = 'seated';
        sendStatus(tables[index]);
        break;
    case  'seated':
        tables[index].status = 'served';
        sendStatus(tables[index]);
        break;
    case  'served':
        tables[index].status = 'dirty';
        sendStatus(tables[index]);
        break;
    case  'dirty':

      tables[index].status = 'empty';
      sendStatus(tables[index]);
      break;
  }
  // show tables on DOM
  listTables();
}; // end cycleStatus

var listEmployees = function(){
  console.log( 'in listEmployees', employees );
  document.getElementById('employeesOutput').innerHTML = '<ul>';
  // loop through the tables array and display each table
  for( i=0; i< employees.length; i++ ){
    var line = employees[i].first_name + " " + employees[i].last_name + ', id: ' + i;
    // add line to output div
    document.getElementById('employeesOutput').innerHTML += '<li>' + line + '</li>';
  }
  document.getElementById('employeesOutput').innerHTML += '</ul>';
  // update tables display
  listTables();
}; // end listEmployees

var listTables = function(){
  console.log( "in listTables" );
  // target our output div

  document.getElementById('tablesOutput').innerHTML = '';
  // loop through the tables array and display each table

  // select to assign a server to this table
  var selectText = '<select>';
  for (var i = 0; i < employees.length; i++) {
    selectText+= '<option value=' + i + '>'+ employees[i].first_name + ' ' + employees[i].last_name + '</option>';
  }
  selectText += '</select>';
  // display employees
  for( i=0; i< tables.length; i++ ){
    // status is a button that, when clicked runs cycleStatus for this table
    var line = tables[i].name + " - capacity: " + tables[i].capacity + ', server: ' + selectText + ', status: <button onClick="cycleStatus(' + i + ')">' + tables[i].status + "</button>";
    // add line to output div
    document.getElementById('tablesOutput').innerHTML += '<p>' + line + '</p>';
  }

};

 // end listTables


function sendEmployee(sending){
console.log('sending employee...');
$.ajax({
  type:'POST',
  url:'/addemployee',
  data: sending,
  success:function(response){
    console.log('success!', response);
  }
});
}
function sendTable(sending){
console.log('sending table...');
$.ajax({
  type:'POST',
  url:'/addtable',
  data: sending,
  success:function(response){
    console.log('Table success!', response);
  }
});
}

function getTables(){
  console.log('Getting Tabeees...');
  $.ajax({
    type:'GET',
    url:'/gettables',
    success: function(response){
      console.log('I got', response);
      tables = [];
      for (var i = 0; i < response.length; i++) {
        tables.push(response[i]);
        listTables();
      }
    }
  });
}
function getEmployees(){
  console.log("Who up?");
  $.ajax({
    type:'GET',
    url:'/getemployees',
    success:function(response){
      console.log("heres", response);
      employees = [];
      for (var i = 0; i < response.length; i++) {
        employees.push(response[i]);
      listEmployees();
      }
    }
  });
}

function sendStatus(status){
console.log(status);
var gift = {
    status: status.status,
    id:status.id
    };

$.ajax({
  type:'PUT',
  url:'/putstatus',
  data:gift,
  success:function(response){
    console.log(response, 'yo');
  }
});
}
