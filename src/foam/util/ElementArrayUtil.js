var ElementArrayUtil = {
    genTriangleFan : function(start,end){
        var arr = [],
            len = end - start;
        if(len < 3){
            return arr;
        }
        arr.length = (len - 1) * 3 - 3;

        var begin = start,
            end_2 = end - 2,
            index = 0;
        while(start < end_2){
            arr[index    ] = begin;
            arr[index + 1] = start + 1;
            arr[index + 2] = start + 2;
            start++;
            index += 3;
        }

        return arr;
    },

    genTriangle : function(start, end){

    },

    genTriangleStrip : function(start,end){

    },

    genPoints : function(start,end){
        var arr = [],
            len = end - start;
        if(len < 0){
            return arr;
        }
        arr.length = len;

        while(start < end){
            arr[start++] = start;
        }

        return arr;
    }

};

module.exports = ElementArrayUtil;