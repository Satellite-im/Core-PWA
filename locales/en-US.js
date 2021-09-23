export default {
  global: {
    name: 'Satellite.im',
    settings: 'Settings',
    copied: 'ATTN: Copied to clipboard.',
    home: 'Home',
    search: 'Search',
    new_server: 'New Community',
    friends: 'Friends',
    files: 'Files',
    messages: 'Messages',
    groups: 'Groups',
    glyphs: 'Glyphs',
    cancel: 'Cancel',
    exit_fullscreen: 'Exit fullscreen',
    fullscreen: 'Fullscreen',
    upload: 'Upload',
    talk: 'Speak Freely...',
    encrypted: 'Encrypted',
    unencrypted: 'Unencrypted',
    download: 'Download',
    unpin: 'Unpin',
    share_link: 'Share Link',
    close: 'Close',
    mute: 'Mute',
    deafen: 'Deafen',
    toggle: 'Toggle',
    copy_id: 'Copy ID',
    crop: 'Crop',
    reply: 'Reply',
    more: 'More',
  },
  controls: {
    mic: 'Mic',
    headphones: 'Audio',
    video: 'Video',
  },
  pages: {
    files: {
      upload: 'Upload File',
      refresh: 'Refresh',
      new_folder: 'New Folder',
      new_folder_prompt: 'New Folder:',
      browse: {
        name: 'Name',
        modified: 'Modified',
        type: 'Type',
        encrypted: 'Encrypted',
        size: 'Size',
        upload: 'Upload File',
      },
    },
    unlock: {
      decrypt: 'Decrypt Account',
      create: 'Create Account Pin',
      placeholder: 'Enter Pin...',
      store_pin: 'Store Pin? (Less Secure)',
    },
    loading: {
      loading: 'Linking Satellites...',
    },
    disclaimer: {
      title: 'Account Creation',
      subtitle:
        "We're going to create an account for you. On the next screen you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
      create: 'Create Account',
      or: 'Or',
      import: 'Import Account',
    },
    phrase: {
      title: 'Recovery Seed',
      done: 'I Saved It',
      write_down: 'Write this down.',
    },
    settings: {
      developer: {
        title: 'Developer Settings',
        subtitle:
          'Mock data and tweak settings for testing. This page is really just for internal use.',
        identifier: 'Identifier',
      },
      notifications: {
        title: 'Notifications Settings',
        notes:
          'Notifications work different on every platform. On Web, you need to request noticications. On Desktop and Android notications are enabled by default.',
        enabled: 'Enable or Disable Notifications',
        labels: {
          current_platform: 'Your current platform is:',
        },
        web: {
          granted:
            'In the web version of Satellite, you need to disable notifications inyour browser for this site.',
          denied:
            "We cannot re-prompt you for notification permission in the web version of Satellite. You need to set notifications for this site to 'ask' or 'allow'",
        },
        send_label: 'Send Notification',
        send_placeholder: 'Content you want to appear in local notification',
      },
      audio: {
        sources: {
          title: 'Audio Sources',
          subtitle: 'Input and Output devices you want Satellite to use.',
          permissionButtonText: 'Request Permission',
          permissionRequestMessage: '',
          permissionDeniedMessage:
            "You have denied microphone access so we can't see what devices you have. Please allow microphone access in your browser.",
          browserDoesNotSupportAudioOutChange:
            'Your Browser does not allow setting an audio out, so the default is used here. To change this, use a chrome based browser or update your default audio out in your OS.',
          input: {
            title: 'Audio Input',
            subtitle:
              "Select which input device you'd like people to hear your silky smooth voice from.",
          },
          output: {
            title: 'Audio Output',
            subtitle:
              "Select the device that you'd like to deliver sound to your ear holes with.",
          },
        },
        bitrate: {
          title: 'Audio Bitrate',
          subtitle:
            'Higher bitrates will transmit better quality audio, lowering the bitrate can help with slower connection speeds.',
        },
        sampleSize: {
          title: 'Sample Size',
          subtitle:
            'A higher sample size will give you a broader dynamic range of audio. Higher samples require better connections.',
        },
        volume: {
          title: 'Output Volume',
        },
        inputVolume: {
          title: 'Input Volume',
        },
        echo: {
          title: 'Echo Cancellation',
          subtitle:
            'Enable to help cancel out some slight echo & feedback from your mic.',
        },
        noise: {
          title: 'Noise Suppression',
          subtitle: 'Enable to help hide background noise in your environment.',
        },
      },
      keybinds: {
        title: 'Default Keybinds',
        subtitle:
          'A list of the default keybinds for quickly navigating and using Satellite.',
        mute: 'Toggle Mute',
        settings: 'Open Settings',
        deafen: 'Toggle Deafen',
        call: 'Call Active Chat',
      },
      accounts: {
        title: 'Accounts & Devices',
        subtitle:
          "Select with account you'd prefer to default transactions from.",
        active: 'Active Account',
        gas_price: 'Transaction Fee Limit',
        devices: 'Connected Devices',
        no_devices: 'No connected devices found.',
      },
      personalize: {
        title: 'Personalize Satellite',
        subtitle: 'Make it your own and chose cusotm colors & themes.',
        theme: 'Color Theme',
        language: 'Language',
      },
      network: {
        title: 'Realms',
        subtitle:
          'Change the realm Satellite lives in. Changing a realm will mean you can only communicate with others in the same realm as you. Please only change if you know what you\'re doing.',
        chain: 'Realm',
        network: 'Network',
      },
      storage: {
        title: 'Storage',
        subtitle:
          'Control how your data is stored. You can export your local storage information as well as reset Satellite here. Be careful resetting your local storage will clear out your account.',
        clear: {
          title: 'Clear Storage',
          subtitle:
            'Reset Satellite. This will clear any saved accounts. Do not do this without backing up your account first.',
          button: 'Clear Local Storage',
        },
        export: {
          title: 'Export Storage',
          subtitle:
            "Export your local storage, it's your data you can do whatever you'd like with it.",
          button: 'Export Local Storage',
        },
      },
      profile: {
        title: 'Profile',
        subtitle: 'Update your profile photo, status, banners and more.',
        info: {
          title: 'Account Info',
          subtitle:
            'Below is a list of helpful information regaurding your account.',
          accountID: 'Account Identifier',
          badges: 'Badges',
          preferences: 'Preferences',
          location: 'Location',
          selectLocation: 'Select Location',
          language: 'Language',
          selectLanguage: 'Select Language',
        },
        phrase: {
          title: 'Recovery Phrase',
          subtitle:
            'Do not share this phrase with anyone. This phrase is used to recover your account. Anyone with access to this has access to your account.',
        },
      },
    },
    chat: {
      new_message: 'messages',
      jump_to_current: 'View New Messages',
    },
  },
  servers: {
    create: {
      heading: 'Create a server',
      photo_text:
        "Give your server a face. Chose a memorable photo to show it's members.",
      photo_button: 'Set photo',
      server_name: 'Enter a server name',
      server_name_placeholder: 'Server name...',
      create_server: 'Create server',
      select_friends: 'Invite your friends to this server',
      select_friends_placeholder: 'Search friends...',
    },
  },
  conversation: {
    encrypted: 'Messages are secured by end to end encryption.',
    reply: 'reply | replies',
    reply_to: 'Reply to',
    multimedia: 'Multimedia content',
    collapse: 'Collapse',
  },
  errors: {
    accounts: {
      pin_too_short: 'Pin must be at least 5 characters.',
      invalid_pin: 'Pin does not match',
    },
  },
  search: {
    input: {
      search_options: 'SEARCH OPTIONS',
      search_for: 'SEARCH FOR',
    },
    result: {
      search_results: 'Search results',
      more_filters: 'More filters',
      results: 'Results',
    },
  },
  media: {
    settings: {
      audio_quality: 'Audio Quality',
      bitrate: 'Bitrate',
      sample_size: 'Sample size',
      video_quality: 'Video Quality',
      no_options: 'No options',
      stream_options: 'Stream Options',
    },
  },
  user: {
    registration: {
      create: 'Registration',
      sign_in: 'Sign in',
      photo_text:
        'Customize how the world sees you, chose something memerable.',
      username: 'Username',
      username_placeholder: 'Neil Spaceman...',
      status: 'Status',
      status_placeholder: 'Ready for launch...',
      reg_status: {
        unknown: 'Not registered',
        in_progress: 'We\'re transporting your data to the Realm...',
        funding_account:
          'Making contact, requesting entry to Realm...',
        sending_transaction:
          'Request Approved! Now entering the Realm...',
        registered:
          'Grats! Your a brand new citizen on the Realm.',
      },
    },
    loading: {
      loading_account: 'Aligning satellites to retrieve your account...',
    },
  },
  market_place: {
    title: 'Marketplace',
  },
}
