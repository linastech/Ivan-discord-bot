const Helper  = require('../utils/helper');

const selectList = new Map();
const selectRangeList = new Map();

module.exports = {
  select(identifier, array){
    let data;

    //check if list exists
    if(selectList.has(identifier)){
      const list = selectList.get(identifier);

      while(true){
        data = array[Helper.random(0, array.length -1)];

        if(list.has(data.id) == false){
          list.add(data.id);
          break;
        }
      }         
    }else{
      data = array[Helper.random(0, array.length - 1)];

      //create new list
      selectList.set(identifier, new Set());
      //add generated number to the list
      selectList.get(identifier).add(data.id);
    }

    return data;
  },
  selectRange(identifier, start, end){
    let number;

    //check if list exists
    if(selectRangeList.has(identifier)){
      const list = selectRangeList.get(identifier);

      //generate numbers until unique one is found
      while(true){
        number = Helper.random(start, end);

        if(list.has(number) == false){
          list.add(number);
          break;
        }
      }    
    }else{
      number = Helper.random(start, end);

      //create new list
      selectRangeList.set(identifier, new Set());
      //add generated number to the list
      selectRangeList.get(identifier).add(number);
    }

    return number;
  }
}