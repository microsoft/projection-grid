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

function validateClassesForElement(el, classes) {
  let assertion = classes.every((clazz) => {
    return el.hasClass(clazz);
  });
  return assertion;
}

function validateClassesForElementArray(elArray, classes) {
  let assertion = elArray.every((el) => {
    return validateClassesForElement(el, classes);
  });
  return assertion;
}

function getCheckboxElFromTable($el, selector, xindex, yindex) {
  let $checkbox = $el.eq(xindex).find(selector).eq(yindex).find('input');
  return $checkbox;
}

function getCheckboxElFromThead($el, xindex, yindex) {
  return getCheckboxElFromTable($el, 'th', xindex, yindex);
}

function getCheckboxElFromTbody($el, xindex, yindex) {
  return getCheckboxElFromTable($el, 'td', xindex, yindex);
}

export default {
  renderTestContainer,
  cleanup,
  validateElementMatrix,
  getExpectedGridData,
  validateClassesForElement,
  validateClassesForElementArray,
  getCheckboxElFromThead,
  getCheckboxElFromTbody,
};