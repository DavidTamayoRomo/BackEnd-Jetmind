
const config = require('../config');

const {pagination, sort} = config;



const paginar = function paginar2({
  limit = pagination.limit,
  page = pagination.page,
  skip = pagination.skip
}){
  return{limit: parseInt(limit,10),
    page: parseInt(page,10),
    skip: skip ? parseInt(skip, 10):(page -1)*limit}
}


/*
const sortParseParams = (
  {sortBy = sort.sortBy.default, direction = sort.direction.default},
  fields
) => {
  const safelist = {
    sortby: [...Object.getOwnPropertyNames(fields), ...sort.sortBy.fields],
    direction:sort.direction.options,
  };
  return {
    sortBy:safelist.sortBy.includes(sortBy) ? sortBy: sort.sortBy.default,
    direction: safelist.direction.includes(direction) ? direction: sort.direction.default,
  };
};

const sortCompactToStr = (sortBy, direction) => {
  const dir =  direction === sort.direction.default ? '-':'';
  return `${dir}${sortBy}`;
}
*/

module.exports = {
  paginar,
}
