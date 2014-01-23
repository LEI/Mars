function DiamondSquare()
{
    this.map = [];
    this.size = 0;
    this.delta = 0;
    this.min = 0;
    this.max = 0;

    /**
     * function: Init
     */
    DiamondSquare.prototype.init = function(min, max, size, delta) {
        this.min = min;
        this.max = max;

        var size_int = parseInt(size);
        /*if(size_int/2 == Math.round(size_int/2))
         this.size = size_int+1;
         else
         this.size = size_int;*/
        this.size = size_int;

        this.delta = delta;

        for (var i=0; i<size_int; i++) {
            this.map[i] = [];
            for (var j=0; j<size_int; j++) {
                this.map[i][j] = "*";
            }
        }
    }

    /**
     * function: initCorners
     */
    DiamondSquare.prototype.initCorners = function() {
        //console.log(this.random());
        var maxIndex = this.size - 1;
        this.map[0][0] = this.random();
        this.map[0][maxIndex] = this.random();
        this.map[maxIndex][0] = this.random();
        this.map[maxIndex][maxIndex] = this.random();
    }

    /**
     * function: random
     */
    DiamondSquare.prototype.random = function() {
        var possibleValues = [];
        for (var i=this.min;i<this.max;i++) {
            possibleValues.push(i);
        }

        var index = Math.floor(Math.random()*possibleValues.length);
        //console.log(possibleValues);
        return possibleValues[index];
    }

    /**
     * function: noise
     */
    DiamondSquare.prototype.noise = function() {
        return Math.floor((Math.random()*this.delta));
    }

    /**
     * function: egalize
     */
    DiamondSquare.prototype.egalize = function(val) {
        if (val > this.max)
            return this.max;

        if (val < this.min)
            return this.min;

        return val;
    }

    /**
     * function: DiamondSquare
     */
    DiamondSquare.prototype.DS = function(x,y, space) {

        var x_spaceIndex = Math.floor(x + space);
        var x_spaceIndexHalf = Math.floor(x + (space/2));

        var y_spaceIndex = Math.floor(y + space);
        var y_spaceIndexHalf = Math.floor(y + (space/2));

        // square
        var topLeft = this.map[x][y];
        var topRight = this.map[x_spaceIndex][y];
        var botLeft = this.map[x][y_spaceIndex];
        var botRight = this.map[x_spaceIndex][y_spaceIndex];
        /*console.log('space = '+space);
         console.log('topLeft      = '+topLeft+' | topRight          = '+topRight);
         console.log('botLeft      = '+botLeft+' | botRight      = '+botRight);
         console.log('x_spaceIndex = '+x_spaceIndex+' | y_spaceIndex = '+y_spaceIndex);
         console.log('--------------------------------------------');*/

        //console.log('this.map[x_spaceIndex][y_spaceIndex] = ');
        var center = Math.floor((topLeft + topRight + botLeft + botRight)/4) + this.noise();
        this.map[x_spaceIndexHalf][y_spaceIndexHalf] = this.egalize(center);
        //console.log('center = '+center)


        // diamond
        this.map[x_spaceIndexHalf][y] =  this.egalize(Math.floor((center + topLeft + topRight)/3) + this.noise());
        this.map[x_spaceIndex][y_spaceIndexHalf] = this.egalize(Math.floor((center + topRight + botRight )/3) + this.noise());
        this.map[x_spaceIndexHalf][y_spaceIndex] = this.egalize(Math.floor((center + botRight + botLeft)/3) + this.noise());
        this.map[x][y_spaceIndexHalf] = this.egalize(Math.floor((center + topLeft + botLeft)/3) + this.noise());

        /*console.log('space = '+space);
         console.log('x                = '+x+' | y                 = '+y);
         console.log('x_spaceIndex     = '+x_spaceIndex+' | y_spaceIndex     = '+y_spaceIndex);
         console.log('x_spaceIndexHalf = '+x_spaceIndexHalf+' | y_spaceIndexHalf = '+y_spaceIndexHalf);
         console.log('--------------------------------------------');*/

        if (space > 2) {
            var nextSpace = Math.floor(space/2);
            this.DS(x, y, nextSpace);
            this.DS(x_spaceIndexHalf, y, nextSpace);
            this.DS(x, y_spaceIndexHalf, nextSpace);
            this.DS(x_spaceIndexHalf, y_spaceIndexHalf, nextSpace);
        }
    }

    // Retourne le tableau map formaté en JSON ('z' et 'type')
    DiamondSquare.prototype.formatToJson = function (mapArray) {
        // square length
        var newArray = [];
        for (var x = 0; x < mapArray.length; x++) {
            newArray[x] = [];
            for (var y = 0; y < mapArray[x].length; y++) {
                newArray[x].push({
                    "z": mapArray[x][y],
                    "type": 1
                });
            }
        }
        return newArray;
    }

    /**
     * function: generate
     */
    DiamondSquare.prototype.generate = function(size, min, max, delta) {
        this.init(min, max, size, delta);
//        this.init(-20, 20, size, delta);
        this.initCorners();
        //console.log(this.map)
        this.DS(0,0,(size-1));
        //this.diamondSquare(0,0,8);
        //this.diamondSquare(0,0,8);
        //this.diamondSquare(8,8,8);
        //this.diamondSquare(0,8,8);
        //this.diamondSquare(8,0,8);
        return this.formatToJson(this.map);
    }

}