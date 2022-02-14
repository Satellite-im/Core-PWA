import * as mutations from '~/store/ui/mutations'
describe('mutations.default.sendMessage', () => {
  test('0', () => {
    const object: any = [
      [
        'Unable to allocate address',
        'Error:',
        '<error_message>%s</error_message>',
        'Sorry, The video you are looking for does not exist.',
      ],
      [
        '<error_message>%s</error_message>',
        'Empty name specified',
        'Error:',
        'Could not find a submission object for message from xqueue',
      ],
      [
        '',
        'Unable to allocate address',
        'No updates are to be performed.',
        'Sorry, The video you are looking for does not exist.',
      ],
      [
        'Error in retrieving email.',
        'Unknown Error',
        'Error:',
        'Error in retrieving email.',
      ],
    ]
    const object2: any = [
      [
        'Invalid data: No data found in any of the field(s)!!!',
        'The line-by-line profiler can only be used in dev.',
        'Invalid Invitation Token.',
        'Counterparty sent error: %s',
      ],
      [
        '',
        'This is an exception, voilà',
        'Error selecting from database',
        'Unknown error',
      ],
      [
        'No error',
        'does not exist',
        'Ran out of iterations',
        'Connection is closed',
      ],
      [
        'New Error ',
        'does not exist',
        'Error selecting from database',
        'Missing FileUri configuration',
      ],
    ]
    const object3: any = [
      [
        'No os dependencies found. ',
        'Sorry, The video you are looking for does not exist.',
        'Error getting key from: %s',
        'Warning: ',
      ],
      [
        'No updates are to be performed.',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'No updates are to be performed.',
        'Could not find a grader object for message from xqueue',
      ],
      [
        'Unknown error',
        'Counterparty sent error: %s',
        '<error_message>%s</error_message>',
        'Sorry, The video you are looking for does not exist.',
      ],
      [
        'No updates are to be performed.',
        'Sorry, The video you are looking for does not exist.',
        'Mock Error Message',
        '<error_message>%s</error_message>',
      ],
    ]
    const object4: any = [
      [
        'Unknown Error',
        'Grader id does not match submission id that was passed in',
        '\n\nThe first error message:\n',
        'Invalid [%s] value. %s',
      ],
      [
        'No response',
        'Mock Error Message',
        'This is an exception, voilà',
        'Could not find an existing submission in location.  rubric is original.',
      ],
      [
        'Message originator is not the grader, or the person being graded',
        'Mock Error Message',
        'unexpected error',
        'The line-by-line profiler can only be used in dev.',
      ],
      [
        'Could not find a grader object for message from xqueue',
        'Sorry, This video cannot be accessed via this website',
        'does not exist',
        'Invalid Invitation Token.',
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      [
        'Invalid data: No data found in any of the field(s)!!!',
        '<error_message>%s</error_message>',
        'Ran out of iterations',
        'An error occurred processing your request.',
      ],
      [
        'Unable to allocate address',
        'invalid option',
        'An error occurred processing your request.',
        'No error',
      ],
      [
        '\n\nThe first error message:\n',
        'Mock Error Message',
        'Connection is closed',
        'Empty name specified',
      ],
      [
        'This is an exception, voilà',
        'To force deletion of the LAG use delete_force: True',
        'Error:',
        'Counterparty sent error: %s',
      ],
    ]
    const object7: any = [
      [
        'Exception not raised: %s',
        'This is an exception, voilà',
        'Unable to allocate address',
        'does not exist',
      ],
      [
        'Exception not raised: %s',
        'Ran out of iterations',
        'No os dependencies found. ',
        'An error occurred processing your request.',
      ],
      [
        'No updates are to be performed.',
        '',
        'No updates are to be performed.',
        'cannot be found.',
      ],
      [
        'Uploaded file was not added to the resource. ',
        '',
        'An error occurred processing your request.',
        'Invalid Invitation Token.',
      ],
    ]
    const object8: any = [
      [
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'No os dependencies found. ',
        'No response',
        'the specified credentials were rejected by the server',
      ],
      [
        'cannot be found.',
        'Message recipient is the same as originator',
        'To force deletion of the LAG use delete_force: True',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
      ],
      [
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'ValueError exception should be raised',
        'Grader id does not match submission id that was passed in',
      ],
      [
        'Error in retrieving email.',
        'An error occurred processing your request.',
        'Error:',
        "Top level object in 'override.yml' needs to be an object",
      ],
    ]
    const object9: any = [
      [
        'Error:',
        'ValueError exception should be raised',
        'the specified credentials were rejected by the server',
        'Empty name specified',
      ],
      [
        'Invalid Invitation Token.',
        'Sorry, The video you are looking for does not exist.',
        'Error getting key from: %s',
        'Could not find a grader object for message from xqueue',
      ],
      [
        'New Error ',
        'The app does not exist',
        'New Error ',
        'Message recipient is the same as originator',
      ],
      [
        'invalid option',
        'Sorry, The video you are looking for does not exist.',
        'This is an exception, voilà',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      [
        'does not exist',
        'does not exist',
        'Bad Authentication data',
        'Uploaded file was not added to the resource. ',
      ],
      [
        'Unable to allocate address',
        'This is an exception, voilà',
        'Bad Authentication data',
        'TypeError exception should be raised',
      ],
      [
        '',
        'Could not find an existing submission in location.  rubric is original.',
        'Internal Server Error\n',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
      ],
      [
        '',
        'An error occurred processing your request.',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'To force deletion of the LAG use delete_force: True',
      ],
    ]
    const object12: any = [
      [
        'Unable to allocate address',
        'Error:',
        'Empty name specified',
        'Ran out of iterations',
      ],
      [
        'TypeError exception should be raised',
        'Sorry, This video cannot be accessed via this website',
        "Top level object in 'override.yml' needs to be an object",
        'does not exist',
      ],
      [
        'There is a mismatch',
        'Warning: ',
        'Invalid data: No data found in any of the field(s)!!!',
        'the specified credentials were rejected by the server',
      ],
      [
        'Uploaded file was not added to the resource. ',
        'Missing FileUri configuration',
        '\n\nThe first error message:\n',
        'Grader id does not match submission id that was passed in',
      ],
    ]
    const object13: any = [
      [
        'Sorry, This video cannot be accessed via this website',
        'To force deletion of the LAG use delete_force: True',
        'Empty name specified',
        'Grader id does not match submission id that was passed in',
      ],
      [
        'No os dependencies found. ',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        '<error_message>%s</error_message>',
      ],
      [
        'Could not find an existing submission in location.  rubric is original.',
        'Unable to allocate address',
        'Counterparty sent error: %s',
        'the specified credentials were rejected by the server',
      ],
      [
        'Message recipient is not the grader, the person being graded, or the controller',
        'New Error ',
        'Warning: ',
        'Unable to allocate address',
      ],
    ]
    const object14: any = [
      [
        'ValueError exception should be raised',
        '<error_message>%s</error_message>',
        'missing encoding',
        'Could not find a submission object for message from xqueue',
      ],
      [
        'No os dependencies found. ',
        'Internal Server Error\n',
        'Sorry, This video cannot be accessed via this website',
        'Counterparty sent error: %s',
      ],
      ['New Error ', 'Connection is closed', '', 'missing encoding'],
      [
        'invalid option',
        'Missing FileUri configuration',
        'Wait time out reached, while waiting for results',
        'Error in retrieving email.',
      ],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      [
        'does not exist',
        "Top level object in 'override.yml' needs to be an object",
        'There is a mismatch',
        'Wait time out reached, while waiting for results',
      ],
      ['Warning: ', 'This is an exception, voilà', 'Unknown Error', 'Error:'],
      [
        'Unknown error',
        '<error_message>%s</error_message>',
        'This is an exception, voilà',
        'Counterparty sent error: %s',
      ],
      [
        'Wait time out reached, while waiting for results',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Invalid data: No data found in any of the field(s)!!!',
        'TypeError exception should be raised',
      ],
    ]
    const object17: any = [
      [
        'Unknown Error',
        'Mock Error Message',
        'Uploaded file was not added to the resource. ',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
      ],
      [
        'Could not find a grader object for message from xqueue',
        'Bad Authentication data',
        'Error selecting from database',
        'Empty name specified',
      ],
      [
        'There is a mismatch',
        'Unknown error',
        'No os dependencies found. ',
        'An error occurred processing your request.',
      ],
      [
        'The line-by-line profiler can only be used in dev.',
        'Invalid data: No data found in any of the field(s)!!!',
        'Could not find a grader object for message from xqueue',
        'No os dependencies found. ',
      ],
    ]
    const object18: any = [
      ['', 'Error in retrieving email.', 'Unknown error', 'No error'],
      [
        'invalid option',
        'No response',
        'cannot be found.',
        'Could not find a submission object for message from xqueue',
      ],
      [
        'Error selecting from database',
        'The app does not exist',
        '',
        'the specified credentials were rejected by the server',
      ],
      [
        'Error getting key from: %s',
        'An error occurred processing your request.',
        'Invalid data: No data found in any of the field(s)!!!',
        'Missing FileUri configuration',
      ],
    ]
    const object19: any = [
      [
        'Wait time out reached, while waiting for results',
        'There is a mismatch',
        'Exception not raised: %s',
        'Unknown Error',
      ],
      [
        'Warning: ',
        'Invalid Invitation Token.',
        'Message recipient is not the grader, the person being graded, or the controller',
        'the specified credentials were rejected by the server',
      ],
      [
        'Wait time out reached, while waiting for results',
        '',
        'Wait time out reached, while waiting for results',
        'No response',
      ],
      [
        'missing encoding',
        'New Error ',
        'Could not find an existing submission in location.  rubric is original.',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = mutations.default.sendMessage(
      {
        unreadMessage: 429,
        length: 0,
        messages: object21,
        isScrollOver: false,
      },
      {
        value: 'Dillenberg',
        user: { from: '/path/to/file', address: '0.0.0.0' },
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object: any = [
      [
        '\n\nThe first error message:\n',
        'the specified credentials were rejected by the server',
        '',
        'Error:',
      ],
      [
        'Error getting key from: %s',
        'Unknown error',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Sorry, This video cannot be accessed via this website',
      ],
      [
        '\n\nThe first error message:\n',
        'Empty name specified',
        'Sorry, The video you are looking for does not exist.',
        'Message originator is not the grader, or the person being graded',
      ],
      [
        'Invalid [%s] value. %s',
        'Message recipient is not the grader, the person being graded, or the controller',
        'Wait time out reached, while waiting for results',
        'Error:',
      ],
    ]
    const object2: any = [
      [
        'Could not find a submission object for message from xqueue',
        'cannot be found.',
        '',
        '\n\nThe first error message:\n',
      ],
      [
        'No updates are to be performed.',
        'New Error ',
        'An error occurred processing your request.',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
      [
        'The app does not exist',
        'Error selecting from database',
        'cannot be found.',
        'An error occurred processing your request.',
      ],
      [
        'the specified credentials were rejected by the server',
        'Missing FileUri configuration',
        'Internal Server Error\n',
        'Sorry, The video you are looking for does not exist.',
      ],
    ]
    const object3: any = [
      [
        'the specified credentials were rejected by the server',
        'Message originator is not the grader, or the person being graded',
        'Error getting key from: %s',
        'Mock Error Message',
      ],
      [
        'Empty name specified',
        'missing encoding',
        'Unknown Error',
        'Exception not raised: %s',
      ],
      [
        "Top level object in 'override.yml' needs to be an object",
        'Could not find a submission object for message from xqueue',
        'No os dependencies found. ',
        'Empty name specified',
      ],
      [
        'No error',
        'Wait time out reached, while waiting for results',
        'Exception not raised: %s',
        'There is a mismatch',
      ],
    ]
    const object4: any = [
      [
        'Missing FileUri configuration',
        'Wait time out reached, while waiting for results',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'New Error ',
      ],
      [
        'Message recipient is not the grader, the person being graded, or the controller',
        'Counterparty sent error: %s',
        'Error in retrieving email.',
        'Sorry, This video cannot be accessed via this website',
      ],
      [
        'Empty name specified',
        'Connection is closed',
        'Warning: ',
        'Uploaded file was not added to the resource. ',
      ],
      [
        'does not exist',
        'This is an exception, voilà',
        'Grader id does not match submission id that was passed in',
        'Message recipient is the same as originator',
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      [
        'Error getting key from: %s',
        'Wait time out reached, while waiting for results',
        'Mock Error Message',
        'Could not find an existing submission in location.  rubric is original.',
      ],
      [
        'Message originator is not the grader, or the person being graded',
        'Empty name specified',
        'New Error ',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
      ],
      [
        'There is a mismatch',
        'Internal Server Error\n',
        'cannot be found.',
        'Message recipient is the same as originator',
      ],
      [
        'Error getting key from: %s',
        'No os dependencies found. ',
        "Top level object in 'override.yml' needs to be an object",
        'Error:',
      ],
    ]
    const object7: any = [
      [
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Warning: ',
        'TypeError exception should be raised',
        'There is a mismatch',
      ],
      [
        'Message recipient is not the grader, the person being graded, or the controller',
        'Error:',
        '',
        'There is a mismatch',
      ],
      [
        'No os dependencies found. ',
        'The app does not exist',
        'does not exist',
        'Empty name specified',
      ],
      [
        'Could not find an existing submission in location.  rubric is original.',
        'Grader id does not match submission id that was passed in',
        'Unknown error',
        'Could not find a submission object for message from xqueue',
      ],
    ]
    const object8: any = [
      [
        'This is an exception, voilà',
        'Invalid Invitation Token.',
        'To force deletion of the LAG use delete_force: True',
        'Mock Error Message',
      ],
      [
        'missing encoding',
        'Invalid [%s] value. %s',
        'The app does not exist',
        'Unknown error',
      ],
      [
        'Error getting key from: %s',
        '<error_message>%s</error_message>',
        'Uploaded file was not added to the resource. ',
        'Could not find a grader object for message from xqueue',
      ],
      [
        'Missing FileUri configuration',
        'Invalid Invitation Token.',
        'unexpected error',
        'This is an exception, voilà',
      ],
    ]
    const object9: any = [
      [
        'does not exist',
        '\n\nThe first error message:\n',
        'Sorry, This video cannot be accessed via this website',
        'Counterparty sent error: %s',
      ],
      [
        'Sorry, This video cannot be accessed via this website',
        'Could not find a submission object for message from xqueue',
        'Error selecting from database',
        'Mock Error Message',
      ],
      [
        'Counterparty sent error: %s',
        'Sorry, This video cannot be accessed via this website',
        'cannot be found.',
        'Message recipient is the same as originator',
      ],
      [
        'missing encoding',
        'No error',
        '\n\nThe first error message:\n',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
      ],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      [
        'Bad Authentication data',
        'Unknown error',
        'Ran out of iterations',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
      ],
      [
        '',
        'Invalid data: No data found in any of the field(s)!!!',
        'Unknown error',
        'ValueError exception should be raised',
      ],
      [
        'Ran out of iterations',
        "Top level object in 'override.yml' needs to be an object",
        '\n\nThe first error message:\n',
        'Empty name specified',
      ],
      [
        'Missing FileUri configuration',
        'Empty name specified',
        'Uploaded file was not added to the resource. ',
        '<error_message>%s</error_message>',
      ],
    ]
    const object12: any = [
      [
        'invalid option',
        'Could not find a submission object for message from xqueue',
        'does not exist',
        'the specified credentials were rejected by the server',
      ],
      [
        'Message recipient is not the grader, the person being graded, or the controller',
        'Invalid Invitation Token.',
        'unexpected error',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
      [
        'Sorry, This video cannot be accessed via this website',
        'TypeError exception should be raised',
        'Ran out of iterations',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
      ],
      [
        'Counterparty sent error: %s',
        'Ran out of iterations',
        'Internal Server Error\n',
        'missing encoding',
      ],
    ]
    const object13: any = [
      [
        'Invalid data: No data found in any of the field(s)!!!',
        'Grader id does not match submission id that was passed in',
        'Internal Server Error\n',
        'Wait time out reached, while waiting for results',
      ],
      [
        'Message originator is not the grader, or the person being graded',
        'Message recipient is not the grader, the person being graded, or the controller',
        'Wait time out reached, while waiting for results',
        '',
      ],
      [
        'No updates are to be performed.',
        'unexpected error',
        'Invalid data: No data found in any of the field(s)!!!',
        'Error:',
      ],
      [
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'There is a mismatch',
        "Top level object in 'override.yml' needs to be an object",
        'the specified credentials were rejected by the server',
      ],
    ]
    const object14: any = [
      [
        'New Error ',
        'Sorry, The video you are looking for does not exist.',
        'missing encoding',
        'Missing FileUri configuration',
      ],
      [
        'Exception not raised: %s',
        'ValueError exception should be raised',
        'New Error ',
        'Internal Server Error\n',
      ],
      [
        '\n\nThe first error message:\n',
        'Empty name specified',
        'cannot be found.',
        'This is an exception, voilà',
      ],
      [
        'No os dependencies found. ',
        'Sorry, The video you are looking for does not exist.',
        'TypeError exception should be raised',
        'No os dependencies found. ',
      ],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      [
        'Missing FileUri configuration',
        'Missing FileUri configuration',
        'Invalid Invitation Token.',
        '',
      ],
      [
        'Unable to allocate address',
        'The app does not exist',
        'No error',
        'No updates are to be performed.',
      ],
      [
        'Uploaded file was not added to the resource. ',
        'Mock Error Message',
        'Error:',
        'does not exist',
      ],
      [
        'the specified credentials were rejected by the server',
        'Error selecting from database',
        'does not exist',
        'Missing FileUri configuration',
      ],
    ]
    const object17: any = [
      [
        'Ran out of iterations',
        'TypeError exception should be raised',
        'Error:',
        'Could not find a submission object for message from xqueue',
      ],
      [
        'Counterparty sent error: %s',
        'Missing FileUri configuration',
        'Could not find an existing submission in location.  rubric is original.',
        'Invalid [%s] value. %s',
      ],
      [
        'No updates are to be performed.',
        'cannot be found.',
        'the specified credentials were rejected by the server',
        'New Error ',
      ],
      [
        'Error:',
        'Counterparty sent error: %s',
        'Error in retrieving email.',
        'Error:',
      ],
    ]
    const object18: any = [
      [
        'Invalid Invitation Token.',
        'Exception not raised: %s',
        'Could not find a grader object for message from xqueue',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
      ],
      [
        'No response',
        'Message recipient is the same as originator',
        'Message recipient is the same as originator',
        'Connection is closed',
      ],
      [
        'The line-by-line profiler can only be used in dev.',
        'Error:',
        'ValueError exception should be raised',
        'Message recipient is the same as originator',
      ],
      [
        'Internal Server Error\n',
        'Could not find a submission object for message from xqueue',
        'the specified credentials were rejected by the server',
        'This is an exception, voilà',
      ],
    ]
    const object19: any = [
      [
        'Invalid Invitation Token.',
        'TypeError exception should be raised',
        'Could not find a submission object for message from xqueue',
        'Could not find a grader object for message from xqueue',
      ],
      [
        'Sorry, The video you are looking for does not exist.',
        'does not exist',
        'No response',
        'No response',
      ],
      [
        'Exception not raised: %s',
        'invalid option',
        'Could not find a grader object for message from xqueue',
        'TypeError exception should be raised',
      ],
      [
        'Invalid [%s] value. %s',
        'Connection is closed',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Empty name specified',
      ],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = mutations.default.sendMessage(
      {
        unreadMessage: 404,
        length: 64,
        messages: object21,
        isScrollOver: false,
      },
      { value: 'Dillenberg', user: { from: '.', address: '0.0.0.0' } },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object: any = [
      [
        'New Error ',
        'Error:',
        'Error:',
        'Uploaded file was not added to the resource. ',
      ],
      [
        'Error getting key from: %s',
        'Uploaded file was not added to the resource. ',
        'Error selecting from database',
        'cannot be found.',
      ],
      [
        'Could not find a grader object for message from xqueue',
        'Error selecting from database',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Sorry, The video you are looking for does not exist.',
      ],
      [
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        '',
        'Error getting key from: %s',
        '',
      ],
    ]
    const object2: any = [
      [
        'Error in retrieving email.',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'the specified credentials were rejected by the server',
        'Unable to allocate address',
      ],
      [
        '\n\nThe first error message:\n',
        'No updates are to be performed.',
        'missing encoding',
        'the specified credentials were rejected by the server',
      ],
      [
        'Grader id does not match submission id that was passed in',
        'cannot be found.',
        'Invalid Invitation Token.',
        'Counterparty sent error: %s',
      ],
      [
        'Could not find an existing submission in location.  rubric is original.',
        'Uploaded file was not added to the resource. ',
        'Sorry, The video you are looking for does not exist.',
        'Warning: ',
      ],
    ]
    const object3: any = [
      [
        'Unable to allocate address',
        'Message recipient is not the grader, the person being graded, or the controller',
        'Error:',
        'Connection is closed',
      ],
      [
        'Missing FileUri configuration',
        'Connection is closed',
        'Message originator is not the grader, or the person being graded',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
      [
        'Internal Server Error\n',
        'cannot be found.',
        'the specified credentials were rejected by the server',
        'Warning: ',
      ],
      [
        'Warning: ',
        'No updates are to be performed.',
        'Counterparty sent error: %s',
        'Internal Server Error\n',
      ],
    ]
    const object4: any = [
      [
        'Warning: ',
        'Could not find an existing submission in location.  rubric is original.',
        'No response',
        'missing encoding',
      ],
      [
        'The app does not exist',
        "Top level object in 'override.yml' needs to be an object",
        'Sorry, This video cannot be accessed via this website',
        'Message recipient is not the grader, the person being graded, or the controller',
      ],
      [
        'Invalid Invitation Token.',
        'To force deletion of the LAG use delete_force: True',
        'An error occurred processing your request.',
        'Uploaded file was not added to the resource. ',
      ],
      [
        'Message originator is not the grader, or the person being graded',
        'There is a mismatch',
        'Counterparty sent error: %s',
        '\n\nThe first error message:\n',
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      [
        'The line-by-line profiler can only be used in dev.',
        'Bad Authentication data',
        'Could not find an existing submission in location.  rubric is original.',
        'The line-by-line profiler can only be used in dev.',
      ],
      [
        'Mock Error Message',
        'Message recipient is not the grader, the person being graded, or the controller',
        'Error:',
        '\n\nThe first error message:\n',
      ],
      [
        'Could not find a submission object for message from xqueue',
        '\n\nThe first error message:\n',
        'Sorry, This video cannot be accessed via this website',
        'Grader id does not match submission id that was passed in',
      ],
      [
        'Invalid [%s] value. %s',
        'New Error ',
        'Ran out of iterations',
        'Unknown Error',
      ],
    ]
    const object7: any = [
      [
        '<error_message>%s</error_message>',
        'Error in retrieving email.',
        'Ran out of iterations',
        'Missing FileUri configuration',
      ],
      [
        'No os dependencies found. ',
        'No error',
        'Empty name specified',
        'No updates are to be performed.',
      ],
      [
        'Sorry, The video you are looking for does not exist.',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'invalid option',
        'Could not find a submission object for message from xqueue',
      ],
      [
        'Grader id does not match submission id that was passed in',
        'Error getting key from: %s',
        'The line-by-line profiler can only be used in dev.',
        'TypeError exception should be raised',
      ],
    ]
    const object8: any = [
      [
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Missing FileUri configuration',
        'New Error ',
        'Unknown error',
      ],
      [
        'Error selecting from database',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Empty name specified',
        'Message recipient is the same as originator',
      ],
      [
        'Missing FileUri configuration',
        'Counterparty sent error: %s',
        'Message recipient is the same as originator',
        'Internal Server Error\n',
      ],
      [
        'cannot be found.',
        'An error occurred processing your request.',
        'No os dependencies found. ',
        'No os dependencies found. ',
      ],
    ]
    const object9: any = [
      [
        'No updates are to be performed.',
        'Could not find a grader object for message from xqueue',
        'No error',
        'Empty name specified',
      ],
      [
        'Could not find an existing submission in location.  rubric is original.',
        'Invalid data: No data found in any of the field(s)!!!',
        'Connection is closed',
        'Invalid [%s] value. %s',
      ],
      [
        'Uploaded file was not added to the resource. ',
        'An error occurred processing your request.',
        'Grader id does not match submission id that was passed in',
        'Bad Authentication data',
      ],
      [
        'Grader id does not match submission id that was passed in',
        'Empty name specified',
        'Could not find a submission object for message from xqueue',
        'Could not find a grader object for message from xqueue',
      ],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      [
        '<error_message>%s</error_message>',
        'Error selecting from database',
        "Top level object in 'override.yml' needs to be an object",
        'invalid option',
      ],
      [
        'Invalid data: No data found in any of the field(s)!!!',
        'Error in retrieving email.',
        'TypeError exception should be raised',
        'No os dependencies found. ',
      ],
      [
        'Warning: ',
        'Missing FileUri configuration',
        'Error getting key from: %s',
        '',
      ],
      [
        'Message originator is not the grader, or the person being graded',
        'The line-by-line profiler can only be used in dev.',
        'Message recipient is the same as originator',
        'Sorry, This video cannot be accessed via this website',
      ],
    ]
    const object12: any = [
      [
        'Unknown error',
        'Bad Authentication data',
        'No response',
        'Empty name specified',
      ],
      [
        'Internal Server Error\n',
        '',
        'Error:',
        'TypeError exception should be raised',
      ],
      [
        'Error getting key from: %s',
        'Error in retrieving email.',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'The app does not exist',
      ],
      [
        'missing encoding',
        'Wait time out reached, while waiting for results',
        "Top level object in 'override.yml' needs to be an object",
        'Message recipient is the same as originator',
      ],
    ]
    const object13: any = [
      [
        'invalid option',
        'Exception not raised: %s',
        'No error',
        'Internal Server Error\n',
      ],
      [
        'Error getting key from: %s',
        'Internal Server Error\n',
        'does not exist',
        'Missing FileUri configuration',
      ],
      [
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Internal Server Error\n',
        'Could not find a grader object for message from xqueue',
        'Invalid Invitation Token.',
      ],
      [
        'Connection is closed',
        '',
        'Bad Authentication data',
        'Exception not raised: %s',
      ],
    ]
    const object14: any = [
      [
        'does not exist',
        'Message recipient is the same as originator',
        'Sorry, The video you are looking for does not exist.',
        'Warning: ',
      ],
      [
        'Counterparty sent error: %s',
        'unexpected error',
        '',
        'Error in retrieving email.',
      ],
      [
        'Ran out of iterations',
        '\n\nThe first error message:\n',
        'Sorry, This video cannot be accessed via this website',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
      [
        'Error getting key from: %s',
        'Counterparty sent error: %s',
        'Error in retrieving email.',
        'Message originator is not the grader, or the person being graded',
      ],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      [
        'Message recipient is the same as originator',
        'Bad Authentication data',
        'TypeError exception should be raised',
        'The line-by-line profiler can only be used in dev.',
      ],
      [
        'Invalid data: No data found in any of the field(s)!!!',
        '',
        'Error in retrieving email.',
        'No os dependencies found. ',
      ],
      [
        'No error',
        'Grader id does not match submission id that was passed in',
        'Unknown Error',
        '\n\nThe first error message:\n',
      ],
      [
        'No error',
        'The line-by-line profiler can only be used in dev.',
        'Unknown Error',
        'No response',
      ],
    ]
    const object17: any = [
      [
        'No response',
        'New Error ',
        'Bad Authentication data',
        'No os dependencies found. ',
      ],
      [
        'Error:',
        'Wait time out reached, while waiting for results',
        'Invalid data: No data found in any of the field(s)!!!',
        'Wait time out reached, while waiting for results',
      ],
      [
        "Top level object in 'override.yml' needs to be an object",
        'Error getting key from: %s',
        'the specified credentials were rejected by the server',
        'Counterparty sent error: %s',
      ],
      [
        'Empty name specified',
        'Connection is closed',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'missing encoding',
      ],
    ]
    const object18: any = [
      [
        'ValueError exception should be raised',
        'Ran out of iterations',
        'No updates are to be performed.',
        "Top level object in 'override.yml' needs to be an object",
      ],
      [
        'Could not find a submission object for message from xqueue',
        'Mock Error Message',
        'Unable to allocate address',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
      ],
      [
        'This is an exception, voilà',
        'Uploaded file was not added to the resource. ',
        'No updates are to be performed.',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
      ],
      [
        'Connection is closed',
        'Invalid [%s] value. %s',
        'Sorry, This video cannot be accessed via this website',
        'Sorry, This video cannot be accessed via this website',
      ],
    ]
    const object19: any = [
      [
        'New Error ',
        'unexpected error',
        'No response',
        'No updates are to be performed.',
      ],
      [
        'Unable to allocate address',
        'Warning: ',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        '<error_message>%s</error_message>',
      ],
      ['No error', 'The app does not exist', 'Mock Error Message', 'No error'],
      [
        'Error:',
        'the specified credentials were rejected by the server',
        'Invalid [%s] value. %s',
        'Grader id does not match submission id that was passed in',
      ],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = mutations.default.sendMessage(
      {
        unreadMessage: 200,
        length: 16,
        messages: object21,
        isScrollOver: true,
      },
      { value: 'Elio', user: { from: '.', address: '192.168.1.5' } },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object: any = [
      [
        'unexpected error',
        'Error getting key from: %s',
        'cannot be found.',
        'the specified credentials were rejected by the server',
      ],
      [
        'Empty name specified',
        'New Error ',
        'missing encoding',
        'Internal Server Error\n',
      ],
      [
        'the specified credentials were rejected by the server',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Grader id does not match submission id that was passed in',
        'the specified credentials were rejected by the server',
      ],
      [
        'Grader id does not match submission id that was passed in',
        'Mock Error Message',
        '\n\nThe first error message:\n',
        'Error:',
      ],
    ]
    const object2: any = [
      [
        'This is an exception, voilà',
        "Top level object in 'override.yml' needs to be an object",
        'No error',
        'Unknown Error',
      ],
      [
        'Counterparty sent error: %s',
        'Empty name specified',
        'ValueError exception should be raised',
        'missing encoding',
      ],
      [
        'Error selecting from database',
        'ValueError exception should be raised',
        'Message recipient is the same as originator',
        'Unknown error',
      ],
      [
        'Warning: ',
        'Error selecting from database',
        'Invalid data: No data found in any of the field(s)!!!',
        'No os dependencies found. ',
      ],
    ]
    const object3: any = [
      [
        'invalid option',
        'Unable to allocate address',
        'Unable to allocate address',
        'Empty name specified',
      ],
      [
        'The app does not exist',
        'Unknown error',
        '',
        'Uploaded file was not added to the resource. ',
      ],
      [
        'Empty name specified',
        'Empty name specified',
        'No response',
        'Internal Server Error\n',
      ],
      [
        'Counterparty sent error: %s',
        'Unable to allocate address',
        'An error occurred processing your request.',
        'There is a mismatch',
      ],
    ]
    const object4: any = [
      [
        '',
        'This is an exception, voilà',
        'Message originator is not the grader, or the person being graded',
        'Could not find an existing submission in location.  rubric is original.',
      ],
      [
        'Bad Authentication data',
        'cannot be found.',
        'Warning: ',
        'This is an exception, voilà',
      ],
      [
        'Sorry, This video cannot be accessed via this website',
        'Message recipient is the same as originator',
        'missing encoding',
        'No error',
      ],
      [
        '',
        'Missing FileUri configuration',
        'Missing FileUri configuration',
        "Top level object in 'override.yml' needs to be an object",
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      [
        'Missing FileUri configuration',
        'Unknown error',
        'There is a mismatch',
        'The line-by-line profiler can only be used in dev.',
      ],
      [
        'Message originator is not the grader, or the person being graded',
        'Bad Authentication data',
        '<error_message>%s</error_message>',
        'There is a mismatch',
      ],
      [
        'Error in retrieving email.',
        'ValueError exception should be raised',
        'cannot be found.',
        'Error:',
      ],
      [
        'No error',
        'missing encoding',
        'Missing FileUri configuration',
        'Invalid Invitation Token.',
      ],
    ]
    const object7: any = [
      [
        'Could not find a grader object for message from xqueue',
        'Sorry, This video cannot be accessed via this website',
        'No updates are to be performed.',
        'TypeError exception should be raised',
      ],
      [
        'Counterparty sent error: %s',
        'New Error ',
        'Error getting key from: %s',
        'Sorry, This video cannot be accessed via this website',
      ],
      [
        'Sorry, This video cannot be accessed via this website',
        'Could not find a submission object for message from xqueue',
        'missing encoding',
        'There is a mismatch',
      ],
      [
        '<error_message>%s</error_message>',
        'Could not find an existing submission in location.  rubric is original.',
        'the specified credentials were rejected by the server',
        'unexpected error',
      ],
    ]
    const object8: any = [
      [
        'unexpected error',
        'Message recipient is the same as originator',
        'Message originator is not the grader, or the person being graded',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
      ],
      [
        'ValueError exception should be raised',
        'Counterparty sent error: %s',
        "Top level object in 'override.yml' needs to be an object",
        'To force deletion of the LAG use delete_force: True',
      ],
      [
        'The line-by-line profiler can only be used in dev.',
        'Could not find a grader object for message from xqueue',
        'Error in retrieving email.',
        'Unknown Error',
      ],
      [
        'Ran out of iterations',
        'Connection is closed',
        'Unknown error',
        'does not exist',
      ],
    ]
    const object9: any = [
      [
        'Grader id does not match submission id that was passed in',
        'Sorry, This video cannot be accessed via this website',
        'Warning: ',
        'Grader id does not match submission id that was passed in',
      ],
      [
        'Exception not raised: %s',
        'Ran out of iterations',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Mock Error Message',
      ],
      [
        'Bad Authentication data',
        'Uploaded file was not added to the resource. ',
        'Bad Authentication data',
        'Sorry, The video you are looking for does not exist.',
      ],
      [
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        '\n\nThe first error message:\n',
        'Empty name specified',
        'Sorry, This video cannot be accessed via this website',
      ],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      [
        'Error getting key from: %s',
        'does not exist',
        '\n\nThe first error message:\n',
        'Counterparty sent error: %s',
      ],
      [
        'does not exist',
        'Unknown Error',
        'cannot be found.',
        '\n\nThe first error message:\n',
      ],
      [
        'Error:',
        'the specified credentials were rejected by the server',
        'Unknown error',
        '<error_message>%s</error_message>',
      ],
      [
        'Empty name specified',
        'There is a mismatch',
        'Error selecting from database',
        'Could not find a grader object for message from xqueue',
      ],
    ]
    const object12: any = [
      [
        'No updates are to be performed.',
        'Error selecting from database',
        'Exception not raised: %s',
        'Invalid [%s] value. %s',
      ],
      [
        'No response',
        'Internal Server Error\n',
        'Error in retrieving email.',
        'invalid option',
      ],
      [
        '',
        'cannot be found.',
        'New Error ',
        'Sorry, The video you are looking for does not exist.',
      ],
      [
        'Could not find an existing submission in location.  rubric is original.',
        'To force deletion of the LAG use delete_force: True',
        'No error',
        'Invalid Invitation Token.',
      ],
    ]
    const object13: any = [
      [
        'The line-by-line profiler can only be used in dev.',
        'Grader id does not match submission id that was passed in',
        'Connection is closed',
        'This is an exception, voilà',
      ],
      [
        'This is an exception, voilà',
        'Error in retrieving email.',
        'Message recipient is the same as originator',
        'The app does not exist',
      ],
      [
        'Connection is closed',
        'Error in retrieving email.',
        'missing encoding',
        'Uploaded file was not added to the resource. ',
      ],
      [
        'No error',
        'invalid option',
        'Wait time out reached, while waiting for results',
        'Invalid [%s] value. %s',
      ],
    ]
    const object14: any = [
      [
        '',
        'Could not find a grader object for message from xqueue',
        'An error occurred processing your request.',
        'The line-by-line profiler can only be used in dev.',
      ],
      [
        'missing encoding',
        'Ran out of iterations',
        'Internal Server Error\n',
        'missing encoding',
      ],
      [
        'Connection is closed',
        'An error occurred processing your request.',
        'Could not find a submission object for message from xqueue',
        'Invalid Invitation Token.',
      ],
      [
        'Could not find a grader object for message from xqueue',
        'Error getting key from: %s',
        'Uploaded file was not added to the resource. ',
        'Internal Server Error\n',
      ],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      [
        'Unable to allocate address',
        'Missing FileUri configuration',
        'Error selecting from database',
        'No updates are to be performed.',
      ],
      [
        '',
        'Empty name specified',
        'No updates are to be performed.',
        'Error getting key from: %s',
      ],
      [
        'Invalid data: No data found in any of the field(s)!!!',
        'Unknown error',
        'unexpected error',
        'There is a mismatch',
      ],
      [
        '\n\nThe first error message:\n',
        'Unable to allocate address',
        '<error_message>%s</error_message>',
        'Message recipient is the same as originator',
      ],
    ]
    const object17: any = [
      [
        'invalid option',
        'The app does not exist',
        'Mock Error Message',
        'cannot be found.',
      ],
      [
        'Missing FileUri configuration',
        'Grader id does not match submission id that was passed in',
        'Error selecting from database',
        'does not exist',
      ],
      [
        'Unknown error',
        '\n\nThe first error message:\n',
        'Empty name specified',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
      ],
      [
        'Message recipient is not the grader, the person being graded, or the controller',
        'Error in retrieving email.',
        'Could not find a grader object for message from xqueue',
        'Connection is closed',
      ],
    ]
    const object18: any = [
      [
        'Could not find a grader object for message from xqueue',
        'No response',
        'Sorry, The video you are looking for does not exist.',
        'No error',
      ],
      [
        'This is an exception, voilà',
        'Empty name specified',
        'Internal Server Error\n',
        'No os dependencies found. ',
      ],
      [
        'Unable to allocate address',
        'unexpected error',
        '<error_message>%s</error_message>',
        'To force deletion of the LAG use delete_force: True',
      ],
      [
        'No updates are to be performed.',
        'No error',
        'TypeError exception should be raised',
        'cannot be found.',
      ],
    ]
    const object19: any = [
      [
        'Unable to allocate address',
        'TypeError exception should be raised',
        '\n\nThe first error message:\n',
        '\n\nThe first error message:\n',
      ],
      [
        'There is a mismatch',
        'To force deletion of the LAG use delete_force: True',
        'No error',
        'Message originator is not the grader, or the person being graded',
      ],
      [
        'Error in retrieving email.',
        'Error:',
        'Message originator is not the grader, or the person being graded',
        'Mock Error Message',
      ],
      [
        'Error getting key from: %s',
        'Unknown error',
        '',
        'Could not find a grader object for message from xqueue',
      ],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = mutations.default.sendMessage(
      {
        unreadMessage: 200,
        length: 10,
        messages: object21,
        isScrollOver: true,
      },
      { value: 'Elio', user: { from: './path/to/file', address: '0.0.0.0' } },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object: any = [
      [
        'Counterparty sent error: %s',
        'Grader id does not match submission id that was passed in',
        'Message recipient is not the grader, the person being graded, or the controller',
        'Sorry, This video cannot be accessed via this website',
      ],
      [
        'Bad Authentication data',
        'TypeError exception should be raised',
        '<error_message>%s</error_message>',
        'ValueError exception should be raised',
      ],
      [
        'Message recipient is not the grader, the person being graded, or the controller',
        'Counterparty sent error: %s',
        'Unknown Error',
        'Error getting key from: %s',
      ],
      [
        'An error occurred processing your request.',
        'There is a mismatch',
        'Sorry, This video cannot be accessed via this website',
        'Empty name specified',
      ],
    ]
    const object2: any = [
      [
        'Connection is closed',
        'Connection is closed',
        '',
        'The line-by-line profiler can only be used in dev.',
      ],
      [
        'missing encoding',
        'There is a mismatch',
        'Error:',
        'Message recipient is the same as originator',
      ],
      [
        'This is an exception, voilà',
        '',
        'The app does not exist',
        'invalid option',
      ],
      ['Unknown Error', 'There is a mismatch', 'Internal Server Error\n', ''],
    ]
    const object3: any = [
      [
        'No updates are to be performed.',
        'Error in retrieving email.',
        'Error selecting from database',
        'Uploaded file was not added to the resource. ',
      ],
      [
        'Internal Server Error\n',
        'No os dependencies found. ',
        'Error:',
        'Sorry, This video cannot be accessed via this website',
      ],
      [
        'Message recipient is the same as originator',
        'Error:',
        'cannot be found.',
        'Internal Server Error\n',
      ],
      [
        'Sorry, This video cannot be accessed via this website',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'No updates are to be performed.',
        'Internal Server Error\n',
      ],
    ]
    const object4: any = [
      [
        'Error getting key from: %s',
        'invalid option',
        'Empty name specified',
        'ValueError exception should be raised',
      ],
      [
        '',
        '<error_message>%s</error_message>',
        'cannot be found.',
        'Could not find an existing submission in location.  rubric is original.',
      ],
      [
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Unknown error',
        'unexpected error',
        'The line-by-line profiler can only be used in dev.',
      ],
      [
        'Warning: ',
        'This is an exception, voilà',
        'Error getting key from: %s',
        'Message recipient is the same as originator',
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const object6: any = [
      [
        'Could not find an existing submission in location.  rubric is original.',
        'No updates are to be performed.',
        'Invalid data: No data found in any of the field(s)!!!',
        'Error in retrieving email.',
      ],
      [
        'Grader id does not match submission id that was passed in',
        'Invalid Invitation Token.',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'No error',
      ],
      [
        'Error:',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Invalid data: No data found in any of the field(s)!!!',
        'Error selecting from database',
      ],
      [
        'No os dependencies found. ',
        'ValueError exception should be raised',
        'Message originator is not the grader, or the person being graded',
        'Message recipient is not the grader, the person being graded, or the controller',
      ],
    ]
    const object7: any = [
      [
        'Unknown error',
        'Unknown error',
        'the specified credentials were rejected by the server',
        'No error',
      ],
      [
        'To force deletion of the LAG use delete_force: True',
        'cannot be found.',
        'An error occurred processing your request.',
        'Error:',
      ],
      ['cannot be found.', '', '\n\nThe first error message:\n', 'No response'],
      [
        'Exception not raised: %s',
        'Invalid [%s] value. %s',
        'Error:',
        'Message recipient is the same as originator',
      ],
    ]
    const object8: any = [
      ['There is a mismatch', 'Mock Error Message', 'Error:', 'No error'],
      [
        'unexpected error',
        'Invalid [%s] value. %s',
        'invalid option',
        'Missing FileUri configuration',
      ],
      [
        'New Error ',
        'No response',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Wait time out reached, while waiting for results',
      ],
      [
        'Bad Authentication data',
        '\n\nThe first error message:\n',
        'unexpected error',
        'Missing FileUri configuration',
      ],
    ]
    const object9: any = [
      [
        'Connection is closed',
        'Unknown Error',
        'There is a mismatch',
        '\n\nThe first error message:\n',
      ],
      [
        'Could not find an existing submission in location.  rubric is original.',
        'Connection is closed',
        'To force deletion of the LAG use delete_force: True',
        'Connection is closed',
      ],
      [
        'unexpected error',
        'No os dependencies found. ',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'To force deletion of the LAG use delete_force: True',
      ],
      [
        'unexpected error',
        'Invalid Invitation Token.',
        'Could not find a submission object for message from xqueue',
        'missing encoding',
      ],
    ]
    const object10: any = [object6, object7, object8, object9]
    const object11: any = [
      [
        'Could not find an existing submission in location.  rubric is original.',
        'Error:',
        'Message originator is not the grader, or the person being graded',
        'Warning: ',
      ],
      [
        '\n\nThe first error message:\n',
        'Ran out of iterations',
        'Uploaded file was not added to the resource. ',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
      [
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Wait time out reached, while waiting for results',
        'Could not find an existing submission in location.  rubric is original.',
        'Invalid Invitation Token.',
      ],
      [
        'Message recipient is the same as originator',
        'Message recipient is not the grader, the person being graded, or the controller',
        'Could not find a submission object for message from xqueue',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
      ],
    ]
    const object12: any = [
      [
        'the specified credentials were rejected by the server',
        'No error',
        'There is a mismatch',
        "Top level object in 'override.yml' needs to be an object",
      ],
      [
        '',
        'New Error ',
        'Wait time out reached, while waiting for results',
        'No updates are to be performed.',
      ],
      [
        'Sorry, This video cannot be accessed via this website',
        'Error getting key from: %s',
        'Message originator is not the grader, or the person being graded',
        'Empty name specified',
      ],
      [
        'the specified credentials were rejected by the server',
        'Exception not raised: %s',
        'Unable to allocate address',
        'TypeError exception should be raised',
      ],
    ]
    const object13: any = [
      [
        'Could not find a grader object for message from xqueue',
        'Counterparty sent error: %s',
        'Sorry, This video cannot be accessed via this website',
        'Unable to allocate address',
      ],
      [
        'Unable to allocate address',
        'Warning: ',
        'Invalid [%s] value. %s',
        'Empty name specified',
      ],
      [
        'To force deletion of the LAG use delete_force: True',
        'TypeError exception should be raised',
        'unexpected error',
        'Invalid [%s] value. %s',
      ],
      ['Error:', 'No error', 'TypeError exception should be raised', 'Error:'],
    ]
    const object14: any = [
      [
        'Message recipient is the same as originator',
        'No updates are to be performed.',
        'No error',
        'cannot be found.',
      ],
      [
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Sorry, The video you are looking for does not exist.',
        '',
        'Uploaded file was not added to the resource. ',
      ],
      [
        'Error:',
        "Top level object in 'override.yml' needs to be an object",
        '\n\nThe first error message:\n',
        'New Error ',
      ],
      ['Unknown error', 'invalid option', 'invalid option', 'does not exist'],
    ]
    const object15: any = [object11, object12, object13, object14]
    const object16: any = [
      [
        '\n\nThe first error message:\n',
        '',
        'the specified credentials were rejected by the server',
        'Mock Error Message',
      ],
      [
        'Internal Server Error\n',
        '',
        'Uploaded file was not added to the resource. ',
        'Sorry, The video you are looking for does not exist.',
      ],
      [
        'Mock Error Message',
        '<error_message>%s</error_message>',
        '<error_message>%s</error_message>',
        'unexpected error',
      ],
      [
        'Connection is closed',
        'Internal Server Error\n',
        'Unable to allocate address',
        'Sorry, The video you are looking for does not exist.',
      ],
    ]
    const object17: any = [
      [
        '<error_message>%s</error_message>',
        'No response',
        'Warning: ',
        'An error occurred processing your request.',
      ],
      [
        'No updates are to be performed.',
        'Could not find a submission object for message from xqueue',
        'Grader id does not match submission id that was passed in',
        'Invalid Invitation Token.',
      ],
      [
        'The line-by-line profiler can only be used in dev.',
        "Top level object in 'override.yml' needs to be an object",
        '<error_message>%s</error_message>',
        'To force deletion of the LAG use delete_force: True',
      ],
      [
        'Connection is closed',
        'does not exist',
        'Invalid data: No data found in any of the field(s)!!!',
        'Internal Server Error\n',
      ],
    ]
    const object18: any = [
      [
        '\n\nThe first error message:\n',
        'Invalid data: No data found in any of the field(s)!!!',
        'No error',
        '<error_message>%s</error_message>',
      ],
      [
        'Bad Authentication data',
        'missing encoding',
        "Top level object in 'override.yml' needs to be an object",
        'Unable to allocate address',
      ],
      [
        'Grader id does not match submission id that was passed in',
        'Error:',
        'Invalid data: No data found in any of the field(s)!!!',
        'Ran out of iterations',
      ],
      [
        'Could not find a grader object for message from xqueue',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Exception not raised: %s',
      ],
    ]
    const object19: any = [
      [
        'Could not find a submission object for message from xqueue',
        'Empty name specified',
        'Message originator is not the grader, or the person being graded',
        'the specified credentials were rejected by the server',
      ],
      [
        'No error',
        'Unknown error',
        'Wait time out reached, while waiting for results',
        'There is a mismatch',
      ],
      [
        'Error in retrieving email.',
        'Message recipient is not the grader, the person being graded, or the controller',
        'Warning: ',
        'ValueError exception should be raised',
      ],
      [
        'Connection is closed',
        'does not exist',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Unable to allocate address',
      ],
    ]
    const object20: any = [object16, object17, object18, object19]
    const object21: any = [object5, object10, object15, object20]
    const result: any = mutations.default.sendMessage(
      { unreadMessage: 404, length: 0, messages: object21, isScrollOver: true },
      {
        value: 'elio@example.com',
        user: { from: 'C:\\\\path\\to\\folder\\', address: '0.0.0.0' },
      },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.sendMessage(
      {
        unreadMessage: -Infinity,
        length: -Infinity,
        messages: [],
        isScrollOver: true,
      },
      { value: '', user: { from: '', address: '' } },
      false,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.default.addReaction', () => {
  test('0', () => {
    const object: any = [
      [
        'An error occurred processing your request.',
        'No error',
        'Wait time out reached, while waiting for results',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
      [
        'cannot be found.',
        'Counterparty sent error: %s',
        'Could not find a submission object for message from xqueue',
        'Could not find a grader object for message from xqueue',
      ],
      [
        'Error selecting from database',
        '',
        'No error',
        'Error selecting from database',
      ],
      [
        'Uploaded file was not added to the resource. ',
        'Error:',
        'No response',
        'Error in retrieving email.',
      ],
    ]
    const object2: any = [
      [
        'Internal Server Error\n',
        'does not exist',
        '\n\nThe first error message:\n',
        'No response',
      ],
      [
        'Uploaded file was not added to the resource. ',
        'Message recipient is not the grader, the person being graded, or the controller',
        'TypeError exception should be raised',
        'No os dependencies found. ',
      ],
      [
        'Uploaded file was not added to the resource. ',
        'Unable to allocate address',
        'To force deletion of the LAG use delete_force: True',
        'Message recipient is not the grader, the person being graded, or the controller',
      ],
      [
        'Message originator is not the grader, or the person being graded',
        'Error:',
        'Error getting key from: %s',
        'Unable to allocate address',
      ],
    ]
    const object3: any = [
      [
        '\n\nThe first error message:\n',
        'Exception not raised: %s',
        '<error_message>%s</error_message>',
        'Invalid Invitation Token.',
      ],
      [
        'Could not find a grader object for message from xqueue',
        'Unable to allocate address',
        'Counterparty sent error: %s',
        'Invalid [%s] value. %s',
      ],
      [
        'missing encoding',
        'New Error ',
        'cannot be found.',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
      [
        'Message recipient is the same as originator',
        "Top level object in 'override.yml' needs to be an object",
        'No os dependencies found. ',
        'Connection is closed',
      ],
    ]
    const object4: any = [
      [
        'No os dependencies found. ',
        'Unknown Error',
        'Could not find an existing submission in location.  rubric is original.',
        'There is a mismatch',
      ],
      [
        '\n\nThe first error message:\n',
        'Message recipient is the same as originator',
        'Invalid Invitation Token.',
        'Could not find an existing submission in location.  rubric is original.',
      ],
      [
        'unexpected error',
        'Internal Server Error\n',
        'Unknown Error',
        'TypeError exception should be raised',
      ],
      [
        'Grader id does not match submission id that was passed in',
        'Message recipient is not the grader, the person being graded, or the controller',
        'No os dependencies found. ',
        'cannot be found.',
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const result: any = mutations.default.addReaction(
      { messages: object5, isReacted: true },
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        groupID: 'bc23a9d531064583ace8f67dad60f6bb',
        replyID: '9876',
        messageID: 'c466a48309794261b64a4f02cfcc3d64',
        emoji: 'Jean-Philippe',
        reactor: {
          reactions: [
            '9876',
            'bc23a9d531064583ace8f67dad60f6bb',
            'da7588892',
            'c466a48309794261b64a4f02cfcc3d64',
          ],
          reactors: [false, true, false, true],
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object: any = [
      [
        'does not exist',
        'This is an exception, voilà',
        'Unable to allocate address',
        'Missing FileUri configuration',
      ],
      ['No error', 'does not exist', 'Error:', 'unexpected error'],
      [
        'Could not find an existing submission in location.  rubric is original.',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Connection is closed',
        "Top level object in 'override.yml' needs to be an object",
      ],
      [
        'Counterparty sent error: %s',
        'Ran out of iterations',
        'Warning: ',
        "Top level object in 'override.yml' needs to be an object",
      ],
    ]
    const object2: any = [
      [
        'Uploaded file was not added to the resource. ',
        'Connection is closed',
        'Bad Authentication data',
        'Message originator is not the grader, or the person being graded',
      ],
      [
        'No error',
        'Could not find a grader object for message from xqueue',
        'Could not find an existing submission in location.  rubric is original.',
        'Unknown Error',
      ],
      [
        'cannot be found.',
        "Top level object in 'override.yml' needs to be an object",
        '',
        'Connection is closed',
      ],
      [
        'does not exist',
        'the specified credentials were rejected by the server',
        'No error',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
    ]
    const object3: any = [
      [
        'No updates are to be performed.',
        'This is an exception, voilà',
        'New Error ',
        'Unknown error',
      ],
      [
        'the specified credentials were rejected by the server',
        'No os dependencies found. ',
        'Warning: ',
        'Sorry, This video cannot be accessed via this website',
      ],
      [
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Unable to allocate address',
        'Could not find a submission object for message from xqueue',
        'Invalid Invitation Token.',
      ],
      [
        'Connection is closed',
        'The app does not exist',
        'Unknown Error',
        'Error getting key from: %s',
      ],
    ]
    const object4: any = [
      [
        'No os dependencies found. ',
        'Error:',
        'Empty name specified',
        'Sorry, This video cannot be accessed via this website',
      ],
      [
        'the specified credentials were rejected by the server',
        'This is an exception, voilà',
        'unexpected error',
        'does not exist',
      ],
      [
        'New Error ',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Wait time out reached, while waiting for results',
        'No updates are to be performed.',
      ],
      [
        'cannot be found.',
        'Uploaded file was not added to the resource. ',
        'TypeError exception should be raised',
        'No updates are to be performed.',
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const result: any = mutations.default.addReaction(
      { messages: object5, isReacted: false },
      {
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        groupID: '9876',
        replyID: 'bc23a9d531064583ace8f67dad60f6bb',
        messageID: '9876',
        emoji: 'George',
        reactor: {
          reactions: [
            'c466a48309794261b64a4f02cfcc3d64',
            'bc23a9d531064583ace8f67dad60f6bb',
            'da7588892',
            '9876',
          ],
          reactors: [true, true, true, true],
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object: any = [
      [
        'Message recipient is not the grader, the person being graded, or the controller',
        'Invalid Invitation Token.',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Sorry, The video you are looking for does not exist.',
      ],
      [
        'No response',
        'Error in retrieving email.',
        'missing encoding',
        'Invalid [%s] value. %s',
      ],
      [
        'does not exist',
        'Invalid [%s] value. %s',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Mock Error Message',
      ],
      [
        'No os dependencies found. ',
        'Could not find an existing submission in location.  rubric is original.',
        'Message recipient is the same as originator',
        'Message originator is not the grader, or the person being graded',
      ],
    ]
    const object2: any = [
      [
        'Bad Authentication data',
        'Error:',
        'No os dependencies found. ',
        'No error',
      ],
      [
        'Invalid Invitation Token.',
        'invalid option',
        'Unknown Error',
        'Error selecting from database',
      ],
      [
        'No response',
        'Unable to allocate address',
        '\n\nThe first error message:\n',
        'Unable to allocate address',
      ],
      [
        'Wait time out reached, while waiting for results',
        'Grader id does not match submission id that was passed in',
        'No os dependencies found. ',
        'Internal Server Error\n',
      ],
    ]
    const object3: any = [
      [
        'The line-by-line profiler can only be used in dev.',
        'To force deletion of the LAG use delete_force: True',
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Internal Server Error\n',
      ],
      [
        'Invalid Invitation Token.',
        'unexpected error',
        'the specified credentials were rejected by the server',
        'Unable to allocate address',
      ],
      [
        'New Error ',
        'There is a mismatch',
        'Invalid Invitation Token.',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
      [
        'To force deletion of the LAG use delete_force: True',
        'Message recipient is not the grader, the person being graded, or the controller',
        '',
        'Wait time out reached, while waiting for results',
      ],
    ]
    const object4: any = [
      [
        'Could not find a submission object for message from xqueue',
        'Error getting key from: %s',
        'Invalid data: No data found in any of the field(s)!!!',
        'cannot be found.',
      ],
      ['No response', 'Unknown Error', 'No response', 'Warning: '],
      [
        'Could not find a submission object for message from xqueue',
        'Invalid Invitation Token.',
        'New Error ',
        'The app does not exist',
      ],
      [
        'Internal Server Error\n',
        'No updates are to be performed.',
        'missing encoding',
        'Uploaded file was not added to the resource. ',
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const result: any = mutations.default.addReaction(
      { messages: object5, isReacted: true },
      {
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        groupID: 'bc23a9d531064583ace8f67dad60f6bb',
        replyID: 'bc23a9d531064583ace8f67dad60f6bb',
        messageID: 'da7588892',
        emoji: 'Pierre Edouard',
        reactor: {
          reactions: [
            '9876',
            'c466a48309794261b64a4f02cfcc3d64',
            'bc23a9d531064583ace8f67dad60f6bb',
            '12345',
          ],
          reactors: [true, true, true, true],
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object: any = [
      [
        'the specified credentials were rejected by the server',
        'Message recipient is not the grader, the person being graded, or the controller',
        'Unable to allocate address',
        'Could not find a grader object for message from xqueue',
      ],
      [
        'Message originator is not the grader, or the person being graded',
        'Ran out of iterations',
        'No updates are to be performed.',
        'There is a mismatch',
      ],
      [
        'Mock Error Message',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Mock Error Message',
        'Connection is closed',
      ],
      [
        'missing encoding',
        'Invalid Invitation Token.',
        'There is a mismatch',
        '',
      ],
    ]
    const object2: any = [
      [
        'Grader id does not match submission id that was passed in',
        'There is a mismatch',
        'Bad Authentication data',
        'Error selecting from database',
      ],
      [
        'No error',
        "Top level object in 'override.yml' needs to be an object",
        'Message originator is not the grader, or the person being graded',
        'No error',
      ],
      [
        'Grader id does not match submission id that was passed in',
        'Error getting key from: %s',
        'Message recipient is the same as originator',
        'Error getting key from: %s',
      ],
      ['', 'Mock Error Message', 'Bad Authentication data', 'New Error '],
    ]
    const object3: any = [
      [
        'Grader id does not match submission id that was passed in',
        '<error_message>%s</error_message>',
        'cannot be found.',
        'Invalid data: No data found in any of the field(s)!!!',
      ],
      [
        'Sorry, The video you are looking for does not exist.',
        'TypeError exception should be raised',
        'To force deletion of the LAG use delete_force: True',
        'the specified credentials were rejected by the server',
      ],
      [
        'No updates are to be performed.',
        'No error',
        'Could not find an existing submission in location.  rubric is original.',
        'Sorry, The video you are looking for does not exist.',
      ],
      [
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'Message recipient is the same as originator',
        'New Error ',
        '',
      ],
    ]
    const object4: any = [
      [
        'No updates are to be performed.',
        'the specified credentials were rejected by the server',
        'TypeError exception should be raised',
        'Exception not raised: %s',
      ],
      [
        'unexpected error',
        'TypeError exception should be raised',
        'Internal Server Error\n',
        'Unknown error',
      ],
      [
        'Exception not raised: %s',
        'Unable to allocate address',
        'Could not find a submission object for message from xqueue',
        'Invalid Invitation Token.',
      ],
      [
        'Could not find a submission object for message from xqueue',
        'does not exist',
        'Invalid [%s] value. %s',
        'ValueError exception should be raised',
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const result: any = mutations.default.addReaction(
      { messages: object5, isReacted: true },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        groupID: 'da7588892',
        replyID: '12345',
        messageID: 'da7588892',
        emoji: 'Jean-Philippe',
        reactor: {
          reactions: [
            'c466a48309794261b64a4f02cfcc3d64',
            '9876',
            '12345',
            'da7588892',
          ],
          reactors: [false, true, true, true],
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object: any = [
      [
        'unexpected error',
        'Invalid [%s] value. %s',
        'Bad Authentication data',
        '\n\nThe first error message:\n',
      ],
      [
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'the specified credentials were rejected by the server',
        'missing encoding',
        'This is an exception, voilà',
      ],
      [
        'Could not find an existing submission in location.  rubric is original.',
        'Warning: ',
        'This is an exception, voilà',
        'Error selecting from database',
      ],
      [
        'the specified credentials were rejected by the server',
        'Unknown Error',
        'No updates are to be performed.',
        'Warning: ',
      ],
    ]
    const object2: any = [
      [
        'Mock Error Message',
        'Error:',
        'Error selecting from database',
        'Unknown Error',
      ],
      [
        'Unable to find your git executable - Shutdown SickBeard and EITHER <a href="http://code.google.com/p/sickbeard/wiki/AdvancedSettings" onclick="window.open(this.href); return false;">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.',
        'cannot be found.',
        'No error',
        'Could not find a submission object for message from xqueue',
      ],
      [
        'No error',
        'Invalid Invitation Token.',
        'Error:',
        'Uploaded file was not added to the resource. ',
      ],
      [
        'Unable to allocate address',
        '<error_message>%s</error_message>',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Error in retrieving email.',
      ],
    ]
    const object3: any = [
      [
        'There is a mismatch',
        'unexpected error',
        'Invalid Invitation Token.',
        'Error:',
      ],
      [
        'Message originator is not the grader, or the person being graded',
        'ValueError exception should be raised',
        'Sorry, The video you are looking for does not exist.',
        'Error selecting from database',
      ],
      [
        'Error:',
        'Unable to allocate address',
        'No response',
        '\n\nThe first error message:\n',
      ],
      [
        'This is an exception, voilà',
        'Unknown Error',
        'TrainerCourseDetailError: Either not an ajax call or not a GET request!!!',
        'Error getting key from: %s',
      ],
    ]
    const object4: any = [
      [
        'Mock Error Message',
        'Invalid data: No data found in any of the field(s)!!!',
        'Exception not raised: %s',
        'cannot be found.',
      ],
      [
        'No updates are to be performed.',
        'Could not find a grader object for message from xqueue',
        'Error:',
        'Invalid Invitation Token.',
      ],
      [
        'Could not find a submission object for message from xqueue',
        'No os dependencies found. ',
        'Warning: ',
        'Could not find a submission object for message from xqueue',
      ],
      [
        'missing encoding',
        'cannot be found.',
        'The line-by-line profiler can only be used in dev.',
        'invalid option',
      ],
    ]
    const object5: any = [object, object2, object3, object4]
    const result: any = mutations.default.addReaction(
      { messages: object5, isReacted: true },
      {
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        groupID: 'da7588892',
        replyID: '9876',
        messageID: 'da7588892',
        emoji: 'Edmond',
        reactor: {
          reactions: [
            'c466a48309794261b64a4f02cfcc3d64',
            '12345',
            'da7588892',
            'c466a48309794261b64a4f02cfcc3d64',
          ],
          reactors: [true, false, true, false],
        },
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.addReaction(
      { messages: [], isReacted: true },
      {
        id: '',
        groupID: '',
        replyID: '',
        messageID: '',
        emoji: '',
        reactor: { reactions: [], reactors: [] },
      },
    )
    expect(result).toMatchSnapshot()
  })
})
