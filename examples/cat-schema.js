define([], function(){
  return {
    'title': 'Cat Schema',
    'type': 'object',
    'properties': {
      'index': {
        'type': 'integer'
      },
      'name': {
        'type': 'string'
      },
      'age': {
        'description': 'Age in years',
        'type': 'integer',
        'minimum': 0
      }
    },
    'required': ['index', 'name', 'age']
  };
});