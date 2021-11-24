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
    emotes: 'Emoji',
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
    edit: 'Edit',
    pin: 'Pin',
    send: 'Send',
    more: 'More',
    always: 'Always',
    motion: 'Motion',
    never: 'Never',
    aspect_ratio_label: 'Aspect Ratio Off?',
  },
  wallet: {
    send_money: 'Send Money',
  },
  controls: {
    mic: 'Mic',
    headphones: 'Audio',
    video: 'Video',
  },
  popups: {
    error: {
      text: 'Text',
      title: 'Error',
      user_agent: 'User Agent',
      source: 'Source',
      line: 'Line',
      confirm: 'Confirm',
      contact: "'Oops! Something went wrong! Help us improve your experience by sending an error report'"
    },
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
        "We're going to create an account for you. On the next screen, you'll see a set of words. Screenshot this or write it down. This is the only way to backup your account.",
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
          'Notifications work different on every platform. On Web, you need to request notifications. On Desktop and Android notifications are enabled by default.',
        enabled: 'Enable or Disable Notifications',
        labels: {
          current_platform: 'Your current platform is:',
        },
        web: {
          granted:
            'In the web version of Satellite, you need to disable notifications in your browser for this site.',
          denied:
            "We cannot re-prompt you for notification permission in the web version of Satellite. You need to set notifications for this site to 'ask' or 'allow'",
        },
        send_label: 'Send Notification',
        send_placeholder: 'Content you want to appear in local notification',
      },
      audio: {
        title: 'Audio',
        sources: {
          title: 'Audio Sources',
          subtitle: 'Input and Output devices you want Satellite to use.',
          permissionButtonText: 'Request Permission',
          permissionRequestMessage: '',
          permissionDeniedMessage:
            "You have denied microphone access so we can't see what devices you have. Please allow microphone access in your browser.",
          browserDoesNotSupportAudioOutChange:
            'Your Browser does not allow setting audio out, so the default is used here. To change this, use a chrome based browser or update your default audio out in your OS.',
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
      video: {
        title: 'Video',
        sources: {
          permissionDeniedMessage:
            "You have denied camera access so we can't see what devices you have. Please allow camera access in your browser.",
          input: {
            title: 'Video Input',
            subtitle:
              "Select which video device you'd like to share your beautiful smile from.",
          },
        },
      },
      screen: {
        title: 'Screen Share',
        captureMouse: {
          title: 'Capture Mouse',
          subtitle: 'Would you like to share your mouse in screen shares?',
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
        subtitle: 'Make it your own and choose custom colors & themes.',
        theme: 'Color Theme',
        language: 'Language',
      },
      network: {
        title: 'Realms',
        subtitle:
          "Change the realm Satellite lives in. Changing a realm will mean you can only communicate with others in the same realm as you. Please only change if you know what you're doing.",
        chain: 'Realm',
        network: 'Network',
        allow_embeds: 'Allow Embeds',
        allow_embeds_description:
          'Have Satellite try to load videos and link previews. This sends a request to the URL someone shares with you to get more information/embed the content from the source and may allow the site to track you.',
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
      chat_now: 'chat now',
      add_member: 'Add Member +',
      switch_chat: 'Switch Chat',
      start_watch_party: 'Watch Party',
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
    friends: {
      request_already_sent: 'You have already sent a request to this user',
      request_already_accepted: 'This user is already in your friends',
      friend_info_not_found: 'Seems that this user is not registered',
      textile_not_initialized: 'Your account is not ready. Try later',
    },
    chat: {
      drop_file_count: 'Sorry, you can only upload 4 files at a time',
      unable_preview: 'Unable to preview file',
      upload_blocked: 'Upload Blocked'
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
        'Customize how the world sees you, choose something memorable.',
      username: 'Username',
      username_placeholder: 'Neil Spaceman...',
      status: 'Status',
      status_placeholder: 'Ready for launch...',
      reg_status: {
        unknown: 'Not registered',
        in_progress: "We're transporting your data to the Realm...",
        funding_account: 'Making contact, requesting entry to Realm...',
        sending_transaction: 'Request Approved! Now entering the Realm...',
        registered: 'Grats! Your a brand new citizen on the Realm.',
      },
    },
    loading: {
      loading_account: 'Aligning satellites to retrieve your account...',
    },
  },
  friends: {
    self_add: "You can't add yourself you silly goose.",
    already_friend: "You're already friends with this user.",
    not_found: "Hmm, we couldn't find a user at that address",
    invalid_id: 'Invalid account ID',
    request_sent: 'Friend request successfully sent!',
    search_placeholder: 'Some User...',
    add: 'Add Friend',
    add_description:
      'Enter your friend\'s account ID or nickname. Account IDs are case sensitive.',
    add_qrcode_description:
      'You can also add a friend by having them scan your QR code, or by scanning theirs.',
    scan_code: 'Scan a Friend Code',
    camera_scan: 'Allow Camera Scan',
    friend_code: 'Your Friend Code',
  },
  market_place: {
    title: 'Marketplace',
  },
}
