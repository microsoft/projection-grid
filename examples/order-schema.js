define({
  name: 'Order',
  title: 'Order Schema',
  type: 'object',
  properties: {
    OrderID: {
      type: 'integer',
    },
    CustomerID: {
      type: 'string',
    },
    EmployeeID: {
      type: 'integer',
    },
    Freight: {
      type: 'number',
    },
    ShipCountry: {
      type: 'string',
      enum: [
        'France',
        'Germany',
        'Brazil',
        'Belgium',
        'Switzerland',
        'Venezuela',
        'Austria',
        'Mexico',
        'USA',
        'Sweden',
        'Finland',
        'Spain',
        'UK',
        'Italy',
        'Ireland',
        'Portugal',
        'Canada',
        'Poland',
        'Norway',
        'Denmark',
      ],
    },
  },
  required: ['OrderID', 'CustomerID', 'EmployeeID'],
});
