const calculateOffset = (pageNumber, limit) => {
    const offset = (pageNumber - 1) * limit
    return offset

}

const calculateTotalPages = (recordCount, limit) => {
    return Math.ceil(recordCount / limit)
}

const toSqliteDateTime = (dt) =>{
    const sqliteDatetime = dt.toISOString().replace('T', ' ').replace('Z', '');
    return sqliteDatetime
}
export {calculateOffset, calculateTotalPages, toSqliteDateTime}