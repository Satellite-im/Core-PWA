// plugins/notifications.ts

import Vue from 'vue'

import { Notifications } from '~/libraries/ui/Notifications'

Vue.prototype.$notifications = new Notifications()
