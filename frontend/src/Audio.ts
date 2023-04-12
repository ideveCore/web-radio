import { current_station, open_mini_audio_control, open_audio_control, audio, user_data } from "./stores";
import type { Current_station } from "./Types";
export default class Audio {
  current_station: Current_station
  constructor() {
    this.current_station = {
      codec: '',
      bitrate: 0,
      station_id: '',
      favorite: false,
      language: '',
      favicon: '',
      tags: '',
      state: '',
      home_page: '',
      country_codes: '',
      country: '',
      loading: false,
      name: '',
      paused: true,
      url_resolved: '',
      votes: 0,
    }
  }
  /**
   * init radio
   */
  public init_radio({ radio_station }: any) {
    this.current_station = {
      codec: radio_station.codec,
      bitrate: radio_station.bitrate,
      station_id: radio_station.id,
      favorite: false,
      language: radio_station.language,
      favicon: radio_station.favicon,
      tags: radio_station.tags,
      state: radio_station.state,
      home_page: radio_station.homepage,
      country_codes: radio_station.countrycode,
      country: radio_station.country,
      loading: true,
      name: radio_station.name,
      paused: false,
      url_resolved: radio_station.urlResolved,
      votes: radio_station.votes,
    }

    user_data.subscribe((user) => {
      if (user.favorites.filter((item: any) => item.name === this.current_station.name).length > 0) {
        this.current_station.favorite = true;
      }
    })

    open_audio_control.update(() => true)
    open_mini_audio_control.update(() => false)
    current_station.update(() => this.current_station)
    audio.subscribe((value: HTMLAudioElement) => {
      value.src = this.current_station.url_resolved;
      value.play();
      value.addEventListener('canplaythrough', () => {
        current_station.update((current_station) => ({ ...current_station, loading: false }))
      })
    })
  }

  /**
   * play pause
   */
  public play_pause() {
    audio.subscribe((value: HTMLAudioElement) => {
      value.paused ? value.play() : value.pause()
      current_station.update((current_station) => ({ ...current_station, paused: value.paused }))
    })
  }
}
