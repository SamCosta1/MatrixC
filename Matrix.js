var variables = new Map();

function Matrix (arrMatrix) {
   if (arrMatrix instanceof Array)
     this.matrix = math.matrix(arrMatrix);
   else
     this.matrix = arrMatrix;

   // Standard functions
   this.determinant = function() { return math.det(this.matrix); }
   this.det = function () { return this.determinant(); }

   this.transpose = function() { return new Matrix(math.transpose(this.matrix));  }
   this.add = function(other)  { return new Matrix(math.add(this.matrix, other.matrix)); }
   this.subtract = function(other)
            {
                var minusOher = math.multiply(other.matrix, -1);
                return new Matrix(math.add(this.matrix, minusOher));
            }

    // Functions with setters
    this.determinant = function(label)
            {
                var tmp = math.det(this.matrix);
                variables.set(label,tmp;)
                return tmp;
            }
    this.det = function (label) { return this.determinant(label); }

    this.transpose = function(label)
              {
                 var tmp = new Matrix(math.transpose(this.matrix));
                 variables.set(label,tmp);
                 return tmp;
              }
              //TODO
    this.add = function(other, label)  { return new Matrix(math.add(this.matrix, other.matrix)); }
    this.subtract = function(other, label)
             {
                 var minusOher = math.multiply(other.matrix, -1);
                 return new Matrix(math.add(this.matrix, minusOher));
             }
}
