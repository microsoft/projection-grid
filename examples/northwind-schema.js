define([], function() {
  return {
    'title': 'Northwind Schema',
    'type': 'object',
    'properties': {
      'CustomerID': {
        'type': 'String',
        'filterable': true,
        'nullable': false,
        'required': true,
        'aggregateType': 'count',
      },
      'EmployeeID': {
        'type': 'Number',
        'filterable': true,
        'nullable': false,
        'required': true,
        'aggregateType': 'count',
      },
      'ShipName': {
        'type': 'String',
        'filterable': true,
        'nullable': false,
        'required': true,
        'aggregateType': 'count',
      },
    },
    'required': ['CustomerID'],
  };
});
