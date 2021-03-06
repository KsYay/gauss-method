$(document).ready(function(){
  div = $('#result');
  $.verify.addRules({
    goodDecimal: function(input) {
      var matcher = /^(\+|\-)?[0-9]+(\.[0-9]+)?$/
      if(matcher.test(input.val())) {
        return true
      } else {
        return 'input error';
      }
    }
  })
  var a = [];
  firstGenerateInput(4, a);
});

var size; //the dimension of the square matrix
var matr;
var b; // free factors
var div; // for intermediate values and answer
var x; // result
var flag = true; // solution exists

// with default values
var firstGenerateInput = function(number, a) {
  size = number;
  var input_div = $('#form');
  input_div.html('');

  if(a.length == 0) {
    var a=[[0,1,3,2,-1], [1000,3,1,-5,-2], [-3,4,1,4,-1], [4,0,-2,-3,4]];
  }

  for(var i = 0; i < number; i++) {
    for(var j = 0; j < number; j++) {
      input_div.append("<input data-validate='goodDecimal,required' type='number' id='" + i + "_" + j + "' value='" + a[i][j] + "'>");
    }
    input_div.append("<input data-validate='goodDecimal,required' type='number' id='b" + i +"' value='" + a[i][j] + "'>");
    input_div.append('<br>');
  }
}

var generateInput = function(number) {
  size = number;
  var input_div = $('#form');
  input_div.html('');

  for(var i = 0; i < number; i++) {
    for(var j = 0; j < number; j++) {
      input_div.append("<input data-validate='goodDecimal,required' type='number' id='" + i + "_" + j + "'>");
    }
    input_div.append("<input data-validate='goodDecimal,required' type='number' id='b" + i +"'>");
    input_div.append('<br>');
  }
}
      
var init = function(){
  size = $('#size').val();
  matr = [size];
  b = [size];
  for(var i=0; i<size; i++){
    matr[i] = [];
    for(var j=0; j<size; j++){
      matr[i][j] = $('#' + i +'_'+ j).val();
    }
    b[i] = $('#b' + i).val();
  }
}

var directStep = function(){
  div.append("<h2> Прямий хід </h2>");
  div.append("<span> Робимо перетворення: </span> <br> <br>");
  var eps = Number.MIN_VALUE;

  for(var i=0; i<size-1; i++){
    var maxInColumn = findMaxAndReplaceTheRow(i);
    if(Math.abs(maxInColumn) < eps){
      flag = false;
      div.append("<span> Нема розв'язку! </span> <br>");
      return;
    }

    //Transformation of the matrix and the vector b to triangular form
    for(var j=i+1; j<size; j++){
      var scaleFactor = matr[j][i]/maxInColumn; //calculate the scale factor
      for(var k = i; k<size; k++){
        matr[j][k]-=scaleFactor*matr[i][k];
      }
      b[j]-=scaleFactor*b[i];
    }
    output(i); 
  }
}

var output = function(iter){
  var table = "<span> №" + (iter+1) + "</span> <br>";
  table += "<table border='1'>";
    for(var i=0; i<size; i++){
      table += "<tr>";
        for(var j=0; j<size; j++){
          table += "<td>" + matr[i][j] + "</td>";
        }
      table += "<td>" + b[i] + "</td>" + "</tr>";
    }
  table += "</table> <br>";
  div.append(table);
}

var backwardStep = function(){
  var solutionsDiv = $('.solution');
  solutionsDiv.html('');
  x = [size];
  for(var i = size-1; i >= 0; i--){
    // dotProd() looking for the sum of coefficients of known x
    x[i] = (b[i] - dotProd(matr[i], i + 1, size - 1)) / matr[i][i];
  }
  for(var i=0; i<size; i++){
    if(isNaN(x[i]) || x[i] == Number.POSITIVE_INFINITY || x[i] == Number.NEGATIVE_INFINITY){
      flag = false;
      div.append("<span> Нема розв'язку! </span> <br>");
      return;
    }
  }
  div.append("<h2> Обратний хід </h2>");
  solutionsDiv.append("<span> Розв'язок: </span> <br> <br>");
  for(var i=0; i<size; i++){
    solutionsDiv.append("<span>" + x[i] + "</span> <br>");
  }
}

var findMaxAndReplaceTheRow = function(i){  
   var j=i;
   var max=0;

   //Looking for and memorize largest absolute value element in the column  and remember his index
   for(var k=i; k<size; k++){
     var temp = Math.abs(matr[k][i]);
     if(temp>max){
       max=temp;
       j=k;
     }
   }

   //swap rows (rows of matrix and the elements of the vector b)
   if(j>i){
     var temp;
     for(var L=0; L<size; L++) 
     {
       temp = matr[i][L];
       matr[i][L]= matr[j][L];
       matr[j][L]= temp;
     }
     temp = b[j];
     b[j]=b[i];
     b[i]=temp;
   }
   return matr[i][i];
}

var dotProd = function(row, index1, index2){
  var sum = 0;
  for(var i = index1; i <= index2; i++) 
  {
    sum += row[i] * x[i];
  }
  return sum;
}

var gauss = function(){
  directStep();
  if(flag)
    backwardStep();
}
  
var errors = function (A, c){
  var errorsDiv = $('.errors');
  errorsDiv.html('');

  errorsDiv.append("<span> Вектор нев'язок: </span> <br> <br>");
  var er = 0;
  for(var i=0; i<size; i++){
    for(var j=0; j<size; j++){
      er += A[i][j]*x[j];      
    }
    er -= c[i];
    errorsDiv.append("<span>" + er + "</span> <br>");
  }
  errorsDiv.append("<br> <br>");
}

var main = function(){
  $("#form").verify({
    prompt: function(element, text, opts) {
      $(element).css('border', '1px solid #888');
      if(text!=null) {
        $(element).css('border', '2px solid red');
      }
    }
  });

  $('#form').validate(function(success){
    if(success) {
      init(); // initialization of variables
      var A = matr;
      var c = b;
      div.html('');
      $('.solution').html('');
      $('.errors').html('');
      flag = true;
      gauss();
      if(flag)
        errors (A, c);
    }
  });   
}
