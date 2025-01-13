import React from 'react'

const RemoveItemInArray = ({arr, item}) =>{

    const index = arr.indexOf(item);
    arr.splice(index, 1);

    return arr;

}

export default RemoveItemInArray