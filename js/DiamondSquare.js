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
                this.map[i][j] = '*';
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

        var center = Math.floor((topLeft + topRight + botLeft + botRight)/4);
        this.map[x_spaceIndexHalf][y_spaceIndexHalf] = this.egalize(center);


        // diamond
        var centerTop = centerRight = centerBot = centerLeft = 0;
        var divisorTop = divisorRight = divisorBot = divisorLeft = 3;
        //console.log(this.map[x][y]);

        if(x+(space/2) < this.size) {
            centerRight  = this.map[x+(space/2)][y_spaceIndexHalf];
            divisorRight = 4;
        }
        if(y-(space/2) >= 0) {
            centerTop    = this.map[x_spaceIndexHalf][y-(space/2)];
            divisorTop   = 4;
        }
        if(x-(space/2) >= 0) {
            centerLeft   = this.map[x-(space/2)][y_spaceIndexHalf];
            divisorLeft  = 4;
        }
        if(y+(space/2) < this.size) {
            centerBot    = this.map[x_spaceIndexHalf][y+(space/2)];
            divisorBot   = 4;
        }
            // console.log('cT: '+centerTop+' / cR: '+centerRight+' / cB: '+centerBot+' / cL: '+centerLeft+' ');
            // console.log('dT: '+divisorTop+' / dR: '+divisorRight+' / dB: '+divisorBot+' / dL: '+divisorLeft+' ');
            // console.log('--------------------');

        this.map[x_spaceIndexHalf][y]            = this.egalize(Math.floor((center + topLeft + topRight + centerTop)/divisorTop) + this.noise());
        this.map[x_spaceIndex][y_spaceIndexHalf] = this.egalize(Math.floor((center + topRight + botRight + centerRight)/divisorRight) + this.noise());
        this.map[x_spaceIndexHalf][y_spaceIndex] = this.egalize(Math.floor((center + botRight + botLeft + centerBot)/divisorBot) + this.noise());
        this.map[x][y_spaceIndexHalf]            = this.egalize(Math.floor((center + topLeft + botLeft + centerLeft)/divisorLeft) + this.noise());
        // this.map[x_spaceIndexHalf][y] =  this.egalize(Math.floor((center + topLeft + topRight)/3) + this.noise());
        // this.map[x_spaceIndex][y_spaceIndexHalf] = this.egalize(Math.floor((center + topRight + botRight)/3) + this.noise());
        // this.map[x_spaceIndexHalf][y_spaceIndex] = this.egalize(Math.floor((center + botRight + botLeft)/3) + this.noise());
        // this.map[x][y_spaceIndexHalf] = this.egalize(Math.floor((center + topLeft + botLeft)/3) + this.noise());

        if (space > 2) {
            var nextSpace = Math.floor(space/2);
            this.DS(x, y, nextSpace);
            this.DS(x_spaceIndexHalf, y, nextSpace);
            this.DS(x, y_spaceIndexHalf, nextSpace);
            this.DS(x_spaceIndexHalf, y_spaceIndexHalf, nextSpace);
        }
    }

    // Retourne le tableau map formaté en JSON ('z' et 'type')
    DiamondSquare.prototype.formatToJson = function (mapArray, size) {
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

        newArray.length = size;
        for (var i in newArray) {
            newArray[i].length = size;
        }
        return newArray;
    }

    // Arrondit au 2^n+1 supérieur
    DiamondSquare.prototype.roundSize = function (nb) {
        var roundedSizes = [];
        var value = nb;

        for(i = 1; i < nb; i++) {
            if(i >= 2)
                var prevIndex = roundedSizes[i-2];
            roundedSizes[i-1] = Math.pow(2, i);

            if(nb <= roundedSizes[i-1]) {
                if(nb > prevIndex)
                    value = roundedSizes[i-1];
            }
        }

        return value+1;
    }

    /**
     * function: generate
     */
    DiamondSquare.prototype.generate = function(size, amplitude, delta) {
        size_rounded = this.roundSize(size);
        this.init(-amplitude, amplitude, size_rounded, delta);
//        this.init(-20, 20, size, delta);
        this.initCorners();
        //console.log(this.map)
        this.DS(0,0,(size_rounded-1));
        //this.diamondSquare(0,0,8);
        //this.diamondSquare(0,0,8);
        //this.diamondSquare(8,8,8);
        //this.diamondSquare(0,8,8);
        //this.diamondSquare(8,0,8);
        return this.formatToJson(this.map, size);
    }

}