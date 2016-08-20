import emailsTemplate from './emails.jade';

export default [{
  name: 'UserName',
  width: 120,
  sortable: true,
}, {
  name: 'Name',
  property: ({ item }) => `${item.FirstName}, ${item.LastName}`,
  width: 150,
  sortable: true,
}, {
  name: 'Emails',
  template: emailsTemplate,
  width: 220,
  sortable: item => item.Emails.length,
}, {
  name: 'AddressInfo',
  columns: [{
    name: 'Address',
    property: 'AddressInfo/0/Address',
    sortable: true,
  }, {
    name: 'City',
    columns: [{
      name: 'CityName',
      property: 'AddressInfo/0/City/Name',
      sortable: true,
    }, {
      name: 'CityCountry',
      property: 'AddressInfo/0/City/CountryRegion',
      sortable: true,
    }, {
      name: 'CityRegion',
      property: 'AddressInfo/0/City/Region',
      sortable: true,
    }],
  }],
}, {
  name: 'Gender',
  sortable: true,
}, {
  name: 'Concurrency',
  width: 200,
  sortable: true,
}];
