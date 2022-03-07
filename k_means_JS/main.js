
class k_Means{
    //0.5,1.1,1,1.2,2,1.2,3,1.6,0.5,1.4,3,1.7,3.5,1.8,4,1.3
    constructor(inputData){
        this._input = inputData || [[1,5],[4,3],[7,1],[4,5],[3,1],[7,7],[5,5],[8,1],[3,1],[6,8],[8,9],[1,9]];
        this._dataDisplay = document.getElementById("dataDisplay");
        this._distanceTable = [];
        this._groupTable = [];
        this._centroids = []//default 2 starting centroids if not specified
    }

    get input(){
        return this._input;
    }

    get centroids(){
        return this._centroids;
    }
    set input(dataNodes=[]){
        this._input = dataNodes;
    }

    /**
     * Sets the centroids to iteration 0 centroids, the initial centroid sets
     * @param {[[]]} centroidArr 2D array
     */
    set centroids(centroidArr=[]){
        this._centroids = centroidArr;
    }

    /**
     * Takes a 2D array of grouped distance matrices and finds the average of each one to set a new midpoint
     * @param {Array} centroidArrs 
     */
    //ISSUE DOESNT DO ANYTHING
    set NewCentroids(centroidArrs){

        //Getting average of each centroid based on its array of closest points
        for(let i=0;i<this._centroids.length;i++){
            this._centroids[i] = this.getAverage(centroidArrs[i]);//each return is pair array [p1,p2]
        }

    }

    setDistance(){
        //calculate distance from each node to c1 and c2
        this._distanceTable = [];//clearing
        this._distanceTable = (()=>{
            let dTab = [];
            let count = 0;
            //taking each coord input and calculating distance to each centroid
            this._input.forEach((setVal)=>{
                let temp = [];//container array to store distance for specific coord
                for(let i=0;i<this._centroids.length;i++){
                    //Euclidean distance
                    //valX-c1       valY-c2    
                    let d1 = this.getDist(setVal,this._centroids[i]);
                    temp.push(parseFloat(d1)); //array of the number of centroids in set
                }
                dTab.push(temp); //e.g. if there were 4 centroids, the length of each one of these is an array of 4 coords
                count++;
            })
            return dTab;
        })();
    }

    setGroups(){
        //finding number of centroids
        this._groupTable = [];
        let numGroups = this._centroids.length;
        //looping through distance table
        for(let i=0;i<this._distanceTable.length;i++){
            let smallest=this._distanceTable[i][0]; //setting first distance as largest
            let largInd = 1;
            for(let j=1;j<numGroups;j++){
                if(this._distanceTable[i][j]<smallest){
                    smallest = this._distanceTable[i][j];
                    largInd = j+1;
                }
            }
            this._groupTable.push(largInd);
        }
    }

    /**
     * Calculates the average of the x and y coordinates provided in the array
     * @param {Array} arr 
     * @returns Coordinate
     */
    getAverage(){
        let groupNums = this._centroids.length;
        const map = new Map();
        //group into their group arrays

        //group coords based on group table
        for(let i=0;i<this._input.length; i++){ 
            let group = this._groupTable[i];
            let current = [];
            let mIter = map.entries();
            let valM = mIter.next()
            while(valM.value != null){
                if(valM.value[0]== group){
                    current.push(...valM.value[1]);
                }
                valM = mIter.next();
            }
            map.set(`${group}`, [...current, this._input[i]]);
        }

        //now we find average for each group and set this to the centroids
        map.forEach((val,key)=>{
            //console.log(val);
            //now reduce into average for x and y coord
            let centX=0.0;
            let centY=0.0;
            //sum of x and y coords for each group
            for(let i=0;i<val.length;i++){
                centX+=val[i][0];
                centY+=val[i][1];
            }
            //updating centroids
            this._centroids[key-1] = [centX/val.length,centY/val.length];
        })
    }
    /**
     * 
     * @param {Float32Array} vector1 A coordinate in the form [x,y] 
     * @param {Float32Array} vector2 A coordinate in the form [x,y] 
     * @returns Distance between the 2 vectors
     */
    getDist(vector1, vector2){
        return Math.sqrt(Math.pow((vector1[0]-vector2[0]),2)+Math.pow((vector1[1]-vector2[1]),2)).toFixed(4);
    }
    isFinished(arr){
        for(let i=0;i<this._groupTable.length;i++){
            if(arr[i] != this._groupTable[i]) return false;
        }
        return true;
    }
}

