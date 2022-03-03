<template src="./EmbeddedLinkContent.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IFrameVideoData } from './types'

export default Vue.extend({
  props: {
    data: {
      type: String,
      default: () => {},
    },
  },
  data() {
    return {
      videoLinksAsEmbeds: [] as IFrameVideoData[],
    }
  },
  computed: {
    ...mapState(['settings']),
  },
  mounted() {
    this.parseEmbeddableVideoContentFromText(this.$props.data)
  },
  methods: {
    /**
     * @method parseEmbeddableVideoContentFromText
     * @description Receive the input messages from the Message component. Messages get sent one whole message at a time as a string.
     *  Look through it for links. If there are links, and the user has the global setting embeddedLinks enabled, compare it with
     * the types of links we want to embed and if it can be embedded in vue-plyr (vimeo and youtube), put it in there. If it cannot,
     * use a regular old iframe (facebook and twitch).
     * @example mounted() { this.parseEmbeddableVideoContentFromText('hey check out this video https://www.twitch.tv/nba') }
     */
    parseEmbeddableVideoContentFromText(messagetext: string) {
      // parse incoming text for links
      const arrayOfLinks = messagetext.match(this.$Config.regex.link)

      // this.settings.embeddedLinks is the global set in the networks panel. Without this, it just shows up as a normal link
      if (arrayOfLinks && this.settings.embeddedLinks === true) {
        this.$data.videoLinksAsEmbeds = arrayOfLinks.map((link: string) => {
          /*
            Parsing Youtube links, if we need to modify the regex do it in here.
          */
          if (
            link.match(this.$Config.regex.youtube) ||
            link.match(this.$Config.regex.youtubeShort)
          ) {
            let youtubeOutSource: string = ''
            if (link.includes('youtube.com/')) {
              youtubeOutSource = `https://www.youtube.com/embed/${
                link.split('v=')[1].split('&')[0]
              }?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`
            }
            if (link.includes('youtu.be/')) {
              youtubeOutSource = `https://www.youtube.com/embed/${
                link.split('.be/')[1].split('/')[0]
              }?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`
            }
            return {
              src: youtubeOutSource,
              type: 'embed',
              ref: this.setRefId(youtubeOutSource),
            }
          }

          /*
            Parsing Vimeo links, if we need to modify the regex do it in here. Right now it parses regular links and links to videos that are in collections
          */
          if (link.match(this.$Config.regex.vimeo)) {
            // vimeo makes their video id potentially available in several different places in the url
            const videoID: string = link
              .split('/')
              [link.split('/').length - 1].split('[\\s@&.?$+-]+')[0]
            const vimeoOutSource = `https://player.vimeo.com/video/${videoID}`
            // @ts-ignore
            return {
              src: vimeoOutSource,
              type: 'embed',
              ref: this.setRefId(vimeoOutSource),
            }
          }

          if (
            link.match(this.$Config.regex.facebook) &&
            link.includes('videos')
          ) {
            // hacky workaround to make facebook embed more mobile responsive.
            let requestWidth: string = '540'
            if (this.$device.isMobile) {
              requestWidth = '300'
            }
            const facebookOutSource = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
              link.split('?')[0],
            )}&show_text=0&width=${requestWidth}`
            return {
              src: facebookOutSource,
              type: 'iframe',
              ref: this.setRefId(facebookOutSource),
              aspectRatioClass: 'iframe-container-1-1',
            }
          }

          if (link.match(this.$Config.regex.twitch)) {
            let videoId: string = ''
            // check to see if it's an individual video
            if (link.includes('/videos/')) {
              videoId = `video=${
                link.split('/videos/')[1].split('[\\s@&.?$+-]+')[0]
              }` // this splits the video id out, and strips off any tracking/url params at the end
            }
            // check to see if it's a channel
            else {
              videoId = `channel=${
                link.split('twitch.tv/')[1].split('[\\s@&.?$+-]+')[0]
              }` // this splits the channek name out, and strips off any tracking/url params at the end
            }
            return {
              src: `https://player.twitch.tv/?${videoId}&parent=${window.location.hostname}&autoplay=false`,
              type: 'iframe',
              ref: this.setRefId(
                `https://player.twitch.tv/?${videoId}&parent=${window.location.hostname}&autoplay=false`,
              ),
              aspectRatioClass: 'iframe-container-16-9',
            }
          }

          if (link.match(this.$Config.regex.spotify)) {
            // get type and id
            // https://open.spotify.com/playlist/46ffmNKBTEakwz0t625bbC?si=e878040ce04c460f => playlist/46ffmNKBTEakwz0t625bbC
            // https://open.spotify.com/track/3s2RFp5hU6jEvAmfZrnrAi?si=a9bf555ede314a19 => track/3s2RFp5hU6jEvAmfZrnrAi
            const spotifyEmbedType = link
              .split(/^https?:\/\/([a-z0-9-]+[.])spotify[.]com\//g)[2]
              .split('?')[0]

            return {
              src: `https://open.spotify.com/embed/${spotifyEmbedType}?utm_source=generator`,
              type: 'iframe',
              ref: this.setRefId(
                `https://open.spotify.com/embed/${spotifyEmbedType}?utm_source=generator`,
              ),
              aspectRatioClass: 'iframe-container-16-9',
            }
          }
          return {}
        })
      }
    },
    /**
     * @method setRefId
     * @description We need to create unique ref's so Vue can access objects by $ref. This takes the URL, encodes it
     * as a base 64 string (to get rid of the non ascii characters), and trims it to 15 characters so the ref isn't
     * super long, and we should be able to get a unique ref for each video. Base64 strings aren't unique, but it is in
     * lieu of using a third party library and it doesn't need to be unique.
     * @example this.setRefId('https://www.youtube.com/watch?v=7NUEKdObmf8')
     */
    setRefId(inURL: string) {
      const inURLEncoded: string = btoa(inURL)
      const refid: string = inURLEncoded.substring(0, 15)
      return `plyr-${refid}`
    },
    /**
     * @method resetAspectRatio
     * @description This just switches the iframe class to match one that will limit the iframe parent container to the aspect ratio clicked.
     * We can't get the size of the item we are embedded, so this is a workaround to let the user manually adjust the video on click
     * @example this.resetAspectRatio(0, 1, 1) // to set the aspect ratio of the item in the videoLinksAsEmbeds array (by index). You must create
     * a class in the less for any other aspect ratios you want to include
     */
    resetAspectRatio(indexPos: number, height: number, width: number) {
      this.videoLinksAsEmbeds[
        indexPos
      ].aspectRatioClass = `iframe-container-${height}-${width}`
    },
  },
})
</script>
<style scoped lang="less" src="./EmbeddedLinkContent.less"></style>
<style scoped lang="less">
.is-text {
  font-size: @micro-text-size;
  padding: 0;
  line-height: 0.8;
  font-family: @primary-font;
  &:extend(.font-muted);
  display: inline-block;
  text-align: left;
}
.download {
  float: right;
  font-family: @primary-font;
  font-size: @mini-text-size;
  margin-top: 0.25rem;
  &:extend(.font-muted);
  cursor: pointer;
  &:hover {
    &:extend(.font-secondary);
  }
}
</style>
