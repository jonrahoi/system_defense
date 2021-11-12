
/*
 * Define different types of connections
 */
var connectionTypes = {
    "CLIENT":["EDGE"],
    "EDGE":["CLIENT", "PRE-PROCESSOR", "PROCESSOR", "ENDPOINT"],
    "PRE-PROCESSOR":["PROCESSOR","EDGE"],
    "PROCESSOR": ["EDGE","PRE-PROCESSOR","ENDPOINT", "PROCESSOR"],
    "ENDPOINT": ["PROCESSOR", "EDGE"]
};

export default connectionTypes;