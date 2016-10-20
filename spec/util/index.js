import _ from 'underScore';
import $ from 'jquery';

let $container;

function renderTestContainer(id) {
  id = id || 'container'; 
  $container = $(id);
  if ($container.length === 0) {
    $container = $('<div id="'.concat(id).concat('"/>')).appendTo('body');
  }
}

function cleanup() {
  $container.empty();
}

function createGrid(pgridFactory, config, extendedConfig) {
  
}

function validateElementArray(elementArray, expectedData) {
  let actualArray = _.map(elementArray, (element) => {
    return element.textContent;
  });

  return _.isEqual(actualArray, expectedData);
}

function validateElementMatrix(elementMatrix, expectedData) {
  if (elementMatrix.length !== expectedData.length) {
    return false;
  }
  let validation = true;
  _.forEach(elementMatrix, (elementRow, index) => {
    let expectedArray = _.values(expectedData[index]);

    expectedArray = _.map(expectedArray, (item) => {
      return String(item);
    });
    if (!validateElementArray(elementRow.children, expectedArray)) {
      validation = false;
    }
  });
  return validation;
}

function getExpectedGridData(data, columnKeys) {
  return _.map(data, (row) => {
    return columnKeys ? _.pick(row, columnKeys) : row;
  });
}

function validateClassesForElements(elArray, classes) {
  let assertion = elArray.every((el) => {
    return classes.every((clazz) => {
      return el.hasClass(clazz);
    })
  });
  return assertion;
}

export default {
  renderTestContainer,
  cleanup,
  validateElementMatrix,
  getExpectedGridData,
  validateClassesForElements,
};