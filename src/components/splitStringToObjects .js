// Utility function to split a string into individual objects using a delimiter
const splitStringToObjects = (str, del) => {
    if (!str) return [];
    return str.split(del).map((value, index) => ({
      id: index,
      value: value.trim()
    }));
}


export default splitStringToObjects
