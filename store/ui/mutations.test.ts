import { Fil } from '~/libraries/Files/Fil'
import { DIRECTORY_TYPE } from '~/libraries/Files/types/directory'
import { RegistrationStatus } from '~/store/accounts/types'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import * as mutations from '~/store/ui/mutations'
import { FlairColors, ThemeNames } from '~/store/ui/types'

// So we don't have annoying snapshot fails. (https://stackoverflow.com/questions/42935903/jest-snapshot-testing-how-to-ignore-part-of-the-snapshot-file-in-jest-test-resu)
Date.now = jest.fn(() => 1645617999076)
const dateNow = Date.now()

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

describe('mutations', () => {
  const initialRootState: any = {
    accounts: {
      storePin: true,
      loading: true,
      locked: true,
      pin: '',
      pinHash: '',
      active: '',
      gasPrice: '',
      phrase: '',
      error: '',
      encryptedPhrase: '',
      registered: true,
      details: {
        name: '',
        address: '',
        status: '',
        state: 'idle',
        unreadCount: 123,
        profilePicture: '',
        badge: 'community',
        userAccount: '',
        mailboxId: '',
        textilePubkey: '',
      },
      registrationStatus: RegistrationStatus.IN_PROGRESS,
      lastVisited: '',
    },
    dataState: {
      files: DataStateType.Empty,
      friends: DataStateType.Loading,
      search: DataStateType.Ready,
    },
    friends: {
      incomingRequests: [
        {
          requestId: '',
          account: {
            accountId: '',
            from: '',
            status: 123,
            fromMailboxId: '',
            toMailboxId: '',
            to: '',
          },
          pending: true,
          from: '',
          userInfo: {
            name: '',
            servers: {},
            status: '',
            photoHash: '',
          },
        },
      ],
      outgoingRequests: [
        {
          to: '',
          requestId: '',
          account: {
            accountId: '',
            from: '',
            status: 123,
            fromMailboxId: '',
            toMailboxId: '',
            to: '',
          },
          pending: true,
        },
      ],
      all: [
        {
          publicKey: 'NoWiFi4you',
          typingState: 'NOT_TYPING',
          item: {},
          pending: true,
          activeChat: true,
          encryptedTextilePubkey: '',
          name: 'Taurus Nix',
          address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
          account: {
            accountId: 'Checking Account',
            from: '.',
            status: 429,
            fromMailboxId: '12345',
            toMailboxId: 'v4.0.0-rc.4',
            to: './path/to/file',
          },
          textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
        },
      ],
    },
    textile: {
      initialized: true,
      conversations: {},
      conversationLoading: true,
      messageLoading: true,
      uploadProgress: {
        abc: {
          progress: 42,
          finished: false,
          name: 'file.pdf',
        },
      },
    },
    settings: {
      audioInput: '',
      audioOutput: '',
      videoInput: '',
      captureMouse: CaptureMouseTypes.always,
      noiseSuppression: true,
      echoCancellation: true,
      bitrate: 96000,
      sampleSize: 24,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userHasGivenAudioAccess: false,
      userDeniedAudioAccess: false,
      keybinds: {
        toggleMute: 'alt+m',
        toggleDeafen: 'alt+d',
        openSettings: 'alt+s',
        callActiveChat: 'alt+c',
      },
      embeddedLinks: true,
      displayCurrentActivity: true,
    },
  }
  const initialState = {
    contextMenuStatus: false,
    showSidebar: true,
    showSearchResult: false,
    showSettings: false,
    settingsSideBar: true,
    settingsRoute: 'personalize',
    quickProfile: false,
    userProfile: {},
    contextMenuValues: [],
    contextMenuPosition: {
      x: 0,
      y: 0,
    },
    quickProfilePosition: {
      x: 0,
      y: 0,
    },
    modals: {
      changelog: false,
      createServer: false,
      error: false,
      glyph: false,
      marketplace: false,
      newfolder: false,
      quickchat: false,
      userProfile: false,
      wallet: false,
      walletMini: false,
    },
    glyphModalPack: '',
    chatbarContent: '',
    replyChatbarMessage: {
      from: '',
      id: '',
      payload: '',
    },
    chatbarFocus: false,
    fullscreen: false,
    showPinned: false,
    enhancers: {
      containerWidth: 0,
      defaultHeight: '30rem',
      defaultWidth: '24rem',
      floating: false,
      position: [0, 0],
      route: 'emoji',
      show: false,
    },
    address: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
    messages: [
      {
        id: dateNow,
        at: dateNow,
        type: 'group',
        from: dateNow,
        to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
        messages: [
          {
            id: dateNow,
            at: dateNow,
            type: 'text',
            payload: 'payload',
            reactions: [],
            replies: [],
          },
        ],
      },
      {
        id: dateNow,
        at: dateNow,
        type: 'group',
        from: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
        to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
        messages: [
          {
            id: dateNow,
            at: dateNow,
            type: 'text',
            payload: 'message',
            reactions: [],
            replies: [],
          },
        ],
      },
    ],
    unreadMessage: 0,
    isScrollOver: false,
    showOlderMessagesInfo: false,
    isTyping: {
      address: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
      last_message:
        'Ship of the imagination consciousness across the centuries network of wormholes finite but unbounded inconspicuous motes of rock and gas.',
      name: 'Phoenix Kalindi',
      profilePicture: '',
      state: 'online',
      status: 'Working on the space station',
      unreads: 4,
    },
    isReacted: false,
    activeChannel: undefined,
    settingReaction: {
      groupID: null,
      messageID: null,
      status: false,
    },
    hoveredGlyphInfo: undefined,
    glyphMarketplaceView: {
      shopId: null,
      view: 'home',
    },
    editMessage: {
      from: '',
      id: '',
      payload: '',
    },
    recentReactions: ['😰', '😡', '👍'],
    mostEmojiUsed: [
      {
        code: 'thumbup',
        content: '👍',
        count: 1,
      },
      {
        code: 'flag_id',
        content: '🇮🇩',
        count: 3,
      },
      {
        code: 'pray',
        content: '🙏 ',
        count: 2,
      },
    ],
    recentGlyphs: [
      {
        pack: {
          name: 'Birds',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'Dina Brodsky',
          id: '0903',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/hawk.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/ducklings.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/owl.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/penguins.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/robin.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/stork.webp',
            'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/yellow_bird.webp',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/ducklings.webp',
        count: 1,
      },
      {
        pack: {
          name: 'Astrobunny',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Coy_02.gif',
        count: 1,
      },
      {
        pack: {
          name: 'Astrobunny',
          description: 'Short description can go here. Lorem ipsum.',
          artist: 'John Treanor',
          id: '0123',
          stickerURLs: [
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/AHH.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/AHHcloseup.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Coy_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Cry.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Cry2.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Laugh.webp',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Luv.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Luv_02.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/Sad3.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsDownNew.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUP.gif',
            'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUPNew.gif',
          ],
        },
        url: 'https://satellite.mypinata.cloud/ipfs/QmaBFFeJksvrfEhwbKYkzbgm7bKFWzHhRECqGxgB52LeHg/$1/ThumbsUP.gif',
        count: 1,
      },
    ],
    theme: {
      base: {
        class: '',
        name: 'default',
        text: 'Default',
        value: 'default',
      },
      flair: {
        text: 'Satellite',
        value: '#2761fd',
      },
    },
    isLoadingFileIndex: true,
    fileDownloadList: ['string'],
    renameItem: {},
  }

  test('togglePinned', () => {
    const localizedState = { ...initialState }
    mutations.default.togglePinned(localizedState, true)
    expect(localizedState.showPinned).toBeTruthy()
  })

  test('toggleContextMenu', () => {
    const localizedState = { ...initialState }
    mutations.default.toggleContextMenu(localizedState, true)
    expect(localizedState.contextMenuStatus).toBeTruthy()
  })

  test('showSidebar', () => {
    const localizedState = { ...initialState }
    mutations.default.showSidebar(localizedState, true)
    expect(localizedState.showSidebar).toBeTruthy()
  })

  test('setContextMenuValues', () => {
    const localizedState = { ...initialState }
    mutations.default.setContextMenuValues(localizedState, true)
    expect(localizedState.contextMenuValues).toBeTruthy()
  })

  test('setContextMenuPosition', () => {
    const localizedState = { ...initialState }
    const object = {
      x: 4,
      y: 2,
    }
    mutations.default.setContextMenuPosition(localizedState, object)
    expect(localizedState.contextMenuPosition).toMatchObject(object)
  })

  test('setQuickProfilePosition', () => {
    const localizedState = { ...initialState }
    const object = {
      x: 4,
      y: 2,
    }
    mutations.default.setQuickProfilePosition(localizedState, object)
    expect(localizedState.quickProfilePosition).toMatchObject(object)
  })

  test('quickProfile', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'John',
    }
    mutations.default.quickProfile(localizedState, object)
    expect(localizedState.quickProfile).toMatchObject(object)
  })

  test('setUserProfile', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'John',
    }
    mutations.default.setUserProfile(localizedState, object)
    expect(localizedState.userProfile).toMatchObject(object)
  })

  test('chatbarContent', () => {
    const localizedState = { ...initialState }
    mutations.default.chatbarContent(localizedState, 'string')
    expect(localizedState.chatbarContent).toBe('string')
  })

  test('fullscreen', () => {
    const localizedState = { ...initialState }
    mutations.default.fullscreen(localizedState, true)
    expect(localizedState.fullscreen).toBeTruthy()
  })

  test.skip('setFilePreview', () => {
    const mockFileData = {
      name: 'TestFile.webp',
      hash: '0x0aef',
      size: 4235,
      liked: false,
      shared: false,
      description: 'Test file description',
    }
    const file = new Fil(mockFileData)
    const localizedState = { ...initialState }
    mutations.default.setFilePreview(localizedState, file)
    expect(localizedState.filePreview).toBe(file)
  })

  test('setChatImageOverlay', () => {
    const passedInImageOverlay = undefined
    const localizedState = { ...initialState }
    mutations.default.setChatImageOverlay(localizedState, passedInImageOverlay)
    expect(localizedState.chatImageOverlay).toBeUndefined()
  })

  test('toggleEnhancers with non-default options', () => {
    const localizedState = { ...initialState }
    const object = {
      show: false,
      floating: true,
      position: [10],
      defaultWidth: '100',
      defaultHeight: '100',
      containerWidth: 17605,
      route: 'Et maiores amet nesciunt.',
    }
    mutations.default.toggleEnhancers(localizedState, object)
    expect(JSON.stringify(localizedState.enhancers)).toBe(
      JSON.stringify(object),
    )
    // The reason we're doing JSON.stringify to both the expected and received part is because if we don't, we'll get the `serializes to the same string` error.
  })

  test('toggleEnhancers with default options', () => {
    const localizedState = { ...initialState }
    mutations.default.toggleEnhancers(localizedState, {})
    expect(localizedState.enhancers).toBe(localizedState.enhancers)
    /*
     As paradoxical as it may seem here, this is very much normal. Consider the following ternary operation:
    
     typeof options.floating !== 'undefined'
     ? options.floating
     : state.enhancers.floating,
    
     If we do not pass an object (options) containing the floating property (options.floating),
     it will fall back to the existing value it has: which is what `state.enhancers.floating` has.
     Hence, what we're doing is checking if the state we are checking (state.enhancers) would be mutated
     if there were no options being passed into it.
     */
  })

  test('sendMessage with the same lastMessageSender', () => {
    const localizedState = { ...initialState }
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
    mutations.default.sendMessage(
      localizedState,
      {
        value: 'elio@example.com',
        user: {
          from: 'C:\\\\path\\to\\folder\\',
          address: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
        },
      },
      false,
    )
    expect(
      localizedState.messages[localizedState.messages.length - 1],
    ).toMatchSnapshot()
  })

  test.skip('updateTheme', () => {
    const localizedState = { ...initialState }
    const object = {
      text: 'Moonless Night',
      name: ThemeNames.MOONLESS,
      value: ThemeNames.MOONLESS,
      class: 'moonless_night',
    }
    mutations.default.updateTheme(localizedState, object)
    expect(localizedState.theme.base).toBe(object)
  })

  test.skip('updateFlair', () => {
    const localizedState = { ...initialState }
    const object = {
      text: 'Lavender',
      value: FlairColors.LAVENDER,
    }
    mutations.default.updateFlair(localizedState, object)
    expect(localizedState.theme.flair).toBe(object)
  })

  test('setChatbarFocus', () => {
    const localizedState = { ...initialState }
    mutations.default.setChatbarFocus(localizedState, true)
    expect(localizedState.chatbarFocus).toBeTruthy()
  })

  test.skip('setRenameItem', () => {
    const localizedState = { ...initialState }
    const mockDirectoryData = {
      name: 'Test Directory',
      liked: false,
      shared: false,
      type: DIRECTORY_TYPE.DEFAULT,
    }
    mutations.default.setRenameItem(localizedState, mockDirectoryData)
    expect(localizedState.renameItem).toBe(mockDirectoryData)
  })

  test('setSettingsRoute', () => {
    const localizedState = { ...initialState }
    mutations.default.setSettingsRoute(localizedState, 'profile')
    expect(localizedState.settingsRoute).toBe('profile')
  })

  test('showSearchResult', () => {
    const localizedState = { ...initialState }
    mutations.default.showSearchResult(localizedState, true)
    expect(localizedState.showSearchResult).toBeTruthy()
  })

  test('setGlyphModalPack', () => {
    const localizedState = { ...initialState }
    mutations.default.setGlyphModalPack(localizedState, 'string')
    expect(localizedState.glyphModalPack).toBe('string')
  })

  test('toggleModal', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'quickchat',
      state: true,
    }
    mutations.default.toggleModal(localizedState, object)
    expect(localizedState.modals).toMatchObject({
      [object.name]: object.state,
    })

    /*
     * The reason we're doing the matcher the above way is rather than .toMatchObject(object) if we don't
     * it will be expecting:
     * {"name": "quickchat",
     * "state": true, }
     * rather than
     * {"quickchat": true}
     */
  })

  test('toggleModal with a non-existent modal', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'non-existent modal',
      state: true,
    }
    mutations.default.toggleModal(localizedState, object)
    expect(localizedState.modals).toMatchObject({
      [object.name]: object.state,
    })

    // This would not throw an error, because it will just create a new key with the boolean as a value
  })

  test('toggleModal with a non-existent modal', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'non-existent modal',
      state: true,
    }
    mutations.default.toggleModal(localizedState, object)
    expect(localizedState.modals).toMatchObject({
      [object.name]: object.state,
    })

    // This would not throw an error, because it will just create a new key with the boolean as a value
  })

  test('toggleErrorNetworkModal', () => {
    const localizedState = { ...initialState }
    const argument = { state: true, action: null }
    mutations.default.toggleErrorNetworkModal(localizedState, argument)
    expect(localizedState.modals.errorNetwork).toMatchObject({
      isOpen: argument.state,
      action: argument.action,
    })
  })

  test('setMessages', () => {
    const localizedState = { ...initialState }
    const array = ['message']
    mutations.default.setMessages(localizedState, array)
    expect(localizedState.messages).toBe(array)
  })

  test('setIsReacted', () => {
    const localizedState = { ...initialState }
    mutations.default.setIsReacted(localizedState, true)
    expect(localizedState.isReacted).toBeTruthy()
  })

  test('setIsScrollOver true status', () => {
    const localizedState = { ...initialState }
    mutations.default.setIsScrollOver(localizedState, true)
    expect(localizedState.isScrollOver).toBeTruthy()
  })

  test('setShowOlderMessagesInfo false status', () => {
    const localizedState = { ...initialState }
    mutations.default.setShowOlderMessagesInfo(localizedState, false)
    expect(localizedState.showOlderMessagesInfo).toBeFalsy()
  })

  test('setShowOlderMessagesInfo true status', () => {
    const localizedState = { ...initialState }
    mutations.default.setShowOlderMessagesInfo(localizedState, true)
    expect(localizedState.showOlderMessagesInfo).toBeTruthy()
  })

  test('setIsScrollOver false status', () => {
    const localizedState = { ...initialState }
    mutations.default.setIsScrollOver(localizedState, false)
    expect(localizedState.isScrollOver).toBeFalsy()
    expect(localizedState.unreadMessage).toBe(0)
  })

  test('setGlyphMarketplaceView', () => {
    const localizedState = { ...initialState }
    const object = { a: 'b' }
    mutations.default.setGlyphMarketplaceView(localizedState, object)
    expect(localizedState.glyphMarketplaceView).toBe(object)
  })

  test('setHoveredGlyphInfo', () => {
    const localizedState = { ...initialState }
    const object = { a: 'b' }
    mutations.default.setHoveredGlyphInfo(localizedState, object)
    expect(localizedState.hoveredGlyphInfo).toBe(object)
  })

  test('updateMostUsedEmoji with existing emoji', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'flag_id',
      emoji: '🇮🇩',
    }
    mutations.default.updateMostUsedEmoji(localizedState, object)
    expect(localizedState.mostEmojiUsed).toContainEqual({
      code: 'flag_id',
      content: '🇮🇩',
      count: 4, // This emoji has been used 3 times in the past, by sending this message (via this unit): we've incremented this to 4 from 3.
    })
  })

  test('updateMostUsedEmoji with new emoji', () => {
    const localizedState = { ...initialState }
    const object = {
      name: 'flag_south_africa',
      emoji: '🇿🇦',
    }
    mutations.default.updateMostUsedEmoji(localizedState, object)
    expect(localizedState.mostEmojiUsed).toContainEqual({
      code: 'flag_south_africa',
      content: '🇿🇦',
      count: 1, // This emoji has been not been used in the past, by sending this message (via this unit): we've incremented this to 1 from 0.
    })
  })

  test('updateMostUsedGlyph with existing emoji', () => {
    const localizedState = { ...initialState }
    const object = {
      pack: {
        name: 'Birds',
        description: 'Short description can go here. Lorem ipsum.',
        artist: 'Dina Brodsky',
        id: '0903',
        stickerURLs: [
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/hawk.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/ducklings.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/owl.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/penguins.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/robin.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/stork.webp',
          'https://satellite.mypinata.cloud/ipfs/QmS1NEujgAT8iogdK3jsQzDf751U6LCSpCNojg1JJhs3zz/$1/yellow_bird.webp',
        ],
      },
      url: 'https://satellite.mypinata.cloud/ipfs/QmXrmiCxkyfpsAY18qzVBPv9TpCbTUToowQEsYy1Pm5C9b/$1/ducklings.webp',
      count: 2, // Since this glyph has been used before, it will be incremented from 1 to 2.
    }
    mutations.default.updateRecentGlyphs(localizedState, object)
    expect(localizedState.recentGlyphs).toMatchSnapshot()
  })

  test('updateMostUsedGlyph with new emoji', () => {
    const localizedState = { ...initialState }
    const object = {
      pack: {
        name: 'name',
        artist: 'artist',
        id: 'id',
        stickerURLs: ['string1', 'string2'],
      },
      url: 'Sit rerum praesentium aut ut molestiae voluptatem et sed. Ut iste amet reprehenderit facilis eos fugit. Odit earum ut vero eligendi modi esse omnis officia.\n \rTempora voluptas modi fuga ex consequatur provident pariatur. Voluptatem exercitationem est necessitatibus. Aut nobis beatae itaque aut alias ut ipsam. Consequatur et similique ipsa eveniet voluptates beatae quidem. Aut quas velit distinctio consequatur voluptatem doloribus.\n \rLabore sint voluptate. Eveniet dolorem veritatis in corrupti esse maiores porro consequatur. Optio qui ut doloribus sequi sunt ipsa provident. Tempora qui beatae. Sit modi perferendis fugit perferendis. Debitis suscipit inventore.',
    }
    mutations.default.updateRecentGlyphs(localizedState, object)
    expect(localizedState.recentGlyphs).toContainEqual({
      pack: object.pack,
      url: object.url,
      count: 1, // This emoji has been not been used in the past, by sending this message (via this unit): we've incremented this to 1 from 0.
    })
  })

  test('setTypingUser', () => {
    const localizedState = { ...initialState }
    mutations.default.setTypingUser(localizedState, true)
    expect(localizedState.isTyping).toBeTruthy()
  })

  test('settingReaction', () => {
    const localizedState = { ...initialState }
    mutations.default.settingReaction(localizedState, true)
    expect(localizedState.settingReaction).toBeTruthy()
  })

  test('setActiveChannel', () => {
    const localizedState = { ...initialState }
    const object = {
      type: 'payload',
      id: '5d802d44-23c3-49d8-a725-407bd17eb56b',
      name: 'Retha Larkin',
    }
    mutations.default.setActiveChannel(localizedState, object)
    expect(localizedState.activeChannel).toMatchObject(object)
  })

  test('setEditMessage', () => {
    const localizedState = { ...initialState }
    const object = {
      payload: 'payload',
      id: '5d802d44-23c3-49d8-a725-407bd17eb56b',
      from: 'Retha Larkin',
    }
    mutations.default.setEditMessage(localizedState, object)
    expect(localizedState.editMessage).toMatchObject(object)
  })

  test('saveEditMessage with existing message', () => {
    const localizedState = { ...initialState }
    const object = {
      payload: 'payload',
      id: dateNow,
      from: dateNow,
    }
    mutations.default.saveEditMessage(localizedState, object)
    expect(localizedState.messages).toContainEqual({
      at: dateNow,
      from: dateNow,
      id: dateNow,
      messages: [
        {
          at: dateNow,
          id: dateNow,
          payload: object.payload,
          reactions: [],
          replies: [],
          type: 'text',
        },
      ],
      to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
      type: 'group',
    })
  })

  test('saveEditMessage with existing message but mistmatching id', () => {
    const localizedState = { ...initialState }
    const object = {
      payload: 'payload',
      id: 1645622021469,
      from: dateNow,
    }
    mutations.default.saveEditMessage(localizedState, object)
    expect(localizedState.messages).toContainEqual({
      at: dateNow,
      from: dateNow,
      id: dateNow,
      messages: [
        {
          at: dateNow,
          id: dateNow,
          payload: object.payload,
          reactions: [],
          replies: [],
          type: 'text',
        },
      ],
      to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
      type: 'group',
    })
  })

  test('saveEditMessage with non-existing message', () => {
    const localizedState = { ...initialState }
    const newDateNow = 1645622021469
    const object = {
      payload: 'not payload',
      id: newDateNow,
      from: newDateNow,
    }
    mutations.default.saveEditMessage(localizedState, object)
    // Because our Date.now() is different, the messages will not be updated with our new payload. Hence the .not matcher
    expect(localizedState.messages).not.toContainEqual({
      at: newDateNow,
      from: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
      id: newDateNow,
      messages: [
        {
          at: newDateNow,
          id: newDateNow,
          payload: object.payload,
          reactions: [],
          replies: [],
          type: 'text',
        },
      ],
      to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
      type: 'group',
    })
  })

  test.skip('setFileSort', () => {
    const localizedState = { ...initialState }
    const argument = {
      category: 'modified',
      asc: true,
    }
    mutations.default.setFileSort(localizedState, argument)
    expect(localizedState.fileSort).toBe(argument)
  })

  test.skip('setFilesUploadStatus', () => {
    const localizedState = { ...initialState }
    mutations.default.setFilesUploadStatus(localizedState, 'process')
    expect(localizedState.filesUploadStatus).toBe('process')
  })

  test.skip('addFileDownload', () => {
    const localizedState = { ...initialState }
    mutations.default.addFileDownload(localizedState, 'process')
    expect(localizedState.fileDownloadList).toEqual(
      expect.arrayContaining(['process']),
    )
  })

  test.skip('removeFileDownload with query found', () => {
    const localizedState = { ...initialState }
    mutations.default.removeFileDownload(localizedState, 'process')
    expect(localizedState.fileDownloadList).not.toEqual(
      expect.arrayContaining(['process']),
    )
  })

  test.skip('removeFileDownload with query not found', () => {
    const localizedState = { ...initialState }
    mutations.default.removeFileDownload(localizedState, 'not-in-array')
    expect(localizedState.fileDownloadList).not.toEqual(
      expect.arrayContaining(['not-in-array']),
    )
  })

  test('send notification', () => {
    const localizedState = {
      contextMenuStatus: false,
      showSidebar: true,
      notifications: [
        {
          _id: '01g2y9d6499169rzs5etrff48w',
          _mod: 1652431427721842400,
          at: 1652431426842,
          content: {
            description: 'New DM',
            title: 'Notification',
          },
          from: 'Andre2',
          id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
          state: 'UNREAD',
          type: 'Direct Message',
        },
      ],
      showSearchResult: false,
      showSettings: false,
      settingsSideBar: true,
      settingsRoute: 'personalize',
      quickProfile: false,
      userProfile: {},
      contextMenuValues: [],
      contextMenuPosition: {
        x: 0,
        y: 0,
      },
      quickProfilePosition: {
        x: 0,
        y: 0,
      },
      modals: {
        callToAction: false,
        changelog: false,
        createServer: false,
        creategroup: false,
        crop: false,
        error: false,
        glyph: false,
      },
      groupInvite: {
        isOpen: false,
        marketplace: false,
        newfolder: false,
        quickchat: false,
        renameFile: false,
        userProfile: false,
        wallet: false,
        walletMini: false,
        glyphModalPack: '',
        chatbarContent: '',
      },
      replyChatbarMessage: {
        from: '',
        id: '',
        payload: '',
        chatbarFocus: false,
        fullscreen: false,
        showPinned: false,
      },
      enhancers: {
        containerWidth: 0,
        defaultHeight: '30rem',
        defaultWidth: '24rem',
        floating: false,
        position: [0, 0],
        route: 'emoji',
        show: false,
        messages: [],
        unreadMessage: 0,
        isScrollOver: false,
        showOlderMessagesInfo: false,
        isTyping: false,
        isReacted: false,
        activeChannel: undefined,
      },
      settingReaction: {
        groupID: null,
        messageID: null,
        status: false,
        hoveredGlyphInfo: undefined,
      },
      glyphMarketplaceView: {
        shopId: null,
        view: 'home',
      },
      editMessage: {
        from: '',
        id: '',
        payload: '',
        mostEmojiUsed: [],
        recentGlyphs: [],
      },
      theme: {},
      base: {
        class: '',
        name: 'default',
        text: 'Default',
        value: 'default',
      },
      flair: {
        text: 'Satellite',
        value: '#2761fd',
        filesUploadStatus: '',
        renameItem: undefined,
        filePreview: undefined,
        fileDownloadList: [],
        chatImageOverlay: undefined,
      },
      fileSort: {
        asc: true,
        category: 'modified',
      },
    }
    mutations.default.sendNotification(localizedState, {
      _id: '01g2ya7w44h4c5mm4bgyedkrvy',
      _mod: 1652432302212590600,
      at: 1652432301322,
      content: {
        description: 'New DM',
        title: 'Notification',
      },
      from: 'Andre2',
      id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
      state: 'UNREAD',
      type: 'Direct Message',
    })

    expect(localizedState.notifications).toEqual([
      // Sorted in reverse
      {
        _id: '01g2y9d6499169rzs5etrff48w',
        _mod: 1652431427721842400,
        at: 1652431426842,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
        state: 'UNREAD',
        type: 'Direct Message',
      },
      {
        _id: '01g2ya7w44h4c5mm4bgyedkrvy',
        _mod: 1652432302212590600,
        at: 1652432301322,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
        state: 'UNREAD',
        type: 'Direct Message',
      },
    ])
  })

  test('set notification', () => {
    const localizedState = {
      contextMenuStatus: false,
      showSidebar: true,
      notifications: [],
      showSearchResult: false,
      showSettings: false,

      settingsSideBar: true,
      settingsRoute: 'personalize',
      quickProfile: false,
      userProfile: {},
      contextMenuValues: [],
      contextMenuPosition: {
        x: 0,
        y: 0,
      },
      quickProfilePosition: {
        x: 0,
        y: 0,
      },
      modals: {
        callToAction: false,
        changelog: false,
        createServer: false,
        creategroup: false,
        crop: false,
        error: false,
        glyph: false,
      },
      groupInvite: {
        isOpen: false,
        marketplace: false,
        newfolder: false,
        quickchat: false,
        renameFile: false,
        userProfile: false,
        wallet: false,
        walletMini: false,
        glyphModalPack: '',
        chatbarContent: '',
      },
      replyChatbarMessage: {
        from: '',
        id: '',
        payload: '',
        chatbarFocus: false,
        fullscreen: false,
        showPinned: false,
      },
      enhancers: {
        containerWidth: 0,
        defaultHeight: '30rem',
        defaultWidth: '24rem',
        floating: false,
        position: [0, 0],
        route: 'emoji',
        show: false,
        messages: [],
        unreadMessage: 0,
        isScrollOver: false,
        showOlderMessagesInfo: false,
        isTyping: false,
        isReacted: false,
        activeChannel: undefined,
      },
      settingReaction: {
        groupID: null,
        messageID: null,
        status: false,
        hoveredGlyphInfo: undefined,
      },
      glyphMarketplaceView: {
        shopId: null,
        view: 'home',
      },
      editMessage: {
        from: '',
        id: '',
        payload: '',
        mostEmojiUsed: [],
        recentGlyphs: [],
      },
      theme: {},
      base: {
        class: '',
        name: 'default',
        text: 'Default',
        value: 'default',
      },
      flair: {
        text: 'Satellite',
        value: '#2761fd',
        filesUploadStatus: '',
        renameItem: undefined,
        filePreview: undefined,
        fileDownloadList: [],
        chatImageOverlay: undefined,
      },
      fileSort: {
        asc: true,
        category: 'modified',
      },
    }
    mutations.default.setNotifications(localizedState, [
      // Sorted in the same order
      {
        _id: '01g2y9d6499169rzs5etrff48w',
        _mod: 1652431427721842400,
        at: 1652431426842,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
        state: 'UNREAD',
        type: 'Direct Message',
      },
      {
        _id: '01g2ya7w44h4c5mm4bgyedkrvy',
        _mod: 1652432302212590600,
        at: 1652432301322,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
        state: 'UNREAD',
        type: 'Direct Message',
      },
    ])
    expect(localizedState.notifications).toEqual([
      // Sorted in the same order
      {
        _id: '01g2y9d6499169rzs5etrff48w',
        _mod: 1652431427721842400,
        at: 1652431426842,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
        state: 'UNREAD',
        type: 'Direct Message',
      },
      {
        _id: '01g2ya7w44h4c5mm4bgyedkrvy',
        _mod: 1652432302212590600,
        at: 1652432301322,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
        state: 'UNREAD',
        type: 'Direct Message',
      },
    ])
  })

  test('set all notification state to read', () => {
    // previously they are unread
    const localizedState = {
      contextMenuStatus: false,
      showSidebar: true,
      notifications: [
        {
          _id: '01g2y9d6499169rzs5etrff48w',
          _mod: 1652431427721842400,
          at: 1652431426842,
          content: { description: 'New DM', title: 'Notification' },
          from: 'Andre2',
          id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
          state: 'UNREAD',
          type: 'Direct Message',
        },
        {
          _id: '01g2ya7w44h4c5mm4bgyedkrvy',
          _mod: 1652432302212590600,
          at: 1652432301322,
          content: { description: 'New DM', title: 'Notification' },
          from: 'Andre2',
          id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
          state: 'UNREAD',
          type: 'Direct Message',
        },
      ],
      showSearchResult: false,
      showSettings: false,

      settingsSideBar: true,
      settingsRoute: 'personalize',
      quickProfile: false,
      userProfile: {},
      contextMenuValues: [],
      contextMenuPosition: {
        x: 0,
        y: 0,
      },
      quickProfilePosition: {
        x: 0,
        y: 0,
      },
      modals: {
        callToAction: false,
        changelog: false,
        createServer: false,
        creategroup: false,
        crop: false,
        error: false,
        glyph: false,
      },
      groupInvite: {
        isOpen: false,
        marketplace: false,
        newfolder: false,
        quickchat: false,
        renameFile: false,
        userProfile: false,
        wallet: false,
        walletMini: false,
        glyphModalPack: '',
        chatbarContent: '',
      },
      replyChatbarMessage: {
        from: '',
        id: '',
        payload: '',
        chatbarFocus: false,
        fullscreen: false,
        showPinned: false,
      },
      enhancers: {
        containerWidth: 0,
        defaultHeight: '30rem',
        defaultWidth: '24rem',
        floating: false,
        position: [0, 0],
        route: 'emoji',
        show: false,
        messages: [],
        unreadMessage: 0,
        isScrollOver: false,
        showOlderMessagesInfo: false,
        isTyping: false,
        isReacted: false,
        activeChannel: undefined,
      },
      settingReaction: {
        groupID: null,
        messageID: null,
        status: false,
        hoveredGlyphInfo: undefined,
      },
      glyphMarketplaceView: {
        shopId: null,
        view: 'home',
      },
      editMessage: {
        from: '',
        id: '',
        payload: '',
        mostEmojiUsed: [],
        recentGlyphs: [],
      },
      theme: {},
      base: {
        class: '',
        name: 'default',
        text: 'Default',
        value: 'default',
      },
      flair: {
        text: 'Satellite',
        value: '#2761fd',
        filesUploadStatus: '',
        renameItem: undefined,
        filePreview: undefined,
        fileDownloadList: [],
        chatImageOverlay: undefined,
      },
      fileSort: {
        asc: true,
        category: 'modified',
      },
    }
    mutations.default.clearAllNotifications(localizedState)
    expect(localizedState.notifications).toEqual([
      {
        _id: '01g2y9d6499169rzs5etrff48w',
        _mod: 1652431427721842400,
        at: 1652431426842,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
        state: 'READ',
        type: 'Direct Message',
      },
      {
        _id: '01g2ya7w44h4c5mm4bgyedkrvy',
        _mod: 1652432302212590600,
        at: 1652432301322,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
        state: 'READ',
        type: 'Direct Message',
      },
    ])
  })

  test('update group notifications', () => {
    // previously they are unread
    const localizedState = {
      contextMenuStatus: false,
      showSidebar: true,
      notifications: [
        {
          _id: '01g2y9d6499169rzs5etrff48w',
          _mod: 1652431427721842400,
          at: 1652431426842,
          content: { description: 'New DM', title: 'Notification' },
          from: 'Andre2',
          id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
          state: 'UNREAD',
          type: 'Direct Message',
        },
        {
          _id: '01g2ya7w44h4c5mm4bgyedkrvy',
          _mod: 1652432302212590600,
          at: 1652432301322,
          content: { description: 'New DM', title: 'Notification' },
          from: 'Andre2',
          id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
          state: 'UNREAD',
          type: 'Group Message',
        },
      ],
      showSearchResult: false,
      showSettings: false,

      settingsSideBar: true,
      settingsRoute: 'personalize',
      quickProfile: false,
      userProfile: {},
      contextMenuValues: [],
      contextMenuPosition: {
        x: 0,
        y: 0,
      },
      quickProfilePosition: {
        x: 0,
        y: 0,
      },
      modals: {
        callToAction: false,
        changelog: false,
        createServer: false,
        creategroup: false,
        crop: false,
        error: false,
        glyph: false,
      },
      groupInvite: {
        isOpen: false,
        marketplace: false,
        newfolder: false,
        quickchat: false,
        renameFile: false,
        userProfile: false,
        wallet: false,
        walletMini: false,
        glyphModalPack: '',
        chatbarContent: '',
      },
      replyChatbarMessage: {
        from: '',
        id: '',
        payload: '',
        chatbarFocus: false,
        fullscreen: false,
        showPinned: false,
      },
      enhancers: {
        containerWidth: 0,
        defaultHeight: '30rem',
        defaultWidth: '24rem',
        floating: false,
        position: [0, 0],
        route: 'emoji',
        show: false,
        messages: [],
        unreadMessage: 0,
        isScrollOver: false,
        showOlderMessagesInfo: false,
        isTyping: false,
        isReacted: false,
        activeChannel: undefined,
      },
      settingReaction: {
        groupID: null,
        messageID: null,
        status: false,
        hoveredGlyphInfo: undefined,
      },
      glyphMarketplaceView: {
        shopId: null,
        view: 'home',
      },
      editMessage: {
        from: '',
        id: '',
        payload: '',
        mostEmojiUsed: [],
        recentGlyphs: [],
      },
      theme: {},
      base: {
        class: '',
        name: 'default',
        text: 'Default',
        value: 'default',
      },
      flair: {
        text: 'Satellite',
        value: '#2761fd',
        filesUploadStatus: '',
        renameItem: undefined,
        filePreview: undefined,
        fileDownloadList: [],
        chatImageOverlay: undefined,
      },
      fileSort: {
        asc: true,
        category: 'modified',
      },
    }
    mutations.default.updateGroupNotifications(localizedState)
    expect(localizedState.notifications).toEqual([
      {
        _id: '01g2y9d6499169rzs5etrff48w',
        _mod: 1652431427721842400,
        at: 1652431426842,
        content: {
          description: 'New DM',
          title: 'Notification',
        },
        from: 'Andre2',
        id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
        state: 'UNREAD',
        type: 'Direct Message',
      },
    ])
  })

  test('remove specified notification', () => {
    // previously they are unread
    const localizedState = {
      contextMenuStatus: false,
      showSidebar: true,
      notifications: [
        {
          _id: '01g2y9d6499169rzs5etrff48w',
          _mod: 1652431427721842400,
          at: 1652431426842,
          content: { description: 'New DM', title: 'Notification' },
          from: 'Andre2',
          id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
          state: 'UNREAD',
          type: 'Direct Message',
        },
        {
          _id: '01g2ya7w44h4c5mm4bgyedkrvy',
          _mod: 1652432302212590600,
          at: 1652432301322,
          content: { description: 'New DM', title: 'Notification' },
          from: 'Andre2',
          id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
          state: 'UNREAD',
          type: 'Direct Message',
        },
      ],
      showSearchResult: false,
      showSettings: false,

      settingsSideBar: true,
      settingsRoute: 'personalize',
      quickProfile: false,
      userProfile: {},
      contextMenuValues: [],
      contextMenuPosition: {
        x: 0,
        y: 0,
      },
      quickProfilePosition: {
        x: 0,
        y: 0,
      },
      modals: {
        callToAction: false,
        changelog: false,
        createServer: false,
        creategroup: false,
        crop: false,
        error: false,
        glyph: false,
      },
      groupInvite: {
        isOpen: false,
        marketplace: false,
        newfolder: false,
        quickchat: false,
        renameFile: false,
        userProfile: false,
        wallet: false,
        walletMini: false,
        glyphModalPack: '',
        chatbarContent: '',
      },
      replyChatbarMessage: {
        from: '',
        id: '',
        payload: '',
        chatbarFocus: false,
        fullscreen: false,
        showPinned: false,
      },
      enhancers: {
        containerWidth: 0,
        defaultHeight: '30rem',
        defaultWidth: '24rem',
        floating: false,
        position: [0, 0],
        route: 'emoji',
        show: false,
        messages: [],
        unreadMessage: 0,
        isScrollOver: false,
        showOlderMessagesInfo: false,
        isTyping: false,
        isReacted: false,
        activeChannel: undefined,
      },
      settingReaction: {
        groupID: null,
        messageID: null,
        status: false,
        hoveredGlyphInfo: undefined,
      },
      glyphMarketplaceView: {
        shopId: null,
        view: 'home',
      },
      editMessage: {
        from: '',
        id: '',
        payload: '',
        mostEmojiUsed: [],
        recentGlyphs: [],
      },
      theme: {},
      base: {
        class: '',
        name: 'default',
        text: 'Default',
        value: 'default',
      },
      flair: {
        text: 'Satellite',
        value: '#2761fd',
        filesUploadStatus: '',
        renameItem: undefined,
        filePreview: undefined,
        fileDownloadList: [],
        chatImageOverlay: undefined,
      },
      fileSort: {
        asc: true,
        category: 'modified',
      },
    }
    mutations.default.removeNotification(
      localizedState,
      '62fceb8d-60a5-4434-92e8-c07f52f9e8e6', // Using id, not _id.
    )
    expect(localizedState.notifications).toEqual([
      {
        _id: '01g2y9d6499169rzs5etrff48w',
        _mod: 1652431427721842400,
        at: 1652431426842,
        content: { description: 'New DM', title: 'Notification' },
        from: 'Andre2',
        id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
        state: 'UNREAD',
        type: 'Direct Message',
      }, // Just one
    ])
  })

  test('get notification that have been read (notificationSeen)', () => {
    const localizedState = {
      contextMenuStatus: false,
      showSidebar: true,
      notifications: [
        {
          _id: '01g2y9d6499169rzs5etrff48w',
          _mod: 1652431427721842400,
          at: 1652431426842,
          content: { description: 'New DM', title: 'Notification' },
          from: 'Andre2',
          id: '69c1ad1d-37e9-4ff5-b929-de5509512a11',
          state: 'UNREAD',
          type: 'Direct Message',
        },
        {
          _id: '01g2ya7w44h4c5mm4bgyedkrvy',
          _mod: 1652432302212590600,
          at: 1652432301322,
          content: { description: 'New DM', title: 'Notification' },
          from: 'Andre2',
          id: '62fceb8d-60a5-4434-92e8-c07f52f9e8e6',
          state: 'UNREAD',
          type: 'Direct Message',
        },
      ],
      showSearchResult: false,
      showSettings: false,

      settingsSideBar: true,
      settingsRoute: 'personalize',
      quickProfile: false,
      userProfile: {},
      contextMenuValues: [],
      contextMenuPosition: {
        x: 0,
        y: 0,
      },
      quickProfilePosition: {
        x: 0,
        y: 0,
      },
      modals: {
        callToAction: false,
        changelog: false,
        createServer: false,
        creategroup: false,
        crop: false,
        error: false,
        glyph: false,
      },
      groupInvite: {
        isOpen: false,
        marketplace: false,
        newfolder: false,
        quickchat: false,
        renameFile: false,
        userProfile: false,
        wallet: false,
        walletMini: false,
        glyphModalPack: '',
        chatbarContent: '',
      },
      replyChatbarMessage: undefined,
      enhancers: {
        containerWidth: 0,
        defaultHeight: '30rem',
        defaultWidth: '24rem',
        floating: false,
        position: [0, 0],
        route: 'emoji',
        show: false,
        messages: [],
        unreadMessage: 0,
        isScrollOver: false,
        showOlderMessagesInfo: false,
        isTyping: false,
        isReacted: false,
        activeChannel: undefined,
      },
      settingReaction: {
        groupID: null,
        messageID: null,
        status: false,
        hoveredGlyphInfo: undefined,
      },
      glyphMarketplaceView: {
        shopId: null,
        view: 'home',
      },
      editMessage: {
        from: '',
        id: '',
        payload: '',
        mostEmojiUsed: [],
        recentGlyphs: [],
      },
      theme: {},
      base: {
        class: '',
        name: 'default',
        text: 'Default',
        value: 'default',
      },
      flair: {
        text: 'Satellite',
        value: '#2761fd',
        filesUploadStatus: '',
        renameItem: undefined,
        filePreview: undefined,
        fileDownloadList: [],
        chatImageOverlay: undefined,
      },
      fileSort: {
        asc: true,
        category: 'modified',
      },
    }
  })
})