//Check the get and set in js that you learnt on codeacademy

let algo = new k_Means();
function setData(){

    //read input and add to the parargraph
    //once done, they select Run, then it sets them as centroids immediately
    let data = document.getElementById("inputData").innerText;
    //console.log(data)
    let dataVal = data.split('\n');
    //console.log(dataVal);
    algo.Data = [1,1];

    let centroidData = document.getElementById("centInput").innerText;
    let centers = centroidData.split('\n');
    
    centers.pop();//removing last line that isnt an input

    centers.forEach((val, index, arr)=>{

        let temp = [parseInt(val.substring(0,val.indexOf(','))),parseInt(val.substring(val.indexOf(',')+1))]
        arr[index] = temp;
    })
    
    algo.centroids = centers;

}


// Official methods for running with front-end input
function filterArray(inputArr){
    let points = inputArr;
    //will need to trim out mistakedly typing 2 commas
    let expr = new RegExp(/^[\d+.\,]*$/);
     
    if(!expr.test(points)){
        alert("Please ensure correct formatting");
        return;
    }

    //format the input data into an array to add to algo.data
    let arr = points.split(',');
    arr = arr.filter(val=>val.length>0)
    if(arr.length%2!=0){
        alert("Incorrect number of points");
        return;
    }
    let arr2 = [];
    let count = 0;
    for(let i=0;i<arr.length;i+=2){
        let tempCoord = [parseFloat(arr[i]),parseFloat(arr[i+1])]
        arr2[count++] = tempCoord;
    }
    return arr2;
}

function addPoints(){
    let input = document.getElementById("dataIn");
    algo.input = filterArray(input.innerText);
    let output = document.getElementById("dOut");
    output.innerText = algo.input;
}
function addCentroids(){
    let input = document.getElementById("centIn");
    algo.centroids = filterArray(input.innerText);
    let output = document.getElementById("cOut");
    output.innerText = algo.centroids;
}
//Function to run the entire algorithm until its solved
function run(){
    let gi = [];
    let count=0;
   //console.log(algo._centroids);
    do{        
        gi = algo._groupTable;
        //
        //get distance, group, centroids
        algo.setDistance();
        algo.setGroups();
        algo.getAverage();
    }while(!algo.isFinished(gi));
}

function display(){
    let myChart = echarts.init(document.getElementById('graph'));

    let colours =[
        '#D21EE3',
        '#13F09F',
        '#1448FA',
        '#F0EA0A',
        '#12F00D',
        '#a00586',
        '#be7a3c',
        '#f7e6ad',
        '#070242',
        '#093f18'
    ];

    let sData = [];
    algo._groupTable.forEach((val,index)=>{
        let temp = {
            name: 'point',
            value: algo._input[index],
            itemStyle:{
                color: colours[algo._groupTable[index]]
            }
        }
        sData.push(temp);
    });
    //add centroids to display the grouping center points
    algo._centroids.forEach((val,index)=>{
        let temp = {
            name: 'point',
            symbolSize: 5,
            value: algo._centroids[index],
            itemStyle:{
                color: '#000000'
            }
        }
        sData.push(temp);
    })
    let option = {
        xAxis: {},
        yAxis: {},
        series: [{
            symbolSize: 10,
            data:sData,
            type:'scatter'
        }],
      };
      myChart.setOption(option);
}