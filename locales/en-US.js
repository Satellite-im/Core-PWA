export default {
  coming_soon: {
    communities: 'Communities\nComing Soon',
    send_money: 'Send Money\nComing Soon',
    alerts: 'Alerts\nComing Soon',
    marketplace: 'Marketplace\nComing Soon',
    wallet: 'Wallet\nComing Soon',
    archived: 'Archived Messages\nComing Soon',
    group_call: 'Group Call\nComing Soon',
    sidebar_search: 'Friends and Group Search\nComing Soon',
    group_chat_search: 'Group Chat Search\nComing Soon',
  },
  global: {
    name: 'Satellite.im',
    encrypted: 'Encrypted',
    unencrypted: 'Unencrypted',
    upload: 'Upload',
    upload_files: 'Upload Files',
  },
  ui: {
    talk: 'Speak Freely...',
    close: 'Close',
    cancel: 'Cancel',
    clear_all: 'Clear All',
    search: 'Search',
    home: 'Home',
    copied: 'ATTN: Copied to clipboard.',
    send: 'Send',
    emotes: 'Emoji',
    glyphs: 'Glyphs',
    fullscreen: 'Fullscreen',
    exit_fullscreen: 'Exit fullscreen',
    more: 'More',
    live: 'Live',
    edited: 'edited',
    online: 'All users are offline | {name} is online | {name} are online',
    offline: '{name} is not connected',
  },
  wallet: {
    wallet: 'Wallet',
    send_money: 'Send Money',
    recent_transactions: 'Recent Transactions',
    accounts: {
      linked_accounts: 'Linked Accounts',
      link_new_account_or_device: 'Link New Account / Device',
      require_pin_auth: 'Require Pin Auth?',
      security_suggestion:
        'This is suggested for all users to increase financial security',
    },
    balance: {
      balance: 'Balance',
      add_funds: 'Add Funds',
      cash_out: 'Cash Out',
    },
    mini_wallet: {
      details: 'Details',
      send_money: 'Send Money',
      request_money: 'Request Money',
      to: 'To: ',
      from: 'From: ',
      amount: 'Amount: ',
      currency: 'Currency: ',
      txid: 'TXID: ',
    },
  },
  messaging: {
    messages: 'Messages',
    groups: 'Groups',
    pin: 'Pin',
    reply: 'Reply',
    typing: '{user} is typing | {user} are typing',
    new_messages: 'New Messages',
    say_hi: 'Say hi! 👋',
    user_sent: {
      me: 'you sent a {msgType}',
      user: '{user} sent you a {msgType}',
    },
    user_sent_something: {
      me: 'you sent something',
      user: 'user sent you something',
    },
    user_sent_group_message: {
      user: '{user} posted in {group}',
    },
    pinned: {
      archived_messages: 'Archived Messages',
      new: 'New',
      old: 'Old',
      files: 'Files',
    },
    edit: {
      escape_to: 'escape to',
      cancel: 'cancel',
      enter_to: 'enter to',
      save: 'save',
    },
  },
  controls: {
    copy_id: 'Copy ID',
    share_link: 'Share Link',
    download: 'Download',
    mic: 'Mic',
    headphones: 'Audio',
    video: 'Video',
    hang_up: 'Hang Up',
    call: 'Call',
    screen: 'Share Screen',
    stop_streaming: 'Stop Streaming',
    mute: 'Mute',
    unmute: 'Unmute',
    toggle: 'Toggle',
    deafen: 'Deafen',
    undeafen: 'Undeafen',
    turn_off_camera: 'Turn Off Camera',
    turn_on_camera: 'Turn On Camera',
    crop: 'Crop',
    edit: 'Edit\nComing Soon',
    end_stream: 'End Stream',
    not_connected: 'Offline calling unavailable',
    not_available: 'Not available yet',
  },
  popups: {
    error: {
      text: 'Text',
      title: 'Error',
      user_agent: 'User Agent',
      source: 'Source',
      line: 'Line',
      confirm: 'Confirm',
      contact:
        'Oops! Something went wrong! Help us improve your experience by sending an error report',
    },
    error_network: {
      title: 'Oops! Please Stand By',
      subtitle:
        "We're currently in our Alpha stage and working hard on connecting you to a satellite. It looks like we're having some technical issues at the moment. Please re-enter your pin to connect or try again later.",
      action: 'Try Again',
    },
  },
  files: {
    files: 'Files',
    view_original: 'View Original',
  },
  pages: {
    files: {
      refresh: 'Refresh',
      file_type: 'File Type',
      empty: 'Current directory is empty',
      add_favorite: 'Added to favorites',
      remove_favorite: 'Removed from favorites',
      link_copied: 'Link copied to clipboard',
      item_count: '0 items | 1 item | {count} items',
      status: {
        prepare: 'Preparing files for upload',
        upload: 'Uploading {0}',
        delete: 'Deleting {0}',
        index: 'Updating remote index',
      },
      controls: {
        new_file: 'New File',
        name_folder: 'Name Folder...',
      },
      browse: {
        files: 'Files',
        search: 'Search...',
        name: 'Name',
        modified: 'Modified',
        type: 'Type',
        encrypted: 'Encrypted',
        size: 'Size',
      },
      aside: {
        free_tier: 'Free Tier',
        upgrade: 'Upgrade',
        quick_access: 'Quick Access',
        default: 'Default',
        recent: 'Recent',
        deleted: 'Deleted',
        favorited: 'Favorited',
        shared_items: 'Shared Items',
        shared_folders: 'Shared Folders',
        links: 'Links',
        coming_soon: 'Coming soon',
      },
      upload: {
        close: 'Close',
        scanning_image: 'Scanning Image...',
        send: 'Send',
        cancel: 'Cancel',
      },
      errors: {
        no_empty: 'Item name must be a non empty string',
        leading_dot: 'Item name cannot begin with .',
        invalid: 'Item name cannot contain invalid symbols',
        file_size: 'File needs to have a size of 1 byte or greater',
        duplicate_name: 'Item with name already exists in this directory',
        storage_limit: 'This upload would exceed your storage limit',
        dir_paradox: 'Directory cannot contain itself',
        dir_parent_paradox: 'Directory cannot contain one of its ancestors',
        in_progress: 'Upload already in progress, try again later',
        enable_consent:
          'Please consent to file scanning in your privacy settings',
        lost: 'Cannot find file, please try again later',
      },
    },
    unlock: {
      decrypt: 'Decrypt Account',
      create: 'Create Account Pin',
      placeholder: 'Enter Pin...',
      store_pin: 'Store Pin? (Less Secure)',
      delete_account_label: 'Not you? Create or import an account',
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
    inputAccount: {
      title: 'Import Account',
      subtitle:
        'Enter your 12 word passphrase in exactly the same order your recovery seed was generated.',
      enter: 'Enter Passphrase',
      recover: 'Recover Account',
    },
    phrase: {
      title: 'Recovery Seed',
      done: 'I Saved It',
      write_down:
        'Write this down in the order that they appear here. Having the correct order is very important when you are recovering your account.',
    },
    privacy: {
      title: 'Privacy Settings',
      subtitle:
        'Choose which features to enable to best suit your privacy preferences.',
      serverType: {
        title: 'Signaling Servers',
        subtitle:
          "Choose which signaling server group you want to use. If you use 'Satellite + Public Signaling Servers', you are using public servers and Satellite hosted servers to connect with your friends. We do not track connections. We only track server utilization (memory and CPU usage) to know if we need to turn on more signaling servers. If you opt to use 'Only Public Signaling Servers', those are totally outside of Satellite control, so we can not see or have any insight into their operation, logging, or data sharing practices, and you may experience difficulties connecting with friends if the signaling servers are overloaded.",
      },
      consentScan: {
        title: 'Consent to File Scanning',
        subtitle:
          'In order to share files/use the encrypted file storage I consent to have the hash of my files compared against the Microsoft PhotoDNA service to help prevent the spread of sexual abuse material.',
      },
      nsfw: {
        title: 'Block NSFW content',
        subtitle: 'If selected, NSFW content will be obscured.',
      },
      ownInfo: {
        title: 'Set my own Signaling Server',
        subtitle:
          'Enter your http, udp, or websocket URL for your signaling server here',
        placeholder: 'Please enter ...',
        lengthErrorMsg: 'URL Too long, please limit to 2048 characters',
        formatErrorMsg:
          'Invalid input format. Please add on the following format',
        errorSampleUrl1: '- http://localhost:3000',
        errorSampleUrl2: '- wss://www.example.com/socketserver',
        satelliteServer: 'Satellite + Public Signaling Servers',
        publicServer: 'Only Public Signaling Servers',
        userDefinedServer: 'Set my own',
      },
      register: {
        title: 'Register Username Publicly',
        subtitle:
          'Publicly associate your account ID with a human readable username. Anyone can see this association.',
      },
      pin: {
        title: 'Store Account Pin',
        subtitle:
          "Store your account pin locally so you don't have to enter it manually every time. This is not recommended.",
      },
      activity: {
        title: 'Display Current Activity',
        subtitle:
          "Allow Satellite to see what games you're playing and show them off on your profile so friends can jump in.",
      },
      embeds: {
        title: 'Enable External Embeds',
        subtitle:
          'Allow Satellite to fetch data from external sites to expand links like Spotify, YouTube, and more.',
      },
      updating: 'Updating remote settings',
    },
    settings: {
      settings: 'Settings',
      motion: 'Motion',
      never: 'Never',
      always: 'Always',
      aspect_ratio_label: 'Aspect Ratio Off?',
      app_info: 'Application Info',
      info: {
        title: 'Application Info',
        subtitle:
          'Below is information that may be helpful to you when creating bug reports or developing on our application.',
      },
      changelog: 'Changelog',
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
        sounds: {
          title: 'Sounds',
          message: 'Message',
          call: 'Call',
          hangup: 'Hang Up',
          mute: 'Mute',
          unmute: 'Unmute',
          deafen: 'Deafen',
          undeafen: 'Undeafen',
          upload: 'Upload',
          connected: 'Connected',
        },
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
        systemVolume: {
          title: 'System Volume',
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
        flipVideo: {
          title: 'Mirror Video',
          subtitle: 'Gaze upon your reflection with mirrored video enabled.',
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
        clear: 'Clear',
        save: 'Save',
        cancel: 'Cancel',
        reset_all: 'Reset All Keybinds',
        singleHotkeyError: 'Single key already exist',
        systemHotkeyError:
          'That is browser/system shortcut. Please input other keys.',
        existHotkeyError: 'Key already bound',
        modifierHotkeyError:
          'Modifiers (Shift, Tab, Option, etc.) Must come before alphanumerics',
        editHotkeyError: 'Character Not Allowed',
      },
      accounts: {
        title: 'Accounts & Devices',
        subtitle:
          "Select which account you'd prefer to default transactions from.",
        active: 'Active Account',
        gas_price: 'Transaction Fee Limit',
        devices: 'Connected Devices',
        no_devices: 'No connected devices found.',
        no_status: 'No status set.',
        reveal_phrase: 'Reveal Phrase',
        hide_phrase: 'Hide Phrase',
        copy_phrase: 'Copy Phrase',
      },
      personalize: {
        flair: 'Flair',
        title: 'Personalize Satellite',
        subtitle: 'Make it your own and choose custom colors & themes.',
        theme: 'Color Theme',
        language: 'Language',
      },
      realms: {
        title: 'Realms',
        subtitle:
          "Change the realm Satellite lives in. Changing a realm will mean you can only communicate with others in the same realm as you. Please only change if you know what you're doing.",
        chain: 'Realm',
      },
      network: {
        title: 'Network',
        subtitle:
          "Change network options, please note that switching from 'Testnet' to 'Mainnet' can trigger errors and additional charges during the alpha period.",
        network: 'Network',
        allow_embeds: 'Allow Embeds',
        allow_embeds_description:
          'Have Satellite try to load videos and link previews. This sends a request to the URL someone shares with you to get more information/to embed the content from the source and may allow the site to track you.',
      },
      storage: {
        title: 'Storage',
        subtitle:
          'Control how your data is stored. You can export your local storage information (coming soon) as well as reset Satellite here. Be careful resetting your local storage will clear out your account.',
        clear: {
          title: 'Clear Storage',
          subtitle:
            'Reset Satellite. This will clear any saved accounts. Do not do this without backing up your account first.',
          subtitle_warning1: 'Are you absolutely sure?',
          subtitle_warning2:
            'If you do not have your recovery seed your account will be gone forever.',
          button: 'Clear Local Storage',
          confirm_button: 'Yes, Really, Clear Local Storage',
          message: 'Local storage cleared successfully',
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
            'Below is a list of helpful information regarding your account.',
          accountID: 'Account Identifier',
          badges: 'Badges',
          preferences: 'Preferences',
          location: 'Location',
          selectLocation: 'Select Location',
          timezone: 'Timezone',
          language: 'Language',
          selectLanguage: 'Select Language',
          noResult: 'No elements found',
        },
        phrase: {
          title: 'Recovery Phrase',
          subtitle:
            'Do not share this phrase with anyone. This phrase is used to recover your account. Anyone with access to this has access to your account.',
        },
      },
    },
    chat: {
      alerts: 'Alerts',
      archived_messages: 'Archived Messages',
      add_channel: 'Add Channel',
      group_invite: 'Invite new member',
      group_invite_description:
        'Select one of your friends to add them to the group',
      new_message: 'messages',
      jump_to_current: 'View New Messages',
      chat_now: 'chat now',
      add_member: 'Add Member +',
      switch_chat: 'Switch Chat',
      start_watch_party: 'Watch Party',
      new_chat: 'New Chat',
      new_chat_description:
        'Select one or more of your friends to chat in groups, or one-on-one.',
      no_friends_yet: 'No Friends Yet',
      no_friends_yet_text: "The world doesn't have to be so lonely.",
      enhancers: {
        glyphs: 'Glyphs',
        emoji: 'Emoji',
        gifs: 'Gifs',
        search: 'Search...',
      },
      new_group: 'New Group',
      new_group_name: 'Add a group name here...',
      older_messages: 'You are viewing older messages',
      recent_messages: 'Go to most recent messages',
      infinite_scroll: {
        loading: 'Loading messages ...',
        no_more: 'No more data.',
      },
    },
    newMessage: {
      new_message: 'New Message',
    },
  },
  servers: {
    new_server: 'New Community',
    create: {
      heading: 'Create a server',
      photo_text:
        "Give your server a face. Choose a memorable photo to show it's members.",
      photo_button: 'Set photo',
      server_name: 'Enter a server name',
      server_name_placeholder: 'Server name...',
      create_server: 'Create server',
      select_friends: 'Invite your friends to this server',
      server_name_error: 'Server name must be at least 5 characters.',
      select_friends_placeholder: 'Search friends...',
      user_picker_empty: 'No friends found',
    },
  },
  conversation: {
    encrypted: 'Messages are secured by end to end encryption.',
    reply: 'reply | replies',
    reply_to: 'Reply to',
    multimedia: 'Multimedia content',
    collapse: 'Collapse',
    replies_separator: ' and ',
    reply_single: 'Reply from {name}',
    repliers_less_than_limit: 'Replies from {names}',
    repliers_more_than_limit: 'Replies from {names} and {leftCount} more ...',
  },
  errors: {
    accounts: {
      pin_too_short: 'Pin must be at least 5 characters.',
      invalid_pin: 'Pin does not match',
      invalid_group_id: 'GroupID is invalid',
      cannot_find_group: 'Cannot find chosen group',
      user_derivation_failed:
        'We were unable to verify your passphrase. Please check it and try again.',
      mnemonic_not_present: 'Problem with passphrase, please try again.',
      file_too_large:
        'File is too large, please upload a file smaller than 8MB.',
      invalid_file: 'Please upload a valid image type such as JPG, PNG or SVG',
    },
    friends: {
      request_already_sent: 'You have already sent a request to this user',
      request_already_accepted: 'This user is already in your friends',
      request_not_found: 'User not found',
      friend_info_not_found: 'Seems that this user is not registered',
      textile_not_initialized: 'Your account is not ready. Try later',
      friend_not_removed: 'Could not remove friend',
    },
    chat: {
      drop_file_count: 'Sorry, you can only upload 8 files at a time',
      unable_preview: 'Unable to preview file',
      upload_blocked: 'Upload Blocked',
      contains_nsfw: 'Unable to upload file/s due to NSFW status',
      empty_message_error:
        'Message must contain at least one non-space character',
      failed_load: 'Image failed to load',
      group_name:
        'Enter a group name of at least {min} characters, up to {max}',
    },
    textile: {
      friend_not_found: 'Friend not found',
      mailbox_manager_not_found: 'Mailbox manager not found',
      mailbox_manager_not_initialized: 'Mailbox manager not initialized',
      bucket_not_initialized: 'Bucket not initialized',
    },
    storage: {
      database_not_cleared: 'Could not clear database',
    },
    webRTC: {
      permission_denied:
        'Permission denied, please check your browser settings.',
    },
  },
  search: {
    search: 'Search... ',
    input: {
      search_options: 'SEARCH OPTIONS',
      search_for: 'SEARCH FOR',
    },
    result: {
      search_results: 'Search results',
      more_filters: 'More filters',
      one_result: '1 Result',
      one_page: '{0} Results',
      multi_page: '{pageStart}-{pageEnd} of ({total}) Results',
      one_result_last_page: '{resultNum} of ({total}) Results',
      users: 'Users',
      conversations: 'Conversations',
      select_date: 'Select Date',
      today: 'today',
      yesterday: 'yesterday',
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
      username_error:
        'Enter a username of at least {min} characters, up to {max}',
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
    friends: 'Friends',
    self_add: "You can't add yourself you silly goose.",
    already_friend: "You're already friends with this user.",
    not_found: "Hmm, we couldn't find a user at that address",
    invalid_id: 'Invalid account ID',
    request_sent: 'Friend request successfully sent!',
    requests: 'Friend requests',
    incoming: 'Requests',
    received: 'Received',
    sent: 'Sent',
    no_friend_request: 'You have no new friend requests.',
    outgoing: 'Outgoing requests',
    blocked_friends: 'Blocked friends',
    blocked: 'Blocked',
    no_blocked: 'You have no blocked users, yay!',
    search_placeholder: 'Search friends...',
    add: 'Add Friend',
    add_description:
      "Enter your friend's account ID or nickname. Account IDs are case sensitive.",
    add_via_qr: 'Add Via QR',
    add_qrcode_description:
      'You can also add a friend by having them scan your QR code, or by scanning theirs.',
    scan_code: 'Scan a Friend Code',
    camera_scan: 'Allow Camera Scan',
    friend_code: 'Your Friend Code',
    accept: 'Accept',
    decline: 'Decline',
    unblock: 'Unblock',
    send: 'Send',
    message: 'Message',
    options: 'Options',
    cancel: 'Cancel request',
    details: {
      now: 'now',
      yesterday: 'yesterday',
      days_short: 'd',
      no_message: 'no message',
    },
  },
  market_place: {
    title: 'Marketplace\nComing soon',
    glyphs: 'Glyphs',
    themes: 'Themes',
    nfts: 'NFTs',
  },
  glyphs: {
    view_pack: 'View Glyph Pack',
    back: 'Back',
    new: 'New',
    sale: 'Sale',
    shop_all: 'Shop All Glyphs',
    shop_now: 'Shop Now',
    trending: 'Trending',
    try: 'Try using some glyphs',
  },
  alerts: {
    caught_up: "You're all caught up!",
  },
  modal: {
    update_modal: {
      update_required:
        "This update requires a refresh of the Alpha application. Click 'Update Now' below to start fresh on the new update.",
      got_it: 'Got It!',
    },
    profile: {
      about: {
        tab: 'About',
        me: 'About Me',
        location: 'Location',
        add_note: 'Add Note',
        click_note: 'Click to add note',
      },
      accounts: 'Accounts',
      activity: {
        tab: 'Activity',
        spotify: 'Listening to Spotify',
        currently: 'Currently Playing',
      },
      mutual: {
        tab: 'Mutual',
        servers: 'Servers',
        friends: 'Friends',
      },
    },
    call_to_action: {
      title: 'Coming Soon',
      subtitle: 'Stay tuned for these upcoming features:',
      item1: 'Watch Parties',
      item2: 'Servers',
      item3: 'Community Servers Core',
      item4: 'Community Servers File Sharing',
      item5: 'Community Servers Voice, Video, Screen Sharing, and more',
      description: `We're currently in our Alpha stage and working hard on building more features. Follow us on social media for updates on our launch.`,
      btn: 'Keep Me Posted',
    },
    rename: 'Rename',
  },
  context: {
    // files
    fav: 'Favorite',
    unfav: 'Unfavorite',
    share: 'Share',
    unshare: 'Unshare',
    rename: 'Rename',
    delete: 'Delete',
    // friends
    send: 'Send Message',
    voice: 'Start Call',
    video: 'Video Call',
    remove: 'Remove Friend',
    profile: 'Profile',
    // message
    edit: 'Edit Message',
    reaction: 'Add Reaction',
    reply: 'Reply',
    copy_msg: 'Copy Message',
    copy_img: 'Copy Image',
    save_img: 'Save Image',
    copy_link: 'Copy Link',
  },
}
